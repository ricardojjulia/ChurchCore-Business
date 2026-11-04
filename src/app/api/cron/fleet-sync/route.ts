import { NextResponse } from "next/server";
import {
  inspectPayloadForThreats,
  isAuthorizedCron,
} from "@/lib/security/crypto-guards";
import { executeFleetSynchronization } from "@/lib/sync/fleet-synchronizer";

/**
 * REQ-012-04: Constant-Time Vercel Cron Fleet Telemetry & Availability Synchronizer
 * Scheduled in vercel.json: every 15 minutes ("* /15 * * * *").
 * Fails closed (HTTP 401) even when CRON_SECRET and Authorization headers are both unset.
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

export async function POST(req: Request) {
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

  const rawText = await req.text();
  if (rawText.trim().length > 0) {
    try {
      const body = JSON.parse(rawText);
      const threat = inspectPayloadForThreats(body);
      if (threat.isThreat) {
        return NextResponse.json(
          {
            success: false,
            code: "THREAT_DETECTED",
            isThreat: true,
            threatReason: threat.reason,
            error: {
              code: "THREAT_DETECTED",
              message: "Cron payload blocked by embedded security guardrails.",
              isThreat: true,
              threatReason: threat.reason,
            },
          },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Malformed JSON cron payload.",
            isThreat: false,
          },
        },
        { status: 400 }
      );
    }
  }

  const summary = await executeFleetSynchronization("vercel_cron");
  return NextResponse.json({
    status: "Execution complete",
    ...summary,
  });
}
