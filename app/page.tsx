'use client'
import { useState } from 'react'
import AdvancedOptions from '@/components/AdvancedOptions'
import ResultCard from '@/components/ResultCard'
import UserIdForm from '@/components/UserIdForm'

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
        <UserIdForm
          loading={loading}
          onSubmit={(uid) => {
            setUserId(uid)
            return submit(uid)
          }}
        />
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
