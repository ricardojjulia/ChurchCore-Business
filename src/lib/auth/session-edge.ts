/**
 * Web Crypto verifier for operator session tokens, usable in middleware (Edge or Node).
 * Token format (from session.ts): `${base64url(JSON payload)}.${base64url(HMAC-SHA256)}`.
 */
import { getSessionSigningSecret } from "./session-secret";

function base64UrlToBytes(input: string): Uint8Array<ArrayBuffer> | null {
  try {
    const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const bin = atob(padded);
    const out = new Uint8Array(new ArrayBuffer(bin.length));
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

export interface EdgeSessionPayload {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export async function verifyOperatorSessionEdge(
  token: string | undefined | null,
  secret: string | null = getSessionSigningSecret()
): Promise<EdgeSessionPayload | null> {
  if (!secret || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [bodyB64, sigB64] = parts;

  const sig = base64UrlToBytes(sigB64);
  if (!sig) return null;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  // crypto.subtle.verify is constant-time with respect to the signature.
  const ok = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(bodyB64));
  if (!ok) return null;

  const bodyBytes = base64UrlToBytes(bodyB64);
  if (!bodyBytes) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(bodyBytes)) as EdgeSessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now || !payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}
