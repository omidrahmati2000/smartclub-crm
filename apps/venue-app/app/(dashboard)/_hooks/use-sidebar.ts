'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sidebar-collapsed'

export function useSidebarCollapsed() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setIsCollapsed(stored === 'true')
    }
  }, [])

  // Save to localStorage when changed
  const toggle = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return { isCollapsed, toggle, setIsCollapsed }
}
