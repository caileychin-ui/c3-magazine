import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Data Access Layer — the real authorization boundary.
 *
 * proxy.js does a cheap cookie check to bounce obvious strangers, but the Next
 * docs are explicit that proxy must not be the only gate: it runs on prefetches
 * and cannot safely hit the database. So every admin page and every server
 * action calls into here, and Postgres RLS backstops both.
 *
 * Three layers, each of which must independently fail before data leaks:
 *   1. proxy.js       — optimistic redirect, no DB
 *   2. this DAL       — verified session + editor role
 *   3. RLS in Postgres — enforced even if 1 and 2 are bypassed
 */

/**
 * Returns the signed-in user, or null. Memoised per render pass so calling it
 * from several components in one request costs a single round trip.
 *
 * Uses getUser(), NOT getSession(): getSession reads the cookie without
 * verifying it, so a forged cookie would pass. getUser revalidates the JWT
 * against Supabase Auth.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});

/**
 * Returns { user, profile } for a signed-in editor, or null for everyone else.
 * The role lives in the profiles table, not in the JWT, so a user cannot
 * promote themselves by tampering with a token.
 */
export const getEditor = cache(async () => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', user.id)
    .single();

  if (error || !profile) return null;
  if (profile.role !== 'editor' && profile.role !== 'admin') return null;

  return { user, profile };
});

/**
 * Hard gate for admin pages and server actions. Redirects instead of returning
 * null so a caller cannot accidentally continue on a falsy value.
 *
 * If the user is signed in but has no profile row (first-time setup), redirects
 * to /admin/setup so they can grant themselves admin access.
 */
export async function requireEditor() {
  const editor = await getEditor();
  if (editor) return editor;

  // Check if user is signed in but just missing a profile
  const user = await getUser();
  if (user) redirect('/admin/setup');

  redirect('/admin/login');
}
