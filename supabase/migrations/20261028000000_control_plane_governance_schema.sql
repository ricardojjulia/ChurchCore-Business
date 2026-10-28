-- =============================================================================
-- CHURCHCORE SOVEREIGN CONTROL PLANE (ChurchCore-Business)
-- Migration: 20261028000000_control_plane_governance_schema.sql
-- Authority: COUNCIL-2026-001 (RLS), COUNCIL-2026-012 (Cloud Control Plane)
-- Constitutional Invariant: Section III (Zero Customer/Member/Donor/Patient PII)
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Operator Allowlist & RBAC Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.control_plane_operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  username text NOT NULL UNIQUE CHECK (char_length(username) >= 3 AND char_length(username) <= 64),
  email text NOT NULL UNIQUE CHECK (position('@' in email) > 1),
  role text NOT NULL DEFAULT 'executive_operator' CHECK (role IN ('sovereign_architect', 'executive_operator', 'council_auditor')),
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.control_plane_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_plane_operators FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. Security Definer Helper (Pinned search_path = public per EMBEDDED-SECURITY-ARCHITECTURE)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_control_plane_operator()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- -----------------------------------------------------------------------------
-- 3. Fleet Telemetry Snapshots (Zero Customer PII - Section III Enforced)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fleet_telemetry_snapshots (
  product_id text PRIMARY KEY CHECK (
    product_id IN (
      'churchcore-chms',
      'churchcore-lms',
      'churchcore-academy',
      'churchcore-care',
      'churchcore-orthos',
      'faithfull-scholars'
    )
  ),
  repo_name text NOT NULL,
  version text NOT NULL,
  report_timestamp timestamptz NOT NULL,
  is_online boolean NOT NULL DEFAULT false,
  vercel_status text NOT NULL CHECK (vercel_status IN ('deployed', 'preview', 'pending', 'none')),
  supabase_status text NOT NULL CHECK (supabase_status IN ('connected', 'pending', 'local_only', 'none')),
  readiness_score_pct integer NOT NULL CHECK (readiness_score_pct >= 0 AND readiness_score_pct <= 100),
  completion_pct integer NOT NULL CHECK (completion_pct >= 0 AND completion_pct <= 100),
  mvp_phase text NOT NULL DEFAULT 'beta',
  probe_latency_ms integer,
  last_probed_at timestamptz,
  source_type text NOT NULL DEFAULT 'remote' CHECK (source_type IN ('remote', 'local', 'webhook', 'cron')),
  telemetry_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fleet_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_telemetry_snapshots FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 4. Cross-Portfolio Governance Tasks (Kanban & Priority Queue)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.governance_tasks (
  task_id text PRIMARY KEY,
  product_id text NOT NULL,
  title text NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 280),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority text NOT NULL DEFAULT 'P1' CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
  directive_ref text,
  assignee_persona text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.governance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_tasks FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 5. Council Deliberations Ledger (Dual-Contending Gemini Records)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.council_deliberations (
  deliberation_id text PRIMARY KEY,
  council_id text NOT NULL,
  target_product text NOT NULL,
  mode text NOT NULL DEFAULT 'full_council',
  query text NOT NULL,
  verdict_status text NOT NULL DEFAULT 'RATIFIED',
  model_pro_used text NOT NULL,
  model_flash_used text NOT NULL,
  deliberation_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by text NOT NULL DEFAULT 'executive_operator',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.council_deliberations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_deliberations FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 6. Demo Feedback & Error-Triage Entries
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_feedback_entries (
  feedback_id text PRIMARY KEY,
  product_id text NOT NULL,
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  category text NOT NULL DEFAULT 'ux',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'triaged', 'in_progress', 'resolved')),
  summary text NOT NULL CHECK (char_length(summary) >= 5 AND char_length(summary) <= 500),
  details text NOT NULL DEFAULT '',
  council_determination jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_feedback_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_feedback_entries FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 7. Cron & GitHub Webhook Sync Execution Audit Logs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sync_execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_source text NOT NULL CHECK (trigger_source IN ('vercel_cron', 'github_webhook', 'manual_operator', 'edge_cli')),
  status text NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  products_synced integer NOT NULL DEFAULT 0,
  duration_ms integer NOT NULL DEFAULT 0,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  executed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sync_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_execution_logs FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 8. Strict Row-Level Security Policies (Deny-All Anon, Allowlisted Operators Only)
-- -----------------------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role;

-- Policies for control_plane_operators
DROP POLICY IF EXISTS operators_select_policy ON public.control_plane_operators;
CREATE POLICY operators_select_policy ON public.control_plane_operators
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS operators_modify_policy ON public.control_plane_operators;
CREATE POLICY operators_modify_policy ON public.control_plane_operators
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

-- Policies for fleet_telemetry_snapshots
DROP POLICY IF EXISTS telemetry_select_policy ON public.fleet_telemetry_snapshots;
CREATE POLICY telemetry_select_policy ON public.fleet_telemetry_snapshots
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS telemetry_modify_policy ON public.fleet_telemetry_snapshots;
CREATE POLICY telemetry_modify_policy ON public.fleet_telemetry_snapshots
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

-- Policies for governance_tasks
DROP POLICY IF EXISTS tasks_select_policy ON public.governance_tasks;
CREATE POLICY tasks_select_policy ON public.governance_tasks
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS tasks_modify_policy ON public.governance_tasks;
CREATE POLICY tasks_modify_policy ON public.governance_tasks
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

-- Policies for council_deliberations
DROP POLICY IF EXISTS deliberations_select_policy ON public.council_deliberations;
CREATE POLICY deliberations_select_policy ON public.council_deliberations
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS deliberations_modify_policy ON public.council_deliberations;
CREATE POLICY deliberations_modify_policy ON public.council_deliberations
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

-- Policies for demo_feedback_entries
DROP POLICY IF EXISTS feedback_select_policy ON public.demo_feedback_entries;
CREATE POLICY feedback_select_policy ON public.demo_feedback_entries
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS feedback_modify_policy ON public.demo_feedback_entries;
CREATE POLICY feedback_modify_policy ON public.demo_feedback_entries
  FOR ALL TO authenticated
  USING (public.is_control_plane_operator())
  WITH CHECK (public.is_control_plane_operator());

-- Policies for sync_execution_logs
DROP POLICY IF EXISTS sync_logs_select_policy ON public.sync_execution_logs;
CREATE POLICY sync_logs_select_policy ON public.sync_execution_logs
  FOR SELECT TO authenticated
  USING (public.is_control_plane_operator());

DROP POLICY IF EXISTS sync_logs_insert_policy ON public.sync_execution_logs;
CREATE POLICY sync_logs_insert_policy ON public.sync_execution_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_control_plane_operator());

COMMIT;

