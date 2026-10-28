import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import {
  authenticateOperatorCredentials,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/auth/session";

const LoginSchema = z.object({
  username: z
    .string()
    .min(3, "Username or email must be at least 3 characters.")
    .max(120, "Username exceeds maximum length."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(256, "Password exceeds maximum length."),
});

const protectedLoginAction = createProtectedAction(
  LoginSchema,
  async (data) => {
    return authenticateOperatorCredentials(data.username, data.password);
  },
  {
    actionName: "operator_login",
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
    const actionResult = await protectedLoginAction(body);

    if (!actionResult.success) {
      const statusMap: Record<string, number> = {
        INVALID_INPUT: 400,
        THREAT_DETECTED: 403,
        RATE_LIMIT_EXCEEDED: 429,
        UNAUTHORIZED_ORIGIN: 401,
        INTERNAL_SECURITY_FAIL: 500,
      };
      return NextResponse.json(actionResult, {
        status: statusMap[actionResult.error.code] || 400,
      });
    }

    if (!actionResult.data.authenticated || !actionResult.data.token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED_ORIGIN",
            message:
              actionResult.data.error ||
              "Invalid operator username or password.",
            isThreat: false,
          },
        },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      data: {
        authenticated: true,
        operator: {
          username: actionResult.data.session?.username,
          role: actionResult.data.session?.role,
          auth_mode: actionResult.data.session?.auth_mode,
          exp: actionResult.data.session?.exp,
        },
      },
    });

    res.cookies.set(SESSION_COOKIE_NAME, actionResult.data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return res;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Malformed JSON login request.",
          isThreat: false,
        },
      },
      { status: 400 }
    );
  }
}

