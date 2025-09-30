import './globals.css'
import type { Metadata } from 'next'
import ThemeToggle from '@/components/ThemeToggle'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'shelf picker',
  description: 'Pick a random book from your Goodreads to-read shelf.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          defer
          data-domain={
            process.env.PLAUSIBLE_DOMAIN || 'shelf-picker.vercel.app'
          }
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>
        <div className="min-h-screen flex flex-col px-8 bg-gray-950">
          <header className="mb-4 pt-5 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-violet-200">
              shelf picker
            </h1>
            {/* <ThemeToggle /> */}
          </header>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
