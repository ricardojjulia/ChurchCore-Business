import { NextResponse } from "next/server";
import { verifyGitHubWebhookSignature } from "@/lib/security/crypto-guards";
import { executeFleetSynchronization } from "@/lib/sync/fleet-synchronizer";

/**
 * REQ-012-04: Cryptographic GitHub Webhook Receiver (X-Hub-Signature-256)
 * Automatically synchronizes edge product telemetry & plans upon push or merged PR.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  const eventType = req.headers.get("x-github-event") || "push";

  if (!verifyGitHubWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED_ORIGIN",
          message: "GitHub webhook HMAC-SHA256 signature verification failed.",
          isThreat: true,
        },
      },
      { status: 401 }
    );
  }

  let repoFullName: string | undefined;
  try {
    const payload = JSON.parse(rawBody) as {
      repository?: { full_name?: string };
    };
    repoFullName = payload?.repository?.full_name;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Invalid JSON webhook payload.",
          isThreat: false,
        },
      },
      { status: 400 }
    );
  }

  const summary = await executeFleetSynchronization(
    "github_webhook",
    repoFullName
  );

  return NextResponse.json({
    received: true,
    event: eventType,
    repository: repoFullName || "all",
    sync: summary,
  });
}

