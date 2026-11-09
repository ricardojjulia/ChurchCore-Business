import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, beforeEach } from "vitest";
import {
  evaluateAndRouteModel,
  compactPrompt,
  dispatchOpenRouterCompletion,
  semanticCache,
  getOpenRouterOptimizationSummary,
  OPENROUTER_ENDPOINT,
} from "@/lib/ai/openrouter-gateway";
import {
  scoreModelProfile,
  getOpenRouterModelRadar,
} from "@/lib/ai/model-discovery";

const ROOT = process.cwd();

describe("COUNCIL-2026-015: OpenRouter Default Fleet Provider, Optimization & Active Radar", () => {
  beforeEach(() => {
    semanticCache.clear();
  });

  it("REQ-015-01: enforces OpenRouter as default provider with Zero Data Retention", async () => {
    const gatewaySrc = fs.readFileSync(
      path.join(ROOT, "src/lib/ai/openrouter-gateway.ts"),
      "utf8"
    );
    expect(gatewaySrc).toContain(OPENROUTER_ENDPOINT);
    expect(gatewaySrc).toContain('data_collection: "deny"');

    const result = await dispatchOpenRouterCompletion({
      taskType: "tag_classification",
      systemPrompt: "Tag this issue",
      userPrompt: "classify issue #42",
    });

    expect(result.audit.endpoint).toBe(OPENROUTER_ENDPOINT);
    expect(result.audit.zeroDataRetentionEnforced).toBe(true);
  });

  it("REQ-015-02: dynamically routes tasks across Tier 1, Tier 2, and Tier 3 based on multi-dimensional scoring", () => {
    // Tier 1: Truthness & Deep Governance
    const t1 = evaluateAndRouteModel({
      taskType: "council_deliberation",
      userPrompt: "Audit PostgreSQL Row-Level Security under Constitution Section III",
    });
    expect(t1.tier).toBe("TIER_1_TRUTHNESS");
    expect(t1.truthnessScore).toBeGreaterThanOrEqual(95);
    expect(t1.primaryModel).toContain("gemini-2.5-pro");

    // Tier 3: Fast Micro-Latency
    const t3 = evaluateAndRouteModel({
      taskType: "tag_classification",
      userPrompt: "classify triage_tag for member checkin",
    });
    expect(t3.tier).toBe("TIER_3_FAST");
    expect(t3.efficiencyScore).toBeGreaterThanOrEqual(95);
    expect(t3.primaryModel).toContain("gemini-2.5-flash-lite");

    // Tier 2: Balanced Generative
    const t2 = evaluateAndRouteModel({
      taskType: "marketing_narrative",
      userPrompt: "Draft an announcement for the spring discipleship cohort",
    });
    expect(t2.tier).toBe("TIER_2_BALANCED");
    expect(t2.balancedScore).toBeGreaterThanOrEqual(90);
    expect(t2.primaryModel).toContain("gemini-2.5-flash");
  });

  it("REQ-015-03: compacts whitespace and context without losing semantic directives", () => {
    const raw = `
      You are the Lead Auditor.


      Review this database schema for    customer data propagation.

      Do not propagate.
    `;
    const { compacted, wasCompacted } = compactPrompt(raw);
    expect(wasCompacted).toBe(true);
    expect(compacted).not.toContain("   ");
    expect(compacted).not.toContain("\n\n\n");
    expect(compacted).toContain("customer data propagation");
  });

  it("REQ-015-03: returns cached responses in sub-5ms with zero token cost", async () => {
    semanticCache.set(
      "council_deliberation",
      "google/gemini-2.5-pro",
      "System Prompt",
      "Check RLS",
      "Deterministic Cached Synthesis",
      100,
      50
    );

    const res = await dispatchOpenRouterCompletion({
      taskType: "council_deliberation",
      systemPrompt: "System Prompt",
      userPrompt: "Check RLS",
    });

    expect(res.audit.cacheHit).toBe(true);
    expect(res.content).toBe("Deterministic Cached Synthesis");
    expect(res.audit.estimatedCostUsd).toBe(0);
    expect(res.audit.latencyMs).toBeLessThanOrEqual(50);
  });

  it("REQ-015-04: scores model profiles and exposes the Active OpenRouter Radar", async () => {
    const rawPro = {
      id: "anthropic/claude-3.7-sonnet",
      description: "Frontier hybrid reasoning flagship",
      context_length: 200000,
      pricing: { prompt: "0.000003", completion: "0.000015" },
    };
    const scored = scoreModelProfile(rawPro);
    expect(scored.recommended_tier).toBe("TIER_1_TRUTHNESS");
    expect(scored.score.truthness).toBeGreaterThanOrEqual(95);

    const radar = await getOpenRouterModelRadar(false);
    expect(radar.recommended_models.tier_1.length).toBeGreaterThan(0);
    expect(radar.recommended_models.tier_2.length).toBeGreaterThan(0);
    expect(radar.recommended_models.tier_3.length).toBeGreaterThan(0);
    expect(radar.active_tiers.tier_1_truthness).toBeDefined();

    const summary = await getOpenRouterOptimizationSummary();
    expect(summary.defaultProvider).toBe("openrouter");
    expect(summary.zeroDataRetentionMandate).toBe(true);
    expect(summary.cache).toBeDefined();
  });

  it("registers COUNCIL-2026-015 in manifest.json and council documentation", () => {
    expect(fs.existsSync(path.join(ROOT, "docs/council/COUNCIL-2026-015.md"))).toBe(true);

    const manifest = JSON.parse(
      fs.readFileSync(path.join(ROOT, "docs/governance-sync/manifest.json"), "utf8")
    );
    const d15 = manifest.decisions.find((d: { id: string }) => d.id === "COUNCIL-2026-015");
    expect(d15).toBeDefined();
    expect(d15.status).toBe("RATIFIED");
    expect(d15.requirements.map((r: { req_id: string }) => r.req_id)).toEqual([
      "REQ-015-01",
      "REQ-015-02",
      "REQ-015-03",
      "REQ-015-04",
    ]);
  });
});
