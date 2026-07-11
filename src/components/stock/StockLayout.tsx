import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStaff } from '@/context/StaffContext'
import type { StockView } from '@/types/stock'

interface StockLayoutProps {
  activeView: StockView
  onViewChange: (view: StockView) => void
  alertCount: number
  children: ReactNode
}

const NAV_ITEMS: { view: StockView; label: string; icon: string }[] = [
  { view: 'overview', label: 'Inventory', icon: 'inventory_2' },
  { view: 'alerts', label: 'Alerts', icon: 'warning' },
  { view: 'manual', label: 'Manual Update', icon: 'edit_square' },
  { view: 'create', label: 'Add Item', icon: 'add_box' },
]

export function StockLayout({
  activeView,
  onViewChange,
  alertCount,
  children,
}: StockLayoutProps) {
  const navigate = useNavigate()
  const { session, logout } = useStaff()

  const handleLogout = () => {
    logout()
    navigate('/staff', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-surface px-md shadow-sm">
        <div className="flex items-center gap-lg">
          <h1 className="text-xl font-bold text-primary">Crazy Monkey</h1>
          <span className="hidden text-sm text-on-surface-variant md:inline">
            Stock Manager
          </span>
        </div>
        <div className="flex items-center gap-md">
          {session && (
            <span className="hidden text-sm text-on-surface-variant sm:inline">
              {session.displayName}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-outline-variant px-md py-sm text-sm font-semibold text-primary transition-colors hover:bg-surface-container"
          >
            Sign out
          </button>
        </div>
      </header>

      <aside className="fixed top-16 left-0 hidden h-[calc(100vh-64px)] w-64 flex-col border-r border-outline-variant bg-surface-container-low p-sm md:flex">
        <div className="mb-sm flex items-center gap-md border-b border-outline-variant px-md py-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-[28px]">restaurant</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold leading-tight text-primary">Main Kitchen</h2>
            <p className="mt-1 text-xs text-on-surface-variant">Active Session</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewChange('create')}
          className="mb-lg flex w-full items-center justify-center gap-sm rounded-lg bg-primary py-sm text-sm font-semibold text-on-primary transition-colors hover:opacity-90"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            add
          </span>
          Add New Item
        </button>

        <nav className="flex flex-1 flex-col gap-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.view
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onViewChange(item.view)}
                className={`flex items-center gap-md rounded-lg px-md py-sm text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.view === 'alerts' && alertCount > 0 && (
                  <span className="rounded-full bg-error px-2 py-0.5 text-xs font-bold text-on-error">
                    {alertCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="min-h-screen pt-16 pb-20 md:pb-0 md:pl-64">
        <div className="mx-auto max-w-6xl p-lg md:p-margin-desktop">{children}</div>
      </main>

      <nav className="fixed right-0 bottom-0 left-0 z-40 flex border-t border-outline-variant bg-surface-container-lowest md:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.view
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onViewChange(item.view)}
              className={`relative flex flex-1 flex-col items-center gap-1 py-sm text-[10px] font-semibold ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
              {item.view === 'alerts' && alertCount > 0 && (
                <span className="absolute top-1 ml-8 rounded-full bg-error px-1.5 text-[10px] text-on-error">
                  {alertCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
