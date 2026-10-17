# ChurchCore Edge Telemetry Specification

## 1. Scope & Objective

This specification governs how the six product repositories in the ChurchCore ecosystem report their operational health, deployment status, readiness assessments, MVP progress, and AI session history to the central Executive Control Plane (`ChurchCore-Business`).

### The Six Reporting Nodes
1. `churchcore-chms` (`ChurchCore`)
2. `churchcore-lms` (`ChurchCore LMS`)
3. `churchcore-academy` (`ChurchCore Academy`)
4. `churchcore-care` (`ChurchCore Care`)
5. `churchcore-orthos` (`ChurchCore Orthos`)
6. `faithfull-scholars` (`FaithFullScholars`)

---

## 2. Invariant: Zero Customer Data Propagation

> [!CAUTION]
> **PROHIBITED CONTENT**: Telemetry payloads must never include customer PII, church names, donor records, giving amounts, pastoral counseling notes, or student academic records. Telemetry is purely operational, structural, and architectural metadata.

---

## 3. Required Telemetry Fields Explained

| Field | Type | Description |
| :--- | :--- | :--- |
| `product_id` | `string` | Canonical slug (`churchcore-chms`, `churchcore-lms`, etc.) |
| `version` | `string` | Semantic version from `package.json` |
| `report_timestamp` | `ISO 8601` | When the telemetry was compiled |
| `online_status.is_online` | `boolean` | `true` if publicly reachable on Vercel with active Supabase backend |
| `online_status.vercel_status` | `enum` | `deployed`, `preview`, `pending`, `none` |
| `online_status.vercel_url` | `string` | Canonical production URL (e.g., `https://church-core-lms.vercel.app`) |
| `online_status.supabase_status`| `enum` | `connected`, `pending`, `local_only`, `none` |
| `online_status.readiness_assessment` | `object` | If not online or partially online: readiness score (0-100), active blockers, and immediate actions needed |
| `mvp_status.phase` | `enum` | `alpha`, `beta`, `pilot_ready`, `production` |
| `mvp_status.completion_pct` | `integer` | Engineering completion toward current release gate |
| `latest_changes` | `array[str]` | Summary of recent functional changes, PRs, and refactors |
| `next_steps` | `array[str]` | Immediate upcoming sprint items |
| `ai_session_telemetry.last_model` | `string` | Model used (e.g. `gemini-2.5-pro`, `claude-3-7-sonnet`, `gpt-4o`) |
| `ai_session_telemetry.session_duration_minutes` | `integer` | Active session duration |
| `ai_session_telemetry.summary_of_work` | `string` | High-level synthesis of work completed in the session |
| `deployment_diagnostics.recent_errors` | `array[str]` | Build, runtime, or migration errors encountered |
| `deployment_diagnostics.mitigations_applied` | `array[str]` | Exact code fixes, patches, or configuration changes implemented |
| `governance_compliance` | `object` | Status of council decision acknowledgments, brand guidelines, and sovereign DB isolation |

---

## 4. Edge Reporting Workflow

### Automated CLI Reporting
Each product repo receives `scripts/report-telemetry.py`. At the conclusion of any development session or CI build, the developer or AI agent runs:
```bash
python3 scripts/report-telemetry.py --model "gemini-2.5-pro" --duration 45 --summary "Fixed Turbopack SSR build issue and updated auth layouts"
```

The script automatically:
1. Inspects `package.json` for name and version.
2. Extracts git commit history for latest changes.
3. Checks local `.env*` and Vercel configuration for online deployment targets.
4. Updates `docs/control-plane/telemetry.json`.
5. Prompts or updates `docs/council/ACKNOWLEDGMENTS.md`.

---

## 5. Control Plane Ingestion & Dashboard Compilation

Within `ChurchCore-Business`, the master ingestion script:
```bash
python3 scripts/control-plane-sync.py
```
scans all product repos, validates their `telemetry.json` against `docs/control-plane/telemetry-schema.json`, and renders the live `docs/control-plane/ECOSYSTEM-DASHBOARD.md`.
