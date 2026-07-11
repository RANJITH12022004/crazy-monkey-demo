import { useState } from 'react'
import { DataErrorPanel } from '@/components/DataErrorPanel'
import { OwnerLayout, type OwnerView } from '@/components/owner/OwnerLayout'
import { KpiCards } from '@/components/owner/KpiCards'
import { RevenueTrendChart } from '@/components/owner/RevenueTrendChart'
import { TopItemsPanel } from '@/components/owner/TopItemsPanel'
import { CategoryDonutChart } from '@/components/owner/CategoryDonutChart'
import { PeakHoursChart } from '@/components/owner/PeakHoursChart'
import { ReportsPanel } from '@/components/owner/ReportsPanel'
import { DevToolsPanel } from '@/components/owner/DevToolsPanel'
import { useOwnerAnalytics } from '@/hooks/useOwnerAnalytics'
import type { TrendPeriod } from '@/types/analytics'

export default function OwnerDashboardPage() {
  const [period, setPeriod] = useState<TrendPeriod>('daily')
  const [activeView, setActiveView] = useState<OwnerView>('overview')
  const { analytics, loading, error, resetting, resetDemo, liveOrderCount, refresh } =
    useOwnerAnalytics(period)

  return (
    <OwnerLayout activeView={activeView} onViewChange={setActiveView}>
      <div className="space-y-xl p-margin-mobile pb-24 md:p-margin-desktop md:pb-margin-desktop">
        {activeView === 'overview' && (
          <div className="hidden md:flex md:items-end md:justify-between">
            <div>
              <h2 className="text-[32px] font-bold tracking-tight text-on-background">Overview</h2>
              <p className="text-base text-on-surface-variant">
                Today&apos;s snapshot and full totals for Crazy Monkey.
              </p>
            </div>
            {!analytics.usingMockData && liveOrderCount > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-md py-xs text-xs font-semibold text-on-secondary-container">
                <span className="h-2 w-2 animate-pulse rounded-full bg-stock-in" />
                Live — {liveOrderCount} orders · updates in realtime
              </span>
            )}
            {analytics.usingMockData && (
              <span className="rounded-full bg-secondary-container px-md py-xs text-xs font-semibold text-on-secondary-container">
                Sample data — charts ready for pitch
              </span>
            )}
          </div>
        )}

        {loading && (
          <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
            Loading analytics…
          </div>
        )}

        {!loading && error && (
          <DataErrorPanel error={error} onRetry={() => void refresh()} />
        )}

        {!loading && !error && activeView === 'overview' && (
          <>
            <KpiCards kpis={analytics.kpis} />

            <section className="grid grid-cols-1 gap-lg lg:grid-cols-3">
              <div className="min-w-0 lg:col-span-2">
                <RevenueTrendChart
                  data={analytics.trend}
                  period={period}
                  onPeriodChange={setPeriod}
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

            <DevToolsPanel
              usingMockData={analytics.usingMockData}
              liveOrderCount={liveOrderCount}
              resetting={resetting}
              onReset={() => void resetDemo()}
            />
          </>
        )}

        {!loading && !error && activeView === 'reports' && (
          <ReportsPanel
            analytics={analytics}
            period={period}
            onPeriodChange={setPeriod}
          />
        )}
      </div>
    </OwnerLayout>
  )
}
