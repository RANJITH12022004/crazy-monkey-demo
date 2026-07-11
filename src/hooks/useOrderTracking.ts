import { useCallback, useEffect, useState } from 'react'
import { fetchOrderForTracking, fetchTableBill } from '@/lib/customerOrders'
import { subscribeToOrders } from '@/lib/realtime'
import { classifySupabaseError, DataFetchError } from '@/lib/supabaseErrors'
import type { TableBill, TrackingOrder } from '@/types/order'

export function useOrderTracking(orderId: string | undefined, tableId: string | undefined) {
  const [order, setOrder] = useState<TrackingOrder | null>(null)
  const [tableBill, setTableBill] = useState<TableBill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DataFetchError | null>(null)

  const refresh = useCallback(async () => {
    if (!orderId && !tableId) {
      setOrder(null)
      setTableBill(null)
      setLoading(false)
      return
    }

    setError(null)
    try {
      const [tracked, bill] = await Promise.all([
        orderId ? fetchOrderForTracking(orderId) : Promise.resolve(null),
        tableId
          ? fetchTableBill(tableId)
          : Promise.resolve(null),
      ])
      setOrder(tracked)
      setTableBill(bill)
    } catch (err) {
      setError(err instanceof DataFetchError ? err : classifySupabaseError(err))
    } finally {
      setLoading(false)
    }
  }, [orderId, tableId])

  useEffect(() => {
    void refresh()
    const unsubscribe = subscribeToOrders(() => {
      void refresh()
    })
    return unsubscribe
  }, [refresh])

  return { order, tableBill, loading, error, refresh }
}
