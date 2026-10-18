# ChurchCore Sovereign Control Plane: Universal Agent Operational Directives & Code Rules

**Context:** This repository is an official product pillar of the **ChurchCore Ecosystem**.  
**Executive Control Plane:** [ricardojjulia/ChurchCore-Business](https://github.com/ricardojjulia/ChurchCore-Business)  
**Remote Manifest URL:** `https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/governance-sync/manifest.json`  
**Remote Roadmap URL:** `https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/control-plane/CENTRAL-ROADMAP.md`  

---

## 1. Mandatory Session Pre-Flight Check (Session Start)

At the beginning of **EVERY development, refactoring, or maintenance session** in this repository, you must execute the following Council Pre-Flight sequence:

### Step 1: Ingest & Enforce Central Directives
Run the edge enforcement engine at session start:
```bash
python3 scripts/pull-and-enforce-directives.py
# In CI/CD pipelines: python3 scripts/pull-and-enforce-directives.py --strict
```
This automatically fetches the latest manifest from `ChurchCore-Business`, runs code-level audits (RLS, zero-propagation, telemetry, brand badge), and syncs `docs/council/ACKNOWLEDGMENTS.md`.

### Step 2: Check Active Requirements for This Product
1. Review `docs/council/ACKNOWLEDGMENTS.md` for any pending Council Decisions (`COUNCIL-2026-001` through `006`) or Central Directives.
2. Inform the operator of pending council items and incorporate them into the session scope.

---

## 2. Sovereign Testing Council Protocol & Mandatory 3-Phase Gating (COUNCIL-2026-005 & COUNCIL-2026-006)

> [!IMPORTANT]
> **COUNCIL-2026-006: SOVEREIGN TESTING COUNCIL INVARIANT & 3-PHASE VERIFICATION LIFECYCLE**
>
> All development, maintenance, and verification in this repository are strictly bound to the universal 3-phase progression:
>
> 1. **Phase 1: 100% Feature Code Complete + Inseparable Automated Tests**  
>    All programmed features, edge APIs, UI workflows, database schemas, and edge integrations required for MVP must be 100% technically complete and ready for deployment.  
>    *The Inseparable Testing Invariant:* Automated unit tests, integration tests, and regression tests **MUST be created and maintained whenever a new feature is developed or corrected** as standard engineering completeness. Automated testing is strictly forbidden from being deferred to Phase 2.  
>    *Reference your package's roadmap:* `docs/mvp-100-plan.md`.
>
> 2. **Phase 2: Testing Council Gate (Human Trial Testing, Field Pilots & Security Audits)**  
>    Human trial testing (human rehearsals, field pilot trials like the uncoached Colegio Biblos human session, user acceptance testing (UAT), and uncoached live simulations) commences **ONLY after** all features and programmed improvements in Phase 1 are 100% technically complete.  
>    *Testing Council Scope:* Human trials, uncoached user sessions, Row-Level Security leak audits (`npm run audit:rls`), and Sunday Morning SLA latency verification (<50ms). Do not organize or conduct human trial tests while MVP features remain incomplete.
>
> 3. **Phase 3: Production Vercel Deployment & Live Release**  
>    For packages deploying to Vercel (ChurchCore Academy, Orthos, LMS, Care, ChMS, Scholars), clean build exports (`npm run build`), dependency lockfile resolution, and environment bindings must be verified prior to production launch.

---

## 3. Strict Sovereign Invariant (Section III: Zero Data Propagation)

> [!CAUTION]
> **CONSTITUTIONAL INVARIANT**: You are strictly forbidden from implementing background sync daemons, automated event buses, or cross-database replication with sibling product repositories.
> All customer data entered into this product remains 100% sovereign to this application's database. Telemetry must never contain member or church records.

---

## 4. Mandatory Session Close & Telemetry Dispatch (Session Epilogue)

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
- **`mvp_status`**: Current phase (`alpha`, `beta`, `pilot_ready`, `testing_ready`, `production`) and completion percentage (target: 100%).
- **`latest_changes`**: High-level bullet points of functional modifications in this session.
- **`next_steps`**: Immediate technical items for the next developer/agent session.
- **`ai_session_telemetry`**: Last model used, duration in minutes, operator, and work summary.
- **`deployment_diagnostics`**: Any build errors, Turbopack errors, CSP issues, or RLS errors encountered, along with the exact mitigations applied.

### Step 3: Upstream Acknowledgment
If any Council Decision requirement was fulfilled, append the entry to `docs/council/ACKNOWLEDGMENTS.md` and commit alongside your code.

---

## 5. Bidirectional Challenge & Update Protocol (Breaking Command Loops)

> [!IMPORTANT]
> **PREVENTING COMMAND-AND-CHALLENGE INFINITE LOOPS**  
> If central control plane directives, completion percentages, or active tasks do not match the ground truth of this local repository:
>
> 1. **DO NOT re-implement already completed work, and DO NOT enter an argument loop.**
> 2. **Submit an Evidence-Backed Challenge:**  
>    Submit verifiable evidence (git commit SHA, file existence, test pass, or HTTP check) using:
>    ```bash
>    # Mark an MVP roadmap feature complete with proof:
>    python3 scripts/challenge-central-record.py --complete-feature 1 --commit-sha $(git rev-parse --short HEAD) --rationale "Feature 1 implemented with accompanying tests"
>
>    # Challenge a specific telemetry metric (e.g. online status):
>    python3 scripts/challenge-central-record.py --field "online_status.is_online" --value true --evidence-type HTTP_STATUS_PROOF
>
>    # Or run autonomous discrepancy discovery & evidence scanning:
>    python3 scripts/challenge-central-record.py
>    ```
> 3. **Closed-Loop Reconciliation & Immediate Instruction Advancement:**  
>    - The central control plane automatically verifies the submitted proof.  
>    - Upon acceptance, central telemetry (`dashboard/fleet-data.json`, `ECOSYSTEM-DASHBOARD.md`) AND your local roadmap (`docs/mvp-100-plan.md`) are immediately updated.  
>    - In `docs/mvp-100-plan.md`, the completed feature is checked `[x]` and the **Active Instruction Banner** is automatically advanced to the NEXT pending feature.  
>    - On your next session or pre-flight check, you will immediately receive the advanced instruction, permanently terminating repetitive command-challenge cycles.

---

## 6. Mandatory Post-Test Telemetry Synchronization (COUNCIL-2026-008)

> [!IMPORTANT]
> **UNIVERSAL MANDATORY POST-TEST TELEMETRY INVARIANT**  
> On every successful PR push or commit to the repo, after all automated testing is accepted (`npm test` / `vitest` / `unittest`), each application repository MUST run:
> ```bash
> python3 scripts/report-telemetry.py --auto
> ```
> Or explicitly record with verified credentials:
> ```bash
> python3 scripts/report-telemetry.py \
>   --online true \
>   --vercel-url "<canonical-production-url>" \
>   --phase production \
>   --completion 100 \
>   --supabase-status connected \
>   --summary "Production release verified live on Vercel edge and custom domain"
> ```
> This is automatically triggered via `npm run posttest` or `npm run telemetry:report`.
> This guarantees that the Sovereign Control Plane dashboard always reflects ground-truth live production status, clears obsolete rehearsal blockers, and eliminates telemetry drift.

