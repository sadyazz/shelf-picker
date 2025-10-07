import './globals.css'
import type { Metadata } from 'next'
import ThemeToggle from '@/components/ThemeToggle'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'shelf picker',
  description: 'Randomly pick your next book to read from your Goodreads to-read shelf. Simple, free tool to help you decide what book to read next from your Goodreads library.',
  keywords: ['random book picker', 'goodreads random book', 'what to read next', 'goodreads to-read shelf', 'random book selector', 'book decision helper'],
  openGraph: {
    title: 'Shelf Picker - Random Book from Goodreads To-Read Shelf',
    description: 'Randomly pick your next book to read from your Goodreads to-read shelf. Simple, free tool to help you decide what book to read next.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://shelf-picker.vercel.app'
  }
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1618373425073041"
          crossOrigin="anonymous"
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
