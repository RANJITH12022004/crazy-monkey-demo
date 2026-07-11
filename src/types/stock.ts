export const STOCK_CATEGORIES = [
  'Proteins',
  'Vegetables',
  'Dairy',
  'Dry Goods',
  'Beverages',
] as const

export type StockCategory = (typeof STOCK_CATEGORIES)[number]

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type StockView = 'overview' | 'alerts' | 'manual' | 'create'

export type AdjustmentReason = 'received' | 'wastage' | 'correction'

export interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  threshold_low: number
  last_updated: string
}

export interface StockItemRow extends StockItem {
  status: StockStatus
}

export const ADJUSTMENT_REASONS: { value: AdjustmentReason; label: string }[] = [
  { value: 'received', label: 'Received Delivery' },
  { value: 'wastage', label: 'Wastage' },
  { value: 'correction', label: 'Manual Correction' },
]

export const CATEGORY_ICONS: Record<string, string> = {
  Proteins: 'kebab_dining',
  Vegetables: 'eco',
  Dairy: 'egg',
  'Dry Goods': 'grain',
  Beverages: 'local_cafe',
}

export const SUPPLIER_NAMES: Record<string, string> = {
  Proteins: 'FreshFarm Co.',
  Vegetables: 'Garden Harvest',
  Dairy: 'DairyPure India',
  'Dry Goods': 'MegaMart Wholesale',
  Beverages: 'Beverage Depot',
}

export function getStockStatus(quantity: number, thresholdLow: number): StockStatus {
  if (quantity <= 0) return 'out_of_stock'
  if (quantity <= thresholdLow) return 'low_stock'
  return 'in_stock'
}

export function toStockRow(item: StockItem): StockItemRow {
  return {
    ...item,
    quantity: Number(item.quantity),
    threshold_low: Number(item.threshold_low),
    status: getStockStatus(Number(item.quantity), Number(item.threshold_low)),
  }
}

export function formatStockQuantity(quantity: number, unit: string): string {
  const formatted = Number.isInteger(quantity) ? quantity.toString() : quantity.toFixed(1)
  return `${formatted} ${unit}`
}

export function formatLastUpdated(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (isToday) return `Today, ${time}`
  if (isYesterday) return `Yesterday, ${time}`
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
