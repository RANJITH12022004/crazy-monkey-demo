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
    <div className="mx-auto max-w-xl rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-lg shadow-sm">
      <h2 className="text-2xl font-bold text-on-surface">Add Stock Item</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Create a new inventory row for the kitchen demo.
      </p>

      <form className="mt-lg space-y-md" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block">
          <span className="text-sm font-semibold text-on-surface">Item name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-sm w-full rounded-lg border border-outline-variant bg-surface px-md py-sm text-on-surface"
            placeholder="e.g. Chipotle Sauce"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-on-surface">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as StockCategory)}
            className="mt-sm w-full rounded-lg border border-outline-variant bg-surface px-md py-sm text-on-surface"
          >
            {STOCK_CATEGORIES.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-on-surface">Quantity</span>
            <input
              type="number"
              min={0}
              step="0.1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="mt-sm w-full rounded-lg border border-outline-variant bg-surface px-md py-sm text-on-surface"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-on-surface">Unit</span>
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              className="mt-sm w-full rounded-lg border border-outline-variant bg-surface px-md py-sm text-on-surface"
            >
              {UNITS.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-on-surface">Low threshold</span>
            <input
              type="number"
              min={0}
              step="0.1"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="mt-sm w-full rounded-lg border border-outline-variant bg-surface px-md py-sm text-on-surface"
            />
          </label>
        </div>

        {error && (
          <p className="rounded-lg bg-error-container px-md py-sm text-sm text-on-error-container">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-sm pt-sm">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-lg py-sm text-sm font-bold text-on-primary disabled:opacity-60"
          >
            {saving ? 'Creating…' : 'Create item'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-outline-variant px-lg py-sm text-sm font-semibold text-on-surface"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
