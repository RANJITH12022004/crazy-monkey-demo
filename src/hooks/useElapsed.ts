import { useEffect, useState } from 'react'

export function useElapsed(isoDate: string): string {
  const [elapsed, setElapsed] = useState(() => formatElapsed(isoDate))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed(formatElapsed(isoDate))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isoDate])

  return elapsed
}

function formatElapsed(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function isUrgentOrder(createdAt: string, status: string): boolean {
  if (status !== 'preparing') return false
  const diffMinutes = (Date.now() - new Date(createdAt).getTime()) / 60000
  return diffMinutes > 15
}
