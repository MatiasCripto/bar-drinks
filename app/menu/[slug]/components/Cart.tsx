interface CartProps {
  totalItems: number
  totalPrice: number
  onOpen: () => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}

export default function Cart({ totalItems, totalPrice, onOpen }: CartProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-gray-900 dark:via-gray-900 pointer-events-none">
      <button
        onClick={onOpen}
        className="pointer-events-auto w-full max-w-lg mx-auto bg-gray-900 text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl shadow-black/20 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-sm font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            <p className="text-xs text-gray-400 dark:text-gray-500">Ver pedido</p>
          </div>
        </div>
        <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
      </button>
    </div>
  )
}
