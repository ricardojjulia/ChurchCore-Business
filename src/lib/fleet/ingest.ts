/**
 * COUNCIL-2026-016 Phase 1.3 — product → control plane event ingest (`POST /api/fleet/events`).
 *
 * Authenticated by the PRODUCT's fleet HMAC secret (not an operator session). Idempotent on
 * `event_id`. Accepts only `audit_events ∪ funnel_events`. A `tenant.provisioned` event with
 * `signup_source = self_serve` registers (upserts) the tenant in the fleet registry.
 *
 * Data boundary (COUNCIL-2026-001 REQ-001-02, TELEMETRY-SPEC §2): payloads are tenant METADATA
 * only. Personal data (names, emails, phone numbers, etc.) is rejected, not stored.
 */

import { z } from "zod";
import {
  FLEET_SIGNATURE_HEADER,
  FLEET_TIMESTAMP_HEADER,
  FleetSecretMissingError,
  getProvisioningSecret,
  verifyFleetSignature,
} from "@/lib/fleet/hmac";
import {
  BILLING_STATUSES,
  FLEET_PRODUCTS,
  PLAN_KEYS,
  TENANT_STATUSES,
  isBillingStatus,
  isFleetEventType,
  isLegalTransition,
  isPlanKey,
  validateSlug,
  type FleetEventType,
  type FleetProduct,
  type TenantStatus,
} from "@/lib/fleet/spec";
import type { FleetRegistryStore, FleetTenantPatch, FleetTenantRow } from "@/lib/fleet/store";

export const MAX_INGEST_BODY_BYTES = 16 * 1024;
export const MAX_PAYLOAD_BYTES = 8 * 1024;
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

const EnvelopeSchema = z
  .object({
    event_id: z.string().uuid(),
    product: z.enum(FLEET_PRODUCTS),
    event_type: z.string().min(1).max(64),
    fleet_tenant_id: z.string().uuid().nullable().optional(),
    occurred_at: z.string().datetime({ offset: true }),
    payload: z.record(z.unknown()).default({}),
  })
  .strict();

const SelfServeRegistrationSchema = z.object({
  signup_source: z.literal("self_serve"),
  app_tenant_id: z.string().min(1).max(200),
  slug: z.string(),
  tenant_status: z.enum(TENANT_STATUSES).default("active"),
  billing_status: z.enum(BILLING_STATUSES).default("trialing"),
  plan: z.enum(PLAN_KEYS).default("pro"),
  trial_ends_at: z.string().datetime({ offset: true }).nullable().optional(),
});

/** Event types that, when reported by the owning product, move the registry status. */
const STATUS_FROM_EVENT: Partial<Record<FleetEventType, TenantStatus>> = {
  "tenant.provision_failed": "provision_failed",
  "tenant.activated": "active",
  "tenant.trial_expired": "trial_expired",
  "tenant.suspended": "suspended",
  "tenant.restored": "active",
  "tenant.archived": "archived",
  "tenant.purged": "purged",
};

const PII_KEY_RX =
  /^(e-?mail|.*_email|email_.*|name|first_?name|last_?name|full_?name|display_?name|admin|admin_.*|owner_name|phone|phone_?number|mobile|address|street|postal_?code|zip|password|passwd|secret|token|ssn|dob|date_of_birth|birth_?date|ip|ip_address|user_agent)$/i;
const EMAIL_VALUE_RX = /[^\s@]+@[^\s@]+\.[^\s@]+/;

/** Returns the offending JSON path if the payload carries personal data, else null. */
export function findPersonalData(value: unknown, path = "payload"): string | null {
  if (typeof value === "string") return EMAIL_VALUE_RX.test(value) ? path : null;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const hit = findPersonalData(value[i], `${path}[${i}]`);
      if (hit) return hit;
    }
    return null;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (PII_KEY_RX.test(k)) return `${path}.${k}`;
      const hit = findPersonalData(v, `${path}.${k}`);
      if (hit) return hit;
    }
  }
  return null;
}

export interface IngestRequest {
  rawBody: string;
  headers: { get(name: string): string | null };
}

export interface IngestDeps {
  /** The store, or a factory resolved only after the request is authenticated. */
  store: FleetRegistryStore | (() => FleetRegistryStore);
  env?: Record<string, string | undefined>;
  now?: () => Date;
}

export type RegistryEffect = "created" | "applied" | "unchanged" | "not_applied" | "unknown_tenant" | "none";

export interface IngestResponse {
  status: number;
  body:
    | { accepted: true; duplicate: boolean; event_id: string; registry: RegistryEffect }
    | { accepted: false; error: string; message: string };
}

function reject(status: number, error: string, message: string): IngestResponse {
  return { status, body: { accepted: false, error, message } };
}

class IngestRejection extends Error {
  constructor(public readonly response: IngestResponse) {
    super(response.body.accepted ? "" : response.body.message);
  }
}

export async function handleFleetEventIngest(req: IngestRequest, deps: IngestDeps): Promise<IngestResponse> {
  const env = deps.env ?? process.env;
  const now = deps.now ?? (() => new Date());

  if (Buffer.byteLength(req.rawBody, "utf8") > MAX_INGEST_BODY_BYTES) {
    return reject(413, "PAYLOAD_TOO_LARGE", "Event body exceeds 16 KiB.");
  }

  // 1. Identify the claimed product (the body is covered by the signature verified next).
  let json: unknown;
  try {
    json = JSON.parse(req.rawBody);
  } catch {
    return reject(400, "INVALID_JSON", "Body must be JSON.");
  }
  const claimedProduct = (json as { product?: unknown } | null)?.product;
  if (typeof claimedProduct !== "string" || !(FLEET_PRODUCTS as readonly string[]).includes(claimedProduct)) {
    return reject(401, "UNAUTHORIZED", "Signature verification failed.");
  }

  // 2. Verify HMAC with that product's secret. Missing secret fails closed.
  let secret: string;
  try {
    secret = getProvisioningSecret(claimedProduct, env);
  } catch (e) {
    if (e instanceof FleetSecretMissingError) {
      console.error(`[fleet/events] ${e.envVar} missing; rejecting (fail closed).`);
    }
    return reject(401, "UNAUTHORIZED", "Signature verification failed.");
  }
  const verdict = verifyFleetSignature({
    rawBody: req.rawBody,
    timestamp: req.headers.get(FLEET_TIMESTAMP_HEADER),
    signature: req.headers.get(FLEET_SIGNATURE_HEADER),
    secret,
    nowSeconds: Math.floor(now().getTime() / 1000),
  });
  if (!verdict.ok) return reject(401, "UNAUTHORIZED", "Signature verification failed.");

  // 3. Structural validation.
  const parsed = EnvelopeSchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return reject(400, "INVALID_EVENT", `${issue?.path.join(".") || "body"}: ${issue?.message ?? "invalid"}`);
  }
  const evt = parsed.data;
  if (!isFleetEventType(evt.event_type)) {
    return reject(400, "UNKNOWN_EVENT_TYPE", `event_type "${evt.event_type}" is not in audit_events ∪ funnel_events.`);
  }
  const eventType: FleetEventType = evt.event_type;
  if (eventType.startsWith("tenant.") && !evt.fleet_tenant_id) {
    return reject(400, "INVALID_EVENT", "tenant.* events require fleet_tenant_id.");
  }
  if (new Date(evt.occurred_at).getTime() - now().getTime() > MAX_FUTURE_SKEW_MS) {
    return reject(400, "INVALID_EVENT", "occurred_at is in the future.");
  }
  if (Buffer.byteLength(JSON.stringify(evt.payload), "utf8") > MAX_PAYLOAD_BYTES) {
    return reject(413, "PAYLOAD_TOO_LARGE", "payload exceeds 8 KiB.");
  }
  const pii = findPersonalData(evt.payload);
  if (pii) {
    return reject(422, "PERSONAL_DATA_REJECTED", `${pii} looks like personal data; the fleet registry stores tenant metadata only.`);
  }

  // 4. Dedupe on event_id before any registry effect.
  const store = typeof deps.store === "function" ? deps.store() : deps.store;
  if (await store.hasEvent(evt.event_id)) {
    return { status: 200, body: { accepted: true, duplicate: true, event_id: evt.event_id, registry: "none" } };
  }

  // 5. Registry effect (idempotent; safe if a retry re-applies it).
  let registry: RegistryEffect = "none";
  try {
    if (evt.fleet_tenant_id) {
      registry = await applyRegistryEffect(store, evt.product, evt.fleet_tenant_id, eventType, evt.payload);
    }
  } catch (e) {
    if (e instanceof IngestRejection) return e.response;
    throw e;
  }

  // 6. Append the event.
  const outcome = await store.insertEvent({
    event_id: evt.event_id,
    fleet_tenant_id: evt.fleet_tenant_id ?? null,
    product: evt.product,
    event_type: eventType,
    occurred_at: evt.occurred_at,
    payload: evt.payload,
    source: "product",
  });
  return {
    status: outcome === "duplicate" ? 200 : 202,
    body: { accepted: true, duplicate: outcome === "duplicate", event_id: evt.event_id, registry },
  };
}

async function applyRegistryEffect(
  store: FleetRegistryStore,
  product: FleetProduct,
  fleetTenantId: string,
  eventType: FleetEventType,
  payload: Record<string, unknown>
): Promise<RegistryEffect> {
  const row = await store.getTenant(fleetTenantId);
  if (row && row.product !== product) {
    // A product may only report on its own tenants.
    throw new IngestRejection(reject(403, "PRODUCT_MISMATCH", "fleet_tenant_id belongs to a different product."));
  }

  if (eventType === "tenant.provisioned" && payload.signup_source === "self_serve") {
    return registerSelfServe(store, product, fleetTenantId, row, payload);
  }
  if (!row) return "unknown_tenant";

  if (eventType === "tenant.provisioned") {
    const target = typeof payload.tenant_status === "string" ? payload.tenant_status : "active";
    return transition(store, row, target, typeof payload.app_tenant_id === "string" ? payload.app_tenant_id : undefined);
  }
  const target = STATUS_FROM_EVENT[eventType];
  if (target) return transition(store, row, target);

  if (eventType === "tenant.plan_changed" && isPlanKey(payload.to ?? payload.plan)) {
    const plan = (payload.to ?? payload.plan) as FleetTenantRow["plan"];
    if (plan === row.plan) return "unchanged";
    return (await store.updateTenant(fleetTenantId, { plan })) ? "applied" : "not_applied";
  }
  if (eventType === "tenant.billing_status_changed" && isBillingStatus(payload.to ?? payload.billing_status)) {
    const billing_status = (payload.to ?? payload.billing_status) as FleetTenantRow["billing_status"];
    if (billing_status === row.billing_status) return "unchanged";
    return (await store.updateTenant(fleetTenantId, { billing_status })) ? "applied" : "not_applied";
  }
  return "none";
}

async function transition(
  store: FleetRegistryStore,
  row: FleetTenantRow,
  target: string,
  appTenantId?: string
): Promise<RegistryEffect> {
  if (row.tenant_status === target) {
    if (appTenantId && !row.app_tenant_id) {
      await store.updateTenant(row.fleet_tenant_id, { app_tenant_id: appTenantId });
      return "applied";
    }
    return "unchanged";
  }
  if (!isLegalTransition(row.tenant_status, target)) return "not_applied";
  const patch: FleetTenantPatch = { tenant_status: target as TenantStatus };
  if (appTenantId && !row.app_tenant_id) patch.app_tenant_id = appTenantId;
  if (target !== "provision_failed") patch.last_error = null;
  return (await store.updateTenant(row.fleet_tenant_id, patch, row.tenant_status)) ? "applied" : "not_applied";
}

async function registerSelfServe(
  store: FleetRegistryStore,
  product: FleetProduct,
  fleetTenantId: string,
  row: FleetTenantRow | null,
  payload: Record<string, unknown>
): Promise<RegistryEffect> {
  const reg = SelfServeRegistrationSchema.safeParse(payload);
  if (!reg.success) {
    const issue = reg.error.issues[0];
    throw new IngestRejection(reject(400, "INVALID_REGISTRATION", `payload.${issue?.path.join(".")}: ${issue?.message}`));
  }
  const slug = validateSlug(reg.data.slug);
  if (!slug.ok) throw new IngestRejection(reject(400, "INVALID_SLUG", slug.reason));

  if (row) {
    if (row.slug !== reg.data.slug || (row.app_tenant_id && row.app_tenant_id !== reg.data.app_tenant_id)) {
      throw new IngestRejection(reject(409, "REGISTRY_CONFLICT", "Registration does not match the existing registry row."));
    }
    return transition(store, row, reg.data.tenant_status, reg.data.app_tenant_id);
  }

  const inserted = await store.insertTenant({
    fleet_tenant_id: fleetTenantId,
    product,
    app_tenant_id: reg.data.app_tenant_id,
    slug: reg.data.slug,
    tenant_status: reg.data.tenant_status,
    billing_status: reg.data.billing_status,
    plan: reg.data.plan,
    contract_ref: null,
    signup_source: "self_serve",
    trial_ends_at: reg.data.trial_ends_at ?? null,
    last_error: null,
  });
  if (inserted.ok) return "created";
  if (inserted.conflict === "fleet_tenant_id") {
    // Concurrent delivery of the same registration: treat as already registered.
    const existing = await store.getTenant(fleetTenantId);
    if (existing && existing.product === product && existing.slug === reg.data.slug) return "unchanged";
  }
  throw new IngestRejection(reject(409, "REGISTRY_CONFLICT", `Registry conflict on ${inserted.conflict}.`));
}
