import { useState } from 'react'
import {
  CATEGORY_ICONS,
  SUPPLIER_NAMES,
  formatStockQuantity,
  type StockItemRow,
} from '@/types/stock'
import { QuantityStepper } from '@/components/shared/QuantityStepper'

interface LowStockAlertsProps {
  items: StockItemRow[]
  onReorder: (item: StockItemRow, quantity: number) => void
}

function getSuggestedReorder(item: StockItemRow): number {
  const shortfall = Math.max(0, item.threshold_low - item.quantity)
  return Math.max(Math.ceil(shortfall), Math.ceil(item.threshold_low))
}

export function LowStockAlerts({ items, onReorder }: LowStockAlertsProps) {
  const alertItems = items.filter(
    (item) => item.status === 'low_stock' || item.status === 'out_of_stock',
  )
  const [orderQty, setOrderQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(alertItems.map((item) => [item.id, getSuggestedReorder(item)])),
  )

  if (alertItems.length === 0) {
    return (
      <div>
        <h1 className="mb-xs text-[32px] font-bold text-on-surface">Low-Stock Alerts</h1>
        <p className="mb-lg text-base text-on-surface-variant">All items are adequately stocked.</p>
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center shadow-sm">
          <span className="material-symbols-outlined mb-md text-5xl text-stock-in">check_circle</span>
          <p className="text-lg font-semibold text-on-surface">Nothing to reorder right now</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-lg flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="mb-xs text-[32px] font-bold text-on-surface">Low-Stock Alerts</h1>
          <p className="text-base text-on-surface-variant">
            {alertItems.length} item{alertItems.length === 1 ? '' : 's'} require attention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md xl:grid-cols-2">
        {alertItems.map((item) => {
          const isCritical = item.status === 'out_of_stock'
          const shortfall = item.threshold_low - item.quantity
          const qty = orderQty[item.id] ?? getSuggestedReorder(item)

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl bg-surface p-md shadow-sm ${
                isCritical ? 'border-l-4 border-error' : 'border-l-4 border-tertiary-container'
              }`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-sm">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      isCritical
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-tertiary-container text-on-tertiary-container'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {CATEGORY_ICONS[item.category] ?? 'inventory_2'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-on-surface">{item.name}</h3>
                    <p className="text-xs text-on-surface-variant">
                      Supplier: {SUPPLIER_NAMES[item.category] ?? 'Local Vendor'}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                    isCritical
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-tertiary-container text-on-tertiary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isCritical ? 'warning' : 'error'}
                  </span>
                  {isCritical ? 'Critical' : 'Low'}
                </span>
              </div>

              <div
                className={`mb-lg grid grid-cols-3 gap-4 rounded-lg border p-sm ${
                  isCritical ? 'border-error/20 bg-surface-container-lowest' : 'border-tertiary-container/30 bg-surface-container-lowest'
                }`}
              >
                <div>
                  <p className="mb-1 text-xs text-on-surface-variant">Current Stock</p>
                  <p
                    className={`text-xl font-semibold ${
                      isCritical ? 'text-error' : 'text-tertiary-container'
                    }`}
                  >
                    {formatStockQuantity(item.quantity, item.unit)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-on-surface-variant">Min Threshold</p>
                  <p className="text-base text-on-surface">
                    {formatStockQuantity(item.threshold_low, item.unit)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-on-surface-variant">Shortfall</p>
                  <p
                    className={`text-xl font-semibold ${
                      isCritical ? 'text-error' : 'text-tertiary-container'
                    }`}
                  >
                    -{Math.max(0, shortfall).toFixed(shortfall % 1 === 0 ? 0 : 1)} {item.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-sm">
                <div className="flex-1">
                  <QuantityStepper
                    value={qty}
                    min={1}
                    max={999}
                    onChange={(value) =>
                      setOrderQty((current) => ({ ...current, [item.id]: value }))
                    }
                    ariaLabel={`Reorder quantity for ${item.name}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onReorder(item, qty)}
                  className={`h-12 flex-1 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 ${
                    isCritical
                      ? 'bg-primary text-on-primary'
                      : 'border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  Reorder
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
