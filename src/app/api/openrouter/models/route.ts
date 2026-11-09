import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import {
  getOpenRouterOptimizationSummary,
  getOpenRouterModelRadar,
} from "@/lib/ai/openrouter-gateway";

const UpdateTiersSchema = z.object({
  pro_model: z.string().min(3).max(120).optional(),
  flash_model: z.string().min(3).max(120).optional(),
  fast_model: z.string().min(3).max(120).optional(),
  force_refresh: z.boolean().optional(),
});

const protectedUpdateTiersAction = createProtectedAction(
  UpdateTiersSchema,
  async (input) => {
    if (input.pro_model) {
      process.env.OPENROUTER_MODEL = input.pro_model.trim();
    }
    if (input.flash_model) {
      process.env.OPENROUTER_FLASH_MODEL = input.flash_model.trim();
    }
    if (input.fast_model) {
      process.env.OPENROUTER_FAST_MODEL = input.fast_model.trim();
    }

    if (input.force_refresh) {
      await getOpenRouterModelRadar(true);
    }

    const summary = await getOpenRouterOptimizationSummary();
    return {
      message: "OpenRouter model tiers and radar successfully updated.",
      summary,
    };
  },
  {
    actionName: "update_openrouter_tiers",
    rateLimit: {
      refillRate: 10,
      intervalMs: 60_000,
      capacity: 20,
    },
  }
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    if (forceRefresh) {
      await getOpenRouterModelRadar(true);
    }

    const summary = await getOpenRouterOptimizationSummary();
    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load OpenRouter optimization radar.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await protectedUpdateTiersAction(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      ...result.data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request payload.",
      },
      { status: 400 }
    );
  }
}
