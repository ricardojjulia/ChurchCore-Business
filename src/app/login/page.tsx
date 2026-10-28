"use client";

import React, { useState } from "react";
import { ChurchCoreTrustBadge } from "@/components/branding/ChurchCoreTrustBadge";

export default function ControlPlaneLoginPage() {
  const [username, setUsername] = useState("admin@churchcore.io");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<{
    code?: string;
    message: string;
    isThreat?: boolean;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorState(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const payload = await res.json();

      if (!res.ok || !payload.success) {
        setErrorState({
          code: payload?.error?.code || "UNAUTHORIZED_ORIGIN",
          message:
            payload?.error?.message || "Invalid operator credentials.",
          isThreat: Boolean(payload?.error?.isThreat),
        });
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const nextUrl = params.get("next") || "/";
      window.location.href = nextUrl;
    } catch {
      setErrorState({
        code: "INTERNAL_SECURITY_FAIL",
        message: "Network error communicating with Control Plane security gate.",
      });
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, #172036 0%, #090D16 65%, #05080F 100%)",
        color: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "32px 16px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ marginTop: "12px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 12px",
            borderRadius: "999px",
            background: "rgba(76, 195, 138, 0.12)",
            border: "1px solid rgba(76, 195, 138, 0.35)",
            color: "#86EFAC",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          🛡️ COUNCIL-2026-012 • Embedded Security Gate Active
        </span>
      </div>

      <main
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(15, 23, 42, 0.92)",
          border: "1px solid rgba(148, 163, 184, 0.22)",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 14px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#090D16",
              fontWeight: 800,
              fontSize: "20px",
            }}
          >
            ⛪
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "6px",
            }}
          >
            ChurchCore Control Plane
          </h1>
          <p style={{ fontSize: "13px", color: "#CBD5E1" }}>
            Sovereign Executive Mission Control • Operator Authentication
          </p>
        </div>

        {errorState && (
          <div
            role="alert"
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: errorState.isThreat
                ? "rgba(239, 68, 68, 0.18)"
                : "rgba(245, 158, 11, 0.16)",
              border: errorState.isThreat
                ? "1px solid rgba(239, 68, 68, 0.5)"
                : "1px solid rgba(245, 158, 11, 0.45)",
              color: errorState.isThreat ? "#FCA5A5" : "#FDE68A",
              fontSize: "13px",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: "2px" }}>
              {errorState.isThreat
                ? `🚨 Security Guardrail Block (${errorState.code})`
                : `⚠️ Authentication Notice (${errorState.code})`}
            </div>
            <div>{errorState.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="cp-username"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#E2E8F0",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Operator Username / Email
            </label>
            <input
              id="cp-username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@churchcore.io"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#090D16",
                color: "#F8FAFC",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              htmlFor="cp-password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#E2E8F0",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Sovereign Passphrase
            </label>
            <input
              id="cp-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter operator password"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#090D16",
                color: "#F8FAFC",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              color: "#090D16",
              fontWeight: 700,
              fontSize: "14px",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading
              ? "Verifying Cryptographic Session..."
              : "Authenticate to Executive Cockpit →"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(148, 163, 184, 0.15)",
            fontSize: "12px",
            color: "#94A3B8",
            lineHeight: 1.5,
          }}
        >
          <div>
            <strong>Protected by:</strong> Next.js 16 Action Wrapper, Supabase Auth SSR,
            100% Forced PostgreSQL RLS, and Constant-Time Cron/Webhook Guards.
          </div>
        </div>
      </main>

      <footer style={{ marginBottom: "8px" }}>
        <ChurchCoreTrustBadge />
      </footer>
    </div>
  );
}

