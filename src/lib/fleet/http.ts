/**
 * HTTP status mapping for fleet operator routes.
 */

import type { ActionResponse } from "@/types/security";
import type { OrchestratorErrorCode, OrchestratorResult } from "@/lib/fleet/orchestrator";

const SECURITY_STATUS: Record<string, number> = {
  INVALID_INPUT: 400,
  THREAT_DETECTED: 403,
  RATE_LIMIT_EXCEEDED: 429,
  UNAUTHORIZED_ORIGIN: 401,
  INTERNAL_SECURITY_FAIL: 500,
};

const ORCHESTRATOR_STATUS: Record<OrchestratorErrorCode, number> = {
  INVALID_REQUEST: 400,
  INVALID_SLUG: 400,
  UNKNOWN_PRODUCT: 400,
  CONFIG_MISSING: 503,
  CONFLICT: 409,
  NOT_FOUND: 404,
  ILLEGAL_TRANSITION: 409,
  PRODUCT_ERROR: 502,
};

/** Wrapped action result: an orchestrator result or a registry-unavailable marker. */
export type FleetActionOutcome = OrchestratorResult | { ok: false; code: "REGISTRY_UNAVAILABLE"; message: string };

export function fleetActionStatus(res: ActionResponse<FleetActionOutcome>): number {
  if (!res.success) return SECURITY_STATUS[res.error.code] ?? 400;
  const out = res.data;
  if (out.ok) return 200;
  if (out.code === "REGISTRY_UNAVAILABLE") return 503;
  return ORCHESTRATOR_STATUS[out.code] ?? 500;
}
