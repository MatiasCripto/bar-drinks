import { useState, useEffect } from 'react'

interface NotificationBellProps {
  hasNewOrder: boolean
}

export function NotificationBell({ hasNewOrder }: NotificationBellProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (hasNewOrder) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [hasNewOrder])

  return (
    <div className="relative">
      <svg
        className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${animate ? 'animate-bounce' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
      {hasNewOrder && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
      )}
    </div>
  )
}
