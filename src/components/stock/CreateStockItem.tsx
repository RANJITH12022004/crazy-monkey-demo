import { useState, type FormEvent } from 'react'
import { createStockItem } from '@/lib/stock'
import { classifySupabaseError } from '@/lib/supabaseErrors'
import {
  STOCK_CATEGORIES,
  toStockRow,
  type StockCategory,
  type StockItemRow,
} from '@/types/stock'

interface CreateStockItemProps {
  onCreated: (item: StockItemRow) => void
  onCancel: () => void
}

const UNITS = ['kg', 'L', 'pcs', 'packs', 'bags', 'tins', 'bottles', 'canisters']

export function CreateStockItem({ onCreated, onCancel }: CreateStockItemProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<StockCategory>('Dry Goods')
  const [unit, setUnit] = useState('kg')
  const [quantity, setQuantity] = useState(0)
  const [threshold, setThreshold] = useState(5)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Item name is required.')
      return
    }
    if (quantity < 0 || threshold < 0) {
      setError('Quantity and threshold must be zero or greater.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const created = await createStockItem({
        name: name.trim(),
        category,
        quantity,
        unit,
        threshold_low: threshold,
      })
      onCreated(toStockRow(created))
    } catch (err) {
      const classified = classifySupabaseError(err)
      setError(classified.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-lg">
        <h1 className="mb-xs text-[32px] font-bold text-on-background">Add New Item</h1>
        <p className="text-base text-on-surface-variant">
          Create a new inventory row for the kitchen demo.
        </p>
      </div>

      <form
        className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg shadow-sm"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <div className="mb-xl">
          <label className="mb-sm block text-sm font-semibold text-on-surface" htmlFor="stock-item-name">
            Item name
          </label>
          <input
            id="stock-item-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-14 w-full rounded-lg border border-outline-variant bg-surface px-md text-lg text-on-surface transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="e.g. Chipotle Sauce"
            required
            autoComplete="off"
          />
        </div>

        <div className="mb-xl">
          <label className="mb-sm block text-sm font-semibold text-on-surface" htmlFor="stock-item-category">
            Category
          </label>
          <select
            id="stock-item-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as StockCategory)}
            className="h-14 w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-surface px-md text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {STOCK_CATEGORIES.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-xl grid grid-cols-1 gap-xl md:grid-cols-3">
          <div>
            <label className="mb-sm block text-sm font-semibold text-on-surface" htmlFor="stock-item-qty">
              Quantity
            </label>
            <input
              id="stock-item-qty"
              type="number"
              min={0}
              step="0.1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="h-14 w-full rounded-lg border border-outline-variant bg-surface px-md text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-sm block text-sm font-semibold text-on-surface" htmlFor="stock-item-unit">
              Unit
            </label>
            <select
              id="stock-item-unit"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              className="h-14 w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-surface px-md text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {UNITS.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="mb-sm block text-sm font-semibold text-on-surface"
              htmlFor="stock-item-threshold"
            >
              Low threshold
            </label>
            <input
              id="stock-item-threshold"
              type="number"
              min={0}
              step="0.1"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="h-14 w-full rounded-lg border border-outline-variant bg-surface px-md text-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <p
            className="mb-md rounded-lg bg-error-container px-md py-sm text-sm text-on-error-container"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end gap-md border-t border-outline-variant pt-lg">
          <button
            type="button"
            onClick={onCancel}
            className="h-14 min-w-[120px] rounded-lg border border-outline px-xl py-sm text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-14 min-w-[200px] rounded-lg bg-primary px-xl py-sm text-sm font-semibold text-on-primary shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Creating…' : 'Create item'}
          </button>
        </div>
      </form>
    </div>
  )
}
