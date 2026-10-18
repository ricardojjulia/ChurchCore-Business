#!/usr/bin/env python3
"""
ChurchCore Governance Sync Engine
---------------------------------
Generic cross-repository governance synchronization script.
Reads `docs/governance-sync/manifest.json`, queries product repositories on GitHub
(or local sibling folders as fallback), parses their `docs/council/ACKNOWLEDGMENTS.md`,
and updates `docs/governance-sync/COMPLIANCE-MATRIX.md`.
"""

import json
import os
import re
import subprocess
import urllib.request
import urllib.error

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
MANIFEST_PATH = os.path.join(ROOT_DIR, "docs", "governance-sync", "manifest.json")
MATRIX_PATH = os.path.join(ROOT_DIR, "docs", "governance-sync", "COMPLIANCE-MATRIX.md")

def load_manifest():
    with open(MANIFEST_PATH, "r") as f:
        return json.load(f)

def fetch_remote_acknowledgment(repo_full_name):
    """Attempt to fetch docs/council/ACKNOWLEDGMENTS.md via raw GitHub URL or gh CLI."""
    url = f"https://raw.githubusercontent.com/{repo_full_name}/main/docs/council/ACKNOWLEDGMENTS.md"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'ChurchCore-SyncEngine'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                return resp.read().decode('utf-8')
    except Exception:
        pass

    # Try gh api fallback
    try:
        cmd = ["gh", "api", f"repos/{repo_full_name}/contents/docs/council/ACKNOWLEDGMENTS.md", "--jq", ".content"]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=5)
        if res.returncode == 0 and res.stdout.strip():
            import base64
            return base64.b64decode(res.stdout.strip()).decode('utf-8')
    except Exception:
        pass

    return None

def fetch_local_acknowledgment(repo_name):
    """Fallback: check if sibling repo exists on local machine."""
    sibling_candidates = [
        os.path.join(os.path.dirname(ROOT_DIR), repo_name),
        os.path.join(os.path.dirname(ROOT_DIR), repo_name.replace("-", " ")),
        os.path.join(os.path.dirname(ROOT_DIR), repo_name.replace("ChurchCore", "ChurchCore ")),
    ]
    for path in sibling_candidates:
        ack_file = os.path.join(path, "docs", "council", "ACKNOWLEDGMENTS.md")
        if os.path.exists(ack_file):
            with open(ack_file, "r") as f:
                return f.read()
    return None

def parse_acknowledgments(content):
    """Extract requirement statuses from ACKNOWLEDGMENTS.md."""
    if not content:
        return {}
    results = {}
    
    # Check evidence tables. Requirement cells may include a human title after
    # the ID; status is the following cell.
    for line in content.splitlines():
        if not line.lstrip().startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) < 3:
            continue
        req_match = re.search(r"REQ-[0-9]+-[0-9]+", cells[1])
        if req_match:
            results[req_match.group(0)] = cells[2]

    # Check individual section blocks like:
    # ### Acknowledgment: COUNCIL-2026-001 / REQ-001-01 - Title
    # - **Status:** IMPLEMENTED & VERIFIED
    block_matches = re.findall(r'(?:REQ-[0-9\-]+)[\s\S]*?(?:Status:?\s*[*]*([A-Za-z &]+)[*]*)', content)
    req_ids = re.findall(r'(REQ-[0-9\-]+)', content)
    for rid in req_ids:
        if rid not in results:
            # check status following this id
            m = re.search(re.escape(rid) + r'[\s\S]*?Status:?\s*[*]*([A-Za-z &]+)[*]*', content)
            if m:
                results[rid] = m.group(1).strip()

    return results

def normalize_status(raw_status):
    """Map edge-reported evidence to a fail-closed matrix status."""
    raw = raw_status.upper()
    negative_markers = (
        "BLOCKED",
        "NOT VERIFIED",
        "UNVERIFIED",
        "PENDING",
        "NOT IMPLEMENTED",
    )
    if any(marker in raw for marker in negative_markers):
        return "⚪ PENDING"
    if (
        "IN PROGRESS" in raw
        or "ACKNOWLEDGED" in raw
        or "ACCEPTED" in raw
        or "🟡" in raw
    ):
        return "🟡 IN PROGRESS"
    if raw.startswith("IMPLEMENTED") or "✅" in raw:
        return "✅ IMPLEMENTED"
    return "⚪ PENDING"

def main():
    print("=" * 60)
    print("ChurchCore Governance Sync Engine")
    print("=" * 60)
    manifest = load_manifest()
    products = manifest.get("registered_products", [])
    decisions = manifest.get("decisions", [])
    
    print(f"Loaded {len(decisions)} Council decisions across {len(products)} registered products.\n")
    
    compliance = {} # (req_id, prod_name) -> status
    
    for prod in products:
        p_name = prod["name"]
        p_repo = prod["repo"]
        print(f"Checking {p_name} ({p_repo})...")
        
        content = fetch_remote_acknowledgment(p_repo)
        source = "GitHub Remote"
        if not content:
            content = fetch_local_acknowledgment(p_name)
            source = "Local Sibling" if content else "None"
        
        print(f"  Source: {source}")
        ack_data = parse_acknowledgments(content) if content else {}
        
        for d in decisions:
            if p_name in d.get("impacted_products", []):
                for req in d.get("requirements", []):
                    rid = req["req_id"]
                    if rid in ack_data:
                        status = normalize_status(ack_data[rid])
                    else:
                        status = "⚪ PENDING"
                    compliance[(rid, p_name)] = status
    
    print("\nGenerating updated COMPLIANCE-MATRIX.md...")
    # Re-generate markdown table
    header = "| Council Decision | Requirement ID & Title | " + " | ".join([p["name"] for p in products]) + " |\n"
    separator = "|---|---|" + "|".join([":---:" for _ in products]) + "|\n"
    
    rows = []
    for d in decisions:
        d_id = d["id"]
        for req in d.get("requirements", []):
            rid = req["req_id"]
            rtitle = f"`{rid}` {req['title']}"
            cols = [f"**{d_id}**", rtitle]
            for p in products:
                p_name = p["name"]
                if p_name in d.get("impacted_products", []):
                    cols.append(compliance.get((rid, p_name), "⚪ PENDING"))
                else:
                    cols.append("— (N/A)")
            rows.append("| " + " | ".join(cols) + " |")

    table_md = header + separator + "\n".join(rows) + "\n"

    # Read existing COMPLIANCE-MATRIX.md and replace table section
    if os.path.exists(MATRIX_PATH):
        with open(MATRIX_PATH, "r") as f:
            mat_text = f.read()
        
        # Replace section 1 table
        sec1_pattern = r'(## 1\. Master Ecosystem Compliance Dashboard[\s\S]*?\n\n)(\| Council Decision[\s\S]*?\n\n)(---)'
        m = re.search(sec1_pattern, mat_text)
        if m:
            new_text = mat_text[:m.start(2)] + table_md + "\n" + mat_text[m.start(3):]
            with open(MATRIX_PATH, "w") as f:
                f.write(new_text)
            print(f"Updated {MATRIX_PATH}")
        else:
            print("Note: Section 1 pattern not matched, updating file directly.")
            
    print("Governance Sync complete.")

if __name__ == "__main__":
    main()
