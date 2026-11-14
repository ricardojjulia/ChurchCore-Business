# Fleet Pricing Schedule: Standard Tier Ladder

- **Governing directive**: [COUNCIL-2026-016](../../council/COUNCIL-2026-016.md), REQ-016-06
- **Status**: NORMATIVE for structure (tier keys, trial, mechanics). The price points in §3 are the **ratified launch schedule**; the owner may change them only by amending this schedule, never in app code.
- **Version**: 1.0.0 (2026-11-14)
- **Supersedes**:
  - for self-serve SaaS: all per-app tier names and prices in `docs/business-models/01-pricing-and-packaging-architecture.md`, `docs/financial-operations/02-offering-catalog-and-packaging-matrix.md` and `docs/portfolio/0N-*.md`
  - in-repo pricing in each app (ChMS `docs/product-strategy.md` §3.1; LMS `src/lib/stripe-plans.ts`; Care `apps/api/src/lib/stripe.js`; Orthos `planTier`; Scholars `lib/subscriptions/types.ts`)
  - ChurchCore Academy's "single flat per-student price, no tiers" position (`docs/competitive-roadmap.md:18`)

## 1. Rules (identical in every app)

| Rule | Standard |
|---|---|
| Tier keys | `starter`, `growth`, `pro` (display names Starter, Growth, Pro) |
| Trial | 30 days, **all features at Pro level and Pro limits**, no card required, every app |
| End of trial | Customer picks a tier. Features above the tier lock at conversion. Unconverted tenants become `trial_expired` (read-only, export allowed). |
| Billing cycles | Monthly, or annual at **10× monthly** (2 months free). Replaces the 10% / 15% / 17% variants. |
| Over limit | Upgrade prompt plus 30-day grace. Reads are never blocked and data is never deleted. |
| Never paywalled | Child safety and safeguarding (e.g. ChMS check-in, CCM), security controls, data export, accessibility |
| Enterprise / denomination | Sales-led contracts above Pro, provisioned from the control plane on plan `pro` with a `contract_ref`. Not a self-serve tier. |
| Free tiers | **Retired as tenant tiers.** ChMS "Seed $0 with 1% giving" and Scholars institution `basic` end. Individual scholar profiles in FaithFull Scholars remain free, because scholars are users, not tenants. |
| Stripe | One Product per app tier. Prices are configured as `STRIPE_PRICE_{STARTER\|GROWTH\|PRO}_{MONTHLY\|ANNUAL}`. Webhooks map prices to tier keys only. |
| Currency | USD at launch |

## 2. Value Metric per App

| App | Value metric (what the tier limits) |
|---|---|
| ChurchCore (ChMS) | Active weekly attenders |
| ChurchCore LMS | Active learners (any activity in the last 30 days) |
| ChurchCore Academy | Enrolled (active) students |
| ChurchCore Care | Active clinicians (seats) |
| ChurchCore Orthos | Governed entities (church, school, daycare, foundation) |
| FaithFull Scholars | Institution search seats + monthly scholar inquiries |

## 3. Launch Price Points

| App | Starter | Growth | Pro | Limits (Starter / Growth / Pro) | Source |
|---|---|---|---|---|---|
| **ChMS** | $49/mo · $490/yr | $149/mo · $1,490/yr | $349/mo · $3,490/yr | ≤100 / ≤500 / ≤2,000 attenders | PPA 2026-10-16 (Seed, Growth and Pillar mapped to Starter, Growth and Pro). Cathedral (2,000+) becomes Enterprise. |
| **LMS** | $79/mo · $790/yr | $199/mo · $1,990/yr | $449/mo · $4,490/yr | ≤50 / ≤300 / ≤1,500 learners | Portfolio 02 |
| **Academy** | $240/mo · $2,400/yr | $480/mo · $4,800/yr | $960/mo · $9,600/yr | ≤150 / ≤500 / ≤1,200 students | PPA annual figures; monthly = annual ÷ 10. Setup fees are waived for self-serve. 1,200+ students becomes Enterprise. |
| **Care** | $59/mo · $590/yr | $149/mo · $1,490/yr | $349/mo · $3,490/yr | 1 / 2–5 / 6–20 clinicians; extra seat $39 (Growth) or $29 (Pro) per month | PPA; matches the SimplePractice anchor |
| **Orthos** | $99/mo · $990/yr | $199/mo · $1,990/yr | $399/mo · $3,990/yr | 1 / ≤3 / ≤10 entities | Portfolio 05 ($1,200 and $2,400 per year). **Pro was extrapolated by the control plane.** |
| **FaithFull Scholars** | $149/mo · $1,490/yr | $399/mo · $3,990/yr | $749/mo · $7,490/yr | 5 seats / 50 inquiries; 15 / 200; unlimited | Code and ADR 0010 (Seminary Partner and Premier Partner); Pro from the catalog's $7,500/yr unlimited. **Growth caps set by the control plane.** |

### Tier feature principle
Each app's Starter tier is the full core product within its limits. Growth adds collaboration, scale and integration features. Pro adds AI, multi-site and advanced compliance and reporting features. Each app MUST publish its feature-to-tier matrix at `docs/pricing/TIER-MATRIX.md` (Implementation Plan, Phase 2). The matrix MUST respect the never-paywalled list.

## 4. Conflicts Resolved by This Schedule (evidence: pricing research, 2026-11-14)

1. **Tier names** were different in every app (Seed/Growth/Pillar/Cathedral; starter/growth/enterprise vs free/standard/premium; solo/group; Standard/Flagship/Enterprise; basic/verified_seminary/premier_partner). All are now `starter/growth/pro`.
2. **Trial** varied: 14 days (LMS), 30 days (Care, with a card-at-signup Stripe subscription), and none (Academy, Orthos, Scholars). It is now 30 days, all features, no card, everywhere.
3. **Annual discount** varied between 10%, 15% and 17%. It is now 10× monthly.
4. **Price sets:** two or three conflicting sets existed per app. The Business PPA (2026-10-16, newest) was used where it covered the app; otherwise the portfolio dossier was used.
5. **Free tiers** conflicted with "every trial converts to paid". They are retired as tenant tiers.
6. **Billing implementation gaps** are tracked in the Implementation Plan:
   - The LMS webhook writes plan keys rejected by the database CHECK constraint.
   - Care seat limits are not enforced.
   - ChMS, Academy, Orthos and Scholars have no SaaS billing at all.

## 5. Not Changed by This Schedule
- Digital-giving processing rates (ChMS), SMS packs, white-label and migration add-ons stay as listed in the PPA §3. They are add-ons, not tiers.
- Fleet bundles (Local Church Complete, Academy Cloud, Clinical Wellness, Denomination) need a separate bundle schedule. Until then they are sold only as Enterprise contracts.
