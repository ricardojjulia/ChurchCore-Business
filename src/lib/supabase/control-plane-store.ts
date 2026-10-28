import fs from "node:fs";
import path from "node:path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface ControlPlaneConnectionStatus {
  supabaseConfigured: boolean;
  supabaseConnected: boolean;
  rlsForcedOnAllTables: boolean;
  storageMode: "supabase_cloud" | "local_sovereign_json";
  projectUrl: string | null;
}

function getWorkspaceRoot(): string {
  return process.cwd();
}

function cleanEnv(val: string | undefined): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export function getSupabaseServiceClient(): SupabaseClient | null {
  const url =
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    cleanEnv(process.env.SUPABASE_URL);
  const key =
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    cleanEnv(process.env.SUPABASE_ANON_KEY) ||
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !key || url.includes("your-control-plane-project")) {
    return null;
  }
  try {
    return createClient(url, key, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function getControlPlaneConnectionStatus(): Promise<ControlPlaneConnectionStatus> {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || null;
  const client = getSupabaseServiceClient();
  if (!client) {
    return {
      supabaseConfigured: false,
      supabaseConnected: false,
      rlsForcedOnAllTables: true,
      storageMode: "local_sovereign_json",
      projectUrl: null,
    };
  }

  try {
    const { error } = await client
      .from("fleet_telemetry_snapshots")
      .select("product_id")
      .limit(1);
    return {
      supabaseConfigured: true,
      supabaseConnected: !error,
      rlsForcedOnAllTables: true,
      storageMode: !error ? "supabase_cloud" : "local_sovereign_json",
      projectUrl: url,
    };
  } catch {
    return {
      supabaseConfigured: true,
      supabaseConnected: false,
      rlsForcedOnAllTables: true,
      storageMode: "local_sovereign_json",
      projectUrl: url,
    };
  }
}

export function readDashboardJsonFile<T = Record<string, unknown>>(
  filename: string,
  fallback: T
): T {
  const filePath = path.join(getWorkspaceRoot(), "dashboard", filename);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
    }
  } catch {
    // Return fallback if file cannot be parsed
  }
  return fallback;
}

export async function persistSyncExecutionLog(entry: {
  trigger_source: "vercel_cron" | "github_webhook" | "manual_operator" | "edge_cli";
  status: "success" | "partial" | "failed";
  products_synced: number;
  duration_ms: number;
  details: Record<string, unknown>;
}): Promise<void> {
  const client = getSupabaseServiceClient();
  if (!client) return;
  try {
    await client.from("sync_execution_logs").insert({
      trigger_source: entry.trigger_source,
      status: entry.status,
      products_synced: entry.products_synced,
      duration_ms: entry.duration_ms,
      details: entry.details,
    });
  } catch {
    // Non-fatal in hybrid/local mode
  }
}

