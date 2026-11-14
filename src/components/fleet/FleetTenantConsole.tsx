"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { FleetTenantRow } from "@/lib/fleet/store";
import { isLegalTransition } from "@/lib/fleet/spec";

export interface FleetTenantConsoleProps {
  initialTenants: FleetTenantRow[];
  registryError: string | null;
  products: string[];
  plans: string[];
  billingStatuses: string[];
}

type Action = "suspend" | "restore" | "archive" | "refresh";
const ACTION_TARGET: Record<Exclude<Action, "refresh">, string> = {
  suspend: "suspended",
  restore: "active",
  archive: "archived",
};

const STATUS_COLOR: Record<string, string> = {
  active: "var(--emerald-500, #10B981)",
  provisioning: "var(--cyan-400, #38BDF8)",
  provision_failed: "var(--rose-500, #F43F5E)",
  trial_expired: "var(--gold-500, #F59E0B)",
  suspended: "var(--gold-500, #F59E0B)",
  archived: "var(--text-dim, #64748B)",
  purged: "var(--text-dim, #64748B)",
};

const card: React.CSSProperties = {
  background: "var(--bg-surface, #0f172a)",
  border: "1px solid var(--border-subtle, #1e293b)",
  borderRadius: 12,
  padding: 20,
  marginBottom: 20,
};
const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "var(--bg-base, #020617)",
  color: "var(--text-main, #F8FAFC)",
  border: "1px solid var(--border-subtle, #1e293b)",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
};
const label: React.CSSProperties = { display: "block", fontSize: 12, color: "var(--text-muted, #94A3B8)", marginBottom: 4 };
const primaryBtn: React.CSSProperties = {
  background: "var(--indigo-600, #4F46E5)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "9px 16px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
const smallBtn: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-main, #F8FAFC)",
  border: "1px solid var(--border-subtle, #1e293b)",
  borderRadius: 6,
  padding: "4px 10px",
  fontSize: 12,
  cursor: "pointer",
  marginRight: 6,
};

const emptyForm = {
  fleet_tenant_id: "",
  product: "",
  slug: "",
  display_name: "",
  plan: "pro",
  billing_status: "trialing",
  admin_name: "",
  admin_email: "",
  timezone: "",
  country: "US",
  contract_ref: "",
};

export function FleetTenantConsole({ initialTenants, registryError, products, plans, billingStatuses }: FleetTenantConsoleProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...emptyForm,
    product: products[0] ?? "",
    timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC",
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function post(url: string, body?: unknown): Promise<void> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    const data = json?.data;
    if (res.ok && json?.success && data?.ok) {
      setMessage({ tone: "ok", text: `${data.tenant.slug}: ${data.tenant.tenant_status}${data.idempotent ? " (unchanged)" : ""}` });
    } else {
      const text = data?.message ?? json?.error?.message ?? `Request failed (HTTP ${res.status}).`;
      setMessage({ tone: "error", text });
    }
    router.refresh();
  }

  async function onProvision(e: React.FormEvent) {
    e.preventDefault();
    setBusy("provision");
    setMessage(null);
    try {
      await post("/api/fleet/provision", {
        ...(form.fleet_tenant_id ? { fleet_tenant_id: form.fleet_tenant_id } : {}),
        product: form.product,
        slug: form.slug.trim(),
        display_name: form.display_name.trim(),
        plan: form.plan,
        billing_status: form.billing_status,
        admin: { name: form.admin_name.trim(), email: form.admin_email.trim() },
        timezone: form.timezone.trim(),
        country: form.country.trim().toUpperCase(),
        contract_ref: form.contract_ref.trim() || null,
      });
    } finally {
      setBusy(null);
    }
  }

  async function onAction(t: FleetTenantRow, action: Action) {
    if (action === "archive" && !window.confirm(`Archive ${t.slug} in ${t.product}? Tenant users lose access.`)) return;
    setBusy(`${t.fleet_tenant_id}:${action}`);
    setMessage(null);
    try {
      await post(`/api/fleet/tenants/${t.fleet_tenant_id}/${action}`);
    } finally {
      setBusy(null);
    }
  }

  function prefillRetry(t: FleetTenantRow) {
    setForm((f) => ({
      ...f,
      fleet_tenant_id: t.fleet_tenant_id,
      product: t.product,
      slug: t.slug,
      plan: t.plan,
      billing_status: billingStatuses.includes(t.billing_status) ? t.billing_status : "trialing",
      contract_ref: t.contract_ref ?? "",
    }));
    setMessage({ tone: "ok", text: `Retry ${t.slug}: re-enter organization and admin details, then Provision.` });
  }

  const field = (k: keyof typeof emptyForm, text: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label style={label} htmlFor={`fleet-${k}`}>{text}</label>
      <input id={`fleet-${k}`} style={input} value={form[k]} onChange={set(k)} {...props} />
    </div>
  );

  return (
    <section aria-labelledby="fleet-tenants-heading">
      <h1 id="fleet-tenants-heading" style={{ fontFamily: "var(--font-serif)", fontSize: 28, margin: "0 0 4px" }}>
        Fleet tenants
      </h1>
      <p style={{ color: "var(--text-muted, #94A3B8)", margin: "0 0 20px", fontSize: 14 }}>
        COUNCIL-2026-016 registry: tenant identity, status and plan only. Organization and admin details are
        sent to the product and not stored here.
      </p>

      {registryError && (
        <div role="alert" style={{ ...card, borderColor: "var(--rose-500, #F43F5E)" }}>{registryError}</div>
      )}
      {message && (
        <div
          role="status"
          style={{ ...card, padding: 12, borderColor: message.tone === "ok" ? "var(--emerald-500)" : "var(--rose-500)" }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={onProvision} style={card} aria-label="Provision tenant">
        <h2 style={{ fontSize: 16, margin: "0 0 14px" }}>Provision a tenant</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <div>
            <label style={label} htmlFor="fleet-product">Product</label>
            <select id="fleet-product" style={input} value={form.product} onChange={set("product")}>
              {products.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {field("slug", "Workspace slug", { required: true, minLength: 3, maxLength: 30, pattern: "[a-z][a-z0-9]*(-[a-z0-9]+)*" })}
          {field("display_name", "Organization name", { required: true, minLength: 2, maxLength: 120 })}
          <div>
            <label style={label} htmlFor="fleet-plan">Plan</label>
            <select id="fleet-plan" style={input} value={form.plan} onChange={set("plan")}>
              {plans.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={label} htmlFor="fleet-billing">Billing status</label>
            <select id="fleet-billing" style={input} value={form.billing_status} onChange={set("billing_status")}>
              {billingStatuses.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {field("admin_name", "First admin name", { required: true, maxLength: 120 })}
          {field("admin_email", "First admin email", { required: true, type: "email", maxLength: 254 })}
          {field("timezone", "Time zone (IANA)", { required: true })}
          {field("country", "Country (ISO alpha-2)", { required: true, minLength: 2, maxLength: 2 })}
          {field("contract_ref", "Contract ref (optional)", { maxLength: 200 })}
          {field("fleet_tenant_id", "fleet_tenant_id (retry only)", { readOnly: true, placeholder: "minted on submit" })}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button type="submit" style={primaryBtn} disabled={busy !== null}>
            {busy === "provision" ? "Provisioning…" : "Provision"}
          </button>
          {form.fleet_tenant_id && (
            <button type="button" style={smallBtn} onClick={() => setForm((f) => ({ ...f, fleet_tenant_id: "" }))}>
              Clear retry
            </button>
          )}
        </div>
      </form>

      <div style={{ ...card, padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--text-muted, #94A3B8)" }}>
              {["Product", "Slug", "Status", "Billing", "Plan", "Source", "Trial ends", "fleet_tenant_id", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initialTenants.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 16, color: "var(--text-muted)" }}>No tenants registered yet.</td>
              </tr>
            )}
            {initialTenants.map((t) => (
              <tr key={t.fleet_tenant_id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "8px 12px" }}>{t.product}</td>
                <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)" }}>{t.slug}</td>
                <td style={{ padding: "8px 12px", color: STATUS_COLOR[t.tenant_status] }} title={t.last_error ?? undefined}>
                  {t.tenant_status}
                </td>
                <td style={{ padding: "8px 12px" }}>{t.billing_status}</td>
                <td style={{ padding: "8px 12px" }}>{t.plan}</td>
                <td style={{ padding: "8px 12px" }}>{t.signup_source}</td>
                <td style={{ padding: "8px 12px" }}>{t.trial_ends_at ? t.trial_ends_at.slice(0, 10) : "—"}</td>
                <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 11 }}>{t.fleet_tenant_id}</td>
                <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                  {(Object.keys(ACTION_TARGET) as Array<Exclude<Action, "refresh">>)
                    .filter((a) => isLegalTransition(t.tenant_status, ACTION_TARGET[a]))
                    .map((a) => (
                      <button key={a} type="button" style={smallBtn} disabled={busy !== null} onClick={() => onAction(t, a)}>
                        {busy === `${t.fleet_tenant_id}:${a}` ? "…" : a}
                      </button>
                    ))}
                  {t.tenant_status === "provision_failed" ? (
                    <button type="button" style={smallBtn} disabled={busy !== null} onClick={() => prefillRetry(t)}>
                      retry
                    </button>
                  ) : (
                    t.tenant_status !== "purged" && (
                      <button type="button" style={smallBtn} disabled={busy !== null} onClick={() => onAction(t, "refresh")}>
                        {busy === `${t.fleet_tenant_id}:refresh` ? "…" : "refresh"}
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
