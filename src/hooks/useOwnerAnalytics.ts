import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMockAnalytics } from '@/data/mockAnalytics'
import {
  MIN_ORDERS_FOR_LIVE_DATA,
  buildAnalytics,
} from '@/lib/analytics'
import { DataFetchError, normalizeFetchError } from '@/lib/supabaseErrors'
import { fetchOrdersWithItems, resetDemoOrders } from '@/lib/orders'
import { subscribeToOrders } from '@/lib/realtime'
import type { OwnerAnalytics, TrendPeriod } from '@/types/analytics'

export function useOwnerAnalytics(period: TrendPeriod) {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof fetchOrdersWithItems>>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DataFetchError | null>(null)
  const [resetting, setResetting] = useState(false)

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true)
    setError(null)
    try {
      const data = await fetchOrdersWithItems()
      setOrders(data)
    } catch (err) {
      setError(normalizeFetchError(err, { table: 'orders', operation: 'load owner analytics' }))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const unsubscribe = subscribeToOrders(() => {
      void refresh({ silent: true })
    })
    return unsubscribe
  }, [refresh])

  const analytics: OwnerAnalytics = useMemo(() => {
    const hasEnoughLiveData = orders.length >= MIN_ORDERS_FOR_LIVE_DATA
    if (!hasEnoughLiveData) {
      return getMockAnalytics(period)
    }
    return buildAnalytics(orders, period, false)
  }, [orders, period])

  const resetDemo = useCallback(async () => {
    setResetting(true)
    setError(null)
    try {
      await resetDemoOrders()
      await refresh()
    } catch (err) {
      setError(normalizeFetchError(err, { table: 'orders', operation: 'reset demo orders' }))
    } finally {
      setResetting(false)
    }
  }, [refresh])

  return {
    analytics,
    loading,
    error,
    resetting,
    refresh,
    resetDemo,
    liveOrderCount: orders.length,
  }
}
