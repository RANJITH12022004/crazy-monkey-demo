import { CHART_TOP_REVENUE, CHART_TOP_VOLUME, formatCompactInr } from '@/lib/analytics'
import type { RankedItem } from '@/types/analytics'

function RankedList({
  title,
  icon,
  items,
  valueFormatter,
  barColor,
  iconColor,
}: {
  title: string
  icon: string
  items: RankedItem[]
  valueFormatter: (value: number) => string
  barColor: string
  iconColor: string
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mb-md flex items-center gap-sm text-xl font-semibold text-on-background">
        <span className="material-symbols-outlined text-xl" style={{ color: iconColor }}>
          {icon}
        </span>
        {title}
      </h3>
      <div className="space-y-sm">
        {items.map((item) => (
          <div key={item.name}>
            <div className="mb-xs flex justify-between text-xs font-medium">
              <span className="text-on-background">{item.name}</span>
              <span className="text-on-surface-variant">{valueFormatter(item.value)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-container-high">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${Math.max(item.share, 8)}%`,
                  backgroundColor: barColor,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TopItemsPanel({
  topByRevenue,
  topByVolume,
}: {
  topByRevenue: RankedItem[]
  topByVolume: RankedItem[]
}) {
  return (
    <div className="flex flex-col gap-lg rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm">
      <RankedList
        title="Top by Revenue"
        icon="military_tech"
        items={topByRevenue}
        valueFormatter={formatCompactInr}
        barColor={CHART_TOP_REVENUE}
        iconColor={CHART_TOP_REVENUE}
      />
      <hr className="border-outline-variant" />
      <RankedList
        title="Top by Volume"
        icon="leaderboard"
        items={topByVolume}
        valueFormatter={(value) => `${value} qty`}
        barColor={CHART_TOP_VOLUME}
        iconColor={CHART_TOP_VOLUME}
      />
    </div>
  )
}
