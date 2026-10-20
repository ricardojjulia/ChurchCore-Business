# Edge Challenge: FaithFull Scholars, 2026-10-20

- **Filed by:** the FaithFull Scholars repository (`ricardojjulia/FaithFullScholars`), on the owner's instruction ("submit our most recent changes to council … challenge it").
- **Against:** manifest v1.2.1. COUNCIL-2026-005 and 006 (FaithFull rows), 007, 008 (REQ-008-01 and 02), 010, and this repository's `reconcile-governance-challenge.yml`.
- **Evidence base:** FaithFull Scholars `main` at `3ac7a71` (2026-10-20) and its canonical plan, `docs/FAITHFULL_SCHOLARS_FULL_PLAN.md` §24. Every claim below names a file, a command, or a live URL.
- **Status requested:** owner review. This PR is opened as a **draft** on purpose: see challenge 6.

## Latest FaithFull Scholars state (submission)

| Item (§24 Phase 1) | State |
|---|---|
| A1 Honest launch surface | Done (PRs #84–#87) |
| A2 Example data | Done (PRs #80–#83) |
| A3a Legal pages, acceptance records, contact, reset | Done (PRs #88, #89, #95) |
| A3b Consent before declared beliefs are published | Done (PR #96, ADR 0039) |
| A4 Production gates and observability | **A4a live** (PR #98, ADR 0040): a production build fails without both Turnstile keys and a 32-character rate-limit salt; sign-up's bot check fails closed. The Vercel build log shows `deploy-env: target=production OK`. **A4b (Sentry) deferred by the owner**, so A4 is not counted done. |
| WCAG AAA contrast (REQ-002-02) | Public pages done (ADR 0038); signed-in areas open |
| B2 email outbox; B3, B4 invitations; B5 deletion and export | Open |

- **Progress:** 4 of 10 Phase 1 items done (40%). Readiness was last scored at about 45/100 (Council Review 20, 2026-10-14) and has not been re-scored since.
- **Live:** `https://www.faithgrid.io` (HTTP 200) and `https://faith-full-scholars.vercel.app` both serve FaithFull Scholars.
- **Backups:** daily Supabase backups, 8 restore points observed. PITR is not enabled (the owner declined the cost).

## Challenges

### 1. COUNCIL-2026-005 §3 and 006 §3: the FaithFull row (re-filed; never reached Central)

The rows claim **85%**, with "monograph indexing interface", "peer-review editorial triage" and "AppSwitcher shell" as the remaining work. None of these is in the canonical plan, and the plan records 40% (above).

The edge challenge `CHAL-FAITHFULL-SCHOLARS-COUNCIL-005-ROW-20261018` has been `SUBMITTED` in the edge `docs/control-plane/challenges.json` since 2026-10-18. Central's `docs/control-plane/challenges.json` holds no FaithFull entry, so it was never received.

**Requested:** replace both rows with the table above, as was done for Academy in PR #2.

### 2. COUNCIL-2026-008 REQ-008-02: "readiness_score_pct is automatically set to 100" on any HTTP 200/3xx

A reachable URL proves the site is up. It does not prove readiness. FaithFull Scholars returns 200 today at about 45/100 readiness, with six Phase 1 items open.

The rule would write a false 100 and clear real blockers on every run. It also contradicts this repository's own Academy reconciliation note in COUNCIL-2026-005: "The control plane must not infer production readiness from a reachable Vercel URL."

**Requested:** a live probe may set only `is_online`, `vercel_status` and the URLs. It must never set `readiness_score_pct`, `completion_pct` or `phase`, and never clear `blockers`. Those come only from the edge's canonical plan. This PR amends REQ-008-02 in the manifest.

The rule is already code. Before this PR, Central's `scripts/report-telemetry.py`:
- set readiness to 100 and cleared blockers on any live probe, and also on `--online true` or `--vercel-url`;
- reported Supabase as "connected" because the website answered;
- hard-coded every product as `production` at 100% (FaithFull as `beta` at 92%), and `--auto` promoted any reachable product to those values.

This PR removes all of that. A new test (`test_report_telemetry_live_probe_keeps_readiness_and_blockers`) runs the script with a live probe in each mode and proves it leaves readiness, blockers, phase, completion and database status unchanged.

Follow-up: `axiomsre/edge-scaffolding/report-telemetry.py` is a separate copy that this PR does not change.

### 3. COUNCIL-2026-008 REQ-008-01: `"posttest": "… report-telemetry.py --auto || true"`

- `|| true` makes the hook unable to fail, so it reports nothing reliable.
- `--auto` rewrites a tracked file (`docs/control-plane/telemetry.json`) on every local and CI test run, which dirties the tree and invites unreviewed commits.
- Under REQ-008-02 as written, each run would also overwrite the honest readiness figure.

**Requested:** telemetry is reported at session close or after a merge (as `.agents/rules/churchcore-control-plane.md` already says), not from a test hook. FaithFull Scholars will not add the `posttest` hook. It keeps recording telemetry in reviewed PRs.

### 4. COUNCIL-2026-007: "Fortified FaithFull Community Ecosystem"

The source is `docs/deliberations/DELIB-SCHOLARS-COUNCIL-20261018-2262.md`, a single model-generated deliberation.

- **The council is fictional.** Its five "council members" (for example "Hon. Elizabeth Warren-Harding") are not real people. "Unanimous ratification" by them is not an owner decision.
- **It targets a schema FaithFull Scholars does not have.** It hardens `organizations`, `organization_members` and `profiles`; none exists in FaithFull Scholars' `supabase/migrations`. The product's tenancy is `institutions`, with the SECURITY DEFINER helpers `is_institution_admin` and `is_institution_owner` already in place and covered by `npm run audit:rls`. REQ-007-03 asks for an equivalent that already exists under the right name.
- **"Cryptographically enforce" is inaccurate.** The mechanism described is an RLS `WITH CHECK` subquery, which involves no cryptography.
- **The "sub-50ms Sunday SLA" was never measured.** No benchmark, no load test and no SLO exist in any repository.
- **`ON DELETE CASCADE` on an organization's owner** deletes the organization and everything under it when one profile is deleted. That is silent mass data loss presented as "integrity".
- **"Production-ready … Proceed with deployment"** bypasses FaithFull Scholars' gates: the story and brief approval, its own Council, pr-review, Copilot triage, CI and RLS proofs (`AGENTS.md`).
- **REQ-007-01** (pastors, churches, evangelists, councils) and **REQ-007-02** (a public monograph and peer-review index) each change the product's scope and audience. Under COUNCIL-2026-005 they are not Phase 1 MVP items. They need the owner's product decision and FaithFull's feature-factory (story, brief, ADR), not a dispatched mandate.

**Requested:**
- Mark COUNCIL-2026-007 `PROPOSED` (not `RATIFIED`), or scope it out of the FaithFull Phase 1 enforcement.
- Drop REQ-007-03 for FaithFull as satisfied by the `institutions` equivalents.
- Re-enter REQ-007-01 and 02 as candidate features for the owner's intake.

### 5. COUNCIL-2026-010: route every LLM call through OpenRouter

FaithFull Scholars calls Google Gemini's REST API directly in three places:
- `lib/ai/gemini-faculty-matcher.ts`
- `lib/ai/gemini-cv-extractor.ts`
- `lib/ai/gemini-syllabus-tagger.ts`

The matcher processes declared doctrinal data, now published only with the scholar's per-field consent (ADR 0039). The privacy policy (v3) names Google Gemini as the processor.

Routing the same data through OpenRouter adds a new processor and a new transfer. That needs:
- a privacy-policy revision (v4);
- an ADR;
- a data-handling review of OpenRouter, including whether `data_collection: "deny"` is honoured by every fallback model, which the directive does not establish.

Other problems with the directive:
- **The model list is dated.** It names, for example, `anthropic/claude-3.5-sonnet`.
- **Its use cases describe work that does not exist.** "Monograph semantic analysis" assumes the monograph index from challenge 4, which is not built.
- **The rate rule may conflict with existing limits.** FaithFull already enforces persistent rate limits (ADR 0026); the directive's "100 requests/hour" circuit breaker needs to be reconciled with them, not layered on top.

**Requested:** treat 010 as a cross-product proposal that each product adopts through its own ADR and privacy review, with no T+7 deadline. Until then, FaithFull keeps the direct Gemini integration that its users were told about.

### 6. `.github/workflows/reconcile-governance-challenge.yml`: auto-approve and auto-merge

On any PR touching `docs/council/**`, `docs/governance-sync/**`, `scripts/**` or `tests/**`, the workflow:
1. checks that two JSON files parse;
2. runs `python3 -m unittest discover tests` (8 tests today);
3. posts an APPROVE review saying the "challenge [is] ratified and certified for production";
4. merges the PR (`gh pr merge --auto --squash || gh pr merge --squash || echo …successfully`).

Any syntactically valid change to the fleet's governance, including this one, would therefore become "ratified" directive text with no human or council review. The final `echo` also reports success when the merge fails.

By FaithFull Scholars' own rule, a gate that passes without checking anything is worse than no gate (`AGENTS.md`, security-first discipline).

**Requested:**
- Remove the auto-merge step.
- Make the bot's review a COMMENT, not an APPROVE.
- Replace "ratified and certified for production" with what was actually checked: the JSON is valid and the tests pass.
- Require the owner's approval for changes to `docs/governance-sync/manifest.json`.

## What FaithFull Scholars will do meanwhile

- Keep following COUNCIL-2026-001 to 006 as reconciled.
- Not implement COUNCIL-2026-007, REQ-008-01's hook, REQ-008-02's readiness overwrite, or 010, pending the owner's ruling on this challenge.
- Record this challenge in the edge file `docs/control-plane/challenges.json`.
