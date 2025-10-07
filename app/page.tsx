'use client'
import { useState } from 'react'
import AdvancedOptions from '@/components/AdvancedOptions'
import ResultCard from '@/components/ResultCard'
import UserIdForm from '@/components/UserIdForm'
import CsvImportForm from '@/components/CsvImportForm'

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

type PickResponse = {
  ok: boolean
  message?: string
  result?: {
    title: string
    author: string
    url: string
    coverUrl: string
    rating: string | null
  }
  poolSize?: number
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('userId')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PickResponse | null>(null)

  async function submit(uid?: string) {
    setError(null)
    setLoading(true)
    setData(null)
    try {
      const targetId = uid ?? userId
      console.log('POST /api/goodreads/pick', { userId: targetId })
      const start = Date.now()
      const res = await fetch('/api/goodreads/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetId })
      })
      const json: PickResponse = await res.json()
      // debug
      // @ts-expect-error dev-only
      if (json.debugUrls) console.log('Scraped URLs:', json.debugUrls)
      if (!json.ok) {
        setError(json.message || 'Something went wrong')
      }
      const elapsed = Date.now() - start
      const remaining = 2000 - elapsed
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining))
      setData(json)
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex justify-center mb-4">
          {/* <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'userId' ? 'border-b-2 border-[#d13966] text-[#d13966]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('userId')}
          >
            Enter User ID
          </button> */}
          <button
            className={`ml-4 px-4 py-2 text-sm font-medium ${activeTab === 'csvImport' ? 'border-b-2 border-[#d13966] text-[#d13966]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('csvImport')}
          >
            Import CSV
          </button>
        </div>

        {/*activeTab === 'userId' && (
          <UserIdForm
            loading={loading}
            onSubmit={(uid) => {
              setUserId(uid)
              return submit(uid)
            }}
          />
        )*/}

        {activeTab === 'csvImport' && (
          <CsvImportForm
            loading={loading}
            onSubmit={(data) => {
              if (data.error) {
                setError(data.error)
                return
              }
              setData(data)
            }}
          />
        )}

        {/* <div className="mt-3">
          <AdvancedOptions />
        </div> */}

        {error && (
          <div className="rounded border border-red-800 bg-red-950 p-2 text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center pt-32">
            <div className="simple-spinner"></div>
          </div>
        )}

        {!loading && data?.ok && data.result && (
          <div className="space-y-1.5 mt-14">
            <ResultCard result={data.result} />
            {/* <div className="flex items-center justify-end text-sm text-gray-400">
              <button
                onClick={() => submit()}
                className="rounded-full border border-violet-500/30 px-3 py-1 text-violet-200 hover:bg-violet-500/10"
              >
                Reroll
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  )
}
