import crypto from "node:crypto";
import { getSessionSigningSecret } from "./session-secret";

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

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

// COUNCIL-2026-016 REQ-016-11: no built-in default signing key; fail closed.
function getSigningSecret(): string {
  const secret = getSessionSigningSecret();
  if (!secret) {
    throw new Error(
      "CONTROL_PLANE_SESSION_SECRET is not configured (min 32 chars); operator sessions are disabled."
    );
  }
  return secret;
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
  const secret = getSessionSigningSecret();
  if (!secret) return null;

  const expectedSig = crypto
    .createHmac("sha256", secret)
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
  const cleanPass = password.trim();

  // COUNCIL-2026-016 REQ-016-11: no session can be issued without a signing secret.
  if (!getSessionSigningSecret()) {
    return { authenticated: false, error: "Operator login is not configured." };
  }

  // 1. Supabase Auth, restricted to an explicit operator allow-list.
  //    Only the anon key is used for sign-in (never the service-role key), and a
  //    successful Supabase login grants nothing unless the email is allow-listed.
  const supabaseUrl =
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    cleanEnv(process.env.SUPABASE_URL);
  const supabaseKey =
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    cleanEnv(process.env.SUPABASE_ANON_KEY);
  const operatorEmails = new Set(
    cleanEnv(process.env.CONTROL_PLANE_OPERATOR_EMAILS)
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
  if (
    supabaseUrl &&
    supabaseKey &&
    operatorEmails.size > 0 &&
    cleanUser.includes("@") &&
    operatorEmails.has(cleanUser.toLowerCase()) &&
    !supabaseUrl.includes("your-control-plane-project")
  ) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanUser,
        password: cleanPass,
      });

      if (
        !error &&
        data.user &&
        operatorEmails.has((data.user.email || "").toLowerCase())
      ) {
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

  // 2. Constant-time check against the single configured operator credential.
  //    COUNCIL-2026-016 REQ-016-11: no built-in usernames or passwords. If the
  //    operator credential is not configured (or is shorter than 12 chars), this
  //    login path is disabled.
  const configuredUser = (
    cleanEnv(process.env.CONTROL_PLANE_ADMIN_USERNAME) ||
    cleanEnv(process.env.CONTROL_PLANE_OPERATOR_EMAIL)
  ).toLowerCase();
  const configuredPass =
    cleanEnv(process.env.CONTROL_PLANE_ADMIN_PASSWORD) ||
    cleanEnv(process.env.CONTROL_PLANE_OPERATOR_PASSWORD);

  const credentialConfigured = Boolean(configuredUser) && configuredPass.length >= 12;
  const sha = (s: string) => crypto.createHash("sha256").update(s).digest();
  const userMatch =
    credentialConfigured &&
    crypto.timingSafeEqual(sha(cleanUser.toLowerCase()), sha(configuredUser));
  const passMatch =
    credentialConfigured && crypto.timingSafeEqual(sha(cleanPass), sha(configuredPass));

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

