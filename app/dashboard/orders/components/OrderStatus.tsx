import type { OrderStatus as OrderStatusType } from '@/lib/types/database'
import { Badge } from '@/components/ui/Badge'

interface OrderStatusProps {
  status: OrderStatusType
}

const labels: Record<OrderStatusType, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const variants: Record<OrderStatusType, 'warning' | 'info' | 'success' | 'default' | 'danger'> = {
  pending: 'warning',
  preparing: 'info',
  ready: 'success',
  delivered: 'default',
  cancelled: 'danger',
}

export function OrderStatus({ status }: OrderStatusProps) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

export const statusLabels = labels
export const statusVariants = variants
