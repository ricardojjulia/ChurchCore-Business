# ChurchCore Sovereign Infrastructure, Vercel Pro & Supabase Pro Cloud Landscape Report

- **Document ID**: `COUNCIL-2026-013`
- **Classification**: Sovereign Architecture & Cloud FinOps Certification
- **Date**: October 29, 2026
- **Governing Authority**: ChurchCore High Sovereign Council (`ChurchCore-Business`)
- **Constitutional Invariant**: Section III — *Zero Cross-Application Customer Data Propagation* (`0.00%` Shared Customer Tables)
- **Verification Status**: **100% CERTIFIED (`7/7` Vercel Pro Deployments `READY` · `8/8` Supabase Pro Databases `ACTIVE_HEALTHY` · `584` Live Tables/Views · `11/11` Security Checks Passing)**

---

## 1. Executive Summary

The **ChurchCore Ecosystem** operates a **7-Repository Sovereign Product & Governance Fleet** deployed on **Vercel Pro** (`churchcore` Team) and backed by **8 physically isolated PostgreSQL databases** consolidated under a single **Supabase Pro Organization** (`ChurchCore` / `bqpjefzdlxksskyrvkrt`).

Following the execution of **Option B (Cloud-Native Next.js 16 Control Plane)** and the **Full Fleet Cloud & Database Consolidation**, every application in the portfolio now satisfies all constitutional, operational, and financial governance mandates:

1. **100% Paid Tier Coverage (Zero Free-Tier Pause or Commercial Licensing Risk)**:
   - All **7 Vercel projects** run inside the **`churchcore` Vercel Pro Team** (`$20/mo` base seat).
   - All **8 Supabase PostgreSQL databases** run inside the **`ChurchCore` Supabase Pro Organization (`bqpjefzdlxksskyrvkrt`)** (`$25/mo` base + `$10/mo` per additional compute instance), eliminating the Supabase Free-Tier 2-project limit and 7-day inactivity pause risk.
2. **100% Physical Database Silo Isolation (Constitution Section III)**:
   - Each product suite connects exclusively to its own dedicated Supabase project reference (`xsmcurhmgmnxxppkorpq`, `iopydttovnyjgikprvol`, `tpyvciujsrllvowqgeyq`, `nvklkmsnqqrjzirnhfzr`, `ujtwcrulqawzvggehxjf`, `vnuoibklcldxadffmitj`, `yxrvrjkzlumenlvczqjd`, `ukekzedrnkqauiwfnilb`).
   - Across the fleet, **584 relational tables and views** are deployed and protected by PostgreSQL Row-Level Security (`ENABLE` + `FORCE ROW LEVEL SECURITY`).
3. **Autonomous Cloud Governance & GitHub Repo Operator**:
   - The Control Plane (`https://churchcore-control-plane.vercel.app`) is wired to all 6 product repositories via **HMAC-SHA256 GitHub Webhooks** (`#704475956` through `#704475978`) and an authenticated **GitHub Repo Operator (`/api/repo-ops`)** capable of inspecting trees, pulling files, pushing directives, opening PRs, and auto-committing ratified Council deliberations (`docs/deliberations/DELIB-*.md`).

---

## 2. Complete 7-Project Vercel Pro Landscape (`churchcore` Team)

All 7 production deployments are hosted under the **`churchcore` Vercel Pro Team** (`team_fd3iG9bbj9hr1nH9t0E8eb8D`), providing commercial usage rights, `1 TB` fast origin transfer, `10,000,000` edge requests, and up to `40` cron jobs per project.

| # | Product / Suite | Vercel Project | Tier | State | Production Domain | Env Vars | Active Cron Schedules | Monthly Cron Runs |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| **1** | **ChurchCore ChMS** | `church-core-ops` | **Pro** | `READY` (`200`) | `https://www.churchcore.io` | 26 | `*/5 * * * *`, `0 2 * * *`, `0 3 * * *` | ~8,700 / mo |
| **2** | **ChurchCore LMS** | `church-core-lms` | **Pro** | `READY` (`200`) | `https://www.churchcorelms.io` | 6 | None (`0`) | 0 / mo |
| **3** | **ChurchCore Academy** | `church-core-academy` | **Pro** | `READY` (`200`) | `https://www.churchcoreacademy.io` | 12 | `* * * * *`, `0 */6 * * *`, `0 6 * * *` | ~43,350 / mo |
| **4** | **ChurchCore Care** | `churchcore-care` | **Pro** | `READY` (`200`) | `https://www.churchcorecare.io` | 20 | `2x * * * * *`, `0 * * * *`, `0 8 * * *` | ~87,150 / mo |
| **5** | **ChurchCore Orthos** | `church-core-orthos` | **Pro** | `READY` (`200`) | `https://church-core-orthos.vercel.app` | 8 | None (`0`) | 0 / mo |
| **6** | **FaithFull Scholars** | `faith-full-scholars` | **Pro** | `READY` (`200`) | `https://www.faithgrid.io` | 21 | `0 13 * * *` | ~30 / mo |
| **7** | **Sovereign Control Plane** | `churchcore-control-plane` | **Pro** | `READY` (`200`) | `https://churchcore-control-plane.vercel.app` | 13 | `*/15 * * * *` (`/api/cron/fleet-sync`) | ~2,880 / mo |
| **—** | **Fleet Totals** | **7 Projects** | **100% Pro** | **7/7 `READY`** | **7 Live Edge Origins** | **106 Vars** | **11 Cron Definitions** | **~142,110 / mo** |

### Vercel Function & Cron Capacity Analysis
- **Current Monthly Cron Footprint**: `~142,110` invocations/month (`~14.2%` of the 1,000,000 base Function Invocation allowance included in Vercel Pro).
- **High-Frequency Outbox Worker Note**:
  - `churchcore-care` runs two every-minute (`* * * * *`) workers (`/api/cron/outbox` and `/api/cron/notifications` = `86,400` runs/month).
  - `church-core-academy` runs one every-minute (`* * * * *`) worker (`/api/jobs/sis-outbox/process` = `43,200` runs/month).
  - **FinOps Optimization Option**: Relaxing those three `* * * * *` crons to `*/5 * * * *` (matching `church-core-ops`) reduces fleet cron invocations from **~142,110/mo to ~38,430/mo** (`73%` reduction in background compute).

---

## 3. Complete 8-Database Supabase Pro Landscape (`bqpjefzdlxksskyrvkrt`)

All **8 PostgreSQL 17 databases** operate inside the single **`ChurchCore` Supabase Pro Organization (`bqpjefzdlxksskyrvkrt`)**, guaranteeing daily automated backups, zero inactivity pausing, and 100% physical tenant/application isolation.

| # | Database Name | Project Ref | Org ID | Region | Engine | Health Status | PostgREST | Live Tables / Views | Role & Scope |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | **ChurchCore Ops** | `xsmcurhmgmnxxppkorpq` | `bqpjefzdlxksskyrvkrt` | `us-east-1` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **137** | Primary ChMS Tenant & Sunday SLA Database |
| **2** | **ChurchCore Ops Control Plane** | `iopydttovnyjgikprvol` | `bqpjefzdlxksskyrvkrt` | `us-east-1` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **7** | ChMS Platform Admin & Demo Feedback DB |
| **3** | **ChurchCore LMS** | `tpyvciujsrllvowqgeyq` | `bqpjefzdlxksskyrvkrt` | `us-east-2` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **100** | Seminary & Discipleship LMS Database |
| **4** | **churchcore-academy** | `nvklkmsnqqrjzirnhfzr` | `bqpjefzdlxksskyrvkrt` | `us-east-1` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **153** | K-12 Classical & Christian SIS Database (123 Migrations) |
| **5** | **churchcore-care-demo** | `ujtwcrulqawzvggehxjf` | `bqpjefzdlxksskyrvkrt` | `us-east-1` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **97** | Pastoral Care & `pgcrypto` HIPAA Vault Database |
| **6** | **churchcore-orthos** | `vnuoibklcldxadffmitj` | `bqpjefzdlxksskyrvkrt` | `us-east-1` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **28** | Patristic Study, Confessional & Safeguarding DB (8 Migrations) |
| **7** | **faithfull-scholars-prod** | `yxrvrjkzlumenlvczqjd` | `bqpjefzdlxksskyrvkrt` | `us-east-1` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **56** | Scholarship Endowment & Donor Allocation Database |
| **8** | **churchcore-control-plane** | `ukekzedrnkqauiwfnilb` | `bqpjefzdlxksskyrvkrt` | `us-east-1` | PG 17 | `ACTIVE_HEALTHY` | `200 OK` | **6** | Sovereign Control Plane Governance & Telemetry Hub |
| **—** | **Fleet Totals** | **8 Isolated Refs** | **1 Pro Org** | **US East** | **PG 17** | **8/8 Healthy** | **8/8 `200`** | **584 Tables/Views** | **0.00% Cross-App Customer Data Sharing** |

### Zero-Row PostgREST Keep-Alive Shield
During every 15-minute `/api/cron/fleet-sync` cycle, the Control Plane executes `pingSupabaseKeepAlive()` in [`src/lib/sync/fleet-synchronizer.ts`](file:///Users/rjulia/ChurchCore-Business/src/lib/sync/fleet-synchronizer.ts), dispatching a **zero-row `HEAD` request** against each product's PostgREST root (`/rest/v1/`). This verifies database responsiveness and records availability latency without reading, querying, or propagating a single row of customer data.

---

## 4. Autonomous GitHub Webhook Mesh & Repo Operator (`/api/repo-ops`)

All 6 product repositories are connected to `https://churchcore-control-plane.vercel.app/api/webhooks/github` via HMAC-SHA256 signed webhooks (`WEBHOOK_SECRET`) and managed by [`src/lib/github/repo-operator.ts`](file:///Users/rjulia/ChurchCore-Business/src/lib/github/repo-operator.ts):

| Product ID | GitHub Repository | Webhook ID | Subscribed Events | Status | Cloud Capabilities (`/api/repo-ops`) |
| :--- | :--- | :---: | :--- | :---: | :--- |
| `churchcore-chms` | `ricardojjulia/ChurchCore` | `#704475956` | `push`, `pull_request`, `deployment_status` | `ACTIVE` | `inspect`, `pull_file`, `push_file`, `open_pr`, `dispatch` |
| `churchcore-lms` | `ricardojjulia/ChurchCore-LMS` | `#704475960` | `push`, `pull_request`, `deployment_status` | `ACTIVE` | `inspect`, `pull_file`, `push_file`, `open_pr`, `dispatch` |
| `churchcore-academy` | `ricardojjulia/ChurchCore-Academy` | `#704475963` | `push`, `pull_request`, `deployment_status` | `ACTIVE` | `inspect`, `pull_file`, `push_file`, `open_pr`, `dispatch` |
| `churchcore-care` | `ricardojjulia/ChurchCoreCare` | `#704475966` | `push`, `pull_request`, `deployment_status` | `ACTIVE` | `inspect`, `pull_file`, `push_file`, `open_pr`, `dispatch` |
| `churchcore-orthos` | `ricardojjulia/ChurchCore-Orthos` | `#704475974` | `push`, `pull_request`, `deployment_status` | `ACTIVE` | `inspect`, `pull_file`, `push_file`, `open_pr`, `dispatch` |
| `faithfull-scholars` | `ricardojjulia/FaithFullScholars` | `#704475978` | `push`, `pull_request`, `deployment_status` | `ACTIVE` | `inspect`, `pull_file`, `push_file`, `open_pr`, `dispatch` |
| `ecosystem-control-plane` | `ricardojjulia/ChurchCore-Business` | Self-Hosted | Auto-Commit Ledger (`docs/deliberations/`) | `ACTIVE` | `inspect`, `pull_file`, `push_file`, `open_pr`, `dispatch` |

---

## 5. Consolidated Cloud FinOps & Monthly OpEx Summary

| Cloud Provider | Organization / Team | Plan Tier | Included Fleet Assets | Base Cost | Compute / Instance Add-Ons | Est. Monthly Total |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **Vercel** | `churchcore` | **Pro Plan** | All **7** Production Next.js Projects + 11 Crons | `$20 / mo` | `$0 / mo` (within 1M function & 1TB bandwidth quota) | **`$20 / mo`** |
| **Supabase** | `ChurchCore` (`bqpjefzdlxksskyrvkrt`) | **Pro Plan** | All **8** Isolated PostgreSQL 17 Projects (584 tables) | `$25 / mo` | `~$40–$50 / mo` (Micro compute instances across fleet) | **`~$65–$75 / mo`** |
| **GitHub** | `ricardojjulia` | **GitHub** | All **7** Repositories + 6 Webhooks + REST API | `$0 / mo` | `$0 / mo` | **`$0 / mo`** |
| **Total Fleet Cloud OpEx** | **Unified Pro Stack** | **100% Paid Pro** | **7 Apps + 8 Isolated DBs + 584 Tables** | **`$45 / mo`** | **`~$40–$50 / mo`** | **`~$85–$95 / mo`** |

---

## 6. 11/11 Security, RLS & Governance Certification Ledger

Verified continuously via [`/api/arch-check`](file:///Users/rjulia/ChurchCore-Business/src/app/api/arch-check/route.ts) and `npm run check`:

1. **`CHK-01` (`COUNCIL-2026-011`)**: Next.js 16 App Router Runtime & TypeScript Strict Mode (`PASS`)
2. **`CHK-02` (`COUNCIL-2026-012`)**: Edge Proxy Auth Gate (`src/proxy.ts`) & Public Route Whitelist (`PASS`)
3. **`CHK-03` (`COUNCIL-2026-012`)**: Timing-Safe Cron & HMAC-SHA256 GitHub Webhook Verification (`PASS`)
4. **`CHK-04` (`COUNCIL-2026-012`)**: 100% Forced PostgreSQL Row-Level Security (`6/6` Control Plane tables `ENABLE` + `FORCE RLS`) (`PASS`)
5. **`CHK-05` (`CONSTITUTION-SEC-III`)**: Zero Cross-Application Customer Data Propagation (`0` PII columns) (`PASS`)
6. **`CHK-06` (`REQ-008-02`)**: Telemetry & Readiness Score Immutability (`readiness_score_pct`, `completion_pct`, `phase`, `blockers` preserved) (`PASS`)
7. **`CHK-07` (`COUNCIL-2026-011`)**: Bilingual English / Spanish (`EN` / `ES`) Executive Briefing Parity (`PASS`)
8. **`CHK-08` (`COUNCIL-2026-011`)**: Scheduled Fleet Synchronizer (`vercel.json` — `*/15 * * * *`) (`PASS`)
9. **`CHK-09` (`COUNCIL-2026-012`)**: Action Wrapper (`createAuthenticatedAction`) & Zod Input Validation (`PASS`)
10. **`CHK-10` (`COUNCIL-2026-011`)**: Legacy Cockpit Parity & Static Bundle Integrity (`dashboard/app.js` + `public/app.js`) (`PASS`)
11. **`CHK-11` (`COUNCIL-2026-012`)**: GitHub Repository Operator (`/api/repo-ops`) & Multi-Repo Push/Pull/PR Bridge (`PASS`)

