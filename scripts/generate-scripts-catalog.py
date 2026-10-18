#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Automated Python Automation Catalog Generator
Scans scripts/ and dashboard/ for Python scripts, extracts AST docstrings,
CLI usage patterns, and argument parser definitions, and automatically compiles
docs/control-plane/PYTHON-SCRIPTS-CATALOG.md.

Runs automatically on fleet sync and daily briefings.
"""

import os
import sys
import ast
import glob
from datetime import datetime, timezone

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(WORKSPACE_ROOT, "scripts")
DASHBOARD_DIR = os.path.join(WORKSPACE_ROOT, "dashboard")
OUTPUT_MD = os.path.join(WORKSPACE_ROOT, "docs", "control-plane", "PYTHON-SCRIPTS-CATALOG.md")

# Categories for grouping scripts cleanly
SCRIPT_CATEGORIES = {
    "scripts/daily-fleet-briefing.py": ("Reporting & Fleet Briefings", "Automated daily fleet status, MVP 100% progress tracking, and morning priority queue generation."),
    "scripts/control-plane-sync.py": ("Fleet Telemetry & Cockpit Aggregation", "Ingests edge telemetry from all 6 product repositories and compiles the master ecosystem dashboard."),
    "scripts/activate-product-repos.py": ("Repository Activation & Roadmapping", "Proactively injects governance rules, acknowledgment ledgers, edge scripts, and docs/mvp-100-plan.md."),
    "scripts/report-telemetry.py": ("Edge Telemetry & AI Session Logging", "Standardized session logger for AI agents, recording duration, models, bug fixes, and errors."),
    "scripts/pull-and-enforce-directives.py": ("Governance Enforcement & Ingestion", "Runs inside edge product repos to pull central directives and enforce compliance invariants."),
    "scripts/sync-governance.py": ("Governance Manifest Discovery", "Syncs council decisions, validates manifest discovery, and verifies edge repository alignment."),
    "scripts/challenge-central-record.py": ("Autonomous Edge Challenges", "CLI enabling edge repositories to challenge central records with verifiable cryptographic proof."),
    "scripts/reconcile-edge-challenges.py": ("Central Verification & Evidence", "Autonomously audits edge challenge evidence and updates the central reconciliation ledger."),
    "scripts/manage-tasks.py": ("Project Management & Task Sync", "Bidirectional task management CLI between docs/control-plane/tasks.json and PROJECT_TASKS.md."),
    "scripts/generate-marketing-presos.py": ("Marketing & Business Presentations", "Generates slide decks and AI prompt packets (Claude, Gemini, Antigravity) from product dossiers."),
    "dashboard/serve.py": ("Executive Mission Control Cockpit", "Serves the real-time glassmorphic dashboard and documentation dossier viewer at http://localhost:3333.")
}

def analyze_script(file_path):
    rel_path = os.path.relpath(file_path, WORKSPACE_ROOT)
    with open(file_path, "r", encoding="utf-8") as f:
        source = f.read()

    docstring = "No docstring provided."
    cli_flags = []
    
    try:
        tree = ast.parse(source, filename=file_path)
        docstring = ast.get_docstring(tree) or docstring
        
        # Look for argparse flags
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                func = getattr(node, "func", None)
                if isinstance(func, ast.Attribute) and func.attr == "add_argument":
                    args = [a.value for a in node.args if isinstance(a, ast.Constant)]
                    kwargs = {kw.arg: kw.value.value for kw in node.keywords if isinstance(kw.value, ast.Constant)}
                    if args:
                        flag_str = ", ".join(args)
                        help_text = kwargs.get("help", "")
                        cli_flags.append((flag_str, help_text))
    except Exception as e:
        docstring = f"Error parsing AST: {e}"

    lines = docstring.strip().splitlines()
    title = lines[0].strip() if lines else rel_path
    description = "\n".join(lines[1:]).strip() if len(lines) > 1 else ""

    category, cat_summary = SCRIPT_CATEGORIES.get(rel_path, ("General Automation Tools", "Utility script for sovereign control plane automation."))

    return {
        "rel_path": rel_path,
        "abs_path": file_path,
        "title": title,
        "description": description,
        "category": category,
        "cat_summary": cat_summary,
        "cli_flags": cli_flags,
        "size_bytes": len(source),
        "line_count": len(source.splitlines())
    }

def generate_catalog():
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    
    # Collect all python scripts
    all_scripts = sorted(glob.glob(os.path.join(SCRIPTS_DIR, "*.py")) + glob.glob(os.path.join(DASHBOARD_DIR, "*.py")))
    
    analyzed = [analyze_script(p) for p in all_scripts]

    # Group by category
    categories = {}
    for item in analyzed:
        cat = item["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(item)

    lines = [
        f"# ChurchCore Sovereign Control Plane: Python Automation Catalog",
        f"",
        f"> **Generated:** {now_iso}  ",
        f"> **Total Registered Automation Tools:** {len(analyzed)} Python Scripts  ",
        f"> **Auto-Maintenance Policy:** Automatically maintained and regenerated by `control-plane-sync.py` and `daily-fleet-briefing.py`.  ",
        f"> **Execution Root:** Always run scripts from the workspace root (`/Users/rjulia/ChurchCore-Business`).  ",
        f"",
        f"---",
        f"",
        f"## Quick Command Reference Matrix",
        f"",
        f"| Script | Primary Category | One-Line Purpose | Execution Example |",
        f"| :--- | :--- | :--- | :--- |"
    ]

    for item in analyzed:
        fname = os.path.basename(item["rel_path"])
        cmd_example = f"`python3 {item['rel_path']}`"
        lines.append(f"| **[`{fname}`](#{fname.replace('.', '').replace('-', '').lower()})** | {item['category']} | {item['title'][:60]} | {cmd_example} |")

    lines.extend([
        f"",
        f"---",
        f"",
        f"## Detailed Automation Suites & Tool References",
        f""
    ])

    for cat_name, cat_items in categories.items():
        lines.extend([
            f"### 📂 {cat_name}",
            f""
        ])
        for item in cat_items:
            fname = os.path.basename(item["rel_path"])
            anchor = fname.replace('.', '').replace('-', '').lower()
            lines.extend([
                f"<a id=\"{anchor}\"></a>",
                f"#### `{item['rel_path']}` — {item['title']}",
                f"",
                f"- **File Location:** [`{item['rel_path']}`](file://{item['abs_path']})",
                f"- **Lines of Code:** {item['line_count']} lines ({item['size_bytes']:,} bytes)",
                f"- **Default Command:**",
                f"  ```bash",
                f"  python3 {item['rel_path']}",
                f"  ```"
            ])

            if item["description"]:
                lines.extend([
                    f"",
                    f"**Description & Scope:**",
                    f"```text",
                    f"{item['description']}",
                    f"```"
                ])

            if item["cli_flags"]:
                lines.extend([
                    f"",
                    f"**CLI Arguments & Flags:**",
                    f"",
                    f"| Flag / Argument | Description |",
                    f"| :--- | :--- |"
                ])
                for flag, help_text in item["cli_flags"]:
                    lines.append(f"| `{flag}` | {help_text or 'No description provided.'} |")

            lines.append("")

    lines.extend([
        f"---",
        f"",
        f"## How to Register New Python Scripts Automatically",
        f"",
        f"Whenever you or an AI agent create a new Python automation script in `scripts/` or `dashboard/`:",
        f"1. **Include a Standard Module Docstring** at the very top of your `.py` file explaining what the tool does, its arguments, and how to use it.",
        f"2. **Use Standard `argparse`** for CLI flags if the script accepts arguments.",
        f"3. **Run Fleet Sync or Daily Briefing**:",
        f"   ```bash",
        f"   python3 scripts/control-plane-sync.py",
        f"   # Or run: python3 scripts/daily-fleet-briefing.py",
        f"   ```",
        f"   The docstring parser will automatically discover the new script, extract its flags, categorize it, and add it to this document with zero manual editing required!",
        f"",
        f"---",
        f"",
        f"*Certified by the High Sovereign Grand Council of ChurchCore Automation Systems.*"
    ])

    content = "\n".join(lines)
    os.makedirs(os.path.dirname(OUTPUT_MD), exist_ok=True)
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"[+] Python automation catalog generated successfully:")
    print(f"    File: {OUTPUT_MD}")
    print(f"    Total Scripts Cataloged: {len(analyzed)}")
    return OUTPUT_MD

if __name__ == "__main__":
    generate_catalog()
