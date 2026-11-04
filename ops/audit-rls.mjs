#!/usr/bin/env node
/**
 * COUNCIL-2026-001 & COUNCIL-2026-012 / DIR-2026-EMBEDDED-SEC-001:
 * Stateful Control Plane Supabase Schema Row-Level Security (RLS), Sabotage Gate & Section III Auditor
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MIGRATIONS_DIR = path.join(ROOT, "supabase/migrations");

export function auditSqlMigrationsText(rawSql) {
  const sql = rawSql.replace(/\/\*[\s\S]*?\*\//g, "").replace(/--.*$/gm, "");
  const errors = [];
  const tableStates = new Map();

  const createTableMatches = [
    ...sql.matchAll(
      /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"?public"?\.)?"?(\w+)"?/gi
    ),
  ];
  for (const match of createTableMatches) {
    const table = match[1].toLowerCase();
    if (!tableStates.has(table)) {
      tableStates.set(table, {
        enabled: false,
        forced: false,
        policies: new Set(),
      });
    }
  }

  if (tableStates.size < 6) {
    errors.push(
      `Expected at least 6 governance tables, found ${tableStates.size}`
    );
  }

  const ddlTokenRegex =
    /(ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:"?public"?\.)?"?(\w+)"?\s+(ENABLE|DISABLE|FORCE|NO\s+FORCE)\s+ROW\s+LEVEL\s+SECURITY)|(CREATE\s+POLICY\s+["']?([^"'\n]+?)["']?\s+ON\s+(?:"?public"?\.)?"?(\w+)"?\b)|(DROP\s+POLICY\s+(?:IF\s+EXISTS\s+)?["']?([^"'\n]+?)["']?\s+ON\s+(?:"?public"?\.)?"?(\w+)"?\b)/gi;

  for (const token of sql.matchAll(ddlTokenRegex)) {
    if (token[1]) {
      const table = token[2].toLowerCase();
      const action = token[3].toUpperCase().replace(/\s+/g, " ");
      const state = tableStates.get(table);
      if (state) {
        if (action === "ENABLE") state.enabled = true;
        else if (action === "DISABLE") state.enabled = false;
        else if (action === "FORCE") state.forced = true;
        else if (action === "NO FORCE") state.forced = false;
      }
    } else if (token[4]) {
      const policyName = token[5].trim().toLowerCase();
      const table = token[6].toLowerCase();
      const state = tableStates.get(table);
      if (state) {
        state.policies.add(policyName);
      }
    } else if (token[7]) {
      const policyName = token[8].trim().toLowerCase();
      const table = token[9].toLowerCase();
      const state = tableStates.get(table);
      if (state) {
        state.policies.delete(policyName);
      }
    }
  }

  for (const [table, state] of tableStates.entries()) {
    if (!state.enabled) {
      errors.push(
        `Table '${table}' effective state is missing ENABLE ROW LEVEL SECURITY`
      );
    }
    if (!state.forced) {
      errors.push(
        `Table '${table}' effective state is missing FORCE ROW LEVEL SECURITY`
      );
    }
    if (state.policies.size === 0) {
      errors.push(
        `Table '${table}' effective state has zero active RLS policies`
      );
    }
  }

  const functionBlocks = [
    ...sql.matchAll(
      /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:"?public"?\.)?"?(\w+)"?\s*\([\s\S]*?\$\$[\s\S]*?\$\$;/gi
    ),
  ];
  const effectiveFunctions = new Map();
  for (const blockMatch of functionBlocks) {
    effectiveFunctions.set(blockMatch[1].toLowerCase(), blockMatch[0]);
  }
  for (const [fnName, block] of effectiveFunctions.entries()) {
    if (/SECURITY\s+DEFINER/i.test(block)) {
      if (!/SET\s+search_path\s*=\s*public\b/i.test(block)) {
        errors.push(
          `SECURITY DEFINER function '${fnName}' missing pinned SET search_path = public`
        );
      }
    }
  }

  const forbiddenColumns = [
    "donor_email",
    "credit_card",
    "patient_diagnosis",
    "counseling_note_body",
    "student_ssn",
  ];
  for (const col of forbiddenColumns) {
    if (sql.toLowerCase().includes(col)) {
      errors.push(
        `Constitution Section III violation: forbidden PII column "${col}" detected`
      );
    }
  }

  return {
    passed: errors.length === 0 && tableStates.size >= 6,
    tablesChecked: tableStates.size,
    errors,
  };
}

function runRlsAudit() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.error(`[-] Migrations directory missing: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  const migrationFiles = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const combinedSql = migrationFiles
    .map((f) => fs.readFileSync(path.join(MIGRATIONS_DIR, f), "utf8"))
    .join("\n\n");

  const audit = auditSqlMigrationsText(combinedSql);
  if (!audit.passed) {
    console.error("[-] Control Plane RLS & Section III Audit FAILED:");
    for (const err of audit.errors) {
      console.error(`    • ${err}`);
    }
    process.exit(1);
  }

  // Sabotage Gate Verification
  const sabotagedSql = `${combinedSql}\n
    ALTER TABLE public.control_plane_operators NO FORCE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS operators_select_policy ON public.control_plane_operators;
    DROP POLICY IF EXISTS operators_modify_policy ON public.control_plane_operators;
  `;
  const sabotageAudit = auditSqlMigrationsText(sabotagedSql);
  if (sabotageAudit.passed || sabotageAudit.errors.length < 2) {
    console.error(
      "[-] Control Plane RLS Sabotage Gate FAILED: Auditor did not catch NO FORCE / DROP POLICY regression!"
    );
    process.exit(1);
  }

  console.log(
    `[+] COUNCIL-2026-001 & COUNCIL-2026-012 Stateful RLS Audit PASSED (${audit.tablesChecked}/${audit.tablesChecked} tables with ENABLE + FORCE RLS, active policies, search_path=public pinned, sabotage gate verified, 0 Section III PII columns).`
  );
}

runRlsAudit();
