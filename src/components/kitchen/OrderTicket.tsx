import { isUrgentOrder, useElapsed } from '@/hooks/useElapsed'
import { nextKitchenAction } from '@/lib/kitchenOrders'
import { formatTableLabel } from '@/constants/branding'
import type { KitchenOrder } from '@/types/order'

interface OrderTicketProps {
  order: KitchenOrder
  onSelect: (order: KitchenOrder) => void
  onAction: (order: KitchenOrder) => void
}

const STATUS_STYLES = {
  received: 'border-kds-new',
  preparing: 'border-kds-prep',
  ready: 'border-kds-new',
} as const

export function OrderTicket({ order, onSelect, onAction }: OrderTicketProps) {
  const elapsed = useElapsed(order.created_at)
  const action = nextKitchenAction(order.status)
  const urgent = isUrgentOrder(order.created_at, order.status)

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-kds-surface ${STATUS_STYLES[order.status as keyof typeof STATUS_STYLES] ?? 'border-kds-border'}`}
    >
      {urgent && <div className="kds-urgent-blink h-1 bg-kds-urgent" />}
      <button
        type="button"
        onClick={() => onSelect(order)}
        className="w-full p-md text-left"
      >
        <div className="flex items-center justify-between gap-sm">
          <div>
            <p className="text-lg font-bold text-white">{formatTableLabel(order.table_id)}</p>
            {urgent && (
              <span className="text-xs font-bold tracking-wide text-kds-urgent uppercase">
                Urgent
              </span>
            )}
          </div>
          <span className="rounded bg-kds-card px-2 py-1 font-mono text-sm text-white">{elapsed}</span>
        </div>
        <ul className="mt-md space-y-2">
          {order.items.map((line) => (
            <li key={line.menu_item_id} className="flex items-center justify-between text-sm text-kds-text">
              <span>{line.name}</span>
              <span className="rounded bg-kds-card px-2 py-0.5 font-bold text-white">
                ×{line.quantity}
              </span>
            </li>
          ))}
        </ul>
        {order.special_instructions && (
          <p className="mt-md rounded bg-kds-card px-sm py-1 text-xs text-kds-prep">
            {order.special_instructions}
          </p>
        )}
      </button>
      {action && (
        <button
          type="button"
          onClick={() => onAction(order)}
          className="w-full border-t border-kds-border bg-kds-card py-md text-sm font-bold tracking-wide text-white uppercase hover:bg-kds-border"
        >
          {action.label}
        </button>
      )}
    </article>
  )
}
