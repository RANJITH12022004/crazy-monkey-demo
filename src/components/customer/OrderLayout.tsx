import { Link, Outlet, useParams } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import { CartBar } from '@/components/customer/CartBar'

export function OrderLayout() {
  const { tableId = '' } = useParams()

  return (
    <CartProvider tableId={tableId}>
      <div className="mx-auto min-h-screen max-w-[480px] bg-cream">
        <Outlet />
        <CartBar />
      </div>
    </CartProvider>
  )
}

export function CustomerBackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
      <span className="material-symbols-outlined text-base">arrow_back</span>
      {label}
    </Link>
  )
}
