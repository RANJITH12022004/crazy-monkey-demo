import { supabase } from '@/lib/supabase'
import { assertNonEmpty, classifySupabaseError, DataFetchError } from '@/lib/supabaseErrors'
import { generateMockOrders, MENU_CATALOG } from '@/data/mockAnalytics'
import type {
  MenuItem,
  OrderItemRecord,
  OrderRecord,
  OrderWithItems,
} from '@/types/analytics'

const ORDERS_TABLE = 'orders'
const ORDER_ITEMS_TABLE = 'order_items'
const MENU_TABLE = 'menu_items'

export async function fetchOrdersWithItems(): Promise<OrderWithItems[]> {
  try {
    const [
      { data: orders, error: ordersError },
      { data: items, error: itemsError },
      { data: menu, error: menuError },
    ] = await Promise.all([
      supabase
        .from(ORDERS_TABLE)
        .select('id, table_id, status, created_at, special_instructions')
        .order('created_at', { ascending: false }),
      supabase.from(ORDER_ITEMS_TABLE).select('id, order_id, menu_item_id, quantity'),
      supabase
        .from(MENU_TABLE)
        .select('id, name, description, price, category, image_url, is_veg, is_bestseller'),
    ])

    if (ordersError) {
      throw classifySupabaseError(ordersError, { table: ORDERS_TABLE, operation: 'select orders' })
    }
    if (itemsError) {
      throw classifySupabaseError(itemsError, {
        table: ORDER_ITEMS_TABLE,
        operation: 'select order_items',
      })
    }
    if (menuError) {
      throw classifySupabaseError(menuError, { table: MENU_TABLE, operation: 'select menu_items' })
    }

    assertNonEmpty(menu, MENU_TABLE, 'supabase/migrations/003_orders_menu.sql')
    assertNonEmpty(orders, ORDERS_TABLE, 'supabase/migrations/003_orders_menu.sql')

    const menuMap = new Map((menu ?? []).map((entry) => [entry.id, entry as MenuItem]))

    const itemsByOrder = new Map<string, OrderItemRecord[]>()
    for (const item of items ?? []) {
      const list = itemsByOrder.get(item.order_id) ?? []
      list.push(item as OrderItemRecord)
      itemsByOrder.set(item.order_id, list)
    }

    return (orders ?? []).map((order: OrderRecord) => ({
      ...order,
      items: (itemsByOrder.get(order.id) ?? [])
        .map((line) => {
          const menuItem = menuMap.get(line.menu_item_id)
          if (!menuItem) return null
          return {
            menu_item_id: line.menu_item_id,
            name: menuItem.name,
            category: menuItem.category,
            price: Number(menuItem.price),
            quantity: line.quantity,
          }
        })
        .filter((line): line is NonNullable<typeof line> => line !== null),
    }))
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'load owner analytics' })
  }
}

async function insertDemoOrders(): Promise<void> {
  const mockOrders = generateMockOrders()

  for (const order of mockOrders) {
    const { data: insertedOrder, error: orderError } = await supabase
      .from(ORDERS_TABLE)
      .insert({
        table_id: order.table_id,
        status: order.status,
        created_at: order.created_at,
        special_instructions: order.special_instructions,
      })
      .select('id')
      .single()

    if (orderError || !insertedOrder) {
      throw classifySupabaseError(orderError ?? new Error('Failed to insert demo order'), {
        table: ORDERS_TABLE,
        operation: 'insert orders',
      })
    }

    const rows = order.items
      .filter((item) => MENU_CATALOG[item.menu_item_id])
      .map((item) => ({
        order_id: insertedOrder.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
      }))

    if (rows.length > 0) {
      const { error: itemsError } = await supabase.from(ORDER_ITEMS_TABLE).insert(rows)
      if (itemsError) {
        throw classifySupabaseError(itemsError, {
          table: ORDER_ITEMS_TABLE,
          operation: 'insert order_items',
        })
      }
    }
  }
}

export async function resetDemoOrders(): Promise<void> {
  try {
    const { error: deleteItemsError } = await supabase
      .from(ORDER_ITEMS_TABLE)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteItemsError) {
      throw classifySupabaseError(deleteItemsError, {
        table: ORDER_ITEMS_TABLE,
        operation: 'delete order_items',
      })
    }

    const { error: deleteOrdersError } = await supabase
      .from(ORDERS_TABLE)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteOrdersError) {
      throw classifySupabaseError(deleteOrdersError, {
        table: ORDERS_TABLE,
        operation: 'delete orders',
      })
    }

    await insertDemoOrders()
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'reset demo orders' })
  }
}
