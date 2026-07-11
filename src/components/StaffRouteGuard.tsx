import { Navigate, Outlet } from 'react-router-dom'
import { useStaff } from '@/context/StaffContext'
import type { StaffRole } from '@/types/staff'

interface StaffRouteGuardProps {
  requiredRole: StaffRole
}

export function StaffRouteGuard({ requiredRole }: StaffRouteGuardProps) {
  const { session, isReady } = useStaff()

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface-variant">
        Loading…
      </div>
    )
  }

  if (!session || session.role !== requiredRole) {
    return <Navigate to="/staff" replace />
  }

  return <Outlet />
}
