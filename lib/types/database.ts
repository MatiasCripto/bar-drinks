export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface Bar {
  id: string
  owner_id: string
  name: string
  slug: string
  logo_url: string | null
  address: string | null
  active: boolean
  created_at: string
}

export interface Category {
  id: string
  bar_id: string
  name: string
  sort_order: number
  created_at: string
}

export interface Drink {
  id: string
  bar_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  available: boolean
  sort_order: number
  created_at: string
}

export interface OrderItem {
  drink_id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  bar_id: string
  table_identifier: string | null
  customer_note: string | null
  items: OrderItem[]
  total: number
  status: OrderStatus
  created_at: string
  updated_at: string
}
