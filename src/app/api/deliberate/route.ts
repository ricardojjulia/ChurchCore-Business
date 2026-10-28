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
  query: z.string().min(3, "Deliberation query must be at least 3 characters.").max(4000),
  council_id: z.string().optional().default("council-grand"),
  target_product: z.string().optional().default("churchcore-business"),
  mode: z.string().optional().default("full_council"),
  commit_to_github: z.boolean().optional().default(true),
});

const protectedDeliberateAction = createProtectedAction(
  DeliberateSchema,
  async (data) => {
    const aiResult = await dispatchOpenRouterCompletion({
      taskType: "council_deliberation",
      systemPrompt:
        "You are the High Sovereign Grand Council of ChurchCore (6-Seat Binding Tribunal + 13 HQ Personas). Enforce Constitution Section III (Zero Customer Data Propagation), 100% Forced RLS, and Sunday Morning SLA (<50ms).",
      userPrompt: `Council: ${data.council_id} | Target Product: ${data.target_product} | Mode: ${data.mode}\nQuery: ${data.query}`,
      requestedMaxTokens: 2048,
    });

    const deliberationId = `DELIB-${Date.now()}`;
    const supabase = getSupabaseServiceClient();
    if (supabase) {
      try {
        await supabase.from("council_deliberations").insert({
          deliberation_id: deliberationId,
          council_id: data.council_id,
          target_product: data.target_product,
          mode: data.mode,
          query: data.query,
          verdict_status: "RATIFIED",
          model_pro_used: aiResult.audit.modelUsed,
          model_flash_used:
            process.env.OPENROUTER_FLASH_MODEL || "google/gemini-2.5-flash",
          deliberation_payload: {
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
          `# Sovereign Council Deliberation: ${deliberationId}`,
          ``,
          `- **Date:** ${new Date().toISOString()}`,
          `- **Council Chamber:** \`${data.council_id}\``,
          `- **Target Product:** \`${data.target_product}\``,
          `- **Deliberation Mode:** \`${data.mode}\``,
          `- **Verdict:** **6/6 UNANIMOUS RATIFICATION**`,
          `- **AI Model Used:** \`${aiResult.audit.modelUsed}\``,
          ``,
          `## Executive Query`,
          `> ${data.query.replace(/\n/g, "\n> ")}`,
          ``,
          `## Binding Synthesis & Directives`,
          aiResult.content,
          ``,
        ].join("\n");

        const pushed = await upsertRepoFile({
          targetRepo: HUB_REPO,
          filePath: `docs/deliberations/${deliberationId}.md`,
          content: mdContent,
          commitMessage: `chore(council): log ratified deliberation ${deliberationId} for ${data.target_product}`,
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
      verdict: "6/6 UNANIMOUS RATIFICATION",
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

