# Customer Onboarding & 14-Day Go-Live Playbook

**Classification:** Customer Success & Operational Deployment SOP  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Status:** ACTIVE STANDARD OPERATING PROCEDURE  
**Last Updated:** 2026-10-16  

---

## 1. Executive Mandate: The Flawless First Sunday

A church software transition fails or succeeds on its **First Sunday Morning**. 
If parents experience long check-in lines, if volunteer badges fail to print, or if online giving fails during the offering, pastoral trust is shattered.

This Playbook provides the step-by-step operational protocol executed by our **Onboarding Concierge Team** to guide a church from contract signature to a triumphant First Sunday live in exactly 14 days.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 14-DAY ONBOARDING SPRINT                         │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ DAYS 1 – 3:        │ DAYS 4 – 7:        │ DAYS 8 – 11:                 │
│ DATA EXTRACTION &  │ FINANCIAL & GIVING │ HARDWARE KIOSKS &            │
│ VERIFICATION       │ CONFIGURATION      │ VOLUNTEER CERTIFICATION      │
│ • Export PCO/Breeze│ • Stripe Connect   │ • Test Brother label printers│
│ • Schema Mapping   │ • Chart of Accounts│ • LMS Safety Course pushed   │
├────────────────────┴────────────────────┴──────────────────────────────┤
│ DAYS 12 – 14: DRY RUN REHEARSAL & TRIUMPHANT SUNDAY LAUNCH             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Day-by-Day Implementation Timeline

### Days 1 – 3: Data Migration & Member Verification
* **Objective:** Extract legacy databases without losing a single household relationship or giving record.
* **Actions:**
  1. Church administrator logs into Planning Center, Breeze, or CCB and clicks `Export People, Households, and Giving CSVs`.
  2. Uploads CSVs into ChurchCore's **Automated Migration Bridge**.
  3. The Concierge Migration Specialist audits the schema mapping:
     - Verifies child-to-parent relationships and emergency contacts.
     - Confirms allergy records and custody alerts.
     - Reconstitutes the double-entry general ledger funds (Tithes, Missions, Building).

### Days 4 – 7: Financial & Digital Giving Setup
* **Objective:** Establish the church's Stripe Connect merchant account for digital tithes and offerings.
* **Actions:**
  1. Church treasurer completes the 5-minute Stripe Connect onboarding (EIN, bank account routing, authorized signatory).
  2. Configure fund accounting chart of accounts (General Fund, Benevolence, Youth).
  3. Deploy the customized giving widget to the church website and configure the mobile giving PWA portal.
  4. Perform test transactions ($1.00 gift) via ACH and Apple Pay; verify instant balancing in the ChurchCore General Ledger.

### Days 8 – 11: Hardware Kiosks & Volunteer Certification
* **Objective:** Prepare children's check-in kiosks and certify ministry volunteers.
* **Actions:**
  1. **Hardware Verification:** Connect Sunday check-in iPads/Android tablets and thermal label printers (Brother QL-820NWB or Dymo 450/550).
  2. Test print 25 sample child security badges and guardian pickup tokens.
  3. **Volunteer Discipleship & Training:** ChurchCore automatically enrolls all Sunday volunteers into the "Sunday Safety & Check-In" course inside `ChurchCore-LMS`. Volunteers complete the 10-minute mobile video module and receive their digital serving badge.

### Days 12 – 13: The Friday/Saturday Full-System Dry Run
* **Objective:** Eliminate every surprise before Sunday morning.
* **Actions:**
  1. Staff conducts a live 30-minute simulation:
     - Check in 5 mock families with allergies and custody restrictions.
     - Verify volunteer schedule confirmations on mobile.
     - Open the Sunday service plan and verify worship song transposition.
  2. Send pastoral email and SMS announcement to congregation: *"We are upgrading our church software to serve you better! Here is how to give and check in this Sunday."*

### Day 14: The First Sunday Morning Live!
* **Objective:** Flawless execution.
* **Support Covenant:** A dedicated ChurchCore Concierge Engineer is assigned to live-monitor the church's tenant between 8:30 AM and 1:00 PM EST with a direct phone hotline to the executive pastor.

---

## 3. Post-Launch Handoff & 30-Day Check-in
* **Day 15 (Monday):** Concierge specialist reviews Sunday giving deposits and check-in incident logs with the church administrator.
* **Day 30:** Formal executive review: confirm software cost savings, donor adoption rate, and schedule advanced modules (LMS Discipleship Tracks or Orthos Safeguarding Audit).
