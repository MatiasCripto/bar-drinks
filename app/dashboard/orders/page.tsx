'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useOrders } from '@/lib/hooks/useOrders'
import OrderCard from './components/OrderCard'
import type { Order, OrderStatus, Bar } from '@/lib/types/database'
import { Badge } from '@/components/ui/Badge'

const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Pendientes', color: 'bg-yellow-400' },
  { status: 'preparing', label: 'Preparando', color: 'bg-blue-400' },
  { status: 'ready', label: 'Listos', color: 'bg-green-400' },
]

export default function OrdersPage() {
  const [bar, setBar] = useState<Bar | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('bars')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setBar(data as Bar)
        })
    })
  }, [supabase])

  const { orders, loading, updateStatus } = useOrders(bar?.id ?? null)

  const getColumnOrders = (status: OrderStatus) =>
    orders.filter((o) => o.status === status)

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pedidos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length} activos
          </p>
        </div>

        {!audioEnabled && (
          <button
            onClick={() => setAudioEnabled(true)}
            className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-400 font-medium flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            Activar sonido
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {columns.map((col) => {
            const colOrders = getColumnOrders(col.status)
            return (
              <div key={col.status}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h2 className="font-semibold text-gray-700 dark:text-gray-200">{col.label}</h2>
                  <Badge variant="default">{colOrders.length}</Badge>
                </div>
                <div className="space-y-3">
                  {colOrders.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                      Sin pedidos
                    </p>
                  ) : (
                    colOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={(status) => updateStatus(order.id, status)}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Completed/Cancelled section */}
      {orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled').length > 0 && (
        <details className="mt-8">
          <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 font-medium">
            Pedidos anteriores ({orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled').length})
          </summary>
          <div className="mt-3 space-y-2">
            {orders
              .filter((o) => o.status === 'delivered' || o.status === 'cancelled')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={(status) => updateStatus(order.id, status)}
                  compact
                />
              ))}
          </div>
        </details>
      )}
    </div>
  )
}
