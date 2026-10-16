# Product Dossier 03: ChurchCore-Academy (Faith-Based SIS & School Operations)

**Repository:** `https://github.com/ricardojjulia/ChurchCore-Academy`  
**Local Codebase:** `/Users/rjulia/ChurchCore Academy`  
**Production / Preview:** Active Staging / Pilot Readiness  
**Version:** `0.10.0`  
**Primary Domain Category:** Student Information System (SIS), Academic Administration, K-12 Christian Schools & Bible Colleges  
**Development State:** Advanced Enterprise Architecture (126 SQL Migrations, 105 Next.js App Routes, 152 Database Tables)  
**Last Audited:** 2026-10-16  

---

## 1. Executive Summary & Value Proposition
ChurchCore-Academy is a comprehensive Student Information System (SIS) engineered specifically for faith-based K-12 Christian academies, classical Christian schools, church day-schools, and Bible colleges.

While secular SIS products (PowerSchool, Infinite Campus) are clunky, rigid, and lack spiritual formation tracking, ChurchCore-Academy unifies:
- **Academic Lifecycle & Registrars:** Academic years, semesters, trimesters, course catalogs, section capacity, period sequencing, and automated prerequisites.
- **Admissions & Enrollment Pipelines:** Public applications, document collection, family interviews, admissions scoring, enrollment conversion workflows.
- **Faculty & Classroom Command:** Real-time attendance, period-by-period roll call, section gradebooks, assignment rubrics, and the "Faculty Shepherd" pastoral monitoring view.
- **Parent & Student Portals:** Secure transcript requests, report card generation, disciplinary and spiritual formation notes, and academic standing rules (Probation, Dean's List, Honors).
- **Accreditation Readiness:** Accreditation document packages, graduation compliance audits, and FERPA-compliant privacy barriers.

---

## 2. Technical Stack & Architectural Anatomy
- **Frontend Framework:** Next.js 15+ (App Router), React 19, TypeScript, Radix UI Primitives, Tailwind CSS.
- **Form & Document Processing:** React Hook Form (`@hookform/resolvers`), React PDF (`@react-pdf/renderer`) for official transcripts, report cards, and diplomas.
- **Database Architecture:** Supabase PostgreSQL with 126 migrations and 152 relational tables with institutional multi-tenancy.
- **AI Gateway & Evaluation Engine:** Internal AI model selection and evaluation run tracker (`academy_ai_model_evaluations`, `academy_ai_gateway_usage`) for automated grading assistance and student retention risk analysis.

---

## 3. Core Database Entities (152 Tables Identified)
Key domain clusters:
1. **Institutions & Academic Terms:** `academy_institutions`, `academy_academic_years`, `academy_academic_periods`, `academy_academic_programs`, `academy_academic_standing_rules`.
2. **Admissions & Applications:** `academy_admission_applications`, `academy_admission_application_events`, `academy_enrollment_records`.
3. **Sections, Rosters & Attendance:** `academy_course_sections`, `academy_section_rosters`, `academy_attendance_records`, `academy_period_sequence`.
4. **Faculty & Shepherd Tools:** `academy_faculty_profiles`, `academy_advisor_notes`, `academy_gradebooks`, `academy_gradebook_entries`.
5. **Accreditation & Compliance:** `academy_accreditation_packages`, `academy_graduation_audits`, `academy_account_links`.

---

## 4. Standalone Commercial Viability
- **Target Buyer:** Head of School, Christian School Principals, Academic Deans, Registrars.
- **Pricing Model:** Annual Institutional Contract based on Enrolled Student Headcount:
  - *Small Day School (<150 students):* $2,400 / year ($200/mo).
  - *Mid-Sized Academy (150–500 students):* $5,000 / year ($416/mo).
  - *Large K-12 Christian Institution (500–1,500 students):* $12,000 / year ($1,000/mo).
  - *Higher-Ed College / Seminary (1,500+ students):* $25,000+ / year + Custom Data Migration.
- **Competitive Substitutes:** PowerSchool, FACTS (RenWeb), Blackbaud K-12. FACTS and Blackbaud charge steep annual license fees ($10k–$40k) and are notoriously outdated and disliked by teachers. ChurchCore-Academy offers modern UX, lower pricing, and native faith formation tracking.

---

## 5. Ecosystem Synergies with ChurchCore Suite
- **With ChurchCore (ChMS):** Churches operating a weekday Christian school or preschool can share parent accounts, sibling relationships, and emergency contacts seamlessly.
- **With ChurchCore-LMS:** Serves as the institutional registrar and SIS backbone, while ChurchCore-LMS provides the digital interactive courseware player.
- **With FaithFullScholars:** Direct academic bridge for graduating seniors or Bible college students seeking theological higher education and scholarships.

---

## 6. Council Assessment & Strategic Recommendations
- **Strengths:** Unrivaled domain completeness (152 database tables covering every aspect from admissions to graduation audits).
- **Growth Vectors:** Formalize the integration bridge between ChurchCore-Academy and ChurchCore-LMS into a single "Unified Christian Education Suite" SKU for Christian school networks.
