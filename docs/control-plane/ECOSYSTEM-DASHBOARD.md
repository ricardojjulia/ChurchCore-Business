# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-10-23 13:37:41 UTC`
> **Authority:** Council Decisions COUNCIL-2026-001 through 004 & Constitution §III  

## 1. Executive Telemetry & Fleet Health KPI

| Fleet Metric | Value | Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Sovereign Repos** | `6` | 6 Products | 🟢 Complete Fleet |
| **Active Production Online** | `6 / 6` | 6 / 6 | 🟢 100% Online |
| **Average Readiness Score** | `92%` | 100% | 🟢 High Readiness |
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

**Immediate Next Required Actions:**
- 🛠️ Owner: smoke:preview against production (APP_URL=https://www.churchcore.io) and the RELEASE_CHECKLIST.md post-deploy checks
- 🛠️ Recruit a pilot church; run a real-export migration dry run (O15)
- 🛠️ Post-MVP Should/B rows (e.g. S94 volunteer action localization, S95 shift links, B-119 test timer, B-120 vendor spec cleanup)

#### MVP Development Status & Milestones
- **Current Phase:** `PRODUCTION`
- **Completion Percentage:** `96%`
- **Recent Milestones Delivered:**
  - ✅ MVP released as 4.0.0 on 2026-10-22 (release PR #235, signed tag v4.0.0), readiness 96/100
  - ✅ All five Stretch rows merged: G1.9 #230, G1.10 #231, G3.4 #232, G2.3 #233, G4.3 #234 (Council Reviews 69-73)
  - ✅ R1 closed 2026-10-21: whole-app Council re-baseline, Testing Council full run and targeted re-run, all 4 Critical and 16 High fixed; readiness hold lifted at 95
  - ✅ Testing Council v6 full run 2026-10-18: 60 defects; all 4 Critical (#209, #211, #212) and 16 High (B1-B5: #213, #215, #216, #217, #218) fixed and in production
  - ✅ Targeted Testing Council re-run 2026-10-20/21: every original Critical and High confirmed fixed; follow-ups #220 (crash), #221 (scheduled-send time zone), #222 (contrast) merged
  - ✅ B3b event approval and ministry-leader owner scope merged #223 (approval publishes; approved events locked)

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `release: ChurchCore 4.0.0 — the MVP (R2) (#235) (b08d3a0)`
- `feat(imports): guided migration flow (G4.3) (#234) (0e18517)`
- `feat(member): offline member schedule; cached pages cleared at sign-in (G2.3) (#233) (e6617f1)`
- `feat(giving): pledges and campaigns (G3.4) (#232) (8c25abe)`

**Next Engineering Steps:**
- 🎯 Owner: smoke:preview against production (APP_URL=https://www.churchcore.io) and the RELEASE_CHECKLIST.md post-deploy checks
- 🎯 Recruit a pilot church; run a real-export migration dry run (O15)
- 🎯 Post-MVP Should/B rows (e.g. S94 volunteer action localization, S95 shift links, B-119 test timer, B-120 vendor spec cleanup)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `claude-opus-5-5`
- **Session Duration:** `1680 minutes`
- **Session Timestamp:** `2026-10-22T16:41:18.527404+00:00`
- **Session Operator:** `Ricardo Julia`
- **Session Work Summary:** ChurchCore 4.0.0 (the MVP) released 2026-10-22, ahead of the Nov 6 target, readiness 96/100 (owner re-score). All five Stretch rows built through Council Reviews 69-73 and merged (#230 G1.9 transactional assign, #231 G1.10 recurring blockouts, #232 G3.4 pledges and campaigns, #233 G2.3 offline member schedule, #234 G4.3 guided migration flow); migrations 20261025-20261028 applied to hosted before each merge; release PR #235, signed tag v4.0.0, GitHub release; production deploys confirmed. Also: control-plane sync #228, role-access matrix #229, i18n provider stability fix, service-worker cache narrowed to the schedule (privacy).

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-22] G4.3 e2e: CI DB user cannot set session_replication_role; spec keeps its church and deletes only its own rows` | `[2026-10-22] Production deploys confirmed for #230-#235 via the deployments API` |
| `[2026-10-22] G3.4 e2e: pages never reached network idle; I18nProvider recreated t each render; memoized per locale` | `[2026-10-22] Service worker caches only /portal and /app/member/schedule; cached pages cleared at sign-in (privacy)` |
| `[2026-10-22] CI e2e setup hit Docker Hub 'toomanyrequests' twice; re-ran the failed job` | `[2026-10-21] O30 closed: owner checked the Vercel git integration` |
| `[2026-10-21] Vercel stopped auto-building production for merges (#222 delayed, #224 not built after 3h)` | `[2026-10-21] Production deployed by CLI from a clean checkout of main ceb016b with owner OK; O30 opened to investigate the git integration` |
| `[2026-10-17] Production ran with NEXT_PUBLIC_DEMO_MODE=true (demo-only payment route passed its gate; provider stubs could fake success).` | `[2026-10-17] NEXT_PUBLIC_DEMO_MODE=false (Config) for Production and redeployed; demo route verified 403.` |

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
- `Merge pull request #102 from ricardojjulia/chore/session-close-100-mvp (b69f222)`
- `chore(telemetry): record 100% Phase 1 completion and session close (af6675c)`
- `Merge pull request #101 from ricardojjulia/feat/universal-app-switcher-and-mvp-100 (b0d3645)`
- `feat(navigation): integrate Universal AppSwitcher (OPS-02) and advance Phase 1 to 100% complete (5d427b3)`

**Next Engineering Steps:**
- 🎯 Test course completion webhook integration with local certification service
- 🎯 Run full synthetic production test suite (npm run test:prod-synthetic)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-21T19:07:50.587388+00:00`
- **Session Operator:** `Ricardo Julia`
- **Session Work Summary:** Automated post-test edge telemetry synchronization for churchcore-lms.

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
  - ✅ PR #248 recorded Colegio Biblos local/private pilot preparation.
  - ✅ PR #247 approved the Colegio Biblos local pilot charter.
  - ✅ PR #246 completed the technical baseline closeout.

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `docs(council): record Council Review 34 and factory run for RLS table privileges fix (3c6e19c)`
- `chore(telemetry): record session telemetry for RLS table privileges fix (a296aff)`
- `fix(security): grant table-level privileges for admissions, conversion, audit, and LLIS tables (a781f52)`
- `chore(telemetry): record Node 22 LTS stack synchronization (1ac22f4)`

**Next Engineering Steps:**
- 🎯 Verify the actual Colegio Biblos participant login on the approved local/private topology.
- 🎯 Complete the uncoached pilot session before adding feature work.
- 🎯 Record sanitized findings and re-observe any S0-S2 blockers before accepting Workstream C residual risk.

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `antigravity`
- **Session Duration:** `5 minutes`
- **Session Timestamp:** `2026-10-22T19:30:40.144751+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Recorded Council Review 34 and factory run report for RLS table privileges fix

- 🟢 *No active deployment errors logged.*

---

### ChurchCore Care (`churchcore-care`) — v7.1.0 | 🟢 ONLINE

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
- `feat(governance): ingest full central control plane directives and council specifications (#151) (0d099cb)`
- `chore(council): reconcile central control plane evidence and update ledger (#150) (e696a3f)`
- `chore(telemetry): record central control plane reconciliation for PR #148 (#149) (77fd006)`
- `fix: ignore Google Drive, cloud storage sync, and filesystem metadata artifacts (#148) (cfb7eff)`

**Next Engineering Steps:**
- 🎯 Verify production serverless cron execution at /api/cron/scheduler
- 🎯 Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-22T14:56:19.768308+00:00`
- **Session Operator:** `Ricardo J Julia`
- **Session Work Summary:** Automated Council Directives Enforcement

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-14] Vite lockfile conflict between root React app and mobile companion bundle.` | `[2026-10-14] Unified package-lock.json with explicit override resolutions in PR #139.` |

---

### ChurchCore Orthos (`churchcore-orthos`) — v0.18.3 | 🟢 ONLINE

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
- `Merge pull request #33 from ricardojjulia/chore/council-008-sync (940e8d9)`
- `chore(governance): implement COUNCIL-2026-008 automated telemetry reporting and ledger sync (v0.18.3) (737f2cd)`
- `Merge pull request #32 from ricardojjulia/feature/phase2-testing-and-ministry-solutioning (7d39406)`
- `feat(ministries): implement AI solutioning engine, Sunday SLA prober, and /api/health (COUNCIL-2026-005) (625569e)`

**Next Engineering Steps:**
- 🎯 Deploy staging preview build to Vercel
- 🎯 Execute test:security and audit:rls verification

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-21T19:09:41.288991+00:00`
- **Session Operator:** `Ricardo J Julia`
- **Session Work Summary:** Automated post-test edge telemetry synchronization for churchcore-orthos.

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
| **Readiness** | `65%` | No score basis supplied |

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
- `feat(institution): role and status gating for institution writes; owner-run cleanup (ADR 0042) (#121) (227e123)`
- `fix(security): upgrade Next.js to 16.4.2 and Vitest to 5.0.5 (#120) (07622e3)`
- `fix(ci): restrict push trigger to main and add concurrency to prevent duplicate runs (#119) (c8cc383)`
- `docs: Council Review 33 readiness re-score (about 64/100) (#118) (b93b7ab)`

**Next Engineering Steps:**
- 🎯 Owner: run Release (dry run unticked) to apply migration 20261023090000 (scholar draft visibility)
- 🎯 Next: separate PR to add contracts, milestones and licensing to the scholar data export (lib/account/export.ts); then fix the contract list queries that select missing columns (current_title, city)
- 🎯 Council Review 33 prompts B (scholar-controlled endorsements) and C (grounded matcher and rate limit), then D, G, E, F

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
