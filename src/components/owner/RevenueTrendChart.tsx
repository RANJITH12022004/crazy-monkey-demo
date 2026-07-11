import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_PRIMARY, formatCompactInr } from '@/lib/analytics'
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

export function RevenueTrendChart({ data, period, onPeriodChange }: RevenueTrendChartProps) {
  return (
    <div className="flex min-h-[400px] flex-col rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm">
      <div className="mb-lg flex flex-col justify-between gap-md sm:flex-row sm:items-center">
        <h3 className="text-xl font-semibold text-on-background">Revenue Trends</h3>
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

      <div className="h-[300px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0.02} />
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
              formatter={(value) => formatCompactInr(Number(value))}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #c3c6d0',
                background: '#ffffff',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={CHART_PRIMARY}
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
