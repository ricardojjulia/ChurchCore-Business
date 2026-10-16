# AI Agent Protocol: Business Opportunity Discovery & Submission

This document governs how autonomous AI agents, research subagents, and human contributors discover, evaluate, and submit new **Business Opportunities (BOPs)** to the ChurchCore Executive Governing Council.

---

## 1. Agent Discovery Mandate

Whenever you analyze market reports, competitive filings, denominational conference proceedings, regulatory shifts, or feature requests, your mandate is to identify **unlocked commercial avenues** that leverage ChurchCore’s existing **517 database tables** and **6 core product codebases**.

### Key Opportunity Signals to Hunt For:
1. **Regulatory & Insurance Shifts:** New child protection laws, insurance carrier mandates, or accounting standards that churches cannot easily satisfy.
2. **Competitor Blind Spots:** High-priced add-on fees by Planning Center, FACTS, or SimplePractice where ChurchCore can offer native capabilities.
3. **Monetizable Transaction Flows:** High-volume money movement in churches (mission trips, tuition payments, camp registrations, endowment gifts, benevolence funds) where an embedded take-rate generates high-margin revenue.
4. **Institutional Consortia:** Coalitions of churches, academies, or seminaries (like AETH, CCCU, or dioceses) seeking shared technology platforms.

---

## 2. Standardized Agent Submission Workflow

When submitting a new opportunity, the agent must follow this exact 4-step execution ladder:

```
[ Step 1: Research & Discovery ]
  • Identify customer problem, willingness to pay, and market size
                    │
                    ▼
[ Step 2: Codebase Leverage Audit ]
  • Identify which of the 517 tables and 6 codebases already support this
  • Estimate engineering delta (low / medium / high)
                    │
                    ▼
[ Step 3: Draft Business Opportunity Proposal (BOP) ]
  • Use template: docs/templates/BUSINESS-OPPORTUNITY-TEMPLATE.md
  • Calculate RICE Score (Reach x Impact x Confidence / Effort)
  • Save to: docs/business-opportunities/reports/OPP-[YEAR]-[NUMBER]-[slug].md
                    │
                    ▼
[ Step 4: Submit to Council Deliberation Chamber ]
  • Request formal 6-Seat Council Review
  • Council records verdict: GREENLIGHT | INCUBATE | DEFER | REJECT
```

---

## 3. Strict Evaluative Guardrails (Constitutional Invariants)

Every submitted opportunity must pass these three constitutional litmus tests:
1. **The Sovereignty Test:** Does this opportunity violate member data privacy, clergy-penitent privilege, or data ownership? *(If yes, immediately REJECT).*
2. **The Codebase Leverage Test:** Does this require building an entirely separate company from scratch, or does it leverage our Next.js/Supabase architecture? *(Preference given to opportunities leveraging existing tables).*
3. **The Margin Discipline Test:** Does this generate predictable high-margin recurring SaaS or fintech flow (>80% gross margin), or does it create a low-margin professional services consulting trap?
