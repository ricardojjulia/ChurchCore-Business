# Product Dossier 01: ChurchCore (Core ChMS & Ministry Operations)

**Repository:** `https://github.com/ricardojjulia/ChurchCore`  
**Local Codebase:** `/Users/rjulia/ChurchCore`  
**Production / Preview:** In Production / Active Staging  
**Version:** `3.5.0`  
**Primary Domain Category:** Church Management System (ChMS), Operations, Finance & Member Engagement  
**Development State:** Mature Production Architecture (120 SQL Migrations, 121 Next.js App Routes, 133 Database Tables)  
**Last Audited:** 2026-10-16  

---

## 1. Executive Summary & Value Proposition
ChurchCore is the operational beating heart of the local church. Unlike legacy ChMS software (e.g., Planning Center, Church Community Builder, Breeze) which are fragmented across separate pricing modules and fragile integrations, ChurchCore provides a unified, real-time operating system covering:
- **Membership & Family Graph:** Households, family trees, custody restrictions, pastoral milestones.
- **Child Care & Kiosk Safety (CCM):** High-security children's check-in/check-out with barcode/token printing, verified emergency contacts, and incident tracking.
- **Service Planning & Creative Arts:** Song catalogs, CCLI tracking, chord transposition, multi-plan scheduling, and volunteer confirmation portals.
- **Double-Entry Financial Accounting & Giving:** Chart of accounts, general ledger, fund accounting (Tithes, Missions, Building Fund), Stripe Connect giving rails, and automated donor tax statements.
- **Pastoral Care & Member Health:** Pastoral visit logs, prayer requests, burnout alerts, and AI-driven engagement signals.

---

## 2. Technical Stack & Architectural Anatomy
- **Frontend Framework:** Next.js 15+ (App Router), React 19, TypeScript, Mantine Core UI, Tailwind CSS.
- **Database & Storage:** Supabase (PostgreSQL 15+), Storage Buckets (media, statements, check-in badges).
- **Security & Authorization:** Multi-tenant PostgreSQL Row-Level Security (RLS) on all 133 tables. Strict separation between tenant admins, campus pastors, volunteers, and public member portals.
- **Payment & Financial Processing:** Stripe Connect (Custom / Standard connected accounts for direct church payouts).
- **AI & Automation:** Anthropic Claude SDK (`@anthropic-ai/sdk`) for pastoral interaction drafting, sermon outline suggestions, and member churn/burnout signals.
- **Localization:** Enterprise localization governance framework (`@localization-governance/core`) supporting dynamic multi-lingual church experiences (EN, ES, PT).

---

## 3. Core Database Entities (133 Tables Identified)
Key domain clusters:
1. **People & Families:** `people`, `households`, `household_members`, `custody_restrictions`, `allergies`, `member_milestones`.
2. **Child Safety Check-in (CCM):** `ccm_checkin_sessions`, `ccm_authorized_pickups`, `ccm_badge_print_jobs`, `ccm_kiosk_sessions`, `ccm_incidents`.
3. **Services & Volunteers:** `services`, `service_plans`, `songs`, `setlists`, `volunteer_roles`, `schedules`, `volunteer_confirmations`.
4. **Finance & Giving:** `funds`, `accounts` (double-entry), `journal_entries`, `transactions`, `donations`, `recurring_schedules`, `stripe_connect_accounts`, `tax_statements`.
5. **AI Signals:** `ai_signals`, `ai_interactions`, `ai_suggestions`, `burnout_alerts`.

---

## 4. Standalone Commercial Viability
- **Target Buyer:** Senior Pastors, Executive Pastors, Church Business Administrators, Finance Committees.
- **Pricing Model:** Tiered subscription based on Active Weekly Attenders or Household Count:
  - *Seed / Plant (0–100 attenders):* $49/mo (or $0 platform fee with standard 1% donation tip/fee).
  - *Growth (101–500 attenders):* $149/mo.
  - *Regional / Multisite (501–2,000 attenders):* $349/mo.
  - *Cathedral / Megachurch (2,000+ attenders):* $749/mo + Enterprise SLAs.
- **Fintech Monetization:** 0.75% – 1.0% platform take-rate on digital giving transactions processed through Stripe Connect. (At $5M in annual giving, generates $37,500/yr in recurring high-margin transaction revenue per church).
- **Competitive Advantage:** Planning Center charges separately for Giving, People, Services, Check-Ins, Registrations, and Groups (easily exceeding $400–$1,000/mo for a 1,000-person church). ChurchCore delivers the complete unified suite in one coherent subscription.

---

## 5. Ecosystem Synergies with ChurchCore Suite
- **With ChurchCore-LMS:** Church members who volunteer are automatically enrolled in ministry training courses (e.g., Youth Worker Child Protection Certification) in the LMS. Completion unlocks volunteer scheduling in the ChMS.
- **With ChurchCore-Academy:** Church families with school-age children sync demographic and emergency contact records directly into the Academy SIS, eliminating double-data entry.
- **With ChurchCoreCare:** Pastoral team can triage a struggling family from pastoral care into a confidential referral in `ChurchCoreCare` without exposing counseling notes to non-clergy church staff.
- **With ChurchCore-Orthos:** Church financial transactions, facility inspection logs, and background check statuses flow into Orthos for automated governance and annual audit readiness.

---

## 6. Current Strengths & Identified Growth Vectors
- **Strengths:** Extremely mature codebase (v3.5.0), complete E2E testing harnesses (`test:e2e:member-mobile`, `test:e2e:onboarding`), native double-entry ledger (rare in standard ChMS products).
- **Growth Vectors:** Standardize API contracts for the unified ChurchCore ID; build one-click automated migration bridges from Breeze ChMS and Planning Center CSV exports.
