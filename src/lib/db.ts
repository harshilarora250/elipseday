import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-only Supabase client (uses the SERVICE ROLE key so we bypass RLS and
// can both read public content and write from /admin). Never expose this key
// to the client — set it as a Server-only env var in Vercel.
//
// Constructed lazily so `next build` never requires the env vars; the client is
// only created at request time.

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    // Accept either our explicit names OR Supabase's standard quickstart names,
    // so the site renders regardless of which convention you used in Vercel.
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new Error(
        'Missing Supabase env vars. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (preferred), ' +
          'or the standard NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    }
    _client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}
