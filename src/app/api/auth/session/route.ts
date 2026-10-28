import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifyOperatorSession } from "@/lib/auth/session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifyOperatorSession(token);

  if (!session) {
    return NextResponse.json(
      { authenticated: false, operator: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    operator: {
      sub: session.sub,
      username: session.username,
      role: session.role,
      auth_mode: session.auth_mode,
      exp: session.exp,
    },
  });
}

