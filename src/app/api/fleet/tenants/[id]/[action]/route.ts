/**
 * POST /api/fleet/tenants/{fleet_tenant_id}/{suspend|restore|archive|refresh} — operator console.
 * COUNCIL-2026-016 Phase 1.4. `refresh` polls the product (GET /api/fleet/tenants/{id}) and
 * reconciles the registry. Requires a verified operator session (middleware + wrapper).
 */

import { NextResponse } from "next/server";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import { OperatorTenantActionSchema } from "@/lib/fleet/schemas";
import { createFleetOrchestrator } from "@/lib/fleet/orchestrator";
import { getFleetRegistryStore } from "@/lib/fleet/supabase-store";
import { FleetRegistryUnavailableError } from "@/lib/fleet/store";
import { fleetActionStatus, type FleetActionOutcome } from "@/lib/fleet/http";

export const dynamic = "force-dynamic";

const tenantAction = createProtectedAction(
  OperatorTenantActionSchema,
  async ({ fleet_tenant_id, action }): Promise<FleetActionOutcome> => {
    try {
      const o = createFleetOrchestrator({ store: getFleetRegistryStore(), fetch: globalThis.fetch });
      switch (action) {
        case "suspend":
          return await o.suspend(fleet_tenant_id);
        case "restore":
          return await o.restore(fleet_tenant_id);
        case "archive":
          return await o.archive(fleet_tenant_id);
        case "refresh":
          return await o.getStatus(fleet_tenant_id);
      }
    } catch (e) {
      if (e instanceof FleetRegistryUnavailableError) return { ok: false, code: "REGISTRY_UNAVAILABLE", message: e.message };
      throw e;
    }
  },
  {
    actionName: "fleet_tenant_action",
    requireOperatorSession: true,
    rateLimit: { refillRate: 30, intervalMs: 60_000, capacity: 60 },
  }
);

export async function POST(_req: Request, ctx: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await ctx.params;
  try {
    const res = await tenantAction({ fleet_tenant_id: id, action });
    return NextResponse.json(res, { status: fleetActionStatus(res) });
  } catch {
    console.error("[fleet/tenants] lifecycle action failed with an internal error.");
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Action failed." } },
      { status: 500 }
    );
  }
}
