#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Universal Edge Telemetry Reporter
Updates docs/control-plane/telemetry.json for reporting to ChurchCore-Business Control Plane.
Can be executed with explicit flags or with --auto for continuous post-test/post-commit sync.
"""

import os
import sys
import json
import argparse
import subprocess
import urllib.request
import ssl
from datetime import datetime, timezone

CANONICAL_PRODUCT_IDS = {
    'churchcore': 'churchcore-chms',
    'churchcore-chms': 'churchcore-chms',
    'churchcore-lms': 'churchcore-lms',
    'churchcore academy': 'churchcore-academy',
    'churchcore-academy': 'churchcore-academy',
    'churchcorecare': 'churchcore-care',
    'churchcore care': 'churchcore-care',
    'churchcore-care': 'churchcore-care',
    'churchcore orthos': 'churchcore-orthos',
    'churchcore-orthos': 'churchcore-orthos',
    'faithfull-scholars': 'faithfull-scholars',
    'faithfullscholars': 'faithfull-scholars',
    'faithful-scholars': 'faithfull-scholars'
}

CANONICAL_TARGETS = {
    'churchcore-chms': {
        'domain': 'https://www.churchcore.io',
        'supabase_ref': 'prod-chms-db',
        'default_phase': 'production',
        'default_completion': 100,
    },
    'churchcore-lms': {
        'domain': 'https://www.churchcorelms.io',
        'supabase_ref': 'prod-lms-db',
        'default_phase': 'production',
        'default_completion': 100,
    },
    'churchcore-academy': {
        'domain': 'https://www.churchcoreacademy.io',
        'supabase_ref': 'prod-academy-db',
        'default_phase': 'production',
        'default_completion': 100,
    },
    'churchcore-care': {
        'domain': 'https://www.churchcorecare.io',
        'supabase_ref': 'prod-care-db',
        'default_phase': 'production',
        'default_completion': 100,
    },
    'churchcore-orthos': {
        'domain': 'https://church-core-orthos.vercel.app',
        'supabase_ref': 'prod-orthos-db',
        'default_phase': 'production',
        'default_completion': 100,
    },
    'faithfull-scholars': {
        'domain': 'https://www.faithgrid.io',
        'supabase_ref': 'prod-scholars-db',
        'default_phase': 'beta',
        'default_completion': 92,
    },
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

def probe_url(url, timeout=4):
    """Probes a URL and returns True if responding with 200/301/302/307/308."""
    ctx = ssl.create_default_context()
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'ChurchCore-EdgeTelemetry/1.0'}
        )
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            return resp.status in (200, 301, 302, 307, 308)
    except urllib.error.HTTPError as e:
        return e.code in (200, 301, 302, 307, 308)
    except Exception:
        return False

def get_git_info(repo_root):
    try:
        changes = subprocess.getoutput(f'git -C "{repo_root}" log -n 5 --pretty=format:"%s (%h)"').splitlines()
        author = subprocess.getoutput(f'git -C "{repo_root}" config user.name').strip() or "Ricardo J. Julia"
        return [c for c in changes if c.strip()], author
    except Exception:
        return ["Initial commit"], "Developer"

def main():
    parser = argparse.ArgumentParser(description="Report edge telemetry to ChurchCore Control Plane")
    parser.add_argument("--auto", action="store_true", help="Autonomously probe live endpoints, detect git commits, and record telemetry")
    parser.add_argument("--model", default="gemini-2.5-pro", help="AI model name (e.g. gemini-2.5-pro, claude-3-7-sonnet)")
    parser.add_argument("--duration", type=int, default=30, help="Session duration in minutes")
    parser.add_argument("--operator", default=None, help="Operator/Developer name")
    parser.add_argument("--summary", default=None, help="Session work summary")
    parser.add_argument("--error", default=None, help="Deployment or build error encountered")
    parser.add_argument("--mitigation", default=None, help="Mitigation applied for error")
    parser.add_argument("--phase", choices=["alpha", "beta", "pilot_ready", "production"], default=None)
    parser.add_argument("--completion", type=int, default=None)
    parser.add_argument("--online", type=str, choices=["true", "false"], default=None)
    parser.add_argument("--vercel-url", default=None)
    parser.add_argument("--supabase-status", choices=["connected", "pending", "local_only", "none"], default=None)
    parser.add_argument("--score", type=int, default=None, help="Readiness score percentage (0-100)")
    parser.add_argument("--blocker", default=None, help="Add a specific deployment blocker")
    parser.add_argument("--clear-blockers", action="store_true", help="Clear all blockers from readiness assessment")

    args = parser.parse_args()
    repo_root = os.getcwd()
    product_id, version = detect_product_id(repo_root)
    canonical = CANONICAL_TARGETS.get(product_id, {})
    canonical_domain = canonical.get('domain', '')
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

    # Online status defaults
    online_status = existing.get("online_status", {
        "is_online": False,
        "vercel_status": "pending",
        "vercel_url": canonical_domain,
        "supabase_status": "local_only",
        "readiness_assessment": {
            "readiness_score_pct": 75,
            "blockers": [],
            "next_required_actions": ["Deploy production build on Vercel", "Verify Supabase production keys"]
        }
    })

    readiness = online_status.setdefault("readiness_assessment", {
        "readiness_score_pct": 100 if online_status.get("is_online") else 80,
        "blockers": [],
        "next_required_actions": []
    })

    # AUTO MODE
    if args.auto:
        is_live = False
        target_url = args.vercel_url or online_status.get("vercel_url") or canonical_domain
        if target_url:
            is_live = probe_url(target_url)

        online_status["is_online"] = is_live
        online_status["vercel_status"] = "deployed" if is_live else "pending"
        online_status["vercel_url"] = target_url or canonical_domain
        online_status["custom_domain"] = target_url or canonical_domain
        online_status["supabase_status"] = "connected" if is_live else online_status.get("supabase_status", "local_only")
        if canonical.get("supabase_ref"):
            online_status["supabase_project_ref"] = canonical["supabase_ref"]

        if is_live:
            readiness["readiness_score_pct"] = 100
            readiness["blockers"] = []
            if not readiness.get("next_required_actions"):
                readiness["next_required_actions"] = ["Continuous production edge monitoring"]

    # EXPLICIT ARGS
    if args.online is not None:
        is_online = (args.online.lower() == "true")
        online_status["is_online"] = is_online
        if is_online:
            online_status["vercel_status"] = "deployed"
            readiness["readiness_score_pct"] = args.score if args.score is not None else 100
            if not args.blocker and not readiness.get("blockers"):
                readiness["blockers"] = []

    if args.vercel_url:
        online_status["vercel_url"] = args.vercel_url
        online_status["custom_domain"] = args.vercel_url
        online_status["vercel_status"] = "deployed"
        online_status["is_online"] = True
        readiness["readiness_score_pct"] = args.score if args.score is not None else 100
        readiness["blockers"] = []

    if args.supabase_status:
        online_status["supabase_status"] = args.supabase_status
        if canonical.get("supabase_ref") and args.supabase_status == "connected":
            online_status["supabase_project_ref"] = canonical["supabase_ref"]

    if args.score is not None:
        readiness["readiness_score_pct"] = args.score

    if args.clear_blockers:
        readiness["blockers"] = []

    if args.blocker:
        if args.blocker not in readiness["blockers"]:
            readiness["blockers"].append(args.blocker)

    # MVP Status
    default_phase = canonical.get('default_phase', 'production')
    default_comp = canonical.get('default_completion', 100)
    mvp_status = existing.get("mvp_status", {
        "phase": default_phase,
        "completion_pct": default_comp,
        "latest_milestones": ["Core production release live"]
    })

    if args.phase:
        mvp_status["phase"] = args.phase
    elif args.auto and online_status.get("is_online"):
        mvp_status["phase"] = default_phase

    if args.completion is not None:
        mvp_status["completion_pct"] = args.completion
    elif args.auto and online_status.get("is_online") and mvp_status.get("completion_pct", 0) < default_comp:
        mvp_status["completion_pct"] = default_comp

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
    summary = args.summary
    if not summary:
        if args.auto:
            summary = f"Automated post-test edge telemetry synchronization for {product_id}."
        else:
            summary = "Routine development & automated testing closeout."

    ai_session = {
        "last_model": args.model,
        "session_duration_minutes": args.duration,
        "session_date": now_iso,
        "session_operator": operator,
        "summary_of_work": summary
    }

    # Governance
    all_decisions = [
        "COUNCIL-2026-001",
        "COUNCIL-2026-002",
        "COUNCIL-2026-003",
        "COUNCIL-2026-004",
        "COUNCIL-2026-005",
        "COUNCIL-2026-006",
        "COUNCIL-2026-007",
        "COUNCIL-2026-008"
    ]
    governance = existing.get("governance_compliance", {
        "council_decisions_acknowledged": all_decisions,
        "brand_house_compliant": True,
        "sovereign_db_isolation_verified": True
    })
    for d in all_decisions:
        if d not in governance["council_decisions_acknowledged"]:
            governance["council_decisions_acknowledged"].append(d)

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
    print(f"    Online Status: {'ONLINE (' + online_status['vercel_url'] + ')' if online_status['is_online'] else 'OFFLINE / LOCAL (Score: ' + str(readiness['readiness_score_pct']) + '%)'}")
    print(f"    MVP Status: {mvp_status['phase'].upper()} ({mvp_status['completion_pct']}% complete)")
    print(f"    Last AI Model: {ai_session['last_model']} ({ai_session['session_duration_minutes']} min session)")
    print(f"    Diagnostics: {len(diagnostics['recent_errors'])} errors logged, {len(diagnostics['mitigations_applied'])} mitigations recorded.\n")

if __name__ == "__main__":
    main()
