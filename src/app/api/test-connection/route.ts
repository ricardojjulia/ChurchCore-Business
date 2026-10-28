import { NextResponse } from "next/server";
import { dispatchOpenRouterCompletion } from "@/lib/ai/openrouter-gateway";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.api_key && typeof body.api_key === "string") {
      process.env.OPENROUTER_API_KEY = body.api_key.trim();
    }
    const res = await dispatchOpenRouterCompletion({
      taskType: "tag_classification",
      systemPrompt: "Respond with OK.",
      userPrompt: "Handshake verification",
      requestedMaxTokens: 64,
    });
    return NextResponse.json({
      success: true,
      model_used: res.audit.modelUsed,
      tier: res.audit.tier,
      zero_data_retention: res.audit.zeroDataRetentionEnforced,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

