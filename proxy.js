import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/config';

/**
 * Proxy (called Middleware before Next.js 16).
 *
 * Two jobs:
 *   1. Refresh the Supabase auth cookie so sessions don't expire mid-visit.
 *      Server Components can't write cookies, so this is the only place the
 *      refreshed token can be persisted.
 *   2. An OPTIMISTIC redirect away from /admin for visitors with no session.
 *
 * Job 2 is a UX nicety, not a security control — it only inspects a cookie and
 * runs on prefetches too. Real authorization lives in lib/dal.js and in
 * Postgres RLS. Do not add database checks here.
 */
export async function proxy(request) {
  // Before .env.local has keys there is no auth to refresh and nothing to
  // protect — pass through so the app boots and shows the setup screen rather
  // than a 500 on every route.
  if (!isSupabaseConfigured()) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refreshes the session cookie as a side effect. Must not be removed.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname === '/admin/login';

  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    // Preserve where they were headed so login can bounce them back.
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files. Auth guidance is to run
     * on all routes so the session cookie is refreshed site-wide, not only
     * under /admin.
     */
    '/((?!_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|otf|woff2?)$).*)',
  ],
};
