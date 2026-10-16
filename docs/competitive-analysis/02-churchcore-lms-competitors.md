# Individual Product Competitive Analysis: ChurchCore-LMS

**Target Software Pillar:** `ChurchCore-LMS v0.36.1` (72 Tables, 85 Routes, 46 Council Records)  
**Domain Category:** Learning Management System (LMS), Discipleship Tracks, Leadership Training  
**Status:** ACTIVE ANALYSIS  
**Last Updated:** 2026-10-16  

---

## 1. Competitive Overview

LMS options for churches and Christian education are caught in a major mismatch:
1. **Higher-Ed Academic Giants (Canvas, Moodle, Blackboard):** Built for accredited universities; prohibitively complex, priced at $10,000–$50,000/year, zero pastoral discipleship awareness.
2. **Commercial Course Creators (Teachable, Thinkific, Kajabi):** Built for online influencers selling marketing video paywalls; zero academic rubric assessment, no SCORM runtime, no pastoral small group cohorts.
3. **Christian Content Streaming (RightNow Media):** A video streaming library ("Christian Netflix") with zero testing, quizzes, certification, or interactive pedagogy.

---

## 2. Product-by-Product Evaluation Matrix

| Capability Feature | ChurchCore-LMS | Canvas LMS | Moodle (Self-Hosted) | Teachable / Kajabi | RightNow Media |
|---|:---:|:---:|:---:|:---:|:---:|
| **Ministry Discipleship Focus** | **YES (Pastoral Cohorts)** | NO (Pure Academia) | NO (Pure Academia) | NO (Marketing/Sales) | Streaming Only |
| **PWA Offline Mobile Study** | **YES (IndexedDB Sync)** | Limited App | Mobile App (Clunky) | NO | Mobile App (Streaming) |
| **Starting Price** | **$79 / month** | $8,000–$25,000 / yr | "Free" (High hosting cost) | $119–$399 / mo | $1,500–$5,000 / yr |
| **SCORM / xAPI Runtime** | **YES (COUNCIL-2026-042)** | YES | YES | NO | NO |
| **OneRoster Interop** | **YES (COUNCIL-2026-017)** | YES | Limited Plugin | NO | NO |
| **Interactive Rubrics & Quizzes** | **YES (Bank Questions)** | YES | YES | Basic Multiple Choice | None |
| **Digital Certificates & QR Token**| **YES (React PDF + Token)** | Requires 3rd-party | Requires plugin | Basic PDF | None |
| **ChMS Volunteer Linkage** | **YES (Native to ChurchCore)**| NO | NO | NO | NO |

---

## 3. Detailed Competitor Teardowns

### Competitor 1: Canvas LMS (Instructure)
* **Market Position:** Dominant learning platform in North American higher education and public school districts.
* **Key Weaknesses:**
  - Enormous annual cost ($10k–$30k+) requiring specialized IT administrators.
  - Lacks discipleship tracking, small group community engagement, or church member portal integration.
* **ChurchCore-LMS Kill Feature:** Delivers 80% of Canvas's pedagogical rigor (rubrics, quizzes, OneRoster, SCORM) at **10% of the cost**, with native offline PWA capabilities for global ministry.

### Competitor 2: Teachable / Kajabi
* **Market Position:** Dominant among solopreneurs, digital marketing influencers, and independent course creators.
* **Key Weaknesses:**
  - High monthly transaction fees and lack of formal academic rigor.
  - Cannot handle cohort-based semester access windows or multi-instructor grading rubrics.
* **ChurchCore-LMS Kill Feature:** Built for structured ministry formation cohorts, not transactional video paywalls.

### Competitor 3: RightNow Media
* **Market Position:** Ubiquitous church video streaming subscription.
* **Key Weaknesses:**
  - Pure passive media consumption. Pastors cannot verify if a deacon or youth worker actually learned or passed a safety test.
* **ChurchCore-LMS Kill Feature:** Active discipleship and measurable credentialing with automated badge triggers and verifiable certificates.
