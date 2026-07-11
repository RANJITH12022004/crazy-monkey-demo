import { Link, useParams } from 'react-router-dom'
import { CustomerBackLink } from '@/components/customer/OrderLayout'
import {
  formatCurrency,
  formatTableLabel,
  shortOrderId,
} from '@/constants/branding'
import { useOrderTracking } from '@/hooks/useOrderTracking'
import { DataErrorPanel } from '@/components/DataErrorPanel'
import type { OrderStatus } from '@/types/order'

const STEPS: Array<{ key: OrderStatus | 'served'; label: string }> = [
  { key: 'received', label: 'Order Received' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready to Serve' },
]

function stepIndex(status: OrderStatus): number {
  if (status === 'completed') return 2
  if (status === 'ready') return 2
  if (status === 'preparing') return 1
  return 0
}

function statusLabel(status: OrderStatus): string {
  if (status === 'received') return 'Received'
  if (status === 'preparing') return 'Preparing'
  if (status === 'ready') return 'Ready'
  return 'Completed'
}

export default function TrackOrderPage() {
  const { tableId = '', orderId = '' } = useParams()
  const { order, tableBill, loading, error, refresh } = useOrderTracking(orderId, tableId)
  const activeStep = order ? stepIndex(order.status) : 0

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-on-surface-variant">
        Loading order status…
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen px-margin-mobile py-xl">
        <DataErrorPanel error={error} onRetry={() => void refresh()} />
      </main>
    )
  }

  if (!order && (!tableBill || tableBill.rounds.length === 0)) {
    return (
      <main className="min-h-screen px-margin-mobile py-xl">
        <p className="text-on-surface-variant">Order not found.</p>
        <Link
          to={`/order/${tableId}/menu`}
          className="mt-md inline-flex text-sm font-semibold text-primary"
        >
          Back to menu
        </Link>
      </main>
    )
  }

  const rounds = tableBill?.rounds ?? []
  const bill = tableBill

  return (
    <main className="min-h-screen px-margin-mobile pb-margin-mobile pt-md">
      <CustomerBackLink to={`/order/${tableId}/menu`} label="Back to menu" />
      <h1 className="mt-md text-2xl font-bold text-primary">Order Tracking</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        {order ? `Latest #${shortOrderId(order.id)}` : 'Table bill'} ·{' '}
        {formatTableLabel(tableId)}
      </p>
      <p className="mt-sm text-sm text-on-surface-variant">Est. prep time: 15–20 min</p>

      {order && (
        <ol className="mt-xl space-y-lg">
          {STEPS.map((step, index) => {
            const done = index <= activeStep
            const active = index === activeStep
            return (
              <li key={step.key} className="flex items-start gap-md">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    done
                      ? 'bg-primary text-on-primary'
                      : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  {done ? (
                    <span className="material-symbols-outlined text-xl">check</span>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className={`font-bold ${active ? 'text-primary' : 'text-on-surface'}`}>
                    {step.label}
                  </p>
                  {active && order.status !== 'completed' && (
                    <p className="text-sm text-on-surface-variant">In progress…</p>
                  )}
                  {active && order.status === 'completed' && (
                    <p className="text-sm text-on-surface-variant">Enjoy your meal!</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}

      {rounds.length > 0 && (
        <section className="mt-xl space-y-md">
          <h2 className="text-lg font-bold text-on-surface">
            Table Bill · {rounds.length} round{rounds.length === 1 ? '' : 's'}
          </h2>
          {rounds.map((round, index) => (
            <article
              key={round.id}
              className="rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-md"
            >
              <div className="flex items-center justify-between gap-sm">
                <p className="font-bold text-on-surface">
                  Round {index + 1} · #{shortOrderId(round.id)}
                </p>
                <span className="rounded-full bg-surface-container px-2 py-0.5 text-xs font-semibold text-on-surface-variant">
                  {statusLabel(round.status)}
                </span>
              </div>
              <ul className="mt-sm space-y-1 text-sm text-on-surface-variant">
                {round.items.map((line) => (
                  <li key={`${round.id}-${line.menu_item_id}`} className="flex justify-between">
                    <span>
                      {line.name} × {line.quantity}
                    </span>
                    <span>{formatCurrency(line.price * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-sm text-right text-sm font-semibold text-on-surface">
                Round total {formatCurrency(round.subtotal)}
              </p>
            </article>
          ))}
        </section>
      )}

      {bill && bill.rounds.length > 0 && (
        <section className="mt-lg rounded-xl border border-outline-variant/50 bg-surface-container-low p-md">
          <h2 className="text-sm font-bold text-on-surface">Final Bill (Pay at Counter)</h2>
          <div className="mt-md space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Food subtotal</span>
              <span>{formatCurrency(bill.foodSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">GST (5%)</span>
              <span>{formatCurrency(bill.gst)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Restaurant Charges</span>
              <span>{formatCurrency(bill.restaurantCharge)}</span>
            </div>
            <div className="flex justify-between border-t border-outline-variant/50 pt-2 text-base font-bold">
              <span>To Pay</span>
              <span className="text-primary">{formatCurrency(bill.grandTotal)}</span>
            </div>
          </div>
          <p className="mt-sm text-xs text-on-surface-variant">
            Multiple orders from this table are combined into one bill. Restaurant charge applies once.
          </p>
        </section>
      )}

      <Link
        to={`/order/${tableId}/menu`}
        className="mt-lg flex w-full items-center justify-center gap-sm rounded-xl bg-primary px-lg py-md text-base font-bold text-on-primary"
      >
        <span className="material-symbols-outlined">add</span>
        Add more items
      </Link>

      <a
        href="tel:+919999999999"
        className="mt-md flex w-full items-center justify-center gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest px-lg py-md text-sm font-semibold text-primary"
      >
        <span className="material-symbols-outlined text-xl">support_agent</span>
        Need Help?
      </a>
    </main>
  )
}
