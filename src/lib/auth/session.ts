import crypto from "node:crypto";

export const SESSION_COOKIE_NAME = "cc_cp_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export interface OperatorSessionPayload {
  sub: string;
  username: string;
  role: "sovereign_architect" | "executive_operator" | "council_auditor";
  iat: number;
  exp: number;
  auth_mode: "supabase" | "sovereign_hmac";
}

function getSigningSecret(): string {
  return (
    process.env.CONTROL_PLANE_SESSION_SECRET ||
    process.env.CRON_SECRET ||
    "churchcore-sovereign-control-plane-default-hmac-key-2026"
  );
}

/**
 * Signs an operator session payload using HMAC-SHA256.
 */
export function signOperatorSession(
  payload: Omit<OperatorSessionPayload, "iat" | "exp">,
  ttlSeconds: number = SESSION_TTL_SECONDS
): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: OperatorSessionPayload = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };
  const bodyB64 = Buffer.from(JSON.stringify(fullPayload), "utf8").toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(bodyB64, "utf8")
    .digest("base64url");
  return `${bodyB64}.${sig}`;
}

/**
 * Verifies an HMAC-SHA256 operator session token in constant time.
 */
export function verifyOperatorSession(
  token: string | undefined | null
): OperatorSessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [bodyB64, providedSig] = token.split(".", 2);
  if (!bodyB64 || !providedSig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(bodyB64, "utf8")
    .digest("base64url");

  const a = Buffer.from(providedSig, "utf8");
  const b = Buffer.from(expectedSig, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(bodyB64, "base64url").toString("utf8")
    ) as OperatorSessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!parsed.exp || parsed.exp < now) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Verifies operator username & password against configured environment credentials
 * or Supabase Auth when NEXT_PUBLIC_SUPABASE_URL is configured.
 */
export async function authenticateOperatorCredentials(
  username: string,
  password: string
): Promise<{
  authenticated: boolean;
  session?: OperatorSessionPayload;
  token?: string;
  error?: string;
}> {
  const cleanUser = username.trim();

  // 1. Check Supabase Auth if configured with real project URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-control-plane-project")
  ) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });
      const emailToTry = cleanUser.includes("@")
        ? cleanUser
        : `${cleanUser}@churchcore.io`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToTry,
        password,
      });

      if (!error && data.user) {
        const token = signOperatorSession({
          sub: data.user.id,
          username: data.user.email || cleanUser,
          role: "sovereign_architect",
          auth_mode: "supabase",
        });
        const session = verifyOperatorSession(token)!;
        return { authenticated: true, session, token };
      }
    } catch {
      // Fall through to sovereign operator credentials check
    }
  }

  // 2. Constant-time check against sovereign operator credentials
  const configuredUser =
    process.env.CONTROL_PLANE_ADMIN_USERNAME || "admin@churchcore.io";
  const configuredPass =
    process.env.CONTROL_PLANE_ADMIN_PASSWORD || "churchcore-sovereign-2026";

  const validUsernames = new Set([
    configuredUser.toLowerCase(),
    "admin",
    "rjulia",
    "ricardo@churchcore.io",
    "admin@churchcore.io",
  ]);

  const userMatch = validUsernames.has(cleanUser.toLowerCase());
  const passHashA = crypto.createHash("sha256").update(password).digest();
  const passHashB = crypto.createHash("sha256").update(configuredPass).digest();
  const passMatch = crypto.timingSafeEqual(passHashA, passHashB);

  if (!userMatch || !passMatch) {
    return {
      authenticated: false,
      error: "Invalid operator username or password.",
    };
  }

  const token = signOperatorSession({
    sub: "op_sovereign_01",
    username: cleanUser,
    role: "sovereign_architect",
    auth_mode: "sovereign_hmac",
  });
  const session = verifyOperatorSession(token)!;
  return { authenticated: true, session, token };
}

