# Sovereign Deliberation Record: Universal OpenRouter AI Gateway & Sustainable Model Evaluator Standard

**Deliberation ID:** `DELIB-GRAND-HIGH-COUNCIL-20261019-AI-GATEWAY`  
**Date (UTC):** 2026-10-19 21:00:00 UTC  
**Council Session:** Plenary Session of the High Sovereign Grand Council  
**Presiding Body:** Office of the Chief Architect & Sovereign Control Plane Authority  
**Quorum:** Unanimous Ratification  
**Ratified Directive:** [`COUNCIL-2026-010`](../council/COUNCIL-2026-010.md)  

---

## 1. Context & Motivation

As artificial intelligence capabilities become deeply embedded across all ChurchCore software pillars (Shepherd AI in ChMS, Trinity SpeedGrader in LMS, Colegio Biblos bilingual tutor in Academy, Clinical Soul-Care triage in Care, Omni-Council safeguarding auditor in Orthos, and Confessional Credo matching in FaithFull Scholars), the ecosystem faces significant architectural divergence risks:
1. Fragmented API keys, client dependencies, and proprietary vendor lock-in.
2. Inefficient model routing where expensive, high-latency frontier reasoning models are called for basic autocomplete or utility extraction, rapidly burning through church operational budgets.
3. Lack of fallback cascades leading to fragile single-vendor outage susceptibility during Sunday morning peak worship services.
4. Risks of data leakage into public frontier model training sets without unified zero-retention compliance flags.

---

## 2. Council Findings & Invariants

The Grand Council decrees the following architectural invariants:

### Finding 1: The Gateway Invariant
All six product pillars and the control plane must terminate LLM requests at **OpenRouter** (`https://openrouter.ai/api/v1/chat/completions`). By standardizing on OpenRouter, the ecosystem gains:
- Universal multi-model failover cascades (Google Gemini, Anthropic Claude, Meta LLaMA, DeepSeek, Mistral).
- Granular per-request data privacy (`data_collection: "deny"`).
- Consistent billing, token monitoring, and central telemetry visibility.

### Finding 2: The Model Evaluator Standard (Truthness ⚔️ Efficiency & Sustainability)
The Council mandates that model selection cannot be static or arbitrary. Each application must implement an **Intelligent Model Evaluator** that scores the task:
- **High Truthness & Doctrinal Integrity:** Required for theology, safeguarding compliance, clinical charts, and student transcripts. Route to Tier 1 (`google/gemini-2.5-pro`, `anthropic/claude-3.5-sonnet`, `deepseek/deepseek-r1`).
- **High Efficiency & Cost Sustainability:** For high-throughput Sunday morning workflows, user drafting, notifications, and query processing. Route to Tier 2 (`google/gemini-2.5-flash`, `meta-llama/llama-3.3-70b-instruct`).
- **Ultra-Low Cost Fast Triage:** For search filtering, tag extraction, and sentiment checks. Route to Tier 3 (`google/gemini-2.5-flash-lite`, `meta-llama/llama-3.1-8b-instruct`).

Frontier reasoning models must be leveraged judiciously, backed by token caps, tenant circuit breakers, and cost budgeting.

---

## 3. Ratified Directives (`COUNCIL-2026-010`)

1. **`REQ-010-01` (Universal Gateway Consolidation):** All LLM calls must target `https://openrouter.ai/api/v1/chat/completions` using `OPENROUTER_API_KEY`.
2. **`REQ-010-02` (Sovereign Model Evaluator):** Implement a model evaluator module routing tasks across Tier 1 (Truthness), Tier 2 (Efficiency), and Tier 3 (Economy).
3. **`REQ-010-03` (Cost & Sustainability Guardrails):** Enforce `max_tokens`, ordered fallback model lists, token logging, and rate limit circuit breakers.

---

## 4. Execution Directives for Edge Repositories

Each edge repository is hereby instructed to:
1. Add `OPENROUTER_API_KEY` to `.env.example` and production environment secrets.
2. Replace direct vendor SDK imports (`openai`, `@anthropic-ai/sdk`) with a lightweight OpenRouter client (`fetch` / standard OpenAI-compatible client pointed at `https://openrouter.ai/api/v1`).
3. Wire the model evaluator into the core AI service layer.
4. Record acknowledgment and compliance status in `docs/council/ACKNOWLEDGMENTS.md` under `COUNCIL-2026-010`.
