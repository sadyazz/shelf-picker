export default function AdvancedOptions() {
  return (
    <details className="rounded border border-gray-800 bg-gray-950 p-3" aria-label="Advanced options">
      <summary className="cursor-pointer select-none text-sm text-gray-300">Advanced Options</summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" disabled className="h-4 w-4" />
          Genre filter (coming soon)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" disabled className="h-4 w-4" />
          Mood filter (coming soon)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" disabled className="h-4 w-4" />
          Length preference (coming soon)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" disabled className="h-4 w-4" />
          Rating bias (coming soon)
        </label>
      </div>
    </details>
  )
}
