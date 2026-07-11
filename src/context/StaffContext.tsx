import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ROLE_ROUTES,
  STAFF_SESSION_KEY,
  type StaffRole,
  type StaffSession,
} from '@/types/staff'

interface StaffContextValue {
  session: StaffSession | null
  isReady: boolean
  login: (session: StaffSession) => void
  logout: () => void
  getDashboardPath: (role: StaffRole) => string
}

const StaffContext = createContext<StaffContextValue | null>(null)

function readSession(): StaffSession | null {
  try {
    const raw = sessionStorage.getItem(STAFF_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StaffSession
    if (!parsed.role || !parsed.displayName) return null
    return parsed
  } catch {
    return null
  }
}

export function StaffProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StaffSession | null>(() => readSession())
  const [isReady] = useState(true)

  const login = useCallback((nextSession: StaffSession) => {
    sessionStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STAFF_SESSION_KEY)
    setSession(null)
  }, [])

  const getDashboardPath = useCallback((role: StaffRole) => ROLE_ROUTES[role], [])

  const value = useMemo(
    () => ({
      session,
      isReady,
      login,
      logout,
      getDashboardPath,
    }),
    [session, isReady, login, logout, getDashboardPath],
  )

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
}

export function useStaff() {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error('useStaff must be used within StaffProvider')
  }
  return context
}
