/**
 * COUNCIL-2026-016 (DIR-2026-TENANCY-001): typed view of the canonical fleet tenancy spec.
 *
 * The normative source is `docs/control-plane/tenancy/fleet-tenancy.json`. This module loads
 * it and exposes typed constants. The literal unions below exist only so TypeScript can narrow
 * values; at module load they are checked against the JSON and the module throws on any drift
 * (fail closed: the control plane must never run against a spec it does not match).
 */

import fleetTenancySpec from "../../../docs/control-plane/tenancy/fleet-tenancy.json";
import governanceManifest from "../../../docs/governance-sync/manifest.json";

export const TENANT_STATUSES = [
  "provisioning",
  "provision_failed",
  "active",
  "trial_expired",
  "suspended",
  "archived",
  "purged",
] as const;
export type TenantStatus = (typeof TENANT_STATUSES)[number];

export const BILLING_STATUSES = ["trialing", "active", "past_due", "canceled", "comped"] as const;
export type BillingStatus = (typeof BILLING_STATUSES)[number];

export const PLAN_KEYS = ["starter", "growth", "pro"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

/** Billing statuses a create_request may carry (fleet_api.create_request.billing_status). */
export const CREATE_BILLING_STATUSES = ["trialing", "active", "comped"] as const;
export type CreateBillingStatus = (typeof CREATE_BILLING_STATUSES)[number];

export const SIGNUP_SOURCES = ["self_serve", "control_plane"] as const;
export type SignupSource = (typeof SIGNUP_SOURCES)[number];

/** The six registered products (docs/governance-sync/manifest.json `registered_products[].name`). */
export const FLEET_PRODUCTS = [
  "ChurchCore",
  "ChurchCore-LMS",
  "ChurchCore-Academy",
  "ChurchCoreCare",
  "ChurchCore-Orthos",
  "FaithFullScholars",
] as const;
export type FleetProduct = (typeof FLEET_PRODUCTS)[number];

export const AUDIT_EVENTS = [
  "tenant.requested",
  "tenant.provisioned",
  "tenant.provision_failed",
  "tenant.activated",
  "tenant.trial_expired",
  "tenant.suspended",
  "tenant.restored",
  "tenant.archived",
  "tenant.purged",
  "tenant.admin_invited",
  "tenant.plan_changed",
  "tenant.billing_status_changed",
  "tenant.support_access",
] as const;
export type AuditEvent = (typeof AUDIT_EVENTS)[number];

export const FUNNEL_EVENTS = [
  "signup.started",
  "signup.email_sent",
  "signup.verified",
  "tenant.provisioned",
  "signup.password_set",
  "signup.compliance_ack",
  "trial.converted",
  "trial.expired",
] as const;
export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export type FleetEventType = AuditEvent | FunnelEvent;
/** audit_events ∪ funnel_events, de-duplicated, spec order. */
export const FLEET_EVENT_TYPES: readonly FleetEventType[] = Array.from(
  new Set<FleetEventType>([...AUDIT_EVENTS, ...FUNNEL_EVENTS])
);

export const LIFECYCLE_ACTIONS = ["suspend", "restore", "archive"] as const;
export type LifecycleAction = (typeof LIFECYCLE_ACTIONS)[number];

// ---------------------------------------------------------------------------
// Values taken directly from the JSON
// ---------------------------------------------------------------------------

export const FLEET_SPEC_VERSION: string = fleetTenancySpec.spec_version;
export const SLUG_REGEX = new RegExp(fleetTenancySpec.identity.slug_regex);
export const SLUG_MIN_LENGTH: number = fleetTenancySpec.identity.slug_min_length;
export const SLUG_MAX_LENGTH: number = fleetTenancySpec.identity.slug_max_length;
export const RESERVED_SLUGS: ReadonlySet<string> = new Set(fleetTenancySpec.identity.reserved_slugs);
export const INITIAL_TENANT_STATUS = fleetTenancySpec.lifecycle.initial_tenant_status as TenantStatus;
export const TRIAL_DAYS: number = fleetTenancySpec.subscription.trial.days;
export const TRIAL_PLAN = fleetTenancySpec.subscription.trial.plan_during_trial as PlanKey;
export const HMAC_WINDOW_SECONDS = 300; // fleet_api.auth: reject if |now - timestamp| > 300s

export const TRANSITIONS: Readonly<Record<TenantStatus, readonly TenantStatus[]>> =
  fleetTenancySpec.lifecycle.transitions as Record<TenantStatus, TenantStatus[]>;

// ---------------------------------------------------------------------------
// Drift check (fail closed)
// ---------------------------------------------------------------------------

function sameList(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function assertSpecMatches(): void {
  const s = fleetTenancySpec;
  const problems: string[] = [];
  if (!sameList(TENANT_STATUSES, s.lifecycle.tenant_status)) problems.push("lifecycle.tenant_status");
  if (!sameList(BILLING_STATUSES, s.lifecycle.billing_status)) problems.push("lifecycle.billing_status");
  if (!sameList(PLAN_KEYS, s.subscription.tiers.map((t) => t.key))) problems.push("subscription.tiers");
  if (!sameList(AUDIT_EVENTS, s.audit_events)) problems.push("audit_events");
  if (!sameList(FUNNEL_EVENTS, s.funnel_events)) problems.push("funnel_events");
  if (!sameList(CREATE_BILLING_STATUSES, s.fleet_api.create_request.billing_status.split("|"))) {
    problems.push("fleet_api.create_request.billing_status");
  }
  if (!sameList(PLAN_KEYS, s.fleet_api.create_request.plan.split("|"))) {
    problems.push("fleet_api.create_request.plan");
  }
  if (!sameList(Object.keys(s.lifecycle.transitions), TENANT_STATUSES)) problems.push("lifecycle.transitions");
  for (const targets of Object.values(s.lifecycle.transitions)) {
    for (const t of targets) {
      if (!(TENANT_STATUSES as readonly string[]).includes(t)) problems.push(`lifecycle.transitions → ${t}`);
    }
  }
  const products = governanceManifest.registered_products.map((p) => p.name);
  if (!sameList(FLEET_PRODUCTS, products)) problems.push("manifest.registered_products");
  if (problems.length > 0) {
    throw new Error(`[fleet/spec] fleet-tenancy.json drift detected: ${problems.join(", ")}`);
  }
}

assertSpecMatches();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isTenantStatus(v: unknown): v is TenantStatus {
  return typeof v === "string" && (TENANT_STATUSES as readonly string[]).includes(v);
}
export function isBillingStatus(v: unknown): v is BillingStatus {
  return typeof v === "string" && (BILLING_STATUSES as readonly string[]).includes(v);
}
export function isPlanKey(v: unknown): v is PlanKey {
  return typeof v === "string" && (PLAN_KEYS as readonly string[]).includes(v);
}
export function isFleetProduct(v: unknown): v is FleetProduct {
  return typeof v === "string" && (FLEET_PRODUCTS as readonly string[]).includes(v);
}
export function isFleetEventType(v: unknown): v is FleetEventType {
  return typeof v === "string" && (FLEET_EVENT_TYPES as readonly string[]).includes(v);
}

/** True only if `from → to` is listed in lifecycle.transitions. Same-state is NOT a transition. */
export function isLegalTransition(from: string, to: string): boolean {
  if (!isTenantStatus(from) || !isTenantStatus(to)) return false;
  return TRANSITIONS[from].includes(to);
}

export type SlugValidation = { ok: true; slug: string } | { ok: false; reason: string };

/**
 * REQ-016-01.2: regex, 3–30 chars, not reserved. The input is not lower-cased: an uppercase
 * slug is rejected rather than silently rewritten, so the registry and the product agree.
 */
export function validateSlug(input: unknown): SlugValidation {
  if (typeof input !== "string") return { ok: false, reason: "Slug must be a string." };
  const slug = input;
  if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
    return { ok: false, reason: `Slug must be ${SLUG_MIN_LENGTH}–${SLUG_MAX_LENGTH} characters.` };
  }
  if (!SLUG_REGEX.test(slug)) {
    return {
      ok: false,
      reason: "Slug must start with a letter and use lowercase letters, digits and single hyphens.",
    };
  }
  if (RESERVED_SLUGS.has(slug.toLowerCase())) {
    return { ok: false, reason: `Slug "${slug}" is reserved.` };
  }
  return { ok: true, slug };
}

