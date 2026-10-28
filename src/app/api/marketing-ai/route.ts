import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import { dispatchOpenRouterCompletion } from "@/lib/ai/openrouter-gateway";

const MarketingAISchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters.").max(3000),
  product_id: z.string().optional().default("churchcore-chms"),
  audience: z.string().optional().default("Executive Pastor & Elder Board"),
});

const protectedMarketingAction = createProtectedAction(
  MarketingAISchema,
  async (data) => {
    const aiResult = await dispatchOpenRouterCompletion({
      taskType: "marketing_narrative",
      systemPrompt:
        "You are The Narrative & Pitch Architect of ChurchCore. Craft clear, high-trust ministry positioning grounded in verified codebase capabilities.",
      userPrompt: `Product: ${data.product_id} | Audience: ${data.audience}\nRequest: ${data.prompt}`,
      requestedMaxTokens: 1536,
    });

    return {
      product_id: data.product_id,
      audience: data.audience,
      narrative: aiResult.content,
      audit: aiResult.audit,
    };
  },
  {
    actionName: "marketing_ai",
    rateLimit: {
      refillRate: 5,
      intervalMs: 60_000,
      capacity: 15,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await protectedMarketingAction(body);
    if (!res.success) {
      const statusMap: Record<string, number> = {
        INVALID_INPUT: 400,
        THREAT_DETECTED: 403,
        RATE_LIMIT_EXCEEDED: 429,
        INTERNAL_SECURITY_FAIL: 500,
      };
      return NextResponse.json(res, { status: statusMap[res.error.code] || 400 });
    }
    return NextResponse.json(res);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INVALID_INPUT", message: "Invalid JSON payload." },
      },
      { status: 400 }
    );
  }
}

