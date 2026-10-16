# Individual Product Competitive Analysis: ChurchCore (ChMS)

**Target Software Pillar:** `ChurchCore v3.5.0` (133 Tables, 121 Routes)  
**Domain Category:** Church Management Software (ChMS), Child Safety Kiosks, Service Planning, Double-Entry Accounting  
**Status:** ACTIVE ANALYSIS  
**Last Updated:** 2026-10-16  

---

## 1. Competitive Overview

The Church Management Software market is roughly divided between:
1. **The Modern Segment Standard:** Planning Center Online (PCO) — dominant among modern mid-to-large churches.
2. **The Budget / SMB Segment:** Breeze ChMS and Tithe.ly — popular among smaller, budget-constrained churches.
3. **The Traditional / Legacy Segment:** Realm (ACS Technologies) and TouchPoint — entrenched in older mainline denominations.

---

## 2. Product-by-Product Evaluation Matrix

| Capability Feature | ChurchCore (ChMS) | Planning Center (PCO) | Breeze ChMS | Tithe.ly ChMS | Realm (ACS) |
|---|:---:|:---:|:---:|:---:|:---:|
| **All-in-One Transparent Pricing** | **YES ($49–$699/mo)** | NO (7 Separate Invoices) | YES ($72/mo flat) | YES ($119/mo) | NO (Tiered & Complex) |
| **Native Double-Entry General Ledger** | **YES (Complete GL)** | NO (QuickBooks only) | NO (QuickBooks only) | NO | YES (Older legacy style) |
| **Child Check-in Security (CCM)** | **High (Tokens, Custody, Badges)** | High (PCO Check-Ins) | Basic | Basic | Moderate |
| **Worship Planning & Transposition** | **YES (1-Click Key Shift)** | YES (PCO Services) | NO (Planning Center sync) | Basic | NO |
| **Volunteer Training / LMS** | **YES (ChurchCore-LMS native)** | NO | NO | NO | NO |
| **AI Member Burnout / Care Signals** | **YES (`ai_signals`, Claude SDK)** | NO | NO | NO | NO |
| **Multi-Lingual Localization** | **YES (EN, ES, PT)** | Basic Spanish | Limited | English-focused | Limited |

---

## 3. Detailed Competitor Teardowns

### Competitor 1: Planning Center Online (PCO)
* **Market Position:** The gold standard for modern worship and volunteer scheduling. Highly loved by worship leaders.
* **Pricing Model:** Fractured "A La Carte." Every new capability requires a separate subscription tier.
* **Key Weaknesses:**
  - **No Accounting Engine:** Churches are forced to purchase QuickBooks Online ($100–$250/mo) and hire specialized bookkeepers to reconcile transaction imports.
  - **No Discipleship Engine:** Lacks native courseware or volunteer onboarding learning modules.
  - **Mounting Bill Fatigue:** As a church grows from 200 to 800 attenders, their PCO bill doubles or triples automatically.
* **ChurchCore Kill Feature:** Unified subscription + Native Double-Entry Accounting + Integrated LMS.

### Competitor 2: Breeze ChMS
* **Market Position:** Owned by Ministry Brands. Popular for simple church plants due to its historical $50/mo flat pricing (now $72+/mo).
* **Key Weaknesses:**
  - Extremely shallow feature set: Service planning is basic, lacks chord charts, lacks advanced custody check-in.
  - Cannot scale to churches over 300 members; churches inevitably churn once they grow.
* **ChurchCore Kill Feature:** ChurchCore provides enterprise-grade depth (133 tables) at a seed price of $49/mo, allowing plants to grow without hitting a software ceiling.

### Competitor 3: Realm (ACS Technologies)
* **Market Position:** Heavily entrenched in historic mainline denominations (Episcopal, Presbyterian, Methodist).
* **Key Weaknesses:**
  - Dated, slow, and overly bureaucratic interface.
  - High friction for mobile giving and volunteer self-service.
* **ChurchCore Kill Feature:** Modern React 19 / Next.js web application with 1-click mobile giving and transparent pricing.
