import {
  getSupabaseServiceClient,
  persistSyncExecutionLog,
  readDashboardJsonFile,
} from "@/lib/supabase/control-plane-store";

export interface FleetRepoDescriptor {
  product_id:
    | "churchcore-chms"
    | "churchcore-lms"
    | "churchcore-academy"
    | "churchcore-care"
    | "churchcore-orthos"
    | "faithfull-scholars";
  name: string;
  repo: string;
  production_url: string;
}

export const FLEET_REPOSITORIES: FleetRepoDescriptor[] = [
  {
    product_id: "churchcore-chms",
    name: "ChurchCore ChMS",
    repo: "ricardojjulia/ChurchCore",
    production_url: "https://www.churchcore.io",
  },
  {
    product_id: "churchcore-lms",
    name: "ChurchCore LMS",
    repo: "ricardojjulia/ChurchCore-LMS",
    production_url: "https://www.churchcorelms.io",
  },
  {
    product_id: "churchcore-academy",
    name: "ChurchCore Academy",
    repo: "ricardojjulia/ChurchCore-Academy",
    production_url: "https://www.churchcoreacademy.io",
  },
  {
    product_id: "churchcore-care",
    name: "ChurchCore Care",
    repo: "ricardojjulia/ChurchCoreCare",
    production_url: "https://www.churchcorecare.io",
  },
  {
    product_id: "churchcore-orthos",
    name: "ChurchCore Orthos",
    repo: "ricardojjulia/ChurchCore-Orthos",
    production_url: "https://church-core-orthos.vercel.app",
  },
  {
    product_id: "faithfull-scholars",
    name: "FaithFull Scholars",
    repo: "ricardojjulia/FaithFullScholars",
    production_url: "https://www.faithgrid.io",
  },
];

export interface LiveProbeResult {
  reachable: boolean;
  httpStatus: number;
  latencyMs: number;
}

/**
 * REQ-008-02 Invariant:
 * Probes a live production URL for HTTP availability (200-399) and latency,
 * and applies ONLY availability fields (`is_online`, `probe_latency_ms`)
 * without EVER modifying `readiness_score_pct`, `completion_pct`, `phase`, or `blockers`.
 */
export function applyNonMutatingLiveProbe<
  T extends {
    online_status: {
      is_online: boolean;
      vercel_status?: string;
      supabase_status?: string;
      readiness_assessment: {
        readiness_score_pct: number;
        blockers: string[];
        next_required_actions?: string[];
      };
      probe_latency_ms?: number;
      last_probed_at?: string;
    };
    mvp_status: {
      phase?: string;
      completion_pct: number;
    };
  }
>(
  telemetryRecord: T,
  probe: LiveProbeResult,
  probedAtIso: string
): T & {
  online_status: T["online_status"] & {
    probe_latency_ms: number;
    last_probed_at: string;
  };
} {
  const cloned = JSON.parse(JSON.stringify(telemetryRecord));
  cloned.online_status.is_online = probe.reachable;
  cloned.online_status.probe_latency_ms = probe.latencyMs;
  cloned.online_status.last_probed_at = probedAtIso;
  // Explicitly preserve readiness_score_pct, blockers, supabase_status, completion_pct, and phase untouched!
  return cloned;
}

export async function probeProductionUrl(
  url: string,
  timeoutMs = 4000
): Promise<LiveProbeResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "ChurchCore-Sovereign-Control-Plane-Cron/2.0",
      },
    });
    clearTimeout(timer);
    const latencyMs = Date.now() - start;
    return {
      reachable: res.status >= 200 && res.status < 400,
      httpStatus: res.status,
      latencyMs,
    };
  } catch {
    clearTimeout(timer);
    return {
      reachable: false,
      httpStatus: 0,
      latencyMs: Date.now() - start,
    };
  }
}

export async function fetchGitHubPublishedTelemetry(
  repo: string
): Promise<Record<string, unknown> | null> {
  const rawUrl = `https://raw.githubusercontent.com/${repo}/main/docs/control-plane/telemetry.json`;
  const headers: Record<string, string> = {
    "User-Agent": "ChurchCore-Sovereign-Control-Plane/2.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const res = await fetch(rawUrl, { headers, cache: "no-store" });
    if (res.ok) {
      return (await res.json()) as Record<string, unknown>;
    }
  } catch {
    // Fall back to local fleet-data snapshot
  }
  return null;
}

export interface FleetSyncSummary {
  success: boolean;
  triggerSource: "vercel_cron" | "github_webhook" | "manual_operator" | "edge_cli";
  syncedAt: string;
  durationMs: number;
  productsSynced: number;
  results: Array<{
    product_id: string;
    repo: string;
    is_online: boolean;
    latency_ms: number;
    readiness_score_pct: number;
    completion_pct: number;
    source: string;
  }>;
}

/**
 * Executes a full or targeted fleet synchronization across GitHub, Vercel URLs, and Supabase.
 */
export async function executeFleetSynchronization(
  triggerSource: "vercel_cron" | "github_webhook" | "manual_operator" | "edge_cli" = "manual_operator",
  filterProductId?: string
): Promise<FleetSyncSummary> {
  const startedAt = Date.now();
  const syncedAt = new Date().toISOString();
  const localFleet = readDashboardJsonFile<{
    products?: Array<Record<string, unknown>>;
    summary?: Record<string, unknown>;
  }>("fleet-data.json", { products: [] });

  const localProductsById = new Map<string, Record<string, unknown>>();
  for (const p of localFleet.products || []) {
    const pid = String(p.product_id || p.id || "");
    if (pid) localProductsById.set(pid, p);
  }

  const targets = filterProductId
    ? FLEET_REPOSITORIES.filter(
        (r) => r.product_id === filterProductId || r.repo.toLowerCase() === filterProductId.toLowerCase()
      )
    : FLEET_REPOSITORIES;

  const supabase = getSupabaseServiceClient();
  const results: FleetSyncSummary["results"] = [];

  for (const descriptor of targets) {
    const existing = localProductsById.get(descriptor.product_id) || {};
    const remoteTelemetry = await fetchGitHubPublishedTelemetry(descriptor.repo);
    const probe = await probeProductionUrl(descriptor.production_url);

    const baseRecord = (remoteTelemetry || existing) as {
      version?: string;
      report_timestamp?: string;
      online_status?: {
        is_online?: boolean;
        vercel_status?: string;
        supabase_status?: string;
        readiness_assessment?: {
          readiness_score_pct?: number;
          blockers?: string[];
          next_required_actions?: string[];
        };
      };
      mvp_status?: {
        phase?: string;
        completion_pct?: number;
      };
    };

    const normalizedRecord = {
      ...baseRecord,
      online_status: {
        is_online: Boolean(baseRecord.online_status?.is_online ?? true),
        vercel_status: baseRecord.online_status?.vercel_status || "deployed",
        supabase_status: baseRecord.online_status?.supabase_status || "connected",
        readiness_assessment: {
          readiness_score_pct: Number(
            baseRecord.online_status?.readiness_assessment?.readiness_score_pct ?? 90
          ),
          blockers:
            baseRecord.online_status?.readiness_assessment?.blockers || [],
          next_required_actions:
            baseRecord.online_status?.readiness_assessment?.next_required_actions || [],
        },
      },
      mvp_status: {
        phase: baseRecord.mvp_status?.phase || "production",
        completion_pct: Number(baseRecord.mvp_status?.completion_pct ?? 100),
      },
    };

    // Enforce REQ-008-02: probe updates availability only, never readiness or blockers
    const updatedRecord = applyNonMutatingLiveProbe(
      normalizedRecord,
      probe,
      syncedAt
    );

    if (supabase) {
      try {
        await supabase.from("fleet_telemetry_snapshots").upsert(
          {
            product_id: descriptor.product_id,
            repo_name: descriptor.repo,
            version: String(baseRecord.version || "1.0.0"),
            report_timestamp:
              baseRecord.report_timestamp || syncedAt,
            is_online: updatedRecord.online_status.is_online,
            vercel_status: updatedRecord.online_status.vercel_status,
            supabase_status: updatedRecord.online_status.supabase_status,
            readiness_score_pct:
              updatedRecord.online_status.readiness_assessment.readiness_score_pct,
            completion_pct: updatedRecord.mvp_status.completion_pct,
            mvp_phase: updatedRecord.mvp_status.phase || "production",
            probe_latency_ms: probe.latencyMs,
            last_probed_at: syncedAt,
            source_type: remoteTelemetry ? "remote" : "local",
            telemetry_payload: updatedRecord,
            updated_at: syncedAt,
          },
          { onConflict: "product_id" }
        );
      } catch {
        // Non-fatal if Supabase table is not yet provisioned in cloud
      }
    }

    results.push({
      product_id: descriptor.product_id,
      repo: descriptor.repo,
      is_online: updatedRecord.online_status.is_online,
      latency_ms: probe.latencyMs,
      readiness_score_pct:
        updatedRecord.online_status.readiness_assessment.readiness_score_pct,
      completion_pct: updatedRecord.mvp_status.completion_pct,
      source: remoteTelemetry ? "github_main" : "local_snapshot",
    });
  }

  const durationMs = Date.now() - startedAt;
  await persistSyncExecutionLog({
    trigger_source: triggerSource,
    status: "success",
    products_synced: results.length,
    duration_ms: durationMs,
    details: { results },
  });

  return {
    success: true,
    triggerSource,
    syncedAt,
    durationMs,
    productsSynced: results.length,
    results,
  };
}
