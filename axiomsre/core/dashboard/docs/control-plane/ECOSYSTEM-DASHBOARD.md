# ChurchCore Ecosystem: Master Control Plane Dashboard

> **Central Governance Brain:** `ricardojjulia/ChurchCore-Business`  
> **Last Aggregated:** `2026-10-19 20:44:51 UTC`
> **Authority:** Council Decisions COUNCIL-2026-001 through 004 & Constitution §III  

## 1. Executive Telemetry & Fleet Health KPI

| Fleet Metric | Value | Target | Status |
| :--- | :--- | :--- | :--- |
| **Total Sovereign Repos** | `6` | 6 Products | 🟢 Complete Fleet |
| **Active Production Online** | `6 / 6` | 6 / 6 | 🟢 100% Online |
| **Average Readiness Score** | `88%` | 100% | 🟢 High Readiness |
| **Portfolio MVP Progress** | `85%` | 100% | 🟢 On Schedule |
| **Cross-App Data Isolation** | `UNVERIFIED` | Evidence from every product | ⚠️ One or more edge reports are unverified |

## 2. Product Fleet Status Cards

### ChurchCore ChMS (`churchcore-chms`) — v3.5.0 | 🟢 ONLINE

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
- `chore: refresh control-plane files and give the control plane an accurate view (89b7723)`
- `Merge remote-tracking branch 'origin/main' into cp-refresh (8440c01)`
- `feat: R1d data-erasure approval flow — exact, household-scoped erasure with audit redaction (Council Reviews 55–57) (#205) (840643d)`
- `chore: add ChurchCore-Business control-plane rule, telemetry script and council ledger (72f4653)`

**Next Engineering Steps:**
- 🎯 Testing Council v6 full run
- 🎯 R2 release
- 🎯 Owner actions O7, O15, O23 (mail), O24 (business repo visibility), O25 (Spanish review), O26 (GHAS)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `claude-opus-5-5`
- **Session Duration:** `600 minutes`
- **Session Timestamp:** `2026-10-17T23:12:22.708251+00:00`
- **Session Operator:** `Ricardo J. Julia (with Claude Code)`
- **Session Work Summary:** R1a-R1d, CP1 and CP1b merged (#201-#203, #205-#207); demo mode turned off in production; /security rewritten to true claims with security headers and security.txt; next: Testing Council v6 full run, then R2.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-17] Production ran with NEXT_PUBLIC_DEMO_MODE=true (demo-only payment route passed its gate; provider stubs could fake success).` | `[2026-10-17] NEXT_PUBLIC_DEMO_MODE=false (Config) for Production and redeployed; demo route verified 403.` |
| `[2026-10-17] PR #206 merged before Council Review 58 finished; the live /security page made ~9 false security claims.` | `[2026-10-17] CP1b (#207): /security rewritten so every claim is true of the code (evidence in docs/factory-runs/2026-10-17-cp1b-truthful-security.md); live check: no banned phrases, security headers present, security.txt served.` |

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
- `Record Colegio Biblos local pilot preparation (#248) (bed47c2)`
- `Approve Colegio Biblos local pilot charter (#247) (f44c6b7)`
- `Record technical baseline closeout (#246) (4bfe20b)`
- `Merge pull request #245 from ricardojjulia/docs/pilot-to-production-completion-plan (dca2d25)`

**Next Engineering Steps:**
- 🎯 Verify the actual Colegio Biblos participant login on the approved local/private topology.
- 🎯 Complete the uncoached pilot session before adding feature work.
- 🎯 Record sanitized findings and re-observe any S0-S2 blockers before accepting Workstream C residual risk.

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `OpenAI Codex`
- **Session Duration:** `25 minutes`
- **Session Timestamp:** `2026-10-17T16:05:27.430761+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** Reconciled Academy control-plane governance and evidence-backed telemetry.

**Recent Deployment / Build Errors & Mitigations Applied:**
| Error Encountered | Mitigation / Fix Applied |
| :--- | :--- |
| `[2026-10-17] The admissions, enrollment-conversion, and LLIS-consent RLS verification commands could not complete because the local anon/authenticated roles lack required table privileges.` | `[2026-10-19] Authenticated Vercel CLI inspection verified project churchcore/church-core-academy and Ready deployment dpl_CGgewdcXBDt1Z6RHcdg8eqM5eJiv with the canonical domain aliases.` |

---

### ChurchCoreCare (`churchcore-care`) — v7.0.0 | 🟢 ONLINE

#### Infrastructure & Online Status
| Parameter | Live State | Details |
| :--- | :--- | :--- |
| **Online Status** | `ONLINE` | Publicly accessible via Vercel |
| **Vercel Deployment** | `DEPLOYED` | [https://www.churchcorecare.io](https://www.churchcorecare.io) |
| **Supabase Database** | `CONNECTED` | Sovereign isolation reported and verified |
| **Readiness** | `95%` | No score basis supplied |

##### ⚠️ Readiness Assessment
- 🟢 No critical architecture blockers.

**Immediate Next Required Actions:**
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
- `Merge pull request #139 from ricardojjulia/fix/mobile-vite-lockfile (188f9df)`
- `fix: synchronize Vercel dependency resolution (1fbe989)`
- `Merge pull request #138 from ricardojjulia/dependabot/npm_and_yarn/fast-uri-3.1.8 (710fc4b)`
- `Merge branch 'main' into dependabot/npm_and_yarn/fast-uri-3.1.8 (9233546)`

**Next Engineering Steps:**
- 🎯 Complete translation worker container optimization
- 🎯 Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `60 minutes`
- **Session Timestamp:** `2026-10-17T21:47:00.111112+00:00`
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
- `fatal: your current branch 'main' does not have any commits yet`

**Next Engineering Steps:**
- 🎯 Deploy staging preview build to Vercel
- 🎯 Execute test:security and audit:rls verification

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `gemini-2.5-pro`
- **Session Duration:** `30 minutes`
- **Session Timestamp:** `2026-10-18T18:01:10.365584+00:00`
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
- 🔴 Phase 1 MVP items open: A3b publishing consent, A4 production gates and Sentry, WCAG AAA contrast for signed-in areas, B2 email outbox, B3 and B4 invitations, B5 deletion and export (docs/FAITHFULL_SCHOLARS_FULL_PLAN.md §24)
- 🔴 No real support address (NEXT_PUBLIC_SUPPORT_EMAIL); the legal texts route rights requests to /contact
- 🔴 Legal texts are v1 drafts with operator name and state placeholders; counsel-reviewed v2 needed before real users
- 🔴 Custom domain (B1) deferred by the owner; outbound email stays off until then

**Immediate Next Required Actions:**
- 🛠️ Build A3b (publishing consent for declared beliefs, Gemini disclosure)
- 🛠️ Extend the axe AAA contrast scan to signed-in dashboards (public pages done, ADR 0038)
- 🛠️ Owner: set NEXT_PUBLIC_SUPPORT_EMAIL; supply operator name and state for legal v2

#### MVP Development Status & Milestones
- **Current Phase:** `BETA`
- **Completion Percentage:** `30%`
- **Recent Milestones Delivered:**
  - ✅ A3a legal pages, acceptance records, contact and password reset live (PRs #88, #89; ADR 0031)
  - ✅ Powered by ChurchCore badge live (PRs #91, #90)
  - ✅ A1 honest launch surface live (PRs #84-#87)
  - ✅ A2 example data removed from production (PRs #80-#83)

#### Engineering Activity
**Latest Functional Changes (Git Commits):**
- `feat(brand): badge follow-up: translated title, new-tab note, shared URL, test (#90) (3b3adc7)`
- `feat(branding): install Powered by ChurchCore badge (#91) (288b2be)`
- `docs: A3a merged and live (#89) (69ff7c8)`
- `A3a: legal pages, acceptance records, contact and password reset (ADR 0031) (#88) (50ac410)`

**Next Engineering Steps:**
- 🎯 A3b: consent before publishing declared beliefs (FS019) and the Gemini disclosure
- 🎯 WCAG AAA contrast: extend the axe scan to signed-in dashboards (public pages done, ADR 0038)
- 🎯 A4: fail-closed Turnstile, required RATE_LIMIT_SALT, Sentry (ADR 0032)

#### AI / LLM Session Telemetry & Deployment Diagnostics
- **Last AI Model Used:** `claude-opus-5-5`
- **Session Duration:** `0 minutes`
- **Session Timestamp:** `2026-10-18T04:11:03.586850+00:00`
- **Session Operator:** `Ricardo J. Julia`
- **Session Work Summary:** A3a shipped (legal pages, acceptance records, contact, reset); badge follow-up; COUNCIL-2026-005 sync: MVP plan, honest ledger and telemetry, enforcement script no longer passes unchecked requirements.

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
