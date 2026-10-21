# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-10-21 20:28:41 UTC`
> **Authority:** Council Decisions COUNCIL-2026-001 through 004 & Constitution §III  

## 1. Executive Telemetry & Fleet Health KPI

| Fleet Metric | Value | Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Sovereign Repos** | `6` | 6 Products | 🟢 Complete Fleet |
| **Active Production Online** | `6 / 6` | 6 / 6 | 🟢 100% Online |
| **Average Readiness Score** | `89%` | 100% | 🟢 High Readiness |
| **Portfolio MVP Progress** | `92%` | 100% | 🟢 On Schedule |
| **Cross-App Data Isolation** | `UNVERIFIED` | Evidence from every product | ⚠️ One or more edge reports are unverified |

## 2. Product Fleet Status Cards

### ChurchCore (`churchcore-chms`) — v3.5.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcore.io](https://www.churchcore.io) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness** | `95%` | No score basis supplied |

##### ⚠️ Readiness Assessment
**Active Blockers:**
- 🔴 Testing Council v6 full run not yet done (last item of R1's definition of done)
- 🔴 O7: Stripe test-mode run never exercised against real Stripe (incl. charge.refund.updated / refund.updated on the Connect endpoint)
- 🔴 O15: real pilot export files not yet tested
- 🔴 O23: security@churchcore.io cannot receive mail (no MX record for churchcore.io)

**Immediate Next Required Actions:**
- 🛠️ Testing Council v6 full run
- 🛠️ R2 release (target 2026-11-06)

#### MVP Development Status & Milestones
- **Current Phase:** `PILOT_READY`
- **Completion Percentage:** `95%`
- **Recent Milestones Delivered:**
  - ✅ All five MVP gaps closed
  - ✅ Council Review 52 whole-app re-baseline: 2 Critical + 5 High found and fixed (R1a #201, R1b #202, R1c #203, R1d #205)
  - ✅ R1d data-erasure approval flow merged #205 (exact, household-scoped erasure with audit redaction)
  - ✅ CP1 Powered by ChurchCore badge merged #206; CP1b hotfix #207 rewrote /security to true claims, added security headers and security.txt

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(portal): B-59 — family check-in code on the parent portal, linked at creation (Council Review 68) (#224) (ceb016b)`
- `feat(events): B3b — approval publishes, ministry-leader owner scope, approved events locked (Council Reviews 63, 67) (#223) (070dca7)`
- `fix(a11y): finance account row and elder note panel contrast on the dark theme (Testing Council re-run, OMNI-0020) (#222) (f38177b)`
- `fix(communications): scheduled sends use the church time zone; phone search ignores emails (Testing Council re-run) (#221) (979aa92)`

**Next Engineering Steps:**
- 🎯 Testing Council v6 full run
- 🎯 R2 release
- 🎯 Owner actions O7, O15, O23 (mail), O24 (business repo visibility), O25 (Spanish review), O26 (GHAS)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-21T19:08:30.760406+00:00`
- **Session Operator:** `Ricardo Julia`
- **Session Work Summary:** Automated post-test edge telemetry synchronization for churchcore-chms.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-17] Production ran with NEXT_PUBLIC_DEMO_MODE=true (demo-only payment route passed its gate; provider stubs could fake success).` | `[2026-10-17] NEXT_PUBLIC_DEMO_MODE=false (Config) for Production and redeployed; demo route verified 403.` |
| `[2026-10-17] PR #206 merged before Council Review 58 finished; the live /security page made ~9 false security claims.` | `[2026-10-17] CP1b (#207): /security rewritten so every claim is true of the code (evidence in docs/factory-runs/2026-10-17-cp1b-truthful-security.md); live check: no banned phrases, security headers present, security.txt served.` |

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
| **Supabase Database** | `LOCAL_ONLY` | Sovereign isolation or RLS verification remains unverified |
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
- `Reconcile Academy deployment and readiness telemetry (#253) (31ab6bc)`
- `Refresh the Academy admin dashboard (#252) (737525c)`
- `Reconcile Testing Council consent with Academy governance (#251) (443f0be)`
- `Reconcile control-plane governance evidence (#249) (7fcbe31)`

**Next Engineering Steps:**
- 🎯 Verify the actual Colegio Biblos participant login on the approved local/private topology.
- 🎯 Complete the uncoached pilot session before adding feature work.
- 🎯 Record sanitized findings and re-observe any S0-S2 blockers before accepting Workstream C residual risk.

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-21T19:09:08.658011+00:00`
- **Session Operator:** `Ricardo J Julia`
- **Session Work Summary:** Automated post-test edge telemetry synchronization for churchcore-academy.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-17] The admissions, enrollment-conversion, and LLIS-consent RLS verification commands could not complete because the local anon/authenticated roles lack required table privileges.` | `[2026-10-19] Authenticated Vercel CLI inspection verified project churchcore/church-core-academy and Ready deployment dpl_CGgewdcXBDt1Z6RHcdg8eqM5eJiv with the canonical domain aliases.` |

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
- `fix: ignore Google Drive, cloud storage sync, and filesystem metadata artifacts (#148) (cfb7eff)`
- `chore(council): record central reconciliation for Next.js unification commit #146 (#147) (6c24335)`
- `feat(migration): unify full-stack application into Next.js App Router (#146) (bf2f9ae)`
- `chore(telemetry): force edge telemetry check-in (COUNCIL-2026-008) (#145) (d254d8b)`

**Next Engineering Steps:**
- 🎯 Verify production serverless cron execution at /api/cron/scheduler
- 🎯 Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-21T20:21:38.523039+00:00`
- **Session Operator:** `Ricardo J Julia`
- **Session Work Summary:** Automated post-test edge telemetry synchronization for churchcore-care.

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
| **Readiness** | `45%` | No score basis supplied |

##### ⚠️ Readiness Assessment
**Active Blockers:**
- 🔴 Phase 1 MVP items open: A4b error monitoring (Sentry; owner decision pending), WCAG AAA contrast for signed-in areas, B3 and B4 invitations (docs/FAITHFULL_SCHOLARS_FULL_PLAN.md §24)
- 🔴 Support address abuse@faithgrid.io is live on /contact (2026-10-20), accepted as is: mail bounces until faithgrid.io has MX records, and the legal texts route rights requests there
- 🔴 Custom domain (B1) deferred by the owner; outbound email stays off until then
- 🔴 Legal texts are drafts pending legal review (version 3 names the operator and describes consent); counsel review needed before real users

**Immediate Next Required Actions:**
- 🛠️ Extend the axe AAA contrast scan to signed-in dashboards (public pages done, ADR 0038)
- 🛠️ Owner: add MX records for faithgrid.io, then set NEXT_PUBLIC_SUPPORT_EMAIL=abuse@faithgrid.io in Vercel and redeploy

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `60%`
- **Recent Milestones Delivered:**
  - ✅ B5b data export, account deletion with 14-day grace, privacy v5 live (PR #109, ADR 0035)
  - ✅ B2 email outbox live, sending off by design (PR #106, ADR 0033)
  - ✅ B5a policy re-acceptance prompt live (PR #107, ADR 0035)
  - ✅ AI matcher on OpenRouter with zero data retention; privacy v4 live (PR #104, ADR 0041)
  - ✅ Gemini key moved to a header in the CV extractor and syllabus tagger (PR #100)

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `docs: B5 done and live; progress 6 of 10 (#110) (16f078b)`
- `feat(mvp): B5b data export, account deletion and privacy v5 (ADR 0035) (#109) (3267341)`
- `docs: status after B2 and B5a; telemetry 50% with engineering next steps first (#108) (bf5a5ce)`
- `feat(mvp): B5a policy re-acceptance prompt (ADR 0035) (#107) (2c3c627)`

**Next Engineering Steps:**
- 🎯 Next: B3 institution invitations and B4 founding-scholar invitations (ADR 0034), then WCAG AAA contrast for signed-in areas
- 🎯 Re-score readiness with a full Council review once B5b, B3 and B4 land (last score about 45/100 on 2026-10-14, before A1 to A4a, B2 and B5a)
- 🎯 WCAG AAA contrast: extend the axe scan to signed-in dashboards (public pages done, ADR 0038)

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       