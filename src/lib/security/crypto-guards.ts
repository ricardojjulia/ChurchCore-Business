import crypto from "node:crypto";

/**
 * Constant-time Vercel Cron authorization validator.
 * Prevents timing side-channel attacks against CRON_SECRET.
 */
export function isAuthorizedCron(
  authHeader: string | null,
  cronSecret: string | undefined = process.env.CRON_SECRET
): boolean {
  if (!authHeader || !cronSecret) return false;
  const expected = `Bearer ${cronSecret}`;
  const authBuf = Buffer.from(authHeader, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (authBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(authBuf, expectedBuf);
}

/**
 * Cryptographic GitHub Webhook HMAC-SHA256 validator (X-Hub-Signature-256).
 */
export function verifyGitHubWebhookSignature(
  payload: string,
  signatureHeader: string | null,
  webhookSecret: string | undefined = process.env.GITHUB_WEBHOOK_SECRET
): boolean {
  if (!signatureHeader || !webhookSecret) return false;
  if (!signatureHeader.startsWith("sha256=")) return false;

  const expectedHex = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload, "utf8")
    .digest("hex");
  const expected = `sha256=${expectedHex}`;

  const sigBuf = Buffer.from(signatureHeader, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

const THREAT_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  {
    name: "SQL_INJECTION",
    regex: /(\b(UNION\s+ALL\s+SELECT|UNION\s+SELECT|DROP\s+TABLE|ALTER\s+TABLE|INSERT\s+INTO\s+\w+\s+VALUES)\b|--\s*$|;\s*DROP\s+)/i,
  },
  {
    name: "XSS_VECTOR",
    regex: /(<\s*script\b[^>]*>|javascript\s*:|onerror\s*=|onload\s*=|<\s*iframe\b)/i,
  },
  {
    name: "PATH_TRAVERSAL",
    regex: /(\.\.\/|\.\.\\|%2e%2e%2f|\/etc\/passwd)/i,
  },
];

/**
 * Embedded payload signature analyzer (in-process WASM/signature shield equivalent).
 * Inspects arbitrary input values recursively for SQLi, XSS, and path traversal vectors.
 */
export function inspectPayloadForThreats(input: unknown): {
  isThreat: boolean;
  reason?: string;
} {
  const strings: string[] = [];

  function collectStrings(val: unknown) {
    if (typeof val === "string") {
      strings.push(val);
    } else if (Array.isArray(val)) {
      for (const item of val) collectStrings(item);
    } else if (val && typeof val === "object") {
      for (const [k, v] of Object.entries(val)) {
        strings.push(k);
        collectStrings(v);
      }
    }
  }

  collectStrings(input);

  for (const s of strings) {
    for (const pattern of THREAT_PATTERNS) {
      if (pattern.regex.test(s)) {
        return { isThreat: true, reason: pattern.name };
      }
    }
  }

  return { isThreat: false };
}

interface BucketState {
  tokens: number;
  lastRefillMs: number;
}

const buckets = new Map<string, BucketState>();

export interface TokenBucketConfig {
  refillRate: number; // tokens per interval
  intervalMs: number;
  capacity: number;
}

/**
 * In-memory token bucket rate limiter for AI wallet protection & brute-force defense.
 */
export function consumeTokenBucket(
  key: string,
  cost = 1,
  config: TokenBucketConfig = {
    refillRate: 10,
    intervalMs: 60_000,
    capacity: 20,
  },
  nowMs: number = Date.now()
): { allowed: boolean; remaining: number } {
  const existing = buckets.get(key) ?? {
    tokens: config.capacity,
    lastRefillMs: nowMs,
  };

  const elapsed = Math.max(0, nowMs - existing.lastRefillMs);
  const replenished = (elapsed / config.intervalMs) * config.refillRate;
  const currentTokens = Math.min(config.capacity, existing.tokens + replenished);

  if (currentTokens < cost) {
    buckets.set(key, { tokens: currentTokens, lastRefillMs: nowMs });
    return { allowed: false, remaining: Math.floor(currentTokens) };
  }

  const nextTokens = currentTokens - cost;
  buckets.set(key, { tokens: nextTokens, lastRefillMs: nowMs });
  return { allowed: true, remaining: Math.floor(nextTokens) };
}

export function resetTokenBucketsForTests(): void {
  buckets.clear();
}

