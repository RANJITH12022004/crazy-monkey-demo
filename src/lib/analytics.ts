import type {
  CategorySlice,
  KpiMetrics,
  MenuCategory,
  OrderWithItems,
  OwnerAnalytics,
  PeakHourPoint,
  RankedItem,
  TrendPeriod,
  TrendPoint,
} from '@/types/analytics'

/** Distinct palette so charts don't all read as the same navy. */
const CATEGORY_COLORS: Record<MenuCategory, string> = {
  Starters: '#0D9488', // teal
  Mains: '#2563EB', // blue
  Desserts: '#DB2777', // pink
  Beverages: '#D97706', // amber
}

export const CHART_REVENUE = '#059669' // emerald
export const CHART_REVENUE_SOFT = '#34D399'
export const CHART_PEAK_HIGH = '#EA580C' // orange
export const CHART_PEAK_MID = '#F59E0B' // amber
export const CHART_PEAK_LOW = '#FCD34D' // light amber
export const CHART_TOP_REVENUE = '#7C3AED' // violet
export const CHART_TOP_VOLUME = '#0891B2' // cyan

/** @deprecated Prefer CHART_REVENUE — kept for any older imports */
export const CHART_PRIMARY = CHART_REVENUE
export const CHART_SECONDARY = CHART_PEAK_HIGH

function startOfDay(date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

function orderRevenue(order: OrderWithItems): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function isWithinLastDays(date: Date, days: number, now = new Date()): boolean {
  const start = startOfDay(now)
  start.setDate(start.getDate() - (days - 1))
  return date >= start && date <= now
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function computeKpis(orders: OrderWithItems[]): KpiMetrics {
  const today = new Date()
  const todayOrders = orders.filter((order) => isSameDay(new Date(order.created_at), today))
  const weekOrders = orders.filter((order) =>
    isWithinLastDays(new Date(order.created_at), 7, today),
  )
  const monthOrders = orders.filter((order) =>
    isSameMonth(new Date(order.created_at), today),
  )

  const sumRevenue = (list: OrderWithItems[]) =>
    list.reduce((sum, order) => sum + orderRevenue(order), 0)

  const todayRevenue = sumRevenue(todayOrders)
  const todayOrderCount = todayOrders.length
  const averageOrderValue =
    todayOrderCount > 0 ? Math.round(todayRevenue / todayOrderCount) : 0

  const weekRevenue = sumRevenue(weekOrders)
  const weekOrderCount = weekOrders.length
  const monthRevenue = sumRevenue(monthOrders)
  const monthOrderCount = monthOrders.length
  const totalRevenue = sumRevenue(orders)
  const totalOrderCount = orders.length

  let itemsSold = 0
  const itemTotals = new Map<string, { name: string; qty: number }>()
  const categoryTotals = new Map<MenuCategory, number>()

  for (const order of orders) {
    for (const item of order.items) {
      itemsSold += item.quantity
      const current = itemTotals.get(item.menu_item_id) ?? { name: item.name, qty: 0 }
      current.qty += item.quantity
      itemTotals.set(item.menu_item_id, current)
      categoryTotals.set(
        item.category,
        (categoryTotals.get(item.category) ?? 0) + item.price * item.quantity,
      )
    }
  }

  const topItem = [...itemTotals.values()].sort((a, b) => b.qty - a.qty)[0]
  const topCategory = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0]

  return {
    todayRevenue,
    todayOrderCount,
    averageOrderValue,
    weekRevenue,
    weekOrderCount,
    monthRevenue,
    monthOrderCount,
    totalRevenue,
    totalOrderCount,
    itemsSold,
    topItemName: topItem?.name ?? '—',
    topCategoryName: topCategory?.[0] ?? '—',
  }
}

function buildDailyTrend(orders: OrderWithItems[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const today = startOfDay(new Date())

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(today)
    day.setDate(day.getDate() - i)
    const dayOrders = orders.filter((order) => isSameDay(new Date(order.created_at), day))
    points.push({
      label: day.toLocaleDateString('en-IN', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, order) => sum + orderRevenue(order), 0),
      orders: dayOrders.length,
    })
  }

  return points
}

function buildWeeklyTrend(orders: OrderWithItems[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const today = startOfDay(new Date())

  for (let i = 7; i >= 0; i -= 1) {
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const weekOrders = orders.filter((order) => {
      const created = new Date(order.created_at)
      return created >= weekStart && created <= weekEnd
    })

    points.push({
      label: weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      revenue: weekOrders.reduce((sum, order) => sum + orderRevenue(order), 0),
      orders: weekOrders.length,
    })
  }

  return points
}

function buildMonthlyTrend(orders: OrderWithItems[]): TrendPoint[] {
  const points: TrendPoint[] = []
  const today = new Date()

  for (let i = 5; i >= 0; i -= 1) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthOrders = orders.filter((order) => {
      const created = new Date(order.created_at)
      return (
        created.getFullYear() === monthDate.getFullYear() &&
        created.getMonth() === monthDate.getMonth()
      )
    })

    points.push({
      label: monthDate.toLocaleDateString('en-IN', { month: 'short' }),
      revenue: monthOrders.reduce((sum, order) => sum + orderRevenue(order), 0),
      orders: monthOrders.length,
    })
  }

  return points
}

function buildTrend(orders: OrderWithItems[], period: TrendPeriod): TrendPoint[] {
  if (period === 'weekly') return buildWeeklyTrend(orders)
  if (period === 'monthly') return buildMonthlyTrend(orders)
  return buildDailyTrend(orders)
}

function buildTopItems(
  orders: OrderWithItems[],
  mode: 'revenue' | 'volume',
  limit = 5,
): RankedItem[] {
  const totals = new Map<string, { name: string; value: number }>()

  for (const order of orders) {
    for (const item of order.items) {
      const current = totals.get(item.menu_item_id) ?? { name: item.name, value: 0 }
      current.value += mode === 'revenue' ? item.price * item.quantity : item.quantity
      totals.set(item.menu_item_id, current)
    }
  }

  const sorted = [...totals.values()].sort((a, b) => b.value - a.value).slice(0, limit)
  const max = sorted[0]?.value ?? 1

  return sorted.map((entry) => ({
    name: entry.name,
    value: entry.value,
    share: Math.round((entry.value / max) * 100),
  }))
}

function buildCategoryBreakdown(orders: OrderWithItems[]): CategorySlice[] {
  const totals = new Map<MenuCategory, number>()

  for (const order of orders) {
    for (const item of order.items) {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.price * item.quantity)
    }
  }

  const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0) || 1

  return (['Starters', 'Mains', 'Desserts', 'Beverages'] as MenuCategory[]).map((category) => ({
    category,
    revenue: totals.get(category) ?? 0,
    share: Math.round(((totals.get(category) ?? 0) / grandTotal) * 100),
  }))
}

function buildPeakHours(orders: OrderWithItems[]): PeakHourPoint[] {
  const buckets = new Map<number, number>()

  for (const order of orders) {
    const hour = new Date(order.created_at).getHours()
    buckets.set(hour, (buckets.get(hour) ?? 0) + 1)
  }

  return Array.from({ length: 14 }, (_, index) => {
    const hour = 10 + index
    const label =
      hour === 12
        ? '12 PM'
        : hour < 12
          ? `${hour} AM`
          : hour === 24
            ? '12 AM'
            : `${hour - 12} PM`

    return {
      hour,
      label,
      orders: buckets.get(hour) ?? 0,
    }
  })
}

export function buildAnalytics(
  orders: OrderWithItems[],
  period: TrendPeriod,
  usingMockData = false,
): OwnerAnalytics {
  return {
    kpis: computeKpis(orders),
    trend: buildTrend(orders, period),
    topByRevenue: buildTopItems(orders, 'revenue'),
    topByVolume: buildTopItems(orders, 'volume'),
    categoryBreakdown: buildCategoryBreakdown(orders),
    peakHours: buildPeakHours(orders),
    usingMockData,
    orderCount: orders.length,
  }
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompactInr(amount: number): string {
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}k`
  }
  return formatInr(amount)
}

export function getCategoryColor(category: MenuCategory): string {
  return CATEGORY_COLORS[category]
}

export const MIN_ORDERS_FOR_LIVE_DATA = 5
