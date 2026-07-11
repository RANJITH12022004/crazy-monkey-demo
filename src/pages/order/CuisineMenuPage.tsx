import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CustomerBackLink } from '@/components/customer/OrderLayout'
import { MenuItemCard } from '@/components/customer/MenuItemCard'
import { useCart } from '@/context/CartContext'
import { cuisineHeroUrl, LOGO_URL, RESTAURANT_NAME } from '@/constants/branding'
import { useMenuItems } from '@/hooks/useMenuItems'
import { DataErrorPanel } from '@/components/DataErrorPanel'
import type { MenuCategory } from '@/types/analytics'
import type { MenuCuisine, MenuFilter, MenuItemRow } from '@/types/menu'

const CUISINE_LABELS: Record<MenuCuisine, string> = {
  chinese: 'Chinese Menu',
  italian: 'Italian Menu',
  dessert: 'Dessert Menu',
  indian: 'Indian Menu',
  mexican: 'Mexican Menu',
}

const CATEGORY_ORDER: MenuCategory[] = ['Starters', 'Mains', 'Desserts', 'Beverages']

function groupByCategory(items: MenuItemRow[]): Array<{ category: MenuCategory; items: MenuItemRow[] }> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0)
}

export default function CuisineMenuPage() {
  const { tableId = '', cuisine = 'chinese' } = useParams()
  const menuCuisine = cuisine as MenuCuisine
  const { items, loading, error, refresh } = useMenuItems()
  const { addItem, setQuantity, getQuantity } = useCart()
  const [filter, setFilter] = useState<MenuFilter>('all')
  const heroUrl = cuisineHeroUrl(menuCuisine)

  const { cuisineItems, beverages } = useMemo(() => {
    const cuisineItems = items.filter((item) => item.cuisine === menuCuisine)
    const beverages = items.filter((item) => item.cuisine === 'beverages')
    return { cuisineItems, beverages }
  }, [items, menuCuisine])

  const filteredItems = useMemo(() => {
    if (filter === 'bestsellers') return cuisineItems.filter((item) => item.is_bestseller)
    if (filter === 'veg') return cuisineItems.filter((item) => item.is_veg)
    return cuisineItems
  }, [cuisineItems, filter])

  const grouped = useMemo(() => groupByCategory(filteredItems), [filteredItems])

  const filteredDrinks = useMemo(() => {
    if (filter === 'bestsellers') return beverages.filter((item) => item.is_bestseller)
    if (filter === 'veg') return beverages.filter((item) => item.is_veg)
    return beverages
  }, [beverages, filter])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-on-surface-variant">
        Loading menu…
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen px-margin-mobile py-xl">
        <DataErrorPanel error={error} onRetry={() => void refresh()} />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-28">
      {heroUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img src={heroUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        </div>
      )}

      <div className="px-margin-mobile pt-md">
        <CustomerBackLink to={`/order/${tableId}/menu`} label="Menus" />
        <div className="mt-md flex items-center gap-md">
          <img
            src={LOGO_URL}
            alt={RESTAURANT_NAME}
            className="h-14 w-14 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold text-primary">
            {CUISINE_LABELS[menuCuisine] ?? 'Menu'}
          </h1>
        </div>

        <div className="mt-md flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['bestsellers', 'Bestsellers'],
              ['veg', 'Veg Only'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-md py-sm text-sm font-semibold ${
                filter === value
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {grouped.map((group) => (
          <section key={group.category} className="mt-xl">
            <h2 className="mb-md text-lg font-bold text-on-surface">{group.category}</h2>
            <div className="flex flex-col gap-lg">
              {group.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={getQuantity(item.id)}
                  onAdd={() => addItem(item.id)}
                  onQuantityChange={(quantity) => setQuantity(item.id, quantity)}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredDrinks.length > 0 && (
          <section className="mt-xl">
            <h2 className="mb-md text-lg font-bold text-on-surface">Drinks</h2>
            <div className="flex flex-col gap-lg">
              {filteredDrinks.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={getQuantity(item.id)}
                  onAdd={() => addItem(item.id)}
                  onQuantityChange={(quantity) => setQuantity(item.id, quantity)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
