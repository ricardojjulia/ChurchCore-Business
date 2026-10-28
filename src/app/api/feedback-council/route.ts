import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import { dispatchOpenRouterCompletion } from "@/lib/ai/openrouter-gateway";
import { getSupabaseServiceClient } from "@/lib/supabase/control-plane-store";

const FeedbackCouncilSchema = z.object({
  product_id: z.string().min(2).max(64),
  severity: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  summary: z.string().min(5, "Summary must be at least 5 characters.").max(500),
  details: z.string().max(3000).optional().default(""),
});

const protectedFeedbackAction = createProtectedAction(
  FeedbackCouncilSchema,
  async (data) => {
    const aiResult = await dispatchOpenRouterCompletion({
      taskType: "feedback_triage",
      systemPrompt:
        "You are the ChurchCore Error-Triage & Quality Council. Classify feedback severity, identify root-cause subsystem, and emit an actionable remediation plan.",
      userPrompt: `Product: ${data.product_id} | Severity: ${data.severity}\nSummary: ${data.summary}\nDetails: ${data.details}`,
      requestedMaxTokens: 1024,
    });

    const feedbackId = `FB-${Date.now()}`;
    const supabase = getSupabaseServiceClient();
    if (supabase) {
      try {
        await supabase.from("demo_feedback_entries").insert({
          feedback_id: feedbackId,
          product_id: data.product_id,
          severity: data.severity,
          summary: data.summary,
          details: data.details,
          status: "triaged",
          council_determination: {
            triage: aiResult.content,
            audit: aiResult.audit,
          },
        });
      } catch {
        // Non-fatal in hybrid mode
      }
    }

    return {
      feedback_id: feedbackId,
      product_id: data.product_id,
      severity: data.severity,
      status: "triaged",
      triage: aiResult.content,
      audit: aiResult.audit,
    };
  },
  {
    actionName: "feedback_council",
    rateLimit: {
      refillRate: 8,
      intervalMs: 60_000,
      capacity: 20,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await protectedFeedbackAction(body);
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

