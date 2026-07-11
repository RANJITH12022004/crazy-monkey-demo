import { useEffect, useMemo, useState } from 'react'
import { updateStockQuantity } from '@/lib/stock'
import {
  ADJUSTMENT_REASONS,
  toStockRow,
  type AdjustmentReason,
  type StockItemRow,
} from '@/types/stock'
import { QuantityStepper } from '@/components/shared/QuantityStepper'

interface ManualStockUpdateProps {
  items: StockItemRow[]
  preselectedItemId?: string | null
  onUpdated: (item: StockItemRow) => void
  onCancel?: () => void
}

export function ManualStockUpdate({
  items,
  preselectedItemId,
  onUpdated,
  onCancel,
}: ManualStockUpdateProps) {
  const [selectedId, setSelectedId] = useState<string>(preselectedItemId ?? items[0]?.id ?? '')
  const [adjustment, setAdjustment] = useState(0)
  const [reason, setReason] = useState<AdjustmentReason | ''>('')
  const [notes, setNotes] = useState('')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (preselectedItemId) {
      setSelectedId(preselectedItemId)
      setAdjustment(0)
      setReason('')
      setNotes('')
      setError(null)
    }
  }, [preselectedItemId])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, search])

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0]
  const projectedStock = selectedItem
    ? Math.max(0, selectedItem.quantity + adjustment)
    : 0

  const handleSelect = (item: StockItemRow) => {
    setSelectedId(item.id)
    setSearch(item.name)
    setAdjustment(0)
    setReason('')
    setNotes('')
    setError(null)
  }

  const handleSave = async () => {
    if (!selectedItem) return
    if (!reason) {
      setError('Please select a reason for this update.')
      return
    }
    if (adjustment === 0) {
      setError('Adjustment quantity cannot be zero.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const updated = await updateStockQuantity(selectedItem.id, projectedStock)
      onUpdated(toStockRow(updated))
      setAdjustment(0)
      setReason('')
      setNotes('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stock')
    } finally {
      setSaving(false)
    }
  }

  if (!selectedItem) {
    return (
      <p className="text-on-surface-variant">
        No stock items found. Run the Supabase migration to seed data.
      </p>
    )
  }

  return (
    <div>
      <div className="mb-lg">
        <h1 className="mb-xs text-[32px] font-bold text-on-background">Manual Stock Update</h1>
        <p className="text-base text-on-surface-variant">
          Adjust inventory levels for specific items.
        </p>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm">
        <div className="mb-xl">
          <label className="mb-sm block text-sm font-semibold text-on-surface">Select Item</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute top-1/2 left-sm -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={search || selectedItem.name}
              onChange={(event) => {
                setSearch(event.target.value)
                const match = items.find((item) =>
                  item.name.toLowerCase().includes(event.target.value.toLowerCase()),
                )
                if (match) setSelectedId(match.id)
              }}
              onFocus={() => setSearch(selectedItem.name)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-sm pr-sm pl-10 text-lg text-on-surface transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          {search && filteredItems.length > 1 && (
            <ul className="mt-sm max-h-48 overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest">
              {filteredItems.slice(0, 8).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center justify-between px-md py-sm text-left text-sm hover:bg-surface-container-low"
                  >
                    <span className="font-medium text-on-surface">{item.name}</span>
                    <span className="text-on-surface-variant">{item.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-xl grid grid-cols-1 gap-xl md:grid-cols-2">
          <div className="flex flex-col justify-center rounded-lg bg-surface-container p-md">
            <span className="mb-xs text-xs font-medium tracking-wider text-on-surface-variant uppercase">
              Current Stock
            </span>
            <div className="flex items-baseline gap-sm">
              <span className="text-[32px] font-bold text-on-surface">{selectedItem.quantity}</span>
              <span className="text-base text-on-surface-variant">{selectedItem.unit}</span>
            </div>
          </div>

          <div>
            <label className="mb-sm block text-sm font-semibold text-on-surface">
              Adjustment Quantity
            </label>
            <QuantityStepper
              size="large"
              value={adjustment}
              min={-selectedItem.quantity}
              max={999}
              onChange={setAdjustment}
              ariaLabel="Stock adjustment amount"
            />
            <p className="mt-sm text-xs text-on-surface-variant">
              New projected stock:{' '}
              <span className="font-bold text-on-surface">
                {projectedStock} {selectedItem.unit}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-xl grid grid-cols-1 gap-xl md:grid-cols-2">
          <div>
            <label className="mb-sm block text-sm font-semibold text-on-surface">
              Reason for Update
            </label>
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value as AdjustmentReason | '')}
              className="h-14 w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-surface p-sm text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="">Select a reason...</option>
              {ADJUSTMENT_REASONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-sm block text-sm font-semibold text-on-surface">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add details..."
              className="h-14 w-full rounded-lg border border-outline-variant bg-surface p-sm text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="mb-md text-sm text-on-surface-variant" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-md border-t border-outline-variant pt-lg">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-14 min-w-[120px] rounded-lg border border-outline px-xl py-sm text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="h-14 min-w-[200px] rounded-lg bg-primary px-xl py-sm text-sm font-semibold text-on-primary shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Updating…' : 'Update Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
