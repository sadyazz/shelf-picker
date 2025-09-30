import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null

export const limiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m') })
  : null

export async function limitByIp(ip: string) {
  if (!limiter) return { success: true }
  return limiter.limit(`rl:${ip}`)
}
