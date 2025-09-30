type Props = { variant?: 'flip' | 'spread' | 'spread3d' }

export default function BookLoader({ variant = 'spread' }: Props) {
  if (variant === 'flip') {
    return (
      <div className="book-loader" aria-label="Loading">
        <div className="book">
          <div className="page p1" />
          <div className="page p2" />
          <div className="page p3" />
        </div>
      </div>
    )
  }
  if (variant === 'spread3d') {
    return (
      <div className="book-loader" aria-label="Loading">
        <div className="book-3d">
          <div className="spine" />
          <div className="leaf l1" />
          <div className="leaf l2" />
          <div className="leaf l3" />
          <div className="leaf l4" />
          <div className="leaf l5" />
        </div>
      </div>
    )
  }
  return (
    <div className="book-loader" aria-label="Loading">
      <svg
        className="book-spread-svg"
        width="220"
        height="120"
        viewBox="0 0 220 120"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform="translate(20,60)">
          <rect
            x="0"
            y="-8"
            rx="16"
            ry="16"
            width="120"
            height="16"
            fill="#a855f7"
            filter="url(#glow)"
          />
          <circle cx="0" cy="0" r="8" fill="#c4b5fd" opacity="0.9" />
          <g className="ray" style={{ transformOrigin: '0px 0px' }}>
            <line
              x1="0"
              y1="0"
              x2="180"
              y2="-40"
              stroke="#c4b5fd"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
          <g className="ray r2" style={{ transformOrigin: '0px 0px' }}>
            <line
              x1="0"
              y1="0"
              x2="180"
              y2="-20"
              stroke="#c4b5fd"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
          <g className="ray r3" style={{ transformOrigin: '0px 0px' }}>
            <line
              x1="0"
              y1="0"
              x2="180"
              y2="0"
              stroke="#c4b5fd"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </g>
          <g className="ray r4" style={{ transformOrigin: '0px 0px' }}>
            <line
              x1="0"
              y1="0"
              x2="180"
              y2="20"
              stroke="#c4b5fd"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
          <g className="ray r5" style={{ transformOrigin: '0px 0px' }}>
            <line
              x1="0"
              y1="0"
              x2="180"
              y2="40"
              stroke="#c4b5fd"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}
