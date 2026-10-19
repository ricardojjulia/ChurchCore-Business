# High Sovereign Grand Council of ChurchCore
## Executive Deliberation Journal & Determination: DELIB-GRAND-HIGH-COUNCIL-20261019-PLAN-UPGRADE

**Deliberation Reference:** `DELIB-GRAND-HIGH-COUNCIL-20261019-PLAN-UPGRADE`  
**Ratification Date:** 2026-10-19 20:30:00 UTC  
**Council Reference:** `COUNCIL-2026-009`  
**Governing Council:** High Sovereign Grand Council of ChurchCore (Grand High Council)  
**Target Surface:** Sovereign Control Plane Plans & Roadmap Engine (`/dashboard`)  
**Quorum Status:** 7/7 Active Quorum (All Seats Present)  
**Executive Sponsor:** Office of the Chief Architect & High Sovereign Council  

---

### 1. Deliberation Subject / Operator Inquiry
> **Operator Assessment:** "I think plan functionality is lacking, have the council review it, and better it."
>
> **Inquiry Scope:** Comprehensive review of the Implementation Plans & Directionality board across the Sovereign Control Plane. Identify functional deficiencies, architectural friction points, and ratify a hardened, interactive plan steering engine that bridges central governance with local edge execution.

---

### 2. Council Finding & Gap Analysis

Following an exhaustive audit of `dashboard/app.js`, `docs/control-plane/product-plans.json`, and the `#tab-plans` interface, the Grand Council identifies five critical deficiencies:

1. **Passive Read-Only Exhibition:**
   The existing board displays static JSON columns (`Done`, `In Progress`, `Planned`) with zero state mutability. An operator cannot progress an initiative from backlog to in-flight or mark milestones shipped.
2. **Severed Deliberation Feedback Loop:**
   There is no mechanism to subject an in-flight or planned feature to formal Council scrutiny before code is written, risking violations of Section III (Zero Cross-Application Data Propagation).
3. **Absence of Operator Ingestion:**
   No capability exists on the UI to register new emergent roadmap initiatives without manually altering raw JSON schemas.
4. **Missing Directionality & Milestone Velocity Metrics:**
   While items denote `EDGE_REPO` vs `CONTROL_PLANE`, operators lack filtering controls (All, Edge, Hub) and have no real-time calculation of milestone completion percentages (`% Shipped`).
5. **No Direct Edge Dispatch Protocol:**
   Plan items do not produce executable Antigravity CLI (`agy`) engineering prompts to immediately dispatch feature development to the appropriate sibling repository.

---

### 3. Executive Determination & Ratified Directive (COUNCIL-2026-009)

**Status:** **UNANIMOUS RATIFICATION (APPROVAL & IMMEDIATE IMPLEMENTATION)**

The Grand Council hereby ratifies **Directive COUNCIL-2026-009: Sovereign Implementation Plan Lifecycle & Interactive Council Gating Engine**, mandating the immediate implementation of the following capabilities:

#### Mandate 1: Tri-State Interactive Lifecycle Engine
Every plan card must feature fluid, bidirectional state controls:
- Move from **Planned Backlog** ➔ **In Progress**
- Move from **In Progress** ➔ **Shipped & Done**
- Reopen from **Shipped & Done** ➔ **In Progress / Backlog**
State transitions must persist in browser storage (`churchcore_plans_state_v1`) to provide seamless, live steering.

#### Mandate 2: Direct Council Chamber Submission (`⚖️ Deliberate in Council`)
Every plan card must feature a one-click Council Chamber trigger. Clicking this opens the High Sovereign Council Deliberation Chamber pre-populated with:
- Product suite and repository path
- Plan initiative title and technical scope
- Mandatory Section III Data Sovereignty and Sunday SLA compliance checks
- Automated OpenRouter dual-contending Gemini adjudication

#### Mandate 3: Milestone Velocity Meter & Directionality Filtering
The Plans header must feature:
- A live **Milestone Velocity Meter** displaying `% Shipped`, active sprint count, and backlog count.
- Filter chips: `All Items`, `🔵 Edge-Originated (Local Features)`, and `🟡 Hub-Dispatched (Central Governance)`.
- Real-time instant search across all plan initiatives.

#### Mandate 4: Operator Initiative Registration (`+ Add Plan Initiative`)
An intuitive modal allowing the operator to declare new roadmap items for any of the 6 product suites, choosing milestone, directionality, and initial status.

#### Mandate 5: One-Click AgY Edge Dispatch (`🚀 Copy AgY Dispatch`)
A dedicated copy button that generates the exact CLI prompt to command Antigravity into the respective sibling repository:
```bash
cd "/Users/rjulia/<ProductRepo>" && agy -p "Implement Plan Initiative: <Title>. Scope: <Details>."
```

---

### 4. Implementation Certification

The Grand Council authorizes the immediate deployment of these capabilities into `dashboard/index.html`, `dashboard/app.js`, and `dashboard/styles.css`, with full mirror synchronization to `axiomsre/core/dashboard/`.

*Certified by the High Sovereign Grand Council of ChurchCore.*
