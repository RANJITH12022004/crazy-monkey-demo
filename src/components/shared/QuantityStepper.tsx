interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'default' | 'large'
  ariaLabel?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = -999,
  max = 999,
  size = 'default',
  ariaLabel = 'Quantity',
}: QuantityStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () => onChange(Math.min(max, value + 1))

  if (size === 'large') {
    return (
      <div className="flex items-center gap-md">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-on-surface shadow-sm transition-all hover:bg-surface-variant active:scale-95 disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <span className="material-symbols-outlined text-[32px]">remove</span>
        </button>
        <input
          type="number"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)))
          }}
          aria-label={ariaLabel}
          className="w-24 border-b-2 border-primary bg-surface p-base text-center text-[32px] font-bold leading-10 text-on-surface focus:outline-none"
        />
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-on-surface shadow-sm transition-all hover:bg-surface-variant active:scale-95 disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-12 items-center overflow-hidden rounded-lg border border-outline-variant">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex h-full items-center justify-center px-3 text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <span className="material-symbols-outlined">remove</span>
      </button>
      <input
        type="number"
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)))
        }}
        aria-label={ariaLabel}
        className="w-full border-none bg-transparent p-0 text-center text-lg text-on-surface focus:ring-0"
      />
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex h-full items-center justify-center px-3 text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  )
}
