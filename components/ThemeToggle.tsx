'use client'

export default function ThemeToggle() {
  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded border border-gray-700 px-3 py-1 text-sm hover:bg-gray-800"
      onClick={() => {
        if (typeof document === 'undefined') return
        const html = document.documentElement
        html.classList.toggle('dark')
      }}
    >
      Dark Mode
    </button>
  )
}
