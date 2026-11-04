import { NextResponse } from "next/server";

export interface VercelProjectLandscape {
  id: string;
  product_name: string;
  vercel_project: string;
  tier: "Pro";
  team: string;
  state: "READY";
  production_url: string;
  env_vars_count: number;
  crons: Array<{ path: string; schedule: string }>;
  monthly_cron_invocations: number;
  supabase_ref: string;
  notes: string;
}

export interface SupabaseDatabaseLandscape {
  id: string;
  database_name: string;
  product_suite: string;
  project_ref: string;
  org_id: string;
  org_name: string;
  tier: "Pro";
  region: string;
  engine: string;
  status: "ACTIVE_HEALTHY";
  postgrest_status: number;
  tables_views_count: number;
  keepalive_shield: boolean;
  role: string;
  live_latency_ms?: number;
}

export interface GitHubWebhookLandscape {
  product_id: string;
  repo: string;
  webhook_id: string;
  events: string[];
  status: "ACTIVE";
  repo_operator_ready: boolean;
}

const VERCEL_PROJECTS: VercelProjectLandscape[] = [
  {
    id: "churchcore-chms",
    product_name: "ChurchCore ChMS",
    vercel_project: "church-core-ops",
    tier: "Pro",
    team: "churchcore",
    state: "READY",
    production_url: "https://www.churchcore.io",
    env_vars_count: 26,
    crons: [
      { path: "/api/jobs/outbox/process", schedule: "*/5 * * * *" },
      { path: "/api/jobs/Workflows/run-scheduled", schedule: "0 2 * * *" },
      { path: "/api/jobs/background-checks/sync", schedule: "0 3 * * *" },
    ],
    monthly_cron_invocations: 8700,
    supabase_ref: "xsmcurhmgmnxxppkorpq + iopydttovnyjgikprvol",
    notes: "Dual-DB architecture: Tenant ChMS + Multi-Tenant Ops Control Plane",
  },
  {
    id: "churchcore-lms",
    product_name: "ChurchCore LMS",
    vercel_project: "church-core-lms",
    tier: "Pro",
    team: "churchcore",
    state: "READY",
    production_url: "https://www.churchcorelms.io",
    env_vars_count: 6,
    crons: [],
    monthly_cron_invocations: 0,
    supabase_ref: "tpyvciujsrllvowqgeyq",
    notes: "Transferred to ChurchCore Pro Org; 100 tables/views active",
  },
  {
    id: "churchcore-academy",
    product_name: "ChurchCore Academy",
    vercel_project: "church-core-academy",
    tier: "Pro",
    team: "churchcore",
    state: "READY",
    production_url: "https://www.churchcoreacademy.io",
    env_vars_count: 12,
    crons: [
      { path: "/api/jobs/sis-outbox/process", schedule: "* * * * *" },
      { path: "/api/jobs/oneroster/sync", schedule: "0 */6 * * *" },
      { path: "/api/jobs/billing/tuition-reminders", schedule: "0 6 * * *" },
    ],
    monthly_cron_invocations: 43350,
    supabase_ref: "nvklkmsnqqrjzirnhfzr",
    notes: "123/123 migrations pushed; 153 tables/views active",
  },
  {
    id: "churchcore-care",
    product_name: "ChurchCore Care",
    vercel_project: "churchcore-care",
    tier: "Pro",
    team: "churchcore",
    state: "READY",
    production_url: "https://www.churchcorecare.io",
    env_vars_count: 20,
    crons: [
      { path: "/api/cron/outbox", schedule: "* * * * *" },
      { path: "/api/cron/notifications", schedule: "* * * * *" },
      { path: "/api/cron/sla-escalation", schedule: "0 * * * *" },
      { path: "/api/cron/daily-digest", schedule: "0 8 * * *" },
    ],
    monthly_cron_invocations: 87150,
    supabase_ref: "ujtwcrulqawzvggehxjf",
    notes: "Transferred to ChurchCore Pro Org; HIPAA pgcrypto vault (97 tables/views)",
  },
  {
    id: "churchcore-orthos",
    product_name: "ChurchCore Orthos",
    vercel_project: "church-core-orthos",
    tier: "Pro",
    team: "churchcore",
    state: "READY",
    production_url: "https://church-core-orthos.vercel.app",
    env_vars_count: 8,
    crons: [],
    monthly_cron_invocations: 0,
    supabase_ref: "vnuoibklcldxadffmitj",
    notes: "8/8 migrations pushed; 28 tables/views active; font loader hardened",
  },
  {
    id: "faithfull-scholars",
    product_name: "FaithFull Scholars",
    vercel_project: "faith-full-scholars",
    tier: "Pro",
    team: "churchcore",
    state: "READY",
    production_url: "https://www.faithgrid.io",
    env_vars_count: 21,
    crons: [{ path: "/api/cron/compliance-reminders", schedule: "0 13 * * *" }],
    monthly_cron_invocations: 30,
    supabase_ref: "yxrvrjkzlumenlvczqjd",
    notes: "Endowment & scholarship allocation platform (56 tables/views)",
  },
  {
    id: "ecosystem-control-plane",
    product_name: "Sovereign Control Plane",
    vercel_project: "churchcore-control-plane",
    tier: "Pro",
    team: "churchcore",
    state: "READY",
    production_url: "https://churchcore-control-plane.vercel.app",
    env_vars_count: 13,
    crons: [{ path: "/api/cron/fleet-sync", schedule: "*/15 * * * *" }],
    monthly_cron_invocations: 2880,
    supabase_ref: "ukekzedrnkqauiwfnilb",
    notes: "Next.js 16 App Router + 15-min Fleet Synchronizer + Zero-Row Keep-Alive Shield",
  },
];

const SUPABASE_DATABASES: SupabaseDatabaseLandscape[] = [
  {
    id: "db-chms-ops",
    database_name: "ChurchCore Ops",
    product_suite: "ChurchCore ChMS (Tenant DB)",
    project_ref: "xsmcurhmgmnxxppkorpq",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-1",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 137,
    keepalive_shield: true,
    role: "Primary ChMS Tenant & Sunday Morning SLA Database",
  },
  {
    id: "db-chms-cp",
    database_name: "ChurchCore Ops Control Plane",
    product_suite: "ChurchCore ChMS (Platform Admin DB)",
    project_ref: "iopydttovnyjgikprvol",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-1",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 7,
    keepalive_shield: true,
    role: "ChMS Multi-Tenant Provisioning & Demo Feedback Database",
  },
  {
    id: "db-lms",
    database_name: "ChurchCore LMS",
    product_suite: "ChurchCore LMS",
    project_ref: "tpyvciujsrllvowqgeyq",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-2",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 100,
    keepalive_shield: true,
    role: "Seminary, SpeedGrader & Discipleship LMS Database",
  },
  {
    id: "db-academy",
    database_name: "churchcore-academy",
    product_suite: "ChurchCore Academy",
    project_ref: "nvklkmsnqqrjzirnhfzr",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-1",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 153,
    keepalive_shield: true,
    role: "K-12 Classical & Christian SIS Database (123 Migrations)",
  },
  {
    id: "db-care",
    database_name: "churchcore-care-demo",
    product_suite: "ChurchCore Care",
    project_ref: "ujtwcrulqawzvggehxjf",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-1",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 97,
    keepalive_shield: true,
    role: "Pastoral Care & HIPAA pgcrypto Encrypted Vault Database",
  },
  {
    id: "db-orthos",
    database_name: "churchcore-orthos",
    product_suite: "ChurchCore Orthos",
    project_ref: "vnuoibklcldxadffmitj",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-1",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 28,
    keepalive_shield: true,
    role: "Patristic Study, Liturgical Calendar & Safeguarding Database",
  },
  {
    id: "db-scholars",
    database_name: "faithfull-scholars-prod",
    product_suite: "FaithFull Scholars",
    project_ref: "yxrvrjkzlumenlvczqjd",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-1",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 56,
    keepalive_shield: true,
    role: "Endowment & Scholarship Allocation Ledger Database",
  },
  {
    id: "db-control-plane",
    database_name: "churchcore-control-plane",
    product_suite: "Sovereign Control Plane",
    project_ref: "ukekzedrnkqauiwfnilb",
    org_id: "bqpjefzdlxksskyrvkrt",
    org_name: "ChurchCore (Pro)",
    tier: "Pro",
    region: "us-east-1",
    engine: "PostgreSQL 17",
    status: "ACTIVE_HEALTHY",
    postgrest_status: 200,
    tables_views_count: 6,
    keepalive_shield: true,
    role: "Sovereign Control Plane Telemetry, Audit & Council Ledger",
  },
];

const GITHUB_WEBHOOKS: GitHubWebhookLandscape[] = [
  {
    product_id: "churchcore-chms",
    repo: "ricardojjulia/ChurchCore",
    webhook_id: "704475956",
    events: ["push", "pull_request", "deployment_status"],
    status: "ACTIVE",
    repo_operator_ready: true,
  },
  {
    product_id: "churchcore-lms",
    repo: "ricardojjulia/ChurchCore-LMS",
    webhook_id: "704475960",
    events: ["push", "pull_request", "deployment_status"],
    status: "ACTIVE",
    repo_operator_ready: true,
  },
  {
    product_id: "churchcore-academy",
    repo: "ricardojjulia/ChurchCore-Academy",
    webhook_id: "704475963",
    events: ["push", "pull_request", "deployment_status"],
    status: "ACTIVE",
    repo_operator_ready: true,
  },
  {
    product_id: "churchcore-care",
    repo: "ricardojjulia/ChurchCoreCare",
    webhook_id: "704475966",
    events: ["push", "pull_request", "deployment_status"],
    status: "ACTIVE",
    repo_operator_ready: true,
  },
  {
    product_id: "churchcore-orthos",
    repo: "ricardojjulia/ChurchCore-Orthos",
    webhook_id: "704475974",
    events: ["push", "pull_request", "deployment_status"],
    status: "ACTIVE",
    repo_operator_ready: true,
  },
  {
    product_id: "faithfull-scholars",
    repo: "ricardojjulia/FaithFullScholars",
    webhook_id: "704475978",
    events: ["push", "pull_request", "deployment_status"],
    status: "ACTIVE",
    repo_operator_ready: true,
  },
];

export async function GET() {
  const totalTablesViews = SUPABASE_DATABASES.reduce(
    (sum, db) => sum + db.tables_views_count,
    0
  );
  const totalMonthlyCrons = VERCEL_PROJECTS.reduce(
    (sum, proj) => sum + proj.monthly_cron_invocations,
    0
  );
  const totalEnvVars = VERCEL_PROJECTS.reduce(
    (sum, proj) => sum + proj.env_vars_count,
    0
  );

  return NextResponse.json({
    success: true,
    data: {
      document_id: "COUNCIL-2026-013",
      generated_at: new Date().toISOString(),
      report_url: "/docs/control-plane/INFRASTRUCTURE-AND-CLOUD-LANDSCAPE.md",
      summary: {
        vercel_projects_total: VERCEL_PROJECTS.length,
        vercel_projects_ready: VERCEL_PROJECTS.length,
        vercel_team: "churchcore",
        vercel_tier: "Pro ($20/mo)",
        vercel_total_env_vars: totalEnvVars,
        vercel_monthly_cron_invocations: totalMonthlyCrons,
        vercel_cron_allowance_pct: Number(((totalMonthlyCrons / 1_000_000) * 100).toFixed(2)),
        supabase_databases_total: SUPABASE_DATABASES.length,
        supabase_databases_healthy: SUPABASE_DATABASES.length,
        supabase_org_id: "bqpjefzdlxksskyrvkrt",
        supabase_org_name: "ChurchCore (Pro)",
        supabase_tier: "Pro ($25/mo base + Compute)",
        total_tables_views: totalTablesViews,
        github_webhooks_active: GITHUB_WEBHOOKS.length,
        cross_app_data_propagation_pct: 0,
        estimated_monthly_opex_usd: "$85–$95 / mo",
      },
      vercel_projects: VERCEL_PROJECTS,
      supabase_databases: SUPABASE_DATABASES,
      github_webhooks: GITHUB_WEBHOOKS,
    },
  });
}

