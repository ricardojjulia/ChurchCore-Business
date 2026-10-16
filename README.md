# ChurchCore Business & Portfolio Operating System

> **The Sovereign Enterprise Software Ecosystem for the Global Church, Christian Education, and Ministry Operations.**

[![Council Status](https://img.shields.io/badge/Council_Status-RATIFIED-success?style=for-the-badge&logo=shield)](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)
[![Constitution](https://img.shields.io/badge/Constitution-ACTIVE-blue?style=for-the-badge)](file:///Users/rjulia/ChurchCore-Business/docs/constitution/CONSTITUTION.md)
[![Portfolio Tables](https://img.shields.io/badge/Database_Tables-517_Total-informational?style=for-the-badge)](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/MASTER-PORTFOLIO-MATRIX.md)
[![App Routes](https://img.shields.io/badge/App_Routes-423_Total-orange?style=for-the-badge)](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/MASTER-PORTFOLIO-MATRIX.md)

---

## 🏛️ Executive Summary

**ChurchCore-Business** is the executive command center, strategic brain, and governance repository for the **ChurchCore Ecosystem**. It synthesizes six mature, specialized engineering platforms into an integrated, defensible, high-margin commercial enterprise.

Across the ecosystem, ChurchCore replaces fragmented, obsolete legacy software (Planning Center, Pushpay, Subsplash, FACTS, Canvas LMS, SimplePractice) with a modern, secure, beautifully unified software mesh engineered on **Next.js 15/16**, **TypeScript**, and **Supabase PostgreSQL Row-Level Security (RLS)**.

---

## 📁 Repository Quick Navigation

```
ChurchCore-Business/
├── docs/
│   ├── constitution/         # The 7 Constitutional Invariants & Non-Negotiables
│   │   └── CONSTITUTION.md
│   ├── council/              # Binding Ratified Council Decisions (COUNCIL-2026-XXX)
│   │   └── COUNCIL-2026-001.md (Inaugural Ecosystem & Commercial Ratification)
│   ├── inquiries/            # Strategic Questions, Debates & Resolved Dilemmas
│   │   └── INQ-2026-001-unified-identity-strategy.md
│   ├── portfolio/            # Deep-Dive Product Dossiers (Live Capabilities & Code Audits)
│   │   ├── MASTER-PORTFOLIO-MATRIX.md (Cross-Suite Architectural & Financial Matrix)
│   │   ├── 01-churchcore-chms.md (Core ChMS, Worship, Child Safety & Financials)
│   │   ├── 02-churchcore-lms.md (Ministry LMS, Discipleship & Credentialing)
│   │   ├── 03-churchcore-academy.md (K-12 & Higher-Ed SIS & School Operations)
│   │   ├── 04-churchcore-care.md (Pastoral & Clinical Counseling EHR)
│   │   ├── 05-churchcore-orthos.md (Governance, Safeguarding & Health Audit)
│   │   └── 06-faithfull-scholars.md (Theological Higher Ed & Academic Network)
│   ├── business-models/      # Monetization, Packaging Tiers & Unit Economics
│   │   ├── 01-pricing-and-packaging-architecture.md
│   │   └── 02-unit-economics-and-fintech-monetization.md
│   ├── strategy/             # GTM, Defensible Moats, Competitor Battlecards & TAM/SAM/SOM
│   │   ├── 01-competitive-battlecards.md
│   │   └── 02-architectural-and-business-moats.md
│   ├── pitch/                # Pitch Decks, Executive Narratives & Audience Archetypes
│   │   ├── 01-executive-pitch-deck-narrative.md
│   │   ├── 02-executive-memo-and-investor-brief.md
│   │   ├── archetypes/       # Tailored Pitch Blueprints by Audience
│   │   │   ├── 01-single-local-church.md
│   │   │   ├── 02-council-of-churches-and-denominations.md
│   │   │   └── 03-theological-association-aeth.md
│   │   └── templates/
│   │       └── PITCH-DECK-TEMPLATE.md
│   ├── marketing/            # Marketing Strategies, Collateral & Focused Documentation
│   │   ├── README.md         # Marketing Command Center & Quick Links
│   │   ├── brand-and-voice/  # Brand Guidelines, Messaging Hierarchy & Tokens
│   │   ├── campaigns/        # PCO Conquest & AETH Hispanic Institutes Campaigns
│   │   ├── collateral/       # 2-Page Executive Product Sheet (PDF/Print)
│   │   └── market-research/  # Buyer Personas & Ideal Customer Profiles (ICPs)
│   ├── operations/           # ChurchCore ID, OneRoster Interoperability & Migration Playbooks
│   └── templates/            # Standardized Markdown Templates for Council, Inquiries & Dossiers
└── .agents/rules/            # AI Governance Rules & Persona Charters
    └── council-charter.md    # The 6-Seat Governing Council & 13 HQ Specialist Personas
```

---

## 💎 The 6 Pillars of the ChurchCore Suite

| Product | Domain Category | Tech Version | Scale & Maturity | Primary Buyer | Standalone Anchor |
|---|---|:---:|:---:|---|---|
| **[01. ChurchCore](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/01-churchcore-chms.md)** | ChMS, Worship, Child Check-in & Double-Entry Finance | `v3.5.0` | 133 Tables, 121 Routes | Senior Pastor, Executive Pastor | $49–$749/mo + 1% Giving |
| **[02. ChurchCore-LMS](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/02-churchcore-lms.md)** | Ministry LMS, Discipleship Tracks & PWA | `v0.36.1` | 72 Tables, 85 Routes, 46 Council Records | Discipleship Pastor, Bible Institute Dean | $79–$999/mo |
| **[03. ChurchCore-Academy](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/03-churchcore-academy.md)** | K-12 & Higher-Ed SIS & School Operations | `v0.10.0` | 152 Tables, 105 Routes | Head of School, Academy Principal | $2,400–$25,000/yr |
| **[04. ChurchCoreCare](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/04-churchcore-care.md)** | Pastoral & Clinical Counseling EHR + Telehealth | `v7.1.0` | 84 Tables, Deny-All RLS | Clinical Director, Care Pastor | $59–$399/mo |
| **[05. ChurchCore-Orthos](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/05-churchcore-orthos.md)** | Institutional Governance & AI Health Audit | `v0.18.0` | 28 Tables, 30 Routes, Gemini AI | Elder Board, Denominational Bishop | $1,200–$50,000/yr |
| **[06. FaithFullScholars](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/06-faithfull-scholars.md)** | Theological Higher Ed & Confessional Search | `v0.1.0` | 48 Tables, 53 Routes | Seminary President, Academic Dean | $2,500–$15,000/yr |

*Total Aggregate Codebase Footprint: **517 Relational Database Tables** and **423 Next.js Application Routes**.*

---

## ⚖️ The Dual-Tier AI Governance Operating System

All strategic pivots, architectural invariants, and pricing schedules are governed under our **Dual-Tier Council Architecture**:

1. **The 13 HQ Specialist Working Group Personas:** Active ideation workbench covering System Design, Commercial Modeling, Adversarial Critique, Security, Pedagogy, Clinical Ethics, and Capital Strategy.
2. **The 6-Seat Binding Governing Council:** Formal tribunal requiring **6/6 Unanimous Approval** to ratify major decisions:
   - 👑 **Chief Executive / Visionary**
   - 🧭 **Chief Product & Portfolio Officer**
   - 💰 **Chief Financial & Revenue Officer**
   - 🏛️ **Chief Technology Officer / Lead Architect**
   - 🛡️ **Chief Information Security Officer**
   - 🚀 **GTM & Ministry Operations Lead**

All council deliberations produce permanent records in [`docs/council/`](file:///Users/rjulia/ChurchCore-Business/docs/council/).

---

## 🚀 Commercial Bundles & Revenue Model

1. **Local Church Complete ($199–$499/mo + 0.85% Giving):** Replaces Planning Center + Subsplash + Teachable.
2. **Christian Academy & Day-School Cloud ($4,500–$15,000/yr):** Replaces FACTS / RenWeb & Blackbaud.
3. **Pastoral & Clinical Wellness ($59/mo per practitioner):** Replaces SimplePractice with Christian soul-care compliance.
4. **Denominational & Diocese Sovereign Cloud ($50,000–$250,000/yr):** Enterprise multi-tenant deployment for regional associations, dioceses, and church planting networks.

---

## 🛡️ The 7 Constitutional Invariants

1. **Ministry Data Sovereignty:** Member data and financial records are never sold, mined, or used for unconfessional ad tracking.
2. **Pastoral / Clinical Separation:** Absolute cryptographic isolation between church membership notes and confidential counseling records.
3. **Unified Identity, Isolated Data:** Seamless single sign-on (ChurchCore ID) with zero cross-tenant database leakage.
4. **Dual-Tier Council Ratification:** No unratified strategic pivots or breaking architectural changes.
5. **Living Documentation & Memory:** Every question, debate, and divergent idea preserved in [`docs/inquiries/`](file:///Users/rjulia/ChurchCore-Business/docs/inquiries/).
6. **Kingdom Stewardship & Margin Discipline:** Profitable, sustainable SaaS and fintech unit economics.
7. **Evidence-Based Portfolio:** Every business thesis is anchored in active code, verified migrations, and audited schemas.

---
*Governed and maintained by the ChurchCore Executive Council.*
