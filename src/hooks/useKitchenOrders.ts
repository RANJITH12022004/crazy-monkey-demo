import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchActiveKitchenOrders,
  fetchCompletedKitchenOrders,
} from '@/lib/kitchenOrders'
import { playNewOrderChime } from '@/lib/kitchenSound'
import { subscribeToOrders } from '@/lib/realtime'
import { classifySupabaseError, DataFetchError } from '@/lib/supabaseErrors'
import type { KitchenOrder } from '@/types/order'

export function useKitchenOrders() {
  const [activeOrders, setActiveOrders] = useState<KitchenOrder[]>([])
  const [completedOrders, setCompletedOrders] = useState<KitchenOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DataFetchError | null>(null)
  const [newOrderPulse, setNewOrderPulse] = useState(false)
  const knownReceivedIds = useRef<Set<string> | null>(null)
  const pulseTimer = useRef<number | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const [active, completed] = await Promise.all([
        fetchActiveKitchenOrders(),
        fetchCompletedKitchenOrders(),
      ])

      const receivedIds = new Set(
        active.filter((order) => order.status === 'received').map((order) => order.id),
      )

      if (knownReceivedIds.current !== null) {
        let hasNew = false
        for (const id of receivedIds) {
          if (!knownReceivedIds.current.has(id)) {
            hasNew = true
            break
          }
        }
        if (hasNew) {
          playNewOrderChime()
          setNewOrderPulse(true)
          if (pulseTimer.current) window.clearTimeout(pulseTimer.current)
          pulseTimer.current = window.setTimeout(() => setNewOrderPulse(false), 2500)
        }
      }

      knownReceivedIds.current = receivedIds
      setActiveOrders(active)
      setCompletedOrders(completed)
    } catch (err) {
      setError(err instanceof DataFetchError ? err : classifySupabaseError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const unsubscribe = subscribeToOrders(() => {
      void refresh()
    })
    return () => {
      unsubscribe()
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current)
    }
  }, [refresh])

  return { activeOrders, completedOrders, loading, error, refresh, newOrderPulse }
}
