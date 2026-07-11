import { supabase } from '@/lib/supabase'
import { assertNonEmpty, classifySupabaseError, DataFetchError } from '@/lib/supabaseErrors'
import type { StockItem } from '@/types/stock'

const TABLE = 'stock_items'

export async function fetchStockItems(): Promise<StockItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, name, category, quantity, unit, threshold_low, last_updated')
      .order('category')
      .order('name')

    if (error) {
      throw classifySupabaseError(error, { table: TABLE, operation: 'select stock_items' })
    }

    const rows = assertNonEmpty(data, TABLE, 'supabase/migrations/002_stock_items.sql')

    return rows.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      threshold_low: Number(item.threshold_low),
    }))
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: TABLE, operation: 'select stock_items' })
  }
}

export async function updateStockQuantity(
  id: string,
  quantity: number,
): Promise<StockItem> {
  const safeQuantity = Math.max(0, quantity)

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        quantity: safeQuantity,
        last_updated: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, category, quantity, unit, threshold_low, last_updated')
      .single()

    if (error || !data) {
      throw classifySupabaseError(error ?? new Error('Failed to update stock'), {
        table: TABLE,
        operation: 'update stock_items',
      })
    }

    return {
      ...data,
      quantity: Number(data.quantity),
      threshold_low: Number(data.threshold_low),
    }
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: TABLE, operation: 'update stock_items' })
  }
}

export interface CreateStockItemInput {
  name: string
  category: string
  quantity: number
  unit: string
  threshold_low: number
}

export async function createStockItem(input: CreateStockItemInput): Promise<StockItem> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: input.name.trim(),
        category: input.category,
        quantity: Math.max(0, input.quantity),
        unit: input.unit.trim(),
        threshold_low: Math.max(0, input.threshold_low),
        last_updated: new Date().toISOString(),
      })
      .select('id, name, category, quantity, unit, threshold_low, last_updated')
      .single()

    if (error || !data) {
      throw classifySupabaseError(error ?? new Error('Failed to create stock item'), {
        table: TABLE,
        operation: 'insert stock_items',
      })
    }

    return {
      ...data,
      quantity: Number(data.quantity),
      threshold_low: Number(data.threshold_low),
    }
  } catch (error) {
    if (error instanceof DataFetchError) throw error
    throw classifySupabaseError(error, { table: TABLE, operation: 'insert stock_items' })
  }
}
