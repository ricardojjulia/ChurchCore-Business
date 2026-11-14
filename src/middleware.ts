import { NextRequest, NextResponse } from "next/server";
import { verifyOperatorSessionEdge } from "@/lib/auth/session-edge";

const SESSION_COOKIE_NAME = "cc_cp_session";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
  "/api/cron/fleet-sync",
  "/api/webhooks/github",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next.js static assets, images, and public endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next();
  }

  // COUNCIL-2026-016 REQ-016-11: verify the HMAC signature and expiry, not just the
  // token's shape. Fails closed when no signing secret is configured.
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifyOperatorSessionEdge(sessionToken);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED_ORIGIN",
            message: "Authentication required: Valid Control Plane operator session missing.",
            isThreat: true,
          },
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

