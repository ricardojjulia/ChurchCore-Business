import crypto from "node:crypto";

export interface CacheEntry {
  hash: string;
  taskType: string;
  model: string;
  content: string;
  promptTokensEstimate: number;
  completionTokensEstimate: number;
  createdAt: number;
  expiresAt: number;
}

export interface CacheTelemetryMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRatioPercentage: number;
  tokensSavedEstimate: number;
  estimatedCostSavingsUsd: number;
  activeEntriesCount: number;
}

const DEFAULT_TTL_BY_TASK: Record<string, number> = {
  council_deliberation: 15 * 60 * 1000, // 15 mins
  safeguarding_audit: 30 * 60 * 1000, // 30 mins
  marketing_narrative: 60 * 60 * 1000, // 1 hour
  i18n_translation: 24 * 60 * 60 * 1000, // 24 hours
  tag_classification: 24 * 60 * 60 * 1000, // 24 hours
  feedback_triage: 2 * 60 * 60 * 1000, // 2 hours
};

class OpenRouterSemanticCache {
  private cache = new Map<string, CacheEntry>();
  private readonly maxEntries = 500;
  private totalHits = 0;
  private totalMisses = 0;
  private tokensSaved = 0;

  public computeHash(taskType: string, model: string, systemPrompt: string, userPrompt: string): string {
    const raw = `${taskType}::${model}::${systemPrompt.trim()}::${userPrompt.trim()}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  public get(taskType: string, model: string, systemPrompt: string, userPrompt: string): CacheEntry | null {
    const hash = this.computeHash(taskType, model, systemPrompt, userPrompt);
    const entry = this.cache.get(hash);

    if (!entry) {
      this.totalMisses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(hash);
      this.totalMisses++;
      return null;
    }

    this.totalHits++;
    this.tokensSaved += entry.promptTokensEstimate + entry.completionTokensEstimate;
    return entry;
  }

  public set(
    taskType: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    content: string,
    promptTokens: number,
    completionTokens: number,
    customTtlMs?: number
  ): void {
    if (this.cache.size >= this.maxEntries) {
      // Evict expired first, or oldest 20%
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiresAt) {
          this.cache.delete(key);
        }
      }
      if (this.cache.size >= this.maxEntries) {
        const keysToDelete = Array.from(this.cache.keys()).slice(0, 50);
        keysToDelete.forEach((k) => this.cache.delete(k));
      }
    }

    const hash = this.computeHash(taskType, model, systemPrompt, userPrompt);
    const ttl = customTtlMs || DEFAULT_TTL_BY_TASK[taskType] || 20 * 60 * 1000;
    const createdAt = Date.now();

    this.cache.set(hash, {
      hash,
      taskType,
      model,
      content,
      promptTokensEstimate: promptTokens,
      completionTokensEstimate: completionTokens,
      createdAt,
      expiresAt: createdAt + ttl,
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public getMetrics(): CacheTelemetryMetrics {
    const total = this.totalHits + this.totalMisses;
    const hitRatio = total > 0 ? Number(((this.totalHits / total) * 100).toFixed(1)) : 0;
    const savingsUsd = Number((this.tokensSaved * 0.0000015).toFixed(6));

    return {
      totalRequests: total,
      cacheHits: this.totalHits,
      cacheMisses: this.totalMisses,
      hitRatioPercentage: hitRatio,
      tokensSavedEstimate: this.tokensSaved,
      estimatedCostSavingsUsd: savingsUsd,
      activeEntriesCount: this.cache.size,
    };
  }
}

export const semanticCache = new OpenRouterSemanticCache();
