import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCompactInr, getCategoryColor } from '@/lib/analytics'
import type { CategorySlice } from '@/types/analytics'

export function CategoryDonutChart({ data }: { data: CategorySlice[] }) {
  const chartData = data.filter((slice) => slice.revenue > 0)

  return (
    <div className="rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm">
      <h3 className="mb-lg text-xl font-semibold text-on-background">Category Performance</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height={280} minWidth={0}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={100}
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {chartData.map((slice) => (
                <Cell key={slice.category} fill={getCategoryColor(slice.category)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCompactInr(Number(value))}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #c3c6d0',
                background: '#ffffff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-md grid grid-cols-2 gap-sm">
        {data.map((slice) => (
          <div key={slice.category} className="flex items-center gap-sm text-xs">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: getCategoryColor(slice.category) }}
            />
            <span className="flex-1 text-on-surface">{slice.category}</span>
            <span className="font-semibold text-on-surface-variant">{slice.share}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
