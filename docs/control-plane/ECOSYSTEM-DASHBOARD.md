# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-11-09 18:49:57 UTC`
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

### ChurchCore (`churchcore-chms`) — v3.5.0 | 🟢 ONLINE

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
- `feat(accounts): one approval per email in flight, no second invite (S129 part 1, Council Review 107) (#280) (90f1483)`
- `Merge pull request #281 from ricardojjulia/feat/council-014-ui-standardization (c30ac77)`
- `feat(design-system): implement COUNCIL-2026-014 unified self-hosted typography and UI tokens (a8bb5bd)`
- `feat(people): review a member change request in one transaction (S113, Council Review 106) (#279) (974ec28)`

**Next Engineering Steps:**
- 🎯 Owner: RELEASE_CHECKLIST.md post-deploy checks still pending: sign in and reach /app/church-admin/readiness; send a test email and SMS; fire a Stripe test webhook (then verify the rows read-only)
- 🎯 Recruit a pilot church; run a real Planning Center / Breeze export migration dry run (O15)
- 🎯 Owner actions O23-O28, including the O25 native Spanish review (e.g. 'ofrendante' vs 'donante', 'registro de asistencia')

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `180 minutes`
- **Session Timestamp:** `2026-11-09T18:49:53.778886+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Executed Council Review 56 synthesis; implemented R1d erasure approval screens and member data-rights lifecycle.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-17] Erasure notice was triggering before DB transaction confirmed in preview environment.` | `[2026-10-17] Refactored event emission to fire exclusively in post-commit callback (commit b38636f).` |

---

### ChurchCore-LMS (`churchcore-lms`) — v0.47.0 | 🟢 ONLINE

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
- `Merge pull request #112 from ricardojjulia/fix/edge-runtime-node-crypto (1bc0e07)`
- `fix(api): switch /api/ai runtime from edge to nodejs to support node:crypto (fb394e6)`
- `Merge pull request #111 from ricardojjulia/feat/enforce-council-013-014-and-docs (927d477)`
- `feat(governance): enforce COUNCIL-2026-013 & 014 verifiers, WCAG AAA audit, and domain branding docs (72de9ec)`

**Next Engineering Steps:**
- 🎯 Test course completion webhook integration with local certification service
- 🎯 Run full synthetic production test suite (npm run test:prod-synthetic)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `120 minutes`
- **Session Timestamp:** `2026-11-09T18:49:53.778886+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Resolved Turbopack use-server sync export errors during Next.js Vercel build; unmounted sidebar on login/auth routes.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-16] Turbopack use-server sync export error during Vercel edge compilation.` | `[2026-10-16] Converted server action exports to explicit async functions in compliance with Turbopack specifications (PR #89).` |
| `[2026-10-15] Sidebar layout flickering on pre-auth /login route.` | `[2026-10-16] Unmounted sidebar layout specifically for pre-auth route boundaries.` |

---

### ChurchCore-Academy (`churchcore-academy`) — v0.10.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcoreacademy.io](https://www.churchcoreacademy.io) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Phase 1 engineering readiness** | `100%` | The repository-defined functional MVP and its inseparable automated verification are complete. This score is the Phase 1 entry gate for human testing; it is not pilot completion or production authorization. |
| **Phase 2 Human Validation** | `ENTRY_GATE_PENDING` | Verify participant login from the actual Colegio Biblos browser or VM. |
| **Phase 3 Production Authorization** | `NOT_GRANTED` | Authenticated Vercel evidence proves a Ready production-target deployment exists; it does not prove an owner-approved Phase 3 production release. |

#### MVP Development Status & Milestones
- **Current Phase:** `PILOT_READY`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ Implemented COUNCIL-2026-012 Embedded Security Add-On (createProtectedAction, constant-time cron/webhook verification, recursive threat inspection, 100% forced RLS across 152 tables, stateful SQL migration auditor) and domain-aware login branding.
  - ✅ PR #256 aligned Academy compliance with Control Plane (REQ-002-01, REQ-010-01..03, REQ-011-02..03) and standardized Node 22.
  - ✅ PR #248 recorded Colegio Biblos local/private pilot preparation.
  - ✅ PR #247 approved the Colegio Biblos local pilot charter.

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(ui,a11y,docs): implement COUNCIL-2026-014 unified design system, REQ-002-02 WCAG AAA audit, and RLS refinements (#263) (ff11a75)`
- `feat(security): implement COUNCIL-2026-013 security verification standard and RLS refinements (#262) (9e92ceb)`
- `feat(security): implement COUNCIL-2026-012 embedded security guardrails, 100% forced RLS, and domain-aware login branding (#261) (0669d3f)`
- `feat(sis): competitive expansion and dual institutional orientation architecture (#259) (f54937d)`

**Next Engineering Steps:**
- 🎯 Verify the actual Colegio Biblos participant login on the approved local/private topology.
- 🎯 Complete the uncoached pilot session before adding feature work.
- 🎯 Record sanitized findings and re-observe any S0-S2 blockers before accepting Workstream C residual risk.

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `90 minutes`
- **Session Timestamp:** `2026-11-09T18:49:53.778886+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Reconciled COUNCIL-2026-005 via PR #2; confirmed 100% functional MVP code completion with Workstream C human pilot as active gate.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-16] Local migration seed sequencing resolved in PR #248.` | `[2026-10-16] Ordered seed insertion sequence and added cascading transaction locks in db:seed:pilot.` |

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
- `Merge pull request #167 from ricardojjulia/docs/unified-ui-overhaul-prompt (bbeeeca3)`
- `docs(prompts): add reusable ChurchCore Ecosystem UI/UX Unification Master Prompt (ab13a9dd)`
- `Merge pull request #166 from ricardojjulia/feat/unified-churchcore-ui-overhaul (e3e8e58f)`
- `feat(ui): align ChurchCore Care UI, AppShell, and all 16 screen surfaces with flagship ChurchCore design system (1d5a0cfe)`

**Next Engineering Steps:**
- 🎯 Verify production serverless cron execution at /api/cron/scheduler
- 🎯 Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `60 minutes`
- **Session Timestamp:** `2026-11-09T18:49:53.778886+00:00`
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
- `Merge pull request #42 from ricardojjulia/feat/council-014-ui-standardization (47c7e0e)`
- `feat(design-system): implement COUNCIL-2026-014 unified self-hosted typography and UI tokens (c398d8a)`
- `fix(security): non-recursive RLS helper, stateful SQL audit & fail-closed webhook (v0.19.0) (#41) (e6e23a8)`
- `feat(security): implement COUNCIL-2026-012 embedded security architecture & 100% FORCE RLS (v0.19.0) (#40) (0d15146)`

**Next Engineering Steps:**
- 🎯 Deploy staging preview build to Vercel
- 🎯 Execute test:security and audit:rls verification

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `75 minutes`
- **Session Timestamp:** `2026-11-09T18:49:53.778886+00:00`
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
- `Merge pull request #137 from ricardojjulia/feat/council-014-ui-standardization (8db61a4)`
- `fix(ui): address Copilot review on dark-first default, coordinated print ink, touch targets, and dynamic contrast contracts (af7a1ba)`
- `feat(ui): unified ChurchCore design system, self-hosted variable typography, and dark-first surface hierarchy (COUNCIL-2026-014, DIR-2026-UI-STANDARD-001) (f202540)`
- `chore(telemetry): update session timestamp in telemetry report (aaa31db)`

**Next Engineering Steps:**
- 🎯 Owner check: run one broad matcher search on production and read the ai_gateway_call log line in Vercel logs (finish_reason 'stop', completion_tokens < 4000) (PR #131/#132 are live; the cap is unproven against live traffic)
- 🎯 Owner check: a Spanish-speaking reviewer re-records the es catalog with record-baseline.mjs --reviewer <id> (PR #133; baseline adoption is not a linguistic review)
- 🎯 Owner check: Supabase Confirm email ON in production; staff re-verify institutional endorsements via /admin/endorsements

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `105 minutes`
- **Session Timestamp:** `2026-11-09T18:49:53.778886+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Fixed Cloudflare Turnstile CSP header blocking sign-up completion; deployed honest launch surface to Vercel.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
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
