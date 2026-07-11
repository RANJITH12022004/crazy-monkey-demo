import { useCallback, useEffect, useState } from 'react'
import { fetchAllMenu } from '@/lib/menu'
import { classifySupabaseError, DataFetchError } from '@/lib/supabaseErrors'
import type { MenuItemRow } from '@/types/menu'

export function useMenuItems() {
  const [items, setItems] = useState<MenuItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DataFetchError | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllMenu()
      setItems(data)
    } catch (err) {
      setError(err instanceof DataFetchError ? err : classifySupabaseError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { items, loading, error, refresh }
}
