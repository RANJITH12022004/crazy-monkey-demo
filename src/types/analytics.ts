import type { Cuisine } from '@/types/menu'

export type MenuCategory = 'Starters' | 'Mains' | 'Desserts' | 'Beverages'

export type TrendPeriod = 'daily' | 'weekly' | 'monthly'

export type TopItemsSort = 'revenue' | 'volume'

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: MenuCategory
  image_url: string | null
  is_veg: boolean
  is_bestseller: boolean
  cuisine?: Cuisine
}

export interface OrderRecord {
  id: string
  table_id: string
  status: 'received' | 'preparing' | 'ready' | 'completed'
  created_at: string
  special_instructions: string | null
}

export interface OrderItemRecord {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
}

export interface OrderLineItem {
  menu_item_id: string
  name: string
  category: MenuCategory
  price: number
  quantity: number
}

export interface OrderWithItems extends OrderRecord {
  items: OrderLineItem[]
}

export interface KpiMetrics {
  todayRevenue: number
  todayOrderCount: number
  averageOrderValue: number
  weekRevenue: number
  weekOrderCount: number
  monthRevenue: number
  monthOrderCount: number
  totalRevenue: number
  totalOrderCount: number
  itemsSold: number
  topItemName: string
  topCategoryName: MenuCategory | '—'
}

export interface TrendPoint {
  label: string
  revenue: number
  orders: number
}

export interface RankedItem {
  name: string
  value: number
  share: number
}

export interface CategorySlice {
  category: MenuCategory
  revenue: number
  share: number
}

export interface PeakHourPoint {
  hour: number
  label: string
  orders: number
}

export interface OwnerAnalytics {
  kpis: KpiMetrics
  trend: TrendPoint[]
  topByRevenue: RankedItem[]
  topByVolume: RankedItem[]
  categoryBreakdown: CategorySlice[]
  peakHours: PeakHourPoint[]
  usingMockData: boolean
  orderCount: number
}
