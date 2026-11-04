/**
 * ChurchCore Sovereign Control Plane — Embedded Security Architecture Data Contracts
 * Reference: COUNCIL-2026-012 / DIR-2026-EMBEDDED-SEC-001 & docs/control-plane/EMBEDDED-SECURITY-ARCHITECTURE.md
 *
 * Separates standard client form validation errors from genuine malicious threats,
 * rate-limit blocks, and cryptographic origin failures.
 */

export type SecurityErrorCode =
  | "INVALID_INPUT"           // Client form/schema validation failures (HTTP 400)
  | "THREAT_DETECTED"         // SQLi, XSS, path traversal, or command injection blocked by embedded shield (HTTP 403)
  | "RATE_LIMIT_EXCEEDED"     // Endpoint or AI wallet exhaustion limits (HTTP 429)
  | "UNAUTHORIZED_ORIGIN"     // Webhook/cron/session cryptographic validation failure (HTTP 401)
  | "INTERNAL_SECURITY_FAIL"; // Uncaught server-side guardrail error — fails closed (HTTP 500)

export interface SecurityErrorDetail {
  code: SecurityErrorCode;
  message: string;
  targetField?: string;
  isThreat?: boolean;
  threatReason?: string;
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: SecurityErrorDetail };
