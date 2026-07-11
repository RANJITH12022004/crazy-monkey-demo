export function EmptyColumn({ message }: { message: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-kds-border bg-kds-surface/50 p-md text-center text-sm text-kds-text/70">
      {message}
    </div>
  )
}
