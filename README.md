# ChurchCore Business & Portfolio Operating System

> **The Sovereign Enterprise Software Ecosystem for the Global Church, Christian Education, and Ministry Operations.**

[![Council Status](https://img.shields.io/badge/Council_Status-RATIFIED-success?style=for-the-badge&logo=shield)](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)
[![Constitution](https://img.shields.io/badge/Constitution-ACTIVE-blue?style=for-the-badge)](file:///Users/rjulia/ChurchCore-Business/docs/constitution/CONSTITUTION.md)
[![Portfolio Tables](https://img.shields.io/badge/Database_Tables-517_Total-informational?style=for-the-badge)](file:///Users/rjulia/ChurchCore-Business/docs/portfolio/MASTER-PORTFOLIO-MATRIX.md)
[![Control Plane](https://img.shields.io/badge/Control_Plane-ACTIVE_DASHBOARD-gold?style=for-the-badge&logo=vercel)](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/ECOSYSTEM-DASHBOARD.md)
[![AgY CLI](https://img.shields.io/badge/AgY_CLI-v1.4.0_READY-blueviolet?style=for-the-badge&logo=google)](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/CONTROL-PLANE-AND-AGY-GUIDE.md)

---

## 🏛️ Executive Summary & Mission Control

**ChurchCore-Business** is the executive command center, strategic brain, and sovereign governance repository for the **ChurchCore Ecosystem**. It coordinates six mature, specialized engineering platforms into an integrated, defensible, high-margin commercial enterprise while strictly enforcing **Constitution Section III: Zero Cross-Application Customer Data Propagation**.

> 📖 **Read the Master Guide:** [CONTROL-PLANE-AND-AGY-GUIDE.md](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/CONTROL-PLANE-AND-AGY-GUIDE.md) — The comprehensive operations manual, strategic vision, live fleet status, and complete tutorial for utilizing the **AgY CLI** for autonomous cross-repo development.

### 🚀 Quick Launch: Executive Web Dashboard
Launch the real-time glassmorphic mission control UI on your machine:
```bash
python3 dashboard/serve.py
# Opens http://localhost:3333 in your browser
```

---

## 📁 Repository Quick Navigation

```
ChurchCore-Business/
├── dashboard/                # Executive Mission Control Web Application
│   ├── index.html            # Single-Page Cockpit Interface
│   ├── styles.css            # Dark-Mode Glassmorphism Design System
│   ├── app.js                # Live Telemetry & AgY Command Dispatcher
│   └── serve.py              # One-Click Local HTTP Server (Port 3333)
├── docs/
│   ├── control-plane/        # Sovereign Control Plane, Fleet Telemetry & Central Directives
│   │   ├── CONTROL-PLANE-AND-AGY-GUIDE.md # Master Operations Manual & AgY CLI Tutorial
│   │   ├── ARCHITECTURE.md   # Control Plane Blueprint & AI Permanent Connection Strategy
│   │   ├── ECOSYSTEM-DASHBOARD.md # Master Fleet Status, Vercel/Supabase Health & AI Logs
│   │   ├── CENTRAL-ROADMAP.md # Central Roadmap & Imposed Development Directives
│   │   ├── TELEMETRY-SPEC.md # Edge Telemetry Reporting Standard & Invariants
│   │   └── telemetry-schema.json # JSON Schema for Edge Node Telemetry
│   ├── council/              # Binding Ratified Council Decisions (COUNCIL-2026-XXX)
│   │   ├── COUNCIL-2026-001.md (Inaugural Ecosystem & Commercial Ratification)
│   │   ├── COUNCIL-2026-002.md (Branding Governance & Sub-Brand Taxonomy Ratification)
│   │   ├── COUNCIL-2026-003.md (Mandatory Cross-Repo Governance Sync Protocol)
│   │   └── COUNCIL-2026-004.md (Sovereign Control Plane & Telemetry Protocol)
│   ├── governance-sync/      # Cross-Repo Directive Dispatch & Compliance Engine
│   │   ├── manifest.json     # Machine-Readable JSON Manifest of Active Directives
│   │   └── COMPLIANCE-MATRIX.md # Ecosystem-Wide Implementation Tracking Board
│   ├── deliberations/        # Chronological Executive Session Journals & Debate Transcripts
│   │   └── SESSION-2026-10-16-FOUNDATIONAL-ARCHITECTURE.md
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
│   ├── business-opportunities/ # Innovation Engine, BOP Reports & Agent Submission Intake
│   │   ├── README.md         # Master Priority Matrix (RICE Scores) & Opportunities Hub
│   │   ├── reports/          # Evaluated Opportunity Proposals (Insurance, AETH, Endowments)
│   │   └── intake/           # Staging Queue for Autonomous Agent Submissions
│   ├── strategy/             # GTM, Defensible Moats, Competitor Battlecards & TAM/SAM/SOM
│   │   ├── 01-competitive-battlecards.md
│   │   ├── 02-architectural-and-business-moats.md
│   │   └── 03-ecclesial-advisory-board-and-council-of-reference.md
│   ├── pitch/                # Pitch Decks, Executive Narratives & Audience Archetypes
│   │   ├── 01-executive-pitch-deck-narrative.md
│   │   ├── 02-executive-memo-and-investor-brief.md
│   │   ├── archetypes/       # Tailored Pitch Blueprints by Audience
│   │   │   ├── 01-single-local-church.md
│   │   │   ├── 02-council-of-churches-and-denominations.md
│   │   │   └── 03-theological-association-aeth.md
│   │   └── templates/
│   ├── competitive-analysis/ # Detailed Competitor Teardowns by Product & Full Platform
│   │   ├── README.md         # Competitive Command Center & Comparison Quick Links
│   │   ├── 00-platform-ecosystem-competitive-landscape.md
│   │   ├── 01-churchcore-chms-competitors.md (PCO, Breeze, Tithe.ly, Realm)
│   │   ├── 02-churchcore-lms-competitors.md (Canvas, Teachable, RightNow Media)
│   │   ├── 03-churchcore-academy-competitors.md (FACTS/RenWeb, Blackbaud K-12)
│   │   ├── 04-churchcore-care-competitors.md (SimplePractice, TherapyNotes)
│   │   ├── 05-churchcore-orthos-competitors.md (Protect My Ministry, MinistrySafe)
│   ├── financial-operations/ # Financial Modeling, COGS, OpEx, Offerings & Scenario Playbooks
│   │   ├── README.md         # Financial Operations Command Center & Quick Links
│   │   ├── 01-cost-structure-and-opex-breakdown.md
│   │   ├── 02-offering-catalog-and-packaging-matrix.md
│   │   ├── 03-scenario-planning-and-sensitivity-models.md
│   │   ├── 04-operational-playbooks-and-scenarios.md
│   │   ├── 05-multi-year-pnl-and-cash-flow-model.md
│   │   └── 06-fintech-underwriting-and-fraud-risk-policy.md
│   ├── marketing/            # Marketing Strategies, Collateral & Focused Documentation
│   │   ├── README.md         # Marketing Command Center & Quick Links
│   │   ├── brand-and-voice/  # Brand Guidelines, Messaging Hierarchy & Tokens
│   │   ├── campaigns/        # PCO Conquest & AETH Hispanic Institutes Campaigns
│   │   ├── collateral/       # 2-Page Executive Product Sheet (PDF/Print)
│   │   └── market-research/  # Buyer Personas & Ideal Customer Profiles (ICPs)
│   ├── operations/           # Sovereign Isolation, UX Shell, Onboarding & Sunday SLA
│   │   ├── README.md         # Operations Command Center & Quick Links
│   │   ├── 01-sovereign-database-isolation-and-security-architecture.md
│   │   ├── 02-unified-ux-shell-and-app-switcher.md
│   │   ├── 03-customer-onboarding-and-migration-playbook.md
│   │   ├── 04-sunday-readiness-disaster-recovery-and-sla.md
│   │   └── 05-cross-repo-governance-sync-and-dispatch-standard.md
│   └── templates/            # Standardized Markdown Templates for Council, Inquiries & Dossiers
└── .agents/rules/            # AI Governance Rules & Persona Charters
    ├── council-charter.md    # The 6-Seat Governing Council & 13 HQ Specialist Personas
    ├── branding-governance.md # AI Copywriting, Nomenclature & WCAG AAA Contrast Rules
    └── opportunity-submission-protocol.md # Autonomous Agent BOP Submission Protocol
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
