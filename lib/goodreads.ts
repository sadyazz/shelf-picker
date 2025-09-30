import * as cheerio from 'cheerio'

type Book = {
  title: string
  author: string
  url: string
  coverUrl: string
  rating: string | null
}

const BASE = 'https://www.goodreads.com'

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

function upgradeCoverUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl)
    // try to replace size token like ._SY75_. or ._SX50_. with taller one
    const replaced = url.pathname.replace(/\._S[XY]\d+_\./, '._SY200_.')
    if (replaced !== url.pathname) {
      url.pathname = replaced
      return url.toString()
    }
    return originalUrl
  } catch {
    return originalUrl
  }
}

export async function fetchShelfPage(url: string) {
  console.log('[goodreads] fetching', url)
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'ShelfPickerBot/1.0 (+https://github.com/odeofcode/shelf-picker) contact: n/a',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Fetch failed ${res.status}: ${text.slice(0, 200)}`)
  }
  const html = await res.text()
  const finalUrl = res.url || url
  return { html, finalUrl }
}

export async function fetchGoodreadsToReadShelf(
  userId: string,
  opts?: { onPage?: (url: string) => void }
): Promise<{ books: Book[]; pagesScraped: number }> {
  const books: Book[] = []
  const seen = new Set<string>()
  let page = 1
  let pagesScraped = 0
  let basePathWithSlug: string | null = null
  for (; page <= 200; page++) {
    const path = basePathWithSlug ?? `/review/list/${userId}`
    const pageUrl = `${BASE}${path}?shelf=to-read&page=${page}`
    if (opts?.onPage) opts.onPage(pageUrl)
    const { html, finalUrl } = await fetchShelfPage(pageUrl)
    if (page === 1) {
      // capture slugged path if redirected (e.g. /review/list/12345-username)
      try {
        const u = new URL(finalUrl)
        basePathWithSlug = u.pathname
      } catch {}
    }
    const $ = cheerio.load(html)

    const candidateRows = $(
      'table#books tr, table.tableList tr, table tr'
    ).toArray()
    const rows = candidateRows.filter(
      (el) => $(el).find('a[href^="/book/show/"]').length > 0
    )
    if (rows.length === 0) {
      const blocked =
        $('div.content .flash').text().toLowerCase().includes('not found') ||
        $('div#private').length > 0
      if (blocked) throw new Error('Private or inaccessible shelf')
      break
    }

    for (const row of rows) {
      const r = $(row)
      const a = r.find('a[href^="/book/show/"]').first()
      const url = (a.attr('href') || '').split('?')[0]
      // title can be in text, in nested span, or in the anchor's title attribute
      let titleRaw = (
        a.attr('title') ||
        a.find('span').attr('title') ||
        a.find('span').text() ||
        a.text() ||
        ''
      ).trim()
      // fallback: try to extract from URL slug if title is still empty
      if (!titleRaw && url) {
        const m = url.match(/\/book\/show\/\d+-(.+)/)
        if (m) {
          const slug = m[1].replace(/-/g, ' ')
          titleRaw = slug.charAt(0).toUpperCase() + slug.slice(1)
        }
      }
      const title = titleRaw
      const author = r.find('a[href^="/author/show/"]').first().text().trim()
      const img = r
        .find('img.bookCover, img.bookSmallImg, img[src*="gr-assets.com/"]')
        .first()
      let coverUrl = (img.attr('data-src') || img.attr('src') || '').trim()
      if (!coverUrl) {
        const anyImg = r.find('img').first()
        coverUrl = (anyImg.attr('data-src') || anyImg.attr('src') || '').trim()
      }
      if (coverUrl.startsWith('//')) coverUrl = `https:${coverUrl}`
      if (coverUrl.startsWith('/')) coverUrl = `${BASE}${coverUrl}`
      if (!coverUrl)
        coverUrl = `${BASE}/assets/nophoto/book/111x148-b6ee3b0d7d0a389a1bd9.png`
      coverUrl = upgradeCoverUrl(coverUrl)
      let ratingText = r.find('span.minirating').text().trim()
      if (!ratingText) {
        const rowText = r.text().replace(/\s+/g, ' ').toLowerCase()
        const m = rowText.match(/avg rating\s*([0-9](?:\.[0-9]{1,2})?)/i)
        if (m) ratingText = `avg rating ${m[1]}`
      }
      const rating = ratingText || null
      if (!url) continue
      if (seen.has(url)) continue
      seen.add(url)
      books.push({ title, author, url, coverUrl, rating })
    }

    pagesScraped++

    const hasNext = $('a.next_page').not('.disabled').length > 0
    if (!hasNext) break
    await delay(200)
  }
  return { books, pagesScraped }
}

export function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx] ?? null
}

export type { Book }
