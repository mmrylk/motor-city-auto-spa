type Bucket = { count: number; resetAt: number };

const globalForLimiter = globalThis as unknown as {
  __mcasRateBuckets?: Map<string, Bucket>;
};

const buckets = globalForLimiter.__mcasRateBuckets ?? new Map<string, Bucket>();
if (process.env.NODE_ENV !== "production") {
  globalForLimiter.__mcasRateBuckets = buckets;
}

/**
 * Lightweight in-process limiter for public write endpoints.
 * For multi-region deployments, back this with Upstash Redis (see lib/redis.ts).
 */
export function rateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "local";
}
