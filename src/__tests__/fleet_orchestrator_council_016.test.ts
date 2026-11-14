/**
 * COUNCIL-2026-016 Phase 1.4: provisioning orchestrator, product event ingest, and operator
 * route authentication. fetch and the registry DB are mocked.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createFleetOrchestrator, type FetchLike, type ProvisionRequest } from "@/lib/fleet/orchestrator";
import { handleFleetEventIngest } from "@/lib/fleet/ingest";
import {
  FLEET_SIGNATURE_HEADER,
  FLEET_TIMESTAMP_HEADER,
  signFleetRequest,
  verifyFleetSignature,
} from "@/lib/fleet/hmac";
import { createMemoryFleetStore, type MemoryFleetStore } from "./helpers/fleet-memory-store";

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  headers: async () => new Map([["user-agent", "vitest"]]),
  cookies: async () => ({
    get: (name: string) => (cookieStore.has(name) ? { value: cookieStore.get(name) } : undefined),
  }),
}));

const SECRET = "fleet-test-secret-0123456789abcdef-0123456789";
const OTHER_SECRET = "fleet-other-secret-abcdef0123456789-abcdef01";
const ENV = {
  FLEET_PROVISIONING_SECRET_CHURCHCORE_LMS: SECRET,
  FLEET_PRODUCT_URL_CHURCHCORE_LMS: "https://lms.example.test/",
  FLEET_PROVISIONING_SECRET_CHURCHCORE_ACADEMY: OTHER_SECRET,
  FLEET_PRODUCT_URL_CHURCHCORE_ACADEMY: "https://academy.example.test",
};
const NOW = new Date("2026-11-14T12:00:00Z");
const NOW_S = Math.floor(NOW.getTime() / 1000);
const TID = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

let uuidCounter = 0;
const uuid = () => `00000000-0000-4000-8000-${String(++uuidCounter).padStart(12, "0")}`;

function request(overrides: Partial<ProvisionRequest> = {}): ProvisionRequest {
  return {
    fleet_tenant_id: TID,
    slug: "grace-chapel",
    display_name: "Grace Chapel",
    plan: "pro",
    billing_status: "trialing",
    admin: { email: "pastor@grace.example", name: "Pat Pastor" },
    timezone: "America/Chicago",
    country: "US",
    contract_ref: null,
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function setup(fetchImpl: FetchLike, store: MemoryFleetStore = createMemoryFleetStore()) {
  const fetch = vi.fn(fetchImpl);
  const orchestrator = createFleetOrchestrator({ store, fetch, env: ENV, now: () => NOW, uuid });
  return { store, fetch, orchestrator };
}

const createOk: FetchLike = async (_url, init) => {
  const body = JSON.parse(String(init?.body));
  return jsonResponse({ fleet_tenant_id: body.fleet_tenant_id, app_tenant_id: "lms-org-42", tenant_status: "active", billing_status: "trialing" });
};

beforeEach(() => {
  uuidCounter = 0;
  cookieStore.clear();
});

describe("provisionInProduct", () => {
  it("inserts provisioning row, calls the product with a valid HMAC, and settles to active", async () => {
    const { store, fetch, orchestrator } = setup(createOk);
    const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.tenant.tenant_status).toBe("active");
    expect(res.tenant.app_tenant_id).toBe("lms-org-42");
    expect(res.tenant.signup_source).toBe("control_plane");
    expect(res.tenant.trial_ends_at).toBe("2026-12-14T12:00:00.000Z");

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("https://lms.example.test/api/fleet/tenants");
    expect(init?.method).toBe("POST");
    const headers = init?.headers as Record<string, string>;
    expect(
      verifyFleetSignature({
        rawBody: String(init?.body),
        timestamp: headers[FLEET_TIMESTAMP_HEADER],
        signature: headers[FLEET_SIGNATURE_HEADER],
        secret: SECRET,
        nowSeconds: NOW_S,
      })
    ).toEqual({ ok: true });
    expect(JSON.parse(String(init?.body))).toEqual({ ...request(), fleet_tenant_id: TID });

    expect(store.events.map((e) => e.event_type)).toEqual(["tenant.requested", "tenant.provisioned"]);
    // Registry and events hold metadata only — no display name or admin identity.
    const persisted = JSON.stringify([...store.tenants.values(), ...store.events]);
    expect(persisted).not.toContain("Grace Chapel");
    expect(persisted).not.toContain("pastor@grace.example");
    expect(persisted).not.toContain("Pat Pastor");
  });

  it("mints a fleet_tenant_id when none is supplied", async () => {
    const { orchestrator } = setup(createOk);
    const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request({ fleet_tenant_id: undefined }));
    expect(res.ok && res.tenant.fleet_tenant_id).toBe("00000000-0000-4000-8000-000000000001");
  });

  it("is idempotent on fleet_tenant_id: a repeat for a settled tenant does not call the product again", async () => {
    const { store, fetch, orchestrator } = setup(createOk);
    await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    const again = await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(again.ok && again.idempotent).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(store.tenants.size).toBe(1);
    expect(store.events).toHaveLength(2);
  });

  it("refuses to reuse a fleet_tenant_id for a different slug or product", async () => {
    const { orchestrator } = setup(createOk);
    await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request({ slug: "other-church" }));
    expect(!res.ok && res.code).toBe("CONFLICT");
  });

  it("rejects a duplicate slug in the same product", async () => {
    const { orchestrator } = setup(createOk);
    await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request({ fleet_tenant_id: "11111111-1111-4111-8111-111111111111" }));
    expect(!res.ok && res.code).toBe("CONFLICT");
  });

  it("moves to provision_failed on a product error and records the error", async () => {
    const { store, orchestrator } = setup(async () => jsonResponse({ error: "boom" }, 500));
    const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.code).toBe("PRODUCT_ERROR");
    expect(res.tenant?.tenant_status).toBe("provision_failed");
    expect(store.tenants.get(TID)?.last_error).toBe("product responded HTTP 500");
    expect(store.events.map((e) => e.event_type)).toEqual(["tenant.requested", "tenant.provision_failed"]);
  });

  it("moves to provision_failed on a network error or an invalid response", async () => {
    const net = setup(async () => {
      throw new TypeError("fetch failed");
    });
    const r1 = await net.orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(!r1.ok && r1.tenant?.tenant_status).toBe("provision_failed");

    const bad = setup(async () => jsonResponse({ fleet_tenant_id: "11111111-1111-4111-8111-111111111111", app_tenant_id: "x", tenant_status: "active", billing_status: "trialing" }));
    const r2 = await bad.orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(!r2.ok && r2.tenant?.tenant_status).toBe("provision_failed");
  });

  it("retries a provision_failed tenant (provision_failed → provisioning → active)", async () => {
    let fail = true;
    const { store, fetch, orchestrator } = setup(async (url, init) => (fail ? jsonResponse({}, 503) : createOk(url, init)));
    await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(store.tenants.get(TID)?.tenant_status).toBe("provision_failed");
    fail = false;
    const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(res.ok && res.tenant.tenant_status).toBe("active");
    expect(store.tenants.get(TID)?.last_error).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(store.events.map((e) => e.event_type)).toEqual([
      "tenant.requested",
      "tenant.provision_failed",
      "tenant.requested",
      "tenant.provisioned",
    ]);
  });

  it("validates slug (format and reserved) before touching the registry or the product", async () => {
    const { store, fetch, orchestrator } = setup(createOk);
    for (const slug of ["admin", "Bad_Slug", "ab"]) {
      const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request({ slug }));
      expect(!res.ok && res.code).toBe("INVALID_SLUG");
    }
    expect(store.tenants.size).toBe(0);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails closed when the product secret or URL is missing", async () => {
    const store = createMemoryFleetStore();
    const fetch = vi.fn(createOk);
    const o = createFleetOrchestrator({ store, fetch, env: { FLEET_PRODUCT_URL_CHURCHCORE_LMS: "https://lms.example.test" }, now: () => NOW, uuid });
    const res = await o.provisionInProduct("ChurchCore-LMS", request());
    expect(!res.ok && res.code).toBe("CONFIG_MISSING");
    const o2 = createFleetOrchestrator({ store, fetch, env: { FLEET_PROVISIONING_SECRET_CHURCHCORE_LMS: SECRET }, now: () => NOW, uuid });
    expect((await o2.provisionInProduct("ChurchCore-LMS", request())).ok).toBe(false);
    const o3 = createFleetOrchestrator({
      store,
      fetch,
      env: { ...ENV, FLEET_PRODUCT_URL_CHURCHCORE_LMS: "http://lms.example.test" },
      now: () => NOW,
      uuid,
    });
    expect((await o3.provisionInProduct("ChurchCore-LMS", request())).ok).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
    expect(store.tenants.size).toBe(0);
  });

  it("rejects unknown products", async () => {
    const { orchestrator } = setup(createOk);
    const res = await orchestrator.provisionInProduct("ChurchCore-Unknown", request());
    expect(!res.ok && res.code).toBe("UNKNOWN_PRODUCT");
  });

  it("keeps provisioning when the product reports provisioning, and getStatus settles it", async () => {
    const { store, orchestrator } = setup(async (url, init) => {
      if (init?.method === "GET") {
        return jsonResponse({ fleet_tenant_id: TID, app_tenant_id: "lms-org-42", tenant_status: "active", billing_status: "trialing" });
      }
      return jsonResponse({ fleet_tenant_id: TID, app_tenant_id: "lms-org-42", tenant_status: "provisioning", billing_status: "trialing" });
    });
    const res = await orchestrator.provisionInProduct("ChurchCore-LMS", request());
    expect(res.ok && res.tenant.tenant_status).toBe("provisioning");
    const status = await orchestrator.getStatus(TID);
    expect(status.ok && status.tenant.tenant_status).toBe("active");
    expect(store.events.at(-1)?.event_type).toBe("tenant.provisioned");
  });
});

describe("lifecycle actions", () => {
  async function activeTenant() {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const ctx = setup(async (url, init) => {
      calls.push({ url, init });
      if (url.endsWith("/api/fleet/tenants")) return createOk(url, init);
      const action = url.split("/").pop();
      const status = action === "suspend" ? "suspended" : action === "archive" ? "archived" : "active";
      return jsonResponse({ fleet_tenant_id: TID, tenant_status: status });
    });
    await ctx.orchestrator.provisionInProduct("ChurchCore-LMS", request());
    return { ...ctx, calls };
  }

  it("suspend → restore → archive through legal transitions, with signed calls and events", async () => {
    const { store, orchestrator, calls } = await activeTenant();
    expect((await orchestrator.suspend(TID)).ok).toBe(true);
    expect(store.tenants.get(TID)?.tenant_status).toBe("suspended");
    expect((await orchestrator.restore(TID)).ok).toBe(true);
    expect(store.tenants.get(TID)?.tenant_status).toBe("active");
    expect((await orchestrator.archive(TID)).ok).toBe(true);
    expect(store.tenants.get(TID)?.tenant_status).toBe("archived");
    expect(calls.slice(1).map((c) => c.url)).toEqual([
      `https://lms.example.test/api/fleet/tenants/${TID}/suspend`,
      `https://lms.example.test/api/fleet/tenants/${TID}/restore`,
      `https://lms.example.test/api/fleet/tenants/${TID}/archive`,
    ]);
    expect(store.events.slice(2).map((e) => e.event_type)).toEqual(["tenant.suspended", "tenant.restored", "tenant.archived"]);
  });

  it("refuses illegal transitions without calling the product", async () => {
    const { store, fetch, orchestrator } = setup(async () => jsonResponse({}, 500));
    await orchestrator.provisionInProduct("ChurchCore-LMS", request()); // → provision_failed
    fetch.mockClear();
    const res = await orchestrator.suspend(TID);
    expect(!res.ok && res.code).toBe("ILLEGAL_TRANSITION");
    expect(fetch).not.toHaveBeenCalled();
    expect(store.tenants.get(TID)?.tenant_status).toBe("provision_failed");
  });

  it("leaves the registry unchanged when the product call fails", async () => {
    const { store, orchestrator } = await activeTenant();
    const failing = createFleetOrchestrator({ store, fetch: async () => jsonResponse({}, 502), env: ENV, now: () => NOW, uuid });
    const res = await failing.suspend(TID);
    expect(!res.ok && res.code).toBe("PRODUCT_ERROR");
    expect(store.tenants.get(TID)?.tenant_status).toBe("active");
    void orchestrator;
  });

  it("returns NOT_FOUND for unknown tenants", async () => {
    const { orchestrator } = setup(createOk);
    expect(await orchestrator.archive(TID)).toMatchObject({ ok: false, code: "NOT_FOUND" });
  });
});

// ---------------------------------------------------------------------------
// Ingest
// ---------------------------------------------------------------------------

function signedIngest(body: Record<string, unknown>, secret = SECRET, ts = NOW_S, tamper?: (raw: string) => string) {
  const raw = JSON.stringify(body);
  const h = signFleetRequest(raw, secret, ts);
  const headers = new Headers({
    [FLEET_TIMESTAMP_HEADER]: h[FLEET_TIMESTAMP_HEADER],
    [FLEET_SIGNATURE_HEADER]: h[FLEET_SIGNATURE_HEADER],
  });
  return { rawBody: tamper ? tamper(raw) : raw, headers };
}

function selfServeEvent(overrides: Record<string, unknown> = {}) {
  return {
    event_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    product: "ChurchCore-LMS",
    event_type: "tenant.provisioned",
    fleet_tenant_id: TID,
    occurred_at: "2026-11-14T11:59:00Z",
    payload: {
      signup_source: "self_serve",
      app_tenant_id: "lms-org-77",
      slug: "hope-fellowship",
      tenant_status: "active",
      billing_status: "trialing",
      plan: "pro",
      trial_ends_at: "2026-12-14T11:59:00Z",
    },
    ...overrides,
  };
}

describe("POST /api/fleet/events ingest", () => {
  const deps = (store: MemoryFleetStore) => ({ store, env: ENV, now: () => NOW });

  it("registers a self-serve tenant from tenant.provisioned", async () => {
    const store = createMemoryFleetStore();
    const res = await handleFleetEventIngest(signedIngest(selfServeEvent()), deps(store));
    expect(res.status).toBe(202);
    expect(res.body).toMatchObject({ accepted: true, duplicate: false, registry: "created" });
    expect(store.tenants.get(TID)).toMatchObject({
      product: "ChurchCore-LMS",
      slug: "hope-fellowship",
      app_tenant_id: "lms-org-77",
      tenant_status: "active",
      signup_source: "self_serve",
    });
    expect(store.events).toHaveLength(1);
    expect(store.events[0].source).toBe("product");
  });

  it("dedupes on event_id (replay is accepted, not re-applied)", async () => {
    const store = createMemoryFleetStore();
    await handleFleetEventIngest(signedIngest(selfServeEvent()), deps(store));
    const replay = await handleFleetEventIngest(signedIngest(selfServeEvent()), deps(store));
    expect(replay.status).toBe(200);
    expect(replay.body).toMatchObject({ accepted: true, duplicate: true });
    expect(store.events).toHaveLength(1);
    expect(store.tenants.size).toBe(1);
  });

  it("rejects a bad signature, a tampered body and a stale timestamp", async () => {
    const store = createMemoryFleetStore();
    const wrongSecret = await handleFleetEventIngest(signedIngest(selfServeEvent(), OTHER_SECRET), deps(store));
    expect(wrongSecret.status).toBe(401);
    const tampered = await handleFleetEventIngest(
      signedIngest(selfServeEvent(), SECRET, NOW_S, (raw) => raw.replace("hope-fellowship", "evil-fellowship")),
      deps(store)
    );
    expect(tampered.status).toBe(401);
    const stale = await handleFleetEventIngest(signedIngest(selfServeEvent(), SECRET, NOW_S - 301), deps(store));
    expect(stale.status).toBe(401);
    const unsigned = await handleFleetEventIngest({ rawBody: JSON.stringify(selfServeEvent()), headers: new Headers() }, deps(store));
    expect(unsigned.status).toBe(401);
    expect(store.events).toHaveLength(0);
    expect(store.tenants.size).toBe(0);
  });

  it("rejects one product signing for another (secret is per product)", async () => {
    const store = createMemoryFleetStore();
    // Academy's secret, but body claims ChurchCore-LMS.
    const res = await handleFleetEventIngest(signedIngest(selfServeEvent(), OTHER_SECRET), deps(store));
    expect(res.status).toBe(401);
  });

  it("forbids a product from reporting on another product's tenant", async () => {
    const store = createMemoryFleetStore();
    await handleFleetEventIngest(signedIngest(selfServeEvent()), deps(store));
    const res = await handleFleetEventIngest(
      signedIngest(
        { event_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", product: "ChurchCore-Academy", event_type: "tenant.suspended", fleet_tenant_id: TID, occurred_at: "2026-11-14T11:59:30Z", payload: {} },
        OTHER_SECRET
      ),
      deps(store)
    );
    expect(res.status).toBe(403);
    expect(store.tenants.get(TID)?.tenant_status).toBe("active");
  });

  it("rejects an unknown event_type", async () => {
    const store = createMemoryFleetStore();
    const res = await handleFleetEventIngest(signedIngest(selfServeEvent({ event_type: "tenant.exploded" })), deps(store));
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ accepted: false, error: "UNKNOWN_EVENT_TYPE" });
    expect(store.events).toHaveLength(0);
  });

  it("rejects personal data in payloads", async () => {
    const store = createMemoryFleetStore();
    const res = await handleFleetEventIngest(
      signedIngest({
        event_id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        product: "ChurchCore-LMS",
        event_type: "signup.started",
        occurred_at: "2026-11-14T11:59:00Z",
        payload: { admin_email: "someone@example.org" },
      }),
      deps(store)
    );
    expect(res.status).toBe(422);
    expect(store.events).toHaveLength(0);
  });

  it("accepts funnel events without a tenant, requires fleet_tenant_id for tenant.* events", async () => {
    const store = createMemoryFleetStore();
    const ok = await handleFleetEventIngest(
      signedIngest({ event_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", product: "ChurchCore-LMS", event_type: "signup.started", occurred_at: "2026-11-14T11:59:00Z", payload: { step: 1 } }),
      deps(store)
    );
    expect(ok.status).toBe(202);
    const missing = await handleFleetEventIngest(
      signedIngest({ event_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", product: "ChurchCore-LMS", event_type: "tenant.suspended", occurred_at: "2026-11-14T11:59:00Z", payload: {} }),
      deps(store)
    );
    expect(missing.status).toBe(400);
  });

  it("applies legal status events from the owning product and ignores illegal ones", async () => {
    const store = createMemoryFleetStore();
    await handleFleetEventIngest(signedIngest(selfServeEvent()), deps(store));
    const expired = await handleFleetEventIngest(
      signedIngest({ event_id: "f0000000-0000-4000-8000-000000000001", product: "ChurchCore-LMS", event_type: "tenant.trial_expired", fleet_tenant_id: TID, occurred_at: "2026-11-14T11:59:30Z", payload: {} }),
      deps(store)
    );
    expect(expired.body).toMatchObject({ registry: "applied" });
    expect(store.tenants.get(TID)?.tenant_status).toBe("trial_expired");
    const purged = await handleFleetEventIngest(
      signedIngest({ event_id: "f0000000-0000-4000-8000-000000000002", product: "ChurchCore-LMS", event_type: "tenant.purged", fleet_tenant_id: TID, occurred_at: "2026-11-14T11:59:40Z", payload: {} }),
      deps(store)
    );
    expect(purged.body).toMatchObject({ registry: "not_applied" });
    expect(store.tenants.get(TID)?.tenant_status).toBe("trial_expired");
  });

  it("rejects a self-serve registration with a reserved slug", async () => {
    const store = createMemoryFleetStore();
    const ev = selfServeEvent();
    const res = await handleFleetEventIngest(
      signedIngest({ ...ev, payload: { ...(ev.payload as object), slug: "admin" } }),
      deps(store)
    );
    expect(res.status).toBe(400);
    expect(store.tenants.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Operator routes and middleware
// ---------------------------------------------------------------------------

describe("operator routes refuse without a session", () => {
  const saved: Record<string, string | undefined> = {};
  const KEYS = ["CONTROL_PLANE_SESSION_SECRET", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"];
  beforeEach(() => {
    for (const k of KEYS) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    process.env.CONTROL_PLANE_SESSION_SECRET = "vitest-control-plane-session-secret-0123456789";
  });
  afterEach(() => {
    for (const k of KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("POST /api/fleet/provision returns 401 without an operator session", async () => {
    const { POST } = await import("@/app/api/fleet/provision/route");
    const res = await POST(
      new Request("https://control.example.test/api/fleet/provision", {
        method: "POST",
        body: JSON.stringify({ product: "ChurchCore-LMS", ...request() }),
      })
    );
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error.code).toBe("UNAUTHORIZED_ORIGIN");
  });

  it("POST /api/fleet/tenants/{id}/{action} returns 401 without an operator session", async () => {
    const { POST } = await import("@/app/api/fleet/tenants/[id]/[action]/route");
    const res = await POST(new Request(`https://control.example.test/api/fleet/tenants/${TID}/suspend`, { method: "POST" }), {
      params: Promise.resolve({ id: TID, action: "suspend" }),
    });
    expect(res.status).toBe(401);
  });

  it("with a valid session, provision reaches the registry (503 when unconfigured, fail closed)", async () => {
    const { signOperatorSession, SESSION_COOKIE_NAME } = await import("@/lib/auth/session");
    cookieStore.set(
      SESSION_COOKIE_NAME,
      signOperatorSession({ sub: "op_1", username: "operator@example.test", role: "sovereign_architect", auth_mode: "sovereign_hmac" })
    );
    const { POST } = await import("@/app/api/fleet/provision/route");
    const res = await POST(
      new Request("https://control.example.test/api/fleet/provision", {
        method: "POST",
        body: JSON.stringify({ product: "ChurchCore-LMS", ...request() }),
      })
    );
    expect(res.status).toBe(503);
  });

  it("middleware blocks operator fleet routes but lets the HMAC-authenticated ingest through", async () => {
    const { middleware } = await import("@/middleware");
    const mk = (p: string) => new NextRequest(new URL(p, "https://control.example.test"), { method: "POST" });
    expect((await middleware(mk("/api/fleet/provision"))).status).toBe(401);
    expect((await middleware(mk(`/api/fleet/tenants/${TID}/archive`))).status).toBe(401);
    expect((await middleware(mk("/fleet"))).status).toBe(307);
    const ingest = await middleware(mk("/api/fleet/events"));
    expect(ingest.status).toBe(200);
    expect(ingest.headers.get("x-middleware-next")).toBe("1");
  });

  it("the ingest route itself rejects unsigned requests", async () => {
    const { POST } = await import("@/app/api/fleet/events/route");
    const res = await POST(
      new Request("https://control.example.test/api/fleet/events", { method: "POST", body: JSON.stringify(selfServeEvent()) })
    );
    expect(res.status).toBe(401);
  });
});
