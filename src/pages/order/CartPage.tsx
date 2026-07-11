import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomerBackLink } from '@/components/customer/OrderLayout'
import { QuantityStepper } from '@/components/shared/QuantityStepper'
import { useCart, useCartTotals } from '@/context/CartContext'
import { formatCurrency } from '@/constants/branding'
import { placeOrder } from '@/lib/customerOrders'
import { useMenuItems } from '@/hooks/useMenuItems'
import { DataErrorPanel } from '@/components/DataErrorPanel'
import { classifySupabaseError } from '@/lib/supabaseErrors'

export default function CartPage() {
  const { tableId = '' } = useParams()
  const navigate = useNavigate()
  const { items, loading, error, refresh } = useMenuItems()
  const {
    lines,
    specialInstructions,
    setSpecialInstructions,
    setQuantity,
    clearCart,
    resolveLines,
  } = useCart()
  const totals = useCartTotals(items)
  const [placing, setPlacing] = useState(false)
  const [placeError, setPlaceError] = useState<string | null>(null)

  const resolvedLines = resolveLines(items)

  const handlePlaceOrder = async () => {
    if (lines.length === 0) return
    setPlacing(true)
    setPlaceError(null)
    try {
      const orderId = await placeOrder({
        tableId,
        items: lines,
        specialInstructions,
      })
      clearCart()
      navigate(`/order/${tableId}/track/${orderId}`, { replace: true })
    } catch (err) {
      const classified = classifySupabaseError(err)
      setPlaceError(classified.message)
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-on-surface-variant">
        Loading cart…
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
    <main className="min-h-screen px-margin-mobile pb-margin-mobile pt-md">
      <CustomerBackLink to={`/order/${tableId}/menu`} label="Back to menu" />
      <h1 className="mt-md text-2xl font-bold text-primary">Your Cart</h1>

      {resolvedLines.length === 0 ? (
        <p className="mt-xl text-on-surface-variant">Your cart is empty. Add items from the menu.</p>
      ) : (
        <>
          <div className="mt-lg flex flex-col gap-md">
            {resolvedLines.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-md rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-md"
              >
                <div>
                  <p className="font-bold text-on-surface">{item.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
                <QuantityStepper
                  value={quantity}
                  min={0}
                  onChange={(value) => setQuantity(item.id, value)}
                  ariaLabel={`Quantity for ${item.name}`}
                />
              </div>
            ))}
          </div>

          <label className="mt-lg block">
            <span className="text-sm font-semibold text-on-surface">Special instructions</span>
            <textarea
              value={specialInstructions}
              onChange={(event) => setSpecialInstructions(event.target.value)}
              rows={3}
              placeholder="Less spicy, no onions, etc."
              className="mt-sm w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-sm text-on-surface"
            />
          </label>

          <section className="mt-lg rounded-xl border border-outline-variant/50 bg-surface-container-low p-md">
            <h2 className="text-sm font-bold text-on-surface">Bill Details</h2>
            <div className="mt-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">GST (5%)</span>
                <span>{formatCurrency(totals.gst)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Restaurant Charges</span>
                <span>{formatCurrency(totals.restaurantCharge)}</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/50 pt-2 text-base font-bold">
                <span>To Pay</span>
                <span className="text-primary">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </section>

          {placeError && (
            <p className="mt-md rounded-lg bg-error-container px-md py-sm text-sm text-on-error-container">
              {placeError}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handlePlaceOrder()}
            disabled={placing || resolvedLines.length === 0}
            className="mt-lg w-full rounded-xl bg-primary px-lg py-md text-base font-bold text-on-primary disabled:opacity-60"
          >
            {placing ? 'Placing order…' : 'Place Order — Pay at Counter'}
          </button>
        </>
      )}
    </main>
  )
}
