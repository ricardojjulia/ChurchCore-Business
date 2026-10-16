# Product Dossier 02: ChurchCore-LMS (Ministry Learning & Discipleship Engine)

**Repository:** `https://github.com/ricardojjulia/ChurchCore-LMS`  
**Local Codebase:** `/Users/rjulia/ChurchCore-LMS`  
**Production / Preview:** In Production (`https://church-core-lms.vercel.app`)  
**Version:** `0.36.1`  
**Primary Domain Category:** Learning Management System (LMS), Discipleship Tracks, Leadership Development  
**Development State:** Mature Production Architecture (149 SQL Migrations, 85 Next.js App Routes, 72 Database Tables, 46 Ratified Council Decisions)  
**Last Audited:** 2026-10-16  

---

## 1. Executive Summary & Value Proposition
ChurchCore-LMS is a specialized, high-performance learning management system built specifically for churches, ministries, bible institutes, and discipleship networks. Mainstream LMS platforms (Canvas, Moodle, Teachable) are either prohibitively expensive academic behemoths or sterile video-paywall course creators with zero pastoral awareness.

ChurchCore-LMS bridges the gap by delivering:
- **Discipleship & Cohort Tracking:** Cohorts, mentor-student relationships, small group study paths, and spiritual formation milestones.
- **Modern Pedagogical Engine:** Block-based course builder (videos, interactive quizzes, discussion boards, rubrics, question banks).
- **Standards Compliance & Portability:** SCORM and xAPI runtime compliance, allowing external ministry course packages to run natively.
- **Offline & Low-Bandwidth Resilience:** Progressive Web App (PWA) with offline course playback and local sync for global mission fields.
- **Engagement & Credentialing:** XP ledgers, badge auto-triggers, automated PDF certificate generation with public verification tokens.
- **Internal AI Governance Command Center (`/hq`):** Built-in Council deliberation engine and 13 HQ personas governing architectural and pedagogical integrity.

---

## 2. Technical Stack & Architectural Anatomy
- **Frontend Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI primitives.
- **Offline & Mobile Support:** Next PWA (`@ducanh2912/next-pwa`), Service Workers, IndexedDB local caching.
- **Certificates & Media:** React PDF (`@react-pdf/renderer`) for on-the-fly cryptographic certificate generation; hosted video with adaptive streaming.
- **Database & Storage:** Supabase PostgreSQL with 149 migrations and strict Row Level Security.
- **Interoperability:** IMS Global OneRoster v1.2 standard for data exchange with schools and external SIS platforms.

---

## 3. Core Database Entities (72 Tables Identified)
Key domain clusters:
1. **Academic Terms & Courses:** `courses`, `academic_terms`, `modules`, `lessons`, `content_pages`, `block_types`, `block_submissions`.
2. **Assessment & Question Bank:** `bank_questions`, `quizzes`, `quiz_submissions`, `rubrics`, `assignment_submissions`, `gradebook_entries`.
3. **Engagement & Gamification:** `badges`, `user_badges`, `xp_ledger`, `leaderboard_ranks`, `certificates`.
4. **Cohorts & Access Windows:** `cohorts`, `cohort_members`, `access_windows`, `cohort_section_enrollments`.
5. **Governance & Audit (`/hq`):** `hq_decisions`, `hq_tasks`, `hq_risks`, `hq_sessions`, `admin_audit_log`.

---

## 4. Standalone Commercial Viability
- **Target Buyer:** Discipleship Directors, Ministry School Deans, Christian Non-Profit Trainers, Senior Pastors.
- **Pricing Model:** Monthly or Annual Subscription based on Active Monthly Learners:
  - *Small Church / Ministry (<50 learners):* $79/mo.
  - *Mid Church / Leadership Institute (50–300 learners):* $199/mo.
  - *Large Bible Institute / Megachurch (300–1,500 learners):* $449/mo.
  - *Enterprise / Denominational Network (Unlimited):* $999/mo + Custom Onboarding.
- **Paid Course Marketplace:** Platform take-rate (5%–10%) on public or paid course storefront sales (`COUNCIL-2026-039: Paid Courses and Course Storefront`).

---

## 5. Ecosystem Synergies with ChurchCore Suite
- **With ChurchCore (ChMS):** Membership status and volunteer onboarding automatically link into required LMS courses (Child Protection, Deacon Training, Worship Team Standards).
- **With ChurchCore-Academy:** Serves as the interactive digital course player and asynchronous assignment submission engine for academy students and teachers.
- **With FaithFullScholars:** Theological professors on FaithFullScholars can publish verified masterclasses or seminary prep courses directly into the ChurchCore-LMS course catalog.

---

## 6. Council Assessment & Strategic Recommendations
- **Strengths:** 46 ratified Council decision records demonstrate an extraordinarily disciplined engineering pedigree. Offline PWA and OneRoster capabilities make it globally competitive against Canvas LMS.
- **Growth Vectors:** Package ChurchCore-LMS as both a standalone SaaS for independent Bible institutes AND as the native educational engine of the ChurchCore Suite.
