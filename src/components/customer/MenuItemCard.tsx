import { formatCurrency } from '@/constants/branding'
import type { MenuItemRow } from '@/types/menu'

interface MenuItemCardProps {
  item: MenuItemRow
  quantity: number
  onAdd: () => void
  onQuantityChange: (quantity: number) => void
}

function placeholderIcon(item: MenuItemRow): string {
  if (item.cuisine === 'beverages') {
    if (item.name.toLowerCase().includes('espresso') || item.name.toLowerCase().includes('coffee')) {
      return 'local_cafe'
    }
    if (item.name.toLowerCase().includes('lassi') || item.name.toLowerCase().includes('chai')) {
      return 'blender'
    }
    return 'local_drink'
  }
  return 'restaurant'
}

export function MenuItemCard({ item, quantity, onAdd, onQuantityChange }: MenuItemCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-sm">
      <div className="h-36 w-full overflow-hidden bg-surface-container">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-primary-fixed text-primary">
            <span className="material-symbols-outlined text-5xl">{placeholderIcon(item)}</span>
            {item.cuisine === 'beverages' && (
              <span className="text-xs font-bold uppercase">Drink</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-sm p-md">
        <div className="flex items-start justify-between gap-sm">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-on-surface">{item.name}</h3>
              <span
                className={`h-3 w-3 rounded-full ${item.is_veg ? 'bg-stock-in' : 'bg-error'}`}
                title={item.is_veg ? 'Vegetarian' : 'Non-vegetarian'}
              />
              {item.is_bestseller && (
                <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container uppercase">
                  Bestseller
                </span>
              )}
            </div>
            {item.description && (
              <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{item.description}</p>
            )}
          </div>
          <p className="shrink-0 text-base font-bold text-primary">{formatCurrency(item.price)}</p>
        </div>

        <div className="flex items-center justify-end pt-sm">
          {quantity > 0 ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onQuantityChange(quantity - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high"
                aria-label="Decrease quantity"
              >
                <span className="material-symbols-outlined text-xl">remove</span>
              </button>
              <span className="min-w-8 text-center text-lg font-bold">{quantity}</span>
              <button
                type="button"
                onClick={() => onQuantityChange(quantity + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary"
                aria-label="Increase quantity"
              >
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="rounded-full bg-primary px-lg py-sm text-base font-bold text-on-primary"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
