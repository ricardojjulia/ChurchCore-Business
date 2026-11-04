/**
 * Automated RLS & Sovereign Data-Isolation Security Audit (ChurchCore-Business)
 * Reference: COUNCIL-2026-012 / DIR-2026-EMBEDDED-SEC-001 & EMBEDDED-SECURITY-ARCHITECTURE.md (§6)
 *
 * Verifies that:
 * 1. Every table created across `supabase/migrations/*.sql` ends with ENABLE + FORCE ROW LEVEL SECURITY.
 * 2. Every table created across `supabase/migrations/*.sql` ends with >= 1 active CREATE POLICY.
 * 3. Every final SECURITY DEFINER function pins `SET search_path = public`.
 * 4. Sequential DDL simulation catches later revocations (`DISABLE`, `NO FORCE`, `DROP POLICY`).
 * 5. Constitution Section III (Zero Customer/Member/Donor/Patient PII) holds across all migrations.
 */

import * as fs from "node:fs";
import * as path from "node:path";

export interface AuditResult {
  suite: string;
  testName: string;
  passed: boolean;
  message: string;
}

/**
 * Dynamically inspects and simulates SQL migration statements sequentially to verify effective end state:
 * 1. Every created table ends with ENABLE ROW LEVEL SECURITY and FORCE ROW LEVEL SECURITY
 *    (a later DISABLE ROW LEVEL SECURITY or NO FORCE ROW LEVEL SECURITY invalidates protection)
 * 2. Every created table ends with at least 1 active CREATE POLICY
 *    (a later DROP POLICY without re-creation invalidates policy coverage)
 * 3. Every final SECURITY DEFINER function definition pins SET search_path = public
 */
export function auditSqlMigrationsText(rawSql: string): {
  passed: boolean;
  tablesChecked: number;
  errors: string[];
} {
  const sql = rawSql.replace(/\/\*[\s\S]*?\*\//g, "").replace(/--.*$/gm, "");
  const errors: string[] = [];

  interface TableRlsState {
    enabled: boolean;
    forced: boolean;
    policies: Set<string>;
  }

  const tableStates = new Map<string, TableRlsState>();

  // Discover all created tables (supporting optional quoted identifiers)
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

  if (tableStates.size === 0) {
    errors.push("Zero tables discovered in SQL migrations");
  }

  // Evaluate DDL statements in chronological order so later DISABLE / NO FORCE / DROP POLICY mutate effective state
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

  // Verify final effective SECURITY DEFINER functions pin search_path = public
  const functionBlocks = [
    ...sql.matchAll(
      /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:"?public"?\.)?"?(\w+)"?\s*\([\s\S]*?\$\$[\s\S]*?\$\$;/gi
    ),
  ];
  const effectiveFunctions = new Map<string, string>();
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

  // Verify Constitution Section III (Zero Customer/Member/Donor/Patient PII)
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
        `Constitution Section III violation: forbidden PII column '${col}' detected`
      );
    }
  }

  return {
    passed: errors.length === 0 && tableStates.size > 0,
    tablesChecked: tableStates.size,
    errors,
  };
}

export function runSecurityAuditSimulation(): AuditResult[] {
  const results: AuditResult[] = [];
  const migrationsDir = path.resolve(process.cwd(), "supabase/migrations");

  if (fs.existsSync(migrationsDir)) {
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    const combinedSql = migrationFiles
      .map((f) => fs.readFileSync(path.join(migrationsDir, f), "utf8"))
      .join("\n\n");

    const sqlAudit = auditSqlMigrationsText(combinedSql);
    results.push({
      suite: "Live SQL Migration RLS & Function Audit",
      testName: `All ${sqlAudit.tablesChecked} SQL migration tables enforce ENABLE + FORCE RLS, active policies, and pinned search_path=public`,
      passed: sqlAudit.passed,
      message: sqlAudit.passed
        ? `Verified ${sqlAudit.tablesChecked} tables with ENABLE + FORCE RLS and active policies`
        : `SQL RLS Violations: ${sqlAudit.errors.join("; ")}`,
    });

    // Live Sabotage Test: Append NO FORCE ROW LEVEL SECURITY and DROP POLICY in memory
    const sabotagedSql = `${combinedSql}\n
      ALTER TABLE public.control_plane_operators NO FORCE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS operators_select_policy ON public.control_plane_operators;
      DROP POLICY IF EXISTS operators_modify_policy ON public.control_plane_operators;
    `;
    const sabotageAudit = auditSqlMigrationsText(sabotagedSql);
    results.push({
      suite: "Live SQL Migration Sabotage Gate",
      testName:
        "Auditor catches NO FORCE ROW LEVEL SECURITY and DROP POLICY regression on effective state",
      passed: !sabotageAudit.passed && sabotageAudit.errors.length >= 2,
      message: !sabotageAudit.passed
        ? `Correctly rejected sabotaged effective state (${sabotageAudit.errors.join(", ")})`
        : "CRITICAL: Sabotaged SQL was not caught!",
    });
  } else {
    results.push({
      suite: "Live SQL Migration RLS & Function Audit",
      testName: "Migrations directory exists",
      passed: false,
      message: `Missing migrations directory: ${migrationsDir}`,
    });
  }

  return results;
}
