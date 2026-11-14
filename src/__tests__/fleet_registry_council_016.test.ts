/**
 * COUNCIL-2026-016 Phase 1.3: fleet spec module, slug rules, lifecycle transitions, HMAC, and
 * migration ↔ fleet-tenancy.json drift checks.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  AUDIT_EVENTS,
  BILLING_STATUSES,
  FLEET_EVENT_TYPES,
  FLEET_PRODUCTS,
  FUNNEL_EVENTS,
  PLAN_KEYS,
  RESERVED_SLUGS,
  TENANT_STATUSES,
  TRANSITIONS,
  isLegalTransition,
  validateSlug,
} from "@/lib/fleet/spec";
import {
  FLEET_SIGNATURE_HEADER,
  FLEET_TIMESTAMP_HEADER,
  FleetSecretMissingError,
  computeFleetSignature,
  getProvisioningSecret,
  productEnvKey,
  signFleetRequest,
  verifyFleetSignature,
} from "@/lib/fleet/hmac";

const ROOT = process.cwd();
const spec = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/control-plane/tenancy/fleet-tenancy.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/governance-sync/manifest.json"), "utf8"));
const SECRET = "fleet-test-secret-0123456789abcdef-0123456789";

describe("spec module mirrors fleet-tenancy.json", () => {
  it("exposes the exact lifecycle, billing, plan and event vocabularies", () => {
    expect([...TENANT_STATUSES]).toEqual(spec.lifecycle.tenant_status);
    expect([...BILLING_STATUSES]).toEqual(spec.lifecycle.billing_status);
    expect([...PLAN_KEYS]).toEqual(spec.subscription.tiers.map((t: { key: string }) => t.key));
    expect([...AUDIT_EVENTS]).toEqual(spec.audit_events);
    expect([...FUNNEL_EVENTS]).toEqual(spec.funnel_events);
    expect(new Set(FLEET_EVENT_TYPES)).toEqual(new Set([...spec.audit_events, ...spec.funnel_events]));
    expect([...FLEET_PRODUCTS]).toEqual(manifest.registered_products.map((p: { name: string }) => p.name));
    expect(TRANSITIONS).toEqual(spec.lifecycle.transitions);
  });
});

describe("slug validation", () => {
  it.each(["grace", "first-baptist", "a1b2c3", "abc", "a".repeat(30), "st-marys-2"])("accepts %s", (s) => {
    expect(validateSlug(s).ok).toBe(true);
  });
  it.each([
    ["ab", "too short"],
    ["a".repeat(31), "too long"],
    ["1church", "starts with digit"],
    ["Grace", "uppercase"],
    ["grace--church", "double hyphen"],
    ["grace-", "trailing hyphen"],
    ["-grace", "leading hyphen"],
    ["grace_church", "underscore"],
    ["grace church", "space"],
  ])("rejects %s (%s)", (s) => {
    expect(validateSlug(s).ok).toBe(false);
  });
  it("rejects every reserved slug from the spec", () => {
    expect(RESERVED_SLUGS.size).toBe(spec.identity.reserved_slugs.length);
    for (const s of spec.identity.reserved_slugs as string[]) {
      if (s.length < 3) continue; // also rejected by length
      const res = validateSlug(s);
      expect(res.ok, s).toBe(false);
      if (!res.ok) expect(res.reason).toMatch(/reserved/);
    }
    expect(validateSlug("admin").ok).toBe(false);
    expect(validateSlug("churchcore").ok).toBe(false);
    expect(validateSlug("www").ok).toBe(false);
  });
  it("rejects non-strings", () => {
    expect(validateSlug(undefined).ok).toBe(false);
    expect(validateSlug(42).ok).toBe(false);
  });
});

describe("lifecycle transitions", () => {
  it("allows every transition listed in the spec", () => {
    for (const [from, tos] of Object.entries(spec.lifecycle.transitions as Record<string, string[]>)) {
      for (const to of tos) expect(isLegalTransition(from, to), `${from}→${to}`).toBe(true);
    }
  });
  it("rejects every transition not listed (including same-state)", () => {
    for (const from of TENANT_STATUSES) {
      for (const to of TENANT_STATUSES) {
        const listed = (spec.lifecycle.transitions[from] as string[]).includes(to);
        expect(isLegalTransition(from, to), `${from}→${to}`).toBe(listed);
      }
    }
  });
  it.each([
    ["provisioning", "suspended"],
    ["purged", "active"],
    ["active", "provisioning"],
    ["provision_failed", "active"],
    ["suspended", "purged"],
    ["active", "bogus"],
    ["bogus", "active"],
  ])("rejects %s → %s", (from, to) => {
    expect(isLegalTransition(from, to)).toBe(false);
  });
});

describe("fleet HMAC (fleet_api.auth)", () => {
  const body = JSON.stringify({ fleet_tenant_id: "7c9e6679-7425-40de-944b-e07fc1f90ae7", slug: "grace" });
  const now = 1_800_000_000;

  it("signs `${timestamp}.${raw_body}` with HMAC-SHA256 and verifies", () => {
    const h = signFleetRequest(body, SECRET, now);
    expect(h[FLEET_TIMESTAMP_HEADER]).toBe(String(now));
    expect(h[FLEET_SIGNATURE_HEADER]).toBe(computeFleetSignature(SECRET, String(now), body));
    expect(h[FLEET_SIGNATURE_HEADER]).toMatch(/^[0-9a-f]{64}$/);
    const res = verifyFleetSignature({
      rawBody: body,
      timestamp: h[FLEET_TIMESTAMP_HEADER],
      signature: h[FLEET_SIGNATURE_HEADER],
      secret: SECRET,
      nowSeconds: now + 10,
    });
    expect(res).toEqual({ ok: true });
  });

  it("rejects a tampered body", () => {
    const h = signFleetRequest(body, SECRET, now);
    const res = verifyFleetSignature({
      rawBody: body.replace("grace", "evil"),
      timestamp: h[FLEET_TIMESTAMP_HEADER],
      signature: h[FLEET_SIGNATURE_HEADER],
      secret: SECRET,
      nowSeconds: now,
    });
    expect(res).toEqual({ ok: false, reason: "bad_signature" });
  });

  it("rejects a tampered timestamp and a wrong secret", () => {
    const h = signFleetRequest(body, SECRET, now);
    expect(
      verifyFleetSignature({ rawBody: body, timestamp: String(now + 1), signature: h[FLEET_SIGNATURE_HEADER], secret: SECRET, nowSeconds: now })
    ).toEqual({ ok: false, reason: "bad_signature" });
    expect(
      verifyFleetSignature({
        rawBody: body,
        timestamp: h[FLEET_TIMESTAMP_HEADER],
        signature: h[FLEET_SIGNATURE_HEADER],
        secret: `${SECRET}-other`,
        nowSeconds: now,
      })
    ).toEqual({ ok: false, reason: "bad_signature" });
  });

  it("rejects stale and future timestamps beyond 300s, accepts the boundary", () => {
    const h = signFleetRequest(body, SECRET, now);
    const v = (n: number) =>
      verifyFleetSignature({ rawBody: body, timestamp: h[FLEET_TIMESTAMP_HEADER], signature: h[FLEET_SIGNATURE_HEADER], secret: SECRET, nowSeconds: n });
    expect(v(now + 300)).toEqual({ ok: true });
    expect(v(now + 301)).toEqual({ ok: false, reason: "stale_timestamp" });
    expect(v(now - 301)).toEqual({ ok: false, reason: "stale_timestamp" });
  });

  it("rejects missing or malformed headers", () => {
    const h = signFleetRequest(body, SECRET, now);
    expect(verifyFleetSignature({ rawBody: body, timestamp: null, signature: h[FLEET_SIGNATURE_HEADER], secret: SECRET, nowSeconds: now }).ok).toBe(false);
    expect(verifyFleetSignature({ rawBody: body, timestamp: h[FLEET_TIMESTAMP_HEADER], signature: "", secret: SECRET, nowSeconds: now }).ok).toBe(false);
    expect(verifyFleetSignature({ rawBody: body, timestamp: "1.5e9", signature: h[FLEET_SIGNATURE_HEADER], secret: SECRET, nowSeconds: now })).toEqual({
      ok: false,
      reason: "malformed_timestamp",
    });
    expect(verifyFleetSignature({ rawBody: body, timestamp: h[FLEET_TIMESTAMP_HEADER], signature: "zz", secret: SECRET, nowSeconds: now })).toEqual({
      ok: false,
      reason: "malformed_signature",
    });
  });

  it("fails closed when the secret is missing or weak", () => {
    const h = signFleetRequest(body, SECRET, now);
    expect(verifyFleetSignature({ rawBody: body, timestamp: h[FLEET_TIMESTAMP_HEADER], signature: h[FLEET_SIGNATURE_HEADER], secret: undefined, nowSeconds: now })).toEqual({
      ok: false,
      reason: "missing_secret",
    });
    expect(verifyFleetSignature({ rawBody: body, timestamp: h[FLEET_TIMESTAMP_HEADER], signature: h[FLEET_SIGNATURE_HEADER], secret: "short", nowSeconds: now }).ok).toBe(false);
    expect(() => signFleetRequest(body, "", now)).toThrow(FleetSecretMissingError);
  });

  it("reads per-product secrets from FLEET_PROVISIONING_SECRET_<PRODUCT_KEY> and fails closed", () => {
    expect(productEnvKey("ChurchCore-LMS")).toBe("CHURCHCORE_LMS");
    expect(productEnvKey("ChurchCoreCare")).toBe("CHURCHCORECARE");
    expect(productEnvKey("FaithFullScholars")).toBe("FAITHFULLSCHOLARS");
    expect(getProvisioningSecret("ChurchCore-LMS", { FLEET_PROVISIONING_SECRET_CHURCHCORE_LMS: SECRET })).toBe(SECRET);
    expect(() => getProvisioningSecret("ChurchCore-LMS", {})).toThrow(FleetSecretMissingError);
    expect(() => getProvisioningSecret("ChurchCore-LMS", { FLEET_PROVISIONING_SECRET: SECRET })).toThrow(/FLEET_PROVISIONING_SECRET_CHURCHCORE_LMS/);
  });

  it("is dependency-free (Node built-ins only) so it can move to @churchcore/fleet-signup/server", () => {
    const src = fs.readFileSync(path.join(ROOT, "src/lib/fleet/hmac.ts"), "utf8");
    const imports = [...src.matchAll(/^import[^"']*["']([^"']+)["']/gm)].map((m) => m[1]);
    expect(imports.every((i) => i.startsWith("node:"))).toBe(true);
  });
});

describe("migrations match the spec and enforce RLS / append-only", () => {
  const dir = path.join(ROOT, "supabase/migrations");
  const registry = fs.readFileSync(path.join(dir, "20261114000000_fleet_tenants_registry.sql"), "utf8");
  const events = fs.readFileSync(path.join(dir, "20261114000100_fleet_tenant_events.sql"), "utf8");

  function checkList(sql: string, constraint: string): string[] {
    const rx = new RegExp(`CONSTRAINT ${constraint}\\s+CHECK \\((?:\\w+) IN \\(([^)]*)\\)`, "m");
    const m = sql.match(rx);
    expect(m, constraint).not.toBeNull();
    return [...m![1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  }

  it("fleet_tenants CHECK constraints equal fleet-tenancy.json exactly", () => {
    expect(checkList(registry, "fleet_tenants_product_check")).toEqual(manifest.registered_products.map((p: { name: string }) => p.name));
    expect(checkList(registry, "fleet_tenants_tenant_status_check")).toEqual(spec.lifecycle.tenant_status);
    expect(checkList(registry, "fleet_tenants_billing_status_check")).toEqual(spec.lifecycle.billing_status);
    expect(checkList(registry, "fleet_tenants_plan_check")).toEqual(spec.subscription.tiers.map((t: { key: string }) => t.key));
    expect(checkList(registry, "fleet_tenants_signup_source_check")).toEqual(["self_serve", "control_plane"]);
    expect(registry).toContain(`slug ~ '${spec.identity.slug_regex}'`);
    expect(registry).toContain(`char_length(slug) BETWEEN ${spec.identity.slug_min_length} AND ${spec.identity.slug_max_length}`);
    const reservedBlock = registry.match(/slug <> ALL \(ARRAY\[([\s\S]*?)\]::text\[\]\)/);
    expect([...reservedBlock![1].matchAll(/'([^']+)'/g)].map((x) => x[1])).toEqual(spec.identity.reserved_slugs);
    expect(registry).toMatch(/CONSTRAINT fleet_tenants_product_slug_key UNIQUE \(product, slug\)/);
    expect(registry).toMatch(/CONSTRAINT fleet_tenants_product_app_tenant_key UNIQUE \(product, app_tenant_id\)/);
  });

  it("the DB transition trigger encodes exactly lifecycle.transitions", () => {
    for (const [from, tos] of Object.entries(spec.lifecycle.transitions as Record<string, string[]>)) {
      const rx = new RegExp(`WHEN '${from}'\\s+THEN ARRAY\\[([^\\]]*)\\]`);
      const m = registry.match(rx);
      expect(m, from).not.toBeNull();
      expect([...m![1].matchAll(/'([^']+)'/g)].map((x) => x[1])).toEqual(tos);
    }
  });

  it("fleet_tenant_events event_type CHECK equals audit_events ∪ funnel_events", () => {
    const listed = checkList(events, "fleet_tenant_events_event_type_check");
    expect(new Set(listed)).toEqual(new Set([...spec.audit_events, ...spec.funnel_events]));
    expect(listed.length).toBe(new Set(listed).size);
    expect(checkList(events, "fleet_tenant_events_product_check")).toEqual(manifest.registered_products.map((p: { name: string }) => p.name));
  });

  it("both tables ENABLE + FORCE RLS, deny anon/authenticated, and grant only service_role", () => {
    for (const [sql, table] of [
      [registry, "fleet_tenants"],
      [events, "fleet_tenant_events"],
    ] as const) {
      expect(sql).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
      expect(sql).toContain(`ALTER TABLE public.${table} FORCE ROW LEVEL SECURITY;`);
      expect(sql).toMatch(new RegExp(`ON public\\.${table}\\s+AS RESTRICTIVE\\s+FOR ALL TO anon, authenticated\\s+USING \\(false\\)\\s+WITH CHECK \\(false\\)`));
      expect(sql).toContain(`REVOKE ALL ON TABLE public.${table} FROM PUBLIC, anon, authenticated;`);
      expect(sql).not.toMatch(new RegExp(`GRANT[^;]*ON TABLE public\\.${table} TO[^;]*(anon|authenticated)`));
    }
    expect(events).toContain("GRANT SELECT, INSERT ON TABLE public.fleet_tenant_events TO service_role;");
  });

  it("fleet_tenant_events is append-only (UPDATE/DELETE/TRUNCATE triggers)", () => {
    expect(events).toMatch(/BEFORE UPDATE OR DELETE ON public\.fleet_tenant_events\s+FOR EACH ROW EXECUTE FUNCTION public\.fleet_tenant_events_append_only\(\)/);
    expect(events).toMatch(/BEFORE TRUNCATE ON public\.fleet_tenant_events\s+FOR EACH STATEMENT/);
    expect(events).toMatch(/RAISE EXCEPTION 'fleet_tenant_events is append-only/);
  });

  it("registry stores no app data (no name/email/admin columns)", () => {
    const create = registry.match(/CREATE TABLE IF NOT EXISTS public\.fleet_tenants \(([\s\S]*?)\n\);/)![1];
    const columns = [...create.matchAll(/^\s{2}([a-z_]+)\s+(?:uuid|text|timestamptz|jsonb)/gm)].map((m) => m[1]);
    expect(columns).toEqual([
      "fleet_tenant_id",
      "product",
      "app_tenant_id",
      "slug",
      "tenant_status",
      "billing_status",
      "plan",
      "contract_ref",
      "signup_source",
      "trial_ends_at",
      "last_error",
      "created_at",
      "updated_at",
    ]);
  });
});
