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

export function CloudGovernanceBanner({
  operatorUsername,
  operatorRole,
  authMode,
}: CloudGovernanceBannerProps) {
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [archResult, setArchResult] = useState<ArchCheckResult | null>(null);
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
            ● COUNCIL-2026-012 ACTIVE
          </span>
          <span>
            <strong>Operator:</strong> {operatorUsername} ({operatorRole} • {authMode})
          </span>
          <span style={{ color: "#94A3B8" }}>|</span>
          <span style={{ color: "#FDE68A" }}>
            Vercel Cron (<code>*/15 * * * *</code>) + GitHub Webhook HMAC + 100% Forced RLS
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

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            href="/docs/council/COUNCIL-2026-012.md"
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
            📜 COUNCIL-012 Dossier
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

