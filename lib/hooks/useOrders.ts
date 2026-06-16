'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatus } from '@/lib/types/database'

export function useOrders(barId: string | null) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)
  const supabase = createClient()

  const playNotification = useCallback(() => {
    try {
      const audio = new Audio('/notification.mp3')
      audio.play().catch(() => {
        // Browser blocked autoplay — handled by UI banner
      })
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!barId) return

    setLoading(true)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    supabase
      .from('orders')
      .select('*')
      .eq('bar_id', barId)
      .gte('created_at', today.toISOString())
      .not('status', 'in', `("delivered","cancelled")`)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setOrders(data as Order[])
        }
        setLoading(false)
      })

    const channel = supabase
      .channel(`orders-${barId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `bar_id=eq.${barId}`,
        },
        (payload) => {
          const newOrder = payload.new as Order
          setOrders((prev) => [newOrder, ...prev])
          playNotification()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `bar_id=eq.${barId}`,
        },
        (payload) => {
          const updated = payload.new as Order
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o))
          )
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [barId, supabase, playNotification])

  const updateStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
    },
    [supabase]
  )

  return { orders, loading, updateStatus }
}
