import crypto from "node:crypto";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import {
  isAuthorizedCron,
  verifyGitHubWebhookSignature,
  resetTokenBucketsForTests,
} from "@/lib/security/crypto-guards";
import {
  signOperatorSession,
  verifyOperatorSession,
  authenticateOperatorCredentials,
} from "@/lib/auth/session";
import {
  evaluateAndRouteModel,
  dispatchOpenRouterCompletion,
  MAX_ALLOWED_TOKENS,
} from "@/lib/ai/openrouter-gateway";
import { applyNonMutatingLiveProbe } from "@/lib/sync/fleet-synchronizer";

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

describe("COUNCIL-2026-012: Embedded Security Guardrails & Control Plane Suite", () => {
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

  it("allows valid payloads through cleanly", async () => {
    const action = createProtectedAction(MockSchema, async (data) => ({
      echo: data.safeInput,
    }));

    const response = await action({ safeInput: "validPayload" });
    expect(response.success).toBe(true);
    if (response.success) {
      expect(response.data.echo).toBe("validPayload");
    }
  });

  it("blocks SQL injection and XSS payloads in-process (THREAT_DETECTED)", async () => {
    const action = createProtectedAction(MockSchema, async (data) => data);

    const sqliResponse = await action({
      safeInput: "admin' UNION ALL SELECT password FROM users--",
    });
    expect(sqliResponse.success).toBe(false);
    if (!sqliResponse.success) {
      expect(sqliResponse.error.code).toBe("THREAT_DETECTED");
      expect(sqliResponse.error.isThreat).toBe(true);
    }

    const xssResponse = await action({
      safeInput: "<script>alert('xss')</script>",
    });
    expect(xssResponse.success).toBe(false);
    if (!xssResponse.success) {
      expect(xssResponse.error.code).toBe("THREAT_DETECTED");
      expect(xssResponse.error.isThreat).toBe(true);
    }
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

  it("fails closed when the security evaluator encounters an internal failure (INTERNAL_SECURITY_FAIL)", async () => {
    const action = createProtectedAction(MockSchema, async (data) => data, {
      simulateEvaluatorFailure: true,
    });
    const res = await action({ safeInput: "validPayload" });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.code).toBe("INTERNAL_SECURITY_FAIL");
      expect(res.error.isThreat).toBe(true);
    }
  });

  it("validates Vercel Cron secrets in constant time", () => {
    const secret = "super-secret-cron-token-2026";
    expect(isAuthorizedCron(`Bearer ${secret}`, secret)).toBe(true);
    expect(isAuthorizedCron(`Bearer wrong-token`, secret)).toBe(false);
    expect(isAuthorizedCron(null, secret)).toBe(false);
    expect(isAuthorizedCron(`Bearer ${secret}`, undefined)).toBe(false);
  });

  it("verifies GitHub Webhook HMAC-SHA256 signatures in constant time", () => {
    const secret = "whsec_github_control_plane";
    const body = JSON.stringify({
      ref: "refs/heads/main",
      repository: { full_name: "ricardojjulia/ChurchCore" },
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

  it("signs, verifies, and authenticates operator sessions with fail-closed tamper protection", async () => {
    const token = signOperatorSession({
      sub: "op_1",
      username: "admin@churchcore.io",
      role: "sovereign_architect",
      auth_mode: "sovereign_hmac",
    });

    const verified = verifyOperatorSession(token);
    expect(verified).not.toBeNull();
    expect(verified?.username).toBe("admin@churchcore.io");

    expect(verifyOperatorSession(token + "x")).toBeNull();

    const expiredToken = signOperatorSession(
      {
        sub: "op_1",
        username: "admin@churchcore.io",
        role: "sovereign_architect",
        auth_mode: "sovereign_hmac",
      },
      -10
    );
    expect(verifyOperatorSession(expiredToken)).toBeNull();

    const badLogin = await authenticateOperatorCredentials(
      "admin@churchcore.io",
      "wrong-password"
    );
    expect(badLogin.authenticated).toBe(false);
  });

  it("evaluates and routes AI workloads across Tier 1, Tier 2, and Tier 3 (COUNCIL-2026-010)", async () => {
    const tier1 = evaluateAndRouteModel({
      taskType: "council_deliberation",
      userPrompt: "Audit RLS policies and HIPAA safeguarding boundaries",
      requestedMaxTokens: 9999,
    });
    expect(tier1.tier).toBe("TIER_1_TRUTHNESS");
    expect(tier1.maxTokens).toBe(MAX_ALLOWED_TOKENS);

    const tier2 = evaluateAndRouteModel({
      taskType: "marketing_narrative",
      userPrompt: "Draft overview slide for pastoral executive summary",
    });
    expect(tier2.tier).toBe("TIER_2_BALANCED");

    const tier3 = evaluateAndRouteModel({
      taskType: "tag_classification",
      userPrompt: "Classify short_label for UI feedback item",
    });
    expect(tier3.tier).toBe("TIER_3_FAST");

    const completion = await dispatchOpenRouterCompletion({
      taskType: "council_deliberation",
      systemPrompt: "System prompt",
      userPrompt: "Verify Section III compliance",
    });
    expect(completion.audit.zeroDataRetentionEnforced).toBe(true);
    expect(completion.content).toContain("RATIFIED");
  });

  it("preserves readiness_score_pct, blockers, completion_pct, and phase on live HTTP probes (REQ-008-02)", () => {
    const before = {
      online_status: {
        is_online: false,
        vercel_status: "deployed",
        supabase_status: "local_only",
        readiness_assessment: {
          readiness_score_pct: 68,
          blockers: ["faithgrid.io MX records pending"],
          next_required_actions: ["Add MX records"],
        },
      },
      mvp_status: {
        phase: "beta",
        completion_pct: 40,
      },
    };

    const after = applyNonMutatingLiveProbe(
      before,
      { reachable: true, httpStatus: 200, latencyMs: 142 },
      "2026-10-28T17:00:00.000Z"
    );

    expect(after.online_status.is_online).toBe(true);
    expect(after.online_status.probe_latency_ms).toBe(142);
    expect(
      after.online_status.readiness_assessment.readiness_score_pct
    ).toBe(68);
    expect(after.online_status.readiness_assessment.blockers).toEqual([
      "faithgrid.io MX records pending",
    ]);
    expect(after.online_status.supabase_status).toBe("local_only");
    expect(after.mvp_status.completion_pct).toBe(40);
    expect(after.mvp_status.phase).toBe("beta");
  });
});

