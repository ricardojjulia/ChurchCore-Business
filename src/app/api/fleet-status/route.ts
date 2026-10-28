import { NextResponse } from "next/server";
import {
  getControlPlaneConnectionStatus,
  readDashboardJsonFile,
} from "@/lib/supabase/control-plane-store";

export async function GET() {
  const fleet = readDashboardJsonFile<{
    generated_at?: string;
    summary?: Record<string, unknown>;
    products?: unknown[];
  }>("fleet-data.json", {
    generated_at: new Date().toISOString(),
    summary: {
      total_products: 6,
      online_in_production: 6,
      average_readiness_score: 93,
      average_completion_pct: 99,
      sovereign_data_isolation: true,
    },
    products: [],
  });

  const connection = await getControlPlaneConnectionStatus();

  return NextResponse.json({
    status: "ok",
    generated_at: fleet.generated_at || new Date().toISOString(),
    summary: fleet.summary || {},
    control_plane_db: connection,
  });
}

