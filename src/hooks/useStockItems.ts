import { useCallback, useEffect, useState } from 'react'
import { fetchStockItems } from '@/lib/stock'
import { subscribeToStockItems } from '@/lib/realtime'
import { DataFetchError, normalizeFetchError } from '@/lib/supabaseErrors'
import { toStockRow, type StockItemRow } from '@/types/stock'

export function useStockItems() {
  const [items, setItems] = useState<StockItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DataFetchError | null>(null)

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true)
    setError(null)
    try {
      const data = await fetchStockItems()
      setItems(data.map(toStockRow))
    } catch (err) {
      setError(normalizeFetchError(err, { table: 'stock_items', operation: 'load stock dashboard' }))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const unsubscribe = subscribeToStockItems(() => {
      void refresh({ silent: true })
    })
    return unsubscribe
  }, [refresh])

  const upsertItem = useCallback((updated: StockItemRow) => {
    setItems((current) => {
      const exists = current.some((item) => item.id === updated.id)
      const next = exists
        ? current.map((item) => (item.id === updated.id ? updated : item))
        : [...current, updated]
      return next.sort((a, b) =>
        a.category === b.category
          ? a.name.localeCompare(b.name)
          : a.category.localeCompare(b.category),
      )
    })
  }, [])

  return { items, loading, error, refresh, upsertItem }
}
