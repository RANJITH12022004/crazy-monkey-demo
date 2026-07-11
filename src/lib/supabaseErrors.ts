import type { PostgrestError } from '@supabase/supabase-js'
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase'

export type SupabaseErrorKind =
  | 'not_configured'
  | 'network_unreachable'
  | 'table_not_found'
  | 'permission_denied'
  | 'empty_data'
  | 'unknown'

export class DataFetchError extends Error {
  readonly kind: SupabaseErrorKind
  readonly table?: string
  readonly hint?: string

  constructor(
    kind: SupabaseErrorKind,
    message: string,
    options?: { table?: string; hint?: string; cause?: unknown },
  ) {
    super(message, { cause: options?.cause })
    this.name = 'DataFetchError'
    this.kind = kind
    this.table = options?.table
    this.hint = options?.hint
  }
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    ('code' in error || 'details' in error)
  )
}

function isNetworkFetchError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return /failed to fetch|networkerror|load failed/i.test(error.message)
  }

  if (error instanceof Error) {
    return /failed to fetch|networkerror|load failed/i.test(error.message)
  }

  return false
}

export function classifySupabaseError(
  error: unknown,
  context?: { table?: string; operation?: string },
): DataFetchError {
  const table = context?.table
  const operation = context?.operation ?? 'query'

  if (!isSupabaseConfigured()) {
    return new DataFetchError(
      'not_configured',
      'Supabase credentials are missing or still set to placeholder values.',
      {
        table,
        hint:
          'Copy .env.example to .env, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (JWT anon key), then restart npm run dev.',
      },
    )
  }

  if (isNetworkFetchError(error)) {
    const { url } = getSupabaseConfig()
    return new DataFetchError(
      'network_unreachable',
      `Cannot reach Supabase at ${url ?? 'unknown URL'}.`,
      {
        table,
        cause: error,
        hint:
          'Verify the project URL, check your internet connection, and confirm the Supabase project is not paused in the dashboard.',
      },
    )
  }

  if (isPostgrestError(error)) {
    const code = error.code ?? ''
    const message = error.message ?? 'Unknown database error'
    const combined = `${code} ${message} ${error.details ?? ''} ${error.hint ?? ''}`.toLowerCase()

    if (
      code === 'PGRST205' ||
      code === '42P01' ||
      combined.includes('does not exist') ||
      combined.includes('could not find the table')
    ) {
      return new DataFetchError(
        'table_not_found',
        table
          ? `Table "${table}" was not found in Supabase.`
          : `A required table was not found in Supabase.`,
        {
          table,
          cause: error,
          hint: `Run the migration SQL files in supabase/migrations/ (001, 002, 003) against your project.`,
        },
      )
    }

    if (
      code === '42501' ||
      combined.includes('permission denied') ||
      combined.includes('row-level security')
    ) {
      return new DataFetchError(
        'permission_denied',
        `Permission denied while running ${operation}${table ? ` on "${table}"` : ''}.`,
        {
          table,
          cause: error,
          hint: 'Check Row Level Security policies allow anon SELECT on demo tables.',
        },
      )
    }

    return new DataFetchError('unknown', message, { table, cause: error, hint: error.hint ?? undefined })
  }

  if (error instanceof Error) {
    return new DataFetchError('unknown', error.message, { table, cause: error })
  }

  return new DataFetchError('unknown', 'An unexpected error occurred while loading data.', { table })
}

export function assertNonEmpty<T>(
  rows: T[] | null | undefined,
  table: string,
  migrationFile: string,
): T[] {
  const data = rows ?? []

  if (data.length === 0) {
    throw new DataFetchError(
      'empty_data',
      `No rows found in "${table}".`,
      {
        table,
        hint: `Seed data is missing. Run ${migrationFile} in the Supabase SQL Editor.`,
      },
    )
  }

  return data
}

export function getErrorTitle(kind: SupabaseErrorKind): string {
  switch (kind) {
    case 'not_configured':
      return 'Supabase not configured'
    case 'network_unreachable':
      return 'Cannot reach Supabase'
    case 'table_not_found':
      return 'Database table missing'
    case 'permission_denied':
      return 'Database permission denied'
    case 'empty_data':
      return 'No demo data found'
    default:
      return 'Could not load data'
  }
}

export function normalizeFetchError(error: unknown, context?: { table?: string; operation?: string }): DataFetchError {
  if (error instanceof DataFetchError) return error
  return classifySupabaseError(error, context)
}
