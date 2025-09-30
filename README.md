## Shelf Picker

i'm terrible at deciding what to read next, so i made this to randomly pick from my goodreads to-read shelf.

### Features
- fetches your public Goodreads to‑read shelf and selects one random book
- displays title, author, average rating, and cover (proxied for reliability)
- caches shelf results for faster subsequent picks (in‑memory + optional Redis)
- basic rate limiting by IP to protect the upstream (optional via Upstash)
- without Redis: uses in-memory cache only (resets on server restart)

### How it works
1) Client posts your numeric Goodreads user ID to `POST /api/goodreads/pick`
2) The server scrapes your public to‑read shelf pages using Cheerio
3) Results are cached for 10 minutes
4) One book is randomly selected and returned to the client
5) Covers are served via an image proxy route for better delivery

### Prerequisites
- Node.js 18+ (Next.js 14)
- your Goodreads user ID (digits only)

finding your Goodreads user ID:
1) open your Goodreads profile in a browser
2) use the “Share” link or copy the profile URL
3) extract the digits from the URL, e.g. `https://www.goodreads.com/user/show/1234567-username` → `1234567`

### Quick start
```bash
npm install
npm run dev
```
open http://localhost:3000, paste your user ID, and submit.

### Tech stack
- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS
- Cheerio for HTML parsing
- Upstash Redis for caching + rate limiting (optional)

### Limitations and privacy
- only public shelves can be scraped, private shelves will return 403
- goodreads markup can change; scraping logic may require updates
- covers are proxied to improve reliability and size selection

