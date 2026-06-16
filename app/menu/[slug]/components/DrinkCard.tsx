import type { Drink } from '@/lib/types/database'

interface DrinkCardProps {
  drink: Drink
  onAdd: (drink: Drink) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}

export default function DrinkCard({ drink, onAdd }: DrinkCardProps) {
  return (
    <div className="flex gap-3 bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-gray-900/50">
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        {drink.image_url ? (
          <img
            src={drink.image_url}
            alt={drink.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{drink.name}</h3>
        {drink.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {drink.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">
            {formatPrice(drink.price)}
          </span>
          <button
            onClick={() => onAdd(drink)}
            className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full hover:bg-amber-700 active:scale-95 transition-all shadow-sm dark:shadow-gray-900/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
