'use client'

import { useState } from 'react'

type Props = {
  onSubmit: (userId: string) => Promise<void> | void
  loading?: boolean
}

export default function UserIdForm({ onSubmit, loading = false }: Props) {
  const [userId, setUserId] = useState('')

  return (
    <form
      className="rounded-xl bg-gray-950/60 mt-8 md:mt-0 p-0 md:p-4 backdrop-blur w-full md:max-w-3xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault()
        if (!userId) return
        onSubmit(userId)
      }}
    >
      <label htmlFor="userId" className="block text-sm text-gray-300">
        Goodreads numeric user ID
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="userId"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userId}
          onChange={(e) => setUserId(e.target.value.replace(/[^0-9]/g, ''))}
          className="flex-1 rounded-full bg-gray-900/80 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-400/60"
          placeholder="e.g. 1234567"
        />
        <button
          type="submit"
          disabled={!userId || loading}
          className="rounded-full bg-[#d13966] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#b02c52] disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Submit'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Paste the digits from your Goodreads profile share link.
      </p>
    </form>
  )
}
