/**
 * Giới hạn tần suất theo khóa (IP + hành động).
 * - Có UPSTASH_REDIS_REST_URL/TOKEN: dùng Redis (đếm chung cho mọi instance serverless) — nên bật trên production.
 * - Không có: đếm trong bộ nhớ của từng instance (đủ cho dev, chỉ chặn được một phần trên serverless).
 */
import { headers } from "next/headers";

const memory = new Map<string, { count: number; reset: number }>();

async function hitRedis(key: string, windowSec: number): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSec), "NX"],
      ]),
      cache: "no-store",
    });
    const data = (await res.json()) as { result: number }[];
    return Number(data[0]?.result ?? 0);
  } catch {
    return null;
  }
}

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

/** Trả về true nếu còn được phép; false nếu đã vượt `limit` lần trong `windowSec` giây */
export async function rateLimit(action: string, limit: number, windowSec: number, extraKey = "") {
  const key = `rl:${action}:${await clientIp()}:${extraKey}`;
  const redisCount = await hitRedis(key, windowSec);
  if (redisCount !== null) return redisCount <= limit;

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.reset < now) {
    memory.set(key, { count: 1, reset: now + windowSec * 1000 });
    if (memory.size > 10_000) for (const [k, v] of memory) if (v.reset < now) memory.delete(k);
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export const TOO_MANY = "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.";
