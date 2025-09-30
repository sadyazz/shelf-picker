// components/BookLoader.tsx
import React from 'react'
import './BookLoader.css'

interface BookLoaderProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const BookLoader: React.FC<BookLoaderProps> = ({
  size = 'medium',
  className = ''
}) => {
  return (
    <div
      className={`book-loader-custom ${size} ${className}`}
      style={{ display: 'grid', placeItems: 'center' }}
    >
      <div className="pages-container">
        {[...Array(12)].map((_, index) => (
          <div key={index} className={`page page-${index + 1}`}></div>
        ))}
      </div>
    </div>
  )
}

export default BookLoader
