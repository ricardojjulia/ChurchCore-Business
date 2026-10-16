# Individual Product Competitive Analysis: ChurchCore-Orthos (Governance & Safeguards)

**Target Software Pillar:** `ChurchCore-Orthos v0.18.0` (28 Tables, 30 Routes, Gemini AI Integration)  
**Domain Category:** Institutional Governance, Multi-Program Health Auditing, Child Safeguarding, Risk Compliance  
**Status:** ACTIVE ANALYSIS  
**Last Updated:** 2026-10-16  

---

## 1. Competitive Overview

Church safeguarding and governance is currently dominated by:
1. **Background Check Vendors:** Protect My Ministry (Ministry Brands) and Checkr — simple transactional background screeners with no institutional health oversight.
2. **Child Safety Training Firms:** MinistrySafe and Praesidium — provide excellent video training modules, but zero integration into Sunday morning check-in kiosks or elder board governance.
3. **Corporate Board Portals:** Diligent, BoardEffect — expensive corporate board portals ($8k–$20k/yr) lacking faith-based bylaws, church assemblies, or safeguarding tracking.

---

## 2. Product-by-Product Evaluation Matrix

| Capability Feature | ChurchCore-Orthos | Protect My Ministry | MinistrySafe | Diligent / BoardEffect |
|---|:---:|:---:|:---:|:---:|
| **Real-Time Kiosk Safeguarding Seal** | **YES (Syncs with ChMS Check-in)**| NO (Background check only) | NO (Training only) | NO |
| **AI Institutional Health Evaluation** | **YES (Google Gemini AI `@google/genai`)**| NO | NO | Basic Corporate AI |
| **Elder Assembly & Church Motions** | **YES (`assembly_motions`, votes)**| NO | NO | Board voting only |
| **Annual Financial Budget Controls** | **YES (`annual_budgets`, audits)** | NO | NO | Financial reports |
| **Denominational Risk Dashboard** | **YES (Multi-Parish View)** | Basic billing portal | Basic org dashboard | Enterprise Portal |
| **Annual Pricing** | **$1,200 – $10,000 / year** | Per-check transactional | $250–$1,500/yr (Training) | $12,000–$25,000 / yr |

---

## 3. Detailed Competitor Teardowns

### Competitor 1: MinistrySafe & Protect My Ministry
* **Market Position:** Leading child safety consultancies and background screening providers.
* **Key Weaknesses:**
  - They operate in a silo: Once a volunteer takes a background check, the result sits in a PDF. If the volunteer's check expires, Sunday morning check-in volunteers have no automated way of knowing whether that worker should be barred from the nursery.
* **ChurchCore-Orthos Advantage:** **Automated Invariant Enforcement.** If a volunteer's background check lapses in Orthos, ChurchCore instantly revokes their Sunday check-in room assignment and alerts the director.

### Competitor 2: Manual Denominational Audits
* **The Reality:** Dioceses and presbyteries rely on annual self-reporting questionnaires that local pastors fill out on paper. Over 60% are filled out inaccurately or ignored entirely.
* **ChurchCore-Orthos Advantage:** Ingests live operational telemetry directly from the church's ChMS and financial ledger, producing automated institutional risk scoring with zero paperwork.
