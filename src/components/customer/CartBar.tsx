import { Link, useLocation, useParams } from 'react-router-dom'
import { useCart, useCartTotals } from '@/context/CartContext'
import { useMenuItems } from '@/hooks/useMenuItems'
import { formatCurrency } from '@/constants/branding'

export function CartBar() {
  const { tableId = '' } = useParams()
  const location = useLocation()
  const { items } = useMenuItems()
  const { lineCount } = useCart()
  const { total } = useCartTotals(items)

  if (lineCount === 0) return null
  if (location.pathname.includes('/cart') || location.pathname.includes('/track/')) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2 px-margin-mobile pb-margin-mobile">
      <Link
        to={`/order/${tableId}/cart`}
        className="flex items-center justify-between rounded-xl bg-primary px-lg py-md text-on-primary shadow-lg"
      >
        <span className="flex items-center gap-sm text-sm font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-on-primary/20 text-xs font-bold">
            {lineCount}
          </span>
          View Cart
        </span>
        <span className="text-base font-bold">{formatCurrency(total)}</span>
      </Link>
    </div>
  )
}
