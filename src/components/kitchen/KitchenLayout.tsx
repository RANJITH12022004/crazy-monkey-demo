import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStaff } from '@/context/StaffContext'

export type KitchenTab = 'live' | 'history'

interface KitchenLayoutProps {
  activeTab: KitchenTab
  onTabChange: (tab: KitchenTab) => void
  children: ReactNode
}

export function KitchenLayout({ activeTab, onTabChange, children }: KitchenLayoutProps) {
  const navigate = useNavigate()
  const { session, logout } = useStaff()

  const handleLogout = () => {
    logout()
    navigate('/staff', { replace: true })
  }

  return (
    <div className="min-h-screen bg-kds-bg text-kds-text">
      <header className="border-b border-kds-border bg-kds-surface px-margin-mobile py-md md:px-margin-desktop">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-md">
          <div>
            <h1 className="text-xl font-bold text-white md:text-2xl">Kitchen Display</h1>
            <p className="text-sm text-kds-text/80">Crazy Monkey — live orders</p>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex rounded-lg border border-kds-border bg-kds-card p-1">
              {(
                [
                  ['live', 'Live Board'],
                  ['history', 'History'],
                ] as const
              ).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={`rounded-md px-md py-sm text-sm font-semibold ${
                    activeTab === tab ? 'bg-kds-new text-white' : 'text-kds-text'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {session && (
              <span className="hidden text-sm text-kds-text/80 sm:inline">
                {session.displayName}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-kds-border px-md py-sm text-sm font-semibold text-white hover:bg-kds-card"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-margin-mobile py-lg md:px-margin-desktop">{children}</main>
    </div>
  )
}
