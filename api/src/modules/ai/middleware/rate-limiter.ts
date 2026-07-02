/**
 * Simple in-memory rate limiter for AI chat endpoints.
 * Limits messages per user per hour. Configurable via env.
 */

const parsed = parseInt(process.env.AI_RATE_LIMIT_PER_HOUR || '60', 10)
const MAX_MESSAGES_PER_HOUR = Number.isFinite(parsed) && parsed > 0 ? parsed : 60

interface RateBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()

// Clean expired buckets every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) {
      buckets.delete(key)
    }
  }
}, 10 * 60 * 1000)

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now()
  const bucket = buckets.get(userId)

  if (!bucket || bucket.resetAt < now) {
    // New or expired bucket
    buckets.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return { allowed: true, remaining: MAX_MESSAGES_PER_HOUR - 1, resetInSeconds: 3600 }
  }

  if (bucket.count >= MAX_MESSAGES_PER_HOUR) {
    const resetInSeconds = Math.ceil((bucket.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, resetInSeconds }
  }

  bucket.count++
  const resetInSeconds = Math.ceil((bucket.resetAt - now) / 1000)
  return { allowed: true, remaining: MAX_MESSAGES_PER_HOUR - bucket.count, resetInSeconds }
}
