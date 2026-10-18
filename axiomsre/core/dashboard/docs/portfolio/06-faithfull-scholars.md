# Product Dossier 06: FaithFullScholars (Theological Higher Ed & Academic Network)

**Repository:** `https://github.com/ricardojjulia/FaithFullScholars`  
**Local Codebase:** `/Users/rjulia/FaithFullScholars`  
**Live Production URL:** `https://www.faithgrid.io`  
**Production / Preview:** In Active Staging / Pilot Readiness  
**Version:** `0.1.0`  
**Primary Domain Category:** Academic Network, Faculty Recruitment, Confessional Fit Vetting & Scholarly Publishing  
**Development State:** Functional Modern Web Architecture (29 SQL Migrations, 53 Next.js App Routes, 48 Database Tables)  
**Last Audited:** 2026-10-16  

---

## 1. Executive Summary & Value Proposition
FaithFullScholars is a dedicated academic network and faculty recruitment platform engineered for biblical, theological, and faith-based higher education (seminaries, Christian universities, Bible colleges, and academic societies).

Hiring theological faculty and finding peer-reviewed confessional scholarship is currently broken: institutions rely on generic job boards (HigherEdJobs, LinkedIn) where 90% of applicants lack confessional alignment, while theological scholars struggle to find institutions matching their doctrinal convictions.

FaithFullScholars solves this by providing:
- **Confessional Fit & Doctrinal Compatibility Matrix:** Deep-dive doctrinal alignment questionnaires matching scholars with institutional confessional standards (e.g., Westminster Confession, Nicene Creed, Baptist Faith & Message, Lausanne Covenant).
- **Scholar Dossiers & Research Profiles:** Academic CVs, dissertation topics, research disciplines, conference presentations, and peer endorsements.
- **Institutional Faculty Postings & Pipeline:** Seminary job openings, applicant review pipelines, conference interview scheduling, and committee evaluation notes.
- **Academic Consortiums & Accreditation Support:** Multi-institution consortium resource sharing and accreditation dossier packages.

---

## 2. Technical Stack & Architectural Anatomy
- **Frontend Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons.
- **Database & Security:** Supabase PostgreSQL with 29 migrations, protected trust columns (`20261005090000_protect_trust_columns.sql`), and strict Row-Level Security.
- **Conference & Interview Management:** Dedicated conference interview event scheduling and notes infrastructure.

---

## 3. Core Database Entities (48 Tables Identified)
Key domain clusters:
1. **Scholars & Profiles:** `scholar_profiles`, `scholar_endorsements`, `availability_profiles`, `scholar_revision_lifecycle`.
2. **Confessional Standards & Fit:** `confessional_standards`, `confessional_alignments`, `course_disciplines`.
3. **Institutional Postings & Applicants:** `institution_postings`, `posting_applicants`, `contract_milestones`.
4. **Conferences & Interviews:** `conferences`, `conference_appearances`, `conference_interview_requests`, `conference_interview_notes`.
5. **Consortiums & Accreditation:** `consortiums`, `consortium_members`, `accreditation_dossiers`.

---

## 4. Standalone Commercial Viability
- **Target Buyer:** Seminary Presidents, Academic Provosts, Search Committee Chairs, Theological Society Directors (ETS, SBL).
- **Monetization Model:** Institutional Annual Subscription + Premium Placement Fees:
  - *Individual Scholars:* Free Profile + Basic Job Search ($0) / Premium Portfolio ($99/year).
  - *Institutional Search Membership (Small Seminary):* $2,500 / year (includes 3 job postings & candidate search).
  - *Large University / Seminary Tier:* $7,500 / year (unlimited postings, conference interview suite, confessional screening engine).
  - *Conference / Society Sponsorships:* $5,000–$15,000 per annual conference (e.g., Evangelical Theological Society annual meeting).

---

## 5. Ecosystem Synergies with ChurchCore Suite
- **With ChurchCore-Academy & LMS:** Seminaries and universities on FaithFullScholars recruit faculty who author courses for ChurchCore-LMS and teach within ChurchCore-Academy.
- **With ChurchCore (ChMS):** Pastors seeking ordained staff or pastoral residents can tap into the vetted scholar and seminary graduate pipeline.

---

## 6. Council Assessment & Strategic Recommendations
- **Strengths:** High prestige and institutional credibility; unlocks access to the top theological decision-makers across major denominations and universities.
- **Growth Vectors:** Partner with major evangelical and theological associations (ETS, ATS, ABHE) to become the official academic career network for theological education.
