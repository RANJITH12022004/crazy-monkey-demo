import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { StaffRole } from '@/types/staff'

export interface StaffPinRecord {
  role: StaffRole
  display_name: string
}

const VALID_ROLES: StaffRole[] = ['kitchen', 'stock', 'owner']

/** Built-in demo PINs — same values seeded in 001_staff_pins.sql */
export const DEMO_STAFF_PINS: Record<string, StaffPinRecord> = {
  '1111': { role: 'kitchen', display_name: 'Ravi' },
  '2222': { role: 'stock', display_name: 'Priya' },
  '3333': { role: 'owner', display_name: 'Arjun' },
}

function normalizeRecord(record: StaffPinRecord | null): StaffPinRecord | null {
  if (!record || !VALID_ROLES.includes(record.role)) return null
  return record
}

function verifyDemoPin(pin: string): StaffPinRecord | null {
  return normalizeRecord(DEMO_STAFF_PINS[pin] ?? null)
}

async function verifySupabasePin(pin: string): Promise<StaffPinRecord | null> {
  const { data, error } = await supabase
    .from('staff_pins')
    .select('role, display_name')
    .eq('pin_hash', pin)
    .maybeSingle()

  if (error) {
    console.warn('Supabase PIN lookup failed, using demo PINs:', error.message)
    return verifyDemoPin(pin)
  }

  if (!data) return verifyDemoPin(pin)

  return normalizeRecord({
    role: data.role as StaffRole,
    display_name: data.display_name,
  })
}

export async function verifyStaffPin(pin: string): Promise<StaffPinRecord | null> {
  if (!isSupabaseConfigured()) {
    return verifyDemoPin(pin)
  }

  return verifySupabasePin(pin)
}
