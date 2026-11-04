# ChurchCore Sovereign Infrastructure, Vercel Pro & Supabase Pro Cloud Landscape Report

- **Document ID**: `COUNCIL-2026-013`
- **Classification**: Sovereign Architecture & Cloud FinOps Certification
- **Date**: October 29, 2026
- **Governing Authority**: ChurchCore High Sovereign Council (`ChurchCore-Business`)
- **Constitutional Invariant**: Section III — *Zero Cross-Application Customer Data Propagation* (`0.00%` Shared Customer Tables)
- **Verification Status**: **100% CERTIFIED (`7/7` Vercel Pro Deployments `READY` · `8/8` Supabase Pro Databases `ACTIVE_HEALTHY` · `584` Live Tables/Views · `11/11` Security Checks Passing)**

---

## 1. Executive Summary

The **ChurchCore Ecosystem** operates a **7-Repository Sovereign Product & Governance Fleet** deployed on **Vercel Pro** (`churchcore` Team) and backed by **8 physically isolated PostgreSQL databases** consolidated under a single **Supabase Pro Organization** (`ChurchCore` / `bqpjefzdlxksskyrvkrt`).

Following the execution of **Option B (Cloud-Native Next.js 16 Control Plane)** and the **Full Fleet Cloud & Database Consolidation**, every application in the portfolio now satisfies all constitutional, operational, and financial governance mandates:

1. **100% Paid Tier Coverage (Zero Free-Tier Pause or Commercial Licensing Risk)**:
   - All **7 Vercel projects** run inside the **`churchcore` Vercel Pro Team** (`$20/mo` base seat).
   - All **8 Supabase PostgreSQL databases** run inside the **`ChurchCore` Supabase Pro Organization (`bqpjefzdlxksskyrvkrt`)** (`$25/mo` base + `$10/mo` per additional compute instance), eliminating the Supabase Free-Tier 2-project limit and 7-day inactivity pause risk.
2. **100% Physical Database Silo Isolation (Constitution Section III)**:
   - Each product suite connects exclusively to its own dedicated Supabase project reference (`xsmcurhmgmnxxppkorpq`, `iopydttovnyjgikprvol`, `tpyvciujsrllvowqgeyq`, `nvklkmsnqqrjzirnhfzr`, `ujtwcrulqawzvggehxjf`, `vnuoibklcldxadffmitj`, `yxrvrjkzlumenlvczqjd`, `ukekzedrnkqauiwfnilb`).
   - Across the fleet, **584 relational tables and views** are deployed and protected by PostgreSQL Row-Level Security (`ENABLE` + `FORCE ROW LEVEL SECURITY`).
3. **Autonomous Cloud Governance & GitHub Repo Operator**:
   - The Control Plane (`https://churchcore-control-plane.vercel.app`) is wired to all 6 product repositories via **HMAC-SHA256 GitHub Webhooks** (`#704475956` through `#704475978`) and an authenticated **GitHub Repo Operator (`/api/repo-ops`)** capable of inspecting trees, pulling files, pushing directives, opening PRs, and auto-committing ratified Council deliberations (`docs/deliberations/DELIB-*.md`).

