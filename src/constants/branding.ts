export const RESTAURANT_NAME = 'Crazy Monkey'

/** Local bundled logo — works offline / on spotty WiFi during pitches */
export const LOGO_URL = '/logo.png'

export const CHINESE_HERO_URL =
  'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80'

export const ITALIAN_HERO_URL =
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'

export const DESSERT_HERO_URL =
  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80'

export const INDIAN_HERO_URL =
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80'

export const MEXICAN_HERO_URL =
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'

/** Default table for printed QR / pitch demos */
export const DEMO_TABLE_ID = 'table-12'

export const GST_RATE = 0.05
export const RESTAURANT_CHARGE = 20

export const STAFF_PINS = {
  kitchen: { pin: '1111', role: 'Kitchen', path: '/kitchen' },
  stock: { pin: '2222', role: 'Stock', path: '/stock' },
  owner: { pin: '3333', role: 'Owner', path: '/owner' },
} as const

export function formatTableLabel(tableId: string): string {
  const cleaned = tableId.replace(/^table-?/i, '')
  return cleaned ? `Table ${cleaned}` : tableId
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function shortOrderId(orderId: string): string {
  return orderId.replace(/-/g, '').slice(0, 4).toUpperCase()
}

export function cuisineHeroUrl(cuisine: string): string | null {
  if (cuisine === 'chinese') return CHINESE_HERO_URL
  if (cuisine === 'italian') return ITALIAN_HERO_URL
  if (cuisine === 'dessert') return DESSERT_HERO_URL
  if (cuisine === 'indian') return INDIAN_HERO_URL
  if (cuisine === 'mexican') return MEXICAN_HERO_URL
  return null
}
