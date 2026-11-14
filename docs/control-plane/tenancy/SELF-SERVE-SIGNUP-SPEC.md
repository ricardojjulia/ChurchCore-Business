# Fleet Self-Serve Signup, Trial & Conversion Experience

- **Governing directive**: [COUNCIL-2026-016](../../council/COUNCIL-2026-016.md), REQ-016-04/05/06/07/09
- **Status**: NORMATIVE. Every member app implements exactly this flow.
- **Design system**: COUNCIL-2026-014 (self-hosted variable typography, dark-first Slate/Indigo, 6-step rem scale, 44px touch targets). Sub-branding follows COUNCIL-2026-002.
- **Version**: 1.0.0 (2026-11-14)

## 1. Principles

1. **Same flow, same screens, same words.** A customer who has signed up for one ChurchCore product recognizes every step in another.
2. **Only these vary per product:** product name, logo, sub-brand accent token, the compliance acknowledgment step (§3, step 5), and the onboarding checklist items (§3, step 6).
3. **No card to start.** The trial is 30 days, with every feature of the highest tier.
4. **The customer owns their identity from the first click.** No operator ever sees a password.
5. **Accessible and bilingual.** WCAG 2.2 AA minimum (AAA contrast per COUNCIL-2026-002), with English and Spanish at launch using each app's existing i18n pipeline.

## 2. Shared Implementation

The flow ships as one fleet package, built in the control plane (Implementation Plan, Phase 1):

| Part | Provides |
|---|---|
| `@churchcore/fleet-signup/ui` | React screens: `StartForm`, `CheckEmail`, `Provisioning`, `SetPassword`, `ComplianceAck`, `TrialBanner`, `PlanPicker`, `TrialExpired`, all themed from COUNCIL-2026-014 tokens |
| `@churchcore/fleet-signup/server` | Slug validation against the vendored reserved list, CAPTCHA verification (Cloudflare Turnstile, fail-closed), rate limiting (fail-closed), verification tokens (SHA-256 hashed, single-use, 24h), and the HMAC client/server for `/api/fleet/tenants` |
| `@churchcore/fleet-signup/emails` | The fleet trial email templates (§4) |
| `@churchcore/fleet-signup/billing` | Stripe Checkout session creation, webhook verification and `event.id` dedupe, price-to-tier mapping read from `fleet-tenancy.json` |

Each app provides only an adapter, `provisionTenant(request)`, which implements its own atomic transaction (REQ-016-03), plus its brand tokens. Until the package is published, apps MUST NOT ship divergent signup UI. Existing flows stay disabled behind the go-live gate.

## 3. The Flow

```
/start ──► check email ──► /start/verify?token ──► provisioning ──► set password ──► compliance ack ──► product home
  (1)          (2)                (3)                   (3)              (4)              (5)              (6)
                                                                                          trial banner on every page (7)
day 30 ──► trial_expired (read-only) ──► /billing/plans ──► Stripe Checkout ──► active (paid)  (8, 9)
```

### Step 1: Start (`/start`)
Fields, in this order:

| Field | Rules |
|---|---|
| Organization name | Required, 2–120 characters. Label: "Church / organization name". Products may override the noun only (e.g. "Practice name", "School name"). |
| Your name | Required, 1–120 characters |
| Work email | Required, RFC 5322 format; disposable domains rejected |
| Workspace address | Slug, auto-suggested from the organization name, editable. Live availability check shown as `{slug}.{product-domain}`. Fleet slug rule and reserved list apply. |
| Country & time zone | Prefilled from the browser, editable |
| Agreement | Required checkbox: "I agree to the Terms of Service and Privacy Policy" (links show the version). The version is stored with the acceptance. |
| CAPTCHA | Turnstile, invisible where possible |

- Primary button: **"Start my free 30-day trial"**. Sub-text: "All features included. No credit card required."
- On submit, apply rate limits (5 per IP per hour, 20 per email domain per day; fail closed in production). Create a `pending_signups` row holding only the token hash, then send the verification email.
- **If the email already belongs to an account**, the UI response is identical (no account enumeration). The email instead says "You already have an account; sign in or create another workspace", and offers to create the new workspace under the existing identity after sign-in.

### Step 2: Check your email
- Generic confirmation screen. Resend allowed after 60 seconds, at most 3 times. "Wrong email?" goes back to step 1 with the fields preserved.

### Step 3: Verify, then provision
- `/start/verify?token=…` atomically claims the token (single-use, 24h), then calls the app adapter `provisionTenant` with `source = self_serve`.
- The adapter commits the tenant root row (`tenant_status = provisioning`, `billing_status = trialing`, `trial_ends_at = now + 30 days`, `plan = <highest tier>`, `signup_source = self_serve`), the owner membership, defaults and the audit event in one transaction.
- After commit, the outbox registers the tenant with the control plane, creates the Stripe customer (no subscription yet), and moves the tenant to `active`.
- Provisioning screen: "Setting up {Organization}…" with a three-step progress list. It polls the status endpoint every 1.5s for up to 60s. On `provision_failed`, show "We hit a snag. We've been notified and will email you within 1 business day." The control plane alerts staff.

### Step 4: Set password
- The new identity has no password until this step. Minimum 12 characters, checked against breached-password lists (HIBP k-anonymity), with a strength meter. A passkey is offered where the app's auth stack supports it.
- This step is skipped when the email belongs to an existing identity (that user is already signed in).

### Step 5: Compliance acknowledgment (product-specific; may not be skipped where required)

| Product | Acknowledgment | When it blocks |
|---|---|---|
| ChurchCore Care | Business Associate Agreement (BAA), version recorded | Before any client record can be created |
| ChurchCore Academy | FERPA, plus COPPA for under-13 students | Before student records are created |
| All others | None beyond the Terms and Privacy Policy accepted at step 1 | — |

### Step 6: Product home with onboarding checklist
- The same checklist component everywhere. The items are product-specific (e.g. "Import members", "Create your first course").
- Every checklist starts with "Invite a teammate" and "Review your plan options".

### Step 7: Trial banner (every page, owner and admin roles)
- Text: "**{N} days left in your free trial.** You have every feature. [Choose a plan]"
- Shown in neutral color from day 1–23, warning color from day 24–30. It cannot be dismissed in the last 7 days.

### Step 8: Plan selection (`/billing/plans`)
- The same `PlanPicker` everywhere: three fleet tiers, monthly/annual toggle (annual is 2 months free), the value metric shown per tier, and the customer's current usage against each tier's limits.
- If current usage exceeds a tier's limit, that tier shows which features or limits would lock. **Nothing locks before conversion.**
- **Choose** opens Stripe Checkout (fleet billing package). The webhook sets `billing_status = active` and `plan = <tier>`; features above the tier lock at that moment.

### Step 9: Trial ends without conversion
- At `trial_ends_at` the tenant moves to `trial_expired`: read-only, export allowed, with a full-screen `TrialExpired` interstitial offering plan selection.
- Lifecycle after that, per `fleet-tenancy.json`: 30 days later → `archived` (data retained, no access; the customer may still convert through support) → 30 days later → `purged`.

## 4. Trial Emails (same templates, product-branded)

| Day | Email |
|---|---|
| 0 | Welcome: workspace URL, checklist, "you have every feature for 30 days" |
| 3 | Getting started: top 3 product actions |
| 14 | Halfway: usage summary, plan preview |
| 23 | 7 days left: recommended tier based on usage |
| 27 | 3 days left |
| 30 | Trial ended: read-only now, convert to continue |
| 45 | Data still safe; 15 days until archive |
| 60 | Workspace archived |

Every email includes a one-click link to plan selection. Opt-out applies only to marketing content, never to the lifecycle notices above.

## 5. Control-Plane-Initiated Signup (sales-assisted)
`POST /api/fleet/tenants` runs the same `provisionTenant`. The customer receives a fleet invite email instead of steps 1–3, then continues from step 4 with the identical screens. The trial rules are the same, unless the control plane sets `billing_status = comped` or `active` with an attached subscription.

## 6. Copy & Analytics Invariants
- Button labels, headings and error messages come from the shared package's i18n catalog. Apps MUST NOT fork the strings.
- Funnel events are identical fleet-wide and reported to the control plane: `signup.started`, `signup.email_sent`, `signup.verified`, `tenant.provisioned`, `signup.password_set`, `signup.compliance_ack`, `trial.converted`, `trial.expired`.
