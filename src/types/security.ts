export type SecurityErrorCode =
  | "INVALID_INPUT"           // Client form/schema validation failures (HTTP 400)
  | "THREAT_DETECTED"         // SQLi, XSS, bot attacks blocked by embedded shield (HTTP 403)
  | "RATE_LIMIT_EXCEEDED"     // Endpoint or AI wallet exhaustion limits (HTTP 429)
  | "UNAUTHORIZED_ORIGIN"     // Webhook/cron/session cryptographic validation failure (HTTP 401)
  | "INTERNAL_SECURITY_FAIL"; // Uncaught server-side guardrail error (HTTP 500)

export interface SecurityErrorDetail {
  code: SecurityErrorCode;
  message: string;
  targetField?: string;
  isThreat?: boolean;
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: SecurityErrorDetail };

