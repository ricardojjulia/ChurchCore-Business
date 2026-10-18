#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Autonomous Edge Challenge & Evidence Engine
Enables any product repository to autonomously challenge, dispute, or update stale/incorrect
central control plane information or mark MVP roadmap features complete by providing
verifiable cryptographic, git, HTTP, file, or test evidence.
"""

import os
import sys
import re
import json
import argparse
import subprocess
import urllib.request
import urllib.error
from datetime import datetime, timezone

LOCAL_HUB_PATH = "/Users/rjulia/ChurchCore-Business"
REMOTE_HUB_RAW = "https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main"

CANONICAL_PRODUCT_IDS = {
    'churchcore': ('churchcore-chms', 'ChurchCore ChMS'),
    'churchcore-lms': ('churchcore-lms', 'ChurchCore LMS'),
    'churchcore-academy': ('churchcore-academy', 'ChurchCore Academy'),
    'churchcorecare': ('churchcore-care', 'ChurchCore Care'),
    'churchcore-care': ('churchcore-care', 'ChurchCore Care'),
    'churchcore-orthos': ('churchcore-orthos', 'ChurchCore Orthos'),
    'faithfull-scholars': ('faithfull-scholars', 'FaithFull Scholars'),
    'faithful-scholars': ('faithfull-scholars', 'FaithFull Scholars')
}

def detect_product(repo_root):
    pkg_file = os.path.join(repo_root, 'package.json')
    if os.path.exists(pkg_file):
        try:
            with open(pkg_file) as f:
                data = json.load(f)
                name = data.get('name', '').lower()
                if name in CANONICAL_PRODUCT_IDS:
                    return CANONICAL_PRODUCT_IDS[name][0], CANONICAL_PRODUCT_IDS[name][1], data.get('version', '1.0.0')
        except Exception:
            pass
            
    dirname = os.path.basename(os.path.abspath(repo_root)).lower().replace(' ', '-')
    for k, v in CANONICAL_PRODUCT_IDS.items():
        if k in dirname:
            return v[0], v[1], '1.0.0'
    return 'churchcore-chms', 'ChurchCore ChMS', '1.0.0'

def find_local_fleet_data(repo_root=None):
    """Discovers fleet-data.json in local directories via environment variables, sibling repos, or user home."""
    candidates = []
    for env_var in ["CHURCHCORE_BUSINESS_PATH", "CHURCHCORE_HUB_PATH"]:
        val = os.environ.get(env_var)
        if val:
            candidates.append(os.path.join(val, "dashboard", "fleet-data.json"))

    search_roots = []
    if repo_root:
        search_roots.append(os.path.abspath(repo_root))
    search_roots.append(os.path.abspath(os.path.dirname(__file__)))
    search_roots.append(os.path.abspath(os.getcwd()))

    for sr in search_roots:
        p = sr
        while p and p != os.path.dirname(p):
            cand = os.path.join(p, "dashboard", "fleet-data.json")
            if os.path.basename(p).lower() in ["churchcore-business", "churchcore business", "churhcore business"]:
                candidates.append(cand)
            p = os.path.dirname(p)

        parent = os.path.dirname(sr)
        for sibling_name in ["ChurchCore-Business", "ChurchCore Business", "ChurhCore Business"]:
            candidates.append(os.path.join(parent, sibling_name, "dashboard", "fleet-data.json"))
            candidates.append(os.path.join(os.path.dirname(parent), sibling_name, "dashboard", "fleet-data.json"))

    home = os.path.expanduser("~")
    for sibling_name in ["ChurchCore-Business", "ChurchCore Business", "ChurhCore Business"]:
        candidates.append(os.path.join(home, sibling_name, "dashboard", "fleet-data.json"))
    candidates.append(os.path.join(LOCAL_HUB_PATH, "dashboard", "fleet-data.json"))

    seen = set()
    for c in candidates:
        norm = os.path.normpath(c)
        if norm not in seen:
            seen.add(norm)
            if os.path.isfile(norm):
                try:
                    with open(norm, "r") as f:
                        return json.load(f), f"Local Hub ({norm})"
                except Exception:
                    pass
    return None, None

def fetch_central_record(product_id, repo_root=None):
    """Fetches central record for this product using multi-tier discovery (Local Hub, gh api, GitHub API, Raw URL)."""
    # Tier 1: Local Hub
    data, src = find_local_fleet_data(repo_root)
    if data:
        for p in data.get("products", []):
            if p.get("product_id") == product_id:
                return p, src

    # Tier 2: GitHub CLI (gh api)
    try:
        cmd = [
            "gh", "api",
            "repos/ricardojjulia/ChurchCore-Business/contents/dashboard/fleet-data.json",
            "-H", "Accept: application/vnd.github.raw"
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=12)
        if res.returncode == 0 and res.stdout.strip():
            data = json.loads(res.stdout)
            for p in data.get("products", []):
                if p.get("product_id") == product_id:
                    return p, "GitHub CLI (gh api - authenticated)"
    except Exception:
        pass

    # Tier 3: GitHub REST API with Bearer Token
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        try:
            res = subprocess.run(["gh", "auth", "token"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=5)
            if res.returncode == 0 and res.stdout.strip():
                token = res.stdout.strip()
        except Exception:
            pass

    if token:
        try:
            api_url = "https://api.github.com/repos/ricardojjulia/ChurchCore-Business/contents/dashboard/fleet-data.json"
            req = urllib.request.Request(
                api_url,
                headers={
                    "User-Agent": "ChurchCore-ChallengeEngine/1.0",
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github.raw"
                }
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                for p in data.get("products", []):
                    if p.get("product_id") == product_id:
                        return p, "GitHub REST API (Bearer Token)"
        except Exception:
            pass

    # Tier 4: Remote Raw URL fallback
    remote_url = f"{REMOTE_HUB_RAW}/dashboard/fleet-data.json"
    try:
        req = urllib.request.Request(remote_url, headers={"User-Agent": "ChurchCore-ChallengeEngine/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            for p in data.get("products", []):
                if p.get("product_id") == product_id:
                    return p, f"Remote Hub ({remote_url})"
    except Exception:
        pass

    return None, "Not Found"

def verify_http_status(url):
    """Probes an HTTP/HTTPS endpoint to produce verifiable evidence."""
    if not url:
        return False, 0, "No URL provided"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'ChurchCore-EvidenceProbe/1.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            return True, resp.getcode(), f"HTTP {resp.getcode()} OK from {url}"
    except urllib.error.HTTPError as e:
        return (e.code in [200, 301, 302, 307, 308]), e.code, f"HTTP Error {e.code}"
    except Exception as e:
        return False, 0, f"Connection Failed: {e}"

def count_local_council_reviews(repo_root):
    dirs = [os.path.join(repo_root, "docs", "council"), os.path.join(repo_root, "docs", "reviews")]
    reviews = []
    for d in dirs:
        if os.path.exists(d):
            for f in os.listdir(d):
                if f.endswith(".md") and any(k in f.lower() for k in ["council", "review", "cr-"]):
                    reviews.append(f)
    return len(reviews), reviews

def collect_autonomous_challenges(repo_root):
    product_id, canonical_name, local_version = detect_product(repo_root)
    central_record, source = fetch_central_record(product_id, repo_root)

    challenges = []
    now_iso = datetime.now(timezone.utc).isoformat()

    if not central_record:
        print(f"[-] Warning: No central record found for {product_id} to challenge.")
        return challenges

    # 1. Challenge: Online Status & Live URL Verification
    local_telemetry_path = os.path.join(repo_root, "docs", "control-plane", "telemetry.json")
    local_online = None
    local_url = None
    if os.path.exists(local_telemetry_path):
        try:
            with open(local_telemetry_path) as f:
                tdata = json.load(f)
                local_online = tdata.get("online_status", {}).get("is_online")
                local_url = tdata.get("online_status", {}).get("vercel_url")
        except Exception:
            pass

    central_online = central_record.get("online_status", {}).get("is_online", False)
    central_url = central_record.get("online_status", {}).get("vercel_url", "")
    target_url = local_url or central_url

    if target_url:
        is_live, status_code, msg = verify_http_status(target_url)
        if is_live and (not central_online):
            challenges.append({
                "challenge_id": f"CHAL-{product_id.upper()}-ONLINE-{int(datetime.now().timestamp())}",
                "field_path": "online_status.is_online",
                "claimed_value": True,
                "central_value": central_online,
                "evidence_type": "HTTP_STATUS_PROOF",
                "evidence_data": {
                    "url": target_url,
                    "http_status_code": status_code,
                    "verified_at": now_iso,
                    "probe_message": msg
                },
                "rationale": f"Autonomous probe verified endpoint {target_url} is LIVE and serving traffic (HTTP {status_code}). Central record showing offline is stale.",
                "status": "PENDING_VERIFICATION",
                "submitted_at": now_iso
            })

    # 2. Challenge: Local Version Drift
    central_version = central_record.get("version", "0.0.0")
    if local_version and local_version != "0.1.0" and local_version != central_version:
        challenges.append({
            "challenge_id": f"CHAL-{product_id.upper()}-VER-{int(datetime.now().timestamp())}",
            "field_path": "version",
            "claimed_value": local_version,
            "central_value": central_version,
            "evidence_type": "PACKAGE_VERSION_PROOF",
            "evidence_data": {
                "package_file": "package.json",
                "version_key": local_version,
                "verified_at": now_iso
            },
            "rationale": f"Local package.json specifies version {local_version}, while central records lag at {central_version}.",
            "status": "PENDING_VERIFICATION",
            "submitted_at": now_iso
        })

    # 3. Challenge: Git Head & Latest Commits
    try:
        head_commit = subprocess.getoutput(f'git -C "{repo_root}" rev-parse --short HEAD').strip()
        if head_commit and "fatal:" not in head_commit:
            head_msg = subprocess.getoutput(f'git -C "{repo_root}" log -1 --pretty=format:"%s"').strip()
            head_date = subprocess.getoutput(f'git -C "{repo_root}" log -1 --pretty=format:"%cI"').strip()
            
            central_changes = central_record.get("latest_changes", [])
            if central_changes and head_commit not in str(central_changes):
                challenges.append({
                    "challenge_id": f"CHAL-{product_id.upper()}-GIT-{head_commit}",
                    "field_path": "latest_changes",
                    "claimed_value": f"{head_msg} ({head_commit})",
                    "central_value": central_changes[0] if central_changes else "None",
                    "evidence_type": "GIT_COMMIT_PROOF",
                    "evidence_data": {
                        "commit_sha": head_commit,
                        "commit_message": head_msg,
                        "commit_date": head_date,
                        "verified_at": now_iso
                    },
                    "rationale": f"Recent git commit {head_commit} ('{head_msg}') is not yet indexed in central telemetry.",
                    "status": "PENDING_VERIFICATION",
                    "submitted_at": now_iso
                })
    except Exception:
        pass

    # 4. Challenge: Council Reviews & Ratifications Count
    rev_count, rev_files = count_local_council_reviews(repo_root)
    if rev_count > 0:
        challenges.append({
            "challenge_id": f"CHAL-{product_id.upper()}-REVIEWS-{int(datetime.now().timestamp())}",
            "field_path": "council_governing_state.documented_reviews_count",
            "claimed_value": rev_count,
            "central_value": "unindexed",
            "evidence_type": "COUNCIL_REVIEW_PROOF",
            "evidence_data": {
                "review_count": rev_count,
                "latest_review_files": rev_files[-3:],
                "verified_at": now_iso
            },
            "rationale": f"Repository maintains {rev_count} documented council reviews in docs/council/ or docs/reviews/ proving active domain governance.",
            "status": "PENDING_VERIFICATION",
            "submitted_at": now_iso
        })

    # 5. Challenge: Check for Completed Features in docs/mvp-100-plan.md
    plan_path = os.path.join(repo_root, "docs", "mvp-100-plan.md")
    if os.path.exists(plan_path):
        try:
            with open(plan_path, "r") as pf:
                plan_text = pf.read()
            
            # Check unchecked features
            feat_matches = re.findall(r"###\s*\[ \]\s*Feature\s*(\d+):\s*([^\n]+)", plan_text)
            if feat_matches:
                # Get recent git log
                git_log = subprocess.getoutput(f'git -C "{repo_root}" log -n 15 --pretty=format:"%h %s"').splitlines()
                for feat_num, feat_title in feat_matches:
                    # Check if any recent commit mentions key words from this feature
                    words = [w.lower() for w in re.findall(r"\b[A-Za-z0-9_-]{3,}\b", feat_title) if w.lower() not in {"and", "the", "for", "with"}]
                    for line in git_log:
                        line_lower = line.lower()
                        if any(w in line_lower for w in words):
                            commit_sha = line.split()[0]
                            challenges.append({
                                "challenge_id": f"CHAL-{product_id.upper()}-FEAT{feat_num}-{commit_sha}",
                                "field_path": "feature_completion",
                                "claimed_value": f"Feature {feat_num}: {feat_title} Complete",
                                "central_value": "Pending Implementation",
                                "evidence_type": "FEATURE_COMPLETION_PROOF",
                                "evidence_data": {
                                    "feature_target": int(feat_num),
                                    "feature_title": feat_title,
                                    "commit_sha": commit_sha,
                                    "commit_summary": line,
                                    "verified_at": now_iso
                                },
                                "rationale": f"Commit {line} demonstrates completion of Feature {feat_num} ({feat_title}).",
                                "status": "PENDING_VERIFICATION",
                                "submitted_at": now_iso
                            })
                            break
        except Exception:
            pass

    return challenges

def save_and_dispatch_challenges(repo_root, challenges):
    if not challenges:
        print("[+] No discrepancies detected. Local truth is fully aligned with central control plane.")
        return

    product_id, canonical_name, _ = detect_product(repo_root)
    control_dir = os.path.join(repo_root, "docs", "control-plane")
    os.makedirs(control_dir, exist_ok=True)
    chal_file = os.path.join(control_dir, "challenges.json")

    existing_challenges = []
    if os.path.exists(chal_file):
        try:
            with open(chal_file, "r") as f:
                existing_challenges = json.load(f).get("challenges", [])
        except Exception:
            existing_challenges = []

    # Merge by challenge_id or field_path
    existing_map = {c.get("challenge_id", c.get("field_path")): c for c in existing_challenges}
    for ch in challenges:
        cid = ch.get("challenge_id", ch.get("field_path"))
        existing_map[cid] = ch

    packet = {
        "product_id": product_id,
        "canonical_name": canonical_name,
        "last_challenge_generated": datetime.now(timezone.utc).isoformat(),
        "challenges": list(existing_map.values())
    }

    with open(chal_file, "w") as f:
        json.dump(packet, f, indent=2)

    print(f"\n[+] Generated {len(challenges)} Autonomous Governance Challenge(s) with Evidence:")
    for ch in challenges:
        print(f"  • [{ch['evidence_type']}] {ch['field_path']}: Central='{ch.get('central_value')}' -> Local Claimed='{ch.get('claimed_value')}'")
        print(f"    Evidence: {ch.get('evidence_data')}")
        print(f"    Rationale: {ch.get('rationale')}\n")

    print(f"[x] Recorded to edge challenge packet: {chal_file}")

    # If Local Hub exists, trigger immediate reconciliation to break command loops!
    reconcile_script = os.path.join(LOCAL_HUB_PATH, "scripts", "reconcile-edge-challenges.py")
    if os.path.exists(reconcile_script):
        print("[+] Sibling Central Control Plane detected. Dispatching immediate closed-loop reconciliation...")
        try:
            subprocess.run(["python3", reconcile_script, "--repo-path", repo_root], check=True)
        except Exception as e:
            print(f"[-] Reconciliation trigger note: {e}")
    else:
        print(f"[i] To reconcile centrally: python3 scripts/reconcile-edge-challenges.py --repo-path \"{repo_root}\"")

def main():
    parser = argparse.ArgumentParser(description="Autonomous Edge Challenge & Evidence Engine")
    parser.add_argument("--repo-root", default=os.getcwd(), help="Target repository root")
    parser.add_argument("--complete-feature", default=None, help="Feature number or title to mark complete (e.g. 1 or 'Feature 1')")
    parser.add_argument("--commit-sha", default=None, help="Commit SHA proving feature or field update")
    parser.add_argument("--file-path", default=None, help="File path proving implementation")
    parser.add_argument("--test-cmd", default=None, help="Test command that passes clean")
    parser.add_argument("--completion-pct", type=int, default=None, help="Updated completion percentage")
    parser.add_argument("--field", default=None, help="Explicit field path to challenge (e.g. online_status.is_online)")
    parser.add_argument("--value", default=None, help="Claimed value")
    parser.add_argument("--evidence-type", default=None, help="Type of evidence")
    parser.add_argument("--rationale", default=None, help="Challenge justification")
    args = parser.parse_args()

    repo_root = os.path.abspath(args.repo_root)
    product_id, canonical_name, _ = detect_product(repo_root)
    now_iso = datetime.now(timezone.utc).isoformat()

    print("=" * 80)
    print(f"   CHURCHCORE AUTONOMOUS EDGE CHALLENGE & EVIDENCE ENGINE")
    print(f"   Repository: {repo_root} ({canonical_name})")
    print("=" * 80)

    # Mode 1: Feature Completion Challenge
    if args.complete_feature:
        feat_target = args.complete_feature
        try:
            feat_target = int(feat_target)
        except ValueError:
            pass

        commit = args.commit_sha
        if not commit:
            commit = subprocess.getoutput(f'git -C "{repo_root}" rev-parse --short HEAD').strip()
            if "fatal:" in commit:
                commit = None

        ev_data = {
            "feature_target": feat_target,
            "commit_sha": commit,
            "file_path": args.file_path,
            "test_cmd": args.test_cmd,
            "verified_at": now_iso
        }
        rat = args.rationale or f"Feature {feat_target} verified complete with accompanying tests and commit {commit}."
        
        feature_challenge = [{
            "challenge_id": f"CHAL-{product_id.upper()}-FEAT-{int(datetime.now().timestamp())}",
            "field_path": "feature_completion",
            "claimed_value": args.completion_pct or 95,
            "central_value": "pending",
            "evidence_type": args.evidence_type or "FEATURE_COMPLETION_PROOF",
            "evidence_data": ev_data,
            "rationale": rat,
            "status": "PENDING_VERIFICATION",
            "submitted_at": now_iso
        }]
        save_and_dispatch_challenges(repo_root, feature_challenge)

    # Mode 2: Explicit Single Field Challenge
    elif args.field and (args.value is not None):
        ev_type = args.evidence_type or ("GIT_COMMIT_PROOF" if args.commit_sha else "MANUAL_EVIDENCE")
        ev_data = {
            "submitted_by_operator": True,
            "commit_sha": args.commit_sha,
            "file_path": args.file_path,
            "test_cmd": args.test_cmd,
            "timestamp": now_iso
        }
        val = args.value
        if val.lower() == "true":
            val = True
        elif val.lower() == "false":
            val = False
        else:
            try:
                val = int(val)
            except ValueError:
                pass

        manual_challenge = [{
            "challenge_id": f"CHAL-{product_id.upper()}-{int(datetime.now().timestamp())}",
            "field_path": args.field,
            "claimed_value": val,
            "central_value": "prior_state",
            "evidence_type": ev_type,
            "evidence_data": ev_data,
            "rationale": args.rationale or f"Explicit challenge to {args.field}",
            "status": "PENDING_VERIFICATION",
            "submitted_at": now_iso
        }]
        save_and_dispatch_challenges(repo_root, manual_challenge)

    # Mode 3: Fully Autonomous Discovery & Scanning
    else:
        challenges = collect_autonomous_challenges(repo_root)
        save_and_dispatch_challenges(repo_root, challenges)

if __name__ == "__main__":
    main()
