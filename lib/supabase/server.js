import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * Uses the ANON key, never the service role — every query made through this
 * client runs as the signed-in user (or as an anonymous visitor) and is
 * subject to Row Level Security. That is deliberate: RLS is what stops a
 * visitor reading drafts, so we never want a client that can bypass it
 * sitting in the request path.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Session refresh is handled in proxy.js, so this is safe to skip.
          }
        },
      },
    },
  );
}
