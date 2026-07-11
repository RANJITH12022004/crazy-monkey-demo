import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const PLACEHOLDER_URL = 'https://placeholder.supabase.co'

function isPlaceholderValue(value: string | undefined): boolean {
  if (!value) return true
  const normalized = value.toLowerCase()
  return (
    normalized === 'https://your-project.supabase.co' ||
    normalized === 'https://your-project-ref.supabase.co' ||
    normalized === 'your-anon-key' ||
    normalized === 'your-anon-jwt-key' ||
    normalized.includes('placeholder')
  )
}

export interface SupabaseConfigStatus {
  url: string | undefined
  hasUrl: boolean
  hasAnonKey: boolean
  isConfigured: boolean
  issues: string[]
}

export function getSupabaseConfig(): SupabaseConfigStatus {
  const hasUrl = Boolean(rawUrl && !isPlaceholderValue(rawUrl))
  const hasAnonKey = Boolean(rawAnonKey && !isPlaceholderValue(rawAnonKey))
  const issues: string[] = []

  if (!rawUrl || isPlaceholderValue(rawUrl)) {
    issues.push('VITE_SUPABASE_URL is missing or still a placeholder.')
  } else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(rawUrl)) {
    issues.push(
      `VITE_SUPABASE_URL looks invalid ("${rawUrl}"). Expected https://<project-ref>.supabase.co`,
    )
  }

  if (!rawAnonKey || isPlaceholderValue(rawAnonKey)) {
    issues.push('VITE_SUPABASE_ANON_KEY is missing or still a placeholder.')
  } else if (rawAnonKey.startsWith('sb_publishable_')) {
    issues.push(
      'VITE_SUPABASE_ANON_KEY is a publishable key (sb_publishable_...). Use the legacy anon JWT key (eyJ...) from Project Settings → API.',
    )
  }

  return {
    url: hasUrl ? rawUrl : undefined,
    hasUrl,
    hasAnonKey,
    isConfigured: hasUrl && hasAnonKey && issues.length === 0,
    issues,
  }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured
}

function logStartupConfigStatus(): void {
  const config = getSupabaseConfig()

  if (!config.isConfigured) {
    console.error('[Crazy Monkey] Supabase is NOT configured:')
    for (const issue of config.issues) {
      console.error(`  - ${issue}`)
    }
    console.error('  Copy .env.example → .env, add your credentials, then restart npm run dev.')
    return
  }

  console.info(`[Crazy Monkey] Supabase connected → ${config.url}`)
}

logStartupConfigStatus()

function createSupabaseClient(): SupabaseClient {
  const config = getSupabaseConfig()

  if (!config.isConfigured) {
    return createClient(PLACEHOLDER_URL, 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  return createClient(config.url!, rawAnonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const supabase = createSupabaseClient()
