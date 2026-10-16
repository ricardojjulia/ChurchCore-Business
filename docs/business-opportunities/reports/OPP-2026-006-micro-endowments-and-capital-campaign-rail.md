# BOP-2026-006: Micro-Endowments & Capital Campaign Financing Rails

**Status:** GREENLIT (Target Q2 2027)  
**Date Submitted:** 2026-10-16  
**Submitting Agent:** 💰 The Commercial & Financial Modeler & 🏛️ The Portfolio Architect  
**Target Market Domain:** Capital Campaigns, Planned Giving & Non-Profit Endowments  
**Impacted Suite Pillars:** `ChurchCore` (Double-Entry General Ledger & Giving Rails)  
**Council Priority Score (RICE):** **82.5 / 100**  

---

## 1. Executive Summary & Opportunity Hook
Over the next two decades, the **"Great Wealth Transfer"** will see older church members transfer over **$84 Trillion in assets** to heirs and charities. Yet 95% of churches have no mechanism to receive non-cash gifts (appreciated stock, crypto, real estate, IRA required minimum distributions, or donor-advised funds).

By integrating non-cash gift liquidation rails and capital campaign pledge tracking into `ChurchCore`'s native double-entry ledger, ChurchCore enables churches to launch multi-year capital campaigns and accept complex legacy gifts with **zero administrative friction**, capturing a **1.0% to 1.5% platform transaction fee on massive asset transfers ($10k to $500k+ gifts)**.

---

## 2. Market Problem & Unmet Demand
* **The Single-Gift Ceiling:** Standard church giving tools (Pushpay, Subsplash, Tithe.ly) are credit card swipe and ACH tools. When a member wants to donate $50,000 in appreciated Apple stock to the building fund, the church has no idea how to process it and loses the gift.
* **Capital Campaign Confusion:** Churches undergoing a building expansion track pledges on manual spreadsheets that constantly fall out of sync with actual giving.
* **The ChurchCore Advantage:** Because ChurchCore possesses a true double-entry general ledger (`accounts`, `journal_entries`, `funds`), pledged capital campaigns and multi-fund allocations are natively balanced down to the penny.

---

## 3. ChurchCore Architectural Leverage (Existing Codebase Assets)
* **Tables Leveraged:** `funds`, `journal_entries`, `transactions`, `donations`, `recurring_schedules`, `stripe_connect_accounts`.
* **Engineering Delta:** Moderate (3 weeks to integrate stock/crypto liquidation partner API like Chariot or Engiven into the existing giving portal).

---

## 4. Monetization Mechanics & Financial Model
* **Platform Fee Structure:**
  - Standard credit/debit/ACH giving: 0.85%
  - Non-Cash Asset Liquidation (Stock, DAFs, Planned Giving): **1.25% platform fee**
* **Financial Multiplier on Capital Campaigns:**
  - If 200 churches launch a $1M building campaign over 3 years:
    $$200 \times \$1,000,000 = \$200,000,000\text{ in Total Campaign Pledges}$$
  - Capturing just 10% through non-cash rails ($20M) at 1.25%:
    $$\$20,000,000 \times 1.25\% = \mathbf{\$250,000\text{ Direct High-Margin Revenue}}$$
  - Plus standard recurring campaign fulfillment flows.

---

## 5. RICE Opportunity Scoring Rubric

$$\text{RICE Score} = \frac{\text{Reach (7.5)} \times \text{Impact (9.0)} \times \text{Confidence (8.5)}}{\text{Effort (3.5)}} = \mathbf{82.5}$$

---

## 6. Council Deliberation & Executive Verdict
* **Chief Financial Officer:** *APPROVE. Moves ChurchCore from processing small $50 weekly tithes to facilitating generational $50,000 endowment and building gifts.*
* **Verdict:** **GREENLIT.** Partner with non-cash liquidation API rails for Q2 2027 rollout.
