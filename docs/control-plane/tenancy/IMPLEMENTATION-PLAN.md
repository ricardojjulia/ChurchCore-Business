# COUNCIL-2026-016 Implementation Plan: Fleet Tenancy, Uniform Signup & Subscriptions

- **Governing directive**: [COUNCIL-2026-016](../../council/COUNCIL-2026-016.md)
- **Status**: ACTIVE (started 2026-11-14)
- **Rule**: Dates are targets. The go-live gate is absolute: no app takes real customers or payment until the guard passes and its conformance test is green on `main`.
- **Tracking**: the guard's results feed the Compliance Matrix (`python3 scripts/fleet-tenancy-guard.py --fleet`). Self-reported acknowledgments do not count.

## Phase 0: Security remediation (immediate; target 2026-11-17)

No other feature work merges in an affected repository until its Phase 0 is complete.

| # | Repo | Work | Status |
|---|---|---|---|
| 0.1 | Orthos | Remove master passwords; hash passwords (scrypt); signed sessions; stop signup takeover and user-chosen roles; guard platform actions; remove global data wipe; production-gate demo users | [PR #44](https://github.com/ricardojjulia/ChurchCore-Orthos/pull/44) opened 2026-11-14 |
| 0.2 | ChMS | Provisioning never resets existing passwords; invite instead of shared passwords; no passwords printed or committed; remove hard-coded demo passwords; role not read from `user_metadata`; reserved slugs; ignore `*.vercel.app` hosts | [PR #284](https://github.com/ricardojjulia/ChurchCore/pull/284) opened 2026-11-14 |
| 0.3 | LMS | Delete legacy `/signup`; fail-closed CAPTCHA and rate limits in production; DB trigger protecting billing and lifecycle columns; webhook idempotency fix; production guard on destructive scripts | PR opened 2026-11-14 (branch `security/council-016-p0-lms`) |
| 0.4 | Business (control plane) | **Critical:** the middleware accepted any cookie shaped like a token and never checked its signature. That exposed `/api/repo-ops` (pushes to every fleet repo with `GITHUB_TOKEN`) and `/api/save-config` without authentication. There was also a built-in backdoor operator password and usernames, a default HMAC key, and a Supabase login that accepted any project user. Fixed with a signature-verifying middleware, fail-closed secret handling, a single configured operator credential, a Supabase email allow-list, and a session re-check on privileged actions | Fixed 2026-11-14 in this repo (commit with this directive) |
| 0.5 | LMS (added to 0.3) | Podcast feed HMAC default and reuse of the JWT secret; Mux signing fallback; hard-coded password in `reset-demo-data.mjs` | Added to the LMS PR |
| 0.6 | Orthos (added to 0.1) | `NEXT_PUBLIC_` AI-key fallbacks; passwords in stress and test scripts | Added to the Orthos PR |
| 0.7 | Care | Dev role header gated by an explicit flag (never on Vercel); dev seed requires a flag and a loopback DB; demo passwords from env, randomized on reset; Turnstile and rate limits on public signup before Stripe; provisioning status cannot be forced to `completed`; TLS verification on by default | PR in progress (branch `security/council-016-p0-care`) |
| 0.8 | Academy | Stop linking the tenant admin to the creating operator (invite plus claim instead); provisioning, deletion and other modules use one client per transaction | PR in progress (branch `security/council-016-p0-academy`) |
| 0.9 | FaithFull Scholars | Remove the open `institutions` INSERT for authenticated users; subscription-write error causes rollback | PR in progress (branch `security/council-016-p0-scholars`) |
| 0.10 | Owner | **Rotate credentials and force resets** (checklist below); merge and deploy 0.1–0.9 after CI passes | Pending owner |

**Owner credential checklist (Phase 0.10)**
0. **Business control plane (do first):**
   - Set `CONTROL_PLANE_SESSION_SECRET` (≥32 random characters), `CONTROL_PLANE_ADMIN_USERNAME`, `CONTROL_PLANE_ADMIN_PASSWORD` (≥12 characters) and, if Supabase login is used, `CONTROL_PLANE_OPERATOR_EMAILS` in Vercel *before* deploying. Without them, login is disabled (fail closed).
   - Rotate `GITHUB_TOKEN` and review its scopes, `CRON_SECRET` and `OPENROUTER_API_KEY`.
   - Review the commit and PR history of all fleet repos for pushes made through `/api/repo-ops` that you did not make.
1. **Orthos:** set `SESSION_SECRET` and `ORTHOS_PLATFORM_ADMIN_IDS` in Vercel *before* deploying the patch, otherwise production fails closed. Treat every Orthos password as compromised and force resets.
2. **ChMS:**
   - Rotate `ChurchCoreDemo2026!` and any password ever printed by `provision:tenant` or committed in `scripts/seed-*.mjs`.
   - Check whether any real (non-demo) user ever went through `provision:tenant`; if so, force a reset.
3. **LMS:** apply the protected-columns migration, and set the Turnstile and Upstash env vars in production.
4. **All repos:** rotate every live-looking secret listed in the scan report. Committed secrets stay in git history until it is rewritten, so rotation is mandatory.

## Phase 1: Control plane foundation (target 2026-11-21)

| # | Deliverable | Repo |
|---|---|---|
| 1.1 | Directive, spec (`fleet-tenancy.json`), signup spec, pricing schedule, audit evidence | Business (done 2026-11-14) |
| 1.2 | `scripts/fleet-tenancy-guard.py` (blocking, no default pass) with tests; enforcement engine treats BLOCKING requirements as NOT VERIFIED unless positively proven; manifest entry | Business (done 2026-11-14) |
| 1.3 | Fleet tenant registry: `fleet_tenants(fleet_tenant_id, product, app_tenant_id, slug, tenant_status, billing_status, plan, contract_ref, created_at)` plus an event ingest endpoint for audit and funnel events | Business |
| 1.4 | Provisioning orchestrator: console form → `POST /api/fleet/tenants` on the target app (HMAC client); status polling; retry | Business |
| 1.5 | `@churchcore/fleet-signup` package (ui, server, emails, billing) per the signup spec, published to GitHub Packages under the `@churchcore` scope, with versioned releases | Business |
| 1.6 | Stripe: one Product per app tier and monthly/annual Prices per the Pricing Schedule; webhook endpoint pattern; test-mode fixtures for conformance tests | Business + owner (Stripe dashboard) |
| 1.7 | Extend `activate-product-repos.py` to vendor `fleet-tenancy-guard.py`, `.fleet/fleet-tenancy.json` and the reserved-slug list into each repo; update the sync rule template | Business |
| 1.8 | Conformance-test harness template (Playwright + real Supabase/Postgres in CI) covering the 8 scenarios in REQ-016-10 | Business |

## Phase 2: Reference implementation (target 2026-12-05)

**Reference app: ChurchCore LMS.** It already has a verified-email self-serve flow, a lifecycle with an `expire-trials` function, RLS enforcement and a platform console.

Deliverables:
- add the `fleet_tenant_id` column
- implement `provisionTenant` as one `SECURITY DEFINER` RPC
- add `/api/fleet/tenants`
- adopt the fleet-signup package
- migrate plans `free|standard|premium` and `starter|growth|enterprise` → `starter|growth|pro`
- extend the trial from 14 to 30 days, with full features
- treat a trial as able to join (`/join`)
- schedule `expire-trials` and `purge-deleted-tenants`
- make purge cancel Stripe and remove orphaned identities
- write the `docs/pricing/TIER-MATRIX.md`
- **ship the conformance test, green**

FaithFull Scholars runs in parallel as the second implementation:
- move signup into one RPC
- restrict the open `institutions` INSERT policy
- audit and notify on approval decisions
- add Stripe
- retire institution `basic`

Note: Scholars' staff-approval step becomes a **post-provisioning verification badge**. Tenants start `active`/`trialing` immediately, and only the public "verified seminary" listing waits for staff review.

## Phase 3: Console-led apps (target 2026-12-19)

| App | Work |
|---|---|
| ChMS | Replace the CLI script with a transactional `provisionTenant`. Resolve the missing `church_settings` table and the `profiles` conflict. Unify `external_tenant_id` with the runtime church link and keep one `platform_admins` table. Enforce status in session resolution and RLS. Make delete and erase complete. Add self-serve via the fleet package. Add SaaS Stripe (today it only handles giving). |
| Academy | Run provisioning and deletion on one client. Give the customer admin their own identity plus an invite, and stop linking operators as tenant members. Enforce `lifecycle_status`. Add self-serve. Add FERPA/COPPA acknowledgment. Add SaaS Stripe with per-student limits. Fix the registry row for `metro-tech`. Make deletion safe (restrict FKs; preserve audit). |

## Phase 4: Rebuilds (target 2027-01-09)

| App | Work |
|---|---|
| Care | Rebuild signup on `provisionTenant`, with an invited or self-set owner. Move Stripe objects to after commit through the outbox, with no card at signup. Decide the database model (recommended: shared DB, `tenant_id` + RLS, and retire the unbuilt per-tenant-DB path). Fix the cron import. Enforce seat limits. Add webhook dedupe. Add the `grace_period_ends_at` column. Add BAA capture and CAPTCHA. |
| Orthos | Move tenant, user and session state from the in-memory store and `.users.json` onto Supabase Auth plus the existing `organizations`/`profiles`/`user_roles` schema (RLS already exists). Implement `provisionTenant`, the fleet API, self-serve, Stripe and entity limits. Remove the mock platform tenant list. |

## Phase 5: Go-live certification (rolling, per app)

An app is certified when **all** of the following hold:
1. `fleet-tenancy-guard.py` passes 9/9 on `main`.
2. The conformance test is green on `main`, and both checks are required by branch protection.
3. A control-plane end-to-end run: provision from the console → invite → login → convert in Stripe test mode → suspend → restore → archive → purge.
4. Phase 0 credentials have been rotated (owner confirmation recorded in the Compliance Matrix).

## Owner Decisions Recorded (2026-11-14)
- All apps self-serve; uniform flow and look and feel; 30-day full-feature trial; conversion to standardized paid tiers; all recommended steps adopted; directive adopted forthwith and non-bypassable; security fixed immediately.

## Open Items for the Owner (non-blocking for Phase 0–1)
1. Confirm or adjust the launch price points (Pricing Schedule §3), especially the extrapolated Orthos Pro and the Scholars Growth caps.
2. Fleet bundle pricing (Local Church Complete, etc.). These are Enterprise-only until a bundle schedule exists.
3. Enable branch protection with the required checks on all six repos (GitHub settings; the owner may delegate this).
