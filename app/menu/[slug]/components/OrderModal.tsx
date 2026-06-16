'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { OrderItem } from '@/lib/types/database'

interface OrderModalProps {
  open: boolean
  onClose: () => void
  success: boolean
  items: OrderItem[]
  totalPrice: number
  tableIdentifier: string
  customerNote: string
  barId: string
  onSuccess: () => void
  onRemoveItem: (drinkId: string) => void
  onNoteChange?: (note: string) => void
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}

export default function OrderModal({
  open,
  onClose,
  success,
  items,
  totalPrice,
  tableIdentifier,
  customerNote,
  barId,
  onSuccess,
  onRemoveItem,
  onNoteChange,
}: OrderModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [note, setNote] = useState(customerNote)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!tableIdentifier.trim()) {
      setError('Por favor ingresá tu número de mesa o nombre')
      return
    }

    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('orders').insert({
      bar_id: barId,
      table_identifier: tableIdentifier.trim(),
      customer_note: note.trim() || null,
      items,
      total: totalPrice,
      status: 'pending',
    })

    if (insertError) {
      setError('Error al enviar el pedido. Intentá de nuevo.')
    } else {
      onSuccess()
    }
    setSubmitting(false)
  }

  return (
    <Modal open={open} onClose={onClose} title={success ? 'Pedido enviado' : 'Tu pedido'}>
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ¡Tu pedido fue enviado!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Te avisamos cuando esté listo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No hay items en el carrito
            </p>
          ) : (
            <>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.drink_id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.quantity}x {item.name}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.drink_id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 p-1 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center font-semibold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nota para el bar (opcional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value)
                    onNoteChange?.(e.target.value)
                  }}
                  placeholder="Ej: sin hielo, bien tostado..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none dark:placeholder:text-gray-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 rounded-lg p-3">{error}</p>
              )}

              <Button
                onClick={handleSubmit}
                loading={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? 'Enviando...' : 'Confirmar pedido'}
              </Button>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}
