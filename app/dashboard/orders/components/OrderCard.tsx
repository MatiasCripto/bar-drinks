'use client'

import { useEffect, useState } from 'react'
import type { Order, OrderStatus } from '@/lib/types/database'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface OrderCardProps {
  order: Order
  onStatusChange: (status: OrderStatus) => void
  compact?: boolean
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'hace unos segundos'
  const minutes = Math.floor(seconds / 60)
  if (minutes === 1) return 'hace 1 min'
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'hace 1 hora'
  return `hace ${hours} horas`
}

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const statusVariants: Record<OrderStatus, 'warning' | 'info' | 'success' | 'default' | 'danger'> = {
  pending: 'warning',
  preparing: 'info',
  ready: 'success',
  delivered: 'default',
  cancelled: 'danger',
}

export default function OrderCard({ order, onStatusChange, compact = false }: OrderCardProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(interval)
  }, [])

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm">Mesa {order.table_identifier || '—'}</span>
          <Badge variant={statusVariants[order.status]}>{statusLabels[order.status]}</Badge>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(order.total)}</span>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Mesa {order.table_identifier || '—'}
            </h3>
            <Badge variant={statusVariants[order.status]}>{statusLabels[order.status]}</Badge>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(order.created_at)}</p>
        </div>
        <span className="font-bold text-amber-700 dark:text-amber-400">{formatPrice(order.total)}</span>
      </div>

      <div className="space-y-1">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {item.quantity}x {item.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {order.customer_note && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">Nota:</span> {order.customer_note}
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {order.status === 'pending' && (
          <Button size="sm" onClick={() => onStatusChange('preparing')} className="flex-1">
            Preparando →
          </Button>
        )}
        {order.status === 'preparing' && (
          <Button size="sm" onClick={() => onStatusChange('ready')} className="flex-1">
            Listo →
          </Button>
        )}
        {order.status === 'ready' && (
          <Button size="sm" variant="secondary" onClick={() => onStatusChange('delivered')} className="flex-1">
            Entregado
          </Button>
        )}
        {(order.status === 'pending' || order.status === 'preparing') && (
          <Button size="sm" variant="ghost" onClick={() => onStatusChange('cancelled')} className="text-red-500 hover:text-red-700">
            Cancelar
          </Button>
        )}
      </div>
    </div>
  )
}
