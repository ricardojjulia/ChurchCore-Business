# ChurchCore Sovereign Control Plane: Architecture & AI Connection Specification

## 1. Executive Summary

`ChurchCore-Business` serves as the **Executive Control Plane & Governance Brain** for the entire ChurchCore software ecosystem. The six constituent products—ChurchCore ChMS, ChurchCore LMS, ChurchCore Academy, ChurchCore Care, ChurchCore Orthos, and FaithFull Scholars—operate as sovereign, autonomous applications. 

The Control Plane coordinates ecosystem governance, deployment readiness, development roadmaps, and AI session history across all products while strictly upholding **Section III of the ChurchCore Constitution: Zero Cross-Application Data Propagation**.

```mermaid
flowchart TD
    subgraph ControlPlane ["🏛️ CHURCHCORE SOVEREIGN CONTROL PLANE (Hub)"]
        direction TB
        CP_DOCS["📜 docs/constitution/ (Invariants)<br>⚖️ docs/council/ (Binding Decisions)<br>🧭 docs/control-plane/CENTRAL-ROADMAP.md (Directives)<br>📊 docs/control-plane/ECOSYSTEM-DASHBOARD.md (Live Status)<br>🛡️ docs/control-plane/EVIDENCE-RECONCILIATION-LEDGER.md<br>🖥️ dashboard/ (Port 3333 Glassmorphic Cockpit)"]
    end

    subgraph DirectivesFlow ["Directionality & Enforcement"]
        direction LR
        DISPATCH["⚡ DISPATCH DIRECTIVES<br>(Central Roadmap & Architectural Directives)"]
        REPORT["📡 TELEMETRY & PROOFS<br>(Autonomous Telemetry & Cryptographic Challenges)"]
        INVARIANT["🛡️ CONSTITUTION SECTION III<br>Zero Customer/Member/Donor Data Propagation"]
    end

    ControlPlane --> DISPATCH
    REPORT --> ControlPlane

    subgraph EdgeFleet ["Sovereign Fleet Repositories (Autonomous Applications)"]
        direction TB
        subgraph P1 ["ChurchCore ChMS"]
            C1["Next.js v3.5.0<br>🌐 www.churchcore.io<br>🗄️ Supabase prod-chms-db<br>🛡️ 133 Tables • RLS Enforced"]
        end
        subgraph P2 ["ChurchCore LMS"]
            C2["Next.js v0.47.0<br>🌐 www.churchcorelms.io<br>🗄️ Supabase prod-lms-db<br>🛡️ 72 Tables • RLS Enforced"]
        end
        subgraph P3 ["ChurchCore Academy"]
            C3["Next.js v0.10.0<br>🌐 church-core-academy.vercel.app<br>🗄️ Local (Colegio Biblos Pilot)<br>🛡️ 152 Tables • RLS Enforced"]
        end
        subgraph P4 ["ChurchCore Care"]
            C4["React 18 / Express v7.0.0<br>🌐 www.churchcorecare.io<br>🗄️ Supabase prod-care-db<br>🛡️ 84 Tables • Deny-All RLS"]
        end
        subgraph P5 ["ChurchCore Orthos"]
            C5["Next.js v0.18.0<br>🌐 church-core-orthos.vercel.app<br>🗄️ Supabase Staging Link<br>🛡️ 28 Tables • RLS Enforced"]
        end
        subgraph P6 ["FaithFull Scholars"]
            C6["Next.js v0.1.0<br>🌐 faith-full-scholars.vercel.app<br>🗄️ Supabase prod-scholars-db<br>🛡️ 48 Tables • pgvector"]
        end
    end

    DISPATCH --> P1 & P2 & P3 & P4 & P5 & P6
    P1 & P2 & P3 & P4 & P5 & P6 --> REPORT

---

## 2. Inbound vs Outbound Control Flows

### Inbound Flow: Edge Telemetry -> Control Plane
Every product repository independently collects and publishes its status via `docs/control-plane/telemetry.json`. This telemetry contains:
1. **Online & Deployment Status**:
   - Vercel live URL and deployment environment (`production`, `preview`, `local_only`).
   - Supabase connection status (`connected`, `pending`, `local_only`).
   - If not online, a comprehensive **Readiness Assessment** detailing exact blockers, missing variables, and next required deployment actions.
2. **MVP Status & Progress**:
   - Current stage (`alpha`, `beta`, `pilot_ready`, `production`).
   - Development completion percentage.
   - Latest functional milestones delivered.
3. **Session & Development Activity**:
   - Latest git commits and functional changes.
   - Immediate next engineering steps.
4. **AI / LLM Session Telemetry**:
   - The specific AI model that last worked on the codebase (e.g., `gemini-2.5-pro`, `claude-3-7-sonnet`, `gpt-4o`).
   - Session duration (minutes/hours) and session completion timestamp.
   - Summary of code artifacts produced or modified.
5. **Deployment Errors & Mitigations**:
   - Errors encountered during builds, migrations, or deployments (e.g., Turbopack use-server sync errors, Cloudflare Turnstile CSP blocks, RLS migration locks).
   - Exact mitigations, patches, or architectural workarounds applied.

### Outbound Flow: Control Plane -> Edge Product Repositories
`ChurchCore-Business` exercises central executive authority through:
1. **Central Roadmaps & Sprints (`docs/control-plane/CENTRAL-ROADMAP.md`)**:
   - Imposing new cross-cutting requirements (e.g., Brand House compliance, unified UX shell switcher, Sunday SLA guarantees).
   - Assigning sprint priorities and delivery dates for each product.
2. **Council Decisions (`docs/council/COUNCIL-*.md`)**:
   - Binding governance decrees requiring formal acknowledgment in each product's `docs/council/ACKNOWLEDGMENTS.md`.
3. **Automated Manifest Publishing (`docs/governance-sync/manifest.json`)**:
   - Machine-readable manifest distributed to edge repos via GitHub raw endpoints and local sync scripts.

---

## 3. How to Permanently Connect the AI (Antigravity & Others) to the Control Plane

To enable seamless, permanent AI interaction where the agent and the operator can query status, review blockers, and impose directives across all repos, four complementary connection mechanisms are established:

### Pattern 1: The Repository Agent Rule (Session Lifecycle Hooks) — *Active & Universal*
- **Mechanism**: Every product repository contains `.agents/rules/control-plane-telemetry.md` and an entry in `AGENTS.md`.
- **How it works**:
  - **At Session Start**: Any AI agent (Antigravity, Claude Code, Cursor, Copilot) is commanded by its system rules to fetch the latest directives from `ChurchCore-Business/main/docs/governance-sync/manifest.json` and `CENTRAL-ROADMAP.md`.
  - **At Session End**: The agent is commanded to execute `python3 scripts/report-telemetry.py` or commit an updated `docs/control-plane/telemetry.json` recording its model identity, session duration, changes, deployment errors, and mitigations.
- **Why this works**: Works across all IDEs and CLI tools without requiring external server infrastructure.

### Pattern 2: Control Plane CLI & Aggregator (`scripts/control-plane-sync.py`) — *Active*
- **Mechanism**: A unified Python CLI in `ChurchCore-Business` that can be run on-demand or inside Antigravity sessions:
  ```bash
  python3 scripts/control-plane-sync.py --mode=all
  ```
- **How it works**:
  - Ingests telemetry from all 6 local sibling repositories (with automated fallback to GitHub API/raw URLs for remote execution).
  - Validates every telemetry file against `telemetry-schema.json`.
  - Automatically compiles and overwrites `docs/control-plane/ECOSYSTEM-DASHBOARD.md`.
  - Updates `docs/governance-sync/COMPLIANCE-MATRIX.md`.

### Pattern 3: Custom Antigravity MCP Server (`churchcore-control-plane-mcp`) — *Next Phase*
- **Mechanism**: An MCP server configured in `~/.gemini/antigravity-ide/mcp/churchcore-control-plane/` that exposes specialized tools directly to the Antigravity assistant:
  - `get_ecosystem_status(product_id?)`: Returns live Vercel/Supabase health, MVP progress, and recent AI sessions.
  - `dispatch_central_directive(target_repos, directive_text, deadline)`: Writes new directives into `CENTRAL-ROADMAP.md` and bumps `manifest.json`.
  - `record_session_telemetry(...)`: Directly logs agent session work into the control plane.
- **Why this works**: The AI can query ecosystem status mid-conversation without executing shell commands manually.

### Pattern 4: GitHub Action Webhook / Push Dispatcher — *CI/CD Continuous Sync*
- **Mechanism**: A GitHub Actions workflow in each product repository (`.github/workflows/telemetry-report.yml`) triggers on every merge to `main`.
- **How it works**:
  - Uses a repository secret `CHURCHCORE_CONTROL_PLANE_PAT` to dispatch a repository dispatch event (`control-plane-telemetry-update`) or open a PR/commit to `ricardojjulia/ChurchCore-Business`.
  - Keeps the central dashboard updated in real-time even when developers work outside local IDE sessions.

---

## 4. The Sacred Sovereignty Invariant: No Customer Data Propagation

> [!CAUTION]
> **CONSTITUTIONAL INVARIANT (SECTION III)**: Under no circumstances may any telemetry file, control plane script, GitHub action, or AI prompt ingest, extract, serialize, or transmit customer or church database records (e.g., member names, donation histories, pastoral notes, student transcripts, or counseling sessions).
> 
> The Control Plane manages **software engineering metadata, deployment health, governance compliance, and sprint directives only**. Customer data remains exclusively within each product's sovereign, RLS-enforced database instance.

---

## 5. Summary of Control Plane Assets

| Path | Purpose |
| :--- | :--- |
| [`dashboard/`](file:///Users/rjulia/ChurchCore-Business/dashboard/) | Executive Mission Control Web UI (Port 3333 Cockpit) |
| [`docs/control-plane/ARCHITECTURE.md`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/ARCHITECTURE.md) | Complete architectural model & AI connection strategy |
| [`docs/control-plane/CONTROL-PLANE-AND-AGY-GUIDE.md`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/CONTROL-PLANE-AND-AGY-GUIDE.md) | Master Operations Manual & AgY CLI Tutorial |
| [`docs/control-plane/EVIDENCE-RECONCILIATION-LEDGER.md`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/EVIDENCE-RECONCILIATION-LEDGER.md) | Autonomous Edge Challenge & Proof Reconciliation Ledger |
| [`docs/control-plane/telemetry-schema.json`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/telemetry-schema.json) | JSON Schema for edge telemetry payloads |
| [`docs/control-plane/TELEMETRY-SPEC.md`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/TELEMETRY-SPEC.md) | Specification & instructions for developers & agents |
| [`docs/control-plane/CENTRAL-ROADMAP.md`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/CENTRAL-ROADMAP.md) | Central executive sprint directives and roadmaps |
| [`docs/control-plane/ECOSYSTEM-DASHBOARD.md`](file:///Users/rjulia/ChurchCore-Business/docs/control-plane/ECOSYSTEM-DASHBOARD.md) | Master live status board across all 6 products |
| [`scripts/activate-product-repos.py`](file:///Users/rjulia/ChurchCore-Business/scripts/activate-product-repos.py) | Auto-installs rules, telemetry scripts, and initializes edge repos |
| [`scripts/control-plane-sync.py`](file:///Users/rjulia/ChurchCore-Business/scripts/control-plane-sync.py) | Ingests edge telemetry and compiles the master dashboard |
| [`scripts/pull-and-enforce-directives.py`](file:///Users/rjulia/ChurchCore-Business/scripts/pull-and-enforce-directives.py) | Edge directive enforcement & verification engine |
| [`scripts/challenge-central-record.py`](file:///Users/rjulia/ChurchCore-Business/scripts/challenge-central-record.py) | Autonomous cryptographic edge challenge CLI |
