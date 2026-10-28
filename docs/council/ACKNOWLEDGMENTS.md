# ChurchCore - Council Governance & Directive Ledger

> **Central Manifest:** https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/governance-sync/manifest.json
> **Last Enforced:** 2026-10-28 16:48:00 UTC
> **Enforcement Engine:** `scripts/pull-and-enforce-directives.py`

## Active Directives Implementation Ledger

| Council ID | Requirement ID | Status | Mandate & Evidence |
| :--- | :--- | :---: | :--- |
| **COUNCIL-2026-001** | `REQ-001-01` | ✅ IMPLEMENTED & VERIFIED | **Constitutional Row-Level Security (RLS) Mandate**<br>_Verified (`supabase/migrations/20261028000000_control_plane_governance_schema.sql` & `npm run audit:rls`)_ |
| **COUNCIL-2026-001** | `REQ-001-02` | ✅ IMPLEMENTED & VERIFIED | **Zero Cross-Application Data Propagation**<br>_Verified (100% Sovereign DB Isolation; zero customer PII columns in Control Plane schema)_ |
| **COUNCIL-2026-002** | `REQ-002-01` | ✅ IMPLEMENTED & VERIFIED | **Powered by ChurchCore Trust Badge**<br>_Verified (`src/components/branding/ChurchCoreTrustBadge.tsx` rendered on `/login` and Cockpit Footer)_ |
| **COUNCIL-2026-002** | `REQ-002-02` | ✅ IMPLEMENTED & VERIFIED | **WCAG AAA Color Contrast Compliance**<br>_Verified_ |
| **COUNCIL-2026-002** | `REQ-002-03` | ✅ IMPLEMENTED & VERIFIED | **Sub-Brand Orthography & Nomenclature**<br>_Verified (ChurchCore nomenclature matches orthography)_ |
| **COUNCIL-2026-003** | `REQ-003-01` | ✅ IMPLEMENTED & VERIFIED | **Mandatory Pre-Flight Agent Rule Installation**<br>_Verified (Installed in .agents/rules/)_ |
| **COUNCIL-2026-003** | `REQ-003-02` | ✅ IMPLEMENTED & VERIFIED | **Local Implementation Ledger Initialization**<br>_Verified (docs/council/ACKNOWLEDGMENTS.md present)_ |
| **COUNCIL-2026-004** | `REQ-004-01` | ✅ IMPLEMENTED & VERIFIED | **Edge Telemetry Reporting File & Script**<br>_Verified (`scripts/report-telemetry.py` & `/api/telemetry/ingest`)_ |
| **COUNCIL-2026-004** | `REQ-004-02` | ✅ IMPLEMENTED & VERIFIED | **Mandatory Offline Readiness Assessment**<br>_Verified_ |
| **COUNCIL-2026-004** | `REQ-004-03` | ✅ IMPLEMENTED & VERIFIED | **AI Session Logging & Deployment Diagnostics**<br>_Verified_ |
| **COUNCIL-2026-005** | `REQ-005-01` | ✅ IMPLEMENTED & VERIFIED | **Maintain an Evidence-Backed MVP Completion Plan**<br>_Verified_ |
| **COUNCIL-2026-005** | `REQ-005-02` | ✅ IMPLEMENTED & VERIFIED | **Phased Execution Gate: Human Trials Commence After MVP Code Completion**<br>_Verified_ |
| **COUNCIL-2026-005** | `REQ-005-03` | ✅ IMPLEMENTED & VERIFIED | **Vercel Production Deployment Technical Readiness**<br>_Verified (`next build` + `vercel.json`)_ |
| **COUNCIL-2026-005** | `REQ-005-04` | ✅ IMPLEMENTED & VERIFIED | **Control Plane Telemetry Synchronization**<br>_Verified_ |
| **COUNCIL-2026-006** | `REQ-006-01` | ✅ IMPLEMENTED & VERIFIED | **Universal Institutionalization of the Testing Council**<br>_Verified_ |
| **COUNCIL-2026-006** | `REQ-006-02` | ✅ IMPLEMENTED & VERIFIED | **Inseparable Automated Testing Invariant**<br>_Verified (`vitest` suite + `tests/test_governance_manifest.py`)_ |
| **COUNCIL-2026-006** | `REQ-006-03` | ✅ IMPLEMENTED & VERIFIED | **Sovereign Control Plane Split Priority & Gate Architecture**<br>_Verified_ |
| **COUNCIL-2026-006** | `REQ-006-04` | ✅ IMPLEMENTED & VERIFIED | **Closed-Loop Governance Challenge & Non-Stalling Automated Resolution**<br>_Verified_ |
| **COUNCIL-2026-008** | `REQ-008-01` | ✅ IMPLEMENTED & VERIFIED | **Universal Post-Test Telemetry Synchronization Mandate**<br>_Verified (`npm run telemetry:report` & `posttest` hook in `package.json`)_ |
| **COUNCIL-2026-008** | `REQ-008-02` | ✅ IMPLEMENTED & VERIFIED | **Autonomous Live Endpoint Probing & Blocker Clearance**<br>_Verified (`src/lib/sync/fleet-synchronizer.ts` preserves edge readiness & blockers)_ |
| **COUNCIL-2026-010** | `REQ-010-01` | ✅ IMPLEMENTED & VERIFIED | **Universal OpenRouter Gateway Consolidation**<br>_Verified (`src/lib/ai/openrouter-gateway.ts` with `data_collection: deny`)_ |
| **COUNCIL-2026-010** | `REQ-010-02` | ✅ IMPLEMENTED & VERIFIED | **Sovereign Model Evaluator & Dynamic Tier Router**<br>_Verified (`evaluateAndRouteModel` 3-tier router + Vitest coverage)_ |
| **COUNCIL-2026-010** | `REQ-010-03` | ✅ IMPLEMENTED & VERIFIED | **Cost & Sustainability Guardrails**<br>_Verified (`max_tokens <= 4096`, fallback cascade, token audit telemetry)_ |
| **COUNCIL-2026-011** | `REQ-011-01` | ✅ IMPLEMENTED & VERIFIED | **Enterprise `@localization-governance` Framework Adoption**<br>_Verified (`localization-governance.config.mjs` & `locales/{en,es}.json`)_ |
| **COUNCIL-2026-011** | `REQ-011-02` | ✅ IMPLEMENTED & VERIFIED | **OpenRouter AI Translation Gateway Integration**<br>_Verified (`ops/translate-locale.mjs` routes via OpenRouter Tier 2 with `data_collection: deny`)_ |
| **COUNCIL-2026-011** | `REQ-011-03` | ✅ IMPLEMENTED & VERIFIED | **Variable Token `{var}` Preservation & Domain Glossaries**<br>_Verified (`data/glossaries/es.json` & placeholder token validator)_ |
| **COUNCIL-2026-011** | `REQ-011-04` | ✅ IMPLEMENTED & VERIFIED | **Mandatory Pre-Merge CI Quality Gate**<br>_Verified (`npm run audit:i18n` in `package.json` & `.github/workflows/ci.yml`)_ |
| **COUNCIL-2026-012** | `REQ-012-01` | ✅ IMPLEMENTED & VERIFIED | **Next.js 16 App Router & Embedded Security Guardrails**<br>_Verified (`src/types/security.ts` & `src/lib/security/action-wrapper.ts`)_ |
| **COUNCIL-2026-012** | `REQ-012-02` | ✅ IMPLEMENTED & VERIFIED | **Username/Password Authentication Gate & Allowlisted Operator RBAC**<br>_Verified (`src/middleware.ts`, `src/app/login/page.tsx`, `src/lib/auth/session.ts`)_ |
| **COUNCIL-2026-012** | `REQ-012-03` | ✅ IMPLEMENTED & VERIFIED | **Constitutional Section III Supabase Schema & 100% Forced RLS**<br>_Verified (`supabase/migrations/20261028000000_control_plane_governance_schema.sql`)_ |
| **COUNCIL-2026-012** | `REQ-012-04` | ✅ IMPLEMENTED & VERIFIED | **Constant-Time Vercel Cron & Cryptographic GitHub Webhook Mesh**<br>_Verified (`src/app/api/cron/fleet-sync/route.ts` & `src/app/api/webhooks/github/route.ts`)_ |
| **COUNCIL-2026-012** | `REQ-012-05` | ✅ IMPLEMENTED & VERIFIED | **Full Control Plane Dogfooding of COUNCIL-2026-002, 010, and 011**<br>_Verified (`npm run audit:arch` passes all 12 architectural checks)_ |
