import { formatInr } from '@/lib/analytics'
import type { KpiMetrics } from '@/types/analytics'

const KPI_CONFIG: {
  key: keyof KpiMetrics
  label: string
  icon: string
  format: (value: KpiMetrics[keyof KpiMetrics]) => string
  hint: string
}[] = [
  {
    key: 'todayRevenue',
    label: "Today's Revenue",
    icon: 'payments',
    format: (value) => formatInr(Number(value)),
    hint: 'Pay at counter orders',
  },
  {
    key: 'todayOrderCount',
    label: "Today's Orders",
    icon: 'receipt_long',
    format: (value) => String(value),
    hint: 'Orders placed today',
  },
  {
    key: 'averageOrderValue',
    label: 'Avg Order Value',
    icon: 'shopping_cart',
    format: (value) => formatInr(Number(value)),
    hint: 'Today only',
  },
  {
    key: 'weekRevenue',
    label: '7-Day Revenue',
    icon: 'calendar_view_week',
    format: (value) => formatInr(Number(value)),
    hint: 'Last 7 days',
  },
  {
    key: 'weekOrderCount',
    label: '7-Day Orders',
    icon: 'event_note',
    format: (value) => String(value),
    hint: 'Last 7 days',
  },
  {
    key: 'monthRevenue',
    label: 'Month Revenue',
    icon: 'calendar_month',
    format: (value) => formatInr(Number(value)),
    hint: 'This calendar month',
  },
  {
    key: 'monthOrderCount',
    label: 'Month Orders',
    icon: 'date_range',
    format: (value) => String(value),
    hint: 'This calendar month',
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: 'account_balance_wallet',
    format: (value) => formatInr(Number(value)),
    hint: 'All tracked orders',
  },
  {
    key: 'totalOrderCount',
    label: 'Total Orders',
    icon: 'inventory',
    format: (value) => String(value),
    hint: 'All tracked orders',
  },
  {
    key: 'itemsSold',
    label: 'Items Sold',
    icon: 'restaurant',
    format: (value) => String(value),
    hint: 'Total menu units',
  },
  {
    key: 'topItemName',
    label: 'Top Seller',
    icon: 'military_tech',
    format: (value) => String(value),
    hint: 'By quantity sold',
  },
  {
    key: 'topCategoryName',
    label: 'Top Category',
    icon: 'category',
    format: (value) => String(value),
    hint: 'By revenue share',
  },
]

export function KpiCards({ kpis }: { kpis: KpiMetrics }) {
  return (
    <section className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {KPI_CONFIG.map((card) => (
        <div
          key={card.key}
          className="flex flex-col justify-between rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm"
        >
          <div className="mb-md flex items-start justify-between gap-sm">
            <p className="text-sm font-semibold text-on-surface-variant">{card.label}</p>
            <span className="material-symbols-outlined shrink-0 rounded-lg bg-primary/10 p-sm text-primary">
              {card.icon}
            </span>
          </div>
          <div>
            <h3 className="truncate text-[22px] font-bold text-on-background md:text-[26px]">
              {card.format(kpis[card.key])}
            </h3>
            <p className="mt-xs text-xs font-medium text-on-surface-variant">{card.hint}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
