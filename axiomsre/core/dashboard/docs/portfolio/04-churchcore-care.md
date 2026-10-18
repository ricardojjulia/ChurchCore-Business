# Product Dossier 04: ChurchCoreCare (Pastoral & Faith-Based Clinical Counseling)

**Repository:** `https://github.com/ricardojjulia/ChurchCoreCare`  
**Local Codebase:** `/Users/rjulia/ChurchCoreCare` (and `/Users/rjulia/FaithCounseling-meet`)  
**Production / Preview:** Enterprise Ready / Active Localization Harness  
**Version:** `7.1.0`  
**Primary Domain Category:** Electronic Health Record (EHR) / Practice Management for Pastoral & Christian Clinical Counseling  
**Development State:** Mature Production Architecture (84 Database Tables, Specialized RLS Deny-All Policies, High Security & Load Verification)  
**Last Audited:** 2026-10-16  

---

## 1. Executive Summary & Value Proposition
ChurchCoreCare is a clinical and pastoral counseling practice management platform engineered to meet the unique ethical, legal, and spiritual needs of Christian counseling centers, church pastoral care teams, and faith-based private practices.

General secular EHRs (SimplePractice, TherapyNotes) lack spiritual assessment frameworks, faith integration profiles, and pastoral supervision tiers. Conversely, standard ChMS tools are legally unfit to hold confidential mental health or clinical records.

ChurchCoreCare solves this by delivering:
- **Dual-Mode Practice Architecture:** Supports both **Licensed Clinical Therapy** (HIPAA-compliant, diagnostic codes, insurance claims, treatment plans) and **Biblical / Pastoral Counseling** (clergy-penitent privilege, spiritual formation tracking, scripture intervention logs).
- **Client Records & Clinical Safety:** Confidential intake pipelines, allergy and medication lists, diagnostic history, SOAP/DAP progress notes, crisis flags, and safety contracts.
- **Scheduling & Practice Operations:** Recurring appointment series, availability templates, practitioner calendar sync, automated reminders.
- **Integrated Telehealth:** Encrypted, scalable video consultation powered by `FaithCounseling-meet`.
- **Billing & Superbills:** Client billing, co-pay collection, CMS-1500 / insurance claim generation, and church benevolence subsidies.

---

## 2. Technical Stack & Architectural Anatomy
- **Backend / Microservices:** Node.js/TypeScript API standalone engine with worker queues, PostgreSQL database.
- **Cryptographic Security & RLS:** Explicit zero-trust and deny-all RLS security policies (`20260609000001_security_rls_deny_all_policies.sql`). Complete cryptographic wall separating client clinical data from ordinary church membership files.
- **Integrated Video Platform:** Scalable WebRTC video conferencing engine (`FaithCounseling-meet`) for encrypted telehealth sessions.
- **Multilingual Localization:** Deep Spanish localization pipeline (`es-pr` Puerto Rico / Latin America) for global cross-cultural counseling ministries.

---

## 3. Core Database Entities (84 Tables Identified)
Key domain clusters:
1. **Clients & Faith Profiles:** `clients`, `client_contacts`, `client_addresses`, `client_allergies`, `client_clinical_history`, `client_diagnoses`, `client_faith_profiles`.
2. **Scheduling & Availability:** `appointments`, `appointment_series`, `availability_templates`, `availability_overrides`.
3. **Clinical & Pastoral Notes:** `intake_forms`, `progress_notes`, `treatment_plans`, `pastoral_interventions`, `crisis_assessments`.
4. **Billing & Claims:** `claims`, `invoices`, `payments`, `insurance_providers`, `benevolence_allocations`.
5. **Auditing & Compliance:** `audit_events`, `security_access_logs`, `consent_records`.

---

## 4. Standalone Commercial Viability
- **Target Buyer:** Christian Counseling Practice Owners, Church Care Pastors, Christian Mental Health Clinics, Seminary Counseling Centers.
- **Pricing Model:** Per-Clinician Monthly Subscription:
  - *Solo Practitioner / Church Counselor:* $59/mo (includes telehealth).
  - *Group Practice (2–10 clinicians):* $149/mo base + $39/mo per additional clinician.
  - *Large Ministry Counseling Center (10+ clinicians):* $399/mo + Enterprise SLAs.
- **Competitive Substitutes:** SimplePractice ($69–$99/clinician/mo), TherapyNotes ($59/mo). ChurchCoreCare captures this market by offering native faith-based documentation, church benevolence billing integration, and multilingual support.

---

## 5. Ecosystem Synergies with ChurchCore Suite
- **With ChurchCore (ChMS):** Pastors can refer church members to the counseling center via an encrypted one-way handoff. The church staff can see that a referral was received, but all session content, diagnoses, and notes remain locked in ChurchCoreCare.
- **With ChurchCore-Academy & LMS:** Provides counseling and mental wellness support for students and seminarians undergoing ministry training.

---

## 6. Council Assessment & Strategic Recommendations
- **Strengths:** Hardened security boundary (Version 7.1.0) with explicit deny-all policies and automated security verification scripts.
- **Growth Vectors:** Market directly to the Christian Association for Psychological Studies (CAPS) and Association of Certified Biblical Counselors (ACBC) networks as the premier dual-mode platform.
