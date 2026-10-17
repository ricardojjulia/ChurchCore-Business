# ChurchCore Sovereign Control Plane: Product Agent Rule

**Context:** This repository is an official product pillar of the **ChurchCore Ecosystem**.  
**Executive Control Plane:** [ricardojjulia/ChurchCore-Business](https://github.com/ricardojjulia/ChurchCore-Business)  
**Remote Manifest URL:** `https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/governance-sync/manifest.json`  
**Remote Roadmap URL:** `https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/control-plane/CENTRAL-ROADMAP.md`  

---

## 1. Mandatory Session Pre-Flight Check (Session Start)

At the beginning of **EVERY development, refactoring, or maintenance session** in this repository, you must execute the following Council Pre-Flight sequence:

### Step 1: Ingest Central Directives & Roadmap
Fetch the latest governance manifest and central roadmap:
```bash
curl -s https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/governance-sync/manifest.json
curl -s https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/control-plane/CENTRAL-ROADMAP.md
# (Or inspect local sibling /Users/rjulia/ChurchCore-Business/ if present)
```

### Step 2: Check Active Requirements for This Product
1. Identify this product's canonical ID (`churchcore-chms`, `churchcore-lms`, `churchcore-academy`, `churchcore-care`, `churchcore-orthos`, `faithfull-scholars`).
2. Verify if any new Council Decisions (`COUNCIL-2026-001` through `004`) or Central Directives (`CP-2026-DIR-*`) are unacknowledged in `docs/council/ACKNOWLEDGMENTS.md`.
3. Inform the operator of pending council items and incorporate them into the session scope.

---

## 2. Strict Sovereign Invariant (Section III: Zero Data Propagation)

> [!CAUTION]
> **CONSTITUTIONAL INVARIANT**: You are strictly forbidden from implementing background sync daemons, automated event buses, or cross-database replication with sibling product repositories.
> All customer data entered into this product remains 100% sovereign to this application's database. Telemetry must never contain member or church records.

---

## 3. Mandatory Session Close & Telemetry Dispatch (Session Epilogue)

Before concluding your session or opening a PR, you MUST update and verify the product's edge telemetry:

### Step 1: Run Edge Telemetry Script
Run the automated telemetry reporter:
```bash
python3 scripts/report-telemetry.py --model "<your-model-name>" --duration <minutes> --summary "<concise summary of work>"
```
*(Or directly update `docs/control-plane/telemetry.json` matching the schema in `docs/control-plane/telemetry-schema.json`).*

### Step 2: Verify Telemetry Elements
Ensure `docs/control-plane/telemetry.json` includes:
- **`online_status`**: Live Vercel production/preview URL and Supabase connection state. If offline, provide an accurate **Readiness Assessment** (score 0-100, exact blockers, next required deployment actions).
- **`mvp_status`**: Current phase (`alpha`, `beta`, `pilot_ready`, `production`) and completion percentage.
- **`latest_changes`**: High-level bullet points of functional modifications in this session.
- **`next_steps`**: Immediate technical items for the next developer/agent session.
- **`ai_session_telemetry`**: Last model used, duration in minutes, operator, and work summary.
- **`deployment_diagnostics`**: Any build errors, Turbopack errors, CSP issues, or RLS errors encountered, along with the exact mitigations applied.

### Step 3: Upstream Acknowledgment
If any Council Decision requirement was fulfilled, append the entry to `docs/council/ACKNOWLEDGMENTS.md` and commit alongside your code.
