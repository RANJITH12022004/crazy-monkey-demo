import { DataFetchError, getErrorTitle } from '@/lib/supabaseErrors'

interface DataErrorPanelProps {
  error: DataFetchError | string
  onRetry?: () => void
}

export function DataErrorPanel({ error, onRetry }: DataErrorPanelProps) {
  const fetchError = typeof error === 'string' ? null : error
  const title = fetchError ? getErrorTitle(fetchError.kind) : 'Could not load data'
  const message = typeof error === 'string' ? error : error.message
  const hint = fetchError?.hint
  const table = fetchError?.table

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl">
      <p className="mb-sm text-lg font-semibold text-on-surface">{title}</p>
      <p className="mb-md text-sm text-on-surface-variant">{message}</p>
      {table && (
        <p className="mb-sm text-xs text-on-surface-variant">
          Table: <code className="rounded bg-surface-container px-1">{table}</code>
        </p>
      )}
      {hint && <p className="mb-lg text-sm text-on-surface">{hint}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-primary px-lg py-sm text-sm font-semibold text-on-primary"
        >
          Retry
        </button>
      )}
    </div>
  )
}
