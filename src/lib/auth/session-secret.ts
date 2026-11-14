/**
 * Operator session signing secret (COUNCIL-2026-016 REQ-016-11).
 *
 * Fail closed: there is NO built-in default key. If no sufficiently long secret
 * is configured, sessions can be neither issued nor verified.
 * Runtime-agnostic (no node:crypto) so it can be shared by middleware and Node routes.
 */
export const MIN_SESSION_SECRET_LENGTH = 32;

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export function getSessionSigningSecret(): string | null {
  const candidates = [
    cleanEnv(process.env.CONTROL_PLANE_SESSION_SECRET),
    // Legacy deployments signed with CRON_SECRET; still accepted only if long enough.
    cleanEnv(process.env.CRON_SECRET),
  ];
  for (const c of candidates) {
    if (c && c.length >= MIN_SESSION_SECRET_LENGTH) return c;
  }
  return null;
}
