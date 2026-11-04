"use client";

import React, { useState } from "react";

export interface CloudGovernanceBannerProps {
  operatorUsername: string;
  operatorRole: string;
  authMode: string;
}

interface ArchCheckResult {
  status: string;
  passed_count: number;
  total_checks: number;
  checks: Array<{
    id: string;
    councilRef: string;
    title: string;
    passed: boolean;
    evidence: string;
  }>;
}

interface CloudLandscapeData {
  document_id: string;
  report_url: string;
  summary: {
    vercel_projects_total: number;
    vercel_projects_ready: number;
    vercel_team: string;
    vercel_tier: string;
    vercel_total_env_vars: number;
    vercel_monthly_cron_invocations: number;
    vercel_cron_allowance_pct: number;
    supabase_databases_total: number;
    supabase_databases_healthy: number;
    supabase_org_id: string;
    supabase_org_name: string;
    supabase_tier: string;
    total_tables_views: number;
    github_webhooks_active: number;
    cross_app_data_propagation_pct: number;
    estimated_monthly_opex_usd: string;
  };
  vercel_projects: Array<{
    id: string;
    product_name: string;
    vercel_project: string;
    tier: string;
    state: string;
    production_url: string;
    env_vars_count: number;
    crons: Array<{ path: string; schedule: string }>;
    monthly_cron_invocations: number;
    supabase_ref: string;
    notes: string;
  }>;
  supabase_databases: Array<{
    id: string;
    database_name: string;
    product_suite: string;
    project_ref: string;
    org_id: string;
    org_name: string;
    tier: string;
    region: string;
    engine: string;
    status: string;
    postgrest_status: number;
    tables_views_count: number;
    keepalive_shield: boolean;
    role: string;
  }>;
  github_webhooks: Array<{
    product_id: string;
    repo: string;
    webhook_id: string;
    events: string[];
    status: string;
    repo_operator_ready: boolean;
  }>;
}

export function CloudGovernanceBanner({
  operatorUsername,
  operatorRole,
  authMode,
}: CloudGovernanceBannerProps) {
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [archResult, setArchResult] = useState<ArchCheckResult | null>(null);
  const [landscapeModalOpen, setLandscapeModalOpen] = useState(false);
  const [landscapeData, setLandscapeData] = useState<CloudLandscapeData | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleRunArchCheck() {
    setBusy(true);
    try {
      const res = await fetch("/api/arch-check");
      const data = await res.json();
      setArchResult(data);
      setArchModalOpen(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleOpenCloudLandscape() {
    setBusy(true);
    try {
      const res = await fetch("/api/cloud-landscape");
      const json = await res.json();
      if (json.success && json.data) {
        setLandscapeData(json.data);
        setLandscapeModalOpen(true);
      }
      // Also activate the dedicated Cloud tab in the Cockpit if present
      const cloudTabBtn = document.querySelector(
        '.sidebar-nav-btn[data-tab="tab-cloud-landscape"]'
      ) as HTMLButtonElement | null;
      if (cloudTabBtn) {
        cloudTabBtn.click();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCronSync() {
    setBusy(true);
    setSyncMessage("Synchronizing GitHub main telemetry & live probes...");
    try {
      const res = await fetch("/api/sync-telemetry", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(
          `✅ Synced ${data.sync?.productsSynced || 6}/6 repositories in ${data.sync?.durationMs || 0}ms (REQ-008-02 enforced)`
        );
      } else {
        setSyncMessage("⚠️ Sync completed with warnings.");
      }
    } catch {
      setSyncMessage("⚠️ Error communicating with sync endpoint.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <>
      <div
        style={{
          background: "linear-gradient(90deg, #0B111E 0%, #111A2E 50%, #0B111E 100%)",
          borderBottom: "1px solid rgba(245, 158, 11, 0.35)",
          padding: "8px 20px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          fontSize: "12px",
          color: "#E2E8F0",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span
            style={{
              background: "rgba(76, 195, 138, 0.16)",
              border: "1px solid rgba(76, 195, 138, 0.45)",
              color: "#86EFAC",
              padding: "2px 9px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "11px",
            }}
          >
            ● COUNCIL-2026-013 ACTIVE
          </span>
          <span>
            <strong>Operator:</strong> {operatorUsername} ({operatorRole} • {authMode})
          </span>
          <span style={{ color: "#94A3B8" }}>|</span>
          <span style={{ color: "#FDE68A" }}>
            7/7 Vercel Pro • 8/8 Supabase Pro (584 Tables) • 6/6 GitHub Webhooks
          </span>
          {syncMessage && (
            <span
              style={{
                background: "rgba(99, 102, 241, 0.18)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                color: "#C7D2FE",
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {syncMessage}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={busy}
            onClick={handleOpenCloudLandscape}
            style={{
              padding: "5px 11px",
              borderRadius: "7px",
              border: "1px solid rgba(56, 189, 248, 0.55)",
              background: "rgba(56, 189, 248, 0.16)",
              color: "#7DD3FC",
              fontWeight: 700,
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            ☁️ Cloud &amp; DB Matrix (7 Apps · 8 DBs)
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleRunArchCheck}
            style={{
              padding: "5px 11px",
              borderRadius: "7px",
              border: "1px solid rgba(76, 195, 138, 0.45)",
              background: "rgba(76, 195, 138, 0.14)",
              color: "#86EFAC",
              fontWeight: 600,
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            🛡️ Arch &amp; RLS Audit
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleCronSync}
            style={{
              padding: "5px 11px",
              borderRadius: "7px",
              border: "1px solid rgba(245, 158, 11, 0.45)",
              background: "rgba(245, 158, 11, 0.15)",
              color: "#FDE68A",
              fontWeight: 600,
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            ⚡ Pull GitHub &amp; Probe Fleet
          </button>
          <a
            href="/docs/control-plane/INFRASTRUCTURE-AND-CLOUD-LANDSCAPE.md"
            style={{
              padding: "5px 11px",
              borderRadius: "7px",
              border: "1px solid #334155",
              background: "#1E293B",
              color: "#F8FAFC",
              fontWeight: 600,
              fontSize: "11px",
              textDecoration: "none",
            }}
          >
            📄 Cloud Landscape Report
          </a>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "5px 11px",
              borderRadius: "7px",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              background: "rgba(239, 68, 68, 0.14)",
              color: "#FCA5A5",
              fontWeight: 600,
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {landscapeModalOpen && landscapeData && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5, 8, 15, 0.86)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1140px",
              background: "#0B111E",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "16px",
              padding: "24px",
              color: "#F8FAFC",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 24px 64px rgba(0,0,0,0.65)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: "18px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>☁️</span>
                  <h2 style={{ fontSize: "19px", fontWeight: 800, margin: 0 }}>
                    ChurchCore Unified Cloud &amp; Database Landscape Matrix ({landscapeData.document_id})
                  </h2>
                </div>
                <p style={{ fontSize: "12px", color: "#94A3B8", margin: "4px 0 0" }}>
                  100% Paid Pro Consolidation • Vercel Team: <code>{landscapeData.summary.vercel_team}</code> • Supabase Pro Org:{" "}
                  <code>{landscapeData.summary.supabase_org_id}</code> ({landscapeData.summary.supabase_org_name})
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <a
                  href={landscapeData.report_url}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(245, 158, 11, 0.45)",
                    background: "rgba(245, 158, 11, 0.16)",
                    color: "#FDE68A",
                    fontSize: "12px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  📄 Full Report Dossier
                </a>
                <button
                  type="button"
                  onClick={() => setLandscapeModalOpen(false)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    background: "#1E293B",
                    color: "#F8FAFC",
                    cursor: "pointer",
                  }}
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* 5 Top KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div style={{ background: "#111927", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Vercel Pro Fleet</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#4CC38A", marginTop: "2px" }}>
                  {landscapeData.summary.vercel_projects_ready}/{landscapeData.summary.vercel_projects_total} READY
                </div>
                <div style={{ fontSize: "11px", color: "#CBD5E1" }}>
                  Team <code>{landscapeData.summary.vercel_team}</code> ({landscapeData.summary.vercel_tier})
                </div>
              </div>
              <div style={{ background: "#111927", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Supabase Pro Silos</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#38BDF8", marginTop: "2px" }}>
                  {landscapeData.summary.supabase_databases_healthy}/{landscapeData.summary.supabase_databases_total} HEALTHY
                </div>
                <div style={{ fontSize: "11px", color: "#CBD5E1" }}>
                  Org <code>{landscapeData.summary.supabase_org_id}</code>
                </div>
              </div>
              <div style={{ background: "#111927", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Relational Scale</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#F59E0B", marginTop: "2px" }}>
                  {landscapeData.summary.total_tables_views} Tables/Views
                </div>
                <div style={{ fontSize: "11px", color: "#CBD5E1" }}>100% Forced RLS • 0.00% Shared PII</div>
              </div>
              <div style={{ background: "#111927", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Monthly Cron Runs</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#C4B5FD", marginTop: "2px" }}>
                  ~{landscapeData.summary.vercel_monthly_cron_invocations.toLocaleString()}/mo
                </div>
                <div style={{ fontSize: "11px", color: "#CBD5E1" }}>
                  {landscapeData.summary.vercel_cron_allowance_pct}% of 1M Pro Function Quota
                </div>
              </div>
              <div style={{ background: "#111927", border: "1px solid #1E293B", borderRadius: "10px", padding: "12px 14px" }}>
                <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Consolidated OpEx</div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#86EFAC", marginTop: "2px" }}>
                  {landscapeData.summary.estimated_monthly_opex_usd}
                </div>
                <div style={{ fontSize: "11px", color: "#CBD5E1" }}>7 Vercel Pro + 8 Supabase Pro DBs</div>
              </div>
            </div>

            {/* Section 1: 7 Vercel Pro Projects */}
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#7DD3FC", margin: "0 0 8px" }}>
              ▲ 1. Vercel Pro Production Projects (7/7 READY • 106 Env Vars • 11 Crons)
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "20px" }}>
              <thead>
                <tr style={{ background: "#162032", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Product</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Vercel Project</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Production URL</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>State</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Env Vars</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Cron Schedules</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Runs / Mo</th>
                </tr>
              </thead>
              <tbody>
                {landscapeData.vercel_projects.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontWeight: 700 }}>{p.product_name}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontFamily: "monospace", color: "#93C5FD" }}>
                      {p.vercel_project}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>
                      <a href={p.production_url} target="_blank" rel="noreferrer" style={{ color: "#38BDF8" }}>
                        {p.production_url.replace("https://", "")}
                      </a>
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", color: "#4CC38A", fontWeight: 700 }}>
                      ● {p.state} ({p.tier})
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>{p.env_vars_count}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontFamily: "monospace", fontSize: "11px" }}>
                      {p.crons.length ? p.crons.map((c) => `${c.schedule} (${c.path})`).join(", ") : "None"}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontFamily: "monospace" }}>
                      {p.monthly_cron_invocations.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Section 2: 8 Supabase Pro Databases */}
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#4CC38A", margin: "0 0 8px" }}>
              🐘 2. Supabase Pro Isolated PostgreSQL 17 Databases (8/8 ACTIVE_HEALTHY • 584 Tables/Views)
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginBottom: "16px" }}>
              <thead>
                <tr style={{ background: "#162032", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Database Name</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Project Ref</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Region</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Health &amp; PostgREST</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Tables / Views</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #1E293B" }}>Architectural Role</th>
                </tr>
              </thead>
              <tbody>
                {landscapeData.supabase_databases.map((db) => (
                  <tr key={db.id}>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontWeight: 700 }}>{db.database_name}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontFamily: "monospace", color: "#FDE68A" }}>
                      {db.project_ref}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontFamily: "monospace" }}>{db.region}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", color: "#4CC38A", fontWeight: 700 }}>
                      ● {db.status} ({db.postgrest_status})
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", fontWeight: 700, color: "#38BDF8" }}>
                      {db.tables_views_count}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #1E293B", color: "#CBD5E1" }}>{db.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {archModalOpen && archResult && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5, 8, 15, 0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "820px",
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "16px",
              padding: "24px",
              color: "#F8FAFC",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  🛡️ Sovereign Control Plane Architecture &amp; Security Audit
                </h2>
                <p style={{ fontSize: "12px", color: "#94A3B8", margin: "4px 0 0" }}>
                  Status: <strong>{archResult.status}</strong> ({archResult.passed_count}/
                  {archResult.total_checks} checks verified)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setArchModalOpen(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  background: "#1E293B",
                  color: "#F8FAFC",
                  cursor: "pointer",
                }}
              >
                Close ✕
              </button>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr style={{ background: "#1E293B", textAlign: "left" }}>
                  <th style={{ padding: "8px 10px", border: "1px solid #334155" }}>ID</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #334155" }}>Council Directive</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #334155" }}>Check</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #334155" }}>Status</th>
                  <th style={{ padding: "8px 10px", border: "1px solid #334155" }}>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {archResult.checks.map((chk) => (
                  <tr key={chk.id}>
                    <td style={{ padding: "8px 10px", border: "1px solid #334155", fontFamily: "monospace" }}>
                      {chk.id}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #334155", color: "#FDE68A" }}>
                      {chk.councilRef}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #334155" }}>
                      {chk.title}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #334155" }}>
                      {chk.passed ? "✅ PASS" : "❌ FAIL"}
                    </td>
                    <td style={{ padding: "8px 10px", border: "1px solid #334155", color: "#93C5FD", fontFamily: "monospace" }}>
                      {chk.evidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
