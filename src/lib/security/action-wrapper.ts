import { headers } from "next/headers";
import { z } from "zod";
import { ActionResponse } from "@/types/security";
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
    // Prioritize Vercel verified edge headers to prevent client IP spoofing
    const ip =
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
}

/**
 * Higher-order Server Action & Route Guardrail Wrapper
 * Implements EMBEDDED-SECURITY-ARCHITECTURE.md Section 3:
 * 1. Structural Schema Validation (Zod)
 * 2. Serverless Network Context Extraction (x-vercel-ip priority)
 * 3. Token-Bucket Rate Limiting (AI Wallet & Brute-Force Defense)
 * 4. In-Process Threat Signature Analysis (SQLi, XSS, Path Traversal)
 */
export function createProtectedAction<T extends z.ZodTypeAny, R>(
  schema: T,
  action: (data: z.infer<T>, context: { ip: string; userAgent: string }) => Promise<R>,
  options: ProtectedActionOptions = {}
) {
  return async (input: unknown): Promise<ActionResponse<R>> => {
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

    // 2. Extract Serverless Network Context
    const { ip, userAgent } = await getClientContext();

    // 3. Evaluate Threat & Rate-Limit Guardrails (Fail Closed on Error)
    try {
      if (options.simulateEvaluatorFailure) {
        throw new Error("Simulated security evaluator failure");
      }

      if (options.rateLimit) {
        const bucketKey = `${options.actionName || "default"}:${ip}`;
        const rateDecision = consumeTokenBucket(bucketKey, 1, options.rateLimit);
        if (!rateDecision.allowed) {
          return {
            success: false,
            error: {
              code: "RATE_LIMIT_EXCEEDED",
              message: "Rate limit exhausted: Too many requests.",
              isThreat: false,
            },
          };
        }
      }

      const threatDecision = inspectPayloadForThreats(parsed.data);
      if (threatDecision.isThreat) {
        return {
          success: false,
          error: {
            code: "THREAT_DETECTED",
            message:
              "Security violation: Access denied by local application guardrails.",
            isThreat: true,
          },
        };
      }
    } catch (err) {
      console.error("[SECURITY] Embedded guardrail evaluation error:", err);
      return {
        success: false,
        error: {
          code: "INTERNAL_SECURITY_FAIL",
          message: "Unable to verify security posture.",
          isThreat: true,
        },
      };
    }

    // 4. Safe entry to domain business logic
    const result = await action(parsed.data, { ip, userAgent });
    return { success: true, data: result };
  };
}

