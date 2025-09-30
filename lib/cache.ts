import { Redis } from '@upstash/redis'

type MemoryEntry<T> = { value: T; expiresAt: number }

const memoryCache = new Map<string, MemoryEntry<unknown>>()

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null

export async function getCachedJSON<T>(key: string): Promise<T | null> {
  const now = Date.now()
  const mem = memoryCache.get(key) as MemoryEntry<T> | undefined
  if (mem && mem.expiresAt > now) return mem.value
  if (redis) {
    const val = await redis.get<T>(key)
    if (val) return val
  }
  return null
}

export async function setCachedJSON<T>(key: string, value: T, ttlSeconds: number) {
  const expiresAt = Date.now() + ttlSeconds * 1000
  memoryCache.set(key, { value, expiresAt })
  if (redis) {
    await redis.set(key, value, { ex: ttlSeconds })
  }
}
