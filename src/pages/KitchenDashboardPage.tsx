import { useCallback, useState } from 'react'
import { DataErrorPanel } from '@/components/DataErrorPanel'
import { CompletedHistory } from '@/components/kitchen/CompletedHistory'
import { KitchenBoard } from '@/components/kitchen/KitchenBoard'
import { KitchenLayout, type KitchenTab } from '@/components/kitchen/KitchenLayout'
import { OrderDetailPanel } from '@/components/kitchen/OrderDetailPanel'
import { useKitchenOrders } from '@/hooks/useKitchenOrders'
import { bumpOrder, nextKitchenAction, updateOrderStatus } from '@/lib/kitchenOrders'
import type { KitchenOrder } from '@/types/order'

export default function KitchenDashboardPage() {
  const { activeOrders, completedOrders, loading, error, refresh, newOrderPulse } =
    useKitchenOrders()
  const [activeTab, setActiveTab] = useState<KitchenTab>('live')
  const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null)

  const handleAction = useCallback(
    async (order: KitchenOrder) => {
      const action = nextKitchenAction(order.status)
      if (!action) return

      if (action.nextStatus === 'completed') {
        await bumpOrder(order.id)
      } else {
        await updateOrderStatus(order.id, action.nextStatus)
      }

      await refresh()
      if (selectedOrder?.id === order.id && action.nextStatus === 'completed') {
        setSelectedOrder(null)
      }
    },
    [refresh, selectedOrder],
  )

  return (
    <KitchenLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center text-kds-text/70">
          Loading kitchen board…
        </div>
      )}

      {!loading && error && <DataErrorPanel error={error} onRetry={() => void refresh()} />}

      {!loading && !error && activeTab === 'live' && (
        <>
          <KitchenBoard
            orders={activeOrders}
            onSelect={setSelectedOrder}
            onAction={(order) => void handleAction(order)}
            newOrderPulse={newOrderPulse}
          />
          {selectedOrder && (
            <OrderDetailPanel
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onUpdated={() => void refresh()}
            />
          )}
        </>
      )}

      {!loading && !error && activeTab === 'history' && (
        <CompletedHistory orders={completedOrders} />
      )}
    </KitchenLayout>
  )
}
