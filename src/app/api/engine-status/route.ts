import { NextResponse } from "next/server";
import { OPENROUTER_ENDPOINT } from "@/lib/ai/openrouter-gateway";

export async function GET() {
  const key = process.env.OPENROUTER_API_KEY || "";
  const hasKey = Boolean(key && key.trim().length > 10);
  const maskedKey = hasKey
    ? `${key.slice(0, 8)}...${key.slice(-4)}`
    : "";

  return NextResponse.json({
    configured: hasKey,
    has_key: hasKey,
    masked_key: maskedKey,
    gateway: OPENROUTER_ENDPOINT,
    zero_data_retention: true,
    pro_model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-pro",
    flash_model: process.env.OPENROUTER_FLASH_MODEL || "google/gemini-2.5-flash",
    fast_model:
      process.env.OPENROUTER_FAST_MODEL || "google/gemini-2.5-flash-lite",
    mode: hasKey
      ? "live_openrouter_dual_gemini"
      : "sovereign_deterministic_synthesis",
  });
}
