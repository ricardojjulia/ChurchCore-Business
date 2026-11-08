import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import { dispatchOpenRouterCompletion } from "@/lib/ai/openrouter-gateway";
import { getSupabaseServiceClient } from "@/lib/supabase/control-plane-store";
import {
  getGitHubToken,
  HUB_REPO,
  upsertRepoFile,
} from "@/lib/github/repo-operator";

const DeliberateSchema = z.object({
  query: z
    .string()
    .min(3, "Deliberation query must be at least 3 characters.")
    .max(4000),
  council_id: z.string().optional().default("council-grand"),
  target_product: z.string().optional().default("churchcore-business"),
  mode: z.string().optional().default("all"),
  member_id: z.string().nullable().optional().default(null),
  deliverable_type: z
    .enum(["auto", "report", "decision"])
    .optional()
    .default("auto"),
  commit_to_github: z.boolean().optional().default(true),
});

export function resolveDeliverableType(
  query: string,
  requestedType?: "auto" | "report" | "decision"
): "report" | "decision" {
  if (requestedType === "report" || requestedType === "decision") {
    return requestedType;
  }
  const q = query.toLowerCase();
  const decisionKeywords = [
    "decide",
    "decision",
    "ratify",
    "ratification",
    "approve",
    "approval",
    "authorize",
    "mandate",
    "ruling",
    "vote",
    "directive",
    "enact",
  ];
  const reportKeywords = [
    "report",
    "audit",
    "assess",
    "assessment",
    "compare",
    "comparison",
    "analyze",
    "analysis",
    "review",
    "status",
    "inspect",
    "landscape",
    "summary",
    "summarize",
    "evaluate",
    "evaluation",
    "breakdown",
    "overview",
    "findings",
    "how is",
    "what is the state",
  ];

  if (reportKeywords.some((k) => q.includes(k)) && !q.includes("deliver a decision")) {
    return "report";
  }
  if (decisionKeywords.some((k) => q.includes(k))) {
    return "decision";
  }
  return "report";
}

const protectedDeliberateAction = createProtectedAction(
  DeliberateSchema,
  async (data) => {
    const deliverableType = resolveDeliverableType(
      data.query,
      data.deliverable_type
    );

    const systemPrompt =
      deliverableType === "report"
        ? [
            "You are the ChurchCore Sovereign Council Analytical Reporting Engine (Grand Council & Product Councils).",
            "The user has requested a THOROUGH, CRISP, PROFESSIONAL EXECUTIVE REPORT — NOT a generic 'agreed/not agreed' vote.",
            "Produce a publication-grade Markdown Executive Report with the following exact sections:",
            "1. ## Executive Summary & Core Findings (crisp, authoritative synthesis directly answering the inquiry)",
            "2. ## Analytical & Technical Matrix (a Markdown table comparing key dimensions, metrics, current state, and target benchmarks)",
            "3. ## Deep-Dive Domain Analysis (substantive findings across Architecture, Database/100% Forced RLS, <50ms Sunday SLA, UI/UX WCAG AAA Standard, and Domain Fidelity)",
            "4. ## Risk Register & Prioritized Recommendations (concrete P0/P1/P2 action items with verification criteria).",
            "Maintain Apple-grade clarity, precision, and zero filler.",
          ].join(" ")
        : [
            "You are the ChurchCore Sovereign Council Decision & Ratification Tribunal.",
            "The user has requested a FULLY ACKNOWLEDGED SOVEREIGN DECISION — NOT a generic one-line agreement.",
            "Produce a comprehensive, binding Decision Document in Markdown with the following exact sections:",
            "1. ## Binding Determination & Executive Rationale (clear decision statement, architectural thesis, invariant audit scrutiny, and final synthesis)",
            "2. ## Ratified Implementation Requirements (Markdown table with Req ID, Requirement Specification, Owner Seat, and Verification Gate)",
            "3. ## Formal Seat-by-Seat Acknowledgment Covenant (explicit domain acknowledgments, conditions, and binding sign-offs for each council seat)",
            "4. ## Execution & Verification Protocol (exact commands, tests, and constitutional guardrails required).",
          ].join(" ");

    const aiResult = await dispatchOpenRouterCompletion({
      taskType: "council_deliberation",
      systemPrompt,
      userPrompt: `Council: ${data.council_id} | Target Product: ${data.target_product} | Consultation Mode: ${data.mode}${
        data.member_id ? ` (Seat: ${data.member_id})` : ""
      } | Deliverable Type: ${deliverableType.toUpperCase()}\n\nInquiry / Subject:\n${data.query}`,
      requestedMaxTokens: 2048,
    });

    const prefix = deliverableType === "report" ? "RPT" : "DEC";
    const deliberationId = `${prefix}-${Date.now()}`;
    const verdictLabel =
      deliverableType === "report"
        ? "EXECUTIVE ANALYTICAL REPORT DELIVERED"
        : "FORMALLY ACKNOWLEDGED & RATIFIED DECISION";

    const supabase = getSupabaseServiceClient();
    if (supabase) {
      try {
        await supabase.from("council_deliberations").insert({
          deliberation_id: deliberationId,
          council_id: data.council_id,
          target_product: data.target_product,
          mode: `${data.mode}:${deliverableType}`,
          query: data.query,
          verdict_status:
            deliverableType === "report" ? "REPORT_DELIVERED" : "RATIFIED",
          model_pro_used: aiResult.audit.modelUsed,
          model_flash_used:
            process.env.OPENROUTER_FLASH_MODEL || "google/gemini-2.5-flash",
          deliberation_payload: {
            deliverable_type: deliverableType,
            member_id: data.member_id,
            content: aiResult.content,
            audit: aiResult.audit,
          },
        });
      } catch {
        // Non-fatal in hybrid mode
      }
    }

    let githubCommit: {
      repo: string;
      path: string;
      commitSha: string;
      commitUrl: string;
    } | null = null;

    if (data.commit_to_github && getGitHubToken()) {
      try {
        const mdContent = [
          `# Sovereign Council ${
            deliverableType === "report" ? "Executive Report" : "Acknowledged Decision"
          }: ${deliberationId}`,
          ``,
          `- **Date:** ${new Date().toISOString()}`,
          `- **Council Chamber:** \`${data.council_id}\``,
          `- **Target Product:** \`${data.target_product}\``,
          `- **Deliverable Type:** \`${deliverableType.toUpperCase()}\``,
          `- **Status:** **${verdictLabel}**`,
          `- **AI Model Used:** \`${aiResult.audit.modelUsed}\``,
          ``,
          `## Subject`,
          `> ${data.query.replace(/\n/g, "\n> ")}`,
          ``,
          `## Official Deliverable`,
          aiResult.content,
          ``,
        ].join("\n");

        const pushed = await upsertRepoFile({
          targetRepo: HUB_REPO,
          filePath: `docs/deliberations/${deliberationId}.md`,
          content: mdContent,
          commitMessage: `chore(council): log ${deliverableType} ${deliberationId} for ${data.target_product}`,
          branch: "main",
        });

        githubCommit = {
          repo: pushed.repo,
          path: pushed.path,
          commitSha: pushed.commitSha,
          commitUrl: pushed.commitUrl,
        };
      } catch {
        // Non-fatal if GitHub push is unavailable
      }
    }

    return {
      deliberation_id: deliberationId,
      council_id: data.council_id,
      target_product: data.target_product,
      deliverable_type: deliverableType,
      member_id: data.member_id,
      verdict: verdictLabel,
      synthesis: aiResult.content,
      audit: aiResult.audit,
      github_commit: githubCommit,
    };
  },
  {
    actionName: "council_deliberate",
    rateLimit: {
      refillRate: 5,
      intervalMs: 60_000,
      capacity: 15,
    },
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await protectedDeliberateAction(body);
    if (!res.success) {
      const statusMap: Record<string, number> = {
        INVALID_INPUT: 400,
        THREAT_DETECTED: 403,
        RATE_LIMIT_EXCEEDED: 429,
        INTERNAL_SECURITY_FAIL: 500,
      };
      return NextResponse.json(res, { status: statusMap[res.error.code] || 400 });
    }
    return NextResponse.json(res);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INVALID_INPUT", message: "Invalid JSON payload." },
      },
      { status: 400 }
    );
  }
}
