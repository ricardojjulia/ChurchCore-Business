# ChurchCore Operations & Deployment Command Center

**Classification:** Operational Governance & Deployment Architecture  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Constitutional Invariant:** [Constitution Section III (Zero Data Propagation)](file:///Users/rjulia/ChurchCore-Business/docs/constitution/CONSTITUTION.md)  
**Status:** ACTIVE  
**Last Updated:** 2026-10-16  

---

## 📁 Operations Directory Navigation

```
docs/operations/
├── README.md                                                 # Operations Command Center Hub & Quick Links
├── 01-sovereign-database-isolation-and-security-architecture.md # Zero Data Propagation, Isolated Silos, RLS
├── 02-unified-ux-shell-and-app-switcher.md                   # 9-Dot App Switcher & Navigation Contract
├── 03-customer-onboarding-and-migration-playbook.md          # 14-Day Sprint to a Flawless First Sunday
├── 04-sunday-readiness-disaster-recovery-and-sla.md          # Sunday Peak Concurrency, PWA Offline, RTO/RPO
├── 05-cross-repo-governance-sync-and-dispatch-standard.md     # Cross-Repo Governance Sync & Dispatch
└── 06-vercel-firewall-emergency-mitigation-playbook.md       # Vercel Firewall as an Emergency Security Stopgap
```

---

## 🎯 Quick Links to Operational Blueprints

| Document | Operational Scope | Strategic Impact |
|---|---|---|
| **[Sovereign Database Isolation](file:///Users/rjulia/ChurchCore-Business/docs/operations/01-sovereign-database-isolation-and-security-architecture.md)** | Absolute database separation & zero background data propagation | Enforces our constitutional promise that user data never leaks across apps |
| **[Unified UX Shell & App Switcher](file:///Users/rjulia/ChurchCore-Business/docs/operations/02-unified-ux-shell-and-app-switcher.md)** | The 9-dot application switcher navigation shell | Delivers the seamless "Google Workspace" user experience without database coupling |
| **[Customer Onboarding Playbook](file:///Users/rjulia/ChurchCore-Business/docs/operations/03-customer-onboarding-and-migration-playbook.md)** | Step-by-step 14-day customer onboarding and migration | Ensures every new church experiences a triumphant first Sunday morning |
| **[Sunday Readiness & Disaster Recovery](file:///Users/rjulia/ChurchCore-Business/docs/operations/04-sunday-readiness-disaster-recovery-and-sla.md)** | Sunday 9am–12pm peak concurrency, PWA offline kiosk caching, RPO/RTO | Guarantees zero downtime during the golden 3 hours of Sunday worship |
| **[Vercel Firewall Emergency Mitigation](file:///Users/rjulia/ChurchCore-Business/docs/operations/06-vercel-firewall-emergency-mitigation-playbook.md)** | Block an exploitable request pattern at the edge (WAF custom rule, CLI or dashboard), verify it from outside, retire it after the code fix | Contains a live security defect within minutes while the real fix goes through Council and CI |

---

## 🔒 The Ironclad Operational Invariants

1. **Zero Automated Cross-App Data Propagation:** No background event bus, sync worker, or automated pipeline shall ever mirror user records between sovereign product databases. User data stays strictly in the product where it was intentionally entered.
2. **Friday 5 PM Code Freeze Covenant:** No production deployments, database migrations, or infrastructure alterations are permitted between Friday 5:00 PM EST and Monday 9:00 AM EST.
3. **The No-Hostage Offboarding Covenant:** 1-click unencrypted data export (`Export All Records`) is available to all church administrators at all times.
