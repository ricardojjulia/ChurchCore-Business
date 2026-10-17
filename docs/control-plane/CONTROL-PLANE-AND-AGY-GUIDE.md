# ChurchCore Sovereign Control Plane: Executive Operations Manual & AgY Playbook

> **"One Sovereign Brain to Govern the Fleet, Six Sovereign Databases to Protect the Flock."**  
> **Repository:** [ricardojjulia/ChurchCore-Business](https://github.com/ricardojjulia/ChurchCore-Business)  
> **Document Classification:** Central Operations Manual, AI Tutorial, and Strategic Charter  
> **Last Updated:** October 17, 2026  

---

## Table of Contents
1. [Our Sacred Mission, Vision & Strategic Direction](#1-our-sacred-mission-vision--strategic-direction)
2. [The Sovereign Control Plane Architecture](#2-the-sovereign-control-plane-architecture)
3. [The Invariant: Zero Cross-Application Data Propagation](#3-the-invariant-zero-cross-application-data-propagation)
4. [Live Fleet Status & Readiness Assessment](#4-live-fleet-status--readiness-assessment)
5. [How to Use the Executive Web Dashboard](#5-how-to-use-the-executive-web-dashboard)
6. [The Complete AgY CLI Tutorial & Mastery Guide](#6-the-complete-agy-cli-tutorial--mastery-guide)
7. [Day-to-Day Workflows & "Cheat Sheet" for the Operator](#7-day-to-day-workflows--cheat-sheet-for-the-operator)

---

## 1. Our Sacred Mission, Vision & Strategic Direction

### The Mission
To equip the global Church, Christian day schools, theological seminaries, pastoral counseling ministries, and denominational bodies with sovereign, enterprise-grade, ethically uncompromised digital infrastructure.

### The Problem We Solve
For decades, churches and Christian institutions have been trapped between two bad options:
1. Fragmented, consumer-grade software silos (Planning Center, Pushpay, Subsplash, Canvas, SimplePractice, FACTS) that charge exorbitant fees, lock away church data, and force staff to re-enter names and emails across disconnected tools.
2. Secular enterprise systems that disrespect ecclesial privacy, enforce hostile algorithmic policies, and monetize member relationships through data mining.

### The Solution: The ChurchCore Sovereign Ecosystem
ChurchCore provides a unified, beautifully designed software mesh across six specialized pillars:
- **ChurchCore ChMS** (`ChurchCore`): Membership, worship planning, giving, pastoral care, and volunteer scheduling.
- **ChurchCore LMS** (`ChurchCore LMS`): Discipleship, theological education, ministerial credentialing, and PWA mobile training.
- **ChurchCore Academy** (`ChurchCore Academy`): K-12 Christian Day School SIS, OneRoster 1.2 sync, bilingual grading, and homeschool cooperatives.
- **ChurchCore Care** (`ChurchCore Care`): Pastoral care case management, biblical counseling EHR, and HIPAA/clergy-penitent confidentiality.
- **ChurchCore Orthos** (`ChurchCore Orthos`): Financial safeguarding, fund accounting, denominational compliance, and audit trails.
- **FaithFull Scholars** (`FaithFullScholars`): Theological scholarship, peer-reviewed monographs, and academic faculty networks.

### The Vision for this Control Plane Repo (`ChurchCore-Business`)
`ChurchCore-Business` is **your permanent executive command center**. It is the single source of truth for:
- Corporate governance and constitutional invariants.
- Centrally imposed development roadmaps and sprint priorities.
- Real-time fleet health, Vercel deployments, and Supabase connections.
- Automated AI agent telemetry and error diagnostics.

Whenever you want to know what's happening across the entire software empire, **you come right here**.

---

## 2. The Sovereign Control Plane Architecture

The Control Plane coordinates the ecosystem through a **bidirectional flow**:

```
                           +-------------------------------------------------------+
                           |               CHURCHCORE-BUSINESS                     |
                           |             Executive Control Plane                   |
                           |                                                       |
                           |  * docs/constitution/ (7 Non-Negotiable Invariants)   |
                           |  * docs/council/ (Binding Decisions 001 - 004)        |
                           |  * docs/control-plane/CENTRAL-ROADMAP.md (Directives) |
                           |  * docs/control-plane/ECOSYSTEM-DASHBOARD.md (Status) |
                           |  * dashboard/ (Executive Mission Control Web App)     |
                           +---------------------------+---------------------------+
                                                       |
                                 DISPATCH              |      REPORT
                           Central Roadmaps &          |   Telemetry & Readiness
                           Governance Directives       |   (NO Member/Donor Data!)
                                                       |
         +--------------------+------------------------+-------------------+--------------------+
         |                    |                        |                   |                    |
+--------v-------+   +--------v-------+       +--------v-------+  +--------v-------+   +--------v-------+
| ChurchCore ChMS|   | ChurchCore LMS |       |ChurchCore Acad |  |ChurchCore Care |   |ChurchCore Orth |
| Next.js v3.5.0 |   | Next.js v0.47  |       | Next.js v0.10  |  | React/API v7.0 |   | Next.js v0.18  |
| Vercel/Supabase|   | Vercel/Supabase|       | Vercel/Supabase|  | Node/Supabase  |   | Vercel/Supabase|
+----------------+   +----------------+       +----------------+  +----------------+   +----------------+
```

### Inbound: How Products Report to the Control Plane
Every repository contains `docs/control-plane/telemetry.json` and `scripts/report-telemetry.py`. At the end of every coding session, the developer or AI agent runs:
```bash
python3 scripts/report-telemetry.py --model "gemini-2.5-pro" --duration 45 --summary "Fixed build error and updated schema"
```
This updates the product's telemetry file with:
- Online status (Vercel URL + Supabase project connection).
- Readiness score (0–100%) and blockers (if not yet in production).
- MVP progress phase and % complete.
- Last 5 git commits and immediate next sprint steps.
- Last AI model used, duration of session, operator name, and summary.
- Recent build/deployment errors and exact mitigations applied.

### Outbound: How the Control Plane Governs the Products
When you decide on a new strategic initiative, architectural standard, or sprint deadline in `ChurchCore-Business`:
1. It is documented in `docs/control-plane/CENTRAL-ROADMAP.md` and added to `docs/governance-sync/manifest.json`.
2. When any developer or AI opens any sibling repo, its pre-flight agent rule (`.agents/rules/churchcore-control-plane.md`) ingests the directive from GitHub raw endpoints.
3. The sibling repo incorporates the directive into its backlog and acknowledges completion in `docs/council/ACKNOWLEDGMENTS.md`.

---

## 3. The Invariant: Zero Cross-Application Data Propagation

> [!CAUTION]
> ### CONSTITUTIONAL INVARIANT (SECTION III)
> **Under NO circumstances will any customer, member, donor, student, counseling, or financial data be automatically synchronized or transferred between application databases.**

- **Why this exists**: In pastoral counseling (`ChurchCore Care`), notes must remain under strict clergy-penitent confidentiality. If a member's counseling records or sensitive benevolence giving were synced to the general ChMS or school system, it would violate institutional trust and HIPAA/clergy privilege.
- **How we do it instead**: Each product has its own isolated, dedicated Supabase PostgreSQL database with Row-Level Security (RLS). If a church uses both ChMS and LMS, their users sign into both with their own credentials, but the databases remain separate sovereign silos.
- **The Control Plane only touches metadata**: It tracks code versions, build health, Vercel URLs, and sprint roadmaps—**NEVER church member records.**

---

## 4. Live Fleet Status & Readiness Assessment

Here is the current audited status of our six sovereign platforms:

| Product | Version | Online Status | Vercel Deployment | Supabase State | Readiness | MVP Phase |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: |
| **ChurchCore ChMS** | `v3.5.0` | 🟢 ONLINE | [www.churchcore.io](https://www.churchcore.io) | Connected (Prod) | **94%** | `PRODUCTION` (92%) |
| **ChurchCore LMS** | `v0.47.0` | 🟢 ONLINE | [www.churchcorelms.io](https://www.churchcorelms.io)<br>`church-core-lms.vercel.app` | Connected (Prod) | **95%** | `BETA` (88%) |
| **ChurchCore Academy**| `v0.10.0` | ⚪ PILOT READY | [church-core-academy.vercel.app](https://church-core-academy.vercel.app) | Local only (Colegio Biblos Pilot) | **78%** | `PILOT_READY` (82%) |
| **ChurchCore Care** | `v7.0.0` | 🟢 ONLINE | [www.churchcorecare.io](https://www.churchcorecare.io)<br>`churchcore-care.vercel.app` | Connected (Prod) | **95%** | `PRODUCTION` (90%) |
| **ChurchCore Orthos** | `v0.18.0` | 🟡 PREVIEW | [church-core-orthos.vercel.app](https://church-core-orthos.vercel.app)| Staging Link | **85%** | `BETA` (85%) |
| **FaithFull Scholars**| `v0.1.0` | 🟢 ONLINE | [faith-full-scholars.vercel.app](https://faith-full-scholars.vercel.app)| Connected (Prod) | **90%** | `BETA` (85%) |

### What's Blocking the Remaining Staging Apps from Reaching 100% Online?
1. **ChurchCore Academy** (1 of 3 local Workstream C gates): Local preparation passed. The actual participant-browser login and real uncoached session remain. Hosted deployment is owner-deferred, not a control-plane blocker or authorization.
2. **ChurchCore Orthos** (85% Readiness): Awaiting binding of production Vercel environment variables to the Supabase cloud instance and execution of the `test:omni-council` compliance suite.

---

## 5. How to Use the Executive Web Dashboard

We built a custom, dark-mode, glassmorphic **Executive Mission Control UI** inside `dashboard/`.

### Starting the Dashboard
Run this one command from `ChurchCore-Business`:
```bash
python3 dashboard/serve.py
```
This serves the dashboard at **`http://localhost:3333`** and automatically opens it in your default web browser!

### Features of the Dashboard
1. **Fleet Health Banner**: Instant glance at total sovereign repos, production online count, average readiness, and data isolation verification.
2. **Product Fleet Grid**: Interactive cards for all 6 products with live status badges, Vercel links, readiness gauges, and an **Inspect** modal.
3. **Readiness Action Radar**: Deep dive into the exact blockers and next deployment steps for Academy, Care, and Orthos.
4. **Council Governance Matrix**: Table showing compliance with COUNCIL-2026-001 through 004 across all six platforms.
5. **AI Activity Stream**: Full log of recent AI sessions, model names (`gemini-2.5-pro`), durations, and deployment bug fixes.
6. **AgY Fleet Command Generator**: Select any repository and action (e.g., "Resolve Deployment Blockers") and click **Generate** to get an instant, copyable `agy` CLI command!

---

## 6. The Complete AgY CLI Tutorial & Mastery Guide

You installed **`agy v1.4.0`** at `/Users/rjulia/.local/bin/agy`. It is your local autonomous AI terminal companion.

### Why AgY is Incredible
`agy` is not just a chat window. It is an **agentic shell runner** that can:
- Open any repository on your machine.
- Read files, edit code, execute tests, and commit git changes autonomously.
- Run non-interactively in scripts, cron jobs, and CI/CD pipelines.

### Core AgY Commands Cheatsheet

| Command | What It Does | When to Use It |
| :--- | :--- | :--- |
| `agy` | Opens interactive agent session in current directory | When you want to chat, pair program, and brainstorm |
| `agy -c` (or `--continue`) | Resumes your most recent session | When you stopped work earlier and want to continue seamlessly |
| `agy -p "your prompt"` | **Print Mode (Non-Interactive)**: Runs prompt, makes edits, and exits | Great for quick one-line tasks or running via scripts |
| `agy --mode auto -p "..."` | Runs in fully autonomous mode | When you want the agent to do multiple steps on its own |
| `agy --add-dir "/path/to/repo"` | Adds an external folder to the agent's context | **Essential for multi-repo fleet orchestration!** |
| `agy --dangerously-skip-permissions` | Skips tool approval confirmation prompts | For automated batch runs where you don't want to press "yes" |
| `agy mcp list` | Lists active Model Context Protocol servers | To see what database, cloud, and filesystem tools are active |

### Real-World AgY Power Recipes

#### Recipe 1: Sync Fleet and Audit from the Terminal
From `ChurchCore-Business`:
```bash
python3 scripts/activate-product-repos.py
python3 scripts/control-plane-sync.py
agy -p "Read docs/control-plane/ECOSYSTEM-DASHBOARD.md and give me a 3-bullet executive summary of what needs my attention today."
```

#### Recipe 2: Dispatch AgY into a Sibling Repository
You don't even have to `cd` into the other folder! You can command it from right here:
```bash
agy --add-dir "/Users/rjulia/ChurchCore LMS" \
    --mode auto \
    -p "Read .agents/rules/council-governance-sync.md, run the repository-owned verification gates, and update telemetry only with verified facts"
```

#### Recipe 3: Fix Deployment Blockers in ChurchCore Academy
```bash
agy --add-dir "/Users/rjulia/ChurchCore Academy" \
    --mode auto \
    -p "Check docs/control-plane/telemetry.json and prepare the approved local participant-login and uncoached-session gate without authorizing deployment."
```

---

## 7. Day-to-Day Workflows & "Cheat Sheet" for the Operator

Whenever you sit down to work on ChurchCore, here is your 3-step routine:

### Step 1: Open the Control Plane & View Fleet Status
```bash
cd /Users/rjulia/ChurchCore-Business
python3 dashboard/serve.py
```
*(Check `http://localhost:3333` to see which products are green and which have blockers).*

### Step 2: Refresh Fleet Telemetry
Whenever changes are made in any sibling repo, update the control plane with:
```bash
python3 scripts/control-plane-sync.py
```
*(This re-reads all 6 repos and updates both the markdown dashboard and the web UI).*

### Step 3: Run AI Sessions with Confidence
Whether you use Antigravity IDE, Claude Code, Cursor, or `agy` CLI:
- **At session start**: The agent reads the Control Plane manifest and roadmap.
- **At session end**: The agent runs `python3 scripts/report-telemetry.py` to record its model, duration, and bug fixes.
- **Your rule is safe**: Customer data is NEVER copied across databases.

---

### In Summary: You Are in Complete Control
You now have a central executive command center (`ChurchCore-Business`), an automated edge telemetry engine running across all 6 sibling repos, an interactive mission control web dashboard, and the full power of the `agy` CLI. 

Whenever you need a refresher, just open this file!
