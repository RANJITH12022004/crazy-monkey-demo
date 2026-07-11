export type StaffRole = 'kitchen' | 'stock' | 'owner'

export interface StaffSession {
  role: StaffRole
  displayName: string
}

export const STAFF_SESSION_KEY = 'crazy_monkey_staff_session'

export const ROLE_ROUTES: Record<StaffRole, string> = {
  kitchen: '/kitchen',
  stock: '/stock',
  owner: '/owner',
}

export const ROUTE_ROLES: Record<string, StaffRole> = {
  '/kitchen': 'kitchen',
  '/stock': 'stock',
  '/owner': 'owner',
}

export const PIN_LENGTH = 4
export const MIN_PIN_LENGTH = PIN_LENGTH
export const MAX_PIN_LENGTH = PIN_LENGTH
