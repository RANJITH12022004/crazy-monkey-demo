import { GST_RATE, RESTAURANT_CHARGE } from '@/constants/branding'
import { fetchAllMenu, getMenuItemMap } from '@/lib/menu'
import { supabase } from '@/lib/supabase'
import { classifySupabaseError, DataFetchError } from '@/lib/supabaseErrors'
import type {
  OrderLineDetail,
  PlaceOrderPayload,
  TableBill,
  TableBillRound,
  TrackingOrder,
} from '@/types/order'

const ORDERS_TABLE = 'orders'
const ORDER_ITEMS_TABLE = 'order_items'

function startOfTodayIso(): string {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

function buildTrackingOrder(
  order: {
    id: string
    table_id: string
    status: TrackingOrder['status']
    created_at: string
    special_instructions: string | null
  },
  items: TrackingOrder['items'],
): TrackingOrder {
  const subtotal = items.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const gst = subtotal * GST_RATE
  const total = subtotal + gst + RESTAURANT_CHARGE

  return {
    ...order,
    items,
    subtotal,
    total,
  }
}

function mapLines(
  orderItems: Array<{ order_id?: string; menu_item_id: string; quantity: number }>,
  menuMap: ReturnType<typeof getMenuItemMap>,
): OrderLineDetail[] {
  return orderItems
    .map((line) => {
      const menuItem = menuMap.get(line.menu_item_id)
      if (!menuItem) return null
      return {
        menu_item_id: menuItem.id,
        name: menuItem.name,
        category: menuItem.category,
        price: menuItem.price,
        quantity: line.quantity,
      }
    })
    .filter((line): line is OrderLineDetail => line !== null)
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<string> {
  try {
    const { data: orderRow, error: orderError } = await supabase
      .from(ORDERS_TABLE)
      .insert({
        table_id: payload.tableId,
        status: 'received',
        special_instructions: payload.specialInstructions?.trim() || null,
      })
      .select('id')
      .single()

    if (orderError || !orderRow) {
      throw classifySupabaseError(orderError ?? new Error('Failed to create order'), {
        table: ORDERS_TABLE,
        operation: 'insert order',
      })
    }

    const rows = payload.items.map((item) => ({
      order_id: orderRow.id,
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from(ORDER_ITEMS_TABLE).insert(rows)

    if (itemsError) {
      throw classifySupabaseError(itemsError, {
        table: ORDER_ITEMS_TABLE,
        operation: 'insert order_items',
      })
    }

    return orderRow.id as string
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'place order' })
  }
}

export async function fetchOrderForTracking(orderId: string): Promise<TrackingOrder | null> {
  try {
    const [
      { data: order, error: orderError },
      { data: orderItems, error: itemsError },
      menu,
    ] = await Promise.all([
      supabase
        .from(ORDERS_TABLE)
        .select('id, table_id, status, created_at, special_instructions')
        .eq('id', orderId)
        .maybeSingle(),
      supabase
        .from(ORDER_ITEMS_TABLE)
        .select('menu_item_id, quantity')
        .eq('order_id', orderId),
      fetchAllMenu(),
    ])

    if (orderError) {
      throw classifySupabaseError(orderError, { table: ORDERS_TABLE, operation: 'fetch order' })
    }
    if (itemsError) {
      throw classifySupabaseError(itemsError, {
        table: ORDER_ITEMS_TABLE,
        operation: 'fetch order items',
      })
    }
    if (!order) return null

    const menuMap = getMenuItemMap(menu)
    const items = mapLines(
      (orderItems ?? []).map((line) => ({
        menu_item_id: line.menu_item_id as string,
        quantity: line.quantity as number,
      })),
      menuMap,
    )

    return buildTrackingOrder(order as TrackingOrder, items)
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'track order' })
  }
}

export async function fetchTableBill(tableId: string): Promise<TableBill> {
  try {
    const [{ data: orders, error: ordersError }, menu] = await Promise.all([
      supabase
        .from(ORDERS_TABLE)
        .select('id, table_id, status, created_at, special_instructions')
        .eq('table_id', tableId)
        .gte('created_at', startOfTodayIso())
        .order('created_at', { ascending: true }),
      fetchAllMenu(),
    ])

    if (ordersError) {
      throw classifySupabaseError(ordersError, {
        table: ORDERS_TABLE,
        operation: 'fetch table orders',
      })
    }

    const orderRows = orders ?? []
    if (orderRows.length === 0) {
      return {
        tableId,
        rounds: [],
        foodSubtotal: 0,
        gst: 0,
        restaurantCharge: 0,
        grandTotal: 0,
        latestOrderId: null,
      }
    }

    const orderIds = orderRows.map((order) => order.id as string)
    const { data: orderItems, error: itemsError } = await supabase
      .from(ORDER_ITEMS_TABLE)
      .select('order_id, menu_item_id, quantity')
      .in('order_id', orderIds)

    if (itemsError) {
      throw classifySupabaseError(itemsError, {
        table: ORDER_ITEMS_TABLE,
        operation: 'fetch table order items',
      })
    }

    const menuMap = getMenuItemMap(menu)
    const itemsByOrder = new Map<string, OrderLineDetail[]>()

    for (const line of orderItems ?? []) {
      const orderId = line.order_id as string
      const mapped = mapLines(
        [{ menu_item_id: line.menu_item_id as string, quantity: line.quantity as number }],
        menuMap,
      )
      const list = itemsByOrder.get(orderId) ?? []
      list.push(...mapped)
      itemsByOrder.set(orderId, list)
    }

    const rounds: TableBillRound[] = orderRows.map((order) => {
      const items = itemsByOrder.get(order.id as string) ?? []
      const subtotal = items.reduce((sum, line) => sum + line.price * line.quantity, 0)
      return {
        id: order.id as string,
        status: order.status as TableBillRound['status'],
        created_at: order.created_at as string,
        special_instructions: order.special_instructions as string | null,
        items,
        subtotal,
      }
    })

    const foodSubtotal = rounds.reduce((sum, round) => sum + round.subtotal, 0)
    const gst = foodSubtotal * GST_RATE
    const restaurantCharge = foodSubtotal > 0 ? RESTAURANT_CHARGE : 0
    const grandTotal = foodSubtotal + gst + restaurantCharge

    return {
      tableId,
      rounds,
      foodSubtotal,
      gst,
      restaurantCharge,
      grandTotal,
      latestOrderId: rounds[rounds.length - 1]?.id ?? null,
    }
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: ORDERS_TABLE, operation: 'fetch table bill' })
  }
}

export function calcCartTotals(subtotal: number): {
  subtotal: number
  gst: number
  restaurantCharge: number
  total: number
} {
  const gst = subtotal * GST_RATE
  return {
    subtotal,
    gst,
    restaurantCharge: RESTAURANT_CHARGE,
    total: subtotal + gst + RESTAURANT_CHARGE,
  }
}
