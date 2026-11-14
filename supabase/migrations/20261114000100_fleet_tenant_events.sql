-- =============================================================================
-- CHURCHCORE SOVEREIGN CONTROL PLANE (ChurchCore-Business)
-- Migration: 20261114000100_fleet_tenant_events.sql
-- Authority: COUNCIL-2026-016 (DIR-2026-TENANCY-001) Phase 1.3, REQ-016-09;
--            COUNCIL-2026-001 REQ-001-01 (RLS) & REQ-001-02 (zero cross-app data propagation)
-- Spec: docs/control-plane/tenancy/fleet-tenancy.json `audit_events` ∪ `funnel_events`
--
-- Append-only log of tenant lifecycle (audit) and signup funnel events reported by products
-- (HMAC-signed POST /api/fleet/events) or written by the control-plane orchestrator.
-- Idempotent on event_id. Payloads are tenant metadata only; the ingest endpoint rejects
-- personal data. No foreign key to fleet_tenants: funnel events precede tenant creation, and
-- audit tombstones must outlive any registry change.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.fleet_tenant_events (
  event_id uuid PRIMARY KEY,
  fleet_tenant_id uuid,
  product text NOT NULL
    CONSTRAINT fleet_tenant_events_product_check
    CHECK (product IN ('ChurchCore', 'ChurchCore-LMS', 'ChurchCore-Academy', 'ChurchCoreCare', 'ChurchCore-Orthos', 'FaithFullScholars')),
  event_type text NOT NULL
    CONSTRAINT fleet_tenant_events_event_type_check
    CHECK (event_type IN (
      'tenant.requested', 'tenant.provisioned', 'tenant.provision_failed', 'tenant.activated',
      'tenant.trial_expired', 'tenant.suspended', 'tenant.restored', 'tenant.archived', 'tenant.purged',
      'tenant.admin_invited', 'tenant.plan_changed', 'tenant.billing_status_changed', 'tenant.support_access',
      'signup.started', 'signup.email_sent', 'signup.verified',
      'signup.password_set', 'signup.compliance_ack', 'trial.converted', 'trial.expired'
    )),
  occurred_at timestamptz NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb
    CONSTRAINT fleet_tenant_events_payload_check
    CHECK (jsonb_typeof(payload) = 'object' AND pg_column_size(payload) <= 8192),
  source text NOT NULL DEFAULT 'product'
    CONSTRAINT fleet_tenant_events_source_check
    CHECK (source IN ('product', 'control_plane')),
  received_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fleet_tenant_events_tenant_required_check
    CHECK (event_type NOT LIKE 'tenant.%' OR fleet_tenant_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS fleet_tenant_events_tenant_idx
  ON public.fleet_tenant_events (fleet_tenant_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS fleet_tenant_events_funnel_idx
  ON public.fleet_tenant_events (product, event_type, occurred_at DESC);

-- -----------------------------------------------------------------------------
-- Append-only: block UPDATE, DELETE and TRUNCATE for every role (including service_role
-- and the table owner; triggers are not bypassed by BYPASSRLS).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fleet_tenant_events_append_only()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'fleet_tenant_events is append-only (% blocked)', TG_OP
    USING ERRCODE = 'insufficient_privilege';
END;
$$;

REVOKE ALL ON FUNCTION public.fleet_tenant_events_append_only() FROM PUBLIC;

DROP TRIGGER IF EXISTS fleet_tenant_events_no_update_delete ON public.fleet_tenant_events;
CREATE TRIGGER fleet_tenant_events_no_update_delete
  BEFORE UPDATE OR DELETE ON public.fleet_tenant_events
  FOR EACH ROW EXECUTE FUNCTION public.fleet_tenant_events_append_only();

DROP TRIGGER IF EXISTS fleet_tenant_events_no_truncate ON public.fleet_tenant_events;
CREATE TRIGGER fleet_tenant_events_no_truncate
  BEFORE TRUNCATE ON public.fleet_tenant_events
  FOR EACH STATEMENT EXECUTE FUNCTION public.fleet_tenant_events_append_only();

-- -----------------------------------------------------------------------------
-- RLS: ENABLE + FORCE. Server access only; service_role may SELECT and INSERT, nothing else.
-- -----------------------------------------------------------------------------
ALTER TABLE public.fleet_tenant_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_tenant_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fleet_tenant_events_deny_client_roles ON public.fleet_tenant_events;
CREATE POLICY fleet_tenant_events_deny_client_roles ON public.fleet_tenant_events
  AS RESTRICTIVE
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS fleet_tenant_events_service_role_read ON public.fleet_tenant_events;
CREATE POLICY fleet_tenant_events_service_role_read ON public.fleet_tenant_events
  FOR SELECT TO service_role
  USING (true);

DROP POLICY IF EXISTS fleet_tenant_events_service_role_append ON public.fleet_tenant_events;
CREATE POLICY fleet_tenant_events_service_role_append ON public.fleet_tenant_events
  FOR INSERT TO service_role
  WITH CHECK (true);

REVOKE ALL ON TABLE public.fleet_tenant_events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.fleet_tenant_events TO service_role;

COMMIT;
