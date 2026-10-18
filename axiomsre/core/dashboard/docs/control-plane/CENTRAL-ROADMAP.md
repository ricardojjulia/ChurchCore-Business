# ChurchCore Central Ecosystem Roadmap & Executive Directives

## 1. Executive Intent

The Executive Control Plane (`ChurchCore-Business`) establishes central engineering directives, brand mandates, and architectural goals for the six product repositories. While product teams maintain localized autonomy over their domain logic and implementation details, all products must adhere to the ecosystem invariants and execute portfolio-wide architectural epics.

---

## 2. Active Portfolio-Wide Directives (Mandatory Across All 6 Repos)

### Directive CP-2026-DIR-01: Sovereign Database Isolation & Zero Data Propagation
- **Authority**: Constitution §III, COUNCIL-2026-001, COUNCIL-2026-003.
- **Mandate**: Every application must maintain its own dedicated Supabase database project with full Row-Level Security (RLS) enforcement. No background sync buses, cross-application database links, or automated member replication mechanisms may be introduced.
- **Status**: **100% Enforced across all repositories.**

### Directive CP-2026-DIR-02: Endorsed Brand House & "Powered by ChurchCore" Badge
- **Authority**: BRANDING-GOVERNANCE.md, COUNCIL-2026-002.
- **Mandate**: All public authentication pages, marketing landings, customer footers, and email notifications must feature the official Endorsed Brand House lockup and the "Powered by ChurchCore" trust badge.
- **Status**: 
  - `churchcore-lms`: Implemented (PR #88).
  - `faithfull-scholars`: Implemented (PR #86/#87).
  - `churchcore-chms`: Pending badge implementation.
  - `churchcore-academy`: Pending badge implementation.
  - `churchcore-orthos`: Pending badge implementation.
  - `churchcore-care`: Pending badge implementation.

### Directive CP-2026-DIR-03: Unified App Switcher & Navigation Shell
- **Authority**: OPS-02 (Unified UX Shell).
- **Mandate**: Install the standardized `AppSwitcher` component in top navigation bars allowing users with accounts across multiple ChurchCore applications to navigate between tools without data entanglement.
- **Target Deadline**: 2026-11-15.

### Directive CP-2026-DIR-04: Automated Edge Telemetry & Control Plane Reporting
- **Authority**: COUNCIL-2026-004.
- **Mandate**: Every product repository must contain `.agents/rules/council-governance-sync.md`, `docs/control-plane/telemetry.json`, and `scripts/report-telemetry.py`. Telemetry must be evidence-backed, non-sensitive, and must distinguish acknowledgment from verified implementation. Session duration, model, errors, and mitigations are recorded only when known; telemetry does not authorize deployment or product work.
- **Status**: **Active rollout underway.**

### Directive CP-2026-DIR-05: 100% MVP Feature-Completion & Phased Testing Gating
- **Authority**: COUNCIL-2026-005.
- **Mandate**: Enforce strict sequential gating across all six products:
  1. **Phase 1 (100% Feature Code Complete + Unit Tests)**: All programmed features, edge routes, database schemas, and shared AppSwitcher navigation components must be 100% implemented in code. Standard automated unit and regression tests MUST accompany every new feature or bug fix.
  2. **Phase 2 (Comprehensive Human Trial Testing & Field Pilot Gate)**: Human trial testing, field pilot rehearsals (e.g. Colegio Biblos uncoached user sessions), and user acceptance testing commence *only after* Phase 1 is 100% complete.
  3. **Phase 3 (Production Vercel Edge Deployment)**: Edge deployment proceeds once Phase 2 human trials and security test suites are 100% green.
- **Artifacts**: Local roadmap [`docs/mvp-100-plan.md`](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-005.md) distributed to all 6 repos; canonical daily tracking report generated at [`docs/reports/DAILY-MVP-PROGRESS-REPORT.md`](file:///Users/rjulia/ChurchCore-Business/docs/reports/DAILY-MVP-PROGRESS-REPORT.md).
- **Status**: **100% Ratified & Active across all 6 sibling repositories.**

---

## 3. Product-Specific Roadmaps & Sprint Priorities

### 1. ChurchCore ChMS (`churchcore-chms` / `ChurchCore`)
- **Current Version**: `3.5.0`
- **Primary Domain**: Core church management, membership, giving, pastoral care, volunteer scheduling.
- **Sprint Goals**:
  1. Complete R1d data erasure approval queue and member rights screens (In Progress).
  2. Implement Endorsed Brand badge in navigation footer.
  3. Finalize Vercel cron schedules (`shepherd-ai`, `communications-scheduled`).
  4. Ensure 100% pass rate on `test:surfaces` and RLS policy audit.

### 2. ChurchCore LMS (`churchcore-lms` / `ChurchCore LMS`)
- **Current Version**: `0.47.0`
- **Primary Domain**: Theological education, ministerial credentialing, leadership development.
- **Sprint Goals**:
  1. Turbopack SSR build stability verification on Vercel production deployment.
  2. Implement course completion certificate generation and verification.
  3. Complete institutional billing and seat-allocation management.
  4. Expand AETH ministerial formation course catalog.

### 3. ChurchCore Academy (`churchcore-academy` / `ChurchCore Academy`)
- **Current Version**: `0.10.0`
- **Primary Domain**: Christian Day Schools (K-12), Bible institutes, homeschool cooperatives.
- **Sprint Goals**:
  1. Complete the active Colegio Biblos Workstream C gate: verify the actual participant browser/VM login and run the chartered uncoached session.
  2. Record sanitized pilot findings and re-observe any S0-S2 blockers before the Academy owner accepts residual risk.
  3. Resolve or formally scope the local-role privilege blockers preventing the admissions, enrollment-conversion, and LLIS-consent RLS verification commands from completing.
  4. Use observed pilot needs and Academy owner approval to select or exclude later OneRoster/LMS, bilingual, payment, communications, and hosted-validation lanes.
- **Deployment posture**: Owner-deferred. Control-plane telemetry and roadmap entries do not authorize Vercel, hosted Supabase, billable resources, or live providers.

### 4. ChurchCore Care (`churchcore-care` / `ChurchCore Care`)
- **Current Version**: `7.0.0`
- **Primary Domain**: Biblical counseling, pastoral care case management, benevolence assistance.
- **Sprint Goals**:
  1. Merge and test `feat/faithful-workflows-enhancements` branch.
  2. Resolve mobile Vite lockfile consistency (`PR #139`).
  3. Execute automated AppSec and nightly security test suites.
  4. Transition deployment configuration from standalone Docker/EC2 to automated Vercel/Supabase edge architecture.

### 5. ChurchCore Orthos (`churchcore-orthos` / `ChurchCore Orthos`)
- **Current Version**: `0.18.0`
- **Primary Domain**: Financial stewardship, fund accounting, denominational compliance, audit trails.
- **Sprint Goals**:
  1. Mature the Departmental Ministry Governance & Maturity Engine (v0.18.0 released).
  2. Expand compensating controls module for small churches without full audit committees.
  3. Validate Vercel production edge deployment headers and security csp policies.
  4. Run Omni-Council automated test suite (`council:omni`).

### 6. FaithFull Scholars (`faithfull-scholars` / `FaithFullScholars`)
- **Current Version**: `0.1.0`
- **Primary Domain**: Higher education theological scholarship, faculty research, peer-reviewed monographs.
- **Sprint Goals**:
  1. Maintain honest launch surface (PR #87 merged and live on Vercel).
  2. Validate Cloudflare Turnstile CAPTCHA and Spanish localized sign-up flows.
  3. Implement academic peer-review submission workflow and editorial dashboard.
  4. Complete production Supabase RLS audit (`npm run audit:rls`).

---

## 4. Central Change Imposition Protocol

When the Executive Control Plane imposes a new architectural change:
1. A new `Directive CP-YYYY-DIR-XX` is added to this file.
2. The change is incorporated into `docs/governance-sync/manifest.json`.
3. The next edge agent session running in each repository automatically ingests the directive, incorporates it into its localized backlog, and acknowledges completion via its acknowledgment ledger and telemetry report.
