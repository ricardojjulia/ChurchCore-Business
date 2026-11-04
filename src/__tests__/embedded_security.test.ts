import crypto from "node:crypto";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import {
  isAuthorizedCron,
  verifyGitHubWebhookSignature,
  inspectPayloadForThreats,
  resetTokenBucketsForTests,
} from "@/lib/security/crypto-guards";
import { POST as feedbackCouncilPost } from "@/app/api/feedback-council/route";
import { POST as githubWebhookPost } from "@/app/api/webhooks/github/route";
import { POST as cronFleetSyncPost } from "@/app/api/cron/fleet-sync/route";
import {
  ratifyCouncilResolution,
  simulateSpecialistConsultation,
} from "@/actions/governance";
import {
  auditSqlMigrationsText,
  runSecurityAuditSimulation,
} from "../../scripts/audit-rls-isolation";

vi.mock("next/headers", () => ({
  headers: async () =>
    new Map([
      ["x-vercel-ip", "203.0.113.195"],
      ["user-agent", "Vitest-Security-Runner"],
    ]),
}));

const MockSchema = z.object({
  safeInput: z.string().min(5, "Input must contain at least 5 characters"),
});

describe("COUNCIL-2026-012 / DIR-2026-EMBEDDED-SEC-001: Embedded Security Guardrails Suite", () => {
  beforeEach(() => {
    resetTokenBucketsForTests();
  });

  it("traps structural variations breaching schema configurations (INVALID_INPUT)", async () => {
    const action = createProtectedAction(MockSchema, async (data) => data);
    const response = await action({ safeInput: "four" });

    expect(response.success).toBe(false);
    if (!response.success) {
      expect(response.error.code).toBe("INVALID_INPUT");
      expect(response.error.isThreat).toBe(false);
      expect(response.error.targetField).toBe("safeInput");
    }
  });

  it("allows valid payloads through cleanly and extracts x-vercel-ip context", async () => {
    const action = createProtectedAction(MockSchema, async (data, ctx) => ({
      echo: data.safeInput,
      ip: ctx.ip,
    }));

    const response = await action({ safeInput: "validPayload" });
    expect(response.success).toBe(true);
    if (response.success) {
      expect(response.data.echo).toBe("validPayload");
      expect(response.data.ip).toBe("203.0.113.195");
    }
  });

  it("blocks SQL injection, XSS, path traversal, and command injection in-process (THREAT_DETECTED)", async () => {
    const action = createProtectedAction(MockSchema, async (data) => data);

    const sqliResponse = await action({
      safeInput: "admin' UNION ALL SELECT password FROM users--",
    });
    expect(sqliResponse.success).toBe(false);
    if (!sqliResponse.success) {
      expect(sqliResponse.error.code).toBe("THREAT_DETECTED");
      expect(sqliResponse.error.isThreat).toBe(true);
      expect(sqliResponse.error.threatReason).toBe("SQL_INJECTION");
    }

    const xssResponse = await action({
      safeInput: "<script>alert('xss')</script>",
    });
    expect(xssResponse.success).toBe(false);
    if (!xssResponse.success) {
      expect(xssResponse.error.code).toBe("THREAT_DETECTED");
      expect(xssResponse.error.isThreat).toBe(true);
      expect(xssResponse.error.threatReason).toBe("XSS_VECTOR");
    }

    const pathTraversal = inspectPayloadForThreats({ file: "../../etc/passwd" });
    expect(pathTraversal.isThreat).toBe(true);
    expect(pathTraversal.reason).toBe("PATH_TRAVERSAL");

    const cmdInjection = inspectPayloadForThreats({
      cmd: "echo ok; rm -rf /tmp/data",
    });
    expect(cmdInjection.isThreat).toBe(true);
    expect(cmdInjection.reason).toBe("COMMAND_INJECTION");
  });

  it("enforces token-bucket rate limits to prevent AI wallet drain & brute force (RATE_LIMIT_EXCEEDED)", async () => {
    const action = createProtectedAction(MockSchema, async (data) => data, {
      actionName: "test_bucket",
      rateLimit: { refillRate: 1, intervalMs: 60_000, capacity: 2 },
    });

    const first = await action({ safeInput: "hello-world-1" });
    const second = await action({ safeInput: "hello-world-2" });
    const third = await action({ safeInput: "hello-world-3" });

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(third.success).toBe(false);
    if (!third.success) {
      expect(third.error.code).toBe("RATE_LIMIT_EXCEEDED");
    }
  });

  it("fails closed when the security evaluator encounters an internal failure without leaking raw err to console.error", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const action = createProtectedAction(MockSchema, async (data) => data, {
        simulateEvaluatorFailure: true,
      });
      const res = await action({ safeInput: "validPayload" });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.code).toBe("INTERNAL_SECURITY_FAIL");
        expect(res.error.isThreat).toBe(true);
      }
      expect(errSpy).toHaveBeenCalledWith(
        "[SECURITY] Embedded guardrail evaluation failed closed (INTERNAL_SECURITY_FAIL)."
      );
      expect(errSpy.mock.calls[0]?.length).toBe(1);
    } finally {
      errSpy.mockRestore();
    }
  });

  it("validates Vercel Cron secrets in constant time", () => {
    const secret = "super-secret-cron-token-2026";
    expect(isAuthorizedCron(`Bearer ${secret}`, secret)).toBe(true);
    expect(isAuthorizedCron("Bearer wrong-token", secret)).toBe(false);
    expect(isAuthorizedCron(null, secret)).toBe(false);
    expect(isAuthorizedCron(`Bearer ${secret}`, undefined)).toBe(false);
  });

  it("verifies GitHub Webhook HMAC-SHA256 signatures in constant time", () => {
    const secret = "whsec_control_plane_2026";
    const body = JSON.stringify({
      event: "push",
      repository: { full_name: "ricardojjulia/ChurchCore-Business" },
    });
    const validSig =
      "sha256=" +
      crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex");

    expect(verifyGitHubWebhookSignature(body, validSig, secret)).toBe(true);
    expect(
      verifyGitHubWebhookSignature(body + "tampered", validSig, secret)
    ).toBe(false);
    expect(verifyGitHubWebhookSignature(body, "sha256=deadbeef", secret)).toBe(
      false
    );
  });

  it("blocks malicious SQLi/XSS payloads on POST /api/feedback-council with HTTP 403 THREAT_DETECTED", async () => {
    const req = new Request("http://localhost:3333/api/feedback-council", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: "churchcore-orthos",
        severity: "high",
        summary: "Malicious payload <script>alert('hacked')</script>",
        details: "Testing XSS guardrail",
      }),
    });

    const res = await feedbackCouncilPost(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe("THREAT_DETECTED");
    expect(body.error.isThreat).toBe(true);
  });

  it("fails closed on POST /api/webhooks/github and POST /api/cron/fleet-sync when secrets and headers are unset", async () => {
    const prevCron = process.env.CRON_SECRET;
    const prevWebhook = process.env.WEBHOOK_SECRET;
    const prevGhWebhook = process.env.GITHUB_WEBHOOK_SECRET;
    delete process.env.CRON_SECRET;
    delete process.env.WEBHOOK_SECRET;
    delete process.env.GITHUB_WEBHOOK_SECRET;
    try {
      const unsignedWebhookReq = new Request(
        "http://localhost:3333/api/webhooks/github",
        {
          method: "POST",
          body: JSON.stringify({ repository: { full_name: "ricardojjulia/ChurchCore" } }),
        }
      );
      const resWebhook = await githubWebhookPost(unsignedWebhookReq);
      expect(resWebhook.status).toBe(401);

      const unsignedCronReq = new Request(
        "http://localhost:3333/api/cron/fleet-sync",
        {
          method: "POST",
        }
      );
      const resCron = await cronFleetSyncPost(unsignedCronReq);
      expect(resCron.status).toBe(401);
    } finally {
      if (prevCron !== undefined) process.env.CRON_SECRET = prevCron;
      if (prevWebhook !== undefined) process.env.WEBHOOK_SECRET = prevWebhook;
      if (prevGhWebhook !== undefined)
        process.env.GITHUB_WEBHOOK_SECRET = prevGhWebhook;
    }
  });

  it("returns HTTP 403 THREAT_DETECTED on signed webhook or cron POST when payload contains a threat", async () => {
    const prevGhWebhook = process.env.GITHUB_WEBHOOK_SECRET;
    const prevCron = process.env.CRON_SECRET;
    process.env.GITHUB_WEBHOOK_SECRET = "test-webhook-secret-2026";
    process.env.CRON_SECRET = "test-cron-secret-2026";
    try {
      const maliciousBody = JSON.stringify({
        repository: {
          full_name: "ricardojjulia/ChurchCore; DROP TABLE control_plane_operators",
        },
      });
      const sig =
        "sha256=" +
        crypto
          .createHmac("sha256", "test-webhook-secret-2026")
          .update(maliciousBody, "utf8")
          .digest("hex");

      const webhookReq = new Request(
        "http://localhost:3333/api/webhooks/github",
        {
          method: "POST",
          headers: { "x-hub-signature-256": sig },
          body: maliciousBody,
        }
      );
      const webhookRes = await githubWebhookPost(webhookReq);
      expect(webhookRes.status).toBe(403);

      const cronReq = new Request("http://localhost:3333/api/cron/fleet-sync", {
        method: "POST",
        headers: { authorization: "Bearer test-cron-secret-2026" },
        body: JSON.stringify({ note: "<script>alert(1)</script>" }),
      });
      const cronRes = await cronFleetSyncPost(cronReq);
      expect(cronRes.status).toBe(403);
    } finally {
      if (prevGhWebhook === undefined) delete process.env.GITHUB_WEBHOOK_SECRET;
      else process.env.GITHUB_WEBHOOK_SECRET = prevGhWebhook;
      if (prevCron === undefined) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = prevCron;
    }
  });

  it("protects Governance and Specialist AI Server Actions against SQLi/XSS injection", async () => {
    const ratifyRes = await ratifyCouncilResolution({
      title: "Valid Resolution Title",
      contextStatement: "DROP TABLE public.control_plane_operators; -- malicious injection",
      decisionPoints: ["Enforce RLS"],
      domainTags: ["Security"],
      relatedArtifacts: [],
      amendmentsAdopted: [],
      testSurfacesCovered: ["src/__tests__/embedded_security.test.ts"],
      sealedBy: "Sovereign Architect",
    });
    expect(ratifyRes.success).toBe(false);
    expect(ratifyRes.securityError?.code).toBe("THREAT_DETECTED");

    const consultRes = await simulateSpecialistConsultation(
      "security",
      "<script>window.location='http://evil.com'</script>"
    );
    expect(consultRes.success).toBe(false);
    expect(consultRes.securityError?.code).toBe("THREAT_DETECTED");
  });

  it("verifies all live SQL migrations pass stateful RLS & Function Audit and proves sabotage gate fails on regression", () => {
    const simResults = runSecurityAuditSimulation();
    expect(simResults.length).toBeGreaterThanOrEqual(2);
    for (const r of simResults) {
      expect(r.passed).toBe(true);
    }

    const badSql = `
      CREATE TABLE public.unprotected_table (id uuid primary key);
      ALTER TABLE public.unprotected_table ENABLE ROW LEVEL SECURITY;
    `;
    const check = auditSqlMigrationsText(badSql);
    expect(check.passed).toBe(false);
    expect(check.errors.some((e) => e.includes("FORCE ROW LEVEL SECURITY"))).toBe(
      true
    );
    expect(
      check.errors.some((e) => e.includes("zero active RLS policies"))
    ).toBe(true);
  });
});
