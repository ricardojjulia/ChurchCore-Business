# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-10-18 17:18:09 UTC`  
> **Authority:** Council Decisions COUNCIL-2026-001 through 004 & Constitution §III  

## 1. Executive Telemetry & Fleet Health KPI

| Fleet Metric | Value | Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Sovereign Repos** | `6` | 6 Products | 🟢 Complete Fleet |
| **Active Production Online** | `6 / 6` | 6 / 6 | 🟢 100% Online |
| **Average Readiness Score** | `94%` | 100% | 🟢 High Readiness |
| **Portfolio MVP Progress** | `95%` | 100% | 🟢 On Schedule |
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

### ChurchCore LMS (`churchcore-lms`) — v0.47.0 | 🟢 ONLINE

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
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ PR #89 merged: Turbopack use-server SSR build error resolved & auth layout polished
  - ✅ PR #88 merged: Neutral pre-auth and dynamic branding with Powered by ChurchCore badge live
  - ✅ Supabase pg_net extension enabled and release build 0.36.1 deployed

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `Merge pull request #101 from ricardojjulia/feat/universal-app-switcher-and-mvp-100 (b0d3645)`
- `feat(navigation): integrate Universal AppSwitcher (OPS-02) and advance Phase 1 to 100% complete (5d427b3)`
- `Merge pull request #100 from ricardojjulia/gov/council-006-testing-council (22d92cf)`
- `feat(governance): standardize Testing Council protocol and 3-phase gating (COUNCIL-2026-006) (c43909e)`

**Next Engineering Steps:**
- 🎯 Test course completion webhook integration with local certification service
- 🎯 Run full synthetic production test suite (npm run test:prod-synthetic)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-18T14:27:22.121354+00:00`
- **Session Operator:** `Ricardo Julia`
- **Session Work Summary:** Phase 1 MVP 100% complete, Universal AppSwitcher merged to main, Release deployed

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
| **Readiness Score** | `100%` | No score basis supplied |

#### MVP Development Status & Milestones
- **Current Phase:** `PRODUCTION`
- **Completion Percentage:** `100%`
- **Recent Milestones Delivered:**
  - ✅ Production release live at https://www.churchcoreacademy.io and Vercel edge
  - ✅ PR #249: Reconcile control-plane governance evidence
  - ✅ PR #248: Colegio Biblos local pilot preparation recorded
  - ✅ PR #247: Colegio Biblos local pilot charter formally approved

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(branding): install Powered by ChurchCore badge linking to https://www.churchcore.io/security (016be3e)`
- `Reconcile control-plane governance evidence (#249) (7fcbe31)`
- `Record Colegio Biblos local pilot preparation (#248) (bed47c2)`
- `Approve Colegio Biblos local pilot charter (#247) (f44c6b7)`

**Next Engineering Steps:**
- 🎯 Verify OneRoster 1.2 delivery cron worker in production
- 🎯 Execute verify:admissions-rls and verify:enrollment-conversion-rls

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `60 minutes`
- **Session Timestamp:** `2026-10-18T17:18:00.000000+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Production deployment verified live on Vercel edge (HTTP/2 200) and custom domain www.churchcoreacademy.io.

- 🟢 *No active deployment errors logged.*

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

### ChurchCore Orthos (`churchcore-orthos`) — v0.18.3 | 🟢 ONLINE

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
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-18T14:26:34.497095+00:00`
- **Session Operator:** `Ricardo J Julia`
- **Session Work Summary:** Routine development & maintenance

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-15] X-Frame-Options and CSP headers caused preview iframe blocking in audit reports.` | `[2026-10-15] Configured explicit CSP allowlists in vercel.json for audit PDF preview rendering.` |

---

### FaithFullScholars (`faithfull-scholars`) — v0.2.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://faith-full-scholars.vercel.app](https://faith-full-scholars.vercel.app) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness Score** | `95%` | No score basis supplied |

##### ⚠️ Production Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions for Online Launch:**
- 🛠️ Run npm run verify:deploy against live Vercel endpoint
- 🛠️ Roll out multi-persona onboarding wizard for pastors and ministries

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `92%`
- **Recent Milestones Delivered:**
  - ✅ COUNCIL-2026-007 / TSK-SCHL-003: Faculty Profile Public Monograph Index & Peer-Reviewed Portfolio completed with real-time search, DOI citation resolvers, and Chicago export
  - ✅ COUNCIL-2026-007 / TSK-SCHL-004: Fortified FaithFull Community Ecosystem database migration and sub-50ms RLS functions deployed
  - ✅ PR #87 merged: Honest launch surface merged and live on Vercel
  - ✅ PR #86 merged: Bilingual Spanish server translations and translated sign-up errors

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(monographs): implement interactive Faculty Profile Public Monograph Index with category filter pills and DOI citations (TSK-SCHL-003)`
- `feat(community): deliver fortified community ecosystem schema migration for pastors, churches, evangelists, and councils (COUNCIL-2026-007)`
- `feat(branding): install Powered by ChurchCore badge linking to https://www.churchcore.io/security (#91) (288b2be)`
- `docs: A3a legal, contact and password reset merged and live (#89) (69ff7c8)`

**Next Engineering Steps:**
- 🎯 Roll out multi-persona onboarding wizard for pastors and ministries
- 🎯 Execute npm run audit:rls against production schema

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `120 minutes`
- **Session Timestamp:** `2026-10-18T17:15:00.000000+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Implemented Faculty Profile Public Monograph Index on /scholars/[slug]; added community multi-persona database migration under COUNCIL-2026-007.

- 🟢 *No active deployment errors logged.*

---

## 3. Central Directives Imposition & Compliance Summary

| Directive ID | Mandate Title | Compliance Status |
| :--- | :--- | :--- |
| **CP-2026-DIR-01** | Sovereign Database Isolation & Zero Data Propagation | 🟢 100% Enforced Across 6 Repos |
| **CP-2026-DIR-02** | Endorsed Brand House & Powered by ChurchCore Badge | 🟡 Active Rollout (LMS & Scholars Live) |
| **CP-2026-DIR-03** | Standardized AppSwitcher Navigation Shell | ⏳ In Planning (Target: 2026-11-15) |
| **CP-2026-DIR-04** | Automated Edge Telemetry & Control Plane Reporting | 🟢 100% Active Across 6 Repos |
