# Product Dossier 05: ChurchCore-Orthos (Governance, Safeguarding & Institutional Auditing)

**Repository:** `https://github.com/ricardojjulia/ChurchCore-Orthos`  
**Local Codebase:** `/Users/rjulia/ChurchCore Orthos`  
**Production / Preview:** In Staging / Active AI Evaluation Harness  
**Version:** `0.18.0`  
**Primary Domain Category:** Institutional Governance, Multi-Program Health Auditing, Child Safeguarding & Risk Compliance  
**Development State:** Advanced AI-Governed Architecture (9 SQL Migrations, 30 Next.js App Routes, 28 Database Tables)  
**Last Audited:** 2026-10-16  

---

## 1. Executive Summary & Value Proposition
ChurchCore-Orthos is an institutional governance, multi-program health auditing, and safeguarding compliance platform designed for church elder boards, denominational overseers, dioceses, and Christian non-profit trustees.

Churches and faith institutions face unprecedented liability, abuse allegations, financial mismanagement, and governance failures. Traditional software offers zero oversight into whether safety policies, background checks, financial bylaws, and child protection protocols are actually followed.

ChurchCore-Orthos solves this with:
- **Safeguarding & Volunteer Credentialing:** Tracks background check expirations, child protection policy acknowledgments, two-adult classroom ratios, and facility incident logs.
- **Ecclesial Governance & Assemblies:** Church business meeting management, elder quorum tracking, assembly motions, voting rolls, and formal presentation records.
- **Financial Compliance & Budget Controls:** Oversight of annual operating budgets, dual-signoff spending thresholds, capital campaign audits, and transaction anomaly checks.
- **AI-Powered Health Evaluation (`/evaluator` & `@google/genai`):** Leverages Gemini AI to ingest operational logs, inspection reports, and committee minutes to score institutional risk and generate executive compliance dossiers.

---

## 2. Technical Stack & Architectural Anatomy
- **Frontend Framework:** Next.js 15+ (App Router), React 19, Tailwind CSS, Lucide icons, Zod validation.
- **AI Evaluation Engine:** Google Gemini SDK (`@google/genai`) for multi-program audit evaluation and automated governance risk scoring.
- **Database Architecture:** Supabase PostgreSQL with core tenancy, RBAC, and dedicated audit dossier tables.
- **Command & Deliberation Console:** Integrated `/hq` console and external reviewer tokens (`external_reviewer_tokens`) for third-party denominational or legal audits.

---

## 3. Core Database Entities (28 Tables Identified)
Key domain clusters:
1. **Core Tenancy & Entities:** `entities`, `alignment_core`, `controls`.
2. **Safeguarding & Facilities:** `classroom_roster_checks`, `facility_inspections`, `credentialing_records`, `safeguarding_incidents`.
3. **Assemblies & Governance:** `church_assemblies`, `assembly_motions`, `assembly_presenters`, `assembly_votes`.
4. **Financial Oversight:** `annual_budgets`, `financial_presentations`, `financial_transactions`.
5. **Audit Dossiers & Evidence:** `audit_dossiers`, `evidence_objects`, `external_reviewer_tokens`, `audit_events`.

---

## 4. Standalone Commercial Viability
- **Target Buyer:** Church Elder Boards, Denominational Bishops / District Superintendents, Church Insurance Carriers, Christian School Boards.
- **Pricing Model:** Annual Institutional Governance License:
  - *Single Church / Parish:* $1,200 / year ($100/mo) — often partially subsidized by church insurance carriers seeking risk reduction.
  - *Mid-Sized Church with School:* $2,400 / year ($200/mo).
  - *Denominational District / Diocese (10–50 churches):* $10,000–$25,000 / year.
  - *National Denomination / Network (100+ churches):* $50,000+ / year with executive oversight dashboard.
- **Insurance Partnership Moat:** Church insurance brokers (e.g., Brotherhood Mutual, Church Mutual, GuideOne) offer premium discounts to ministries utilizing verifiable safeguarding platforms like Orthos.

---

## 5. Ecosystem Synergies with ChurchCore Suite
- **With ChurchCore (ChMS):** Ingests volunteer rosters, background check dates, and financial ledger totals to automatically calculate governance compliance scores.
- **With ChurchCore-Academy:** Audits classroom teacher ratios, facility inspections, and emergency drill compliance.
- **With ChurchCoreCare:** Ensures organizational compliance without accessing protected counseling notes.

---

## 6. Council Assessment & Strategic Recommendations
- **Strengths:** High-margin enterprise appeal; solves an existential risk (insurance, liability, child abuse prevention, financial transparency).
- **Growth Vectors:** Position Orthos as the "Chief Governance & Risk Officer in a Box" for denominational executives and insurance underwriters.
