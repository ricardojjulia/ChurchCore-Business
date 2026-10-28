#!/usr/bin/env node
/**
 * COUNCIL-2026-001 & COUNCIL-2026-012 (REQ-012-03):
 * Control Plane Supabase Schema Row-Level Security (RLS) & Section III Isolation Auditor
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MIGRATION_FILE = path.join(
  ROOT,
  "supabase/migrations/20261028000000_control_plane_governance_schema.sql"
);

function runRlsAudit() {
  if (!fs.existsSync(MIGRATION_FILE)) {
    console.error(`[-] Migration file missing: ${MIGRATION_FILE}`);
    process.exit(1);
  }

  const rawSql = fs.readFileSync(MIGRATION_FILE, "utf8");
  const sql = rawSql.replace(/--.*$/gm, "");
  const errors = [];

  // 1. Extract all created tables in public schema
  const tableMatches = [
    ...sql.matchAll(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.(\w+)/gi),
  ];
  const tables = tableMatches.map((m) => m[1]);

  if (tables.length < 6) {
    errors.push(`Expected at least 6 governance tables, found ${tables.length}`);
  }

  for (const table of tables) {
    const enableRegex = new RegExp(
      `ALTER\\s+TABLE\\s+public\\.${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY;`,
      "i"
    );
    const forceRegex = new RegExp(
      `ALTER\\s+TABLE\\s+public\\.${table}\\s+FORCE\\s+ROW\\s+LEVEL\\s+SECURITY;`,
      "i"
    );
    const policyRegex = new RegExp(
      `CREATE\\s+POLICY\\s+\\w+\\s+ON\\s+public\\.${table}\\b`,
      "i"
    );

    if (!enableRegex.test(sql)) {
      errors.push(`Table public.${table} is missing ENABLE ROW LEVEL SECURITY`);
    }
    if (!forceRegex.test(sql)) {
      errors.push(`Table public.${table} is missing FORCE ROW LEVEL SECURITY`);
    }
    if (!policyRegex.test(sql)) {
      errors.push(`Table public.${table} has zero active RLS policies`);
    }
  }

  // 2. Check SECURITY DEFINER functions pin search_path = public
  const secDefCount = (sql.match(/SECURITY\s+DEFINER/gi) || []).length;
  const searchPathCount = (sql.match(/SET\s+search_path\s*=\s*public/gi) || [])
    .length;
  if (secDefCount === 0 || secDefCount !== searchPathCount) {
    errors.push(
      `SECURITY DEFINER search_path mismatch: ${secDefCount} functions vs ${searchPathCount} pinned search_path=public`
    );
  }

  // 3. Check Constitution Section III: Zero Customer/Member/Donor/Patient PII columns
  const forbiddenColumns = [
    "donor_email",
    "credit_card",
    "patient_diagnosis",
    "counseling_note_body",
    "student_ssn",
  ];
  for (const col of forbiddenColumns) {
    if (sql.toLowerCase().includes(col)) {
      errors.push(`Constitution Section III violation: forbidden PII column "${col}" detected`);
    }
  }

  if (errors.length > 0) {
    console.error("[-] Control Plane RLS & Section III Audit FAILED:");
    for (const err of errors) {
      console.error(`    • ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `[+] COUNCIL-2026-001 & COUNCIL-2026-012 RLS Audit PASSED (${tables.length}/${tables.length} tables with ENABLE + FORCE RLS, search_path=public pinned, 0 Section III PII columns).`
  );
}

runRlsAudit();
