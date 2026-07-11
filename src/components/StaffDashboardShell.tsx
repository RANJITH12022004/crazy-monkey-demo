import { Link, useNavigate } from 'react-router-dom'
import { useStaff } from '@/context/StaffContext'

interface StaffDashboardShellProps {
  title: string
  subtitle: string
  icon: string
}

export function StaffDashboardShell({
  title,
  subtitle,
  icon,
}: StaffDashboardShellProps) {
  const navigate = useNavigate()
  const { session, logout } = useStaff()

  const handleLogout = () => {
    logout()
    navigate('/staff', { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-outline-variant/40 bg-surface-container-lowest px-margin-mobile py-md md:px-margin-desktop">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-md">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
            <div>
              <h1 className="text-xl font-bold text-primary md:text-2xl">{title}</h1>
              <p className="text-sm text-on-surface-variant">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-md">
            {session && (
              <span className="hidden text-sm text-on-surface-variant sm:inline">
                Signed in as {session.displayName}
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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-margin-mobile py-xl md:px-margin-desktop">
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-xl shadow-sm">
          <p className="text-base text-on-surface-variant">
            Dashboard content will be built in the next prompt. You are authenticated and
            route-protected.
          </p>
          <Link
            to="/staff"
            className="mt-lg inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Back to staff login
          </Link>
        </div>
      </main>
    </div>
  )
}
