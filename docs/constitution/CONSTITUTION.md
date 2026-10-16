# ChurchCore Operating Constitution & Governing Principles

**Status:** RATIFIED & ACTIVE  
**Ratified By:** ChurchCore Executive Governing Council  
**Classification:** Foundational Institutional Standard  

---

## 1. Preamble & Foundational Mandate

ChurchCore exists to provide the global Church, faith-based educational institutions, pastoral care ministries, and theological academies with software of uncompromising technical excellence, cryptographic data security, and deep spiritual stewardship.

We reject the false dichotomy between spiritual mission and world-class commercial engineering. ChurchCore is engineered to be an enduring, financially robust, highly scalable software enterprise that protects ministry sovereignty, safeguards vulnerable human souls, and eliminates administrative chaos.

---

## 2. The 7 Non-Negotiable Invariants (Constitutional Pillars)

### I. The Ministry Sovereignty & Data Privacy Principle
* **Invariant:** Every church, school, clinic, and scholar owns their data exclusively.
* **Rule:** No member data, pastoral counseling notes, academic records, or financial transactions shall ever be mined, sold, or shared for third-party advertising or unconfessional profiling.
* **Enforcement:** Row-Level Security (RLS) at the PostgreSQL boundary is mandatory for all tenant tables. Service-role bypasses are strictly forbidden in client-facing code.

### II. Absolute Separation of Pastoral & Clinical Boundaries
* **Invariant:** Pastoral counseling and licensed clinical counseling possess distinct legal and ethical boundaries.
* **Rule:** `ChurchCoreCare` must enforce cryptographic isolation between standard church membership notes and confidential counseling cases. Clergy-penitent privilege and HIPAA-aligned privacy must never leak into general staff dashboards.

### III. Single Unified Identity, Cryptographic Tenant Isolation
* **Invariant:** A single human being interacting across the ecosystem (e.g., Church Member $\to$ Sunday School Teacher $\to$ Seminary Student $\to$ Counseling Client) must experience a seamless identity (ChurchCore ID), but tenant boundaries remain strictly isolated.
* **Rule:** Cross-tenant reads or writes without explicit consent and cryptographic authorization represent a tier-1 critical security breach.

### IV. Dual-Tier Council Governance
* **Invariant:** No major architectural pivot, database schema migration, pricing shift, or business model expansion occurs without formal Council Deliberation and Ratification.
* **Rule:** Every strategic or architectural decision must produce an immutable record (`COUNCIL-YYYY-XXX`) containing voting rationales, dissenting arguments, threat models, and definition of done.

### V. Exhaustive Inquiry & Documentation Ledger
* **Invariant:** All strategic dilemmas, exploratory questions, and diverging business avenues must be documented in the Inquiries Ledger (`docs/inquiries/`).
* **Rule:** We do not discard dissenting opinions. Diverging avenues (e.g., open-core vs. proprietary, micro-church pricing vs. enterprise diocese) must be rigorously analyzed with explicit trade-offs and stored as organizational memory.

### VI. Sustainable Kingdom Stewardship & Margin Discipline
* **Invariant:** Software that cannot sustainably fund its own maintenance, security, and world-class talent fails the ministry long-term.
* **Rule:** Unit economics (CAC, LTV, Gross Margins, Net Revenue Retention) must be tracked with mathematical rigor. ChurchCore shall not operate on predatory vanity metrics or fragile deficit-driven hype.

### VII. Evidence-Based Product Portfolio (Code-Anchored Truth)
* **Invariant:** Strategic documents must reflect concrete codebase reality, not speculative slideware.
* **Rule:** Every product dossier in `docs/portfolio/` must trace its claims to active database migrations, API contracts, TypeScript definitions, and tested workflows in the product repositories.

---

## 3. The Deliberation & Escalation Ladder

```
[ Inception / Market Need / Feature Idea ]
                    │
                    ▼
[ 13 HQ Specialist Personas (/hq Working Group) ]
  • Explores pedagogical, technical, and commercial feasibility
  • Produces Technical RFC or Business Strategy Proposal
                    │
                    ▼
[ Formal Council Deliberation Chamber ]
  • The 6-Seat Governing Council audits Architecture, Security, ROI & GTM
  • 6/6 Unanimous Approval Required for Ratification
                    │
                    ▼
[ Ratified Decision: docs/council/COUNCIL-YYYY-XXX.md ]
                    │
                    ▼
[ Implementation & Production Gating (100% Surface Pass) ]
```
