# Operational Standard: Cross-Repository Governance Sync & Dispatch Protocol

**Classification:** Mandatory Operational Standard & Software Governance SOP  
**Governing Council Reference:** [COUNCIL-2026-003](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-003.md)  
**Status:** ACTIVE INSTITUTIONAL MANDATE  
**Applies To:** All 6 Ecosystem Repositories (`ChurchCore`, `ChurchCore-LMS`, `ChurchCore-Academy`, `ChurchCoreCare`, `ChurchCore-Orthos`, `FaithFullScholars`)  
**Last Updated:** 2026-10-16  

---

## 1. Foundational Mandate: The Single Source of Truth

`ChurchCore-Business` is the sovereign executive brain, architectural tribunal, and commercial authority for the ChurchCore ecosystem. 

**Constitutional Mandate:** No individual software repository shall operate as an isolated silo regarding architectural standards, branding guidelines, privacy guardrails, or council-ratified invariants. 

Every AI development session, engineer, or automated CI/CD pipeline working on any ChurchCore software **must begin by evaluating and implementing all active Council Directives** dispatched from this repository, and **must upstream formal acknowledgments** upon implementation.

---

## 2. The Universal Two-Way Protocol Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE TWO-WAY GOVERNANCE LOOP                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   1. CENTRAL HUB: ChurchCore-Business (GitHub)                         │
│      • Council ratifies COUNCIL-YYYY-XXX                               │
│      • Central machine manifest published to:                          │
│        https://raw.githubusercontent.com/.../manifest.json             │
│                                │                                       │
│                                ▼ FETCH VIA HTTPS / CURL                │
│                                                                        │
│   2. INDIVIDUAL PRODUCT REPO (Edge Software Pillar)                    │
│      • Pre-Flight: AI Agent executes mandatory manifest pre-flight     │
│      • Evaluates pending requirements for this specific repo           │
│      • Implements & verifies in code with tests                        │
│      • Logs acknowledgment in `docs/council/ACKNOWLEDGMENTS.md`        │
│                                │                                       │
│                                ▲ PUSH TO GITHUB                        │
│                                │                                       │
│   3. CENTRAL COMPLIANCE MONITOR: (scripts/sync-governance.py)          │
│      • Queries GitHub repos for their ACKNOWLEDGMENTS.md               │
│      • Updates central COMPLIANCE-MATRIX.md across the entire company  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Product Repository Onboarding & Activation Checklist

Every software repository in the ChurchCore portfolio **must maintain the following two files**:

### File 1: The Pre-Flight Rule
* **Location in Product Repo:** `.agents/rules/council-governance-sync.md`
* **Content Source:** Copy verbatim from [PRODUCT-COUNCIL-SYNC-RULE.md](file:///Users/rjulia/ChurchCore-Business/docs/templates/PRODUCT-COUNCIL-SYNC-RULE.md).
* **Function:** Forces any AI agent (Antigravity, Cursor, Claude, Copilot) to fetch `manifest.json` before writing a single line of code.

### File 2: The Local Implementation Ledger
* **Location in Product Repo:** `docs/council/ACKNOWLEDGMENTS.md`
* **Content Source:** Copy initial template from [PRODUCT-ACKNOWLEDGMENTS-TEMPLATE.md](file:///Users/rjulia/ChurchCore-Business/docs/templates/PRODUCT-ACKNOWLEDGMENTS-TEMPLATE.md).
* **Function:** Serves as the machine-readable receipt acknowledging which requirements have been implemented, the date, commit hash, and verified test surfaces.

---

## 4. Execution SLA & Upstream Acknowledgment Lifecycle

When a Council Decision is ratified in `ChurchCore-Business`:

1. **Dispatch (Immediate):** The requirement is assigned to affected products in `manifest.json` with status `PENDING`.
2. **Pre-Flight Ingestion (Next Session):** The next time an agent opens the affected product repo, the directive is flagged as an active priority.
3. **Implementation & Verification Surface:**
   - The engineer or agent implements the code.
   - Code must pass 100% of local test surfaces (e.g., `npm run test`, `audit:rls`, or accessibility checks).
4. **Upstream Acknowledgment:**
   - The agent appends the verified acknowledgment entry to `docs/council/ACKNOWLEDGMENTS.md`.
   - The commit is pushed to that product's GitHub repository.
5. **Central Status Reconciliation:**
   - The central `scripts/sync-governance.py` engine polls the product repositories and updates `COMPLIANCE-MATRIX.md` to `✅ IMPLEMENTED & VERIFIED`.

---

## 5. Sovereign Data Invariant (Non-Negotiable)

While governance directives, branding rules, and architectural invariants are synchronized across repositories:
* **ZERO DATA PROPAGATION:** No council directive shall ever order the silent background synchronization or copying of customer/member data between application databases.
* Each product database remains an **absolute sovereign silo** protected by its own Row-Level Security boundary.
