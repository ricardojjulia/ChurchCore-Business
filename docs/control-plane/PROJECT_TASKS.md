# ChurchCore Ecosystem: Central Project Management Task Registry

> **Classification:** Sovereign Ecosystem Task Ledger & Implementation Tracking Base  
> **Source of Truth:** [`docs/control-plane/tasks.json`](tasks.json)  
> **Governing Body:** Executive Control Plane (`ChurchCore-Business`)  
> **Last Updated:** 2026-10-18 17:11:49 UTC  

---

## 1. Executive Task Metrics & Velocity

| Metric | Count | Details |
| :--- | :---: | :--- |
| **Total Tracked Tasks** | **21** | Across 6 Product Pillars + Control Plane Hub |
| **Shipped & Verified (`DONE`)** | **12** | 57% of commitments delivered |
| **Actively In Development (`IN_PROGRESS`)** | **5** | Immediate coding velocity |
| **Awaiting Review / Credentials (`WAITING`)** | **2** | Deployment or credential binding gates |
| **Upcoming Architecture Backlog (`PLANNED`)** | **2** | Scheduled for next sprint cycle |
| **Directionality Ratio** | **85% Edge / 15% Hub** | 18 Repo-Originated • 3 Control-Plane-Dispatched |

### Directionality Legend
- 🔵 **`[EDGE: REPO-ORIGINATED]`**: Initiated directly within the product codebase.
- 🟡 **`[HUB: CONTROL-PLANE-DISPATCHED]`**: Architectural standards or strategic roadmaps imposed centrally.

---

## 2. In-Progress Engineering Tasks (`IN_PROGRESS`)

| Task ID | Product | Directionality | Title & Scope | Assignee | Git / PR Target | Verification Method |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `TSK-CHMS-001` | **CHMS** | 🔵 `EDGE` | **R1d Member Data-Rights Erasure Approval Queue & Lifecycle**<br>Complete admin approval screens, audit logging, and ensure erasure notices dispatch strictly post-commit. | Ricardo J. Julia | `commit a22c36e & b38636f (branch fix/r1d-erasure-approvals)` | `npm run test:e2e:readiness && audit:rls` |
| `TSK-LMS-003` | **LMS** | 🔵 `EDGE` | **Theological Student Credentialing & PDF Certificate Worker**<br>Generate immutable cryptographic certificates upon course completion for AETH ministerial certification. | Ricardo J. Julia | `implementation-plan-2026-q4.md (§2.4)` | `npm run test:prod-synthetic verifies certificate signature` |
| `TSK-ACAD-002` | **ACADEMY** | 🔵 `EDGE` | **Colegio Biblos Participant Login & Uncoached Session**<br>Local preparation is complete. Verify the actual participant browser or VM, run the real uncoached session, sanitize findings, and re-observe any S0-S2 blockers. | Ricardo J. Julia | `Academy docs/plans/2026-10-16-pilot-to-production-completion-plan.md (Workstream C)` | `Dated sanitized session report and recorded Academy owner residual-risk decision` |
| `TSK-CARE-003` | **CARE** | 🔵 `EDGE` | **Merge Faithful Workflows Enhancements Branch**<br>Merge spiritually integrated counseling workflows and practice management modules into main. | Ricardo J. Julia | `branch feat/faithful-workflows-enhancements` | `npm run test:e2e passes across all intake scenarios` |
| `TSK-SCHL-004` | **FAITHFULL-SCHOLARS** | 🔵 `EDGE` | **Fortified FaithFull Community Ecosystem (Multi-Persona Expansion)**<br>Database migration and RLS security hardening expanding the platform to pastors, churches, evangelists, ministers, apologists, and councils with sub-50ms query SLAs. | Ricardo J. Julia | `COUNCIL-2026-007 (REQ-007-01)` | `supabase/migrations/20261018140000_community_ecosystem.sql with passing RLS audit` |

---

## 3. Waiting & Staging Review Blockers (`WAITING`)

| Task ID | Product | Directionality | Title & Scope | Blocker Reason | Immediate Resolution Action |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `TSK-CHMS-003` | **CHMS** | 🟡 `HUB` | **Powered by ChurchCore Trust Badge Integration** | Install official Endorsed Brand trust mark in global portal footer linking to security documentation. | components/layout/footer.tsx contains trust mark asset and passes WCAG AAA contrast |
| `TSK-ACAD-003` | **ACADEMY** | 🔵 `EDGE` | **Academy RLS Verification Privilege Blockers** | The admissions, enrollment-conversion, and LLIS-consent RLS commands cannot complete because local anon/authenticated roles lack required table privileges. No grant change is authorized by governance telemetry. | All three repository-owned RLS commands complete successfully after an Academy-scoped security review |

---

## 4. Upcoming Planned Backlog (`PLANNED`)

| Task ID | Product | Directionality | Title & Scope | Priority | Target Milestone |
| :--- | :--- | :---: | :--- | :---: | :--- |
| `TSK-CHMS-002` | **CHMS** | 🔵 `EDGE` | **Vercel Cron Automation (shepherd-ai & scheduled communications)** | `P1_HIGH` | `v3.6.0` |
| `TSK-HUB-001` | **ECOSYSTEM-CONTROL-PLANE** | 🟡 `HUB` | **Universal AppSwitcher Navigation Shell Standard** | `P1_HIGH` | `2026-11-15` |

---

## 5. Shipped & Verified Archive (`DONE`)

| Task ID | Product | Directionality | Milestone Delivered | Git Reference | Verification Status |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `TSK-LMS-001` | **LMS** | 🔵 `EDGE` | **Turbopack use-server SSR Compilation Bug Resolution** | `PR #89 (commit 83933a2)` | ✅ VERIFIED |
| `TSK-LMS-002` | **LMS** | 🔵 `EDGE` | **Neutral Pre-Auth Gateway & Dynamic Institutional Branding** | `PR #88 (commit fe412f0)` | ✅ VERIFIED |
| `TSK-ACAD-001` | **ACADEMY** | 🔵 `EDGE` | **Colegio Biblos Local Pilot Charter Approval & Preparation** | `PR #247 & PR #248 (commit bed47c2)` | ✅ VERIFIED |
| `TSK-CARE-001` | **CARE** | 🔵 `EDGE` | **Mobile Vite Lockfile Resolution & Dependency Alignment** | `PR #139 (commit 188f9df)` | ✅ VERIFIED |
| `TSK-CARE-002` | **CARE** | 🔵 `EDGE` | **Clinical EHR & Pastoral Counseling Intake Verification** | `v7.0.0-RELEASE-SUMMARY.md` | ✅ VERIFIED |
| `TSK-ORTH-001` | **ORTHOS** | 🔵 `EDGE` | **Departmental Ministry Governance & Maturity Engine Shipped** | `PR #25 (commit 3296855)` | ✅ VERIFIED |
| `TSK-ORTH-002` | **ORTHOS** | 🔵 `EDGE` | **Compensating Safeguarding Controls for Small Churches** | `PR #24 (commit a196eba)` | ✅ VERIFIED |
| `TSK-ORTH-003` | **ORTHOS** | 🟡 `HUB` | **Omni-Council Compliance Rehearsal & Cloud Supabase Binding** | `COUNCIL-2026-004 (REQ-004-02)` | ✅ VERIFIED |
| `TSK-SCHL-001` | **FAITHFULL-SCHOLARS** | 🔵 `EDGE` | **Cloudflare Turnstile CSP Header Directive Resolution** | `PR #85 (commit c508488)` | ✅ VERIFIED |
| `TSK-SCHL-002` | **FAITHFULL-SCHOLARS** | 🔵 `EDGE` | **Honest Launch Surface & Spanish Localization Merged Live** | `PR #86 & PR #87 (commit 5edc51b)` | ✅ VERIFIED |
| `TSK-ORTH-004` | **ORTHOS** | 🔵 `EDGE` | **Phase 1 MVP 100% Completion & Pilot Readiness (v0.18.2)** | `PR #29 (commit 8d63567)` | ✅ VERIFIED |
| `TSK-SCHL-003` | **FAITHFULL-SCHOLARS** | 🔵 `EDGE` | **Faculty Profile Public Monograph Index & Peer-Reviewed Scholarly Portfolio** | `commit 75c18eb (branch feat/council-007-community-expansion-and-monographs merged to main)` | ✅ VERIFIED |

