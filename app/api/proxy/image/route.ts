import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const ALLOWED_HOSTS = new Set([
  'images.gr-assets.com',
  'i.gr-assets.com',
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

  const res = await fetch(target.toString(), {
    headers: {
      'User-Agent':
        'ShelfPickerBot/1.0 (+https://github.com/odeofcode/shelf-picker) contact: n/a',
      Accept: 'image/*,*/*;q=0.8'
    }
  })
  if (!res.ok)
    return NextResponse.json(
      { ok: false, message: 'Upstream error' },
      { status: res.status }
    )

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
