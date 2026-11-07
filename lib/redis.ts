const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisEnabled = Boolean(url && token);

async function command<T>(...args: (string | number)[]): Promise<T | null> {
  if (!url || !token) return null;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args),
      cache: "no-store"
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: T };
    return payload.result ?? null;
  } catch {
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const value = await command<string>("GET", key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 30) {
  await command("SET", key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function cacheDel(key: string) {
  await command("DEL", key);
}
