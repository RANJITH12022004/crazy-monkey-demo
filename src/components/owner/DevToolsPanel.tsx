interface DevToolsPanelProps {
  usingMockData: boolean
  liveOrderCount: number
  resetting: boolean
  onReset: () => void
}

export function DevToolsPanel({
  usingMockData,
  liveOrderCount,
  resetting,
  onReset,
}: DevToolsPanelProps) {
  return (
    <aside className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md">
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
            Dev Tools
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {usingMockData
              ? `Showing sample analytics (${liveOrderCount} live orders in DB).`
              : `Live data from ${liveOrderCount} orders — updates in realtime.`}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={resetting}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm text-sm font-semibold text-primary transition-colors hover:bg-surface-container disabled:opacity-60"
        >
          {resetting ? 'Resetting…' : 'Reset Demo'}
        </button>
      </div>
      <p className="mt-sm text-xs text-on-surface-variant">
        Clears all orders, reseeds analytics history, and leaves the kitchen board with exactly{' '}
        <strong>1 New</strong> + <strong>1 Preparing</strong> ticket for the next pitch.
      </p>
    </aside>
  )
}
