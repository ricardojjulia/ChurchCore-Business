/**
 * COUNCIL-2026-016 Phase 1.4 — control-plane provisioning orchestrator.
 *
 * Calls each product's fleet API (`POST /api/fleet/tenants`, `GET …/{id}`,
 * `POST …/{id}/{suspend|restore|archive}`) with the HMAC service credential, and mirrors the
 * result into the fleet tenant registry through `isLegalTransition`.
 *
 * Data boundary (COUNCIL-2026-001 REQ-001-02): the create_request carries the organization
 * display name and the first admin's name/email because the PRODUCT needs them to invite the
 * customer. The control plane forwards them and does not persist them. Only tenant metadata
 * (ids, slug, status, plan, contract ref) reaches the registry or the event log.
 *
 * All I/O (fetch, store, env, clock, uuid) is injected so this module is unit-testable.
 */

import { randomUUID } from "node:crypto";
import {
  FLEET_SIGNATURE_HEADER,
  FLEET_TIMESTAMP_HEADER,
  FleetSecretMissingError,
  getProvisioningSecret,
  productEnvKey,
  signFleetRequest,
} from "@/lib/fleet/hmac";
import {
  FleetCreateRequestSchema,
  FleetCreateResponseSchema,
  FleetStatusResponseSchema,
  type FleetCreateRequest,
} from "@/lib/fleet/schemas";
import {
  isFleetProduct,
  isLegalTransition,
  TRIAL_DAYS,
  validateSlug,
  type FleetEventType,
  type FleetProduct,
  type LifecycleAction,
  type TenantStatus,
} from "@/lib/fleet/spec";
import type { FleetRegistryStore, FleetTenantRow } from "@/lib/fleet/store";

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export interface OrchestratorDeps {
  store: FleetRegistryStore;
  fetch: FetchLike;
  env?: Record<string, string | undefined>;
  now?: () => Date;
  uuid?: () => string;
  timeoutMs?: number;
}

export type OrchestratorErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_SLUG"
  | "UNKNOWN_PRODUCT"
  | "CONFIG_MISSING"
  | "CONFLICT"
  | "NOT_FOUND"
  | "ILLEGAL_TRANSITION"
  | "PRODUCT_ERROR";

export type OrchestratorResult =
  | { ok: true; tenant: FleetTenantRow; idempotent: boolean; remote_status?: TenantStatus }
  | { ok: false; code: OrchestratorErrorCode; message: string; tenant?: FleetTenantRow };

/** create_request with fleet_tenant_id optional (minted when absent). */
export type ProvisionRequest = Omit<FleetCreateRequest, "fleet_tenant_id"> & { fleet_tenant_id?: string };

const ACTION_TARGET: Record<LifecycleAction, TenantStatus> = {
  suspend: "suspended",
  restore: "active",
  archive: "archived",
};
const ACTION_EVENT: Record<LifecycleAction, FleetEventType> = {
  suspend: "tenant.suspended",
  restore: "tenant.restored",
  archive: "tenant.archived",
};
/** Event recorded when a status refresh observes a product-side transition. */
const STATUS_EVENT: Partial<Record<TenantStatus, FleetEventType>> = {
  active: "tenant.activated",
  provision_failed: "tenant.provision_failed",
  trial_expired: "tenant.trial_expired",
  suspended: "tenant.suspended",
  archived: "tenant.archived",
  purged: "tenant.purged",
};
const SETTLED: ReadonlySet<TenantStatus> = new Set(["active", "trial_expired", "suspended", "archived", "purged"]);

function sanitizeError(message: string): string {
  return message.replace(/\s+/g, " ").slice(0, 300);
}

export function createFleetOrchestrator(deps: OrchestratorDeps) {
  const env = deps.env ?? process.env;
  const now = deps.now ?? (() => new Date());
  const uuid = deps.uuid ?? randomUUID;
  const timeoutMs = deps.timeoutMs ?? 15_000;
  const { store } = deps;

  function productConfig(product: FleetProduct): { baseUrl: string; secret: string } {
    const urlVar = `FLEET_PRODUCT_URL_${productEnvKey(product)}`;
    const raw = (env[urlVar] ?? "").trim().replace(/\/+$/, "");
    let parsed: URL;
    try {
      parsed = new URL(raw);
    } catch {
      throw new FleetSecretMissingError(urlVar);
    }
    const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (parsed.protocol !== "https:" && !(local && parsed.protocol === "http:")) {
      throw new FleetSecretMissingError(urlVar);
    }
    return { baseUrl: raw, secret: getProvisioningSecret(product, env) };
  }

  async function recordEvent(
    product: FleetProduct,
    fleetTenantId: string,
    eventType: FleetEventType,
    payload: Record<string, unknown> = {}
  ): Promise<void> {
    await store.insertEvent({
      event_id: uuid(),
      fleet_tenant_id: fleetTenantId,
      product,
      event_type: eventType,
      occurred_at: now().toISOString(),
      payload,
      source: "control_plane",
    });
  }

  async function signedCall(
    product: FleetProduct,
    method: "GET" | "POST",
    path: string,
    body: unknown
  ): Promise<{ ok: true; status: number; json: unknown } | { ok: false; error: string }> {
    const { baseUrl, secret } = productConfig(product);
    const rawBody = method === "GET" ? "" : JSON.stringify(body ?? {});
    const signed = signFleetRequest(rawBody, secret, Math.floor(now().getTime() / 1000));
    const headers: Record<string, string> = {
      [FLEET_TIMESTAMP_HEADER]: signed[FLEET_TIMESTAMP_HEADER],
      [FLEET_SIGNATURE_HEADER]: signed[FLEET_SIGNATURE_HEADER],
      accept: "application/json",
    };
    if (method === "POST") headers["content-type"] = "application/json";
    let res: Response;
    try {
      res = await deps.fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: method === "GET" ? undefined : rawBody,
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
        redirect: "error",
      });
    } catch (e) {
      return { ok: false, error: sanitizeError(`network error: ${e instanceof Error ? e.name : "unknown"}`) };
    }
    if (!res.ok) return { ok: false, error: `product responded HTTP ${res.status}` };
    try {
      return { ok: true, status: res.status, json: await res.json() };
    } catch {
      return { ok: false, error: "product response was not JSON" };
    }
  }

  async function markFailed(row: FleetTenantRow, error: string): Promise<OrchestratorResult> {
    const updated =
      (await store.updateTenant(
        row.fleet_tenant_id,
        { tenant_status: "provision_failed", last_error: error },
        "provisioning"
      )) ?? (await store.getTenant(row.fleet_tenant_id)) ?? row;
    if (updated.tenant_status === "provision_failed") {
      await recordEvent(row.product, row.fleet_tenant_id, "tenant.provision_failed", { reason: error });
    }
    return { ok: false, code: "PRODUCT_ERROR", message: error, tenant: updated };
  }

  /**
   * Provision a tenant in `product`. Idempotent on fleet_tenant_id: a settled tenant is returned
   * as-is; a `provisioning` tenant is resumed; a `provision_failed` tenant is retried.
   */
  async function provisionInProduct(product: string, request: ProvisionRequest): Promise<OrchestratorResult> {
    if (!isFleetProduct(product)) return { ok: false, code: "UNKNOWN_PRODUCT", message: `Unknown product: ${product}` };
    const slugCheck = validateSlug(request?.slug);
    if (!slugCheck.ok) return { ok: false, code: "INVALID_SLUG", message: slugCheck.reason };

    const fleetTenantId = request.fleet_tenant_id ?? uuid();
    const parsed = FleetCreateRequestSchema.safeParse({ ...request, fleet_tenant_id: fleetTenantId });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return { ok: false, code: "INVALID_REQUEST", message: `${issue?.path.join(".") ?? ""}: ${issue?.message ?? "invalid"}` };
    }
    const createRequest = parsed.data;

    try {
      productConfig(product);
    } catch (e) {
      return { ok: false, code: "CONFIG_MISSING", message: e instanceof Error ? e.message : "configuration missing" };
    }

    let row = await store.getTenant(fleetTenantId);
    if (row) {
      if (row.product !== product || row.slug !== createRequest.slug) {
        return { ok: false, code: "CONFLICT", message: "fleet_tenant_id already registered for a different product or slug.", tenant: row };
      }
      if (SETTLED.has(row.tenant_status)) return { ok: true, tenant: row, idempotent: true };
      if (row.tenant_status === "provision_failed") {
        const retried = await store.updateTenant(fleetTenantId, { tenant_status: "provisioning", last_error: null }, "provision_failed");
        if (!retried) {
          const current = await store.getTenant(fleetTenantId);
          return current
            ? { ok: true, tenant: current, idempotent: true }
            : { ok: false, code: "NOT_FOUND", message: "Tenant disappeared during retry." };
        }
        row = retried;
        await recordEvent(product, fleetTenantId, "tenant.requested", { retry: true, signup_source: "control_plane" });
      }
      // status === provisioning: resume by re-sending the (idempotent) create request.
    } else {
      const trialing = createRequest.billing_status === "trialing";
      const inserted = await store.insertTenant({
        fleet_tenant_id: fleetTenantId,
        product,
        app_tenant_id: null,
        slug: createRequest.slug,
        tenant_status: "provisioning",
        billing_status: createRequest.billing_status,
        plan: createRequest.plan,
        contract_ref: createRequest.contract_ref,
        signup_source: "control_plane",
        trial_ends_at: trialing ? new Date(now().getTime() + TRIAL_DAYS * 86_400_000).toISOString() : null,
        last_error: null,
      });
      if (!inserted.ok) {
        if (inserted.conflict === "fleet_tenant_id") {
          // Concurrent request with the same id: return whatever the winner registered.
          const winner = await store.getTenant(fleetTenantId);
          if (winner) return { ok: true, tenant: winner, idempotent: true };
        }
        return {
          ok: false,
          code: "CONFLICT",
          message: inserted.conflict === "slug" ? `Slug "${createRequest.slug}" is already registered for ${product}.` : "Registry conflict.",
        };
      }
      row = inserted.row;
      await recordEvent(product, fleetTenantId, "tenant.requested", {
        signup_source: "control_plane",
        plan: createRequest.plan,
        billing_status: createRequest.billing_status,
      });
    }

    const call = await signedCall(product, "POST", "/api/fleet/tenants", createRequest);
    if (!call.ok) return markFailed(row, call.error);

    const response = FleetCreateResponseSchema.safeParse(call.json);
    if (!response.success || response.data.fleet_tenant_id !== fleetTenantId) {
      return markFailed(row, "product returned an invalid create_response");
    }
    const remote = response.data;

    if (remote.tenant_status === "provisioning") {
      // Product is still working (outbox); keep provisioning and let getStatus settle it.
      const updated = await store.updateTenant(
        fleetTenantId,
        { app_tenant_id: remote.app_tenant_id, billing_status: remote.billing_status },
        "provisioning"
      );
      return { ok: true, tenant: updated ?? row, idempotent: false, remote_status: remote.tenant_status };
    }
    if (!isLegalTransition("provisioning", remote.tenant_status)) {
      return markFailed(row, `product reported illegal status provisioning → ${remote.tenant_status}`);
    }
    const updated = await store.updateTenant(
      fleetTenantId,
      {
        app_tenant_id: remote.app_tenant_id,
        tenant_status: remote.tenant_status,
        billing_status: remote.billing_status,
        last_error: remote.tenant_status === "provision_failed" ? "product reported provision_failed" : null,
      },
      "provisioning"
    );
    if (!updated) {
      // Someone else (e.g. the product's own ingest event) moved it first; return current state.
      const current = await store.getTenant(fleetTenantId);
      return current ? { ok: true, tenant: current, idempotent: true } : { ok: false, code: "NOT_FOUND", message: "Tenant not found." };
    }
    await recordEvent(
      product,
      fleetTenantId,
      remote.tenant_status === "provision_failed" ? "tenant.provision_failed" : "tenant.provisioned",
      {
        tenant_status: remote.tenant_status,
        billing_status: remote.billing_status,
        plan: updated.plan,
        signup_source: "control_plane",
      }
    );
    if (remote.tenant_status === "provision_failed") {
      return { ok: false, code: "PRODUCT_ERROR", message: "product reported provision_failed", tenant: updated };
    }
    return { ok: true, tenant: updated, idempotent: false, remote_status: remote.tenant_status };
  }

  async function lifecycle(fleetTenantId: string, action: LifecycleAction): Promise<OrchestratorResult> {
    const row = await store.getTenant(fleetTenantId);
    if (!row) return { ok: false, code: "NOT_FOUND", message: "Tenant not found." };
    const target = ACTION_TARGET[action];
    if (row.tenant_status === target) return { ok: true, tenant: row, idempotent: true };
    if (!isLegalTransition(row.tenant_status, target)) {
      return { ok: false, code: "ILLEGAL_TRANSITION", message: `Illegal transition ${row.tenant_status} → ${target}.`, tenant: row };
    }
    let call;
    try {
      call = await signedCall(row.product, "POST", `/api/fleet/tenants/${encodeURIComponent(fleetTenantId)}/${action}`, {
        fleet_tenant_id: fleetTenantId,
      });
    } catch (e) {
      return { ok: false, code: "CONFIG_MISSING", message: e instanceof Error ? e.message : "configuration missing", tenant: row };
    }
    if (!call.ok) return { ok: false, code: "PRODUCT_ERROR", message: call.error, tenant: row };

    const remote = FleetStatusResponseSchema.safeParse(call.json);
    const reported = remote.success ? remote.data.tenant_status : undefined;
    if (reported && reported !== target) {
      return {
        ok: false,
        code: "PRODUCT_ERROR",
        message: `product reported ${reported} after ${action}; expected ${target}. Use refresh to reconcile.`,
        tenant: row,
      };
    }
    const updated = await store.updateTenant(fleetTenantId, { tenant_status: target, last_error: null }, row.tenant_status);
    if (!updated) {
      const current = await store.getTenant(fleetTenantId);
      return { ok: false, code: "CONFLICT", message: "Tenant status changed concurrently; refresh and retry.", tenant: current ?? row };
    }
    await recordEvent(row.product, fleetTenantId, ACTION_EVENT[action], { from: row.tenant_status, to: target });
    return { ok: true, tenant: updated, idempotent: false, remote_status: target };
  }

  /** Polls the product and reconciles the registry when the product reports a legal transition. */
  async function getStatus(fleetTenantId: string): Promise<OrchestratorResult> {
    const row = await store.getTenant(fleetTenantId);
    if (!row) return { ok: false, code: "NOT_FOUND", message: "Tenant not found." };
    let call;
    try {
      call = await signedCall(row.product, "GET", `/api/fleet/tenants/${encodeURIComponent(fleetTenantId)}`, undefined);
    } catch (e) {
      return { ok: false, code: "CONFIG_MISSING", message: e instanceof Error ? e.message : "configuration missing", tenant: row };
    }
    if (!call.ok) return { ok: false, code: "PRODUCT_ERROR", message: call.error, tenant: row };
    const parsed = FleetStatusResponseSchema.safeParse(call.json);
    if (!parsed.success || !parsed.data.tenant_status) {
      return { ok: false, code: "PRODUCT_ERROR", message: "product returned an invalid status response", tenant: row };
    }
    const remote = parsed.data;
    const remoteStatus = remote.tenant_status as TenantStatus;
    if (remote.fleet_tenant_id && remote.fleet_tenant_id !== fleetTenantId) {
      return { ok: false, code: "PRODUCT_ERROR", message: "product returned a different fleet_tenant_id", tenant: row };
    }

    const patch: Parameters<FleetRegistryStore["updateTenant"]>[1] = {};
    if (remote.app_tenant_id && remote.app_tenant_id !== row.app_tenant_id) patch.app_tenant_id = remote.app_tenant_id;
    if (remote.billing_status && remote.billing_status !== row.billing_status) patch.billing_status = remote.billing_status;
    if (remote.plan && remote.plan !== row.plan) patch.plan = remote.plan;

    let statusChanged = false;
    if (remoteStatus !== row.tenant_status) {
      if (!isLegalTransition(row.tenant_status, remoteStatus)) {
        return {
          ok: false,
          code: "ILLEGAL_TRANSITION",
          message: `Product reports ${remoteStatus}, but ${row.tenant_status} → ${remoteStatus} is not a legal transition. Registry left unchanged.`,
          tenant: row,
        };
      }
      patch.tenant_status = remoteStatus;
      patch.last_error = remoteStatus === "provision_failed" ? "product reported provision_failed" : null;
      statusChanged = true;
    }
    if (Object.keys(patch).length === 0) return { ok: true, tenant: row, idempotent: true, remote_status: remoteStatus };

    const updated = await store.updateTenant(fleetTenantId, patch, row.tenant_status);
    if (!updated) {
      const current = await store.getTenant(fleetTenantId);
      return { ok: false, code: "CONFLICT", message: "Tenant status changed concurrently; refresh again.", tenant: current ?? row };
    }
    if (statusChanged) {
      let ev: FleetEventType | undefined = STATUS_EVENT[remoteStatus];
      if (remoteStatus === "active" && row.tenant_status === "provisioning") ev = "tenant.provisioned";
      if (remoteStatus === "active" && (row.tenant_status === "suspended" || row.tenant_status === "archived")) {
        ev = "tenant.restored";
      }
      if (ev) await recordEvent(row.product, fleetTenantId, ev, { from: row.tenant_status, to: remoteStatus, observed_by: "status_poll" });
    }
    if (patch.plan) await recordEvent(row.product, fleetTenantId, "tenant.plan_changed", { from: row.plan, to: patch.plan });
    if (patch.billing_status) {
      await recordEvent(row.product, fleetTenantId, "tenant.billing_status_changed", { from: row.billing_status, to: patch.billing_status });
    }
    return { ok: true, tenant: updated, idempotent: false, remote_status: remoteStatus };
  }

  return {
    provisionInProduct,
    suspend: (id: string) => lifecycle(id, "suspend"),
    restore: (id: string) => lifecycle(id, "restore"),
    archive: (id: string) => lifecycle(id, "archive"),
    getStatus,
  };
}

export type FleetOrchestrator = ReturnType<typeof createFleetOrchestrator>;
