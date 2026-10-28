import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "cc_cp_session";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
  "/api/cron/fleet-sync",
  "/api/webhooks/github",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next.js static assets, images, and public endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasValidTokenStructure =
    typeof sessionToken === "string" &&
    sessionToken.includes(".") &&
    sessionToken.length > 32;

  if (!hasValidTokenStructure) {
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

