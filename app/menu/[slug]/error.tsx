'use client'

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Error al cargar la carta
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          No pudimos cargar la carta. Verificá el código QR o intentá de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
