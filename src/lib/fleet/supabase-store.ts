/**
 * Supabase implementation of the fleet registry store. Server-only.
 *
 * `fleet_tenants` and `fleet_tenant_events` deny anon and authenticated under FORCE RLS; only
 * the service role can read or write them. This client therefore requires
 * SUPABASE_SERVICE_ROLE_KEY and, unlike `getSupabaseServiceClient`, never falls back to the anon
 * key (it fails closed instead).
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  FleetRegistryUnavailableError,
  type FleetRegistryStore,
  type FleetTenantEventRow,
  type FleetTenantPatch,
  type FleetTenantRow,
  type InsertTenantResult,
  type NewFleetTenantRow,
} from "@/lib/fleet/store";
import type { TenantStatus } from "@/lib/fleet/spec";

const TENANTS = "fleet_tenants";
const EVENTS = "fleet_tenant_events";

function clean(v: string | undefined): string {
  return (v ?? "").trim().replace(/^["']|["']$/g, "").trim();
}

export function getFleetServiceClient(env: Record<string, string | undefined> = process.env): SupabaseClient | null {
  const url = clean(env.SUPABASE_URL) || clean(env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function conflictFrom(message: string): "fleet_tenant_id" | "slug" | "app_tenant_id" | "unknown" {
  if (message.includes("fleet_tenants_pkey")) return "fleet_tenant_id";
  if (message.includes("fleet_tenants_product_slug_key")) return "slug";
  if (message.includes("fleet_tenants_product_app_tenant_key")) return "app_tenant_id";
  return "unknown";
}

export function createSupabaseFleetStore(client: SupabaseClient): FleetRegistryStore {
  return {
    async getTenant(id) {
      const { data, error } = await client.from(TENANTS).select("*").eq("fleet_tenant_id", id).maybeSingle();
      if (error) throw new Error(`registry read failed: ${error.message}`);
      return (data as FleetTenantRow | null) ?? null;
    },

    async listTenants(limit = 200) {
      const { data, error } = await client
        .from(TENANTS)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(`registry list failed: ${error.message}`);
      return (data as FleetTenantRow[]) ?? [];
    },

    async insertTenant(row: NewFleetTenantRow): Promise<InsertTenantResult> {
      const { data, error } = await client.from(TENANTS).insert(row).select("*").single();
      if (error) {
        if (error.code === "23505") {
          return { ok: false, conflict: conflictFrom(error.message), message: error.message };
        }
        throw new Error(`registry insert failed: ${error.message}`);
      }
      return { ok: true, row: data as FleetTenantRow };
    },

    async updateTenant(id: string, patch: FleetTenantPatch, expectedStatus?: TenantStatus) {
      let q = client.from(TENANTS).update(patch).eq("fleet_tenant_id", id);
      if (expectedStatus) q = q.eq("tenant_status", expectedStatus);
      const { data, error } = await q.select("*").maybeSingle();
      if (error) throw new Error(`registry update failed: ${error.message}`);
      return (data as FleetTenantRow | null) ?? null;
    },

    async hasEvent(eventId) {
      const { data, error } = await client.from(EVENTS).select("event_id").eq("event_id", eventId).maybeSingle();
      if (error) throw new Error(`event read failed: ${error.message}`);
      return data !== null;
    },

    async insertEvent(event: FleetTenantEventRow) {
      const { error } = await client.from(EVENTS).insert(event);
      if (error) {
        if (error.code === "23505") return "duplicate";
        throw new Error(`event insert failed: ${error.message}`);
      }
      return "inserted";
    },
  };
}

/** Returns the production store or throws FleetRegistryUnavailableError (fail closed). */
export function getFleetRegistryStore(): FleetRegistryStore {
  const client = getFleetServiceClient();
  if (!client) throw new FleetRegistryUnavailableError();
  return createSupabaseFleetStore(client);
}
