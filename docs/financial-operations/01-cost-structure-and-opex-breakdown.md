# Cost Structure & Operational Expenses (OpEx) Breakdown

**Classification:** Financial & Operational Architecture  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Status:** ACTIVE FINANCIAL ENGINE  
**Last Updated:** 2026-10-16  

---

## 1. Executive Summary: The Low-COGS Serverless Advantage

ChurchCore is architected on a high-efficiency modern serverless stack (**Next.js 16 Edge execution + Supabase PostgreSQL Multi-Tenant RLS**). Unlike legacy church software providers (Pushpay, Ministry Brands) who maintain expensive legacy on-premise servers and bloated maintenance teams, **ChurchCore operates at a blended Gross Margin exceeding 83%**.

Our infrastructure variable costs scale predictably with tenant size, ensuring that every newly onboarded church, school, or clinic is immediately contribution-margin positive from Day 1.

---

## 2. Variable Cost of Goods Sold (COGS) Breakdown

Variable infrastructure costs fall into five core utility categories:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      VARIABLE INFRASTRUCTURE COGS                      │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. COMPUTE & DB    │ 2. COMMUNICATION   │ 3. AI & EVALUATION           │
│ • Supabase Postgres│ • Twilio SMS       │ • Google Gemini (Orthos)     │
│ • Vercel / Edge    │ • Resend Email     │ • Anthropic Claude (Pastoral)│
├────────────────────┴────────────────────┴──────────────────────────────┤
│ 4. PAYMENT RAILS (Stripe Connect) & 5. STORAGE / BANDWIDTH             │
└────────────────────────────────────────────────────────────────────────┘
```

### Detailed Cost Drivers per Metric:
1. **Database & Storage (Supabase PostgreSQL):**
   - Base Multi-Tenant DB Compute: ~$0.08 per church tenant / month.
   - Storage (Member photos, PDF statements, course media): ~$0.021 per GB / month.
   - Bandwidth Egress: ~$0.09 per GB.
2. **Transactional Email (Resend / SendGrid):**
   - Average church sends ~1,500 system emails/mo (volunteer invites, receipts, reports).
   - Cost: $0.0006 per email = **~$0.90 / month per church**.
3. **SMS Communication Rails (Twilio Native):**
   - High-priority volunteer alerts and Sunday check-in emergency texts.
   - Cost: $0.0079 per domestic SMS segment.
   - Standard tier bundles 250 SMS/mo included = **~$1.98 / month per church**. Additional volume billed via add-on packs at a 40% margin.
4. **AI Generation & Audit Tokens (Google Gemini & Anthropic Claude):**
   - Used in `ChurchCore-Orthos` (auditing) and `ChurchCore` (pastoral visit drafting).
   - Cost: ~$0.0015 per pastoral draft; ~$0.15 per full institutional audit.
   - Blended monthly AI cost per active church: **~$1.25 / month**.
5. **Stripe Connect Custom Account Costs:**
   - Active connected account fee: $2.00 / month per church (only charged on accounts processing giving).
   - Payout fee: $0.25 per direct payout to church bank account.

---

## 3. Unit Cost to Serve (Contribution Margin by Church Tier)

| Metric / Cost Component | Seed Church (75 Attenders) | Growth Church (350 Attenders) | Pillar Church (1,200 Attenders) | Cathedral (3,000+ Attenders) |
|---|:---:|:---:|:---:|:---:|
| **Monthly Subscription Revenue** | **$49.00** | **$149.00** | **$349.00** | **$699.00** |
| **Fintech Net Yield (0.85% Giving)** | **$85.00** | **$401.62** | **$1,375.00** | **$3,450.00** |
| **Total Monthly Revenue** | **$134.00** | **$550.62** | **$1,724.00** | **$4,149.00** |
| *COGS: Database & Compute* | ($1.20) | ($4.50) | ($14.00) | ($35.00) |
| *COGS: Storage & Media Bandwidth* | ($0.50) | ($2.20) | ($8.50) | ($22.00) |
| *COGS: Email & SMS Notifications* | ($1.40) | ($4.80) | ($16.00) | ($45.00) |
| *COGS: AI Token Utilization* | ($0.40) | ($1.50) | ($4.00) | ($12.00) |
| *COGS: Stripe Account Maintenance* | ($2.25) | ($2.25) | ($2.50) | ($3.00) |
| *COGS: Tiered Customer Support* | ($3.00) | ($12.00) | ($35.00) | ($90.00) |
| **Total Monthly Cost to Serve** | **($8.75)** | **($27.25)** | **($80.00)** | **($207.00)** |
| **Net Contribution Margin ($)** | **$125.25** | **$523.37** | **$1,644.00** | **$3,942.00** |
| **Gross Margin Percentage (%)** | **93.5%** | **95.0%** | **95.3%** | **95.0%** |

*(Note: Blended Gross Margin across entire operation including free trials and non-giving accounts settles at **84% – 88%**).*

---

## 4. Operating Expenses (OpEx) Model (Year 1 to Year 3)

### Fixed & Semi-Variable OpEx Categories:
1. **Engineering & Product Architecture (R&D):**
   - Full-stack engineers, database architects, and QA test automation specialists.
   - Target: 35% of total budget in Year 1, stabilizing at 22% by Year 3.
2. **Customer Success & Onboarding Concierge:**
   - Migration specialists managing automated CSV imports from Planning Center, Breeze, and FACTS.
   - Target: 1 concierge onboarding specialist per 150 onboarded churches/schools.
3. **Field Sales & Denominational Partnerships:**
   - Partnership directors attending conferences (AETH, Exponential, Christian School summits) and negotiating regional diocese agreements.
4. **General & Administrative (G&A):**
   - Cyber liability insurance ($2M–$5M policy protecting data privacy and child safety records).
   - Legal, audit, and tax accounting compliance.

### Annual OpEx Budget Phasing:

| Expense Category | Year 1 (250 Churches / 45 Schools) | Year 2 (800 Churches / 160 Schools) | Year 3 (2,200 Churches / 450 Schools) |
|---|:---:|:---:|:---:|
| **Engineering & Product R&D** | $540,000 | $1,150,000 | $2,400,000 |
| **Customer Success & Migration Concierge** | $180,000 | $420,000 | $950,000 |
| **Sales, GTM & Denominational Travel** | $220,000 | $580,000 | $1,400,000 |
| **Infrastructure Hosting (Gross COGS)** | $120,000 | $410,000 | $1,180,000 |
| **Cyber Insurance, Legal, Compliance & G&A** | $90,000 | $180,000 | $380,000 |
| **Total Annual Operational Budget** | **$1,150,000** | **$2,740,000** | **$6,310,000** |
| **Projected Gross Revenue (SaaS + Fintech)** | **$1,850,000** | **$5,900,000** | **$16,800,000** |
| **Net Operating Income (EBITDA)** | **$700,000** | **$3,160,000** | **$10,490,000** |
| **EBITDA Margin** | **37.8%** | **53.5%** | **62.4%** |
