import React from "react";

export interface ChurchCoreTrustBadgeProps {
  variant?: "footer" | "compact";
}

/**
 * COUNCIL-2026-002 (REQ-002-01 & REQ-002-02):
 * Canonical "Powered by ChurchCore" Trust Badge with WCAG AAA contrast compliance.
 */
export function ChurchCoreTrustBadge({
  variant = "footer",
}: ChurchCoreTrustBadgeProps) {
  return (
    <div
      data-testid="churchcore-trust-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: variant === "compact" ? "4px 10px" : "6px 14px",
        borderRadius: "9999px",
        background: "#0B111E",
        border: "1px solid rgba(245, 158, 11, 0.45)",
        color: "#F8FAFC",
        fontSize: variant === "compact" ? "11px" : "12px",
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#F59E0B",
          boxShadow: "0 0 8px rgba(245, 158, 11, 0.8)",
        }}
      />
      <span>Powered by ChurchCore</span>
      <span
        style={{
          color: "#FDE68A",
          fontSize: "10px",
          paddingLeft: "4px",
          borderLeft: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        Sovereign Control Plane • SEC-III
      </span>
    </div>
  );
}

