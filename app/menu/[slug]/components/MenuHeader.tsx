interface MenuHeaderProps {
  barName: string
  logoUrl: string | null
  tableIdentifier: string
  onTableChange: (value: string) => void
}

export default function MenuHeader({
  barName,
  logoUrl,
  tableIdentifier,
  onTableChange,
}: MenuHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={barName}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{barName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hacé tu pedido desde la mesa</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Tu número de mesa o nombre"
            value={tableIdentifier}
            onChange={(e) => onTableChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>
    </header>
  )
}
