import { bumpOrder, nextKitchenAction, updateOrderStatus } from '@/lib/kitchenOrders'
import { formatTableLabel } from '@/constants/branding'
import type { KitchenOrder } from '@/types/order'

interface OrderDetailPanelProps {
  order: KitchenOrder
  onClose: () => void
  onUpdated: () => void
}

export function OrderDetailPanel({ order, onClose, onUpdated }: OrderDetailPanelProps) {
  const action = nextKitchenAction(order.status)

  const handleAction = async () => {
    if (!action) return
    if (action.nextStatus === 'completed') {
      await bumpOrder(order.id)
    } else {
      await updateOrderStatus(order.id, action.nextStatus)
    }
    onUpdated()
    if (action.nextStatus === 'completed') onClose()
  }

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/50">
      <aside className="flex h-full w-full max-w-md flex-col bg-kds-surface shadow-2xl">
        <header className="flex items-center justify-between border-b border-kds-border p-md">
          <div>
            <p className="text-xs uppercase tracking-wide text-kds-text/70">Order Details</p>
            <h2 className="text-xl font-bold text-white">{formatTableLabel(order.table_id)}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-kds-border p-2 text-kds-text hover:bg-kds-card"
            aria-label="Close order details"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-md">
          <ul className="space-y-md">
            {order.items.map((line) => (
              <li key={line.menu_item_id} className="rounded-lg border border-kds-border bg-kds-card p-md">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">{line.name}</p>
                  <span className="text-sm text-kds-text">×{line.quantity}</span>
                </div>
              </li>
            ))}
          </ul>

          {order.special_instructions && (
            <div className="mt-lg rounded-lg border border-kds-prep/40 bg-kds-card p-md">
              <p className="text-xs font-bold tracking-wide text-kds-prep uppercase">
                Special Instructions
              </p>
              <p className="mt-sm text-sm text-white">{order.special_instructions}</p>
            </div>
          )}
        </div>

        {action && (
          <footer className="border-t border-kds-border p-md">
            <button
              type="button"
              onClick={() => void handleAction()}
              className="w-full rounded-lg bg-kds-new py-md text-sm font-bold tracking-wide text-white uppercase"
            >
              {action.label === 'BUMP' ? 'Bump Order' : action.label}
            </button>
          </footer>
        )}
      </aside>
    </div>
  )
}
