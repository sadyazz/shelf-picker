import { NextResponse } from 'next/server'
import { fetchGoodreadsToReadShelf, pickRandom } from '@/lib/goodreads'
import { getCachedJSON, setCachedJSON } from '@/lib/cache'
import { limitByIp } from '@/lib/rate-limit'
import { z } from 'zod'

export const runtime = 'nodejs'

const bodySchema = z.object({ userId: z.string().regex(/^\d+$/) })

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rl = await limitByIp(ip)
  if (!rl.success) {
    return NextResponse.json(
      { ok: false, message: 'Rate limit exceeded. Try again soon.' },
      { status: 429 }
    )
  }

  const json = await req.json().catch(() => ({}))
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: 'Invalid userId' },
      { status: 400 }
    )
  }
  const { userId } = parsed.data

  const cacheKey = `gr:to-read:${userId}`
  const cached = await getCachedJSON<{ books: any[]; pagesScraped: number }>(
    cacheKey
  )
  let books: any[] = []
  let pagesScraped = 0

  const debugUrls: string[] = []
  try {
    if (cached) {
      books = cached.books
      pagesScraped = cached.pagesScraped
    } else {
      const start = Date.now()
      const data = await fetchGoodreadsToReadShelf(userId, {
        onPage: (u) => debugUrls.push(u)
      })
      books = data.books
      pagesScraped = data.pagesScraped
      const ttl = 60 * 10
      await setCachedJSON(cacheKey, data, ttl)
      console.log(
        `scraped user ${userId} pages=${pagesScraped} books=${books.length} in ${Date.now() - start}ms`
      )
    }
  } catch (e: any) {
    const msg = String(e?.message || e)
    if (msg.toLowerCase().includes('private') || msg.includes('403')) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Shelf is private or inaccessible.',
          debugUrls:
            process.env.NODE_ENV !== 'production' ? debugUrls : undefined
        },
        { status: 403 }
      )
    }
    return NextResponse.json(
      {
        ok: false,
        message: 'Failed to fetch shelf.',
        debugUrls: process.env.NODE_ENV !== 'production' ? debugUrls : undefined
      },
      { status: 500 }
    )
  }

  const pick = pickRandom(books)
  if (!pick) {
    return NextResponse.json(
      {
        ok: false,
        message: 'No books found on to-read shelf.',
        debugUrls: process.env.NODE_ENV !== 'production' ? debugUrls : undefined
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    ok: true,
    result: pick,
    poolSize: books.length,
    debugUrls: process.env.NODE_ENV !== 'production' ? debugUrls : undefined
  })
}
