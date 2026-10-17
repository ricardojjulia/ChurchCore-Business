#!/usr/bin/env python3
"""
ChurchCore Project Management Task CLI
Allows listing, adding, updating, and syncing tasks between tasks.json and PROJECT_TASKS.md.
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TASKS_JSON_PATH = os.path.join(WORKSPACE_ROOT, "docs", "control-plane", "tasks.json")
TASKS_MD_PATH = os.path.join(WORKSPACE_ROOT, "docs", "control-plane", "PROJECT_TASKS.md")

def load_tasks_db():
    if not os.path.exists(TASKS_JSON_PATH):
        return {"version": "1.0.0", "tasks": []}
    with open(TASKS_JSON_PATH, "r") as f:
        return json.load(f)

def save_tasks_db(db):
    db["last_updated"] = datetime.now(timezone.utc).isoformat()
    db["total_tasks"] = len(db.get("tasks", []))
    with open(TASKS_JSON_PATH, "w") as f:
        json.dump(db, f, indent=2)

def generate_markdown(db):
    tasks = db.get("tasks", [])
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    
    total = len(tasks)
    done_count = sum(1 for t in tasks if t["status"] == "done")
    in_prog_count = sum(1 for t in tasks if t["status"] == "in_progress")
    wait_count = sum(1 for t in tasks if t["status"] == "waiting")
    planned_count = sum(1 for t in tasks if t["status"] == "planned")
    
    edge_count = sum(1 for t in tasks if t.get("directionality") == "EDGE_REPO")
    hub_count = total - edge_count
    edge_pct = int((edge_count / max(total, 1)) * 100)
    hub_pct = 100 - edge_pct

    md = []
    md.append("# ChurchCore Ecosystem: Central Project Management Task Registry\n")
    md.append(f"> **Classification:** Sovereign Ecosystem Task Ledger & Implementation Tracking Base  ")
    md.append(f"> **Source of Truth:** [`docs/control-plane/tasks.json`](tasks.json)  ")
    md.append(f"> **Governing Body:** Executive Control Plane (`ChurchCore-Business`)  ")
    md.append(f"> **Last Updated:** {now_str}  \n")
    md.append("---\n")
    
    md.append("## 1. Executive Task Metrics & Velocity\n")
    md.append("| Metric | Count | Details |")
    md.append("| :--- | :---: | :--- |")
    md.append(f"| **Total Tracked Tasks** | **{total}** | Across 6 Product Pillars + Control Plane Hub |")
    md.append(f"| **Shipped & Verified (`DONE`)** | **{done_count}** | {int((done_count / max(total, 1))*100)}% of commitments delivered |")
    md.append(f"| **Actively In Development (`IN_PROGRESS`)** | **{in_prog_count}** | Immediate coding velocity |")
    md.append(f"| **Awaiting Review / Credentials (`WAITING`)** | **{wait_count}** | Deployment or credential binding gates |")
    md.append(f"| **Upcoming Architecture Backlog (`PLANNED`)** | **{planned_count}** | Scheduled for next sprint cycle |")
    md.append(f"| **Directionality Ratio** | **{edge_pct}% Edge / {hub_pct}% Hub** | {edge_count} Repo-Originated • {hub_count} Control-Plane-Dispatched |\n")
    
    md.append("### Directionality Legend")
    md.append("- 🔵 **`[EDGE: REPO-ORIGINATED]`**: Initiated directly within the product codebase.")
    md.append("- 🟡 **`[HUB: CONTROL-PLANE-DISPATCHED]`**: Architectural standards or strategic roadmaps imposed centrally.\n")
    md.append("---\n")

    # In Progress
    in_progs = [t for t in tasks if t["status"] == "in_progress"]
    md.append("## 2. In-Progress Engineering Tasks (`IN_PROGRESS`)\n")
    if in_progs:
        md.append("| Task ID | Product | Directionality | Title & Scope | Assignee | Git / PR Target | Verification Method |")
        md.append("| :--- | :--- | :---: | :--- | :--- | :--- | :--- |")
        for t in in_progs:
            dir_badge = "🔵 `EDGE`" if t.get("directionality") == "EDGE_REPO" else "🟡 `HUB`"
            md.append(f"| `{t['task_id']}` | **{t['product_id'].replace('churchcore-', '').upper()}** | {dir_badge} | **{t['title']}**<br>{t.get('description', '')} | {t.get('assignee', '')} | `{t.get('git_reference', 'N/A')}` | `{t.get('verification', 'N/A')}` |")
    else:
        md.append("- *No tasks currently in progress.*")
    md.append("\n---\n")

    # Waiting
    waitings = [t for t in tasks if t["status"] == "waiting"]
    md.append("## 3. Waiting & Staging Review Blockers (`WAITING`)\n")
    if waitings:
        md.append("| Task ID | Product | Directionality | Title & Scope | Blocker Reason | Immediate Resolution Action |")
        md.append("| :--- | :--- | :---: | :--- | :--- | :--- |")
        for t in waitings:
            dir_badge = "🔵 `EDGE`" if t.get("directionality") == "EDGE_REPO" else "🟡 `HUB`"
            md.append(f"| `{t['task_id']}` | **{t['product_id'].replace('churchcore-', '').upper()}** | {dir_badge} | **{t['title']}** | {t.get('description', '')} | {t.get('verification', '')} |")
    else:
        md.append("- *No tasks currently waiting on blockers.*")
    md.append("\n---\n")

    # Planned
    planneds = [t for t in tasks if t["status"] == "planned"]
    md.append("## 4. Upcoming Planned Backlog (`PLANNED`)\n")
    if planneds:
        md.append("| Task ID | Product | Directionality | Title & Scope | Priority | Target Milestone |")
        md.append("| :--- | :--- | :---: | :--- | :---: | :--- |")
        for t in planneds:
            dir_badge = "🔵 `EDGE`" if t.get("directionality") == "EDGE_REPO" else "🟡 `HUB`"
            md.append(f"| `{t['task_id']}` | **{t['product_id'].replace('churchcore-', '').upper()}** | {dir_badge} | **{t['title']}** | `{t.get('priority', 'P1_HIGH')}` | `{t.get('target_milestone', 'Next Sprint')}` |")
    else:
        md.append("- *No upcoming planned backlog tasks.*")
    md.append("\n---\n")

    # Done
    dones = [t for t in tasks if t["status"] == "done"]
    md.append("## 5. Shipped & Verified Archive (`DONE`)\n")
    if dones:
        md.append("| Task ID | Product | Directionality | Milestone Delivered | Git Reference | Verification Status |")
        md.append("| :--- | :--- | :---: | :--- | :--- | :---: |")
        for t in dones:
            dir_badge = "🔵 `EDGE`" if t.get("directionality") == "EDGE_REPO" else "🟡 `HUB`"
            md.append(f"| `{t['task_id']}` | **{t['product_id'].replace('churchcore-', '').upper()}** | {dir_badge} | **{t['title']}** | `{t.get('git_reference', 'Shipped')}` | ✅ VERIFIED |")
    else:
        md.append("- *No shipped tasks recorded yet.*")
    md.append("\n")

    return "\n".join(md)

def sync_markdown():
    db = load_tasks_db()
    md_content = generate_markdown(db)
    with open(TASKS_MD_PATH, "w") as f:
        f.write(md_content)
    print(f"[+] Synced {TASKS_MD_PATH} from tasks.json ({len(db.get('tasks', []))} tasks)")

def main():
    parser = argparse.ArgumentParser(description="ChurchCore Project Management Task CLI")
    parser.add_argument("--action", choices=["list", "add", "update", "sync"], default="list")
    parser.add_argument("--id", help="Task ID (e.g. TSK-CHMS-001)")
    parser.add_argument("--status", choices=["planned", "in_progress", "waiting", "done"])
    parser.add_argument("--product", help="Product ID")
    parser.add_argument("--title", help="Task Title")
    parser.add_argument("--dir", choices=["EDGE_REPO", "CONTROL_PLANE"], default="EDGE_REPO")
    parser.add_argument("--priority", choices=["P0_CRITICAL", "P1_HIGH", "P2_MEDIUM", "P3_LOW"], default="P1_HIGH")

    args = parser.parse_args()
    db = load_tasks_db()

    if args.action == "list":
        tasks = db.get("tasks", [])
        if args.status:
            tasks = [t for t in tasks if t["status"] == args.status]
        if args.product:
            tasks = [t for t in tasks if t["product_id"] == args.product]
        print(f"\n{'TASK ID':<15} {'PRODUCT':<16} {'STATUS':<14} {'DIR':<8} {'TITLE'}")
        print("-" * 80)
        for t in tasks:
            d_short = "EDGE" if t.get("directionality") == "EDGE_REPO" else "HUB"
            print(f"{t['task_id']:<15} {t['product_id']:<16} {t['status']:<14} {d_short:<8} {t['title'][:35]}")
        print(f"\nTotal tasks listed: {len(tasks)}\n")

    elif args.action == "update":
        if not args.id or not args.status:
            print("Error: --id and --status required for update.")
            sys.exit(1)
        found = False
        for t in db.get("tasks", []):
            if t["task_id"] == args.id:
                t["status"] = args.status
                t["updated_at"] = datetime.now(timezone.utc).isoformat()
                found = True
                print(f"[+] Task {args.id} updated to {args.status}")
                break
        if not found:
            print(f"[-] Task {args.id} not found.")
            sys.exit(1)
        save_tasks_db(db)
        sync_markdown()

    elif args.action == "sync":
        sync_markdown()

if __name__ == "__main__":
    main()
