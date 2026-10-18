# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-10-18 14:09:28 UTC`  
> **Authority:** Council Decisions COUNCIL-2026-001 through 004 & Constitution §III  

## 1. Executive Telemetry & Fleet Health KPI

| Fleet Metric | Value | Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Sovereign Repos** | `6` | 6 Products | 🟢 Complete Fleet |
| **Active Production Online** | `5 / 6` | 6 / 6 | 🟡 Transitioning |
| **Average Readiness Score** | `92%` | 100% | 🟢 High Readiness |
| **Portfolio MVP Progress** | `92%` | 100% | 🟢 On Schedule |
| **Cross-App Data Isolation** | `VERIFIED` | Evidence from every product | 🛡️ All edge reports verified |

## 2. Product Fleet Status Cards

### ChurchCore (`churchcore-chms`) — v3.5.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcore.io](https://www.churchcore.io) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness Score** | `94%` | No score basis supplied |

##### ⚠️ Production Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Complete Feature 2: Vercel Edge Cron Automation (shepherd-ai & scheduled comms)
- 🛠️ Complete R1d data-rights erasure approval queue e2e verification
- 🛠️ Finalize crons for shepherd-ai and communications scheduled

#### MVP Development Status & Milestones
- **Current Phase:** `PRODUCTION`
- **Completion Percentage:** `92%`
- **Recent Milestones Delivered:**
  - ✅ Council Review 56 (R1d) synthesis and agent reports approved
  - ✅ R1d erasure approval screens (queue, member data-rights, e2e) merged
  - ✅ Multi-campus volunteer scheduling and donor giving pipelines live

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `docs: close out R1d, CP1 and CP1b; plan, changelog and memory up to date (#208) (2d76314)`
- `fix: CP1b truthful /security page, kiosk badge, single statement footer, security headers, real dependency audit (Council Review 58) (#207) (f7faaf0)`
- `feat(security): launch /security Trust Center and Powered by ChurchCore badge system (COUNCIL-2026-002 REQ-002-01) (#206) (c28c96c)`
- `feat: R1d data-erasure approval flow — exact, household-scoped erasure with audit redaction (Council Reviews 55–57) (#205) (840643d)`

**Next Engineering Steps:**
- 🎯 Feature 2: Vercel Edge Cron Automation (shepherd-ai & scheduled comms)
- 🎯 Verify send erasure notice only after erasure succeeds in production
- 🎯 Add Powered by ChurchCore trust badge to main footer

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `180 minutes`
- **Session Timestamp:** `2026-10-18T14:09:15.824756+00:00`
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
| **Readiness Score** | `95%` | No score basis supplied |

##### ⚠️ Production Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Verify Turbopack build on Vercel preview branch
- 🛠️ Conduct student credentialing certificate PDF generation test

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `88%`
- **Recent Milestones Delivered:**
  - ✅ PR #89 merged: Turbopack use-server SSR build error resolved & auth layout polished
  - ✅ PR #88 merged: Neutral pre-auth and dynamic branding with Powered by ChurchCore badge live
  - ✅ Supabase pg_net extension enabled and release build 0.36.1 deployed

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Merge pull request #99 from ricardojjulia/chore/session-close-telemetry (c8dc009)`
- `chore(telemetry): session close reporting (e3183be)`
- `Merge pull request #98 from ricardojjulia/chore/sync-latest-telemetry (f1429f0)`
- `chore(telemetry): record release 39095646628 deployment to main (bd179de)`

**Next Engineering Steps:**
- 🎯 Test course completion webhook integration with local certification service
- 🎯 Run full synthetic production test suite (npm run test:prod-synthetic)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `120 minutes`
- **Session Timestamp:** `2026-10-18T14:09:15.824756+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Resolved Turbopack use-server sync export errors during Next.js Vercel build; unmounted sidebar on login/auth routes.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-16] Turbopack use-server sync export error during Vercel edge compilation.` | `[2026-10-16] Converted server action exports to explicit async functions in compliance with Turbopack specifications (PR #89).` |
| `[2026-10-15] Sidebar layout flickering on pre-auth /login route.` | `[2026-10-16] Unmounted sidebar layout specifically for pre-auth route boundaries.` |

---

### ChurchCore-Academy (`churchcore-academy`) — v0.10.0 | 🟡 OFFLINE / READINESS REVIEW

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `OFFLINE / LOCAL` | No production deployment claimed |
| **Vercel Deployment** | `DEPLOYED` | [https://church-core-academy.vercel.app](https://church-core-academy.vercel.app) |
| **Supabase Database** | `LOCAL_ONLY` | Sovereign isolation reported and verified |
| **Readiness Score** | `95%` | No score basis supplied |

##### ⚠️ Production Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Conduct Colegio Biblos participant-browser login and uncoached session (Workstream C human gate)
- 🛠️ Execute npm run verify:pilot-readiness
- 🛠️ Production Vercel deployment remains owner-deferred pending pilot completion

#### MVP Development Status & Milestones
- **Current Phase:** `PILOT_READY`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ COUNCIL-2026-005: 100% functional MVP scope ratified in Control Plane PR #2
  - ✅ PR #248: Colegio Biblos local pilot preparation recorded
  - ✅ PR #247: Colegio Biblos local pilot charter formally approved
  - ✅ PR #202: OneRoster deletion reconciliation merged

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(branding): install Powered by ChurchCore badge linking to https://www.churchcore.io/security (016be3e)`
- `Reconcile control-plane governance evidence (#249) (7fcbe31)`
- `Record Colegio Biblos local pilot preparation (#248) (bed47c2)`
- `Approve Colegio Biblos local pilot charter (#247) (f44c6b7)`

**Next Engineering Steps:**
- 🎯 Conduct Colegio Biblos participant-browser login and uncoached session (Workstream C human gate)
- 🎯 Run npm run verify:pilot-readiness and npm run verify

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `90 minutes`
- **Session Timestamp:** `2026-10-18T14:09:15.824756+00:00`
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
| **Readiness Score** | `95%` | No score basis supplied |

##### ⚠️ Production Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Verify HIPAA counseling intake workflow in production (churchcore-care.vercel.app)
- 🛠️ Run automated smoke test suite: npm run test:smoke

#### MVP Development Status & Milestones
- **Current Phase:** `PRODUCTION`
- **Completion Percentage:** `90%`
- **Recent Milestones Delivered:**
  - ✅ Vercel production deployment verified live at churchcore-care.vercel.app and www.churchcorecare.io
  - ✅ PR #139 merged: Mobile Vite lockfile resolution and dependency alignment
  - ✅ Counseling intake, pastoral notes, and secure consent flows verified in production

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(branding): install Powered by ChurchCore badge linking to https://www.churchcore.io/security (#141) (3f77da6)`
- `Merge pull request #139 from ricardojjulia/fix/mobile-vite-lockfile (188f9df)`
- `fix: synchronize Vercel dependency resolution (1fbe989)`
- `Merge pull request #138 from ricardojjulia/dependabot/npm_and_yarn/fast-uri-3.1.8 (710fc4b)`

**Next Engineering Steps:**
- 🎯 Complete translation worker container optimization
- 🎯 Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `60 minutes`
- **Session Timestamp:** `2026-10-18T14:09:15.824756+00:00`
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
| **Supabase Database** | `LOCAL_ONLY` | Sovereign isolation reported and verified |
| **Readiness Score** | `85%` | No score basis supplied |

##### ⚠️ Production Readiness Assessment
**Active Blockers:**
- 🔴 Production Supabase project connection pending manual key provisioning
- 🔴 Awaiting final verification of Omni-Council test suite

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Run npm run test:omni-council across full compliance checklist
- 🛠️ Bind production Vercel environment variables to Supabase cloud instance
- 🛠️ Verify fund-accounting double-entry balance constraints

#### MVP Development Status & Milestones
- **Current Phase:** `PILOT_READY`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ PR #25 merged: Departmental Ministry Governance & Maturity Engine (v0.18.0)
  - ✅ PR #24 merged: Compensating controls module for small churches
  - ✅ Audit trail immutability and financial safeguarding rules verified

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Merge pull request #30 from ricardojjulia/chore/sync-telemetry-v0-18-2 (36a39de)`
- `chore(telemetry): sync 100% MVP pilot_ready telemetry and council acknowledgments (v0.18.2) (43229ad)`
- `Merge pull request #29 from ricardojjulia/feature/mvp-100-phase1-completion (8d63567)`
- `feat(mvp): complete 100% Phase 1 MVP features (CSP, Double-Entry Validator, AppSwitcher) (COUNCIL-2026-005) (58d3bd2)`

**Next Engineering Steps:**
- 🎯 Deploy staging preview build to Vercel
- 🎯 Execute test:security and audit:rls verification

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `75 minutes`
- **Session Timestamp:** `2026-10-18T14:09:15.824756+00:00`
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
| **Readiness Score** | `90%` | No score basis supplied |

##### ⚠️ Production Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Run npm run verify:deploy against live Vercel endpoint
- 🛠️ Complete peer-review monograph submission interface

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `85%`
- **Recent Milestones Delivered:**
  - ✅ PR #87 merged: Honest launch surface merged and live on Vercel
  - ✅ PR #86 merged: Bilingual Spanish server translations and translated sign-up errors
  - ✅ PR #85 merged: Cloudflare Turnstile CSP fix enabling reliable pre-auth verification

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(branding): install Powered by ChurchCore badge linking to https://www.churchcore.io/security (#91) (288b2be)`
- `docs: A3a legal, contact and password reset merged and live (#89) (69ff7c8)`
- `A3a: legal pages, acceptance records, contact and password reset (ADR 0031) (#88) (50ac410)`
- `docs: A1 honest launch surface merged and live (#87) (5edc51b)`

**Next Engineering Steps:**
- 🎯 Complete faculty profile public monograph index
- 🎯 Execute npm run audit:rls against production schema

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `105 minutes`
- **Session Timestamp:** `2026-10-18T14:09:15.824756+00:00`
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
