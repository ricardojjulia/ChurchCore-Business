/**
 * COUNCIL-2026-016 REQ-016-11: control-plane operator authentication hardening.
 * Regression tests for: forgeable session cookie accepted by middleware, built-in
 * backdoor password/usernames, built-in default HMAC key.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import {
  authenticateOperatorCredentials,
  signOperatorSession,
  verifyOperatorSession,
} from "@/lib/auth/session";
import { verifyOperatorSessionEdge } from "@/lib/auth/session-edge";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import { z } from "zod";

const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  headers: async () => new Map([["user-agent", "vitest"]]),
  cookies: async () => ({
    get: (name: string) => (cookieStore.has(name) ? { value: cookieStore.get(name) } : undefined),
  }),
}));

const SECRET = "vitest-control-plane-session-secret-0123456789";
const ENV_KEYS = [
  "CONTROL_PLANE_SESSION_SECRET",
  "CRON_SECRET",
  "CONTROL_PLANE_ADMIN_USERNAME",
  "CONTROL_PLANE_ADMIN_PASSWORD",
  "CONTROL_PLANE_OPERATOR_EMAIL",
  "CONTROL_PLANE_OPERATOR_PASSWORD",
  "CONTROL_PLANE_OPERATOR_EMAILS",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_URL",
];
const saved: Record<string, string | undefined> = {};

function req(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", `cc_cp_session=${cookie}`);
  return new NextRequest(new URL(path, "https://control.example.test"), { headers });
}

function sign() {
  return signOperatorSession({
    sub: "op_1",
    username: "operator@example.test",
    role: "sovereign_architect",
    auth_mode: "sovereign_hmac",
  });
}

beforeEach(() => {
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  process.env.CONTROL_PLANE_SESSION_SECRET = SECRET;
  cookieStore.clear();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("middleware verifies session signatures (no shape-only check)", () => {
  it("rejects a forged cookie that merely looks like a token", async () => {
    const forged = "eyJzdWIiOiJhdHRhY2tlciJ9.Zm9yZ2VkLXNpZ25hdHVyZS1ub3QtdmFsaWQ";
    const res = await middleware(req("/api/repo-ops", forged));
    expect(res.status).toBe(401);
  });

  it("rejects a token signed with the old built-in default key", async () => {
    process.env.CONTROL_PLANE_SESSION_SECRET = "churchcore-sovereign-control-plane-default-hmac-key-2026";
    const token = sign();
    process.env.CONTROL_PLANE_SESSION_SECRET = SECRET;
    const res = await middleware(req("/api/save-config", token));
    expect(res.status).toBe(401);
  });

  it("accepts a genuinely signed session", async () => {
    const res = await middleware(req("/api/fleet-status", sign()));
    expect(res.status).toBe(200);
  });

  it("redirects pages to /login without a valid session", async () => {
    const res = await middleware(req("/dashboard"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("fails closed when no signing secret is configured", async () => {
    const token = sign();
    delete process.env.CONTROL_PLANE_SESSION_SECRET;
    expect(await verifyOperatorSessionEdge(token)).toBeNull();
    expect(verifyOperatorSession(token)).toBeNull();
    expect((await middleware(req("/api/repo-ops", token))).status).toBe(401);
    expect(() => sign()).toThrow(/CONTROL_PLANE_SESSION_SECRET/);
  });

  it("rejects a short legacy CRON_SECRET as a signing key", async () => {
    delete process.env.CONTROL_PLANE_SESSION_SECRET;
    process.env.CRON_SECRET = "short";
    expect(() => sign()).toThrow();
  });
});

describe("operator credentials have no built-in backdoor", () => {
  it.each([
    ["admin", "churchcore-sovereign-2026"],
    ["rjulia", "churchcore-sovereign-2026"],
    ["admin@churchcore.io", "churchcore-sovereign-2026"],
  ])("rejects legacy built-in credential %s", async (user, pass) => {
    const r = await authenticateOperatorCredentials(user, pass);
    expect(r.authenticated).toBe(false);
  });

  it("rejects the legacy backdoor even when a real operator password is configured", async () => {
    process.env.CONTROL_PLANE_ADMIN_USERNAME = "operator@example.test";
    process.env.CONTROL_PLANE_ADMIN_PASSWORD = "a-long-configured-password";
    expect((await authenticateOperatorCredentials("admin", "churchcore-sovereign-2026")).authenticated).toBe(false);
    expect((await authenticateOperatorCredentials("operator@example.test", "churchcore-sovereign-2026")).authenticated).toBe(false);
    expect((await authenticateOperatorCredentials("rjulia", "a-long-configured-password")).authenticated).toBe(false);
  });

  it("accepts only the single configured operator credential", async () => {
    process.env.CONTROL_PLANE_ADMIN_USERNAME = "operator@example.test";
    process.env.CONTROL_PLANE_ADMIN_PASSWORD = "a-long-configured-password";
    const ok = await authenticateOperatorCredentials("Operator@Example.test", "a-long-configured-password");
    expect(ok.authenticated).toBe(true);
    expect(ok.token && verifyOperatorSession(ok.token)).toBeTruthy();
  });

  it("disables password login when the configured password is too short", async () => {
    process.env.CONTROL_PLANE_ADMIN_USERNAME = "operator@example.test";
    process.env.CONTROL_PLANE_ADMIN_PASSWORD = "short";
    expect((await authenticateOperatorCredentials("operator@example.test", "short")).authenticated).toBe(false);
  });
});

describe("privileged actions re-verify the operator session", () => {
  const action = createProtectedAction(z.object({ x: z.string() }), async () => "done", {
    actionName: "test_privileged",
    requireOperatorSession: true,
  });

  it("refuses without a session", async () => {
    const r = await action({ x: "hello" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.code).toBe("UNAUTHORIZED_ORIGIN");
  });

  it("refuses a forged session", async () => {
    cookieStore.set("cc_cp_session", "eyJzdWIiOiJ4In0.bm90LWEtcmVhbC1zaWduYXR1cmU");
    expect((await action({ x: "hello" })).success).toBe(false);
  });

  it("allows a verified session", async () => {
    cookieStore.set("cc_cp_session", sign());
    expect((await action({ x: "hello" })).success).toBe(true);
  });
});
