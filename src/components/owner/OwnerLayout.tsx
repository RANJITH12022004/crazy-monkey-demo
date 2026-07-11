import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStaff } from '@/context/StaffContext'

interface OwnerLayoutProps {
  children: ReactNode
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const navigate = useNavigate()
  const { session, logout } = useStaff()

  const handleLogout = () => {
    logout()
    navigate('/staff', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed top-0 left-0 z-50 hidden h-full w-64 flex-col border-r border-outline-variant bg-surface-container-low p-md md:flex">
        <div className="mb-xl px-md">
          <h1 className="text-xl font-bold tracking-tight text-primary">Crazy Monkey</h1>
          <p className="mt-xs text-xs text-on-surface-variant">Owner Terminal</p>
        </div>

        <nav className="flex flex-grow flex-col gap-sm px-sm">
          <a
            href="#overview"
            className="flex items-center gap-md rounded-lg bg-secondary-container px-md py-sm text-sm font-bold text-on-secondary-container"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dashboard
            </span>
            Overview
          </a>
          <span className="flex items-center gap-md rounded-lg px-md py-sm text-sm text-on-surface-variant">
            <span className="material-symbols-outlined">analytics</span>
            Reports
          </span>
        </nav>

        <div className="mt-auto border-t border-outline-variant pt-lg">
          <div className="mb-md flex items-center gap-md px-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
              {session?.displayName?.charAt(0) ?? 'O'}
            </div>
            <div>
              <p className="text-sm font-semibold">{session?.displayName ?? 'Owner'}</p>
              <p className="text-xs text-on-surface-variant">Owner</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-sm rounded-lg border border-outline px-md py-sm text-sm font-semibold text-primary transition-colors hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-margin-mobile md:hidden">
        <h1 className="text-xl font-bold text-primary">Executive Analytics</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-semibold text-primary"
        >
          Sign out
        </button>
      </header>

      <main className="md:ml-64">{children}</main>
    </div>
  )
}
