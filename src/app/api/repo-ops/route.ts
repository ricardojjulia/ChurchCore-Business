import { NextResponse } from "next/server";
import { z } from "zod";
import { createProtectedAction } from "@/lib/security/action-wrapper";
import {
  ALLOWED_COUNCIL_REPOS,
  createCouncilPullRequest,
  getGitHubToken,
  HUB_REPO,
  inspectRepoGovernanceState,
  pullRepoFile,
  triggerRepoDispatch,
  upsertRepoFile,
} from "@/lib/github/repo-operator";
import { persistSyncExecutionLog } from "@/lib/supabase/control-plane-store";

const RepoOpsSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("inspect"),
    targetRepo: z.string().optional().default("all"),
  }),
  z.object({
    action: z.literal("pull_file"),
    targetRepo: z.string().min(1),
    filePath: z.string().min(1),
    branch: z.string().optional().default("main"),
  }),
  z.object({
    action: z.literal("push_file"),
    targetRepo: z.string().min(1),
    filePath: z.string().min(1),
    content: z.string().min(1),
    commitMessage: z.string().min(3),
    branch: z.string().optional().default("main"),
  }),
  z.object({
    action: z.literal("open_pr"),
    targetRepo: z.string().min(1),
    branchName: z.string().min(3),
    baseBranch: z.string().optional().default("main"),
    filePath: z.string().min(1),
    content: z.string().min(1),
    commitMessage: z.string().min(3),
    prTitle: z.string().min(3),
    prBody: z.string().min(3),
  }),
  z.object({
    action: z.literal("dispatch"),
    targetRepo: z.string().min(1),
    eventType: z.string().min(2).default("council_directive_ratified"),
    clientPayload: z.record(z.unknown()).optional(),
  }),
]);

const protectedRepoOpsAction = createProtectedAction(
  RepoOpsSchema,
  async (input) => {
    const startedAt = Date.now();

    if (input.action === "inspect") {
      const repos =
        input.targetRepo === "all"
          ? Array.from(ALLOWED_COUNCIL_REPOS)
          : [input.targetRepo];
      const states = await Promise.all(
        repos.map((r) => inspectRepoGovernanceState(r))
      );
      return {
        action: "inspect",
        githubTokenConfigured: Boolean(getGitHubToken()),
        hubRepo: HUB_REPO,
        repositories: states,
      };
    }

    if (input.action === "pull_file") {
      const file = await pullRepoFile(
        input.targetRepo,
        input.filePath,
        input.branch
      );
      return {
        action: "pull_file",
        file,
      };
    }

    if (input.action === "push_file") {
      const pushRes = await upsertRepoFile({
        targetRepo: input.targetRepo,
        filePath: input.filePath,
        content: input.content,
        commitMessage: input.commitMessage,
        branch: input.branch,
      });
      await persistSyncExecutionLog({
        trigger_source: "manual_operator",
        status: "success",
        products_synced: 1,
        duration_ms: Date.now() - startedAt,
        details: {
          repo_op: "push_file",
          ...pushRes,
        },
      });
      return {
        action: "push_file",
        result: pushRes,
      };
    }

    if (input.action === "open_pr") {
      const prRes = await createCouncilPullRequest({
        targetRepo: input.targetRepo,
        branchName: input.branchName,
        baseBranch: input.baseBranch,
        filePath: input.filePath,
        content: input.content,
        commitMessage: input.commitMessage,
        prTitle: input.prTitle,
        prBody: input.prBody,
      });
      await persistSyncExecutionLog({
        trigger_source: "manual_operator",
        status: "success",
        products_synced: 1,
        duration_ms: Date.now() - startedAt,
        details: {
          repo_op: "open_pr",
          ...prRes,
        },
      });
      return {
        action: "open_pr",
        result: prRes,
      };
    }

    const dispatchRes = await triggerRepoDispatch({
      targetRepo: input.targetRepo,
      eventType: input.eventType,
      clientPayload: input.clientPayload,
    });
    return {
      action: "dispatch",
      result: dispatchRes,
    };
  },
  {
    actionName: "council_repo_ops",
    rateLimit: {
      refillRate: 10,
      intervalMs: 60_000,
      capacity: 25,
    },
  }
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetRepo = searchParams.get("repo") || "all";
  const res = await protectedRepoOpsAction({
    action: "inspect",
    targetRepo,
  });
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await protectedRepoOpsAction(body);
    if (!res.success) {
      const statusMap: Record<string, number> = {
        INVALID_INPUT: 400,
        THREAT_DETECTED: 403,
        RATE_LIMIT_EXCEEDED: 429,
        UNAUTHORIZED_ORIGIN: 401,
        INTERNAL_SECURITY_FAIL: 500,
      };
      return NextResponse.json(res, {
        status: statusMap[res.error.code] || 400,
      });
    }
    return NextResponse.json(res);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Malformed JSON request for /api/repo-ops.",
        },
      },
      { status: 400 }
    );
  }
}

