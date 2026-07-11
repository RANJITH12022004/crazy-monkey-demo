import { formatCompactInr, formatInr } from '@/lib/analytics'
import type { OwnerAnalytics, TrendPeriod } from '@/types/analytics'
import { RevenueTrendChart } from '@/components/owner/RevenueTrendChart'
import { CategoryDonutChart } from '@/components/owner/CategoryDonutChart'
import { PeakHoursChart } from '@/components/owner/PeakHoursChart'
import { TopItemsPanel } from '@/components/owner/TopItemsPanel'

interface ReportsPanelProps {
  analytics: OwnerAnalytics
  period: TrendPeriod
  onPeriodChange: (period: TrendPeriod) => void
}

const SUMMARY_ROWS: {
  label: string
  value: (analytics: OwnerAnalytics) => string
}[] = [
  { label: "Today's revenue", value: (a) => formatInr(a.kpis.todayRevenue) },
  { label: "Today's orders", value: (a) => String(a.kpis.todayOrderCount) },
  { label: 'Average order value', value: (a) => formatInr(a.kpis.averageOrderValue) },
  { label: '7-day revenue', value: (a) => formatInr(a.kpis.weekRevenue) },
  { label: '7-day orders', value: (a) => String(a.kpis.weekOrderCount) },
  { label: 'Month revenue', value: (a) => formatInr(a.kpis.monthRevenue) },
  { label: 'Month orders', value: (a) => String(a.kpis.monthOrderCount) },
  { label: 'Total revenue', value: (a) => formatInr(a.kpis.totalRevenue) },
  { label: 'Total orders', value: (a) => String(a.kpis.totalOrderCount) },
  { label: 'Items sold', value: (a) => String(a.kpis.itemsSold) },
  { label: 'Top seller', value: (a) => a.kpis.topItemName },
  { label: 'Top category', value: (a) => a.kpis.topCategoryName },
]

export function ReportsPanel({ analytics, period, onPeriodChange }: ReportsPanelProps) {
  return (
    <div className="space-y-xl">
      <div>
        <h2 className="text-[32px] font-bold tracking-tight text-on-background">
          Performance Reports
        </h2>
        <p className="mt-1 text-base text-on-surface-variant">
          Full analytics totals, trends, and category insights for Crazy Monkey.
        </p>
      </div>

      <section className="overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest shadow-sm">
        <div className="border-b border-outline-variant px-lg py-md">
          <h3 className="text-lg font-semibold text-on-background">Totals summary</h3>
          <p className="text-sm text-on-surface-variant">
            Every key metric in one place
            {analytics.usingMockData ? ' · sample data' : ` · ${analytics.orderCount} live orders`}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {SUMMARY_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-md border-b border-outline-variant/60 px-lg py-md last:border-b-0 sm:odd:border-r lg:[&:nth-child(3n)]:border-r-0 lg:border-r"
            >
              <span className="text-sm text-on-surface-variant">{row.label}</span>
              <span className="text-right text-sm font-bold text-on-background">
                {row.value(analytics)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RevenueTrendChart
            data={analytics.trend}
            period={period}
            onPeriodChange={onPeriodChange}
          />
        </div>
        <TopItemsPanel
          topByRevenue={analytics.topByRevenue}
          topByVolume={analytics.topByVolume}
        />
      </section>

      <section className="grid grid-cols-1 gap-lg lg:grid-cols-2">
        <CategoryDonutChart data={analytics.categoryBreakdown} />
        <PeakHoursChart data={analytics.peakHours} />
      </section>

      <section className="rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm">
        <h3 className="mb-md text-lg font-semibold text-on-background">Category revenue detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant text-on-surface-variant">
                <th className="py-sm pr-md font-semibold">Category</th>
                <th className="py-sm pr-md font-semibold">Revenue</th>
                <th className="py-sm font-semibold">Share</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categoryBreakdown.map((slice) => (
                <tr key={slice.category} className="border-b border-outline-variant/50">
                  <td className="py-sm pr-md font-medium text-on-surface">{slice.category}</td>
                  <td className="py-sm pr-md text-on-surface">{formatCompactInr(slice.revenue)}</td>
                  <td className="py-sm text-on-surface-variant">{slice.share}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
