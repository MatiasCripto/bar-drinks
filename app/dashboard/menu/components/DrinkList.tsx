'use client'

import { useState } from 'react'
import type { Drink, Category } from '@/lib/types/database'
import DrinkForm from './DrinkForm'
import { Button } from '@/components/ui/Button'

interface DrinkListProps {
  drinks: Drink[]
  categories: Category[]
  onToggleAvailability: (id: string, available: boolean) => void
  onDelete: (id: string) => Promise<any>
  onUpdate: (id: string, updates: Partial<Drink>) => Promise<any>
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}

export default function DrinkList({
  drinks,
  categories,
  onToggleAvailability,
  onDelete,
  onUpdate,
}: DrinkListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  if (drinks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
        <p className="text-sm">No hay productos todavía</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {drinks.map((drink) => (
        <div key={drink.id}>
          {editingId === drink.id ? (
            <div className="mb-4">
              <DrinkForm
                barId={drink.bar_id}
                categories={categories}
                initial={drink}
                onSubmit={async (data) => {
                  const { bar_id, ...updates } = data
                  const err = await onUpdate(drink.id, updates)
                  if (!err) setEditingId(null)
                  return err
                }}
              />
              <div className="mt-2 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                {drink.image_url ? (
                  <img src={drink.image_url} alt={drink.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{drink.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {categories.find((c) => c.id === drink.category_id)?.name ?? 'Sin categoría'}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">{formatPrice(drink.price)}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onToggleAvailability(drink.id, !drink.available)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    drink.available
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                      : 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={drink.available ? 'Disponible' : 'No disponible'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {drink.available ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    )}
                  </svg>
                </button>

                <button
                  onClick={() => setEditingId(drink.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={async () => {
                    if (deleting === drink.id) {
                      await onDelete(drink.id)
                      setDeleting(null)
                    } else {
                      setDeleting(drink.id)
                      setTimeout(() => setDeleting(null), 3000)
                    }
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                    deleting === drink.id
                      ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                  title={deleting === drink.id ? 'Confirmar eliminar' : 'Eliminar'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
