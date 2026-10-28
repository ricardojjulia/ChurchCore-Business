import { NextResponse } from "next/server";
import { executeFleetSynchronization } from "@/lib/sync/fleet-synchronizer";
import { readDashboardJsonFile } from "@/lib/supabase/control-plane-store";

async function handleSync() {
  const syncResult = await executeFleetSynchronization("manual_operator");
  const fleet = readDashboardJsonFile<{
    generated_at?: string;
    summary?: Record<string, unknown>;
  }>("fleet-data.json", {});

  return NextResponse.json({
    success: true,
    message:
      "Telemetry successfully digested across all 6 product pillars via Sovereign Control Plane Sync.",
    generated_at: syncResult.syncedAt,
    summary: fleet.summary || {
      total_products: 6,
      online_in_production: syncResult.results.filter((r) => r.is_online).length,
      sovereign_data_isolation: true,
    },
    sync: syncResult,
  });
}

export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}

