# Lessons Learned: Real-World Multi-App Fleet Governance with Autonomous AI

*Documenting battle-tested war stories, architectural failures, and counter-intuitive discoveries gained from governing multi-application production ecosystems.*

---

### Lesson 1: The "Infinite Directive Loop" is Real
* **The Failure**: We gave an autonomous AI coding agent an engineering directive to complete a feature in an edge repo. The agent finished it, committed clean code, and passed all tests. But in the next session, the central status document still showed the task as pending. The new agent spent 45 minutes re-implementing the same feature or disputing central authority.
* **The Fix**: Single-direction instructions are fatal. Directives must be **bidirectional**. When the edge finishes work, it must submit concrete evidence (`GIT_COMMIT_PROOF`), and the reconciler must mutate the edge instruction to advance the banner before the agent wakes up again.

---

### Lesson 2: Customer PII Contamination Must Be Architecturally Impossible
* **The Failure**: When debugging a production defect, developers and agents are tempted to dump raw database tables into error tickets or context windows to "reproduce" the issue.
* **The Fix**: You cannot rely on human vigilance or system prompts alone. We established **Section III: Zero Customer Data Propagation**. The JSON schemas for telemetry explicitly prohibit fields for data rows. Scripts only accept route names, HTTP codes, and stack trace fingerprints.

---

### Lesson 3: The Monorepo vs. Polyrepo Illusion
* **The Insight**: Many engineering teams believe switching to a monorepo solves governance. It doesn't. In a monorepo, autonomous agents often introduce cross-package circular imports, break global build caches, or touch shared utilities that break unrelated apps.
* **The AxiomSRE Approach**: Treat packages as **Sovereign Fleet Nodes** regardless of whether they live in separate git repos or a monorepo directory tree. Enforce explicit contracts between them.

---

### Lesson 4: HTTP Server Sockets on macOS / POSIX Environments
* **The Failure**: When serving the local control plane with Python's basic `socketserver.TCPServer`, rapid concurrent fetches (such as telemetry polling + LLM requests) caused socket hangs in `TIME_WAIT` on Darwin/macOS.
* **The Fix**: Always use `http.server.ThreadingHTTPServer` bound explicitly to `127.0.0.1`, set `allow_reuse_address = True`, and handle each request on a dedicated daemon thread. This ensures LLM deliberations (which may take 10–15 seconds) never block real-time telemetry polling.

---

### Lesson 5: Multi-Model Dialectic Councils Outperform Single-Prompt Chatbots
* **The Insight**: When asking an LLM "What do you think of this error?", it tends to be overly agreeable and suggests superficial patches.
* **The Fix**: The **Dialectic Council** structure creates an adversarial check:
  1. One model persona acts as the **Constitutional Auditor** (checking for data leaks and architectural purity).
  2. Another acts as the **SRE Reliability Engineer** (checking 99.99% availability, database index constraints, query latency).
  3. The synthesized output forces a binding decision: `FIX MANDATE`, `IMPLEMENT ACCEPTED`, or `FORMALLY DENIED`.

---

### Lesson 6: Zero Dependencies Equals Zero Regressions
* **The Insight**: We built the entire Control Plane core without React, Webpack, Vite, or external Python packages.
* **Why It Matters**: There is no `npm install` failure, no Python virtualenv path mismatch, and no broken dependencies. The server starts in 150ms on any machine with standard Python 3.8+ installed.
