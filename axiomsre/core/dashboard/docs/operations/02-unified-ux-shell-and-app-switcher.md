# Unified UX Shell & The 9-Dot App Switcher Architecture

**Classification:** Front-End Architecture & Design Contract  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Status:** ACTIVE DESIGN CONTRACT  
**Last Updated:** 2026-10-16  

---

## 1. Executive Summary: The "Google Workspace / Atlassian" Experience

While our underlying databases remain **completely sovereign and isolated**, the human user experience must feel cohesive, fluid, and unified. A pastor or administrator should never feel like they are being bounced across disjointed, clunky web products with different aesthetics.

ChurchCore achieves this via the **Unified UX Shell**: a shared, lightweight frontend navigation shell embedded across all six product suites.

```
┌────────────────────────────────────────────────────────────────────────┐
│ [ChurchCore Logo]  [Church Name ▼]              [🔍 Cmd+K] [⠁⠁⠁] [Avatar]│
├────────────────────────────────────────────────────────────────────────┤
│                                                ▲                       │
│                                                │                       │
│                         ┌──────────────────────┴──────────────────────┐│
│                         │        THE 9-DOT APP SWITCHER MENU          ││
│                         ├─────────────────────────────────────────────┤│
│                         │ 🏛️ ChurchCore (ChMS & Operations)          ││
│                         │ 🎓 ChurchCore-LMS (Discipleship & Courses)  ││
│                         │ 🏫 ChurchCore-Academy (SIS & Day-School)    ││
│                         │ 🩺 ChurchCoreCare (Pastoral Counseling)     ││
│                         │ 🛡️ ChurchCore-Orthos (Governance Auditing)  ││
│                         │ 📜 FaithFullScholars (Higher-Ed Network)    ││
│                         └─────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Implementation: The Embedded Header Contract

The Unified Header is deployed as a lightweight React/Next.js shared package (`@churchcore/ux-shell`) across each codebase:

### Key Components of the Shell:
1. **Master Identity Badge (Top Left):**
   - Displays the church or institution's custom branding alongside the subtle, mandatory *"Powered by ChurchCore"* trust mark.
2. **Global Command Palette (`Cmd + K`):**
   - Instant search across the current application's scope (e.g. searching members in ChMS, searching courses in LMS, searching students in Academy).
3. **The 9-Dot App Switcher (Top Right):**
   - Displays available ChurchCore applications based on the user's active tenant subscriptions and cryptographic role entitlements.
   - 1-click seamless navigation via secure OAuth/OIDC handoff tokens without requiring the user to re-enter their password.
4. **User Profile & Step-Up Security Menu:**
   - Account settings, MFA management, and step-up biometric/PIN verification when entering sensitive modules like `ChurchCoreCare`.

---

## 3. Preserving Sovereign Isolation in the Frontend

To honor our **Zero Cross-Application Data Propagation Principle**:
* The 9-Dot App Switcher **does not fetch or preload data** from the other applications.
* It only checks the user's authenticated ChurchCore ID claims: *"Does User UUID `X` have an assigned seat in ChurchCore-LMS for Tenant `Y`?"*
* If yes, the icon displays active; clicking it opens the target application in its sovereign domain with an authorized session.
* If no, a subtle lock icon displays with an optional upgrade prompt for administrators.

---

## 4. Visual Cohesion Tokens Across All 6 Apps

Every product in the suite adheres to the unified design tokens codified in [Brand Guidelines](file:///Users/rjulia/ChurchCore-Business/docs/marketing/brand-and-voice/01-brand-guidelines-and-messaging.md):
* **Typography:** `Inter` for crisp body copy; `Outfit` / `Inter Display` for headings.
* **Border Radii & Elevation:** Consistent 8px / 12px card rounded corners with subtle glassmorphic backdrop filters (`backdrop-blur-md`).
* **Micro-Interactions:** Consistent hover transitions (150ms ease-in-out) and unified notification toast styling.
