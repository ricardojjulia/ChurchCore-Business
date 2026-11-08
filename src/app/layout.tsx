import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";

const sans = localFont({
  src: "./fonts/inter-latin-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const serif = localFont({
  src: "./fonts/fraunces-latin-var.woff2",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin-var.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="/styles.css?v=20261108" />
        <script
          src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"
          defer
        ></script>
      </head>
      <body style={{ margin: 0, background: "#020617", color: "#F8FAFC" }}>
        {children}
      </body>
    </html>
  );
}
