# Fintech Underwriting, KYC & Fraud Risk Policy

**Classification:** FinTech Operations, Regulatory Compliance & Risk Management  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Status:** ACTIVE RISK POLICY  
**Last Updated:** 2026-10-16  

---

## 1. Executive Summary: Protecting the Ministry Payment Rails

Because ChurchCore processes millions of dollars in digital tithes, offerings, school tuition, and event registrations through **Stripe Connect**, we operate as a technology platform partner subject to strict federal financial regulations (**FinCEN, Patriot Act, PCI-DSS Level 1, and Card Brand Rules**).

This policy establishes our automated fraud detection, merchant underwriting, Know Your Customer (KYC) protocols, and chargeback reserves to protect ChurchCore and our member ministries from financial liability.

---

## 2. Church Merchant Underwriting & KYC Verification

Every church or school creating a merchant account on ChurchCore must undergo automated KYC/AML verification via Stripe Connect Custom onboarding:

### Mandatory Underwriting Requirements:
1. **Legal Entity Verification:**
   - Valid IRS 501(c)(3) Determination Letter or formal denominational group exemption verification.
   - Verified Employer Identification Number (EIN) matched against IRS databases.
2. **Authorized Signatory KYC:**
   - Legal name, date of birth, residential address, and last 4 digits of SSN for the primary church officer (Senior Pastor, Treasurer, or Board Chair).
3. **Physical Bank Account Verification:**
   - Bank account registered in the church's exact legal entity name (verified via Plaid / Stripe Financial Connections or voided check). Payouts to personal accounts are strictly prohibited.

---

## 3. Fraud Defense: Combating "Card Testing" Bot Attacks

### The Threat
Stolen credit card syndicates frequently target church donation pages with automated bots to test stolen card validity by running thousands of micro-donations ($1.00 to $5.00) in rapid succession. This can generate catastrophic card network dispute fines ($15 per failed swipe).

### The ChurchCore Automated Defense Perimeter:
1. **Cloudflare Turnstile Invisible CAPTCHA:**
   - Embedded natively on all public giving forms (`@marsidev/react-turnstile`). Completely invisible to legitimate human church members, but blocks automated headless bot attacks with a 99.98% efficacy rate.
2. **Velocity Limiting Rules:**
   - Max 3 donation attempts per IP address per 10 minutes.
   - Max $10,000 transaction threshold for unverified first-time donors without automated two-factor SMS authorization.
3. **Stripe Radar ML Heuristics:**
   - Real-time machine learning fraud scoring. Any transaction with an elevated risk score (>75) is blocked automatically.

---

## 4. Chargeback Dispute Management & Reserve Covenant

* **The Low-Risk Profile of Church Tithes:** Church donations have an extraordinarily low chargeback rate (< 0.05% vs. 1.2% in secular e-commerce). Members rarely dispute tithes they gave intentionally.
* **Chargeback Allocation:** In the rare event of a donor chargeback (e.g., an unauthorized family card swipe), Stripe deducts the disputed amount plus a $15 network fee from the church's next daily payout.
* **Dispute Concierge:** ChurchCore's financial operations team automatically generates an IRS-compliant electronic contribution receipt and attendance proof to submit to the card issuer, winning over 75% of fraudulent disputes.
