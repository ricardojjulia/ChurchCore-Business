import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import { dispatchOpenRouterCompletion } from "@/lib/ai/openrouter-gateway";

const TestConnectionSchema = z.object({
  api_key: z.string().max(256).optional(),
});

const protectedTestConnectionAction = createProtectedAction(
  TestConnectionSchema,
  async (body) => {
    if (body.api_key && typeof body.api_key === "string") {
      process.env.OPENROUTER_API_KEY = body.api_key.trim();
    }
    const res = await dispatchOpenRouterCompletion({
      taskType: "tag_classification",
      systemPrompt: "Respond with OK.",
      userPrompt: "Handshake verification",
      requestedMaxTokens: 64,
    });
    return {
      model_used: res.audit.modelUsed,
      tier: res.audit.tier,
      zero_data_retention: res.audit.zeroDataRetentionEnforced,
    };
  },
  {
    actionName: "test_openrouter_connection",
    rateLimit: {
      refillRate: 5,
      intervalMs: 60_000,
      capacity: 10,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await protectedTestConnectionAction(body);
    if (!res.success) {
      const statusMap: Record<string, number> = {
        INVALID_INPUT: 400,
        THREAT_DETECTED: 403,
        RATE_LIMIT_EXCEEDED: 429,
        INTERNAL_SECURITY_FAIL: 500,
      };
      return NextResponse.json(res, {
        status: statusMap[res.error.code] || 400,
      });
    }
    return NextResponse.json({
      success: true,
      ...res.data,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Connection test failed." },
      { status: 500 }
    );
  }
}
