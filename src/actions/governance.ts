"use server";

/**
 * ChurchCore Sovereign Control Plane — Protected Governance & AI Server Actions
 * Reference: COUNCIL-2026-012 / DIR-2026-EMBEDDED-SEC-001
 */

import { z } from "zod";
import {
  createProtectedAction,
  evaluateEmbeddedGuardrails,
} from "@/lib/security/action-wrapper";
import { dispatchOpenRouterCompletion } from "@/lib/ai/openrouter-gateway";

const RatifyCouncilResolutionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(280),
  contextStatement: z.string().min(5, "Context statement must be at least 5 characters.").max(4000),
  decisionPoints: z.array(z.string().min(1)).min(1),
  domainTags: z.array(z.string()).default([]),
  relatedArtifacts: z.array(z.string()).default([]),
  amendmentsAdopted: z.array(z.string()).default([]),
  testSurfacesCovered: z.array(z.string()).default([]),
  sealedBy: z.string().min(2).max(120),
});

export type RatifyCouncilResolutionInput = z.infer<typeof RatifyCouncilResolutionSchema>;

const protectedRatifyAction = createProtectedAction(
  RatifyCouncilResolutionSchema,
  async (data, context) => {
    const aiResult = await dispatchOpenRouterCompletion({
      taskType: "council_deliberation",
      systemPrompt:
        "You are the High Sovereign Grand Council of ChurchCore. Ratify governance resolutions under Constitution Section III and 100% Forced RLS.",
      userPrompt: `Resolution: ${data.title}\nContext: ${data.contextStatement}\nDecisions: ${data.decisionPoints.join("; ")}`,
      requestedMaxTokens: 1024,
    });

    return {
      resolutionId: `COUNCIL-RES-${Date.now()}`,
      title: data.title,
      status: "RATIFIED" as const,
      sealedBy: data.sealedBy,
      operatorIp: context.ip,
      synthesis: aiResult.content,
      audit: aiResult.audit,
    };
  },
  {
    actionName: "ratify_council_resolution",
    rateLimit: {
      refillRate: 5,
      intervalMs: 60_000,
      capacity: 15,
    },
  }
);

export async function ratifyCouncilResolution(input: RatifyCouncilResolutionInput) {
  const res = await protectedRatifyAction(input);
  if (!res.success) {
    return {
      success: false as const,
      error: res.error.message,
      securityError: res.error,
    };
  }
  return {
    success: true as const,
    data: res.data,
  };
}

export async function simulateSpecialistConsultation(
  seatDomain: string,
  question: string
) {
  const guardDecision = await evaluateEmbeddedGuardrails(
    { seatDomain, question },
    {
      actionName: "specialist_consultation",
      rateLimit: {
        refillRate: 8,
        intervalMs: 60_000,
        capacity: 20,
      },
    }
  );

  if (!guardDecision.allowed) {
    return {
      success: false as const,
      error: guardDecision.error.message,
      securityError: guardDecision.error,
    };
  }

  const aiResult = await dispatchOpenRouterCompletion({
    taskType: "council_deliberation",
    systemPrompt: `You are the ChurchCore Specialist Seat Guardian for domain '${seatDomain}'.`,
    userPrompt: question,
    requestedMaxTokens: 1024,
  });

  return {
    success: true as const,
    seatDomain,
    response: aiResult.content,
    audit: aiResult.audit,
  };
}

