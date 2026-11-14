/**
 * POST /api/fleet/events — product → control plane audit/funnel event ingest.
 * COUNCIL-2026-016 Phase 1.3.
 *
 * Listed in middleware PUBLIC_PATHS because products cannot hold an operator session. It is
 * NOT unauthenticated: every request must carry a valid X-Fleet-Timestamp / X-Fleet-Signature
 * HMAC made with that product's FLEET_PROVISIONING_SECRET (verified in handleFleetEventIngest).
 */

import { NextResponse } from "next/server";
import { consumeTokenBucket } from "@/lib/security/crypto-guards";
import { getClientContext } from "@/lib/security/action-wrapper";
import { handleFleetEventIngest, MAX_INGEST_BODY_BYTES } from "@/lib/fleet/ingest";
import { getFleetRegistryStore } from "@/lib/fleet/supabase-store";
import { FleetRegistryUnavailableError } from "@/lib/fleet/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { ip } = await getClientContext();
  const bucket = consumeTokenBucket(`fleet_events:${ip}`, 1, { refillRate: 600, intervalMs: 60_000, capacity: 600 });
  if (!bucket.allowed) {
    return NextResponse.json(
      { accepted: false, error: "RATE_LIMIT_EXCEEDED", message: "Too many requests." },
      { status: 429 }
    );
  }
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_INGEST_BODY_BYTES) {
    return NextResponse.json(
      { accepted: false, error: "PAYLOAD_TOO_LARGE", message: "Event body exceeds 16 KiB." },
      { status: 413 }
    );
  }
  const rawBody = await req.text();
  try {
    const res = await handleFleetEventIngest({ rawBody, headers: req.headers }, { store: getFleetRegistryStore });
    return NextResponse.json(res.body, { status: res.status });
  } catch (e) {
    if (e instanceof FleetRegistryUnavailableError) {
      return NextResponse.json(
        { accepted: false, error: "REGISTRY_UNAVAILABLE", message: "Retry later." },
        { status: 503 }
      );
    }
    console.error("[fleet/events] ingest failed with an internal error.");
    return NextResponse.json({ accepted: false, error: "INTERNAL_ERROR", message: "Retry later." }, { status: 500 });
  }
}
