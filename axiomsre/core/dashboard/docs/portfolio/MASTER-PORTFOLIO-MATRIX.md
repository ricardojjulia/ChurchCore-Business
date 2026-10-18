# ChurchCore Master Portfolio Architecture & Market Matrix

**Executive Overview:** The ChurchCore ecosystem spans 6 specialized, enterprise-grade software products engineered on a shared Next.js + TypeScript + Supabase RLS architectural foundation. Across the suite, there are **517 relational database tables**, **423 Next.js application routes**, and **433 SQL migrations**.

---

## 1. Cross-Product Portfolio Overview

| # | Product Name | Domain Category | Tech Version | DB Tables | App Routes | Standalone Price Anchor | Primary Buyer / ICP |
|:---:|---|---|:---:|:---:|:---:|---|---|
| **01** | [ChurchCore](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/01-churchcore-chms.md) | ChMS, Worship, Child Check-in & Finance | `v3.5.0` | 133 | 121 | $49 – $749/mo + 1% Giving | Senior Pastor, Executive Pastor |
| **02** | [ChurchCore-LMS](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/02-churchcore-lms.md) | Ministry LMS, Discipleship & Credentialing | `v0.36.1` | 72 | 85 | $79 – $999/mo | Discipleship Pastor, Bible Institute Dean |
| **03** | [ChurchCore-Academy](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/03-churchcore-academy.md) | K-12 & Higher-Ed SIS & School Operations | `v0.10.0` | 152 | 105 | $2,400 – $25,000/yr | Head of School, Academy Principal |
| **04** | [ChurchCoreCare](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/04-churchcore-care.md) | Pastoral & Clinical Counseling EHR | `v7.1.0` | 84 | N/A (API) | $59 – $399/mo | Clinical Director, Care Pastor |
| **05** | [ChurchCore-Orthos](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/05-churchcore-orthos.md) | Governance, Safeguarding & Health Audit | `v0.18.0` | 28 | 30 | $1,200 – $50,000/yr | Elder Board, Denominational Bishop |
| **06** | [FaithFullScholars](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/06-faithfull-scholars.md) | Theological Higher Ed & Faculty Search | `v0.1.0` | 48 | 53 | $2,500 – $15,000/yr | Seminary President, Academic Dean |
| **Σ** | **Total Ecosystem** | **Complete Faith-Based Software Mesh** | — | **517** | **423** | **High-LTV Enterprise Bundle** | **The Global Christian Enterprise** |

---

## 2. The Universal Life-Journey Ecosystem Topology

```
                  ┌──────────────────────────────────────────────┐
                  │          FAITHFULLSCHOLARS                   │
                  │   (Theological Academies, Seminaries & Ph.D.)│
                  └──────────────────────┬───────────────────────┘
                                         │ Faculty & Scholars
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │          CHURCHCORE-ACADEMY                  │
                  │   (K-12 Christian Schools & Bible Colleges)  │
                  └──────────────┬───────────────────────────────┘
                                 │ Students, Families & Grades
                                 ▼
┌─────────────────────────┐  Unified  ┌─────────────────────────┐
│       CHURCHCORE        │◄─────────►│     CHURCHCORE-LMS      │
│  (ChMS, Members, Giving,│  Identity │ (Discipleship, Training,│
│   Worship & Check-in)   │ (CC-ID)   │  Certifications & PWA)  │
└────────────┬────────────┘           └─────────────────────────┘
             │                                     ▲
             │ Confidential                        │ Governance &
             │ Pastoral Referral                   │ Policy Auditing
             ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│     CHURCHCORECARE      │           │    CHURCHCORE-ORTHOS    │
│  (Pastoral & Clinical   │           │ (Governance, Safeguards,│
│   Counseling EHR)       │           │  Risk & Board Compliance│
└─────────────────────────┘           └─────────────────────────┘
```

---

## 3. Unified Identity & Security Wall Matrix

| Product | Shared Data with Suite | STRICT Cryptographic Isolation Wall |
|---|---|---|
| **ChurchCore (ChMS)** | Member Profiles, Households, Giving Ledgers | General member notes NEVER leak to Counseling or SIS. |
| **ChurchCore-LMS** | Course enrollments, volunteer certificates | Private quiz answers and reflection journals isolated. |
| **ChurchCore-Academy** | Parent demographics, emergency contacts | FERPA-protected transcripts, disciplinary logs strictly isolated. |
| **ChurchCoreCare** | None (Encrypted one-way referral acknowledgement only) | **ZERO-LEAK:** HIPAA/clergy-penitent therapy notes 100% segregated. |
| **ChurchCore-Orthos** | Audit indicators, aggregate headcount, background checks | Anonymized governance scores; no raw PII exposed to reviewers. |
| **FaithFullScholars** | Scholar research dossiers, public certifications | Confidential search committee interview notes strictly isolated. |

---

## 4. Strategic Packaging & Commercial Avenues

### Tier A: The Local Church Operating Bundle ("ChurchCore Complete")
* **Products:** ChurchCore (ChMS) + ChurchCore-LMS (Volunteer & Discipleship) + Orthos (Basic Safeguarding).
* **Target:** Independent, Baptist, Non-denominational, Pentecostal, and Presbyterian churches (100–2,000 members).
* **Pricing:** $199–$499/mo + 0.85% giving processing take-rate.
* **Value Moat:** Kills 4 separate SaaS bills (Planning Center + Teachable + Subsplash + Protect My Ministry).

### Tier B: The Christian Academy & Day-School Bundle ("Education Cloud")
* **Products:** ChurchCore-Academy (SIS) + ChurchCore-LMS (Digital Courseware) + Orthos (Facility & Child Safeguarding).
* **Target:** K-12 Christian academies, classical Christian schools, church day-schools.
* **Pricing:** $4,500 – $15,000 / year.
* **Value Moat:** Replaces FACTS / RenWeb and Blackbaud with modern, intuitive, mobile-first software.

### Tier C: The Clinical & Pastoral Wellness Suite
* **Products:** ChurchCoreCare + FaithCounseling-meet.
* **Target:** Christian counseling centers, church pastoral care departments, Christian mental health networks.
* **Pricing:** $59/mo per practitioner.
* **Value Moat:** Replaces SimplePractice while honoring Christian biblical and pastoral counseling models.

### Tier D: The Enterprise Denomination & Diocese Agreement ("Sovereign Church Cloud")
* **Products:** Entire Suite (All 6 Products) deployed across 50–500 parishes/churches in a diocese or presbytery.
* **Target:** Dioceses, regional presbyteries, Assemblies of God districts, Baptist state conventions.
* **Pricing:** $50,000 – $250,000 / year annual contract + collective digital giving rev-share.
* **Value Moat:** Unified governance, instant compliance auditing, and unprecedented cost savings across the network.
