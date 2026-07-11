import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStaff } from '@/context/StaffContext'
import { verifyStaffPin } from '@/lib/staffAuth'
import {
  MAX_PIN_LENGTH,
  MIN_PIN_LENGTH,
  type StaffRole,
} from '@/types/staff'
import { LOGO_URL } from '@/constants/branding'

const ROLE_META: Record<
  StaffRole,
  { icon: string; label: string }
> = {
  kitchen: { icon: 'restaurant', label: 'Kitchen Staff' },
  stock: { icon: 'inventory_2', label: 'Inventory Manager' },
  owner: { icon: 'workspace_premium', label: 'Owner' },
}

export default function StaffLoginPage() {
  const navigate = useNavigate()
  const { login, getDashboardPath, session } = useStaff()
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [successRole, setSuccessRole] = useState<StaffRole | null>(null)

  useEffect(() => {
    if (session) {
      navigate(getDashboardPath(session.role), { replace: true })
    }
  }, [session, navigate, getDashboardPath])

  const clearPin = useCallback(() => {
    setPin('')
    setError(null)
  }, [])

  const showError = useCallback(
    (message: string) => {
      setError(message)
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
        clearPin()
      }, 600)
    },
    [clearPin],
  )

  const submitPin = useCallback(
    async (enteredPin: string) => {
      if (enteredPin.length < MIN_PIN_LENGTH || enteredPin.length > MAX_PIN_LENGTH) {
        return
      }

      setIsVerifying(true)
      setError(null)

      const record = await verifyStaffPin(enteredPin)

      setIsVerifying(false)

      if (!record) {
        showError("That PIN didn't match. Please try again.")
        return
      }

      const role = record.role as StaffRole
      setSuccessRole(role)

      login({
        role,
        displayName: record.display_name,
      })

      setTimeout(() => {
        navigate(getDashboardPath(role), { replace: true })
      }, 1200)
    },
    [login, navigate, getDashboardPath, showError],
  )

  const appendDigit = useCallback(
    (digit: string) => {
      if (isVerifying || successRole) return

      setError(null)

      const next = pin.length >= MAX_PIN_LENGTH ? pin : `${pin}${digit}`
      if (next === pin) return

      setPin(next)

      if (next.length === MIN_PIN_LENGTH) {
        void submitPin(next)
      }
    },
    [pin, isVerifying, successRole, submitPin],
  )

  const backspace = useCallback(() => {
    if (isVerifying || successRole) return
    setError(null)
    setPin((current) => current.slice(0, -1))
  }, [isVerifying, successRole])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isVerifying || successRole) return

      if (event.key >= '0' && event.key <= '9') {
        appendDigit(event.key)
      } else if (event.key === 'Backspace') {
        backspace()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [appendDigit, backspace, isVerifying, successRole])

  const dots = Array.from({ length: MAX_PIN_LENGTH }, (_, index) => index < pin.length)
  const successMeta = successRole ? ROLE_META[successRole] : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-margin-mobile md:p-margin-desktop">
      <main className="relative flex w-full max-w-[480px] flex-col items-center overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest p-lg shadow-sm md:p-xl">
        {successMeta && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/95">
            <div className="flex flex-col items-center text-center">
              <span className="material-symbols-outlined mb-4 text-[64px] text-primary">
                {successMeta.icon}
              </span>
              <h2 className="mb-2 text-xl font-semibold text-on-surface">
                {successMeta.label} Access Granted
              </h2>
              <p className="text-base text-on-surface-variant">Redirecting to dashboard…</p>
            </div>
          </div>
        )}

        <div className="mb-xl flex w-full flex-col items-center">
          <img
            alt="Crazy Monkey Logo"
            className="mb-sm h-24 w-24 rounded-full bg-surface-container object-contain md:h-32 md:w-32"
            src={LOGO_URL}
          />
          <h1 className="text-center text-[26px] font-bold tracking-tight text-primary md:text-[32px]">
            Crazy Monkey
          </h1>
          <p className="mt-xs text-base text-on-surface-variant">Staff Authentication</p>
        </div>

        <div
          className={`mb-xl flex min-h-[64px] min-w-[200px] items-center justify-center gap-md rounded-lg border border-outline-variant bg-surface-container px-lg py-sm ${isShaking ? 'shake' : ''}`}
        >
          {dots.map((filled, index) => (
            <div
              key={index}
              className={`h-4 w-4 rounded-full transition-all duration-200 ${
                isShaking
                  ? 'bg-outline-variant'
                  : filled
                    ? 'pin-dot-filled'
                    : 'bg-surface-container-highest'
              }`}
            />
          ))}
        </div>

        <div
          className={`mb-lg min-h-6 w-full text-center text-sm font-semibold transition-opacity duration-300 ${
            error ? 'text-on-surface-variant opacity-100' : 'opacity-0'
          }`}
          role="status"
          aria-live="polite"
        >
          {error ?? ' '}
        </div>

        <div className="mb-xl grid w-full max-w-[320px] grid-cols-3 gap-md">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isVerifying || !!successRole}
              onClick={() => appendDigit(digit)}
              className="flex h-16 items-center justify-center rounded-lg border border-surface-variant bg-surface text-xl font-semibold text-on-surface shadow-sm transition-all hover:bg-surface-variant active:scale-95 disabled:opacity-60 md:h-20"
            >
              {digit}
            </button>
          ))}
          <div className="h-16 md:h-20" aria-hidden />
          <button
            type="button"
            disabled={isVerifying || !!successRole}
            onClick={() => appendDigit('0')}
            className="flex h-16 items-center justify-center rounded-lg border border-surface-variant bg-surface text-xl font-semibold text-on-surface shadow-sm transition-all hover:bg-surface-variant active:scale-95 disabled:opacity-60 md:h-20"
          >
            0
          </button>
          <button
            type="button"
            aria-label="Delete"
            disabled={isVerifying || !!successRole}
            onClick={backspace}
            className="flex h-16 items-center justify-center rounded-lg border border-surface-variant bg-surface-container-high text-on-surface-variant shadow-sm transition-all hover:bg-surface-variant active:scale-95 disabled:opacity-60 md:h-20"
          >
            <span className="material-symbols-outlined text-xl">backspace</span>
          </button>
        </div>

        <div className="mt-auto w-full border-t border-surface-variant pt-lg text-center">
          <p className="flex items-center justify-center gap-xs text-xs font-medium text-on-surface-variant">
            <span className="material-symbols-outlined text-base">lock</span>
            Restaurant Staff Access Only
          </p>
          <p className="mt-sm text-xs text-on-surface-variant">
            Demo PINs: Kitchen 1111 · Stock 2222 · Owner 3333
          </p>
          <Link
            to="/demo"
            className="mt-sm inline-flex text-xs font-semibold text-primary hover:underline"
          >
            Open pitch launcher
          </Link>
        </div>
      </main>
    </div>
  )
}
