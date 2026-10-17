# ChurchCore Ecosystem: Central Project Management Task Registry

> **Classification:** Sovereign Ecosystem Task Ledger & Implementation Tracking Base  
> **Source of Truth:** [`docs/control-plane/tasks.json`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/tasks.json)  
> **Governing Body:** Executive Control Plane (`ChurchCore-Business`)  
> **Last Updated:** October 17, 2026  

---

## 1. Executive Task Metrics & Velocity

| Metric | Count | Details |
| :--- | :---: | :--- |
| **Total Tracked Tasks** | **18** | Across 6 Product Pillars + Control Plane Hub |
| **Shipped & Verified (`DONE`)** | **8** | 44% of sprint commitments delivered to production |
| **Actively In Development (`IN_PROGRESS`)** | **4** | Immediate coding velocity |
| **Awaiting Review / Credentials (`WAITING`)** | **4** | Deployment or credential binding gates |
| **Upcoming Architecture Backlog (`PLANNED`)** | **2** | Scheduled for next sprint cycle |
| **Directionality Ratio** | **72% Edge / 28% Hub** | 13 Repo-Originated • 5 Control-Plane-Dispatched |

### Directionality Legend
- 🔵 **`[EDGE: REPO-ORIGINATED]`**: Initiated directly within the product codebase (e.g., Ricardo working in localized features, urgent hotfixes, Turbopack SSR patches, Colegio Biblos charter).
- 🟡 **`[HUB: CONTROL-PLANE-DISPATCHED]`**: Architectural standards, branding mandates, RLS compliance, or strategic roadmaps imposed centrally from `ChurchCore-Business`.

---

## 2. In-Progress Engineering Tasks (`IN_PROGRESS`)

| Task ID | Product | Directionality | Title & Scope | Assignee | Git / PR Target | Verification Method |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `TSK-CHMS-001` | **ChMS** | 🔵 `EDGE` | **R1d Member Data-Rights Erasure Approval Queue**<br>Admin approval screens, audit logging, and post-commit notice dispatching. | Ricardo J. Julia | `branch fix/r1d-erasure-approvals`<br>(commit `a22c36e`) | `npm run test:e2e:readiness` |
| `TSK-LMS-003` | **LMS** | 🔵 `EDGE` | **Theological Student Credentialing & PDF Worker**<br>Cryptographic completion certificate generation for AETH ministerial certification. | Ricardo J. Julia | `implementation-plan-2026-q4.md` | `npm run test:prod-synthetic` |
| `TSK-ACAD-002` | **Academy** | 🔵 `EDGE` | **OneRoster 1.2 CSV Worker & Seed Rehearsal**<br>Resolving sequence insertion order and foreign key locks on `grade_levels`. | Ricardo J. Julia | `competitive-execution-plan.md` | `npm run db:seed:pilot` |
| `TSK-CARE-003` | **Care** | 🔵 `EDGE` | **Merge Faithful Workflows Enhancements Branch**<br>Spiritually integrated counseling workflows and practice management modules. | Ricardo J. Julia | `branch feat/faithful-workflows` | `npm run test:e2e` |

---

## 3. Waiting & Staging Review Blockers (`WAITING`)

| Task ID | Product | Directionality | Title & Scope | Blocker Reason | Immediate Resolution Action |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `TSK-CHMS-003` | **ChMS** | 🟡 `HUB` | **Powered by ChurchCore Trust Badge**<br>Footer trust mark linking to security documentation. | Scheduled for next sprint cycle | Install trust mark component in `components/layout/footer.tsx`. |
| `TSK-ACAD-003` | **Academy** | 🟡 `HUB` | **Production Vercel Cloud Binding & Domain**<br>Promoting from local rehearsal to 100% online status. | Awaiting production Vercel project credentials binding | Bind environment variables to dedicated Supabase cloud instance. |
| `TSK-ORTH-003` | **Orthos** | 🟡 `HUB` | **Omni-Council Compliance Rehearsal & Cloud Link**<br>Promoting preview deployment to production. | Awaiting execution of `npm run test:omni-council` | Execute full compliance rehearsal and bind production keys. |
| `TSK-HUB-001` | **Control Plane** | 🟡 `HUB` | **Universal AppSwitcher Navigation Shell**<br>Shared cross-app navigation standard. | Awaiting shared package extraction | Extract standardized React `AppSwitcher` component (OPS-02). |

---

## 4. Upcoming Planned Backlog (`PLANNED`)

| Task ID | Product | Directionality | Title & Scope | Priority | Target Milestone |
| :--- | :--- | :---: | :--- | :---: | :--- |
| `TSK-CHMS-002` | **ChMS** | 🔵 `EDGE` | **Vercel Cron Automation** (`shepherd-ai` & scheduled communications) | `P1_HIGH` | `v3.6.0` |
| `TSK-ACAD-001` | **Academy** | 🔵 `EDGE` | **Bilingual Spanish Student Gradebook & Attendance Tracking** | `P1_HIGH` | `v0.11.0` |

---

## 5. Shipped & Verified Archive (`DONE`)

| Task ID | Product | Directionality | Milestone Delivered | Git Reference | Shipped Date |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `TSK-LMS-001` | **LMS** | 🔵 `EDGE` | **Turbopack use-server SSR Compilation Bug Fix**<br>Converted server actions to explicit async exports. | PR #89 (commit `83933a2`) | 2026-10-16 |
| `TSK-LMS-002` | **LMS** | 🔵 `EDGE` | **Neutral Pre-Auth Gateway & Dynamic Branding**<br>Unmounted sidebar and dynamic tenant branding live on Vercel. | PR #88 (commit `fe412f0`) | 2026-10-16 |
| `TSK-CARE-001` | **Care** | 🔵 `EDGE` | **Mobile Vite Lockfile Resolution & Clean Build**<br>Unified `package-lock.json` overrides. | PR #139 (commit `188f9df`) | 2026-10-17 |
| `TSK-CARE-002` | **Care** | 🔵 `EDGE` | **Clinical EHR & Pastoral Intake Production Release**<br>Live on `churchcore-care.vercel.app` & `www.churchcorecare.io`. | `v7.0.0-RELEASE-SUMMARY.md` | 2026-10-17 |
| `TSK-ORTH-001` | **Orthos** | 🔵 `EDGE` | **Departmental Ministry Governance Engine (v0.18.0)**<br>Maturity scoring and safeguarding audits shipped. | PR #25 (commit `3296855`) | 2026-10-16 |
| `TSK-ORTH-002` | **Orthos** | 🔵 `EDGE` | **Compensating Safeguarding Controls for Small Churches**<br>Automated board oversight and dual-signoff workflows. | PR #24 (commit `a196eba`) | 2026-10-15 |
| `TSK-SCHL-001` | **Scholars** | 🔵 `EDGE` | **Cloudflare Turnstile CSP Header Directive Fix**<br>Allowed `challenges.cloudflare.com` for sign-up completion. | PR #85 (commit `c508488`) | 2026-10-16 |
| `TSK-SCHL-002` | **Scholars** | 🔵 `EDGE` | **Honest Launch Surface & Spanish Localization Merged**<br>Bilingual faculty research platform live on Vercel. | PR #87 (commit `5edc51b`) | 2026-10-16 |
| `TSK-ACAD-001` | **Academy** | 🔵 `EDGE` | **Colegio Biblos Local Pilot Charter Formal Approval**<br>Approved legal and technical baseline for pilot launch. | PR #247 (commit `f44c6b7`) | 2026-10-17 |

---

## 6. How Tasks Are Managed & Synchronized

1. **CLI Management**:
   ```bash
   python3 scripts/manage-tasks.py --action list
   python3 scripts/manage-tasks.py --action update --id TSK-ACAD-003 --status in_progress
   ```
2. **Automated Control Plane Sync**:
   When `python3 scripts/control-plane-sync.py` runs, it re-indexes `tasks.json`, updates this markdown document, and exports fresh JSON to the interactive web dashboard.
