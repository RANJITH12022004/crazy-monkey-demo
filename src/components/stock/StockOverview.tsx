import { useMemo, useState } from 'react'
import {
  CATEGORY_ICONS,
  STOCK_CATEGORIES,
  formatLastUpdated,
  type StockCategory,
  type StockItemRow,
} from '@/types/stock'
import { StockStatusBadge } from '@/components/stock/StockStatusBadge'

interface StockOverviewProps {
  items: StockItemRow[]
  onEditItem: (item: StockItemRow) => void
}

export function StockOverview({ items, onEditItem }: StockOverviewProps) {
  const [categoryFilter, setCategoryFilter] = useState<StockCategory | 'All'>('All')
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
      const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [items, categoryFilter, search])

  return (
    <div>
      <div className="mb-lg flex flex-col items-start justify-between gap-md sm:flex-row sm:items-center">
        <div>
          <h2 className="text-[32px] font-bold tracking-tight text-primary">Stock Overview</h2>
          <p className="mt-1 text-base text-on-surface-variant">
            Manage and track kitchen inventory levels.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute top-1/2 left-sm -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search inventory..."
            className="h-10 w-full rounded-full border border-outline-variant bg-surface-container-lowest pr-sm pl-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-lg flex flex-wrap gap-sm">
        <button
          type="button"
          onClick={() => setCategoryFilter('All')}
          className={`flex items-center gap-xs rounded-full border px-md py-xs text-xs font-medium transition-colors ${
            categoryFilter === 'All'
              ? 'border-transparent bg-secondary-container text-on-secondary-container'
              : 'border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">filter_list</span>
          All Items
        </button>
        {STOCK_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setCategoryFilter(category)}
            className={`rounded-full border px-md py-xs text-xs font-medium transition-colors ${
              categoryFilter === category
                ? 'border-transparent bg-secondary-container text-on-secondary-container'
                : 'border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="px-md py-sm text-sm font-semibold whitespace-nowrap text-on-surface-variant">
                  Item Name
                </th>
                <th className="px-md py-sm text-sm font-semibold whitespace-nowrap text-on-surface-variant">
                  Category
                </th>
                <th className="px-md py-sm text-right text-sm font-semibold whitespace-nowrap text-on-surface-variant">
                  Quantity
                </th>
                <th className="px-md py-sm text-sm font-semibold whitespace-nowrap text-on-surface-variant">
                  Unit
                </th>
                <th className="px-md py-sm text-sm font-semibold whitespace-nowrap text-on-surface-variant">
                  Status
                </th>
                <th className="px-md py-sm text-sm font-semibold whitespace-nowrap text-on-surface-variant">
                  Last Updated
                </th>
                <th className="px-md py-sm text-center text-sm font-semibold whitespace-nowrap text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-md py-xl text-center text-on-surface-variant">
                    No items match your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-surface-container-low ${
                      item.status === 'out_of_stock' ? 'bg-error-container/20' : ''
                    }`}
                  >
                    <td className="px-md py-md">
                      <div className="flex items-center gap-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-container-high text-secondary">
                          <span className="material-symbols-outlined">
                            {CATEGORY_ICONS[item.category] ?? 'inventory_2'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                          <p className="text-xs text-on-surface-variant">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-on-surface-variant">{item.category}</td>
                    <td
                      className={`px-md py-md text-right text-sm font-semibold ${
                        item.status === 'out_of_stock' ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {item.quantity}
                    </td>
                    <td className="px-md py-md text-on-surface-variant">{item.unit}</td>
                    <td className="px-md py-md">
                      <StockStatusBadge status={item.status} />
                    </td>
                    <td className="px-md py-md text-xs text-on-surface-variant">
                      {formatLastUpdated(item.last_updated)}
                    </td>
                    <td className="px-md py-md text-center">
                      <button
                        type="button"
                        onClick={() => onEditItem(item)}
                        className="rounded-full p-xs text-on-surface-variant transition-colors hover:bg-primary-fixed hover:text-primary"
                        aria-label={`Edit ${item.name}`}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-outline-variant px-md py-sm text-xs text-on-surface-variant">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>
    </div>
  )
}
