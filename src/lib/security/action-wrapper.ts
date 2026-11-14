/**
 * ChurchCore Sovereign Control Plane — Serverless Context & Higher-Order Action Wrapper
 * Reference: COUNCIL-2026-012 / DIR-2026-EMBEDDED-SEC-001 & EMBEDDED-SECURITY-ARCHITECTURE.md (§3)
 *
 * Implements:
 * 1. Structural Schema Validation (Zod)
 * 2. Hardened Serverless Network Context Extraction (`x-vercel-forwarded-for` / `x-vercel-ip` priority)
 * 3. Token-Bucket Rate Limiting (AI Wallet & Brute-Force Defense)
 * 4. In-Process Threat Signature Analysis (SQLi, XSS, Path Traversal, Command Injection)
 * 5. Fail-Closed Security Evaluation Posture (Fixed non-sensitive error log)
 */

import { headers } from "next/headers";
import { z } from "zod";
import { ActionResponse, SecurityErrorDetail } from "@/types/security";
import {
  consumeTokenBucket,
  inspectPayloadForThreats,
  TokenBucketConfig,
} from "@/lib/security/crypto-guards";

export async function getClientContext(): Promise<{
  ip: string;
  userAgent: string;
}> {
  try {
    const headersList = await headers();
    // On Vercel, prioritize verified edge headers to prevent client IP spoofing
    const ip =
      headersList.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-vercel-ip") ||
      headersList.get("x-real-ip") ||
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const userAgent = headersList.get("user-agent") || "unknown";
    return { ip, userAgent };
  } catch {
    return { ip: "127.0.0.1", userAgent: "local-runner" };
  }
}

export interface ProtectedActionOptions {
  actionName?: string;
  rateLimit?: TokenBucketConfig;
  simulateEvaluatorFailure?: boolean;
  /**
   * COUNCIL-2026-016 REQ-016-11: require a valid, signature-verified operator session
   * in addition to middleware (defense in depth for privileged actions).
   */
  requireOperatorSession?: boolean;
}

async function hasVerifiedOperatorSession(): Promise<boolean> {
  try {
    const { cookies } = await import("next/headers");
    const { SESSION_COOKIE_NAME, verifyOperatorSession } = await import("@/lib/auth/session");
    const store = await cookies();
    return verifyOperatorSession(store.get(SESSION_COOKIE_NAME)?.value) !== null;
  } catch {
    return false; // fail closed
  }
}

/**
 * Evaluates embedded security guardrails (rate limit + threat inspection) and fails closed on internal error.
 */
export async function evaluateEmbeddedGuardrails(
  payload: unknown,
  options: ProtectedActionOptions = {}
): Promise<
  | { allowed: true; context: { ip: string; userAgent: string } }
  | { allowed: false; error: SecurityErrorDetail }
> {
  const { ip, userAgent } = await getClientContext();

  try {
    if (options.simulateEvaluatorFailure) {
      throw new Error("Simulated security evaluator failure");
    }

    if (options.rateLimit) {
      const bucketKey = `${options.actionName || "default"}:${ip}`;
      const rateDecision = consumeTokenBucket(bucketKey, 1, options.rateLimit);
      if (!rateDecision.allowed) {
        return {
          allowed: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Rate limit exhausted: Too many requests.",
            isThreat: false,
          },
        };
      }
    }

    const threatDecision = inspectPayloadForThreats(payload);
    if (threatDecision.isThreat) {
      return {
        allowed: false,
        error: {
          code: "THREAT_DETECTED",
          message:
            "Security violation: Access denied by local application guardrails.",
          isThreat: true,
          threatReason: threatDecision.reason,
        },
      };
    }

    return { allowed: true, context: { ip, userAgent } };
  } catch {
    console.error("[SECURITY] Embedded guardrail evaluation failed closed (INTERNAL_SECURITY_FAIL).");
    return {
      allowed: false,
      error: {
        code: "INTERNAL_SECURITY_FAIL",
        message: "Unable to verify security posture.",
        isThreat: true,
      },
    };
  }
}

/**
 * Higher-order Server Action & Route Guardrail Wrapper
 */
export function createProtectedAction<T extends z.ZodTypeAny, R>(
  schema: T,
  action: (data: z.infer<T>, context: { ip: string; userAgent: string }) => Promise<R>,
  options: ProtectedActionOptions = {}
) {
  return async (input: unknown): Promise<ActionResponse<R>> => {
    // 0. Operator session (privileged actions only)
    if (options.requireOperatorSession && !(await hasVerifiedOperatorSession())) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED_ORIGIN",
          message: "Authentication required: Valid Control Plane operator session missing.",
          isThreat: true,
        },
      };
    }

    // 1. Structural Schema Validation
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message:
            firstIssue?.message ||
            "Validation failed: structural syntax bounds violation.",
          targetField: firstIssue?.path[0]?.toString(),
          isThreat: false,
        },
      };
    }

    // 2. Evaluate Serverless Context, Token Bucket Rate Limit & Threat Signatures
    const guardDecision = await evaluateEmbeddedGuardrails(parsed.data, options);
    if (!guardDecision.allowed) {
      return {
        success: false,
        error: guardDecision.error,
      };
    }

    // 3. Safe entry to domain business logic
    const result = await action(parsed.data, guardDecision.context);
    return { success: true, data: result };
  };
}
