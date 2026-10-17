# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-10-17 15:19:22 UTC`  
> **Authority:** Council Decisions COUNCIL-2026-001 through 004 & Constitution §III  

## 1. Executive Telemetry & Fleet Health KPI

| Fleet Metric | Value | Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Sovereign Repos** | `6` | 6 Products | 🟢 Complete Fleet |
| **Active Production Online** | `3 / 6` | 6 / 6 | 🟡 Transitioning |
| **Average Readiness Score** | `86%` | 100% | 🟢 High Readiness |
| **Portfolio MVP Progress** | `84%` | 100% | 🟢 On Schedule |
| **Cross-App Data Isolation** | `100% Sovereign` | 100% Isolated | 🛡️ Constitutional Invariant Verified |

## 2. Product Fleet Status Cards

### ChurchCore (`churchcore-chms`) — v3.5.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://churchcore.vercel.app](https://churchcore.vercel.app) |
| **Supabase Database** | `CONNECTED` | Dedicated Sovereign Instance (RLS Enforced) |
| **Readiness Score** | `94%` | Measured against production launch gates |

##### ⚠️ Production Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions for Online Launch:**
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
- `docs: Council Review 56 (R1d) synthesis and agent reports (56c054e)`
- `feat: R1d erasure approval screens (queue, member data-rights, e2e) (a22c36e)`
- `fix: R1d send the erasure notice only after the erasure succeeds (b38636f)`
- `feat: R1d erasure approval flow backend (Council Review 55 A1 F5) (ca543ff)`

**Next Engineering Steps:**
- 🎯 Verify send erasure notice only after erasure succeeds in production
- 🎯 Add Powered by ChurchCore trust badge to main footer

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `180 minutes`
- **Session Timestamp:** `2026-10-17T15:19:19.578297+00:00`
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
| **Vercel Deployment** | `DEPLOYED` | [https://church-core-lms.vercel.app](https://church-core-lms.vercel.app) |
| **Supabase Database** | `CONNECTED` | Dedicated Sovereign Instance (RLS Enforced) |
| **Readiness Score** | `95%` | Measured against production launch gates |

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
- `Merge pull request #89 from ricardojjulia/feat/fix-turbopack-build-and-auth-layout (83933a2)`
- `fix(build): resolve Turbopack use-server sync export error and unmount sidebar on auth pages (29a9ca9)`
- `Merge pull request #88 from ricardojjulia/feat/neutral-preauth-and-dynamic-branding (fe412f0)`
- `feat(branding): neutral pre-auth gateway and dynamic post-login brand switcher (e77746e)`

**Next Engineering Steps:**
- 🎯 Test course completion webhook integration with local certification service
- 🎯 Run full synthetic production test suite (npm run test:prod-synthetic)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `120 minutes`
- **Session Timestamp:** `2026-10-17T15:19:19.578297+00:00`
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
| **Online Status** | `OFFLINE / PENDING` | Development / Preview Staging |
| **Vercel Deployment** | `PENDING` | [https://churchcore-academy.vercel.app](https://churchcore-academy.vercel.app) |
| **Supabase Database** | `LOCAL_ONLY` | Dedicated Sovereign Instance (RLS Enforced) |
| **Readiness Score** | `78%` | Measured against production launch gates |

##### ⚠️ Production Readiness Assessment
**Active Blockers:**
- 🔴 Awaiting production Vercel deployment credentials binding
- 🔴 Colegio Biblos pilot migration seed rehearsal in progress

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Execute npm run verify:pilot-readiness
- 🛠️ Deploy staging preview to Vercel and bind production Supabase URL
- 🛠️ Verify OneRoster 1.2 delivery cron worker

#### MVP Development Status & Milestones
- **Current Phase:** `PILOT_READY`
- **Completion Percentage:** `82%`
- **Recent Milestones Delivered:**
  - ✅ PR #248: Colegio Biblos local pilot preparation recorded
  - ✅ PR #247: Colegio Biblos local pilot charter formally approved
  - ✅ PR #246: Technical baseline closeout completed

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Record Colegio Biblos local pilot preparation (#248) (bed47c2)`
- `Approve Colegio Biblos local pilot charter (#247) (f44c6b7)`
- `Record technical baseline closeout (#246) (4bfe20b)`
- `Merge pull request #245 from ricardojjulia/docs/pilot-to-production-completion-plan (dca2d25)`

**Next Engineering Steps:**
- 🎯 Complete Colegio Biblos pilot student roster import
- 🎯 Execute verify:admissions-rls and verify:enrollment-conversion-rls

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `90 minutes`
- **Session Timestamp:** `2026-10-17T15:19:19.578297+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Chartered Colegio Biblos local pilot; structured OneRoster 1.2 cron tasks and admissions RLS verifications.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-16] Local migration seed failed during rehearsal due to foreign key sequence lock on grade_levels.` | `[2026-10-16] Ordered seed insertion sequence and added cascading transaction locks in db:seed:pilot.` |

---

### ChurchCoreCare (`churchcore-care`) — v7.0.0 | 🟡 OFFLINE / READINESS REVIEW

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `OFFLINE / PENDING` | Development / Preview Staging |
| **Vercel Deployment** | `PENDING` | [https://care.churchcore.us](https://care.churchcore.us) |
| **Supabase Database** | `LOCAL_ONLY` | Dedicated Sovereign Instance (RLS Enforced) |
| **Readiness Score** | `74%` | Measured against production launch gates |

##### ⚠️ Production Readiness Assessment
**Active Blockers:**
- 🔴 Branch feat/faithful-workflows-enhancements pending merge into main
- 🔴 Mobile Vite lockfile synchronization pending verification (PR #139)

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Merge and verify PR #139 across web and standalone API services
- 🛠️ Run automated launch readiness suite: npm run test:launch-readiness
- 🛠️ Configure automated Vercel frontend / Supabase backend deployment

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `75%`
- **Recent Milestones Delivered:**
  - ✅ PR #139: Mobile Vite lockfile resolution and dependency alignment
  - ✅ Counseling intake, pastoral notes, and secure consent flows verified
  - ✅ Automated AppSec and nightly security test suites operational

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Initial control plane registration commit`

**Next Engineering Steps:**
- 🎯 Complete translation worker container optimization
- 🎯 Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `60 minutes`
- **Session Timestamp:** `2026-10-17T15:19:19.578297+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Addressed mobile Vite lockfile desynchronization and validated counseling note encryption boundaries.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-14] Vite lockfile conflict between root React app and mobile companion bundle.` | `[2026-10-14] Unified package-lock.json with explicit override resolutions in PR #139.` |

---

### ChurchCore-Orthos (`churchcore-orthos`) — v0.18.0 | 🟡 OFFLINE / READINESS REVIEW

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `OFFLINE / PENDING` | Development / Preview Staging |
| **Vercel Deployment** | `PREVIEW` | [https://churchcore-orthos.vercel.app](https://churchcore-orthos.vercel.app) |
| **Supabase Database** | `LOCAL_ONLY` | Dedicated Sovereign Instance (RLS Enforced) |
| **Readiness Score** | `85%` | Measured against production launch gates |

##### ⚠️ Production Readiness Assessment
**Active Blockers:**
- 🔴 Production Supabase project connection pending manual key provisioning
- 🔴 Awaiting final verification of Omni-Council test suite

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Run npm run test:omni-council across full compliance checklist
- 🛠️ Bind production Vercel environment variables to Supabase cloud instance
- 🛠️ Verify fund-accounting double-entry balance constraints

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `85%`
- **Recent Milestones Delivered:**
  - ✅ PR #25 merged: Departmental Ministry Governance & Maturity Engine (v0.18.0)
  - ✅ PR #24 merged: Compensating controls module for small churches
  - ✅ Audit trail immutability and financial safeguarding rules verified

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Merge pull request #25 from ricardojjulia/feature/ministry-governance-maturity-engine (3296855)`
- `feat(ministries): Departmental Ministry Governance & Maturity Engine (v0.18.0) (aa4412c)`
- `Merge pull request #24 from ricardojjulia/feature/compensating-controls-small-churches (a196eba)`
- `ci: upgrade workflow node version to 22 for native WebSocket support (9e8f120)`

**Next Engineering Steps:**
- 🎯 Deploy staging preview build to Vercel
- 🎯 Execute test:security and audit:rls verification

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `75 minutes`
- **Session Timestamp:** `2026-10-17T15:19:19.578297+00:00`
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
| **Vercel Deployment** | `DEPLOYED` | [https://faithfull-scholars.vercel.app](https://faithfull-scholars.vercel.app) |
| **Supabase Database** | `CONNECTED` | Dedicated Sovereign Instance (RLS Enforced) |
| **Readiness Score** | `90%` | Measured against production launch gates |

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
- `docs: A1 honest launch surface merged and live (#87) (5edc51b)`
- `fix: A1 follow-ups — server language, translated sign-up errors, honest plan name (#86) (06f4b65)`
- `fix(csp): allow Cloudflare Turnstile so sign-up can complete (#85) (c508488)`
- `feat: honest launch surface (Council Review 20 slice A1) (#84) (619b94a)`

**Next Engineering Steps:**
- 🎯 Complete faculty profile public monograph index
- 🎯 Execute npm run audit:rls against production schema

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `105 minutes`
- **Session Timestamp:** `2026-10-17T15:19:19.578297+00:00`
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
