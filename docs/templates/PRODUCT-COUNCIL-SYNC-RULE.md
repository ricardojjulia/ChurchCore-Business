# AI Rule: Cross-Repo Council Governance & Directive Synchronization

**Context:** This software repository is an official product pillar of the **ChurchCore Ecosystem**.  
**Central Governance Source:** [ricardojjulia/ChurchCore-Business](https://github.com/ricardojjulia/ChurchCore-Business)  
**Remote Manifest URL:** `https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/governance-sync/manifest.json`  

---

## 1. Mandatory Session Pre-Flight Check

At the beginning of **EVERY development, refactoring, or maintenance session** in this repository, you must execute the following Council Pre-Flight sequence:

### Step 1: Fetch the Central Governance Manifest
Fetch the central manifest using curl, gh CLI, or HTTP:
```bash
curl -s https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Business/main/docs/governance-sync/manifest.json
# (Or read from local sibling /Users/rjulia/ChurchCore-Business/docs/governance-sync/manifest.json if available)
```

### Step 2: Filter Active Directives for This Repository
1. Identify the name of this repository (e.g., `ChurchCore`, `ChurchCore-LMS`, `ChurchCore-Academy`, `ChurchCoreCare`, `ChurchCore-Orthos`, `FaithFullScholars`).
2. Search `decisions` in the manifest where `status == "RATIFIED"` and `impacted_products` contains this repository's name.
3. Extract all active `requirements` (`req_id`, `title`, `description`, `verification`).

### Step 3: Audit Local Compliance State
Inspect this repository's local ledger:
- Check `docs/council/ACKNOWLEDGMENTS.md` (or check codebase directly if acknowledgment file does not yet exist).
- For each requirement:
  - If **UNACKNOWLEDGED** or **PENDING**:
    - Alert the user immediately: *"Council Directive [ID]: [Requirement Title] is active and pending implementation."*
    - Prioritize its implementation or incorporate required changes into the current session.

---

## 2. Upstream Acknowledgment Protocol (Closing the Loop)

When a Council requirement is implemented, verified, and passes tests:
1. Append or update the formal acknowledgment entry in `docs/council/ACKNOWLEDGMENTS.md` using the standard format:

```markdown
### Acknowledgment: [COUNCIL-ID] / [REQ-ID] - [Title]
- **Status:** IMPLEMENTED & VERIFIED
- **Date:** [YYYY-MM-DD]
- **Implemented By:** [Agent / User]
- **Git Commit / PR:** [Commit Hash or PR #]
- **Verified Surfaces:** [List exact files, components, or routes modified]
- **Test Evidence:** [Command executed, e.g., `npm run test` or `audit:rls` passing with 0 errors]
```

2. Commit and push the acknowledgment alongside your code changes.

---

## 3. Strict Sovereign Invariant (Zero Cross-App Data Propagation)
Under **Council Directive COUNCIL-2026-001 (REQ-001-02)**:
* You are strictly forbidden from implementing background sync daemons, automated event buses, or silent cross-database replication with sibling product repositories.
* All data entered into this product remains 100% sovereign to this application database.
