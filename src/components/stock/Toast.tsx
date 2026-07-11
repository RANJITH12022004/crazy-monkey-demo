import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(onDismiss, 3200)
    return () => window.clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
      <div className="flex items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest px-lg py-sm shadow-lg">
        <span className="material-symbols-outlined text-primary">info</span>
        <p className="text-sm font-medium text-on-surface">{message}</p>
      </div>
    </div>
  )
}
