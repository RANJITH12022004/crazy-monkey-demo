import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_REVENUE, CHART_REVENUE_SOFT, formatCompactInr } from '@/lib/analytics'
import type { TrendPeriod, TrendPoint } from '@/types/analytics'

interface RevenueTrendChartProps {
  data: TrendPoint[]
  period: TrendPeriod
  onPeriodChange: (period: TrendPeriod) => void
}

const PERIODS: { value: TrendPeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const CHART_HEIGHT = 300

export function RevenueTrendChart({ data, period, onPeriodChange }: RevenueTrendChartProps) {
  const hasRevenue = data.some((point) => point.revenue > 0)

  return (
    <div className="flex min-h-[400px] min-w-0 flex-col rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm">
      <div className="mb-lg flex flex-col justify-between gap-md sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-on-background">Revenue Trends</h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            {period === 'daily' && 'Last 7 days'}
            {period === 'weekly' && 'Last 8 weeks'}
            {period === 'monthly' && 'Last 6 months'}
          </p>
        </div>
        <div className="flex rounded-lg border border-outline-variant bg-surface-container-low p-xs">
          {PERIODS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onPeriodChange(option.value)}
              className={`rounded px-sm py-xs text-xs font-semibold transition-colors ${
                period === option.value
                  ? 'bg-surface-container-lowest text-on-background shadow-sm'
                  : 'text-on-surface-variant hover:text-on-background'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed height — ResponsiveContainer % height collapses to 0 inside flex/grid */}
      <div className="w-full min-w-0" style={{ height: CHART_HEIGHT, minHeight: CHART_HEIGHT }}>
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT} minWidth={0}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_REVENUE_SOFT} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={CHART_REVENUE} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e2e6" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#43474f', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => formatCompactInr(Number(value))}
                tick={{ fill: '#43474f', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                formatter={(value) => [formatCompactInr(Number(value)), 'Revenue']}
                labelFormatter={(label) => String(label)}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #c3c6d0',
                  background: '#ffffff',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_REVENUE}
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg bg-surface-container-low text-sm text-on-surface-variant">
            No revenue in this period yet — place a few demo orders or reset demo data.
          </div>
        )}
      </div>
    </div>
  )
}
