import { EmptyColumn } from '@/components/kitchen/EmptyColumn'
import { OrderTicket } from '@/components/kitchen/OrderTicket'
import type { KitchenOrder } from '@/types/order'

interface KitchenBoardProps {
  orders: KitchenOrder[]
  onSelect: (order: KitchenOrder) => void
  onAction: (order: KitchenOrder) => void
  newOrderPulse?: boolean
}

const COLUMNS = [
  { status: 'received', title: 'New Orders', empty: 'No new orders right now.' },
  { status: 'preparing', title: 'Preparing', empty: 'Nothing in the kitchen queue.' },
  { status: 'ready', title: 'Ready for Pickup', empty: 'No orders waiting for pickup.' },
] as const

export function KitchenBoard({
  orders,
  onSelect,
  onAction,
  newOrderPulse = false,
}: KitchenBoardProps) {
  return (
    <div className="grid gap-md lg:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnOrders = orders.filter((order) => order.status === column.status)
        const pulse = column.status === 'received' && newOrderPulse
        return (
          <section
            key={column.status}
            className={`flex min-h-[60vh] flex-col rounded-xl border bg-kds-card/40 p-md ${
              pulse
                ? 'kds-new-pulse border-kds-new'
                : 'border-kds-border'
            }`}
          >
            <header className="mb-md flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                {column.title}
                {pulse && (
                  <span className="ml-2 rounded bg-kds-new px-2 py-0.5 text-[10px] text-white">
                    NEW
                  </span>
                )}
              </h2>
              <span className="rounded-full bg-kds-surface px-2 py-0.5 text-xs font-bold text-kds-text">
                {columnOrders.length}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-md overflow-y-auto">
              {columnOrders.length === 0 ? (
                <EmptyColumn message={column.empty} />
              ) : (
                columnOrders.map((order) => (
                  <OrderTicket
                    key={order.id}
                    order={order}
                    onSelect={onSelect}
                    onAction={onAction}
                  />
                ))
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
