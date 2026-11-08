import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

describe("COUNCIL-2026-014: Unified ChurchCore Design System & UI Standardization", () => {
  it("REQ-014-01: bundles all 3 canonical self-hosted variable .woff2 fonts and loads them via next/font/local", () => {
    const fontsDir = path.join(ROOT, "src/app/fonts");
    expect(fs.existsSync(path.join(fontsDir, "inter-latin-var.woff2"))).toBe(true);
    expect(fs.existsSync(path.join(fontsDir, "fraunces-latin-var.woff2"))).toBe(true);
    expect(fs.existsSync(path.join(fontsDir, "geist-mono-latin-var.woff2"))).toBe(true);

    const layoutText = fs.readFileSync(path.join(ROOT, "src/app/layout.tsx"), "utf8");
    expect(layoutText).toContain('import localFont from "next/font/local"');
    expect(layoutText).toContain("./fonts/inter-latin-var.woff2");
    expect(layoutText).toContain("./fonts/fraunces-latin-var.woff2");
    expect(layoutText).toContain("./fonts/geist-mono-latin-var.woff2");
    expect(layoutText).not.toContain("fonts.googleapis.com");
  });

  it("REQ-014-02: enforces Dark-First Slate-950 (#020617) canvas, Slate-900 (#0f172a) surface, and Indigo/Amber tokens", () => {
    const stylesText = fs.readFileSync(path.join(ROOT, "public/styles.css"), "utf8");
    expect(stylesText).toContain("--bg-base: #020617");
    expect(stylesText).toContain("--bg-surface: #0f172a");
    expect(stylesText).toContain("--indigo-600: #4F46E5");
    expect(stylesText).toContain("--gold-500: #F59E0B");
    expect(stylesText).toContain("--text-main: #F8FAFC");
  });

  it("REQ-014-04: registers COUNCIL-2026-014 in docs/governance-sync/manifest.json and docs/council/COUNCIL-2026-014.md", () => {
    expect(fs.existsSync(path.join(ROOT, "docs/council/COUNCIL-2026-014.md"))).toBe(true);
    const manifest = JSON.parse(
      fs.readFileSync(path.join(ROOT, "docs/governance-sync/manifest.json"), "utf8")
    );
    const decision = manifest.decisions.find(
      (d: { id: string }) => d.id === "COUNCIL-2026-014"
    );
    expect(decision).toBeDefined();
    expect(decision.status).toBe("RATIFIED");
    expect(decision.requirements.map((r: { req_id: string }) => r.req_id)).toEqual([
      "REQ-014-01",
      "REQ-014-02",
      "REQ-014-03",
      "REQ-014-04",
    ]);
  });

  it("enforces Apple-simple Council member cards with click-to-inspect focus drawer and distinct Report vs. Fully Acknowledged Decision deliverables", () => {
    const dashboardHtml = fs.readFileSync(path.join(ROOT, "dashboard/index.html"), "utf8");
    expect(dashboardHtml).toContain('id="council-member-inspector"');
    expect(dashboardHtml).toContain('id="btn-deliverable-report"');
    expect(dashboardHtml).toContain('id="btn-deliverable-decision"');

    const appJs = fs.readFileSync(path.join(ROOT, "public/app.js"), "utf8");
    expect(appJs).toContain("renderMemberInspector");
    expect(appJs).toContain("Executive Analytical Report:");
    expect(appJs).toContain("Fully Acknowledged Council Decision:");
    expect(appJs).toContain("Official Seat-by-Seat Signed Acknowledgment");

    const routeTs = fs.readFileSync(path.join(ROOT, "src/app/api/deliberate/route.ts"), "utf8");
    expect(routeTs).toContain("resolveDeliverableType");
    expect(routeTs).toContain("deliverable_type");
  });
});

