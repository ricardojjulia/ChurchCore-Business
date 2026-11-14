-- =============================================================================
-- CHURCHCORE SOVEREIGN CONTROL PLANE (ChurchCore-Business)
-- Migration: 20261114000000_fleet_tenants_registry.sql
-- Authority: COUNCIL-2026-016 (DIR-2026-TENANCY-001) Phase 1.3, REQ-016-01/02;
--            COUNCIL-2026-001 REQ-001-01 (RLS) & REQ-001-02 (zero cross-app data propagation)
-- Spec: docs/control-plane/tenancy/fleet-tenancy.json (spec_version 1.0.0)
--
-- The fleet tenant registry holds tenant METADATA only: identity, slug, lifecycle status,
-- billing status, plan, contract reference. It never holds app data (no organization names,
-- admin names/emails, members, students, clients or financial records). Rows change only via
-- explicit signed API calls (operator provisioning, lifecycle actions, product event ingest);
-- there is no synchronization daemon.
--
-- CHECK lists below MUST match fleet-tenancy.json exactly; src/__tests__/fleet_registry_council_016.test.ts
-- fails the build on drift.
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.fleet_tenants (
  fleet_tenant_id uuid PRIMARY KEY,
  product text NOT NULL
    CONSTRAINT fleet_tenants_product_check
    CHECK (product IN ('ChurchCore', 'ChurchCore-LMS', 'ChurchCore-Academy', 'ChurchCoreCare', 'ChurchCore-Orthos', 'FaithFullScholars')),
  app_tenant_id text CHECK (app_tenant_id IS NULL OR char_length(app_tenant_id) BETWEEN 1 AND 200),
  slug text NOT NULL
    CONSTRAINT fleet_tenants_slug_format_check
    CHECK (
      slug ~ '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$'
      AND char_length(slug) BETWEEN 3 AND 30
    )
    CONSTRAINT fleet_tenants_slug_reserved_check
    CHECK (slug <> ALL (ARRAY[
      'about', 'abuse', 'account', 'accounts', 'admin', 'administrator', 'api', 'app', 'apps', 'assets',
      'auth', 'billing', 'blog', 'cdn', 'churchcore', 'control', 'dashboard', 'demo', 'dev', 'docs',
      'email', 'fleet', 'ftp', 'help', 'hq', 'imap', 'internal', 'invite', 'join', 'legal',
      'login', 'logout', 'mail', 'marketing', 'mx', 'my', 'new', 'ns1', 'ns2', 'oauth',
      'platform', 'pop', 'portal', 'preview', 'privacy', 'root', 'sales', 'sandbox', 'security', 'settings',
      'signin', 'signup', 'smtp', 'sso', 'staging', 'start', 'static', 'status', 'support', 'system',
      'terms', 'test', 'trial', 'www'
    ]::text[])),
  tenant_status text NOT NULL DEFAULT 'provisioning'
    CONSTRAINT fleet_tenants_tenant_status_check
    CHECK (tenant_status IN ('provisioning', 'provision_failed', 'active', 'trial_expired', 'suspended', 'archived', 'purged')),
  billing_status text NOT NULL DEFAULT 'trialing'
    CONSTRAINT fleet_tenants_billing_status_check
    CHECK (billing_status IN ('trialing', 'active', 'past_due', 'canceled', 'comped')),
  plan text NOT NULL DEFAULT 'pro'
    CONSTRAINT fleet_tenants_plan_check
    CHECK (plan IN ('starter', 'growth', 'pro')),
  contract_ref text CHECK (contract_ref IS NULL OR char_length(contract_ref) BETWEEN 1 AND 200),
  signup_source text NOT NULL
    CONSTRAINT fleet_tenants_signup_source_check
    CHECK (signup_source IN ('self_serve', 'control_plane')),
  trial_ends_at timestamptz,
  last_error text CHECK (last_error IS NULL OR char_length(last_error) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fleet_tenants_product_slug_key UNIQUE (product, slug),
  CONSTRAINT fleet_tenants_product_app_tenant_key UNIQUE (product, app_tenant_id)
);

CREATE INDEX IF NOT EXISTS fleet_tenants_status_idx ON public.fleet_tenants (product, tenant_status);
CREATE INDEX IF NOT EXISTS fleet_tenants_created_idx ON public.fleet_tenants (created_at DESC);

-- -----------------------------------------------------------------------------
-- Integrity trigger: immutable identity, legal lifecycle transitions only, updated_at.
-- Defense in depth for REQ-016-02.2 (application code also checks isLegalTransition).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fleet_tenants_guard_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  allowed text[];
BEGIN
  IF NEW.fleet_tenant_id IS DISTINCT FROM OLD.fleet_tenant_id
     OR NEW.product IS DISTINCT FROM OLD.product
     OR NEW.signup_source IS DISTINCT FROM OLD.signup_source
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'fleet_tenants: fleet_tenant_id, product, signup_source and created_at are immutable'
      USING ERRCODE = 'check_violation';
  END IF;

  IF NEW.tenant_status IS DISTINCT FROM OLD.tenant_status THEN
    allowed := CASE OLD.tenant_status
      WHEN 'provisioning'     THEN ARRAY['active', 'provision_failed']
      WHEN 'provision_failed' THEN ARRAY['provisioning']
      WHEN 'active'           THEN ARRAY['trial_expired', 'suspended', 'archived']
      WHEN 'trial_expired'    THEN ARRAY['active', 'archived']
      WHEN 'suspended'        THEN ARRAY['active', 'archived']
      WHEN 'archived'         THEN ARRAY['active', 'purged']
      WHEN 'purged'           THEN ARRAY[]::text[]
      ELSE ARRAY[]::text[]
    END;
    IF NOT (NEW.tenant_status = ANY (allowed)) THEN
      RAISE EXCEPTION 'fleet_tenants: illegal tenant_status transition % -> %', OLD.tenant_status, NEW.tenant_status
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.fleet_tenants_guard_update() FROM PUBLIC;

DROP TRIGGER IF EXISTS fleet_tenants_guard_update_trg ON public.fleet_tenants;
CREATE TRIGGER fleet_tenants_guard_update_trg
  BEFORE UPDATE ON public.fleet_tenants
  FOR EACH ROW EXECUTE FUNCTION public.fleet_tenants_guard_update();

-- -----------------------------------------------------------------------------
-- RLS: ENABLE + FORCE. Server access only (service_role, which has BYPASSRLS).
-- anon and authenticated are denied by a RESTRICTIVE policy AND by revoked grants.
-- Registry rows are never deleted (purge keeps the tombstone row as status 'purged').
-- -----------------------------------------------------------------------------
ALTER TABLE public.fleet_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_tenants FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fleet_tenants_deny_client_roles ON public.fleet_tenants;
CREATE POLICY fleet_tenants_deny_client_roles ON public.fleet_tenants
  AS RESTRICTIVE
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS fleet_tenants_service_role_access ON public.fleet_tenants;
CREATE POLICY fleet_tenants_service_role_access ON public.fleet_tenants
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

REVOKE ALL ON TABLE public.fleet_tenants FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.fleet_tenants TO service_role;

COMMIT;
