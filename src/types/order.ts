import type { MenuCategory } from '@/types/analytics'

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed'

export type ActiveOrderStatus = Exclude<OrderStatus, 'completed'>

export interface CartLine {
  menuItemId: string
  quantity: number
}

export interface PlaceOrderPayload {
  tableId: string
  items: CartLine[]
  specialInstructions?: string
}

export interface OrderLineDetail {
  menu_item_id: string
  name: string
  category: MenuCategory
  price: number
  quantity: number
}

export interface KitchenOrder {
  id: string
  table_id: string
  status: OrderStatus
  created_at: string
  special_instructions: string | null
  items: OrderLineDetail[]
}

export interface TrackingOrder {
  id: string
  table_id: string
  status: OrderStatus
  created_at: string
  special_instructions: string | null
  items: OrderLineDetail[]
  subtotal: number
  total: number
}

export interface TableBillRound {
  id: string
  status: OrderStatus
  created_at: string
  special_instructions: string | null
  items: OrderLineDetail[]
  subtotal: number
}

export interface TableBill {
  tableId: string
  rounds: TableBillRound[]
  foodSubtotal: number
  gst: number
  restaurantCharge: number
  grandTotal: number
  latestOrderId: string | null
}
