#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Autonomous Edge Challenge & Evidence Engine
Enables any product repository to autonomously challenge, dispute, or update stale/incorrect
central control plane information by providing cryptographic, git, HTTP, or migration evidence.
"""

import os
import sys
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

def fetch_central_record(product_id):
    """Fetches central record for this product from local hub or remote raw endpoint."""
    local_path = os.path.join(LOCAL_HUB_PATH, "dashboard", "fleet-data.json")
    if os.path.exists(local_path):
        try:
            with open(local_path, "r") as f:
                data = json.load(f)
                for p in data.get("products", []):
                    if p.get("product_id") == product_id:
                        return p, f"Local Hub ({local_path})"
        except Exception:
            pass

    # Remote fallback
    remote_url = f"{REMOTE_HUB_RAW}/dashboard/fleet-data.json"
    try:
        req = urllib.request.Request(remote_url, headers={'User-Agent': 'ChurchCore-ChallengeEngine'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
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

def count_local_migrations(repo_root):
    mig_dir = os.path.join(repo_root, "supabase", "migrations")
    if os.path.exists(mig_dir):
        files = [f for f in os.listdir(mig_dir) if f.endswith(".sql")]
        return len(files), sorted(files)
    return 0, []

def collect_autonomous_challenges(repo_root):
    product_id, canonical_name, local_version = detect_product(repo_root)
    central_record, source = fetch_central_record(product_id)

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
        # Check if central acknowledges these reviews
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
    existing_map = {c["field_path"]: c for c in existing_challenges}
    for ch in challenges:
        existing_map[ch["field_path"]] = ch

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
        print(f"  • [{ch['evidence_type']}] {ch['field_path']}: Central='{ch['central_value']}' -> Local Claimed='{ch['claimed_value']}'")
        print(f"    Evidence: {ch['evidence_data']}")
        print(f"    Rationale: {ch['rationale']}\n")

    print(f"[x] Recorded to edge challenge packet: {chal_file}")

    # If Local Hub exists, trigger immediate reconciliation!
    reconcile_script = os.path.join(LOCAL_HUB_PATH, "scripts", "reconcile-edge-challenges.py")
    if os.path.exists(reconcile_script):
        print("[+] Sibling Central Control Plane detected. Dispatching autonomous reconciliation...")
        try:
            subprocess.run(["python3", reconcile_script, "--repo-path", repo_root], check=True)
        except Exception as e:
            print(f"[-] Reconciliation trigger note: {e}")

def main():
    parser = argparse.ArgumentParser(description="Autonomous Edge Challenge & Evidence Engine")
    parser.add_argument("--repo-root", default=os.getcwd(), help="Target repository root")
    parser.add_argument("--field", default=None, help="Explicit field path to challenge (e.g. online_status.is_online)")
    parser.add_argument("--value", default=None, help="Claimed value")
    parser.add_argument("--evidence-type", default="MANUAL_EVIDENCE", help="Type of evidence")
    parser.add_argument("--rationale", default="Edge repository operator update", help="Challenge justification")
    args = parser.parse_args()

    repo_root = os.path.abspath(args.repo_root)
    print("=" * 80)
    print(f"   CHURCHCORE AUTONOMOUS EDGE CHALLENGE & EVIDENCE ENGINE")
    print(f"   Repository: {repo_root}")
    print("=" * 80)

    if args.field and args.value:
        # Manual single challenge submission
        product_id, canonical_name, _ = detect_product(repo_root)
        now_iso = datetime.now(timezone.utc).isoformat()
        manual_challenge = [{
            "challenge_id": f"CHAL-{product_id.upper()}-MANUAL-{int(datetime.now().timestamp())}",
            "field_path": args.field,
            "claimed_value": args.value,
            "central_value": "prior_state",
            "evidence_type": args.evidence_type,
            "evidence_data": {"submitted_by_operator": True, "timestamp": now_iso},
            "rationale": args.rationale,
            "status": "PENDING_VERIFICATION",
            "submitted_at": now_iso
        }]
        save_and_dispatch_challenges(repo_root, manual_challenge)
    else:
        # Fully autonomous discovery & evidence collection
        challenges = collect_autonomous_challenges(repo_root)
        save_and_dispatch_challenges(repo_root, challenges)

if __name__ == "__main__":
    main()
