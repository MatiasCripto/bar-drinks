interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
  className?: string
}

const variants = {
  default: 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200 text-gray-800',
  success: 'bg-green-100 dark:bg-green-900/30 dark:text-green-300 text-green-800',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 text-yellow-800',
  danger: 'bg-red-100 dark:bg-red-900/30 dark:text-red-300 text-red-800',
  info: 'bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 text-blue-800',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
