import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DEMO_TABLE_ID,
  formatTableLabel,
  LOGO_URL,
  RESTAURANT_NAME,
  STAFF_PINS,
} from '@/constants/branding'

function qrImageUrl(targetUrl: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=${encodeURIComponent(targetUrl)}`
}

export default function DemoLauncherPage() {
  const [copied, setCopied] = useState(false)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const customerUrl = useMemo(
    () => `${origin}/order/${DEMO_TABLE_ID}`,
    [origin],
  )

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(customerUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-outline-variant/40 bg-surface-container-lowest px-margin-mobile py-md md:px-margin-desktop">
        <div className="mx-auto flex max-w-5xl items-center gap-md">
          <img src={LOGO_URL} alt={RESTAURANT_NAME} className="h-12 w-12 rounded-full object-cover" />
          <div>
            <h1 className="text-xl font-bold text-primary md:text-2xl">Pitch Launcher</h1>
            <p className="text-sm text-on-surface-variant">
              {RESTAURANT_NAME} — one screen for the whole demo
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-xl px-margin-mobile py-xl md:grid-cols-2 md:px-margin-desktop">
        <section className="rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-lg shadow-sm">
          <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
            Customer phone
          </p>
          <h2 className="mt-sm text-2xl font-bold text-on-surface">
            Scan for {formatTableLabel(DEMO_TABLE_ID)}
          </h2>
          <p className="mt-sm text-sm text-on-surface-variant">
            Open this QR on a second phone, or print it once you have your Vercel URL.
          </p>

          <div className="mt-lg flex flex-col items-center gap-md">
            <div className="rounded-xl border border-outline-variant bg-white p-md">
              <img
                src={qrImageUrl(customerUrl)}
                alt={`QR code for ${customerUrl}`}
                className="h-[240px] w-[240px]"
              />
            </div>
            <p className="break-all text-center text-xs text-on-surface-variant">{customerUrl}</p>
            <div className="flex w-full flex-wrap gap-sm">
              <button
                type="button"
                onClick={() => void copyUrl()}
                className="flex-1 rounded-lg border border-outline-variant px-md py-sm text-sm font-semibold text-primary"
              >
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              <Link
                to={`/order/${DEMO_TABLE_ID}`}
                className="flex-1 rounded-lg bg-primary px-md py-sm text-center text-sm font-bold text-on-primary"
              >
                Open customer flow
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-md">
          <div className="rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-lg shadow-sm">
            <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
              Staff tablets
            </p>
            <h2 className="mt-sm text-xl font-bold text-on-surface">PIN cheat sheet</h2>
            <ul className="mt-md space-y-sm">
              {Object.values(STAFF_PINS).map((entry) => (
                <li
                  key={entry.pin}
                  className="flex items-center justify-between rounded-lg border border-outline-variant/40 bg-surface-container-low px-md py-sm"
                >
                  <div>
                    <p className="font-bold text-on-surface">{entry.role}</p>
                    <p className="text-xs text-on-surface-variant">PIN {entry.pin}</p>
                  </div>
                  <Link
                    to="/staff"
                    className="rounded-lg bg-primary px-md py-sm text-sm font-semibold text-on-primary"
                  >
                    Login
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-md text-xs text-on-surface-variant">
              After PIN entry you land on the matching dashboard automatically.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-lg">
            <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
              Before next pitch
            </p>
            <ol className="mt-md list-decimal space-y-2 pl-5 text-sm text-on-surface-variant">
              <li>Owner login (3333) → Dev Tools → Reset Demo</li>
              <li>Kitchen tablet open on Live Board</li>
              <li>Customer phone ready to scan this QR</li>
              <li>Test on real WiFi / hotspot — not localhost alone</li>
            </ol>
            <Link
              to="/owner"
              className="mt-md inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Go to owner dashboard (needs PIN first)
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
