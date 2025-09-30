import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const ALLOWED_HOSTS = new Set([
  'images.gr-assets.com',
  'i.gr-assets.com',
  's.gr-assets.com',
  'www.goodreads.com',
  'goodreads.com'
])

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const u = searchParams.get('u')
  if (!u)
    return NextResponse.json(
      { ok: false, message: 'Missing u' },
      { status: 400 }
    )
  let target: URL
  try {
    target = new URL(u)
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid URL' },
      { status: 400 }
    )
  }
  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json(
      { ok: false, message: 'Host not allowed' },
      { status: 400 }
    )
  }

  function buildCandidates(original: URL): string[] {
    const path = original.pathname
    const sizes = ['SY600', 'SY400', 'SY300', 'SY200']
    const list: string[] = []
    const hasToken = path.match(/\._S[XY]\d+_\./)
    if (hasToken) {
      for (const s of sizes) {
        const p = path.replace(/\._S[XY]\d+_\./, `._${s}_.`)
        list.push(new URL(p + original.search, original.origin).toString())
      }
    }
    list.push(original.toString())
    return Array.from(new Set(list))
  }

  const candidates = buildCandidates(target)
  let res: Response | null = null
  for (const candidate of candidates) {
    const r = await fetch(candidate, {
      headers: {
        'User-Agent':
          'ShelfPickerBot/1.0 (+https://github.com/odeofcode/shelf-picker) contact: n/a',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: 'https://www.goodreads.com/'
      }
    })
    if (r.ok) {
      res = r
      break
    }
  }
  if (!res) {
    const placeholderSvg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 168"><rect width="120" height="168" rx="10" fill="#111827"/><rect x="14" y="16" width="92" height="136" rx="8" fill="#1f2937"/><path d="M24 36h72v8H24zM24 56h52v8H24zM24 76h64v8H24z" fill="#9ca3af"/></svg>'
    )
    return new NextResponse(placeholderSvg, {
      status: 200,
      headers: {
        'content-type': 'image/svg+xml',
        'cache-control': 'public, max-age=60'
      }
    })
  }

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const buf = await res.arrayBuffer()
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=3600, immutable'
    }
  })
}
