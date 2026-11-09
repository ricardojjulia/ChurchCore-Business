import crypto from "node:crypto";

export interface DiscoveredModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: number; // USD per token
    completion: number; // USD per token
  };
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string;
  };
  supported_parameters?: string[];
  created?: number;
  is_new?: boolean;
  score: {
    truthness: number; // 0-100
    efficiency: number; // 0-100
    balanced: number; // 0-100
  };
  recommended_tier: "TIER_1_TRUTHNESS" | "TIER_2_BALANCED" | "TIER_3_FAST";
  badges: string[];
}

export interface ModelRadarCatalog {
  last_updated: string;
  source: "live_api" | "cached_snapshot";
  total_models_evaluated: number;
  active_tiers: {
    tier_1_truthness: string;
    tier_2_balanced: string;
    tier_3_fast: string;
  };
  recommended_models: {
    tier_1: DiscoveredModel[];
    tier_2: DiscoveredModel[];
    tier_3: DiscoveredModel[];
  };
  newly_discovered: DiscoveredModel[];
}

const STATIC_FALLBACK_CATALOG: DiscoveredModel[] = [
  {
    id: "google/gemini-2.5-pro",
    name: "Google: Gemini 2.5 Pro",
    description: "Frontier reasoning model with 1M context window and state-of-the-art coding and analytical depth.",
    context_length: 1048576,
    pricing: { prompt: 0.00000125, completion: 0.000005 },
    score: { truthness: 98, efficiency: 78, balanced: 90 },
    recommended_tier: "TIER_1_TRUTHNESS",
    badges: ["Frontier", "1M Context", "Deep Reasoning", "Code Complete"]
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Anthropic: Claude 3.7 Sonnet",
    description: "Hybrid reasoning flagship combining instant responses with adaptive deep thinking.",
    context_length: 200000,
    pricing: { prompt: 0.000003, completion: 0.000015 },
    score: { truthness: 99, efficiency: 72, balanced: 88 },
    recommended_tier: "TIER_1_TRUTHNESS",
    badges: ["Frontier", "Hybrid Thinking", "Top Code Benchmarks"]
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek: DeepSeek R1",
    description: "Open-weights reasoning model with mathematical and architectural proof verification.",
    context_length: 128000,
    pricing: { prompt: 0.00000055, completion: 0.00000219 },
    score: { truthness: 96, efficiency: 86, balanced: 92 },
    recommended_tier: "TIER_1_TRUTHNESS",
    badges: ["High Reasoning", "Low Cost", "Open Weights"]
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Google: Gemini 2.5 Flash",
    description: "Sub-second generative workhorse optimized for speed, accuracy, and high usability.",
    context_length: 1048576,
    pricing: { prompt: 0.00000015, completion: 0.0000006 },
    score: { truthness: 92, efficiency: 96, balanced: 95 },
    recommended_tier: "TIER_2_BALANCED",
    badges: ["Default Balanced", "Sub-Second Latency", "1M Context", "High Value"]
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Meta: Llama 3.3 70B Instruct",
    description: "Industry-standard open-weights flagship delivering Claude 3.5 Sonnet class performance.",
    context_length: 131072,
    pricing: { prompt: 0.00000012, completion: 0.0000003 },
    score: { truthness: 91, efficiency: 94, balanced: 93 },
    recommended_tier: "TIER_2_BALANCED",
    badges: ["Open Weights", "Cost Champion", "High Efficiency"]
  },
  {
    id: "google/gemini-2.5-flash-lite",
    name: "Google: Gemini 2.5 Flash Lite",
    description: "Ultra-low latency micro-model engineered for instantaneous classification, triage, and tagging.",
    context_length: 1048576,
    pricing: { prompt: 0.000000075, completion: 0.0000003 },
    score: { truthness: 86, efficiency: 99, balanced: 92 },
    recommended_tier: "TIER_3_FAST",
    badges: ["Micro-Latency", "<50ms Hot-Path", "Maximum Efficiency"]
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    name: "Meta: Llama 3.1 8B Instruct",
    description: "Ultra-lightweight edge model for high-frequency low-complexity operations.",
    context_length: 131072,
    pricing: { prompt: 0.00000005, completion: 0.00000005 },
    score: { truthness: 82, efficiency: 99, balanced: 89 },
    recommended_tier: "TIER_3_FAST",
    badges: ["Edge Fast", "Near-Zero Cost"]
  }
];

let inMemoryCatalogCache: {
  timestamp: number;
  catalog: ModelRadarCatalog;
} | null = null;

const CATALOG_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Evaluates raw model attributes from OpenRouter and generates multi-dimensional scores.
 */
export function scoreModelProfile(raw: {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing?: { prompt?: string | number; completion?: string | number };
  created?: number;
}): DiscoveredModel {
  const id = raw.id;
  const name = raw.name || id;
  const description = raw.description || "OpenRouter routed model";
  const contextLength = Number(raw.context_length) || 128000;
  const promptPrice = Number(raw.pricing?.prompt) || 0.000001;
  const completionPrice = Number(raw.pricing?.completion) || 0.000002;

  const idLower = id.toLowerCase();
  const descLower = description.toLowerCase();

  // 1. Truthness / Accuracy Score (0 - 100)
  let truthness = 80;
  if (idLower.includes("pro") || idLower.includes("opus") || idLower.includes("sonnet") || idLower.includes("r1") || idLower.includes("o1") || idLower.includes("o3")) {
    truthness += 16;
  }
  if (idLower.includes("reasoning") || descLower.includes("reasoning") || descLower.includes("thought")) {
    truthness += 3;
  }
  if (contextLength >= 500000) truthness += 1;
  truthness = Math.min(99, Math.max(50, truthness));

  // 2. Efficiency / Latency / Cost Score (0 - 100)
  let efficiency = 80;
  if (promptPrice <= 0.0000002) efficiency += 15;
  else if (promptPrice <= 0.0000008) efficiency += 8;
  else if (promptPrice > 0.000005) efficiency -= 15;

  if (idLower.includes("flash-lite") || idLower.includes("8b") || idLower.includes("mini") || idLower.includes("haiku")) {
    efficiency += 4;
  }
  efficiency = Math.min(99, Math.max(40, efficiency));

  // 3. Balanced Score (Harmonic / Weighted Mean favoring usability)
  const balanced = Math.round(truthness * 0.55 + efficiency * 0.45);

  // Recommended Tier
  let recommendedTier: "TIER_1_TRUTHNESS" | "TIER_2_BALANCED" | "TIER_3_FAST" = "TIER_2_BALANCED";
  if (truthness >= 95 || idLower.includes("pro") || idLower.includes("sonnet") || idLower.includes("r1")) {
    recommendedTier = "TIER_1_TRUTHNESS";
  } else if (efficiency >= 95 || idLower.includes("lite") || idLower.includes("8b")) {
    recommendedTier = "TIER_3_FAST";
  }

  // Badges
  const badges: string[] = [];
  if (truthness >= 95) badges.push("Frontier Depth");
  if (efficiency >= 95) badges.push("Sub-50ms Edge");
  if (contextLength >= 1000000) badges.push("1M+ Context");
  if (promptPrice <= 0.0000002) badges.push("Ultra Low Cost");

  const createdEpoch = raw.created ? raw.created * 1000 : 0;
  const isNew = createdEpoch > 0 && Date.now() - createdEpoch < 90 * 24 * 60 * 60 * 1000;
  if (isNew) badges.push("Newly Released");

  return {
    id,
    name,
    description,
    context_length: contextLength,
    pricing: {
      prompt: promptPrice,
      completion: completionPrice
    },
    created: raw.created,
    is_new: isNew,
    score: {
      truthness,
      efficiency,
      balanced
    },
    recommended_tier: recommendedTier,
    badges
  };
}

/**
 * Actively discovers OpenRouter models via live API with zero external lock-in and resilient caching.
 */
export async function getOpenRouterModelRadar(forceRefresh = false): Promise<ModelRadarCatalog> {
  const now = Date.now();
  if (!forceRefresh && inMemoryCatalogCache && now - inMemoryCatalogCache.timestamp < CATALOG_CACHE_TTL_MS) {
    return inMemoryCatalogCache.catalog;
  }

  let models: DiscoveredModel[] = [];
  let source: "live_api" | "cached_snapshot" = "cached_snapshot";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "HTTP-Referer": "https://churchcore.io",
        "X-Title": "ChurchCore Sovereign Control Plane"
      },
      signal: AbortSignal.timeout(4500)
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data)) {
        // Filter out deprecated or irrelevant models; keep notable modern providers
        const relevant = data.data.filter((m: { id?: string }) => {
          const id = (m.id || "").toLowerCase();
          return (
            id.startsWith("google/") ||
            id.startsWith("anthropic/") ||
            id.startsWith("meta-llama/") ||
            id.startsWith("deepseek/") ||
            id.startsWith("openai/") ||
            id.startsWith("mistralai/") ||
            id.startsWith("qwen/")
          );
        });

        models = relevant.map((m: any) => scoreModelProfile(m));
        source = "live_api";
      }
    }
  } catch {
    // Graceful fallback to static verified catalog
  }

  if (models.length === 0) {
    models = STATIC_FALLBACK_CATALOG;
  }

  // Sort by balanced score descending
  models.sort((a, b) => b.score.balanced - a.score.balanced);

  const tier1 = models.filter(m => m.recommended_tier === "TIER_1_TRUTHNESS").slice(0, 8);
  const tier2 = models.filter(m => m.recommended_tier === "TIER_2_BALANCED").slice(0, 8);
  const tier3 = models.filter(m => m.recommended_tier === "TIER_3_FAST").slice(0, 8);
  const newlyDiscovered = models.filter(m => m.is_new).slice(0, 6);

  const activePro = process.env.OPENROUTER_MODEL || "google/gemini-2.5-pro";
  const activeFlash = process.env.OPENROUTER_FLASH_MODEL || "google/gemini-2.5-flash";
  const activeFast = process.env.OPENROUTER_FAST_MODEL || "google/gemini-2.5-flash-lite";

  const catalog: ModelRadarCatalog = {
    last_updated: new Date().toISOString(),
    source,
    total_models_evaluated: models.length,
    active_tiers: {
      tier_1_truthness: activePro,
      tier_2_balanced: activeFlash,
      tier_3_fast: activeFast
    },
    recommended_models: {
      tier_1: tier1,
      tier_2: tier2,
      tier_3: tier3
    },
    newly_discovered: newlyDiscovered
  };

  inMemoryCatalogCache = {
    timestamp: now,
    catalog
  };

  return catalog;
}
