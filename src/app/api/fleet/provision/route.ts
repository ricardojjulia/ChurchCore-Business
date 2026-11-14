/**
 * POST /api/fleet/provision — operator console → provision a tenant in a product.
 * COUNCIL-2026-016 Phase 1.4. Requires a verified operator session (middleware + wrapper).
 */

import { NextResponse } from "next/server";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import { OperatorProvisionSchema } from "@/lib/fleet/schemas";
import { createFleetOrchestrator } from "@/lib/fleet/orchestrator";
import { getFleetRegistryStore } from "@/lib/fleet/supabase-store";
import { FleetRegistryUnavailableError } from "@/lib/fleet/store";
import { fleetActionStatus, type FleetActionOutcome } from "@/lib/fleet/http";

export const dynamic = "force-dynamic";

const provisionAction = createProtectedAction(
  OperatorProvisionSchema,
  async ({ product, ...request }): Promise<FleetActionOutcome> => {
    try {
      const orchestrator = createFleetOrchestrator({ store: getFleetRegistryStore(), fetch: globalThis.fetch });
      return await orchestrator.provisionInProduct(product, request);
    } catch (e) {
      if (e instanceof FleetRegistryUnavailableError) return { ok: false, code: "REGISTRY_UNAVAILABLE", message: e.message };
      throw e;
    }
  },
  {
    actionName: "fleet_provision",
    requireOperatorSession: true,
    rateLimit: { refillRate: 10, intervalMs: 60_000, capacity: 20 },
  }
);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = undefined;
  }
  try {
    const res = await provisionAction(body);
    return NextResponse.json(res, { status: fleetActionStatus(res) });
  } catch {
    console.error("[fleet/provision] provisioning failed with an internal error.");
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Provisioning failed." } },
      { status: 500 }
    );
  }
}
