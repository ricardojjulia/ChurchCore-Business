import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ChurchCore Sovereign Control Plane | Executive Mission Control",
  description:
    "Central Sovereign Control Plane, Fleet Telemetry, Supabase Governance Ledger, and Executive Cockpit for the ChurchCore Ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css?v=20261028" />
        <script
          src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"
          defer
        ></script>
      </head>
      <body style={{ margin: 0, background: "#090D16", color: "#F8FAFC" }}>
        {children}
      </body>
    </html>
  );
}

