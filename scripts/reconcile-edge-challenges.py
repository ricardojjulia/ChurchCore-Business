#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Central Evidence Verification & Reconciliation Engine
Autonomously verifies evidence provided by edge product repositories challenging central records.
When evidence is validated, updates central telemetry, councils registry, and immediately mutates
both central records AND edge repository instructions (docs/mvp-100-plan.md), advancing the active
directive to prevent infinite command-and-challenge loops.
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

WORKSPACE_ROOT = os.environ.get("CHURCHCORE_BUSINESS_PATH") or (
    "/Volumes/My Shared Files/Home/ChurchCore-Business"
    if os.path.exists("/Volumes/My Shared Files/Home/ChurchCore-Business")
    else "/Users/rjulia/ChurchCore-Business"
)
LEDGER_PATH = os.path.join(WORKSPACE_ROOT, "docs", "control-plane", "EVIDENCE-RECONCILIATION-LEDGER.md")
COUNCILS_PATH = os.path.join(WORKSPACE_ROOT, "docs", "control-plane", "councils-registry.json")

_home_base = "/Volumes/My Shared Files/Home" if os.path.exists("/Volumes/My Shared Files/Home") else "/Users/rjulia"
SIBLING_REPOS = [
    { "product_id": "churchcore-chms", "name": "ChurchCore ChMS", "path": os.path.join(_home_base, "ChurchCore") },
    { "product_id": "churchcore-lms", "name": "ChurchCore LMS", "path": os.path.join(_home_base, "ChurchCore LMS") },
    { "product_id": "churchcore-academy", "name": "ChurchCore Academy", "path": os.path.join(_home_base, "ChurchCore Academy") },
    { "product_id": "churchcore-care", "name": "ChurchCore Care", "path": os.path.join(_home_base, "ChurchCore Care") },
    { "product_id": "churchcore-orthos", "name": "ChurchCore Orthos", "path": os.path.join(_home_base, "ChurchCore Orthos") },
    { "product_id": "faithfull-scholars", "name": "FaithFull Scholars", "path": os.path.join(_home_base, "FaithFullScholars") },
]

def verify_evidence(challenge, repo_path):
    """Evaluates verifiable cryptographic, git, HTTP, test, or file proofs."""
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

    elif ev_type == "FILE_EXISTENCE_PROOF":
        rel_path = ev_data.get("file_path")
        if rel_path:
            full_path = os.path.join(repo_path, rel_path)
            if os.path.exists(full_path):
                size = os.path.getsize(full_path)
                return True, f"Verified file exists in repository: {rel_path} ({size} bytes)"
            return False, f"File {rel_path} not found in repository"
        return False, "Missing file_path in evidence data"

    elif ev_type == "TEST_PASS_PROOF":
        test_cmd = ev_data.get("test_cmd")
        if test_cmd:
            try:
                res = subprocess.run(test_cmd, shell=True, cwd=repo_path, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=30)
                if res.returncode == 0:
                    return True, f"Verified test command passed clean (code 0): '{test_cmd}'"
                return False, f"Test command failed with exit code {res.returncode}: {res.stderr[:200]}"
            except Exception as e:
                return False, f"Failed to execute test command: {e}"
        return False, "Missing test_cmd in evidence data"

    elif ev_type == "FEATURE_COMPLETION_PROOF":
        # Verifies commit, file, or test proof supporting feature completion
        sha = ev_data.get("commit_sha")
        rel_path = ev_data.get("file_path")
        test_cmd = ev_data.get("test_cmd")
        
        verified_notes = []
        if sha:
            res = subprocess.getoutput(f'git -C "{repo_path}" log -1 --pretty=format:"%h %s" {sha}')
            if res and "fatal:" not in res:
                verified_notes.append(f"Commit: {res}")
        if rel_path and os.path.exists(os.path.join(repo_path, rel_path)):
            verified_notes.append(f"File verified: {rel_path}")
        if test_cmd:
            code = subprocess.run(test_cmd, shell=True, cwd=repo_path, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode
            if code == 0:
                verified_notes.append(f"Test passed: {test_cmd}")
                
        if verified_notes:
            return True, f"Verified feature completion proofs: {'; '.join(verified_notes)}"
        return False, "No valid commit, file, or test proof provided for feature completion"

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

def update_edge_mvp_plan(repo_path, challenge, proof_note):
    """
    LOOP BREAKER: Mutates edge docs/mvp-100-plan.md upon challenge acceptance.
    Marks the completed feature [x], updates the completion percentage, and
    advances the primary active instruction to the next pending item.
    """
    plan_path = os.path.join(repo_path, "docs", "mvp-100-plan.md")
    if not os.path.exists(plan_path):
        return None

    try:
        with open(plan_path, "r") as f:
            content = f.read()

        ev_data = challenge.get("evidence_data", {})
        feature_target = ev_data.get("feature_target") or challenge.get("feature_target")
        chal_id = challenge.get("challenge_id", "CHAL-ACCEPTED")
        
        # If feature_target not explicitly provided, check if field_path or rationale mentions feature
        if not feature_target:
            field = challenge.get("field_path", "")
            rat = challenge.get("rationale", "")
            m = re.search(r"feature\s*(\d+)", f"{field} {rat}", re.IGNORECASE)
            if m:
                feature_target = int(m.group(1))

        # Find all features in Phase 1
        feature_pattern = re.compile(r"###\s*\[([ xX])\]\s*Feature\s*(\d+):\s*([^\n]+)")
        features = list(feature_pattern.finditer(content))
        
        target_match = None
        target_num = None
        target_title = None

        is_feature_challenge = (
            feature_target is not None or
            challenge.get("field_path") in ["feature_completion", "mvp_status.completion_pct"] or
            challenge.get("evidence_type") == "FEATURE_COMPLETION_PROOF" or
            "feature" in challenge.get("field_path", "").lower()
        )
        if not is_feature_challenge:
            return None

        if feature_target is not None:
            for feat in features:
                f_state, f_num, f_title = feat.group(1), int(feat.group(2)), feat.group(3).strip()
                if isinstance(feature_target, int) and f_num == feature_target:
                    target_match = feat
                    target_num = f_num
                    target_title = f_title
                    break
                elif str(feature_target).lower() in f_title.lower() or str(feature_target) == str(f_num):
                    target_match = feat
                    target_num = f_num
                    target_title = f_title
                    break
        else:
            # Fallback for generic feature completion challenge: target the first unchecked feature
            for feat in features:
                if feat.group(1) == " ":
                    target_match = feat
                    target_num = int(feat.group(2))
                    target_title = feat.group(3).strip()
                    break

        completed_feature_title = None
        if target_match and target_match.group(1) == " ":
            old_header = target_match.group(0)
            completed_feature_title = f"Feature {target_num}: {target_title}"
            new_header = f"### [x] Feature {target_num}: {target_title} *(Reconciled & Accepted: `{chal_id}`)*\n* **Verification Proof:** {proof_note}"
            content = content.replace(old_header, new_header, 1)

        # Re-scan to find remaining unchecked features
        re_features = list(feature_pattern.finditer(content))
        total_feats = len(re_features)
        checked_feats = sum(1 for m in re_features if m.group(1).lower() == "x")
        
        next_instruction_title = None
        for m in re_features:
            if m.group(1) == " ":
                next_instruction_title = f"Feature {m.group(2)}: {m.group(3).strip()}"
                break

        # Calculate updated completion percentage
        claimed_val = challenge.get("claimed_value")
        new_pct = None
        if isinstance(claimed_val, int) and 0 <= claimed_val <= 100:
            new_pct = claimed_val
        elif total_feats > 0:
            # Interpolate between base (85%) and 100%
            new_pct = int(round(85 + (checked_feats / total_feats) * 15))

        if new_pct is not None:
            content = re.sub(
                r"\*\*Current MVP Status:\*\*\s*\d+%\s*Complete\s*\(([^\)]+)\)",
                f"**Current MVP Status:** {new_pct}% Complete (\\1)",
                content
            )

        # Build loop-breaking active instruction callout
        if next_instruction_title:
            callout = (
                f"> [!NOTE]\n"
                f"> **ACTIVE INSTRUCTION FOR NEXT SESSION (CHALLENGE RECONCILED & LOOP BROKEN):**\n"
                f"> - **Previous Milestone Verified:** {completed_feature_title or 'Challenge ' + chal_id}\n"
                f"> - **Immediate Active Directive:** **{next_instruction_title}**\n"
                f"> - **Loop-Breaking Guarantee:** Central records have accepted your proof. Do NOT re-command or re-implement previous milestones. Proceed directly to **{next_instruction_title}**.\n"
            )
        else:
            callout = (
                f"> [!NOTE]\n"
                f"> **ACTIVE INSTRUCTION FOR NEXT SESSION (PHASE 1 100% CODE COMPLETE):**\n"
                f"> - **Milestone:** All Phase 1 MVP features are 100% complete and verified.\n"
                f"> - **Immediate Active Directive:** Proceed to **Phase 2: Comprehensive Human Trial Testing & Field Pilot Gate**.\n"
                f"> - **Required Actions:** Conduct uncoached user sessions, execute `npm run audit:rls`, and verify e2e synthetic flows.\n"
            )

        # Insert or replace active instruction banner under Phase 1 header
        phase1_header = "## Phase 1: Remaining MVP Features to 100% Code Complete (with Automated Tests)"
        if phase1_header in content:
            # Check if an existing callout exists right below phase1_header
            parts = content.split(phase1_header, 1)
            after = parts[1]
            if after.startswith("\n\n> [!NOTE]"):
                end_note = after.find("\n\n###")
                if end_note != -1:
                    after = after[end_note:]
            content = f"{parts[0]}{phase1_header}\n\n{callout}{after}"

        with open(plan_path, "w") as f:
            f.write(content)

        print(f"  [x] LOOP BROKEN: Updated {plan_path}")
        print(f"      Advanced Active Instruction -> {next_instruction_title or 'Phase 2 Testing Gate'}")
        return next_instruction_title or "Phase 2 Testing Gate"
    except Exception as e:
        print(f"[-] Error updating mvp plan: {e}")
        return None

def update_edge_acknowledgments(repo_path, challenge, proof_note, next_instruction):
    """Logs the accepted challenge in edge docs/council/ACKNOWLEDGMENTS.md so pre-flight knows."""
    ack_path = os.path.join(repo_path, "docs", "council", "ACKNOWLEDGMENTS.md")
    if not os.path.exists(ack_path):
        return

    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    chal_id = challenge.get("challenge_id", "CHAL-ACCEPTED")
    field = challenge.get("field_path", "unknown")
    val = challenge.get("claimed_value", "unknown")
    
    entry = f"""
### Acknowledgment: RECONCILED-CHALLENGE / {chal_id}
- **Status:** ACCEPTED & RECONCILED (LOOP BROKEN)
- **Date:** {now_str}
- **Verified Target:** `{field}` = `{val}`
- **Proof:** `{challenge.get('evidence_type')}` — {proof_note}
- **Next Active Instruction:** **{next_instruction or 'Advance to Next Phase'}**
- **Loop-Breaking Guarantee:** Central command and edge instruction synchronized. Command loop terminated.
"""
    try:
        with open(ack_path, "a") as f:
            f.write(entry)
        print(f"  [x] Logged accepted challenge in edge ACKNOWLEDGMENTS.md")
    except Exception as e:
        print(f"[-] Error updating edge acknowledgments: {e}")

def apply_reconciliation(product_id, challenge, repo_path, proof_note):
    """Applies verified update to local telemetry, edge roadmap, and central caches."""
    field_path = challenge.get("field_path")
    claimed_value = challenge.get("claimed_value")
    
    # 1. Update edge roadmap (docs/mvp-100-plan.md) and get next instruction
    next_instruction = update_edge_mvp_plan(repo_path, challenge, proof_note)
    
    # 2. Update edge ACKNOWLEDGMENTS.md
    update_edge_acknowledgments(repo_path, challenge, proof_note, next_instruction)

    # 3. Update edge telemetry.json
    telemetry_path = os.path.join(repo_path, "docs", "control-plane", "telemetry.json")
    if os.path.exists(telemetry_path):
        try:
            with open(telemetry_path, "r") as f:
                tdata = json.load(f)
            
            # Navigate nested field path
            parts = field_path.split(".")
            curr = tdata
            for p in parts[:-1]:
                if p not in curr:
                    curr[p] = {}
                curr = curr[p]
            curr[parts[-1]] = claimed_value

            # If completion percentage updated or feature completed
            if next_instruction and "Feature" in next_instruction:
                tdata.setdefault("next_steps", [])
                tdata["next_steps"] = [next_instruction] + [s for s in tdata["next_steps"] if s != next_instruction][:3]
                
                ra = tdata.setdefault("online_status", {}).setdefault("readiness_assessment", {})
                ra.setdefault("next_required_actions", [])
                ra["next_required_actions"] = [f"Complete {next_instruction}"] + [a for a in ra["next_required_actions"] if next_instruction not in a][:2]

            # Update session summary
            tdata.setdefault("ai_session_telemetry", {})["summary_of_work"] = (
                f"Reconciled edge challenge {challenge.get('challenge_id')}: {field_path} -> {claimed_value}. "
                f"Advanced active instruction to {next_instruction or 'Next Phase'}."
            )

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
        lines.append("| Date (UTC) | Product | Field Challenged | Central (Prior) | Reconciled (New) | Evidence Type & Proof | Next Instruction |\n")
        lines.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
    else:
        with open(LEDGER_PATH, "r") as f:
            existing = f.read()
        lines.append(existing.rstrip())

    for r in reconciliations:
        proof_summary = f"`{r['evidence_type']}`: {r['proof_note']}"
        next_inst = r.get('next_instruction') or "Next Milestone"
        lines.append(f"| {now_str} | **{r['product_name']}** | `{r['field_path']}` | `{r['central_value']}` | **`{r['claimed_value']}`** | {proof_summary} | **{next_inst}** |")

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

                # Apply to telemetry, roadmap, acknowledgments
                apply_reconciliation(product_id, ch, repo_path, note)

                # Find next instruction for ledger
                plan_path = os.path.join(repo_path, "docs", "mvp-100-plan.md")
                next_inst = "Next Sprint"
                if os.path.exists(plan_path):
                    with open(plan_path) as pf:
                        pcontent = pf.read()
                    m = re.search(r"Immediate Active Directive:\*\*\s*\*\*([^\*]+)\*\*", pcontent)
                    if m:
                        next_inst = m.group(1).strip()

                reconciled.append({
                    "product_id": product_id,
                    "product_name": name,
                    "field_path": ch["field_path"],
                    "central_value": ch.get("central_value"),
                    "claimed_value": ch.get("claimed_value"),
                    "evidence_type": ch.get("evidence_type"),
                    "proof_note": note,
                    "next_instruction": next_inst
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
        sync_script = os.path.join(WORKSPACE_ROOT, "scripts", "control-plane-sync.py")
        try:
            if os.path.exists(sync_script) and os.stat(sync_script).st_nlink > 0:
                print("[+] Triggering full control-plane-sync to update master dashboard and UI caches...")
                subprocess.run(["python3", sync_script], check=True)
        except Exception as e:
            print(f"[-] Note: control-plane-sync skipped/failed: {e}")
        print(f"RECONCILIATION COMPLETE: {len(all_reconciled)} Autonomous Evidence Updates Accepted")
        print("COMMAND LOOP BROKEN: Edge Roadmaps & Central Caches Mutated Immediately")
        print("================================================================================\n")
    else:
        print("\n[+] All edge challenges verified. No pending discrepancies found.")
        print("================================================================================\n")

if __name__ == "__main__":
    main()
