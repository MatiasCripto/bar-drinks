'use client'

import { useState, useCallback } from 'react'
import type { Drink, OrderItem } from '@/lib/types/database'

interface CartState {
  items: OrderItem[]
  tableIdentifier: string
}

export function useCart() {
  const [cart, setCart] = useState<CartState>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('cart')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch { /* ignore */ }
      }
    }
    return { items: [], tableIdentifier: '' }
  })

  const saveCart = useCallback((newCart: CartState) => {
    setCart(newCart)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cart', JSON.stringify(newCart))
    }
  }, [])

  const addItem = useCallback((drink: Drink) => {
    saveCart({
      ...cart,
      items: cart.items.some(i => i.drink_id === drink.id)
        ? cart.items.map(i =>
            i.drink_id === drink.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...cart.items, {
            drink_id: drink.id,
            name: drink.name,
            price: drink.price,
            quantity: 1,
          }],
    })
  }, [cart, saveCart])

  const removeItem = useCallback((drinkId: string) => {
    const newItems = cart.items
      .map(i => i.drink_id === drinkId ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0)
    saveCart({ ...cart, items: newItems })
  }, [cart, saveCart])

  const setTableIdentifier = useCallback((tableIdentifier: string) => {
    saveCart({ ...cart, tableIdentifier })
  }, [cart, saveCart])

  const clearCart = useCallback(() => {
    saveCart({ items: [], tableIdentifier: '' })
  }, [saveCart])

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return {
    items: cart.items,
    tableIdentifier: cart.tableIdentifier,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    setTableIdentifier,
    clearCart,
  }
}
