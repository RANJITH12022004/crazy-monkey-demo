import { useCallback, useMemo, useState } from 'react'
import { DataErrorPanel } from '@/components/DataErrorPanel'
import { useStockItems } from '@/hooks/useStockItems'
import { StockLayout } from '@/components/stock/StockLayout'
import { StockOverview } from '@/components/stock/StockOverview'
import { LowStockAlerts } from '@/components/stock/LowStockAlerts'
import { ManualStockUpdate } from '@/components/stock/ManualStockUpdate'
import { CreateStockItem } from '@/components/stock/CreateStockItem'
import { Toast } from '@/components/stock/Toast'
import type { StockItemRow, StockView } from '@/types/stock'

export default function StockDashboardPage() {
  const { items, loading, error, refresh, upsertItem } = useStockItems()
  const [activeView, setActiveView] = useState<StockView>('overview')
  const [preselectedItemId, setPreselectedItemId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const alertCount = useMemo(
    () => items.filter((item) => item.status !== 'in_stock').length,
    [items],
  )

  const handleEditItem = useCallback((item: StockItemRow) => {
    setPreselectedItemId(item.id)
    setActiveView('manual')
  }, [])

  const handleReorder = useCallback((item: StockItemRow, quantity: number) => {
    setToast(
      `Reorder logged for ${item.name} (${quantity} ${item.unit}) — demo only, no supplier contacted.`,
    )
  }, [])

  const handleUpdated = useCallback(
    (item: StockItemRow) => {
      upsertItem(item)
      setToast(`${item.name} updated to ${item.quantity} ${item.unit}.`)
      setActiveView('overview')
      setPreselectedItemId(null)
    },
    [upsertItem],
  )

  const handleCreated = useCallback(
    (item: StockItemRow) => {
      upsertItem(item)
      setToast(`${item.name} added to inventory.`)
      setActiveView('overview')
    },
    [upsertItem],
  )

  return (
    <>
      <StockLayout
        activeView={activeView}
        onViewChange={setActiveView}
        alertCount={alertCount}
      >
        {loading && (
          <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
            Loading inventory…
          </div>
        )}

        {!loading && error && (
          <DataErrorPanel error={error} onRetry={() => void refresh()} />
        )}

        {!loading && !error && (
          <>
            {activeView === 'overview' && items.length > 0 && (
              <StockOverview items={items} onEditItem={handleEditItem} />
            )}
            {activeView === 'overview' && items.length === 0 && (
              <p className="text-on-surface-variant">No stock items yet. Add one to get started.</p>
            )}
            {activeView === 'alerts' && (
              <LowStockAlerts items={items} onReorder={handleReorder} />
            )}
            {activeView === 'manual' && (
              <ManualStockUpdate
                items={items}
                preselectedItemId={preselectedItemId}
                onUpdated={handleUpdated}
                onCancel={() => {
                  setActiveView('overview')
                  setPreselectedItemId(null)
                }}
              />
            )}
            {activeView === 'create' && (
              <CreateStockItem
                onCreated={handleCreated}
                onCancel={() => setActiveView('overview')}
              />
            )}
          </>
        )}
      </StockLayout>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  )
}
