/**
 * In-memory FleetRegistryStore for tests. Emulates the migration's unique constraints,
 * compare-and-set updates and the append-only event table.
 */
import type {
  FleetRegistryStore,
  FleetTenantEventRow,
  FleetTenantRow,
  InsertTenantResult,
  NewFleetTenantRow,
} from "@/lib/fleet/store";

export interface MemoryFleetStore extends FleetRegistryStore {
  tenants: Map<string, FleetTenantRow>;
  events: FleetTenantEventRow[];
}

export function createMemoryFleetStore(): MemoryFleetStore {
  const tenants = new Map<string, FleetTenantRow>();
  const events: FleetTenantEventRow[] = [];
  const stamp = () => new Date().toISOString();

  return {
    tenants,
    events,
    async getTenant(id) {
      const row = tenants.get(id);
      return row ? { ...row } : null;
    },
    async listTenants() {
      return [...tenants.values()].map((r) => ({ ...r }));
    },
    async insertTenant(row: NewFleetTenantRow): Promise<InsertTenantResult> {
      if (tenants.has(row.fleet_tenant_id)) return { ok: false, conflict: "fleet_tenant_id", message: "fleet_tenants_pkey" };
      for (const r of tenants.values()) {
        if (r.product === row.product && r.slug === row.slug) {
          return { ok: false, conflict: "slug", message: "fleet_tenants_product_slug_key" };
        }
        if (row.app_tenant_id && r.product === row.product && r.app_tenant_id === row.app_tenant_id) {
          return { ok: false, conflict: "app_tenant_id", message: "fleet_tenants_product_app_tenant_key" };
        }
      }
      const full: FleetTenantRow = { ...row, created_at: stamp(), updated_at: stamp() };
      tenants.set(row.fleet_tenant_id, full);
      return { ok: true, row: { ...full } };
    },
    async updateTenant(id, patch, expectedStatus) {
      const row = tenants.get(id);
      if (!row) return null;
      if (expectedStatus && row.tenant_status !== expectedStatus) return null;
      const next = { ...row, ...patch, updated_at: stamp() } as FleetTenantRow;
      tenants.set(id, next);
      return { ...next };
    },
    async hasEvent(eventId) {
      return events.some((e) => e.event_id === eventId);
    },
    async insertEvent(event) {
      if (events.some((e) => e.event_id === event.event_id)) return "duplicate";
      events.push({ ...event });
      return "inserted";
    },
  };
}
