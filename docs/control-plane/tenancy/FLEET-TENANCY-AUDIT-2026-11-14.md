# Fleet Tenancy Audit: 2026-11-14 (Evidence for COUNCIL-2026-016)

- **Audit Date**: 2026-11-14
- **Status**: `EVIDENCE`. This is the pre-ratification audit. The binding requirements are in [COUNCIL-2026-016](../../council/COUNCIL-2026-016.md), which supersedes the "Proposed Requirements", "Rollout" and "Open Decisions" sections below. The owner resolved those decisions on 2026-11-14 (all apps self-serve, uniform flow, 30-day full-feature trial, standardized paid tiers).
- **Impacted Repositories**: ChurchCore-Business (control plane), ChurchCore (ChMS), ChurchCore-LMS, ChurchCore-Academy, ChurchCoreCare, ChurchCore-Orthos, FaithFullScholars

---

## I. Executive Summary

The tenant-creation path was traced through the code (not the docs) in all six member apps on 2026-11-14. **No app can take a paying customer from sign-up to a working admin login without manual intervention**, and each app creates tenants in a different way:

| App | Tenant is called | How tenants are created today | Atomic? | Customer admin can log in? | Billing wired? | Suspension enforced? | Control-plane link |
|---|---|---|---|---|---|---|---|
| ChMS | `churches` + CP `tenants` | Operator CLI script only (console button disabled) | No (REST calls across 2 projects) | No (script fails before finishing) | No | No (display only) | Writes CP rows directly |
| LMS | `organizations` | Self-serve `/start`, platform console, **legacy ungated `/signup`**, scripts | No (delete-org compensation) | Yes | Broken (plan names rejected by DB) | Yes (RLS) | None |
| Academy | `institution` (`tenant_id` text) | Platform console only | No (`begin`/`commit` on a pool) | No (linked to the operator's login) | No | No | None |
| Care | `practice` (slug) | Self-serve signup + async worker | No | No (password discarded; worker always fails) | Stripe at signup, no compensation | Partly (402 gate) | None |
| Orthos | `org-<uuid>` in memory | Public signup and onboarding wizard | No (in-memory) | Not safely (see P0) | No | No (mock) | None |
| FaithFull Scholars | `institution` | Self-serve signup, then staff approval | No (compensating deletes) | Yes | No (manual SQL) | Yes (write freeze) | None |

Every app needs the same five things, and none has all of them: **one atomic provisioning entry point, a real customer-owned admin identity, a shared lifecycle, enforced status, and registration with the control plane.** This standard defines them once for the fleet.

---

## II. P0 Security Findings: fix before any other tenancy work

1. **Orthos master passwords.** `n0l0s@b3` (and variants), `Orthos2026!` and `Password123!` authenticate as *any* user (`ChurchCore Orthos/src/actions/auth.ts:188-204`). *Confirmed in code.*
2. **Orthos signup account takeover.** Registering with an existing username or email deletes the existing account and replaces it (`src/actions/auth.ts:390-398`). *Confirmed.* Reported by the trace but not re-checked: an unsigned, forgeable session cookie (which also grants platform admin); plaintext passwords; and signup wiping the global data store.
3. **ChMS provisioning resets passwords on existing accounts.** If the admin email already exists in the shared runtime auth project, its password is overwritten (`ChurchCore/scripts/lib/tenant-provisioning-core.mjs:39-43`). *Confirmed.* The generated `seed-<slug>.mjs` embeds that password and is intended to be committed.
4. **LMS legacy `/signup`** lets any signed-in user (including a student) create a new tenant, accepts `mock-token`/`test-token` as a valid CAPTCHA, and ignores the self-serve feature flag (`src/app/actions/tenant-signup.ts:88-91`).
5. **LMS org admins can write their own `plan`, `status`, `trial_ends_at` and `stripe_customer_id`** through PostgREST (the update policy has no column restriction), which lets a tenant escape its trial.

---

## III. Proposed Requirements

### REQ-01: One canonical tenant identity
- The control plane (ChurchCore-Business) mints a **`fleet_tenant_id` (UUID v4)** for every customer. Each app stores it on its tenant root row as a unique, non-null column. App-local primary keys may stay as they are.
- **Slug rule (fleet-wide):** `^[a-z][a-z0-9-]{2,29}$`, no trailing or double hyphen, unique case-insensitively within an app, and checked against a shared reserved list (`www`, `app`, `api`, `admin`, `control`, `platform`, `auth`, `login`, `status`, `mail`, `support`, `billing`, `demo`, `system`, …). The list lives in the Business repo and is vendored into each app.
- A slug is immutable after `active`, unless changed through the control plane, which updates every app.

### REQ-02: Shared lifecycle state machine
Two independent fields on every tenant root row:

- `tenant_status`: `requested → provisioning → active ⇄ suspended → archived → purged` (`provisioning → failed → provisioning` for retries)
- `billing_status`: `none | trialing | active | past_due | canceled | comped`

Transitions go through one function per app that validates the move and writes an audit event. Tenant users can never update these columns directly. **Plan vocabulary is fleet-wide** and defined in the control plane.

### REQ-03: One atomic provisioning entry point per app
Each app has exactly one `provisionTenant(request)`, used by every path. No other code inserts tenant root rows.
- **Database writes run in a single transaction**: a `SECURITY DEFINER` Postgres function, or one dedicated `pg` client (never `pool.query('begin')`). This covers the tenant row, the first-admin membership, default settings, starter data and the audit event.
- **Idempotent** on `fleet_tenant_id`: repeating a completed request returns the existing tenant; repeating a failed one resumes it.
- **Side effects outside the database** (auth invite, Stripe, email, DNS) run after commit through an outbox and retry until they succeed. Stripe calls use `Idempotency-Key: <fleet_tenant_id>`.
- The tenant stays `provisioning` until every step succeeds, then becomes `active`. A failure sets `failed` and stores the error message.

### REQ-04: Exactly two ways in
1. **Control-plane provisioning (sales-led):** ChurchCore-Business calls `POST /api/fleet/tenants` on each app with a signed service token (HMAC per app, or OIDC). Body: `fleet_tenant_id`, `slug`, `display_name`, `plan`, `billing_status`, `admin {email, name}`, `timezone`, `products[]`. Apps also expose `GET /api/fleet/tenants/:id` and `POST /api/fleet/tenants/:id/{suspend,restore,archive}`.
2. **Self-serve signup (only where the product allows it):** CAPTCHA with no bypass tokens in production, rate limits that fail closed, email verification **before** any tenant row exists, then the same `provisionTenant`, then registration with the control plane.

Seeds, demo resets and CI fixtures refuse to run against production. All other creation paths are removed.

### REQ-05: The first admin belongs to the customer
- Invite the customer's email with a single-use link. Operators never set, see or share passwords; no password is ever printed, logged or committed.
- Platform staff are never members of a customer tenant. Staff access goes through a separate, audited support-access mechanism with a reason and an expiry.
- Provisioning never modifies an existing account beyond adding a membership.

### REQ-06: Status is enforced, not just displayed
Session/tenant resolution **and** the RLS tenant helper return no tenant unless `tenant_status = 'active'` (`suspended` may be read-only, per product). Stripe webhooks are deduplicated by `event.id`, and every status write checks for errors.

### REQ-07: Audit and telemetry
Append-only events, kept after purge: `tenant.requested`, `.provisioned`, `.provision_failed`, `.activated`, `.suspended`, `.restored`, `.archived`, `.purged`, `.admin_invited`, `.plan_changed`. They are reported to the control plane per TELEMETRY-SPEC so the Ecosystem Dashboard shows tenant counts and failures per app.

### REQ-08: Deprovisioning
`suspend` → `archive` (export offered) → `purge` after 30 days. A purge deletes tenant data in one transaction, removes auth identities that belong to no other tenant, cancels Stripe and keeps audit tombstones. Deletes use FK cascade from the tenant root or a CI-verified table list. Purge jobs must actually be scheduled.

### REQ-09: Compliance at creation
Every path records acceptance of the Terms of Service and Privacy Policy (by version) for the tenant and the first admin. **Care** requires BAA acceptance before `active`. **Academy** records FERPA/COPPA acknowledgement where minors are enrolled.

### REQ-10: Conformance test (go-live gate)
One end-to-end test per app that runs in CI against a real database (not a mocked one):
1. Provision via `POST /api/fleet/tenants`, then repeat the same request (idempotent: one tenant).
2. Accept the invite → log in as the customer admin → reach the admin home page.
3. Tenant A's data is invisible to tenant B.
4. Suspend → the admin is blocked; restore → access returns.
5. Stripe `checkout.session.completed` → `billing_status = active` with the plan mapped correctly; replaying the event changes nothing.
6. Archive → purge → no tenant rows, no orphaned auth users, tombstones present.

**An app is not go-live ready until this test passes.**

---

## IV. Per-App Go-Live Work (priority order)

### ChurchCore (ChMS)
1. Stop resetting existing users' passwords and stop committing seed scripts that contain passwords (P0 #3).
2. The provisioning script cannot succeed as written. `church_settings` is not created by any migration (*confirmed*), and the trace also reports a probable `profiles` unique-key conflict with the auth trigger's row. Replace the script with a transactional `provisionTenant` behind `POST /api/fleet/tenants`, and enable the console button.
3. `listUsers({perPage:1000})` misses users beyond the first 1,000.
4. Enforce `tenant_status`/`billing_status`. Make delete and erase remove runtime data and identities.
5. Settle on one ID convention (`external_tenant_id` vs `church.id`) and one `platform_admins` table. Block reserved slugs and ignore `*.vercel.app` hosts in subdomain routing.

### ChurchCore LMS
1. Fix Stripe activation. `PRICE_TO_PLAN` returns `starter|growth|enterprise`, but the DB allows only `free|standard|premium` (*confirmed*), so no paid conversion ever activates. Also fix the webhook idempotency columns that don't exist, and the invoice handlers that read `org_id` from metadata that is never set.
2. Delete legacy `/signup` (P0 #4).
3. Lock the billing and lifecycle columns against org-admin writes (P0 #5).
4. Allow `/join` for trial tenants. Schedule `expire-trials` and `purge-deleted-tenants`. Make purge cancel Stripe and remove auth users.
5. Validate slugs in the console. Make the rate limiter fail closed. Add a production guard to `reset-demo-data.mjs`.

### ChurchCore Academy
1. Run provisioning and deletion on one dedicated client. `begin`/`commit` currently go through the pool, so rollback doesn't work (`src/modules/platform-admin/postgres-repository.ts:93,419,443`, *confirmed*).
2. Create a customer-owned admin identity plus an invite. Stop linking the tenant admin to the operator's login (this also breaks operators once they have created a second tenant).
3. Enforce `lifecycle_status` in identity resolution. Add suspend and restore.
4. Make deletion safe: don't wipe platform audit history, handle restrict FKs, and guard active tenants.
5. Add the missing registry row for `metro-tech`. Seed a default academic year. Cap `tenant_id` length and check reserved names.

### ChurchCore Care
1. Signup discards the owner's password (*confirmed*), and the worker rejects every signup because the slug is already registered. Rebuild as a transactional `provisionTenant` with an invited owner.
2. The Vercel cron imports `apps/api/src/jobs/provision-tenant.js`, which does not exist (*confirmed*).
3. Decide the database model. Per-tenant databases are never created or routed to. Build that path, or commit to a shared DB with `tenant_id` + RLS.
4. Undo the Stripe customer/subscription when signup fails. Deduplicate webhooks. Add the missing `grace_period_ends_at` column. Fix payment-failure emails that read a null `owner_email`.
5. Add BAA, terms and consent capture, and CAPTCHA on signup. Stop platform admins from forcing provisioning requests to `completed`.

### ChurchCore Orthos
1. Fix P0 #1 and #2 now, regardless of go-live timing.
2. Tenancy needs a rebuild, not alignment. Move tenant, user and session state from the in-memory store and `.users.json` onto Supabase Auth plus the existing `organizations`/`profiles`/`user_roles` schema (RLS already exists, unused). Then implement REQ-03.
3. Remove user-chosen roles at signup and the global data wipe in `initializeCleanSlateAssessment`.

### FaithFull Scholars (closest to the standard)
1. Move the signup writes into one RPC. Check the subscription upsert's error.
2. Audit approve/reject/suspend decisions and validate transitions. Email staff about pending institutions and email the applicant the outcome.
3. Restrict the open `institutions` INSERT policy (any signed-in user can create orphaned pending rows). Decide whether pending institutions may invite.
4. Handle slug collisions, wire billing, and connect to the control plane.

---

## V. Proposed Rollout

| Phase | Scope | Exit criterion |
|---|---|---|
| 0 | P0 security fixes (Section II) | Merged in Orthos, ChMS, LMS |
| 1 | Control plane: `fleet_tenant_id`, reserved-slug list, plan vocabulary, `/api/fleet/tenants` client, tenant-event telemetry | Business repo |
| 2 | Reference implementation in FaithFull Scholars or LMS, with the REQ-10 conformance test | Test green in CI |
| 3 | Port to ChMS and Academy (console-led) | Conformance green |
| 4 | Care rebuild; Orthos rebuild | Conformance green |

## VI. Open Decisions for the Owner
1. Which products offer **self-serve** signup, and which are **sales-led only**?
2. Should **one customer buying several products** get one `fleet_tenant_id` across apps (recommended)?
3. **Care database model:** per-tenant database, or shared database with RLS?
4. **Billing owner:** one Stripe customer per fleet tenant billed centrally, or per-app Stripe as today?

---
*Method: six parallel read-only code traces on 2026-11-14 (no code run, no database touched). Items marked "confirmed" were re-checked by hand against the source; the rest come from the traces and should be verified while fixing.*
