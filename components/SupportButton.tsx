"use client"

import { useState, useEffect } from 'react'

export default function SupportButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsVisible(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <a
      href="https://ko-fi.com/Y8Y21ME8J6"
      target="_blank"
      rel="noreferrer"
      className="inline-block rounded-lg bg-transparent border border-[#d13966] px-3 py-1.5 text-xs font-medium text-[#d13966] shadow-lg transition-all hover:bg-[#b02c52] hover:text-white hover:shadow-xl"
    >
      Support this project
    </a>
  )
}
