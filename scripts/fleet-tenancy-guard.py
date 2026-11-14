#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Fleet Tenancy Guard (COUNCIL-2026-016)
--------------------------------------------------------------------------
Blocking static conformance gate for the Fleet Tenant Provisioning, Self-Serve
Signup & Subscription Standard (DIR-2026-TENANCY-001).

Unlike the legacy directive audits, this guard has NO default-pass path:
every check either proves compliance from the repository contents or fails.
A missing `.fleet/tenancy.json` contract fails every check.

Usage:
    python3 scripts/fleet-tenancy-guard.py --repo /path/to/product-repo
    python3 scripts/fleet-tenancy-guard.py --repo . --json
    python3 scripts/fleet-tenancy-guard.py --fleet          # all local sibling repos

Exit code: 0 only if every check passes; 1 otherwise.
"""

import argparse
import datetime as _dt
import fnmatch
import json
import os
import re
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
CANONICAL_SPEC_CANDIDATES = [
    os.path.join(ROOT_DIR, "docs", "control-plane", "tenancy", "fleet-tenancy.json"),
    os.path.join(ROOT_DIR, ".fleet", "fleet-tenancy.json"),  # vendored copy in product repos
]
GUARD_VERSION = "1.0.1"
DIRECTIVE_ID = "COUNCIL-2026-016"

LOCAL_FLEET = {
    "ChurchCore": os.path.expanduser("~/ChurchCore"),
    "ChurchCore-LMS": os.path.expanduser("~/ChurchCore LMS"),
    "ChurchCore-Academy": os.path.expanduser("~/ChurchCore Academy"),
    "ChurchCoreCare": os.path.expanduser("~/ChurchCore Care"),
    "ChurchCore-Orthos": os.path.expanduser("~/ChurchCore Orthos"),
    "FaithFullScholars": os.path.expanduser("~/FaithFullScholars"),
}

SKIP_DIRS = {
    "node_modules", ".git", ".next", "dist", "build", "coverage", ".vercel",
    ".turbo", "__pycache__", ".venv", "venv", "playwright-report", "test-results",
    ".next-e2e", ".claude", ".worktrees",
}
SOURCE_EXTS = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".sql"}
TEST_PATTERNS = [
    "*__tests__*", "*.test.*", "*.spec.*", "*/tests/*", "tests/*", "*/test/*",
    "e2e/*", "*/e2e/*", "*fixtures*", "*/mocks/*", "vitest.setup.*", "playwright.config.*",
]

# Credentials that must never appear anywhere in source, including tests.
BANNED_LITERALS = [
    "n0l0s@b3", "n010s@b3", "n0l0sb3", "n010sb3",
    "Orthos2026!", "Password123!", "ChurchCoreDemo2026!", "ChangeMe!Dev2024#",
    "churchcore-sovereign-2026", "churchcore-sovereign-control-plane-default-hmac-key",
]
SECRET_PATTERNS = [
    ("stripe-live-key", re.compile(r"\b(sk|rk)_live_[0-9A-Za-z]{10,}")),
    ("stripe-webhook-secret", re.compile(r"\bwhsec_[0-9A-Za-z]{16,}")),
    ("openrouter-key", re.compile(r"\bsk-or-v1-[0-9a-f]{20,}")),
    ("anthropic-key", re.compile(r"\bsk-ant-[0-9A-Za-z_\-]{20,}")),
    ("github-token", re.compile(r"\b(ghp_[0-9A-Za-z]{30,}|github_pat_[0-9A-Za-z_]{30,})")),
    ("sendgrid-key", re.compile(r"\bSG\.[0-9A-Za-z_\-]{16,}\.[0-9A-Za-z_\-]{16,}")),
    # A real key has base64 key material after the header (literal or escaped newline);
    # bare PEM headers in UI placeholders and crypto libraries are not keys.
    ("private-key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----(?:\s|\\n|\\r)*[A-Za-z0-9+/=]{40,}")),
    ("db-url-with-password", re.compile(r"postgres(?:ql)?://[^:\s/'\"]+:(?!\$\{|<|password@|postgres@)[^@\s'\"]{6,}@(?!localhost|127\.0\.0\.1|db:|postgres:)")),
]
# Hard-coded password assignment in non-test source.
PASSWORD_ASSIGN = re.compile(
    r"""(?ix)\b(password|passwd|pwd|demo_pw|default_password)\b\s*[:=]\s*['"`]([^'"`\s]{6,})['"`]"""
)
PASSWORD_ASSIGN_OK_VALUES = re.compile(r"^(\*+|x+|changeme|password|<.*>|\$\{.*\}|process\.env.*)$", re.I)
CAPTCHA_BYPASS = re.compile(r"""['"`](mock-token|test-token|bypass-captcha|XXXX\.DUMMY\.TOKEN)['"`]""")
POOL_BEGIN = re.compile(r"""\.query\(\s*['"`]\s*(begin|start\s+transaction)\b""", re.I)


TEMPLATE_ENV_SUFFIXES = (".example", ".sample", ".template")
COMPILED_PATTERNS = ["*/public/assets/*", "public/assets/*", "*.min.js", "*/vendor/*", "*.bundle.js"]
I18N_PATTERNS = ["*i18n*", "*/locales/*", "locales/*", "*/messages/*.json", "*translations*"]


def _is_test_path(rel):
    rel = rel.replace(os.sep, "/")
    return any(fnmatch.fnmatch(rel, p) for p in TEST_PATTERNS)


def _is_compiled_asset(rel):
    return any(fnmatch.fnmatch(rel, p) for p in COMPILED_PATTERNS)


def _is_i18n_path(rel):
    # UI label catalogs ("password": "Contraseña") are not credentials.
    return any(fnmatch.fnmatch(rel, p) for p in I18N_PATTERNS)


def _git_tracked_files(repo):
    """Tracked files only (what CI checks out). None if `repo` is not a git work tree."""
    if not os.path.exists(os.path.join(repo, ".git")):
        return None
    try:
        out = subprocess.run(["git", "-C", repo, "ls-files", "-z"], capture_output=True, check=True)
    except (OSError, subprocess.CalledProcessError):
        return None
    return [p for p in out.stdout.decode("utf-8", "ignore").split("\0") if p]


def _iter_source_files(repo):
    tracked = _git_tracked_files(repo)
    if tracked is not None:
        for rel in tracked:
            parts = rel.split("/")
            if any(p in SKIP_DIRS for p in parts[:-1]):
                continue
            fn = parts[-1]
            if os.path.splitext(fn)[1] in SOURCE_EXTS or fn.startswith(".env"):
                full = os.path.join(repo, rel)
                if os.path.isfile(full):
                    yield full, rel
        return
    for dirpath, dirnames, filenames in os.walk(repo):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".worktree")]
        for fn in filenames:
            ext = os.path.splitext(fn)[1]
            if ext in SOURCE_EXTS or fn.startswith(".env"):
                full = os.path.join(dirpath, fn)
                rel = os.path.relpath(full, repo).replace(os.sep, "/")
                yield full, rel


def _read(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except OSError:
        return ""


def load_canonical_spec(path=None):
    candidates = [path] if path else CANONICAL_SPEC_CANDIDATES
    for p in candidates:
        if p and os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)
    raise FileNotFoundError("Canonical fleet-tenancy.json not found (looked in: %s)" % candidates)


class Result:
    def __init__(self, check_id, title, req_id):
        self.check_id, self.title, self.req_id = check_id, title, req_id
        self.passed = False
        self.findings = []

    def fail(self, msg):
        self.findings.append(msg)

    def as_dict(self):
        return {"check_id": self.check_id, "req_id": self.req_id, "title": self.title,
                "passed": self.passed, "findings": self.findings}


def _allowlisted(contract, check_id, rel, today):
    for entry in contract.get("allowlist", []) or []:
        if entry.get("check") != check_id:
            continue
        if not fnmatch.fnmatch(rel, entry.get("path", "")):
            continue
        if not entry.get("reason") or not entry.get("expires"):
            continue
        try:
            if _dt.date.fromisoformat(entry["expires"]) < today:
                continue
        except ValueError:
            continue
        return True
    return False


def run_guard(repo, spec=None, today=None):
    repo = os.path.abspath(repo)
    today = today or _dt.date.today()
    spec = spec or load_canonical_spec()
    results = []

    # ---- G01 contract ------------------------------------------------------
    g01 = Result("G01", "Tenancy contract `.fleet/tenancy.json` present and valid", "REQ-016-10")
    contract_path = os.path.join(repo, ".fleet", "tenancy.json")
    contract = None
    if not os.path.exists(contract_path):
        g01.fail("missing .fleet/tenancy.json")
    else:
        try:
            contract = json.loads(_read(contract_path))
        except json.JSONDecodeError as e:
            g01.fail(f".fleet/tenancy.json is not valid JSON: {e}")
    required_keys = ["product", "tenant_root_table", "provisioning_modules", "fleet_api_route",
                     "signup_route", "conformance_test", "plan_keys", "trial_days",
                     "reserved_slugs_path"]
    if contract is not None:
        for k in required_keys:
            if k not in contract:
                g01.fail(f"contract missing key `{k}`")
        ct = contract.get("conformance_test") or {}
        if not ct.get("command") or not ct.get("path"):
            g01.fail("conformance_test requires `command` and `path`")
    g01.passed = not g01.findings
    results.append(g01)
    contract = contract or {}

    files = list(_iter_source_files(repo))

    # ---- G02 credentials ---------------------------------------------------
    g02 = Result("G02", "No hard-coded credentials, backdoor passwords or live secrets", "REQ-016-11")
    for full, rel in files:
        text = _read(full)
        if not text:
            continue
        name = os.path.basename(rel)
        if name.startswith(".env") and not name.endswith(TEMPLATE_ENV_SUFFIXES):
            g02.fail(f"{rel}: committed env file")
            continue
        # Banned literals may appear only in tests (regression tests must assert that the
        # old backdoors are rejected). Anywhere else they fail and cannot be allowlisted.
        if not _is_test_path(rel):
            for lit in BANNED_LITERALS:
                if lit.lower() in text.lower():
                    g02.fail(f"{rel}: banned credential literal `{lit[:3]}…`")
        compiled = _is_compiled_asset(rel)
        for label, rx in SECRET_PATTERNS:
            if rx.search(text) and not _allowlisted(contract, "G02", rel, today):
                g02.fail(f"{rel}: possible {label}")
        if not _is_test_path(rel) and not rel.endswith(".sql") and not compiled and not _is_i18n_path(rel):
            for m in PASSWORD_ASSIGN.finditer(text):
                if PASSWORD_ASSIGN_OK_VALUES.match(m.group(2)):
                    continue
                if _allowlisted(contract, "G02", rel, today):
                    continue
                line = text.count("\n", 0, m.start()) + 1
                g02.fail(f"{rel}:{line}: hard-coded password assignment")
    g02.passed = not g02.findings
    results.append(g02)

    # ---- G03 captcha / auth bypass tokens ---------------------------------
    g03 = Result("G03", "No CAPTCHA/auth bypass tokens in production source", "REQ-016-04")
    for full, rel in files:
        if _is_test_path(rel):
            continue
        text = _read(full)
        for m in CAPTCHA_BYPASS.finditer(text):
            if _allowlisted(contract, "G03", rel, today):
                continue
            line = text.count("\n", 0, m.start()) + 1
            g03.fail(f"{rel}:{line}: bypass token {m.group(1)!r}")
    g03.passed = not g03.findings
    results.append(g03)

    # ---- G04 atomic provisioning ------------------------------------------
    g04 = Result("G04", "No pool-level BEGIN/COMMIT (transactions must hold one client)", "REQ-016-03")
    for full, rel in files:
        if _is_test_path(rel) or rel.endswith(".sql"):
            continue
        text = _read(full)
        if POOL_BEGIN.search(text) and ".connect(" not in text:
            if not _allowlisted(contract, "G04", rel, today):
                g04.fail(f"{rel}: BEGIN issued via .query() with no dedicated client (.connect())")
    g04.passed = not g04.findings
    results.append(g04)

    # ---- G05 single provisioning entry point -------------------------------
    g05 = Result("G05", "Tenant root rows are created only by the declared provisioning modules", "REQ-016-03")
    table = contract.get("tenant_root_table")
    prov = contract.get("provisioning_modules") or []
    if not table:
        g05.fail("contract does not declare tenant_root_table")
    else:
        t = re.escape(table)
        writers = [
            re.compile(rf"""\binsert\s+into\s+(public\.)?["`]?{t}["`]?\b""", re.I),
            re.compile(rf"""\.from\(\s*['"`]{t}['"`]\s*\)\s*\.\s*(insert|upsert)\(""", re.I),
        ]
        for full, rel in files:
            if _is_test_path(rel) or "/migrations/" in rel or rel.startswith("supabase/migrations"):
                continue
            if any(fnmatch.fnmatch(rel, p) for p in prov):
                continue
            text = _read(full)
            if any(w.search(text) for w in writers):
                if not _allowlisted(contract, "G05", rel, today):
                    g05.fail(f"{rel}: writes `{table}` outside provisioning_modules")
    g05.passed = not g05.findings
    results.append(g05)

    # ---- G06 fleet API + signup route --------------------------------------
    g06 = Result("G06", "Control-plane `POST /api/fleet/tenants` and standard self-serve signup route exist", "REQ-016-04")
    for key in ("fleet_api_route", "signup_route"):
        p = contract.get(key)
        if not p:
            g06.fail(f"contract missing {key}")
        elif not os.path.exists(os.path.join(repo, p)):
            g06.fail(f"{key} `{p}` does not exist")
    g06.passed = not g06.findings
    results.append(g06)

    # ---- G07 conformance test wired into CI --------------------------------
    g07 = Result("G07", "Tenancy conformance test exists and runs in CI", "REQ-016-10")
    ct = contract.get("conformance_test") or {}
    if not ct.get("path") or not os.path.exists(os.path.join(repo, ct["path"])):
        g07.fail(f"conformance test file `{ct.get('path')}` not found")
    wf_dir = os.path.join(repo, ".github", "workflows")
    wf_text = ""
    if os.path.isdir(wf_dir):
        for fn in os.listdir(wf_dir):
            if fn.endswith((".yml", ".yaml")):
                wf_text += _read(os.path.join(wf_dir, fn))
    if not ct.get("command") or ct["command"] not in wf_text:
        g07.fail("conformance_test.command is not invoked by any .github/workflows file")
    if "fleet-tenancy-guard.py" not in wf_text:
        g07.fail("fleet-tenancy-guard.py is not run by any .github/workflows file")
    g07.passed = not g07.findings
    results.append(g07)

    # ---- G08 plan vocabulary & trial ---------------------------------------
    g08 = Result("G08", "Fleet plan vocabulary and 30-day full-feature trial", "REQ-016-06")
    fleet_keys = sorted(t["key"] for t in spec.get("subscription", {}).get("tiers", []))
    repo_keys = sorted(contract.get("plan_keys") or [])
    if fleet_keys != repo_keys:
        g08.fail(f"plan_keys {repo_keys} != fleet tiers {fleet_keys}")
    trial_days = spec.get("subscription", {}).get("trial", {}).get("days")
    if contract.get("trial_days") != trial_days:
        g08.fail(f"trial_days {contract.get('trial_days')} != fleet {trial_days}")
    g08.passed = not g08.findings
    results.append(g08)

    # ---- G09 reserved slugs vendored & in sync -----------------------------
    g09 = Result("G09", "Reserved-slug list vendored and identical to the control plane", "REQ-016-01")
    rp = contract.get("reserved_slugs_path")
    canonical = sorted(spec.get("identity", {}).get("reserved_slugs", []))
    if not rp or not os.path.exists(os.path.join(repo, rp)):
        g09.fail(f"reserved_slugs_path `{rp}` not found")
    else:
        try:
            vendored = json.loads(_read(os.path.join(repo, rp)))
            vendored = sorted(vendored if isinstance(vendored, list) else vendored.get("reserved_slugs", []))
            if vendored != canonical:
                missing = sorted(set(canonical) - set(vendored))
                g09.fail(f"vendored reserved slugs differ from control plane (missing: {missing[:10]})")
        except json.JSONDecodeError:
            g09.fail(f"{rp} is not valid JSON")
    g09.passed = not g09.findings
    results.append(g09)

    return results


def summarize(repo, results):
    passed = sum(1 for r in results if r.passed)
    return {
        "directive": DIRECTIVE_ID,
        "guard_version": GUARD_VERSION,
        "repo": repo,
        "checked_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        "passed": passed == len(results),
        "score": f"{passed}/{len(results)}",
        "checks": [r.as_dict() for r in results],
    }


def print_report(summary):
    print("=" * 78)
    print(f"  FLEET TENANCY GUARD {GUARD_VERSION} ({DIRECTIVE_ID}) :: {summary['repo']}")
    print("=" * 78)
    for c in summary["checks"]:
        mark = "PASS" if c["passed"] else "FAIL"
        print(f"[{mark}] {c['check_id']} {c['req_id']}  {c['title']}")
        for f in c["findings"][:25]:
            print(f"        - {f}")
        if len(c["findings"]) > 25:
            print(f"        … {len(c['findings']) - 25} more")
    verdict = "CONFORMANT" if summary["passed"] else "NON-CONFORMANT (blocking)"
    print(f"\nResult: {summary['score']} checks passed :: {verdict}")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", help="path to a product repository")
    ap.add_argument("--fleet", action="store_true", help="run against all local sibling fleet repos")
    ap.add_argument("--spec", help="path to canonical fleet-tenancy.json")
    ap.add_argument("--json", action="store_true", help="emit JSON")
    args = ap.parse_args(argv)

    spec = load_canonical_spec(args.spec)
    targets = []
    if args.fleet:
        targets = [(name, path) for name, path in LOCAL_FLEET.items() if os.path.isdir(path)]
    elif args.repo:
        targets = [(os.path.basename(os.path.abspath(args.repo)), args.repo)]
    else:
        ap.error("pass --repo PATH or --fleet")

    summaries = []
    for name, path in targets:
        s = summarize(path, run_guard(path, spec))
        s["product"] = name
        summaries.append(s)
        if not args.json:
            print_report(s)
    if args.json:
        print(json.dumps(summaries if args.fleet else summaries[0], indent=2))
    return 0 if all(s["passed"] for s in summaries) else 1


if __name__ == "__main__":
    sys.exit(main())
