import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";

const SaveConfigSchema = z.object({
  api_key: z.string().max(256).optional(),
  pro_model: z.string().max(120).optional(),
  flash_model: z.string().max(120).optional(),
});

const protectedSaveConfigAction = createProtectedAction(
  SaveConfigSchema,
  async (body) => {
    if (body.api_key && typeof body.api_key === "string") {
      process.env.OPENROUTER_API_KEY = body.api_key.trim();
    }
    if (body.pro_model && typeof body.pro_model === "string") {
      process.env.OPENROUTER_MODEL = body.pro_model.trim();
    }
    if (body.flash_model && typeof body.flash_model === "string") {
      process.env.OPENROUTER_FLASH_MODEL = body.flash_model.trim();
    }
    return {
      message: "OpenRouter Dual-Gemini configuration activated in runtime.",
    };
  },
  {
    actionName: "save_openrouter_config",
    requireOperatorSession: true,
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
    const res = await protectedSaveConfigAction(body);
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
      message: res.data.message,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid configuration payload." },
      { status: 400 }
    );
  }
}
