import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifyOperatorSession } from "@/lib/auth/session";
import { CloudGovernanceBanner } from "@/components/cockpit/CloudGovernanceBanner";
import { ChurchCoreTrustBadge } from "@/components/branding/ChurchCoreTrustBadge";
import { FleetTenantConsole } from "@/components/fleet/FleetTenantConsole";
import { getFleetRegistryStore } from "@/lib/fleet/supabase-store";
import { FleetRegistryUnavailableError, type FleetTenantRow } from "@/lib/fleet/store";
import { FLEET_PRODUCTS, PLAN_KEYS, CREATE_BILLING_STATUSES } from "@/lib/fleet/spec";

export const dynamic = "force-dynamic";

async function loadTenants(): Promise<{ tenants: FleetTenantRow[]; error: string | null }> {
  try {
    return { tenants: await getFleetRegistryStore().listTenants(200), error: null };
  } catch (e) {
    if (e instanceof FleetRegistryUnavailableError) return { tenants: [], error: e.message };
    return { tenants: [], error: "Fleet tenant registry could not be read." };
  }
}

/** COUNCIL-2026-016 Phase 1.4: operator console for the fleet tenant registry. */
export default async function FleetTenantsPage() {
  const cookieStore = await cookies();
  const session = verifyOperatorSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) redirect("/login?next=/fleet");

  const { tenants, error } = await loadTenants();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base, #020617)" }}>
      <CloudGovernanceBanner
        operatorUsername={session.username}
        operatorRole={session.role}
        authMode={session.auth_mode}
      />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        <FleetTenantConsole
          initialTenants={tenants}
          registryError={error}
          products={[...FLEET_PRODUCTS]}
          plans={[...PLAN_KEYS]}
          billingStatuses={[...CREATE_BILLING_STATUSES]}
        />
      </main>
      <footer
        style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--border-subtle, #1E293B)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <ChurchCoreTrustBadge />
        <span style={{ fontSize: 12, color: "var(--text-muted, #94A3B8)" }}>
          COUNCIL-2026-016 • Registry holds tenant metadata only • Zero cross-app data propagation
        </span>
      </footer>
    </div>
  );
}
