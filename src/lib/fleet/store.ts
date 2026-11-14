/**
 * COUNCIL-2026-016 fleet tenant registry — storage port.
 *
 * The registry holds ONLY tenant metadata (identity, status, plan). It never holds app data
 * (members, students, clients, donations, notes, admin names or emails): COUNCIL-2026-001
 * REQ-001-02 forbids cross-app data propagation. Rows change only through explicit, signed
 * API calls (operator provisioning, lifecycle actions, product event ingest), never a sync daemon.
 */

import type {
  BillingStatus,
  FleetEventType,
  FleetProduct,
  PlanKey,
  SignupSource,
  TenantStatus,
} from "@/lib/fleet/spec";

export interface FleetTenantRow {
  fleet_tenant_id: string;
  product: FleetProduct;
  app_tenant_id: string | null;
  slug: string;
  tenant_status: TenantStatus;
  billing_status: BillingStatus;
  plan: PlanKey;
  contract_ref: string | null;
  signup_source: SignupSource;
  trial_ends_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export type NewFleetTenantRow = Omit<FleetTenantRow, "created_at" | "updated_at">;

export type FleetTenantPatch = Partial<
  Pick<
    FleetTenantRow,
    "app_tenant_id" | "tenant_status" | "billing_status" | "plan" | "trial_ends_at" | "last_error" | "contract_ref"
  >
>;

export interface FleetTenantEventRow {
  event_id: string;
  fleet_tenant_id: string | null;
  product: FleetProduct;
  event_type: FleetEventType;
  occurred_at: string;
  payload: Record<string, unknown>;
  source: "product" | "control_plane";
}

export type InsertTenantResult =
  | { ok: true; row: FleetTenantRow }
  | { ok: false; conflict: "fleet_tenant_id" | "slug" | "app_tenant_id" | "unknown"; message: string };

export interface FleetRegistryStore {
  getTenant(fleetTenantId: string): Promise<FleetTenantRow | null>;
  listTenants(limit?: number): Promise<FleetTenantRow[]>;
  insertTenant(row: NewFleetTenantRow): Promise<InsertTenantResult>;
  /**
   * Compare-and-set update. When `expectedStatus` is given, the update applies only if the row
   * is still in that status; returns null if no row matched (missing or concurrently changed).
   */
  updateTenant(
    fleetTenantId: string,
    patch: FleetTenantPatch,
    expectedStatus?: TenantStatus
  ): Promise<FleetTenantRow | null>;
  hasEvent(eventId: string): Promise<boolean>;
  /** Append-only insert. Returns `duplicate` if event_id already exists. */
  insertEvent(event: FleetTenantEventRow): Promise<"inserted" | "duplicate">;
}

export class FleetRegistryUnavailableError extends Error {
  constructor(message = "Fleet tenant registry is not configured (SUPABASE_SERVICE_ROLE_KEY required).") {
    super(message);
    this.name = "FleetRegistryUnavailableError";
  }
}
