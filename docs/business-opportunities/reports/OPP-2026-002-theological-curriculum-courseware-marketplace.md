# BOP-2026-002: Theological Curriculum & Courseware Marketplace

**Status:** GREENLIT (Incubating in Roadmap)  
**Date Submitted:** 2026-10-16  
**Submitting Agent:** 🎓 The Academic & Formation Dean & 🧭 The Product Strategist  
**Target Market Domain:** Digital Content, Ministry Publishing & Discipleship  
**Impacted Suite Pillars:** `ChurchCore-LMS` (`COUNCIL-2026-039: Paid Courses and Course Storefront`) + `FaithFullScholars`  
**Council Priority Score (RICE):** **78.2 / 100**  

---

## 1. Executive Summary & Opportunity Hook
Churches and Bible institutes spend millions annually purchasing Sunday school curriculum, discipleship study guides, and leadership training videos from Christian publishers (Crossway, Baker Academic, IVP, Lifeway). Most of this content is delivered via static PDFs or clunky physical DVD/binder kits.

By utilizing `ChurchCore-LMS`'s native **Paid Courses and Course Storefront (`COUNCIL-2026-039`)**, ChurchCore creates the **"Audible / App Store of Christian Formation"**: an integrated marketplace where publishers and theological scholars sell interactive, block-based courses directly into local church LMS classrooms, with ChurchCore capturing a **15%–25% platform revenue share**.

---

## 2. Market Problem & Unmet Demand
* **Publishers Are Trapped in Static Media:** Christian publishing houses are desperate to transition from declining physical book sales to interactive digital course subscriptions, but building their own proprietary LMS platforms costs millions and fails.
* **Churches Lack High-Quality Content:** Pastors want to train small group leaders and elders, but do not have time to write 12-week theological syllabi from scratch.
* **The Solution:** A pastor browsing the ChurchCore-LMS course builder clicks `Add Course from Marketplace` $\to$ selects *"Introduction to Christian Ethics" by Dr. Justo González* $\to$ instantly installs the complete 10-week module (videos, quizzes, discussion boards) into their local church LMS.

---

## 3. ChurchCore Architectural Leverage (Existing Codebase Assets)
* **Tables Leveraged:** `courses`, `block_types`, `bank_questions`, `rubrics`, `content_pages` (in LMS) and ratified Council decisions `COUNCIL-2026-039` (Paid Courses) and `COUNCIL-2026-043` (Starter Content Library).
* **Engineering Delta:** **Minimal to Moderate.** The course import and store infrastructure is already established in the LMS migrations.

---

## 4. Monetization Mechanics & Financial Model
* **Platform Take-Rate:** 20% on all course purchases and digital licensing fees.
* **Pricing Examples:**
  - Church-wide License (Small Group Video Study): $99 – $199 per study. (ChurchCore earns $20–$40).
  - Academic Bible Institute Course Package: $450 per semester course. (ChurchCore earns $90).
* **Financial Projection (Year 3):**
  - 1,500 churches purchasing an average of 4 paid course packages per year ($600 annual spend):
    $$1,500 \times \$600 \times 20\% = \mathbf{\$180,000\text{ Pure Profit Take-Rate ARR}}$$
  - Scalable to millions as major academic publishers distribute through the network.

---

## 5. RICE Opportunity Scoring Rubric

$$\text{RICE Score} = \frac{\text{Reach (7)} \times \text{Impact (8)} \times \text{Confidence (8)}}{\text{Effort (3.5)}} = \mathbf{78.2}$$

---

## 6. Council Deliberation & Executive Verdict
* **Chief Product Officer:** *APPROVE. Elevates ChurchCore from a software utility into an indispensable content destination.*
* **Verdict:** **GREENLIT FOR PHASE 2.** Initiate publisher conversations with AETH González Center and academic presses.
