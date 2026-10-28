import { NextResponse } from "next/server";
import { isAuthorizedCron } from "@/lib/security/crypto-guards";
import { executeFleetSynchronization } from "@/lib/sync/fleet-synchronizer";

/**
 * REQ-012-04: Constant-Time Vercel Cron Fleet Telemetry & Availability Synchronizer
 * Scheduled in vercel.json: every 15 minutes ("* /15 * * * *").
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!isAuthorizedCron(authHeader)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED_ORIGIN",
          message: "Unauthorized Cron Execution Request: Invalid or missing CRON_SECRET.",
          isThreat: true,
        },
      },
      { status: 401 }
    );
  }

  const summary = await executeFleetSynchronization("vercel_cron");
  return NextResponse.json({
    status: "Execution complete",
    ...summary,
  });
}

