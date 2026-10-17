#!/usr/bin/env python3
"""
ChurchCore Edge Telemetry Reporter
Updates docs/control-plane/telemetry.json for reporting to ChurchCore-Business Control Plane.
"""

import os
import sys
import json
import argparse
import subprocess
from datetime import datetime, timezone

CANONICAL_PRODUCT_IDS = {
    'churchcore': 'churchcore-chms',
    'churchcore-lms': 'churchcore-lms',
    'churchcore-academy': 'churchcore-academy',
    'churchcorecare': 'churchcore-care',
    'churchcore-care': 'churchcore-care',
    'churchcore-orthos': 'churchcore-orthos',
    'faithfull-scholars': 'faithfull-scholars',
    'faithful-scholars': 'faithfull-scholars'
}

def detect_product_id(repo_root):
    pkg_file = os.path.join(repo_root, 'package.json')
    if os.path.exists(pkg_file):
        try:
            with open(pkg_file) as f:
                data = json.load(f)
                name = data.get('name', '').lower()
                if name in CANONICAL_PRODUCT_IDS:
                    return CANONICAL_PRODUCT_IDS[name], data.get('version', '0.1.0')
        except Exception:
            pass
            
    dirname = os.path.basename(os.path.abspath(repo_root)).lower().replace(' ', '-')
    for k, v in CANONICAL_PRODUCT_IDS.items():
        if k in dirname:
            return v, '0.1.0'
    return 'churchcore-chms', '1.0.0'

def get_git_info(repo_root):
    try:
        changes = subprocess.getoutput(f'git -C "{repo_root}" log -n 5 --pretty=format:"%s (%h)"').splitlines()
        author = subprocess.getoutput(f'git -C "{repo_root}" config user.name').strip() or "Ricardo J. Julia"
        return [c for c in changes if c.strip()], author
    except Exception:
        return ["Initial commit"], "Developer"

def main():
    parser = argparse.ArgumentParser(description="Report edge telemetry to ChurchCore Control Plane")
    parser.add_argument("--model", default="gemini-2.5-pro", help="AI model name (e.g. gemini-2.5-pro, claude-3-7-sonnet)")
    parser.add_argument("--duration", type=int, default=30, help="Session duration in minutes")
    parser.add_argument("--operator", default=None, help="Operator/Developer name")
    parser.add_argument("--summary", default="Routine development & maintenance", help="Session work summary")
    parser.add_argument("--error", default=None, help="Deployment or build error encountered")
    parser.add_argument("--mitigation", default=None, help="Mitigation applied for error")
    parser.add_argument("--phase", choices=["alpha", "beta", "pilot_ready", "production"], default=None)
    parser.add_argument("--completion", type=int, default=None)
    parser.add_argument("--online", type=str, choices=["true", "false"], default=None)
    parser.add_argument("--vercel-url", default=None)
    parser.add_argument("--supabase-status", choices=["connected", "pending", "local_only", "none"], default=None)

    args = parser.parse_args()
    repo_root = os.getcwd()
    product_id, version = detect_product_id(repo_root)
    recent_changes, default_author = get_git_info(repo_root)
    operator = args.operator or default_author

    telemetry_dir = os.path.join(repo_root, "docs", "control-plane")
    os.makedirs(telemetry_dir, exist_ok=True)
    telemetry_file = os.path.join(telemetry_dir, "telemetry.json")

    # Load existing or create fresh
    existing = {}
    if os.path.exists(telemetry_file):
        try:
            with open(telemetry_file, "r") as f:
                existing = json.load(f)
        except Exception:
            existing = {}

    now_iso = datetime.now(timezone.utc).isoformat()

    # Online status defaults or updates
    online_status = existing.get("online_status", {
        "is_online": False,
        "vercel_status": "pending",
        "vercel_url": "",
        "supabase_status": "local_only",
        "readiness_assessment": {
            "readiness_score_pct": 75,
            "blockers": [],
            "next_required_actions": ["Deploy production build on Vercel", "Verify Supabase production keys"]
        }
    })

    if args.online is not None:
        online_status["is_online"] = (args.online.lower() == "true")
    if args.vercel_url:
        online_status["vercel_url"] = args.vercel_url
        online_status["vercel_status"] = "deployed"
        online_status["is_online"] = True
    if args.supabase_status:
        online_status["supabase_status"] = args.supabase_status

    # MVP status defaults or updates
    mvp_status = existing.get("mvp_status", {
        "phase": "beta",
        "completion_pct": 80,
        "latest_milestones": ["Core schema and UI foundation completed"]
    })
    if args.phase:
        mvp_status["phase"] = args.phase
    if args.completion is not None:
        mvp_status["completion_pct"] = args.completion

    # Diagnostics
    diagnostics = existing.get("deployment_diagnostics", {
        "recent_errors": [],
        "mitigations_applied": []
    })
    if args.error:
        diagnostics["recent_errors"].insert(0, f"[{now_iso[:10]}] {args.error}")
        diagnostics["recent_errors"] = diagnostics["recent_errors"][:5]
    if args.mitigation:
        diagnostics["mitigations_applied"].insert(0, f"[{now_iso[:10]}] {args.mitigation}")
        diagnostics["mitigations_applied"] = diagnostics["mitigations_applied"][:5]

    # AI Session
    ai_session = {
        "last_model": args.model,
        "session_duration_minutes": args.duration,
        "session_date": now_iso,
        "session_operator": operator,
        "summary_of_work": args.summary
    }

    # Governance
    governance = existing.get("governance_compliance", {
        "council_decisions_acknowledged": ["COUNCIL-2026-001", "COUNCIL-2026-002", "COUNCIL-2026-003", "COUNCIL-2026-004"],
        "brand_house_compliant": True,
        "sovereign_db_isolation_verified": True
    })

    payload = {
        "product_id": product_id,
        "repo_name": os.path.basename(os.path.abspath(repo_root)),
        "version": version,
        "report_timestamp": now_iso,
        "online_status": online_status,
        "mvp_status": mvp_status,
        "latest_changes": recent_changes[:5] if recent_changes else ["Routine update"],
        "next_steps": existing.get("next_steps", ["Execute automated test suite", "Verify production deployment"]),
        "ai_session_telemetry": ai_session,
        "deployment_diagnostics": diagnostics,
        "governance_compliance": governance
    }

    with open(telemetry_file, "w") as f:
        json.dump(payload, f, indent=2)

    print(f"\n[+] Telemetry successfully recorded for {product_id} (v{version})")
    print(f"    Target File: {telemetry_file}")
    print(f"    Online Status: {'ONLINE (' + online_status['vercel_url'] + ')' if online_status['is_online'] else 'OFFLINE / LOCAL (Score: ' + str(online_status['readiness_assessment']['readiness_score_pct']) + '%)'}")
    print(f"    MVP Status: {mvp_status['phase'].upper()} ({mvp_status['completion_pct']}% complete)")
    print(f"    Last AI Model: {ai_session['last_model']} ({ai_session['session_duration_minutes']} min session)")
    print(f"    Diagnostics: {len(diagnostics['recent_errors'])} errors logged, {len(diagnostics['mitigations_applied'])} mitigations recorded.\n")

if __name__ == "__main__":
    main()
