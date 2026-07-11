import type {
  MenuCategory,
  OrderLineItem,
  OrderWithItems,
  OwnerAnalytics,
  TrendPeriod,
} from '@/types/analytics'
import { buildAnalytics } from '@/lib/analytics'

const MENU_CATALOG: Record<string, { name: string; price: number; category: MenuCategory }> = {
  'a1000001-0000-4000-8000-000000000001': { name: 'Veg Spring Rolls', price: 220, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000002': { name: 'Chicken Dumplings', price: 320, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000003': { name: 'Bruschetta Trio', price: 280, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000004': { name: 'Hakka Noodles', price: 340, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000005': { name: 'Kung Pao Chicken', price: 420, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000006': { name: 'Schezwan Fried Rice', price: 360, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000007': { name: 'Margherita Pizza', price: 480, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000008': { name: 'Penne Arrabiata', price: 390, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000009': { name: 'Tiramisu', price: 290, category: 'Desserts' },
  'a1000001-0000-4000-8000-000000000010': { name: 'Chocolate Lava Cake', price: 320, category: 'Desserts' },
  'a1000001-0000-4000-8000-000000000011': { name: 'Gelato Scoop', price: 180, category: 'Desserts' },
  'a1000001-0000-4000-8000-000000000012': { name: 'Mango Lassi', price: 160, category: 'Beverages' },
  'a1000001-0000-4000-8000-000000000013': { name: 'Fresh Lime Soda', price: 120, category: 'Beverages' },
  'a1000001-0000-4000-8000-000000000014': { name: 'Espresso', price: 140, category: 'Beverages' },
  'a1000001-0000-4000-8000-000000000015': { name: 'Veg Manchurian', price: 280, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000016': { name: 'Hot & Sour Soup', price: 190, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000017': { name: 'Chili Chicken', price: 380, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000018': { name: 'Veg Fried Rice', price: 300, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000019': { name: 'Garlic Bread', price: 180, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000020': { name: 'Alfredo Pasta', price: 420, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000021': { name: 'Beef Lasagna', price: 480, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000022': { name: 'Caprese Salad', price: 260, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000023': { name: 'Paneer Tikka', price: 320, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000024': { name: 'Butter Chicken', price: 420, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000025': { name: 'Dal Makhani', price: 280, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000026': { name: 'Garlic Naan', price: 80, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000027': { name: 'Chicken Biryani', price: 380, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000028': { name: 'Loaded Nachos', price: 290, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000029': { name: 'Chicken Tacos', price: 340, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000030': { name: 'Burrito Bowl', price: 360, category: 'Mains' },
  'a1000001-0000-4000-8000-000000000031': { name: 'Guacamole & Chips', price: 220, category: 'Starters' },
  'a1000001-0000-4000-8000-000000000032': { name: 'Gulab Jamun', price: 160, category: 'Desserts' },
  'a1000001-0000-4000-8000-000000000033': { name: 'New York Cheesecake', price: 300, category: 'Desserts' },
  'a1000001-0000-4000-8000-000000000034': { name: 'Chocolate Brownie', price: 220, category: 'Desserts' },
  'a1000001-0000-4000-8000-000000000035': { name: 'Masala Chai', price: 90, category: 'Beverages' },
  'a1000001-0000-4000-8000-000000000036': { name: 'Cold Coffee', price: 160, category: 'Beverages' },
  'a1000001-0000-4000-8000-000000000037': { name: 'Fresh Orange Juice', price: 140, category: 'Beverages' },
  'a1000001-0000-4000-8000-000000000038': { name: 'Soft Drink', price: 80, category: 'Beverages' },
  'a1000001-0000-4000-8000-000000000039': { name: 'Buttermilk', price: 70, category: 'Beverages' },
}

function lineItem(menuId: string, quantity: number): OrderLineItem {
  const menu = MENU_CATALOG[menuId]
  return {
    menu_item_id: menuId,
    name: menu.name,
    price: menu.price,
    category: menu.category,
    quantity,
  }
}

function hoursAgo(hours: number, minutes = 0): string {
  const date = new Date()
  date.setHours(date.getHours() - hours, date.getMinutes() - minutes, 0, 0)
  return date.toISOString()
}

function daysAgo(days: number, hour: number, minute = 0): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

export function generateMockOrders(): OrderWithItems[] {
  const orders: OrderWithItems[] = []
  let counter = 0

  const pushOrder = (
    createdAt: string,
    tableId: string,
    items: OrderLineItem[],
    status: OrderWithItems['status'] = 'completed',
  ) => {
    counter += 1
    orders.push({
      id: `mock-order-${counter}`,
      table_id: tableId,
      status,
      created_at: createdAt,
      special_instructions: null,
      items,
    })
  }

  // Today — busy lunch & dinner (completed for analytics)
  for (let i = 0; i < 8; i += 1) {
    pushOrder(
      hoursAgo(10 - i, i * 7),
      `table-${4 + i}`,
      [
        lineItem('a1000001-0000-4000-8000-000000000005', 1 + (i % 2)),
        lineItem('a1000001-0000-4000-8000-000000000004', 1),
        lineItem('a1000001-0000-4000-8000-000000000012', 2),
      ],
      'completed',
    )
  }

  pushOrder(
    hoursAgo(2),
    'table-12',
    [
      lineItem('a1000001-0000-4000-8000-000000000007', 2),
      lineItem('a1000001-0000-4000-8000-000000000009', 2),
      lineItem('a1000001-0000-4000-8000-000000000012', 3),
    ],
    'completed',
  )

  // Live kitchen demo orders for today
  pushOrder(
    hoursAgo(0, 3),
    'table-5',
    [
      lineItem('a1000001-0000-4000-8000-000000000006', 1),
      lineItem('a1000001-0000-4000-8000-000000000002', 2),
    ],
    'received',
  )

  pushOrder(
    hoursAgo(0, 12),
    'table-8',
    [
      lineItem('a1000001-0000-4000-8000-000000000007', 1),
      lineItem('a1000001-0000-4000-8000-000000000003', 1),
    ],
    'preparing',
  )

  // Last 30 days
  for (let day = 1; day <= 29; day += 1) {
    for (let slot = 0; slot < 3; slot += 1) {
      pushOrder(
        daysAgo(day, 12 + slot * 3, (day * 5 + slot * 11) % 50),
        `table-${(day % 10) + 1}`,
        [
          lineItem('a1000001-0000-4000-8000-000000000005', 1),
          lineItem('a1000001-0000-4000-8000-000000000006', 1),
          lineItem('a1000001-0000-4000-8000-000000000012', 1 + (slot % 2)),
          ...(day % 4 === 0 ? [lineItem('a1000001-0000-4000-8000-000000000007', 1)] : []),
          ...(day % 5 === 0 ? [lineItem('a1000001-0000-4000-8000-000000000009', 1)] : []),
        ],
      )
    }
  }

  return orders
}

export function getMockAnalytics(period: TrendPeriod = 'daily'): OwnerAnalytics {
  return buildAnalytics(generateMockOrders(), period, true)
}

export { MENU_CATALOG }
