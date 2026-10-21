# Deliberation: Universal Localization Governance & OpenRouter Translation Standard (COUNCIL-2026-011)

**Date:** 2026-10-20  
**Deliberation ID:** `DELIB-GRAND-HIGH-COUNCIL-20261020-LOCALIZATION-GOVERNANCE`  
**Governing Body:** High Sovereign Grand Council of ChurchCore (Control Plane Authority)  
**Status:** `RATIFIED UNANIMOUSLY`  
**Presiding Officers:** Sovereign Control Plane, Lead Systems Architect, Translation Guardian  

---

## 1. Context & Convening

The Grand Council convened on October 20, 2026, to evaluate the internationalization (i18n) and localization (l10n) implementations across all six software packages in the ChurchCore portfolio. 

As ChurchCore expands its footprint across bilingual Hispanic congregations, AETH ministerial institutes, Caribbean dioceses, and international academic seminaries, application translation is no longer an optional cosmetic enhancement—it is a critical tier-1 operational surface.

---

## 2. Comprehensive Fleet Audit & Comparative Teardown

The Council conducted an in-depth audit of localization tooling, scripts, and runtime architectures across all repositories:

### A. ChurchCore Care (`/Users/rjulia/ChurchCore Care`) — Grade: A+ (Reference Standard)
- **Architecture:** Authored the `@localization-governance/*` monorepo toolkit (`core`, `cli`, `storage-postgres`, `storage-filesystem`, `provider-google`).
- **Autonomous Agent:** Houses the Playwright-based `Translation Guardian` (`agents/translation_guardian/`), which automates end-to-end browser login, language switching, DOM string scraping, visual regression screenshot captures, and `translatedVisibleRatio` calculation.
- **Glossary Safeguards:** Enforces strict domain glossaries (`data/glossaries/es.json`) to prevent harmful mistranslations in clinical EHR and pastoral care triage workflows.
- **Operational Scripting:** Native Node.js CLI `ops/translate-locale.mjs` handles token extraction, placeholder integrity validation (`{name}`), and automated status reports in `docs/i18n/`.

### B. ChurchCore ChMS (`/Users/rjulia/ChurchCore`) — Grade: A-
- **Architecture:** Successfully adopted the `@localization-governance` framework via vendored tarballs (`vendor/localization-governance/`). Configured with `localization-governance.config.mjs` and PostgreSQL tenant storage.
- **Gaps:** Lacks the autonomous browser validation agent and relies on manual CLI execution.

### C. ChurchCore LMS (`/Users/rjulia/ChurchCore LMS`) — Grade: B
- **Architecture:** Houses `scripts/e2e-i18n-run.mjs` and curriculum-level Spanish translation tests for AETH ministerial certification.
- **Gaps:** Bespoke implementation coupled to Canvas-style course components; cannot be reused across other apps without refactoring.

### D. ChurchCore Orthos (`/Users/rjulia/ChurchCore Orthos`) — Grade: B
- **Architecture:** Features `scripts/test-translation-fullness-and-completeness.ts` which audits Spanish translation parity for safeguarding PDF reports.
- **Gaps:** Purely a static assertion test suite; lacks translation generation, glossary enforcement, and lifecycle management.

### E. FaithFullScholars (`/Users/rjulia/FaithFullScholars`) — Grade: C+
- **Architecture:** Contains static dictionary objects in `lib/i18n` with Spanish auth error toast translations.
- **Gaps:** No placeholder token verification, no automated coverage tracking, and no protection against missing keys during fast-paced PR merges.

---

## 3. Deliberation & Council Findings

1. **Why Ad-Hoc Scripts Must Be Deprecated**:
   Allowing each repo to maintain its own one-off test script or raw JSON file leads to duplicated engineering effort, placeholder corruption crashes in production, and term drift between sister apps (e.g., translating "membership" or "pastor" differently across ChMS, Care, and LMS).

2. **Why `@localization-governance` Must Be the Fleet Standard**:
   The toolkit in `ChurchCore Care` was specifically designed to be framework-neutral, decoupled from React or specific database engines, and enforces a formal lifecycle state machine. It guarantees that machine translations can never be deployed to production without passing placeholder checks, coverage thresholds, and glossary validation.

3. **Convergence with `COUNCIL-2026-010`**:
   Rather than relying on proprietary Google Cloud Translation APIs or fragmented vendor SDKs, all automated translation generation within `@localization-governance` must route through **OpenRouter** using Tier 2 models (`google/gemini-2.5-flash` or `meta-llama/llama-3.3-70b-instruct`) with mandatory Zero Data Retention (`"data_collection": "deny"`).

---

## 4. Formal Resolution & Directive Enactment

The Council unanimously resolves:
1. To ratify **`COUNCIL-2026-011`** as the binding localization directive for all six software packages.
2. To mandate the extraction and standardization of `@localization-governance` across the fleet.
3. To enforce pre-merge CI verification (`audit:i18n`) on all pull requests.
4. To register the decision in `docs/governance-sync/manifest.json` and codify Section 8 in `.agents/rules/churchcore-control-plane.md`.

*Approved by the High Sovereign Grand Council of ChurchCore.*
