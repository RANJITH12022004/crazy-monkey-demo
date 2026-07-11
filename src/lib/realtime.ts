import { supabase } from '@/lib/supabase'

type ChangeHandler = () => void

export function subscribeToOrders(onChange: ChangeHandler): () => void {
  const channel = supabase
    .channel('orders-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      () => onChange(),
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'order_items' },
      () => onChange(),
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}

export function subscribeToStockItems(onChange: ChangeHandler): () => void {
  const channel = supabase
    .channel('stock-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'stock_items' },
      () => onChange(),
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}
