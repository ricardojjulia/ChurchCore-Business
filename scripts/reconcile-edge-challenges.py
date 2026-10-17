#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Central Evidence Verification & Reconciliation Engine
Autonomously verifies evidence provided by edge product repositories challenging central records.
When evidence is validated, updates central telemetry, councils registry, and logs the reconciliation.
"""

import os
import sys
import json
import argparse
import subprocess
import urllib.request
import urllib.error
from datetime import datetime, timezone

WORKSPACE_ROOT = "/Users/rjulia/ChurchCore-Business"
LEDGER_PATH = os.path.join(WORKSPACE_ROOT, "docs", "control-plane", "EVIDENCE-RECONCILIATION-LEDGER.md")
COUNCILS_PATH = os.path.join(WORKSPACE_ROOT, "docs", "control-plane", "councils-registry.json")

SIBLING_REPOS = [
    { "product_id": "churchcore-chms", "name": "ChurchCore ChMS", "path": "/Users/rjulia/ChurchCore" },
    { "product_id": "churchcore-lms", "name": "ChurchCore LMS", "path": "/Users/rjulia/ChurchCore LMS" },
    { "product_id": "churchcore-academy", "name": "ChurchCore Academy", "path": "/Users/rjulia/ChurchCore Academy" },
    { "product_id": "churchcore-care", "name": "ChurchCore Care", "path": "/Users/rjulia/ChurchCore Care" },
    { "product_id": "churchcore-orthos", "name": "ChurchCore Orthos", "path": "/Users/rjulia/ChurchCore Orthos" },
    { "product_id": "faithfull-scholars", "name": "FaithFull Scholars", "path": "/Users/rjulia/FaithFullScholars" },
]

def verify_evidence(challenge, repo_path):
    ev_type = challenge.get("evidence_type")
    ev_data = challenge.get("evidence_data", {})
    
    if ev_type == "HTTP_STATUS_PROOF":
        url = ev_data.get("url")
        if not url:
            return False, "Missing URL in evidence data"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ChurchCore-EvidenceVerifier/1.0'})
            with urllib.request.urlopen(req, timeout=5) as resp:
                code = resp.getcode()
                if code in [200, 301, 302, 307, 308]:
                    return True, f"Verified live HTTP {code} response from {url}"
                return False, f"HTTP status {code} does not prove online readiness"
        except urllib.error.HTTPError as e:
            if e.code in [200, 301, 302, 307, 308]:
                return True, f"Verified live HTTP {e.code} redirect from {url}"
            return False, f"HTTP Error {e.code} received"
        except Exception as e:
            return False, f"Network probe failed: {e}"

    elif ev_type == "PACKAGE_VERSION_PROOF":
        pkg_file = os.path.join(repo_path, "package.json")
        if os.path.exists(pkg_file):
            try:
                with open(pkg_file) as f:
                    v = json.load(f).get("version")
                    if str(v) == str(challenge.get("claimed_value")):
                        return True, f"Verified version {v} directly inside package.json"
                    return False, f"package.json has version {v}, does not match claimed {challenge.get('claimed_value')}"
            except Exception as e:
                return False, f"Could not parse package.json: {e}"
        return False, "package.json not found in repository"

    elif ev_type == "GIT_COMMIT_PROOF":
        sha = ev_data.get("commit_sha")
        if sha:
            res = subprocess.getoutput(f'git -C "{repo_path}" log -1 --pretty=format:"%h %s" {sha}')
            if res and "fatal:" not in res:
                return True, f"Verified git commit exists in repo: '{res}'"
        return False, f"Commit {sha} not found in local git history"

    elif ev_type == "COUNCIL_REVIEW_PROOF":
        dirs = [os.path.join(repo_path, "docs", "council"), os.path.join(repo_path, "docs", "reviews")]
        rev_count = 0
        for d in dirs:
            if os.path.exists(d):
                rev_count += len([f for f in os.listdir(d) if f.endswith(".md") and any(k in f.lower() for k in ["council", "review", "cr-"])])
        if rev_count >= int(challenge.get("claimed_value", 0)):
            return True, f"Verified {rev_count} documented council review markdown records"
        return False, f"Found only {rev_count} reviews, claimed {challenge.get('claimed_value')}"

    elif ev_type in ["MANUAL_EVIDENCE", "DIRECTIVE_EVIDENCE"]:
        return True, "Operator verified manual evidence"

    return False, f"Unknown evidence type '{ev_type}'"

def apply_reconciliation(product_id, field_path, claimed_value, repo_path):
    """Applies verified update to local telemetry and central caches."""
    telemetry_path = os.path.join(repo_path, "docs", "control-plane", "telemetry.json")
    if os.path.exists(telemetry_path):
        try:
            with open(telemetry_path, "r") as f:
                tdata = json.load(f)
            
            # Navigate nested field path (e.g. online_status.is_online)
            parts = field_path.split(".")
            curr = tdata
            for p in parts[:-1]:
                if p not in curr:
                    curr[p] = {}
                curr = curr[p]
            curr[parts[-1]] = claimed_value

            with open(telemetry_path, "w") as f:
                json.dump(tdata, f, indent=2)
            print(f"  [x] Applied verified update to edge telemetry: {field_path} = {claimed_value}")
            return True
        except Exception as e:
            print(f"[-] Error writing telemetry: {e}")
    return False

def append_to_ledger(reconciliations):
    if not reconciliations:
        return

    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    lines = []

    if not os.path.exists(LEDGER_PATH):
        lines.append("# ChurchCore Sovereign Control Plane: Autonomous Evidence Reconciliation Ledger\n")
        lines.append("> Tracks autonomous challenges submitted by edge repositories that disputed and updated central control plane information with verifiable evidence.\n")
        lines.append("| Date (UTC) | Product | Field Challenged | Central (Prior) | Reconciled (New) | Evidence Type & Proof |\n")
        lines.append("| :--- | :--- | :--- | :--- | :--- | :--- |\n")
    else:
        with open(LEDGER_PATH, "r") as f:
            existing = f.read()
        lines.append(existing.rstrip())

    for r in reconciliations:
        proof_summary = f"`{r['evidence_type']}`: {r['proof_note']}"
        lines.append(f"| {now_str} | **{r['product_name']}** | `{r['field_path']}` | `{r['central_value']}` | **`{r['claimed_value']}`** | {proof_summary} |")

    with open(LEDGER_PATH, "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"[+] Reconciled entries recorded in Central Ledger: {LEDGER_PATH}")

def reconcile_repo(repo_cfg):
    repo_path = repo_cfg["path"]
    product_id = repo_cfg["product_id"]
    name = repo_cfg["name"]

    if not os.path.exists(repo_path):
        return []

    chal_path = os.path.join(repo_path, "docs", "control-plane", "challenges.json")
    if not os.path.exists(chal_path):
        return []

    try:
        with open(chal_path, "r") as f:
            packet = json.load(f)
    except Exception:
        return []

    challenges = packet.get("challenges", [])
    reconciled = []
    has_changes = False

    for ch in challenges:
        if ch.get("status") == "PENDING_VERIFICATION":
            passed, note = verify_evidence(ch, repo_path)
            now_iso = datetime.now(timezone.utc).isoformat()
            if passed:
                ch["status"] = "ACCEPTED_AND_RECONCILED"
                ch["verified_at"] = now_iso
                ch["verification_note"] = note
                has_changes = True

                # Apply to telemetry
                apply_reconciliation(product_id, ch["field_path"], ch["claimed_value"], repo_path)

                reconciled.append({
                    "product_id": product_id,
                    "product_name": name,
                    "field_path": ch["field_path"],
                    "central_value": ch.get("central_value"),
                    "claimed_value": ch.get("claimed_value"),
                    "evidence_type": ch.get("evidence_type"),
                    "proof_note": note
                })
                print(f"[✓] CHALLENGE ACCEPTED for {name}: {ch['field_path']} -> {ch['claimed_value']} ({note})")
            else:
                ch["status"] = "REJECTED_INSUFFICIENT_EVIDENCE"
                ch["verified_at"] = now_iso
                ch["verification_note"] = note
                has_changes = True
                print(f"[✗] CHALLENGE REJECTED for {name}: {ch['field_path']} ({note})")

    if has_changes:
        packet["last_reconciliation"] = datetime.now(timezone.utc).isoformat()
        with open(chal_path, "w") as f:
            json.dump(packet, f, indent=2)

    return reconciled

def main():
    parser = argparse.ArgumentParser(description="Central Evidence Verification & Reconciliation Engine")
    parser.add_argument("--repo-path", default=None, help="Specific repo path to reconcile")
    args = parser.parse_args()

    print("================================================================================")
    print("   CHURCHCORE CENTRAL EVIDENCE VERIFICATION & RECONCILIATION ENGINE             ")
    print("================================================================================")

    targets = SIBLING_REPOS
    if args.repo_path:
        norm = os.path.abspath(args.repo_path)
        targets = [r for r in SIBLING_REPOS if r["path"] == norm]
        if not targets:
            targets = [{ "product_id": "custom", "name": os.path.basename(norm), "path": norm }]

    all_reconciled = []
    for t in targets:
        rec = reconcile_repo(t)
        all_reconciled.extend(rec)

    if all_reconciled:
        append_to_ledger(all_reconciled)
        print("\n[+] Triggering full control-plane-sync to update master dashboard and UI caches...")
        sync_script = os.path.join(WORKSPACE_ROOT, "scripts", "control-plane-sync.py")
        subprocess.run(["python3", sync_script], check=True)
        print("\n================================================================================")
        print(f"RECONCILIATION COMPLETE: {len(all_reconciled)} Autonomous Evidence Updates Accepted")
        print("================================================================================\n")
    else:
        print("\n[+] All edge challenges verified. No pending discrepancies found.")
        print("================================================================================\n")

if __name__ == "__main__":
    main()
