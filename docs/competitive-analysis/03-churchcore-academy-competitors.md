# Individual Product Competitive Analysis: ChurchCore-Academy (SIS)

**Target Software Pillar:** `ChurchCore-Academy v0.10.0` (152 Tables, 105 Routes)  
**Domain Category:** Student Information System (SIS), Academic Administration, Christian K-12 & Bible Colleges  
**Status:** ACTIVE ANALYSIS  
**Last Updated:** 2026-10-16  

---

## 1. Competitive Overview

The faith-based school administration and Student Information System (SIS) market is notoriously sluggish, dominated by two legacy incumbents:
1. **FACTS Management (Nelnet / formerly RenWeb):** Installed in over 70% of Christian private schools. Massive market share, but plagued by outdated technology and complex pricing.
2. **Blackbaud K-12 (Total School Solution):** High-end, expensive, complex enterprise SIS for wealthy prep schools and large Catholic dioceses.
3. **Mid-Market Challengers (Gradelink, PraxiSchool):** Simpler cloud options that lack deep accreditation audit packages and spiritual formation tracking.

---

## 2. Product-by-Product Evaluation Matrix

| Capability Feature | ChurchCore-Academy | FACTS / RenWeb | Blackbaud K-12 | Gradelink |
|---|:---:|:---:|:---:|:---:|
| **Annual Pricing (350 Students)** | **$4,800 / year** | $12,000–$18,000 / yr | $25,000–$45,000 / yr | $3,600–$5,500 / yr |
| **User Interface Technology** | **Next.js 15+ / React 19 (Mobile)**| Legacy Desktop / Web Wrapper | Heavy Enterprise Web | Web App |
| **Spiritual & Character Formation** | **YES ("Faculty Shepherd" View)**| NO | NO | NO |
| **Accreditation Package Audit** | **YES (`academy_accreditation`)** | Moderate (Custom export) | High (Complex reports) | Basic |
| **Native Ministry LMS Integration** | **YES (ChurchCore-LMS native)**| Requires 3rd-party LMS | Integrated (Very costly) | Google Classroom sync |
| **OneRoster v1.2 Standard** | **YES (IMS Global Standard)** | Partial | YES | NO |
| **Admissions & Enrollment Pipeline**| **YES (Included in Base)** | High add-on fee | High add-on fee | Basic form |

---

## 3. Detailed Competitor Teardowns

### Competitor 1: FACTS Management / RenWeb (Nelnet)
* **Market Position:** The entrenched monopoly in Christian K-12 education.
* **Key Weaknesses:**
  - **Severe Teacher UX Friction:** Teachers dread grade entry and attendance due to legacy clunky dropdowns and slow load times.
  - **Opaque Add-on Fees:** Charging separate fees for online admissions, family portals, cafeteria management, and tuition processing.
  - **Zero Church Synergy:** If a church runs a weekday Christian school, FACTS does not integrate with the church's weekend ChMS.
* **ChurchCore-Academy Kill Feature:** Modern mobile-responsive interface, integrated Christian formation tracking, and seamless Sunday School $\leftrightarrow$ Weekday Academy synchronization.

### Competitor 2: Blackbaud K-12
* **Market Position:** The gold-standard enterprise suite for elite private academies.
* **Key Weaknesses:**
  - Prohibitively expensive ($25k–$50k+/year) and requires months of specialized deployment consulting.
* **ChurchCore-Academy Kill Feature:** Enterprise-grade relational depth (152 tables covering academic periods, standing rules, graduation clearances) at an accessible flat annual license.
