"""Tests for scripts/fleet-tenancy-guard.py (COUNCIL-2026-016 blocking gate)."""

import datetime as dt
import importlib.util
import json
import os
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(name):
    path = ROOT / "scripts" / name
    spec = importlib.util.spec_from_file_location(name.replace("-", "_").replace(".py", ""), path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


guard = load("fleet-tenancy-guard.py")
SPEC = json.loads((ROOT / "docs/control-plane/tenancy/fleet-tenancy.json").read_text())


def write(repo, rel, text):
    p = Path(repo) / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text)


def conformant_repo(repo):
    write(repo, ".fleet/tenancy.json", json.dumps({
        "product": "Example",
        "tenant_root_table": "organizations",
        "provisioning_modules": ["src/lib/tenancy/provision.ts"],
        "fleet_api_route": "src/app/api/fleet/tenants/route.ts",
        "signup_route": "src/app/start/page.tsx",
        "conformance_test": {"command": "npm run test:tenancy", "path": "e2e/tenancy.spec.ts"},
        "plan_keys": ["starter", "growth", "pro"],
        "trial_days": 30,
        "reserved_slugs_path": ".fleet/reserved-slugs.json",
    }))
    write(repo, ".fleet/reserved-slugs.json", json.dumps(SPEC["identity"]["reserved_slugs"]))
    write(repo, "src/lib/tenancy/provision.ts",
          "const c = await pool.connect(); await c.query('begin');\n"
          "await supabase.from('organizations').insert({ name });\n")
    write(repo, "src/app/api/fleet/tenants/route.ts", "export async function POST() {}\n")
    write(repo, "src/app/start/page.tsx", "export default function Start() {}\n")
    write(repo, "e2e/tenancy.spec.ts", "const password = 'local-test-only-pw';\n")
    write(repo, ".github/workflows/ci.yml",
          "steps:\n  - run: python3 scripts/fleet-tenancy-guard.py --repo .\n  - run: npm run test:tenancy\n")


def by_id(results):
    return {r.check_id: r for r in results}


class TestFleetTenancyGuard(unittest.TestCase):

    def test_empty_repo_fails_every_check_no_default_pass(self):
        with tempfile.TemporaryDirectory() as repo:
            results = guard.run_guard(repo, SPEC)
            self.assertTrue(results)
            failing = [r.check_id for r in results if not r.passed]
            # G02-G04 can pass vacuously on an empty tree; every contract-driven check must fail.
            for cid in ("G01", "G05", "G06", "G07", "G08", "G09"):
                self.assertIn(cid, failing)

    def test_conformant_repo_passes_all_checks(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            results = guard.run_guard(repo, SPEC)
            self.assertEqual([r.check_id for r in results if not r.passed], [],
                             [r.as_dict() for r in results if not r.passed])

    def test_master_password_literal_fails_in_source_but_regression_tests_may_name_it(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "src/__tests__/auth.test.ts", "expect(login('x', 'Orthos2026!')).toBe(false)\n")
            self.assertTrue(by_id(guard.run_guard(repo, SPEC))["G02"].passed)
            write(repo, "scripts/stress.ts", "await login('x', 'Orthos2026!')\n")
            self.assertFalse(by_id(guard.run_guard(repo, SPEC))["G02"].passed)

    def test_hard_coded_password_in_source_fails(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "scripts/seed-client.mjs", "const DEMO_PW = 'SuperSecret2026!';\n")
            r = by_id(guard.run_guard(repo, SPEC))["G02"]
            self.assertFalse(r.passed)
            self.assertIn("scripts/seed-client.mjs:1", r.findings[0])

    def test_pem_placeholder_is_not_a_key_but_real_key_material_is(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "src/ui/Practice.jsx", "placeholder='-----BEGIN PRIVATE KEY-----\\n...'\n")
            self.assertTrue(by_id(guard.run_guard(repo, SPEC))["G02"].passed)
            write(repo, "src/ui/key.ts", "const k = `-----BEGIN RSA PRIVATE KEY-----\n" + "MIIEow" + "A" * 60 + "`\n")
            self.assertFalse(by_id(guard.run_guard(repo, SPEC))["G02"].passed)

    def test_committed_env_file_fails(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, ".env.local", "X=1\n")
            self.assertFalse(by_id(guard.run_guard(repo, SPEC))["G02"].passed)

    def test_captcha_bypass_token_fails(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "src/app/actions/signup.ts", "if (token === 'mock-token') return true;\n")
            self.assertFalse(by_id(guard.run_guard(repo, SPEC))["G03"].passed)

    def test_pool_level_begin_fails(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "src/modules/repo.ts", "await this.database.query('begin');\n")
            self.assertFalse(by_id(guard.run_guard(repo, SPEC))["G04"].passed)

    def test_tenant_insert_outside_provisioning_module_fails(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "src/app/actions/legacy-signup.ts",
                  "await supabase.from('organizations').insert({ slug });\n")
            r = by_id(guard.run_guard(repo, SPEC))["G05"]
            self.assertFalse(r.passed)
            self.assertIn("legacy-signup.ts", r.findings[0])

    def test_wrong_plan_keys_or_trial_fails(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            c = json.loads((Path(repo) / ".fleet/tenancy.json").read_text())
            c["plan_keys"] = ["free", "standard", "premium"]
            c["trial_days"] = 14
            write(repo, ".fleet/tenancy.json", json.dumps(c))
            r = by_id(guard.run_guard(repo, SPEC))["G08"]
            self.assertFalse(r.passed)
            self.assertEqual(len(r.findings), 2)

    def test_reserved_slug_drift_fails(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, ".fleet/reserved-slugs.json", json.dumps(["www", "api"]))
            self.assertFalse(by_id(guard.run_guard(repo, SPEC))["G09"].passed)

    def test_conformance_test_must_run_in_ci(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, ".github/workflows/ci.yml", "steps:\n  - run: npm test\n")
            r = by_id(guard.run_guard(repo, SPEC))["G07"]
            self.assertFalse(r.passed)
            self.assertEqual(len(r.findings), 2)

    def test_allowlist_requires_reason_and_unexpired_date(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "src/modules/repo.ts", "await this.database.query('begin');\n")
            c = json.loads((Path(repo) / ".fleet/tenancy.json").read_text())
            today = dt.date(2026, 11, 14)
            c["allowlist"] = [{"check": "G04", "path": "src/modules/repo.ts",
                               "reason": "migrating in PR #1", "expires": "2026-11-30"}]
            write(repo, ".fleet/tenancy.json", json.dumps(c))
            self.assertTrue(by_id(guard.run_guard(repo, SPEC, today=today))["G04"].passed)
            # expired exception fails automatically
            later = dt.date(2026, 12, 1)
            self.assertFalse(by_id(guard.run_guard(repo, SPEC, today=later))["G04"].passed)
            # missing reason is ignored
            c["allowlist"][0]["reason"] = ""
            write(repo, ".fleet/tenancy.json", json.dumps(c))
            self.assertFalse(by_id(guard.run_guard(repo, SPEC, today=today))["G04"].passed)

    def test_banned_literal_cannot_be_allowlisted(self):
        with tempfile.TemporaryDirectory() as repo:
            conformant_repo(repo)
            write(repo, "src/auth.ts", "const ok = pw === 'n0l0s@b3';\n")
            c = json.loads((Path(repo) / ".fleet/tenancy.json").read_text())
            c["allowlist"] = [{"check": "G02", "path": "src/auth.ts", "reason": "x", "expires": "2099-01-01"}]
            write(repo, ".fleet/tenancy.json", json.dumps(c))
            self.assertFalse(by_id(guard.run_guard(repo, SPEC))["G02"].passed)


class TestEnforcementEngineNoDefaultPass(unittest.TestCase):

    def test_blocking_requirements_never_default_pass(self):
        engine = load("pull-and-enforce-directives.py")
        with tempfile.TemporaryDirectory() as repo:
            for rid in engine.FLEET_TENANCY_REQ_CHECKS:
                passed, evidence = engine.audit_fleet_tenancy(repo, rid)
                self.assertFalse(passed, rid)
                self.assertIn("NOT VERIFIED", evidence)

    def test_manifest_marks_council_016_blocking_without_self_attestation(self):
        manifest = json.loads((ROOT / "docs/governance-sync/manifest.json").read_text())
        d = next(x for x in manifest["decisions"] if x["id"] == "COUNCIL-2026-016")
        self.assertEqual(d["status"], "RATIFIED")
        self.assertEqual(d["enforcement"], "BLOCKING")
        self.assertFalse(d["self_attestation_accepted"])
        engine = load("pull-and-enforce-directives.py")
        req_ids = {r["req_id"] for r in d["requirements"]}
        self.assertEqual(req_ids, set(engine.FLEET_TENANCY_REQ_CHECKS))
        for r in d["requirements"]:
            self.assertEqual(r["enforcement"], "BLOCKING")
            self.assertEqual(r["priority"], "P0_CRITICAL")


if __name__ == "__main__":
    unittest.main()
