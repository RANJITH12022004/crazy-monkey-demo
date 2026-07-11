import { Link, useParams } from 'react-router-dom'
import {
  formatTableLabel,
  LOGO_URL,
  RESTAURANT_NAME,
} from '@/constants/branding'

export default function WelcomePage() {
  const { tableId = '' } = useParams()

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-margin-mobile pb-28 pt-xl text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(51,85,132,0.12), transparent 55%), radial-gradient(ellipse at bottom, rgba(188,70,38,0.08), transparent 50%)',
        }}
      />
      <img
        src={LOGO_URL}
        alt={RESTAURANT_NAME}
        className="relative z-10 h-32 w-32 rounded-full object-cover shadow-lg ring-4 ring-white"
      />
      <p className="relative z-10 mt-lg text-sm font-semibold tracking-wide text-on-surface-variant uppercase">
        {RESTAURANT_NAME}
      </p>
      <h1 className="relative z-10 mt-sm text-3xl font-bold text-primary">
        Welcome to {RESTAURANT_NAME}
      </h1>
      <p className="relative z-10 mt-md text-base text-on-surface-variant">
        You are seated at {formatTableLabel(tableId)}
      </p>
      <Link
        to={`/order/${tableId}/menu`}
        className="relative z-10 mt-xl w-full rounded-xl bg-primary px-lg py-md text-base font-bold text-on-primary shadow-md"
      >
        View Menu
      </Link>
    </main>
  )
}
