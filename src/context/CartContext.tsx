import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { calcCartTotals } from '@/lib/customerOrders'
import type { MenuItemRow } from '@/types/menu'
import type { CartLine } from '@/types/order'

interface CartContextValue {
  lines: CartLine[]
  specialInstructions: string
  setSpecialInstructions: (value: string) => void
  addItem: (menuItemId: string) => void
  setQuantity: (menuItemId: string, quantity: number) => void
  lineCount: number
  subtotal: number
  totals: ReturnType<typeof calcCartTotals>
  clearCart: () => void
  getQuantity: (menuItemId: string) => number
  resolveLines: (menu: MenuItemRow[]) => Array<CartLine & { item: MenuItemRow }>
}

const CartContext = createContext<CartContextValue | null>(null)

interface CartProviderProps {
  tableId: string
  children: ReactNode
}

interface StoredCart {
  lines: CartLine[]
  specialInstructions: string
}

function storageKey(tableId: string): string {
  return `crazy-monkey-cart:${tableId}`
}

function readStoredCart(tableId: string): StoredCart {
  try {
    const raw = sessionStorage.getItem(storageKey(tableId))
    if (!raw) return { lines: [], specialInstructions: '' }
    const parsed = JSON.parse(raw) as StoredCart
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      specialInstructions: parsed.specialInstructions ?? '',
    }
  } catch {
    return { lines: [], specialInstructions: '' }
  }
}

export function CartProvider({ tableId, children }: CartProviderProps) {
  const [lines, setLines] = useState<CartLine[]>(() => readStoredCart(tableId).lines)
  const [specialInstructions, setSpecialInstructions] = useState(
    () => readStoredCart(tableId).specialInstructions,
  )

  useEffect(() => {
    const stored = readStoredCart(tableId)
    setLines(stored.lines)
    setSpecialInstructions(stored.specialInstructions)
  }, [tableId])

  useEffect(() => {
    const payload: StoredCart = { lines, specialInstructions }
    sessionStorage.setItem(storageKey(tableId), JSON.stringify(payload))
  }, [tableId, lines, specialInstructions])

  const addItem = useCallback((menuItemId: string) => {
    setLines((current) => {
      const existing = current.find((line) => line.menuItemId === menuItemId)
      if (existing) {
        return current.map((line) =>
          line.menuItemId === menuItemId
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        )
      }
      return [...current, { menuItemId, quantity: 1 }]
    })
  }, [])

  const setQuantity = useCallback((menuItemId: string, quantity: number) => {
    setLines((current) => {
      if (quantity <= 0) {
        return current.filter((line) => line.menuItemId !== menuItemId)
      }
      const existing = current.find((line) => line.menuItemId === menuItemId)
      if (existing) {
        return current.map((line) =>
          line.menuItemId === menuItemId ? { ...line, quantity } : line,
        )
      }
      return [...current, { menuItemId, quantity }]
    })
  }, [])

  const clearCart = useCallback(() => {
    setLines([])
    setSpecialInstructions('')
  }, [])

  const getQuantity = useCallback(
    (menuItemId: string) => lines.find((line) => line.menuItemId === menuItemId)?.quantity ?? 0,
    [lines],
  )

  const resolveLines = useCallback(
    (menu: MenuItemRow[]) => {
      const menuMap = new Map(menu.map((item) => [item.id, item]))
      return lines
        .map((line) => {
          const item = menuMap.get(line.menuItemId)
          if (!item) return null
          return { ...line, item }
        })
        .filter((line): line is NonNullable<typeof line> => line !== null)
    },
    [lines],
  )

  const lineCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      specialInstructions,
      setSpecialInstructions,
      addItem,
      setQuantity,
      lineCount,
      subtotal: 0,
      totals: calcCartTotals(0),
      clearCart,
      getQuantity,
      resolveLines,
    }),
    [
      lines,
      specialInstructions,
      addItem,
      setQuantity,
      lineCount,
      clearCart,
      getQuantity,
      resolveLines,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export function useCartTotals(menu: MenuItemRow[]) {
  const { lines } = useCart()
  const subtotal = useMemo(() => {
    const menuMap = new Map(menu.map((item) => [item.id, item]))
    return lines.reduce((sum, line) => {
      const item = menuMap.get(line.menuItemId)
      return sum + (item ? item.price * line.quantity : 0)
    }, 0)
  }, [lines, menu])

  return calcCartTotals(subtotal)
}
