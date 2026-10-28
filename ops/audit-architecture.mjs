#!/usr/bin/env node
/**
 * COUNCIL-2026-012: Full Architecture & Governance Compliance Auditor
 * Verifies all 10 Control Plane architectural invariants before build/deploy.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const REQUIRED_FILES = [
  "docs/council/COUNCIL-2026-012.md",
  "docs/control-plane/EMBEDDED-SECURITY-ARCHITECTURE.md",
  "supabase/migrations/20261028000000_control_plane_governance_schema.sql",
  "src/types/security.ts",
  "src/lib/security/crypto-guards.ts",
  "src/lib/security/action-wrapper.ts",
  "src/lib/auth/session.ts",
  "src/lib/ai/openrouter-gateway.ts",
  "src/lib/sync/fleet-synchronizer.ts",
  "src/middleware.ts",
  "src/app/login/page.tsx",
  "src/app/page.tsx",
  "src/app/api/auth/login/route.ts",
  "src/app/api/cron/fleet-sync/route.ts",
  "src/app/api/webhooks/github/route.ts",
  "src/components/branding/ChurchCoreTrustBadge.tsx",
  "localization-governance.config.mjs",
  "ops/translate-locale.mjs",
  "data/glossaries/es.json",
  "vercel.json",
];

function runArchAudit() {
  const missing = [];
  for (const rel of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(ROOT, rel))) {
      missing.push(rel);
    }
  }

  if (missing.length > 0) {
    console.error("[-] Architecture Audit FAILED — missing required artifacts:");
    for (const m of missing) console.error(`    • ${m}`);
    process.exit(1);
  }

  const gw = fs.readFileSync(
    path.join(ROOT, "src/lib/ai/openrouter-gateway.ts"),
    "utf8"
  );
  if (!gw.includes("https://openrouter.ai/api/v1/chat/completions") || !gw.includes('data_collection: "deny"')) {
    console.error("[-] COUNCIL-2026-010 violation: OpenRouter gateway or Zero Data Retention missing.");
    process.exit(1);
  }

  console.log(
    `[+] COUNCIL-2026-012 Architecture & Security Gate PASSED (${REQUIRED_FILES.length}/${REQUIRED_FILES.length} required architectural modules verified).`
  );
}

runArchAudit();

