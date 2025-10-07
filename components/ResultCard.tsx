type Props = {
  result: {
    title: string
    author: string
    url: string
    coverUrl: string
    rating: string | null
  }
}

export default function ResultCard({ result }: Props) {
  const displayAuthor = (() => {
    const raw = result.author.trim()
    if (raw.includes(',')) {
      const [last, first] = raw.split(',').map((s) => s.trim())
      if (first && last) return `${first} ${last}`
    }
    return raw
  })()
  return (
    <article className="flex flex-col pt-10 items-center gap-3 p-3 text-center transition-transform duration-150">
      <img
        src={`/api/image-proxy?u=${encodeURIComponent(result.coverUrl)}`}
        alt={`Cover of ${result.title}`}
        className="h-80 w-56 sm:h-96 sm:w-64 md:h-[26rem] md:w-72 lg:h-[24rem] lg:w-72 xl:h-[26rem] xl:w-80 rounded-lg object-cover shadow-sm transition will-change-transform hover:-translate-y-0.5 hover:shadow-violet-500/20"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement
          if (target.dataset.fallback === '1') return
          target.dataset.fallback = '1'
          target.src =
            '/api/image-proxy?u=' +
            encodeURIComponent(
              'https://www.goodreads.com/assets/nophoto/book/111x148-b6ee3b0d7d0a389a1bd9.png'
            )
        }}
      />
      <div className="min-w-0 max-w-full">
        <a
          href={result.url.startsWith('http') ? result.url : `https://www.goodreads.com${result.url}`}
          target="_blank"
          rel="noreferrer"
          className="line-clamp-2 break-words text-2xl sm:text-3xl lg:text-2xl font-semibold tracking-tight text-violet-200/90 hover:text-violet-100 leading-tight hover:underline"
        >
          {result.title}
        </a>
        <p className="mt-1 text-lg sm:text-xl lg:text-lg text-gray-400/90">
          {displayAuthor}
        </p>
        {result.rating && (
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            {result.rating}
          </p>
        )}
      </div>
    </article>
  )
}
