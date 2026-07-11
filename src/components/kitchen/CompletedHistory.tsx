import { formatTableLabel } from '@/constants/branding'
import type { KitchenOrder } from '@/types/order'

interface CompletedHistoryProps {
  orders: KitchenOrder[]
}

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CompletedHistory({ orders }: CompletedHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-kds-border bg-kds-surface p-xl text-center text-kds-text/70">
        No completed orders yet today.
      </div>
    )
  }

  return (
    <div className="space-y-md">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-xl border border-kds-border bg-kds-surface p-md"
        >
          <div className="flex items-center justify-between gap-md">
            <div>
              <p className="font-bold text-white">{formatTableLabel(order.table_id)}</p>
              <p className="text-sm text-kds-text/70">Completed at {formatTime(order.created_at)}</p>
            </div>
            <span className="rounded-full bg-kds-card px-md py-1 text-xs font-bold text-kds-text uppercase">
              Bumped
            </span>
          </div>
          <p className="mt-md text-sm text-kds-text">
            {order.items.map((line) => `${line.name} ×${line.quantity}`).join(' · ')}
          </p>
        </article>
      ))}
    </div>
  )
}
