# INQ-2026-001: Architectural & Strategic Model for Unified Identity ("ChurchCore ID")

**Status:** RESOLVED (Incorporated into COUNCIL-2026-001)  
**Date Initiated:** 2026-10-16  
**Lead Investigator:** 🏛️ The Portfolio Architect & 🛡️ The Security & Trust Officer  
**Topic Domain:** Architecture, Identity & Tenant Privacy  
**Outcome Document:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  

---

## 1. The Core Question / Dilemma
How do we provide a seamless single sign-on experience ("ChurchCore ID") across all 6 applications (e.g. a pastor who preaches in ChurchCore, studies in ChurchCore-LMS, manages school trustees in ChurchCore-Academy, and attends counseling in ChurchCoreCare) without creating a centralized database honeypot or leaking sensitive counseling/disciplinary data across tenants?

---

## 2. Context & Background
Users currently have separate database credentials and auth tables across different Supabase instances. If we unify identity incorrectly, a vulnerability in a church portal could expose clinical counseling records or student grades. If we do not unify identity, users face password fatigue, disjointed mobile apps, and administrative chaos.

---

## 3. Specialist Personas Analysis & Perspectives

### 🏛️ The Portfolio Architect
*Recommends an OAuth 2.0 / OIDC Identity Provider (IdP) layer.* The ChurchCore ID service handles only authentication (Email, Password, Passkey, MFA, Global User UUID). It issues cryptographically signed JWTs containing user claims and tenant authorizations. Each individual product remains sovereign over its own database and checks the JWT against its local Row-Level Security policies.

### 🛡️ The Security & Trust Officer
*Demands Zero-Knowledge Separation for Clinical & Pastoral Records.* Even if a user logs in with ChurchCore ID, accessing `ChurchCoreCare` must require a step-up biometric check or isolated PIN. The client counseling database must store records keyed to an opaque client ID rather than the global church member ID.

### 🧭 The Product Strategist
*Emphasizes the "App Switcher" experience.* Similar to Google Workspace or Atlassian (Jira/Confluence), once a pastor is logged in, a crisp top-right 9-dot grid icon allows 1-click switching between ChurchCore ChMS, LMS Discipleship, Academy SIS, and Orthos Governance based on their assigned roles.

### 💰 The Commercial Modeler
*Highlights enterprise seat monetization.* Single Sign-On (SSO) and centralized identity management is a massive enterprise feature that allows us to charge premium rates ($50k+/yr) to regional dioceses and multi-campus networks who demand SAML/Okta integration.

---

## 4. Evaluated Options Matrix

| Option | Architecture Pattern | Security Posture | User Experience | Implementation Complexity |
|---|---|:---:|:---:|:---:|
| **Option 1: Single Giant Monolith Database** | Merge all 517 tables into 1 database | **DANGEROUS** (RLS leak risks) | High | Extremely High / Fragile |
| **Option 2: Isolated DBs + Central OIDC IdP** | Federated JWT / OIDC Auth Provider | **OPTIMAL** (Cryptographic boundaries) | Excellent | Medium |
| **Option 3: Siloed Independent Auth** | Keep all apps completely separate | High | Poor (Password fatigue) | Low |

---

## 5. Deliberation Synthesis & Resulting Outcome

* **Resolution Decision:** Adopt **Option 2 (Central OIDC Identity Provider with Sovereign Databases)**.
* **Key Invariants:**
  1. The Auth IdP only stores: `user_id`, `email`, `password_hash`, `mfa_factors`, `name`, `avatar_url`.
  2. No ministry data, giving amounts, grades, or counseling notes are ever stored in the IdP.
  3. Step-up authentication is mandatory when accessing `ChurchCoreCare`.
  4. Enterprise customers can federate ChurchCore ID with their custom Microsoft 365, Google Workspace, or Okta domains.
