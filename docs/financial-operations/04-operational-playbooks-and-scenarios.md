# Operational Playbooks & Scenario Protocols

**Classification:** Operational Governance & SOPs  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Status:** ACTIVE STANDARD OPERATING PROCEDURE  
**Last Updated:** 2026-10-16  

---

## 1. Protocol 1: The Pastoral Grace Period & "No-Hostage" Non-Payment Policy

### The Dilemma
A church experiences a severe financial shortfall (e.g., senior pastor transition, sudden building repair, or giving decline) and defaults on their monthly SaaS subscription.

### The Wrong Industry Response:
Secular SaaS companies automatically lock accounts after 7 days, barring staff from accessing member files and holding their data hostage. This destroys pastoral trust and violates Christian ethics.

### The ChurchCore Protocol:
1. **Day 1–30 (Soft Dunning & Silent Retry):** Stripe automatically retries failed payment methods quietly without disruptive warning banners in front of church staff.
2. **Day 31–60 (The Pastoral Concierge Outreach):** A customer success representative reaches out personally to the pastor or administrator: *"We noticed your card failed. Is your ministry experiencing a hard season? How can we pray for or assist you?"*
3. **Day 61+ (Benevolent Downgrade, Never Account Lockout):** If the church cannot pay, the account is **never deleted or locked**. Instead, it is gracefully shifted to the **Free Seed Tier / Read-Only Mode**:
   - Church staff can still search member phone numbers and view historical giving records.
   - Child check-in and digital giving remain active so the church can continue collecting tithes to recover.
   - We do not hold a church's data hostage. Ever.

---

## 2. Protocol 2: Handling Sunday Peak Traffic & Easter/Christmas Surges

### The Dilemma
Church traffic is not evenly distributed across the week. Over **70% of database write operations** occur in a narrow 3-hour window on Sunday morning (9:00 AM – 12:00 PM local time across time zones) when thousands of children check in simultaneously. Furthermore, Easter and Christmas produce a **400% surge** in digital giving transaction volume.

### The ChurchCore Engineering & Operational Protocol:
1. **Database Autoscaling Schedule:**
   - Supabase / PostgreSQL compute instances are pre-scheduled to scale up vertically on Saturday night at 11:00 PM EST and scale back down on Sunday at 4:00 PM EST.
2. **Offline-First Check-In Buffering (CCM):**
   - The check-in kiosk runs as an installable PWA with local IndexedDB buffering. If a church's local Wi-Fi drops or a database query takes >500ms, the kiosk prints the barcode badge locally and queues the transaction for background sync.
3. **Dedicated Stripe Webhook Workers:**
   - Digital giving transactions during Easter and Christmas are processed via decoupled asynchronous message queues (`pg_boss` / background worker) to ensure 0% timeout rates under extreme traffic.

---

## 3. Protocol 3: Handling Custom Feature Requests from Mega-Churches

### The Dilemma
A 4,000-member megachurch or large denomination offers to pay $50,000 upfront, but demands a bespoke, custom workflow that does not exist in ChurchCore.

### The Wrong Industry Response:
Fork the codebase and build a custom one-off module, creating nightmare technical debt that breaks future updates.

### The ChurchCore Protocol:
1. **The Council Evaluation Gate:** The request is submitted to Tier 1 HQ Personas and Tier 2 Council:
   - *Question 1:* Does this request benefit the wider ChurchCore ecosystem, or is it an idiosyncratic whim?
   - *Question 2:* Can it be solved using our existing metadata fields, custom tags, or API webhooks?
2. **The "Sponsored Roadmap Item" Path:**
   - If the feature has ecosystem value (e.g., advanced multi-campus room reservations), the client is permitted to co-sponsor the feature. It is built cleanly into the core product for all users.
3. **The "Custom Integration" Path:**
   - If the request is truly unique to their internal governance, we provide them with our **Public REST / GraphQL API & Webhooks Engine**, allowing their internal IT team to build an external integration without contaminating core multi-tenant schemas.

---

## 4. Protocol 4: The Zero-Friction Offboarding Guarantee

### The Dilemma
A church decides to leave ChurchCore for another platform.

### The ChurchCore Invariant:
* We believe ministries stay with ChurchCore because of **excellence, not captivity**.
* The administrator can click one button in settings: `Export All Ministry Records`.
* The platform instantly generates a complete, clean, unencrypted ZIP file containing:
  - People & Household directories (CSV / JSON)
  - Complete double-entry general ledger and donation history
  - Student academic transcripts (PDF / CSV)
  - Volunteer records and training certifications
* We assist them in their exit interview with grace. (Historical data shows that 30% of churches who leave for a competitor return within 18 months when they realize the competitor lacks our financial and educational depth).

---

## 5. Protocol 5: Multi-Tenant Cost Optimization & Pruning

### The Operational Guardrails:
1. **Automated Blob Tiering:** Media uploads (e.g., recorded sermon videos or old church bulletins) older than 180 days are automatically transitioned to low-cost archival cold storage (AWS S3 Glacier / Cloudflare R2), slashing monthly storage costs by 80%.
2. **Test & Demo Tenant Auto-Teardown:** Staging sandboxes and abandoned trial tenants are automatically archived after 60 days of inactivity, keeping primary PostgreSQL connection pools lean and blazingly fast.
