import type { StockStatus } from '@/types/stock'

const STATUS_CONFIG: Record<
  StockStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  in_stock: {
    label: 'In Stock',
    dotClass: 'bg-stock-in',
    textClass: 'text-on-surface',
  },
  low_stock: {
    label: 'Low Stock',
    dotClass: 'bg-stock-low',
    textClass: 'text-on-surface',
  },
  out_of_stock: {
    label: 'Out of Stock',
    dotClass: 'bg-error',
    textClass: 'text-error',
  },
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  const config = STATUS_CONFIG[status]

  return (
    <div className="flex items-center gap-xs">
      <div className={`h-2.5 w-2.5 rounded-full ${config.dotClass}`} />
      <span className={`text-xs font-medium ${config.textClass}`}>{config.label}</span>
    </div>
  )
}
