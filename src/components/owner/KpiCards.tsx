import { formatInr } from '@/lib/analytics'
import type { KpiMetrics } from '@/types/analytics'

const KPI_CONFIG = [
  {
    key: 'todayRevenue' as const,
    label: "Today's Revenue",
    icon: 'payments',
    format: (value: number) => formatInr(value),
    hint: 'Pay at counter orders',
  },
  {
    key: 'todayOrderCount' as const,
    label: 'Total Orders',
    icon: 'receipt_long',
    format: (value: number) => value.toString(),
    hint: 'Completed today',
  },
  {
    key: 'averageOrderValue' as const,
    label: 'Average Order Value',
    icon: 'shopping_cart',
    format: (value: number) => formatInr(value),
    hint: 'Today only',
  },
]

export function KpiCards({ kpis }: { kpis: KpiMetrics }) {
  return (
    <section className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
      {KPI_CONFIG.map((card) => (
        <div
          key={card.key}
          className="flex flex-col justify-between rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm"
        >
          <div className="mb-md flex items-start justify-between">
            <p className="text-sm font-semibold text-on-surface-variant">{card.label}</p>
            <span className="material-symbols-outlined rounded-lg bg-primary/10 p-sm text-primary">
              {card.icon}
            </span>
          </div>
          <div>
            <h3 className="text-[26px] font-bold text-on-background md:text-[32px]">
              {card.format(kpis[card.key])}
            </h3>
            <p className="mt-xs text-xs font-medium text-on-surface-variant">{card.hint}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
