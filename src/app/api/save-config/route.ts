import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.api_key && typeof body.api_key === "string") {
      process.env.OPENROUTER_API_KEY = body.api_key.trim();
    }
    if (body.pro_model && typeof body.pro_model === "string") {
      process.env.OPENROUTER_MODEL = body.pro_model.trim();
    }
    if (body.flash_model && typeof body.flash_model === "string") {
      process.env.OPENROUTER_FLASH_MODEL = body.flash_model.trim();
    }
    return NextResponse.json({
      success: true,
      message: "OpenRouter Dual-Gemini configuration activated in runtime.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid configuration payload." },
      { status: 400 }
    );
  }
}

