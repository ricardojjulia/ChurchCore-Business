# Sovereign Database Isolation & Security Architecture

**Classification:** Core System Architecture & Security Invariant  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Constitutional Invariant:** [Constitution Section III (Zero Data Propagation)](file:///Users/rjulia/ChurchCore-Business/docs/constitution/CONSTITUTION.md)  
**Status:** ACTIVE MANDATE  
**Last Updated:** 2026-10-16  

---

## 1. Executive Philosophy: Sovereign Silos Over Monolithic Honeypots

A fatal temptation in multi-product enterprise suites is building automated "omnipresent sync pipelines" or central event buses that silently copy user records, addresses, notes, and family trees between different database applications.

**ChurchCore unequivocally rejects automated cross-application data propagation.**

### The Core Invariant:
* **Each Application Database is an Absolute Sovereign Silo:** `ChurchCore (ChMS)`, `ChurchCore-LMS`, `ChurchCore-Academy`, `ChurchCoreCare`, `ChurchCore-Orthos`, and `FaithFullScholars` operate with their own isolated database schemas and dedicated Supabase instances.
* **No Background Data Propagation:** There are **zero automated background message buses, database replication streams, or sync workers** pushing data across applications.
* **User Agency & Data Sovereignty:** If a church member willingly enters information into `ChurchCore (ChMS)`, that data resides exclusively in `ChurchCore (ChMS)`. If that same individual enters information into `ChurchCoreCare` (counseling) or `ChurchCore-Academy` (school), they own that choice and input it intentionally. We do not build backend scaffolding to silently copy or link their records across tools.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SOVEREIGN DATABASE TOPOLOGY                          │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ ChurchCore (ChMS)  │ ChurchCore-LMS     │ ChurchCore-Academy (SIS)     │
│ [Database Silo 1]  │ [Database Silo 2]  │ [Database Silo 3]            │
│ 133 Tables (RLS)   │ 72 Tables (RLS)    │ 152 Tables (RLS)             │
│ • Members/Giving   │ • Courses/XP       │ • Grades/Transcripts         │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ ChurchCoreCare     │ ChurchCore-Orthos  │ FaithFullScholars            │
│ [Database Silo 4]  │ [Database Silo 5]  │ [Database Silo 6]            │
│ 84 Tables (RLS)    │ 28 Tables (RLS)    │ 48 Tables (RLS)              │
│ • Clinical/Therapy │ • Safeguard Audits │ • Scholar CVs/Confessions    │
├────────────────────┴────────────────────┴──────────────────────────────┤
│ ❌ ZERO BACKGROUND DATA SYNC BUS • ❌ ZERO SILENT CROSS-APP PROPAGATION│
│ 🔒 100% POSTGRESQL ROW-LEVEL SECURITY (RLS) BOUNDARY ON ALL TABLES     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Four Pillars of Sovereign Isolation

### I. The Clinical & Pastoral Zero-Knowledge Wall
* **The Legal Barrier:** Clinical therapy notes (`ChurchCoreCare`) are subject to strict HIPAA, state medical privacy, and clergy-penitent privilege laws.
* **Architectural Guarantee:** ChurchCoreCare's database is configured with **explicit deny-all RLS security policies** (`20260609000001_security_rls_deny_all_policies.sql`). Even if an administrator has super-admin rights in ChurchCore ChMS, they have **zero technical or cryptographic ability** to read counseling session notes or diagnostic history.

### II. The Educational FERPA/COPPA Wall
* **The Educational Barrier:** Student disciplinary records, accommodations, and academic grades in `ChurchCore-Academy` are legally protected under FERPA.
* **Architectural Guarantee:** ChurchCore-Academy records exist in sovereign tables (`academy_institutions`, `academy_gradebooks`). Church Sunday school volunteers in ChurchCore ChMS have zero visibility into a child's day-school academic files.

### III. Identity Federation Without Data Leakage
* **How ChurchCore ID Operates:** Single Sign-On (SSO) is purely an **Authentication Provider (IdP)**.
  - The IdP only verifies: *"Is this person who they say they are?"* (Email, Password Hash, MFA token, UUID).
  - The IdP **never stores or shares** application payloads (e.g., it does not know donation amounts, test grades, or counseling sessions).
  - When the user navigates from ChMS to LMS, the LMS only checks if the user's UUID possesses an active role in that specific LMS tenant.

### IV. Client-Facing Explicit Actions (No Silent Background Sync)
* If an institution explicitly requires data movement (e.g., an academy registrar wants to import church member family contacts into the school admissions pipeline):
  - **Rule:** This must be an **explicit, user-initiated, client-facing workflow** (e.g., the user clicks `Export/Import Directory`, reviews mapped fields, confirms consent, and clicks `Execute`).
  - **Rule:** We deliberately build **zero automated backend daemons** that move data silently in the background.

---

## 3. Threat Modeling & Attack Surface Defenses

| Threat Scenario | Attack Vector | ChurchCore Defense Architecture |
|---|---|---|
| **SQL Injection / App Vulnerability** | Attacker exploits a frontend bug in the public giving form. | **PostgreSQL RLS Boundary:** The database rejects any query outside the tenant's cryptographic scope, even if application code is breached. |
| **Privilege Escalation** | A church volunteer tries to view confidential counseling cases. | **Physical Database Separation:** ChurchCoreCare runs on an independent database instance; the volunteer's JWT possesses zero tokens for Care. |
| **Cross-Tenant Data Leak** | Multi-tenant query lacks a `tenant_id` filter. | **RLS Default-Deny:** Invariants enforced at the database migration layer automatically fail queries missing tenant context. |
| **Service-Role Bypass Exploits** | Rogue developer uses Supabase service-role key in client components. | **Linter & CI Build Gating:** Automated CI checks fail any commit containing service-role keys outside secured server actions. |
