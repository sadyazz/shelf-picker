## Shelf Picker

i'm terrible at deciding what to read next, so i made this to randomly pick from my goodreads to-read shelf.

### Features
- randomly selects a book from your Goodreads to-read shelf using your exported CSV data
- displays title, author, and average rating
- works entirely in your browser - no data storage or tracking

### How it works
1) Export your Goodreads library as CSV (My Books → Import/Export → Export Library)
2) Upload the CSV file to Shelf Picker
3) Click to get a random book from your to-read shelf

### Prerequisites
- Node.js 18+ (Next.js 14)
- Your Goodreads library export (CSV file)

### Quick start
```bash
npm install
npm run dev
```
open http://localhost:3000 and upload your Goodreads CSV export.

### Tech stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PapaParse for CSV parsing

### Privacy
- works completely client-side
- no data storage or tracking
- your CSV data never leaves your browser
- no login required