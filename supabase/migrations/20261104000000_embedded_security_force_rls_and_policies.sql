-- ============================================================================
-- Migration: 20261104000000_embedded_security_force_rls_and_policies.sql
-- Description: COUNCIL-2026-012 / DIR-2026-EMBEDDED-SEC-001 & EMBEDDED-SECURITY-ARCHITECTURE.md (§6)
-- Enforces:
--   1. ENABLE + FORCE ROW LEVEL SECURITY across all 6 public Control Plane tables
--   2. Non-recursive SECURITY DEFINER helpers (`current_user_organization_id` & `is_control_plane_operator`)
--      with `SET search_path = public` and `SET row_security = off` to prevent infinite recursion under FORCE RLS
--   3. Explicit multi-tenant & operator-allowlisted RLS policies on every public table
-- ============================================================================

-- 1. Enable and Force Row-Level Security across all 6 public tables
ALTER TABLE public.control_plane_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_plane_operators FORCE ROW LEVEL SECURITY;

ALTER TABLE public.fleet_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_telemetry_snapshots FORCE ROW LEVEL SECURITY;

ALTER TABLE public.governance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_tasks FORCE ROW LEVEL SECURITY;

ALTER TABLE public.council_deliberations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_deliberations FORCE ROW LEVEL SECURITY;

ALTER TABLE public.demo_feedback_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_feedback_entries FORCE ROW LEVEL SECURITY;

ALTER TABLE public.sync_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_execution_logs FORCE ROW LEVEL SECURITY;

-- Ensure organization_id tenant column exists on control_plane_operators for non-recursive org scoping
ALTER TABLE public.control_plane_operators
  ADD COLUMN IF NOT EXISTS organization_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- 2. Non-recursive SECURITY DEFINER tenant & operator lookup helpers (compatible with FORCE ROW LEVEL SECURITY)
CREATE OR REPLACE FUNCTION public.current_user_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT organization_id
  FROM public.control_plane_operators
  WHERE (user_id = auth.uid() OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
    AND is_active = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.current_user_organization_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_organization_id() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.is_control_plane_operator()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.control_plane_operators op
    WHERE (op.user_id = auth.uid() OR lower(op.email) = lower(coalesce(auth.jwt() ->> 'email', '')))
      AND op.is_active = true
  );
END;
$$;

REVOKE ALL ON FUNCTION public.is_control_plane_operator() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_control_plane_operator() TO authenticated, service_role;

-- 3. Repair & enforce non-recursive policies across all 6 tables
DROP POLICY IF EXISTS operators_select_policy ON public.control_plane_operators;
CREATE POLICY operators_select_policy ON public.control_plane_operators
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      public.is_control_plane_operator()
      AND organization_id = public.current_user_organization_id()
    )
  );

DROP POLICY IF EXISTS operators_modify_policy ON public.control_plane_operators;
CREATE POLICY operators_modify_policy ON public.control_plane_operators
  FOR ALL TO authenticated
  USING (
    public.is_control_plane_operator()
    AND organization_id = public.current_user_organization_id()
  )
  WITH CHECK (
    public.is_control_plane_operator()
    AND organization_id = public.current_user_organization_id()
  );

DROP POLICY IF EXISTS telemetry_select_policy ON public.fleet_telemetry_snapshots;
CREATE POLICY telemetry_select_policy ON public.fleet_telemetry_snapshots
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS telemetry_modify_policy ON public.fleet_telemetry_snapshots;
CREATE POLICY telemetry_modify_policy ON public.fleet_telemetry_snapshots
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

DROP POLICY IF EXISTS tasks_select_policy ON public.governance_tasks;
CREATE POLICY tasks_select_policy ON public.governance_tasks
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS tasks_modify_policy ON public.governance_tasks;
CREATE POLICY tasks_modify_policy ON public.governance_tasks
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

DROP POLICY IF EXISTS deliberations_select_policy ON public.council_deliberations;
CREATE POLICY deliberations_select_policy ON public.council_deliberations
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS deliberations_modify_policy ON public.council_deliberations;
CREATE POLICY deliberations_modify_policy ON public.council_deliberations
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

DROP POLICY IF EXISTS feedback_select_policy ON public.demo_feedback_entries;
CREATE POLICY feedback_select_policy ON public.demo_feedback_entries
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS feedback_modify_policy ON public.demo_feedback_entries;
CREATE POLICY feedback_modify_policy ON public.demo_feedback_entries
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

DROP POLICY IF EXISTS sync_logs_select_policy ON public.sync_execution_logs;
CREATE POLICY sync_logs_select_policy ON public.sync_execution_logs
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS sync_logs_insert_policy ON public.sync_execution_logs;
CREATE POLICY sync_logs_insert_policy ON public.sync_execution_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_control_plane_operator());
