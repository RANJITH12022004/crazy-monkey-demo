import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_PEAK_HIGH, CHART_PEAK_LOW, CHART_PEAK_MID } from '@/lib/analytics'
import type { PeakHourPoint } from '@/types/analytics'

export function PeakHoursChart({ data }: { data: PeakHourPoint[] }) {
  const maxOrders = Math.max(...data.map((point) => point.orders), 1)

  return (
    <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm">
      <h3 className="mb-1 text-xl font-semibold text-on-background">Peak Hours</h3>
      <p className="mb-lg text-sm text-on-surface-variant">
        Order volume by hour — lunch & dinner rush highlighted
      </p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e2e2e6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#43474f', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#43474f', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              formatter={(value) => [`${value} orders`, 'Volume']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #c3c6d0',
                background: '#ffffff',
              }}
            />
            <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
              {data.map((point) => (
                <Cell
                  key={point.hour}
                  fill={
                    point.orders >= maxOrders * 0.7
                      ? CHART_PEAK_HIGH
                      : point.orders >= maxOrders * 0.4
                        ? CHART_PEAK_MID
                        : CHART_PEAK_LOW
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-md flex flex-wrap gap-md text-xs text-on-surface-variant">
        <span className="inline-flex items-center gap-xs">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CHART_PEAK_HIGH }} />
          Peak
        </span>
        <span className="inline-flex items-center gap-xs">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CHART_PEAK_MID }} />
          Busy
        </span>
        <span className="inline-flex items-center gap-xs">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CHART_PEAK_LOW }} />
          Quiet
        </span>
      </div>
    </div>
  )
}
