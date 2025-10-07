'use client'

import React, { useState } from 'react'
import Papa from 'papaparse'

type Props = {
  onSubmit: (data: any) => void
  loading?: boolean
}

type Book = {
  'Book Id': string
  Title: string
  Author: string
  'Author l-f': string
  'Additional Authors': string
  ISBN: string
  ISBN13: string
  'My Rating': string
  'Average Rating': string
  Publisher: string
  Binding: string
  'Number of Pages': string
  'Year Published': string
  'Original Publication Year': string
  'Date Read': string
  'Date Added': string
  Bookshelves: string
  'Bookshelves with positions': string
  'Exclusive Shelf': string
  'My Review': string
  Spoiler: string
  'Private Notes': string
  'Read Count': string
  'Owned Copies': string
}

export default function CsvImportForm({ onSubmit, loading = false }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedBooks, setParsedBooks] = useState<Book[] | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
      setParsedBooks(null)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) return

    if (!parsedBooks) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const books = results.data as Book[]
            setParsedBooks(books)
            pickRandomBook(books)
          },
          error: (error: any) => {
            console.error('CSV parsing error:', error)
          }
        })
      }
      reader.readAsText(file)
    } else {
      pickRandomBook(parsedBooks)
    }
  }

  const pickRandomBook = (books: Book[]) => {
    const toReadBooks = books.filter(book => book['Exclusive Shelf'] === 'to-read')
    
    if (toReadBooks.length === 0) {
      onSubmit({ error: 'No books found in your "to-read" shelf' })
      return
    }
    
    const randomBook = toReadBooks[Math.floor(Math.random() * toReadBooks.length)]
    
    onSubmit({
      ok: true,
      result: {
        title: randomBook.Title,
        author: randomBook.Author,
        url: `https://www.goodreads.com/book/show/${randomBook['Book Id']}`,
        coverUrl: '',
        rating: randomBook['Average Rating']
      },
      poolSize: toReadBooks.length
    })
  }

  return (
    <form
      className="rounded-xl bg-gray-950/60 mt-8 md:mt-0 p-4 backdrop-blur w-full md:max-w-3xl mx-auto"
      onSubmit={handleSubmit}
    >
      <label htmlFor="csvFile" className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
        Upload Goodreads CSV Export
        <div className="relative group">
          <svg
            className="w-4 h-4 text-gray-400 cursor-help"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-800 text-gray-200 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 md:w-80">
            To export your data from Goodreads:
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Go to Goodreads website</li>
              <li>Click on &quot;My Books&quot;</li>
              <li>Click on &quot;Import and export&quot;</li>
              <li>Click &quot;Export library&quot; button</li>
              <li>Download the CSV file</li>
            </ol>
          </div>
        </div>
      </label>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="file"
          id="csvFile"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-[#d13966] file:text-white file:cursor-pointer
            hover:file:bg-[#b02c52]
          "
        />
        
        <button
          type="submit"
          disabled={!file || loading}
          className="mt-4 md:mt-0 rounded-full bg-[#d13966] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#b02c52] disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Loading…' : parsedBooks ? 'Pick Random' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
