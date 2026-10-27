# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-10-27 03:09:24 UTC`
> **Authority:** Council Decisions COUNCIL-2026-001 through 004 & Constitution §III  

## 1. Executive Telemetry & Fleet Health KPI

| Fleet Metric | Value | Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Sovereign Repos** | `6` | 6 Products | 🟢 Complete Fleet |
| **Active Production Online** | `6 / 6` | 6 / 6 | 🟢 100% Online |
| **Average Readiness Score** | `93%` | 100% | 🟢 High Readiness |
| **Portfolio MVP Progress** | `99%` | 100% | 🟢 On Schedule |
| **Cross-App Data Isolation** | `VERIFIED` | Evidence from every product | 🛡️ All edge reports verified |

## 2. Product Fleet Status Cards

### ChurchCore (`churchcore-chms`) — v4.0.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcore.io](https://www.churchcore.io) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness** | `96%` | No score basis supplied |

##### ⚠️ Readiness Assessment
**Active Blockers:**
- 🔴 External validation (O15): a pilot church and a real Planning Center / Breeze export dry run
- 🔴 Owner actions O23 (churchcore.io mail), O24 (Business repo visibility), O25 (native Spanish review), O26 (GHAS), O27 (Vercel log forensics), O28 (Firewall rule)
- 🔴 Post-deploy checks for 4.0.0 not yet completed by the owner (sign-in, test email/SMS, Stripe test webhook); runtime logs were clean for 12 h after release

**Immediate Next Required Actions:**
- 🛠️ Owner: RELEASE_CHECKLIST.md post-deploy checks still pending: sign in and reach /app/church-admin/readiness; send a test email and SMS; fire a Stripe test webhook (then verify the rows read-only)
- 🛠️ Recruit a pilot church; run a real Planning Center / Breeze export migration dry run (O15)
- 🛠️ Optional new row: whole-screen localization of staff pages (thrown errors and static labels stay English by design today)

#### MVP Development Status & Milestones
- **Current Phase:** `PRODUCTION`
- **Completion Percentage:** `96%`
- **Recent Milestones Delivered:**
  - ✅ Localization of returned refusal messages complete (S94 #239, S96 #242, S96b #244 and #245): every module that returns user-visible refusals has codes and en/es/es-PR text (Council Reviews 74-77)
  - ✅ Security patches deployed: Next.js 16.4.3 critical advisories (#240), undici/zod/fast-uri lockfile patch (#243)
  - ✅ CI: concurrency cancel-in-progress for pull requests only, pull_request triggers restricted to main (#237); test flakes B-119, B-120, B-121 fixed (#238, #241)
  - ✅ Post-release: smoke routes 200, Vercel runtime logs clean for 12 h after 4.0.0
  - ✅ MVP released as 4.0.0 on 2026-10-22 (release PR #235, signed tag v4.0.0), readiness 96/100
  - ✅ All five Stretch rows merged: G1.9 #230, G1.10 #231, G3.4 #232, G2.3 #233, G4.3 #234 (Council Reviews 69-73)

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(i18n): localized staff messages — church admin, operations, elders, giving admin (S96b part 2) (#245) (cddc803)`
- `feat(i18n): localized portal, communications, groups and data-rights messages (S96b part 1) (#244) (c28dcb0)`
- `fix(security): patch undici, zod and fast-uri advisories (lockfile only) (#243) (9a050d0)`
- `feat(i18n): localized member giving, registration and check-in messages (S96 batch 1) (#242) (04973a5)`

**Next Engineering Steps:**
- 🎯 Owner: RELEASE_CHECKLIST.md post-deploy checks still pending: sign in and reach /app/church-admin/readiness; send a test email and SMS; fire a Stripe test webhook (then verify the rows read-only)
- 🎯 Recruit a pilot church; run a real Planning Center / Breeze export migration dry run (O15)
- 🎯 Owner actions O23-O28, including the O25 native Spanish review (e.g. 'ofrendante' vs 'donante', 'registro de asistencia')

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `claude-opus-5-5`
- **Session Duration:** `4428 minutes`
- **Session Timestamp:** `2026-10-25T18:29:40.354831+00:00`
- **Session Operator:** `Ricardo Julia`
- **Session Work Summary:** Reconciled edge challenge CHAL-CHURCHCORE-CHMS-FEAT2-def471e: feature_completion -> Feature 2: Vercel Edge Cron Automation (shepherd-ai & scheduled comms) Complete. Advanced active instruction to Feature 2: Vercel Edge Cron Automation (shepherd-ai & scheduled comms).

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-25] PR #245 e2e: member data-rights page kept a hidden copy of the previous render, so a strict text locator matched twice` | `[2026-10-25] Locator matches the visible element only (same fix as the guided-migration spec in #238)` |
| `[2026-10-24/25] CI e2e setup hit Docker Hub 'toomanyrequests' (rate and data limits) on several runs` | `[2026-10-24/25] Re-ran the failed e2e jobs; all green before merge` |
| `[2026-10-23] Mantine transition timers fired after jsdom teardown and failed unrelated vitest runs (B-119, B-121)` | `[2026-10-23] 400 ms grace period in vitest.setup.ts afterAll before jsdom teardown (#241)` |
| `[2026-10-23] Next.js and transitive dependency security advisories (critical RCE / Server Actions DoS in Next; undici, zod, fast-uri)` | `[2026-10-23] Next.js 16.4.3 (#240) and targeted lockfile patches (#243); production deploys confirmed` |
| `[2026-10-22] G4.3 e2e: CI DB user cannot set session_replication_role` | `[2026-10-22] Spec keeps its church and deletes only its own rows` |

---

### ChurchCore LMS (`churchcore-lms`) — v0.47.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcorelms.io](https://www.churchcorelms.io) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness** | `95%` | No score basis supplied |

##### ⚠️ Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions:**
- 🛠️ Verify Turbopack build on Vercel preview branch
- 🛠️ Conduct student credentialing certificate PDF generation test

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ PR #89 merged: Turbopack use-server SSR build error resolved & auth layout polished
  - ✅ PR #88 merged: Neutral pre-auth and dynamic branding with Powered by ChurchCore badge live
  - ✅ Supabase pg_net extension enabled and release build 0.36.1 deployed

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Merge pull request #106 from ricardojjulia/feat/council-010-011-enforcement (3acc551)`
- `fix(governance): standardize scoped package reference and update lockfile (a26782e)`
- `feat(governance): implement COUNCIL-2026-010 AI gateway and COUNCIL-2026-011 localization governance (93db050)`
- `Merge pull request #105 from ricardojjulia/fix/control-plane-fail-closed (7b668a1)`

**Next Engineering Steps:**
- 🎯 Test course completion webhook integration with local certification service
- 🎯 Run full synthetic production test suite (npm run test:prod-synthetic)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-27T03:08:58.861076+00:00`
- **Session Operator:** `Ricardo Julia`
- **Session Work Summary:** Routine development & maintenance

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-16] Turbopack use-server sync export error during Vercel edge compilation.` | `[2026-10-16] Converted server action exports to explicit async functions in compliance with Turbopack specifications (PR #89).` |
| `[2026-10-15] Sidebar layout flickering on pre-auth /login route.` | `[2026-10-16] Unmounted sidebar layout specifically for pre-auth route boundaries.` |

---

### ChurchCore Academy (`churchcore-academy`) — v0.10.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcoreacademy.io](https://www.churchcoreacademy.io) |
| **Supabase Database** | `LOCAL_ONLY` | Sovereign isolation reported and verified |
| **Phase 1 engineering readiness** | `100%` | The repository-defined functional MVP and its inseparable automated verification are complete. This score is the Phase 1 entry gate for human testing; it is not pilot completion or production authorization. |
| **Phase 2 Human Validation** | `ENTRY_GATE_PENDING` | Verify participant login from the actual Colegio Biblos browser or VM. |
| **Phase 3 Production Authorization** | `NOT_GRANTED` | Authenticated Vercel evidence proves a Ready production-target deployment exists; it does not prove an owner-approved Phase 3 production release. |

#### MVP Development Status & Milestones
- **Current Phase:** `PILOT_READY`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ PR #256 aligned Academy compliance with Control Plane (REQ-002-01, REQ-010-01..03, REQ-011-02..03) and standardized Node 22.
  - ✅ PR #248 recorded Colegio Biblos local/private pilot preparation.
  - ✅ PR #247 approved the Colegio Biblos local pilot charter.

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(governance): align Academy compliance with Control Plane and upgrade Node 22 (#256) (6270f53)`
- `chore(telemetry): automated edge check-in (COUNCIL-2026-008) (#254) (3970d41)`
- `Reconcile Academy deployment and readiness telemetry (#253) (31ab6bc)`
- `Refresh the Academy admin dashboard (#252) (737525c)`

**Next Engineering Steps:**
- 🎯 Verify the actual Colegio Biblos participant login on the approved local/private topology.
- 🎯 Complete the uncoached pilot session before adding feature work.
- 🎯 Record sanitized findings and re-observe any S0-S2 blockers before accepting Workstream C residual risk.

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `claude-opus-5-5`
- **Session Duration:** `10 minutes`
- **Session Timestamp:** `2026-10-26T23:00:16.699763+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Full Control Plane telemetry refresh: directive preflight passed (27 requirements, 14 pending/manual, unchanged from ledger); npm run verify passed (2,240/2,240 tests, lint clean, build succeeded); verify:governance passed; corrected tech_stack TypeScript version to installed 6.0.3.

- 🟢 *No active deployment errors logged.*

---

### ChurchCoreCare (`churchcore-care`) — v7.0.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcorecare.io](https://www.churchcorecare.io) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness** | `100%` | No score basis supplied |

#### MVP Development Status & Milestones
- **Current Phase:** `PRODUCTION`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ Vercel production deployment verified live at churchcore-care.vercel.app and www.churchcorecare.io
  - ✅ PR #139 merged: Mobile Vite lockfile resolution and dependency alignment
  - ✅ Counseling intake, pastoral notes, and secure consent flows verified in production

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `chore(governance): enforce COUNCIL-2026-010 and COUNCIL-2026-011 in telemetry compliance reporting (#159) (f66a91ad)`
- `chore(telemetry): record session close edge telemetry and PR reconciliation (#158) (969b141e)`
- `chore(governance): synchronize council directives, reconcile telemetry, and record dependency merges (#157) (1bdd774f)`
- `chore(deps-dev): bump vite from 8.3.0 to 8.3.3 (#143) (d90d5292)`

**Next Engineering Steps:**
- 🎯 Verify production serverless cron execution at /api/cron/scheduler
- 🎯 Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `60 minutes`
- **Session Timestamp:** `2026-10-27T02:10:24.146727+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Addressed mobile Vite lockfile desynchronization and validated counseling note encryption boundaries.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-14] Vite lockfile conflict between root React app and mobile companion bundle.` | `[2026-10-14] Unified package-lock.json with explicit override resolutions in PR #139.` |

---

### ChurchCore-Orthos (`churchcore-orthos`) — v0.18.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://church-core-orthos.vercel.app](https://church-core-orthos.vercel.app) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness** | `100%` | No score basis supplied |

#### MVP Development Status & Milestones
- **Current Phase:** `PRODUCTION`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ PR #25 merged: Departmental Ministry Governance & Maturity Engine (v0.18.0)
  - ✅ PR #24 merged: Compensating controls module for small churches
  - ✅ Audit trail immutability and financial safeguarding rules verified

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Merge pull request #37 from ricardojjulia/chore/ratify-council-010-011-enforcement (79ef491)`
- `chore(governance): ratify COUNCIL-2026-010/011 enforcement and edge evidence reconciliation (40d2574)`
- `Merge pull request #36 from ricardojjulia/chore/sync-telemetry-and-council-directives (d43b0a6)`
- `chore(governance): synchronize Council Directives 010/011 and edge telemetry (v0.18.3) (1e487d1)`

**Next Engineering Steps:**
- 🎯 Deploy staging preview build to Vercel
- 🎯 Execute test:security and audit:rls verification

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `75 minutes`
- **Session Timestamp:** `2026-10-27T02:10:24.146727+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Shipped Departmental Ministry Governance & Maturity Engine (v0.18.0); verified financial safeguarding compensating controls.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-15] X-Frame-Options and CSP headers caused preview iframe blocking in audit reports.` | `[2026-10-15] Configured explicit CSP allowlists in vercel.json for audit PDF preview rendering.` |

---

### FaithFullScholars (`faithfull-scholars`) — v0.1.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://faith-full-scholars.vercel.app](https://faith-full-scholars.vercel.app) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness** | `68%` | No score basis supplied |

##### ⚠️ Readiness Assessment
**Active Blockers:**
- 🔴 Phase 2 launch gates open: counsel-reviewed legal texts (Privacy v7, Terms v3 are drafts) and a support address that receives mail (faithgrid.io has no MX records)
- 🔴 Support address abuse@faithgrid.io is live on /contact (2026-10-20), accepted as is: mail bounces until faithgrid.io has MX records, and the legal texts route rights requests there
- 🔴 Custom domain (B1) deferred by the owner; outbound email stays off until then
- 🔴 Legal texts are drafts pending legal review (version 3 names the operator and describes consent); counsel review needed before real users

**Immediate Next Required Actions:**
- 🛠️ Extend the axe AAA contrast scan to signed-in dashboards (public pages done, ADR 0038)
- 🛠️ Owner: add MX records for faithgrid.io, then set NEXT_PUBLIC_SUPPORT_EMAIL=abuse@faithgrid.io in Vercel and redeploy

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ Phase 1 launch plan complete, 10 of 10 (Sentry withdrawn by the owner; monitoring later via Dynatrace or Vercel)
  - ✅ WCAG AAA text contrast on signed-in areas live; all Phase 1 build items done (PR #115, ADR 0038)
  - ✅ B3 institution invitations live; membership hole closed; privacy v6 (PR #111, ADR 0034)
  - ✅ B4 founding-scholar invitations and privacy v7 live (PR #113, ADR 0034)
  - ✅ B5b data export, account deletion with 14-day grace, privacy v5 live (PR #109, ADR 0035)

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(i18n): COUNCIL-2026-011 localization governance, audit:i18n CI gate, Spanish 'endosos' (ADR 0044); tooling and CI only (#133) (5837a82)`
- `feat(ai): COUNCIL-2026-010 REQ-010-02/03 model evaluator, token cap and usage log (ADR 0041 amendment) (#132) (6241d2c)`
- `feat(ai): Prompt C grounded matcher, fail-closed rate limit (ADR 0041/0026 amendments, CR33 findings 4 and 5) (#131) (9a52303)`
- `feat(endorsements): scholar-controlled endorsements, staff-only verification (ADR 0043, Prompt B); migration 20261024090000 applied by Release 2026-10-26 (#129) (6305e46)`

**Next Engineering Steps:**
- 🎯 Owner check: run one broad matcher search on production and read the ai_gateway_call log line in Vercel logs (finish_reason 'stop', completion_tokens < 4000) (PR #131/#132 are live; the cap is unproven against live traffic)
- 🎯 Owner check: a Spanish-speaking reviewer re-records the es catalog with record-baseline.mjs --reviewer <id> (PR #133; baseline adoption is not a linguistic review)
- 🎯 Owner check: Supabase Confirm email ON in production; staff re-verify institutional endorsements via /admin/endorsements

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-21T19:10:30.854737+00:00`
- **Session Operator:** `Ricardo Julia`
- **Session Work Summary:** Automated post-test edge telemetry synchronization for faithfull-scholars.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-17] A3a migration preflight failed on a fresh database (PL/pgSQL planned IF ... AND EXISTS before the table existed); caught in CI.` | `[2026-10-17] Nested the preflight IF (PR #88, before any release).` |
| `[2026-10-17] Supabase Site URL pointed at a deployment behind Vercel's login wall (sign-up confirmation emails use it).` | `[2026-10-17] Owner set Site URL to https://faith-full-scholars.vercel.app and added /auth/callback to the redirect URLs.` |
| `[2026-10-16] Cloudflare Turnstile CAPTCHA was blocked by strict CSP header on sign-up page.` | `[2026-10-16] Added challenges.cloudflare.com to vercel.json connect-src and script-src directives (PR #85).` |
| `[2026-10-16] Untranslated Spanish sign-up error toasts in production.` | `[2026-10-16] Localized all auth error dictionary keys in Spanish i18n bundle (PR #86).` |

---

## 3. Central Directives Imposition & Compliance Summary

| Directive ID | Mandate Title | Compliance Status |
| :--- | :--- | :--- |
| **CP-2026-DIR-01** | Sovereign Database Isolation & Zero Data Propagation | 🟢 100% Enforced Across 6 Repos |
| **CP-2026-DIR-02** | Endorsed Brand House & Powered by ChurchCore Badge | 🟡 Active Rollout (LMS & Scholars Live) |
| **CP-2026-DIR-03** | Standardized AppSwitcher Navigation Shell | ⏳ In Planning (Target: 2026-11-15) |
| **CP-2026-DIR-04** | Automated Edge Telemetry & Control Plane Reporting | 🟢 100% Active Across 6 Repos |
