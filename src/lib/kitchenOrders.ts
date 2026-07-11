import { fetchAllMenu, getMenuItemMap } from '@/lib/menu'
import { supabase } from '@/lib/supabase'
import { classifySupabaseError, DataFetchError } from '@/lib/supabaseErrors'
import type { ActiveOrderStatus, KitchenOrder, OrderStatus } from '@/types/order'

const ORDERS_TABLE = 'orders'
const ORDER_ITEMS_TABLE = 'order_items'

function startOfTodayIso(): string {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

async function hydrateOrders(
  orders: Array<{
    id: string
    table_id: string
    status: OrderStatus
    created_at: string
    special_instructions: string | null
  }>,
): Promise<KitchenOrder[]> {
  if (orders.length === 0) return []

  const orderIds = orders.map((order) => order.id)
  const [{ data: orderItems, error: itemsError }, menu] = await Promise.all([
    supabase
      .from(ORDER_ITEMS_TABLE)
      .select('order_id, menu_item_id, quantity')
      .in('order_id', orderIds),
    fetchAllMenu(),
  ])

  if (itemsError) {
    throw classifySupabaseError(itemsError, {
      table: ORDER_ITEMS_TABLE,
      operation: 'fetch kitchen order items',
    })
  }

  const menuMap = getMenuItemMap(menu)
  const itemsByOrder = new Map<string, KitchenOrder['items']>()

  for (const line of orderItems ?? []) {
    const menuItem = menuMap.get(line.menu_item_id as string)
    if (!menuItem) continue
    const list = itemsByOrder.get(line.order_id as string) ?? []
    list.push({
      menu_item_id: menuItem.id,
      name: menuItem.name,
      category: menuItem.category,
      price: menuItem.price,
      quantity: line.quantity as number,
    })
    itemsByOrder.set(line.order_id as string, list)
  }

  return orders.map((order) => ({
    ...order,
    items: itemsByOrder.get(order.id) ?? [],
  }))
}

export async function fetchActiveKitchenOrders(): Promise<KitchenOrder[]> {
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('id, table_id, status, created_at, special_instructions')
      .in('status', ['received', 'preparing', 'ready'] satisfies ActiveOrderStatus[])
      .gte('created_at', startOfTodayIso())
      .order('created_at', { ascending: true })

    if (error) {
      throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'fetch active orders' })
    }

    return hydrateOrders((data ?? []) as KitchenOrder[])
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'load kitchen board' })
  }
}

export async function fetchCompletedKitchenOrders(): Promise<KitchenOrder[]> {
  try {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select('id, table_id, status, created_at, special_instructions')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw classifySupabaseError(error, {
        table: ORDERS_TABLE,
        operation: 'fetch completed orders',
      })
    }

    return hydrateOrders((data ?? []) as KitchenOrder[])
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'load kitchen history' })
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: ActiveOrderStatus | 'completed',
): Promise<void> {
  try {
    const { error } = await supabase.from(ORDERS_TABLE).update({ status }).eq('id', orderId)

    if (error) {
      throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'update order status' })
    }
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'update kitchen order' })
  }
}

export async function bumpOrder(orderId: string): Promise<void> {
  await updateOrderStatus(orderId, 'completed')
}

export function nextKitchenAction(
  status: OrderStatus,
): { label: string; nextStatus: ActiveOrderStatus | 'completed' } | null {
  if (status === 'received') return { label: 'START', nextStatus: 'preparing' }
  if (status === 'preparing') return { label: 'READY', nextStatus: 'ready' }
  if (status === 'ready') return { label: 'BUMP', nextStatus: 'completed' }
  return null
}
