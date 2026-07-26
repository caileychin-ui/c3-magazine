'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for Client Components (the admin studio's interactive bits,
 * the sign-in form).
 *
 * The anon key ships to the browser by design — it identifies the project, it
 * does not authorise anything. Row Level Security decides what this client can
 * actually see or change.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
