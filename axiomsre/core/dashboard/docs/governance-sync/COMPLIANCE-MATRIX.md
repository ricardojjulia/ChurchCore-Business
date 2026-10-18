# ChurchCore Governance Compliance Matrix

**Classification:** Cross-Product Governance Audit & Tracking Dashboard  
**Central Manifest:** [manifest.json](file:///Users/rjulia/ChurchCore-Business/docs/governance-sync/manifest.json)  
**Governing Authority:** Executive Governing Council  
**Last Updated:** 2026-10-16  

---

## 1. Master Ecosystem Compliance Dashboard

Status Legend:  
- ✅ **IMPLEMENTED & VERIFIED:** Implemented in code, acknowledged in repo, verified with tests.  
- 🟡 **IN PROGRESS:** Actively being developed or tested.  
- ⚪ **PENDING / DISPATCHED:** Active directive dispatched; awaiting product repo sprint allocation.  

| Council Decision | Requirement ID & Title | ChurchCore | ChurchCore-LMS | ChurchCore-Academy | ChurchCoreCare | ChurchCore-Orthos | FaithFullScholars |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **COUNCIL-2026-001** | `REQ-001-01` Constitutional Row-Level Security (RLS) Mandate | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ⚠️ VERIFICATION BLOCKED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| **COUNCIL-2026-001** | `REQ-001-02` Zero Cross-Application Data Propagation | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| **COUNCIL-2026-002** | `REQ-002-01` Powered by ChurchCore Trust Badge | 🟡 IN PROGRESS | 🟡 IN PROGRESS | 🟡 IN PROGRESS | 🟡 IN PROGRESS | 🟡 IN PROGRESS | 🟡 IN PROGRESS |
| **COUNCIL-2026-002** | `REQ-002-02` WCAG AAA Color Contrast Compliance | ⚪ PENDING | ⚪ PENDING | ⚪ PENDING | ⚪ PENDING | ⚪ PENDING | ⚪ PENDING |
| **COUNCIL-2026-002** | `REQ-002-03` Sub-Brand Orthography & Nomenclature | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| **COUNCIL-2026-003** | `REQ-003-01` Mandatory Pre-Flight Agent Rule Installation | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| **COUNCIL-2026-003** | `REQ-003-02` Local Implementation Ledger Initialization | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| **COUNCIL-2026-004** | `REQ-004-01` Edge Telemetry Reporting File & Script | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| **COUNCIL-2026-004** | `REQ-004-02` Mandatory Offline Readiness Assessment | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| **COUNCIL-2026-004** | `REQ-004-03` AI Session Logging & Deployment Diagnostics | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |

---

## 2. Requirement Details & Implementation Notes

### COUNCIL-2026-001: Ecosystem Architecture & Sovereign Invariants
* **`REQ-001-01` (Row-Level Security):** Do not infer fleet-wide verification from migration text or file presence. Academy's three repository-owned RLS commands were attempted on 2026-10-17 and could not complete because local anon/authenticated roles lacked required table privileges; Academy remains unverified until those commands pass after an Academy-scoped security review.
* **`REQ-001-02` (Zero Data Propagation):** All 6 application databases operate as sovereign silos. No background message bus or automated sync pipelines connect them. Verified during initial architecture audit.

### COUNCIL-2026-002: Branding Governance & White-Label Standards
* **`REQ-002-01` (Footer Trust Badge):** All client-facing footers must render the official *"Powered by ChurchCore"* trust mark linking to `https://www.churchcore.io/security`. Dispatched to all 6 product repos.
* **`REQ-002-02` (WCAG AAA Contrast):** Automated accessibility audit (7:1 contrast ratio) required on primary navigation and dashboard buttons. Dispatched to all 6 product repos.
* **`REQ-002-03` (Naming Orthography):** All repos have verified exact CamelCase nomenclature (`ChurchCore`, `ChurchCore-LMS`, `ChurchCore-Academy`, `ChurchCoreCare`, `ChurchCore-Orthos`, `FaithFullScholars`).

---

## 3. How to Update This Matrix

This matrix is synchronized via the generic automated audit script:
```bash
python3 scripts/sync-governance.py
```
The script queries each product repository on GitHub (or local sibling repos if available), parses each repo's `docs/council/ACKNOWLEDGMENTS.md`, and updates this table automatically.
