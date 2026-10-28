import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifyOperatorSession } from "@/lib/auth/session";
import { CloudGovernanceBanner } from "@/components/cockpit/CloudGovernanceBanner";
import { CockpitRuntimeViewport } from "@/components/cockpit/CockpitRuntimeViewport";
import { ChurchCoreTrustBadge } from "@/components/branding/ChurchCoreTrustBadge";

function loadCockpitBodyHtml(): string {
  const indexPath = path.join(process.cwd(), "dashboard", "index.html");
  try {
    const raw = fs.readFileSync(indexPath, "utf8");
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) return "";
    // Strip legacy trailing <script> tags so CockpitRuntimeViewport loads them sequentially after mount
    return bodyMatch[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  } catch {
    return "<div style='padding:32px'>Unable to load cockpit template.</div>";
  }
}

export default async function ExecutiveCockpitPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = verifyOperatorSession(token);

  if (!session) {
    redirect("/login");
  }

  const cockpitBodyHtml = loadCockpitBodyHtml();

  return (
    <div>
      <CloudGovernanceBanner
        operatorUsername={session.username}
        operatorRole={session.role}
        authMode={session.auth_mode}
      />

      <CockpitRuntimeViewport html={cockpitBodyHtml} />

      <footer
        style={{
          padding: "14px 24px",
          background: "#070B13",
          borderTop: "1px solid #1E293B",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <ChurchCoreTrustBadge />
        <span style={{ fontSize: "12px", color: "#94A3B8" }}>
          COUNCIL-2026-012 • Next.js 16 App Router • Supabase 100% Forced RLS •
          Zero Cross-App Customer Data Propagation
        </span>
      </footer>
    </div>
  );
}
