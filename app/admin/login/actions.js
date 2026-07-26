'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Replaces the prototype's `if (pass === "c3admin")` check.
 *
 * Credentials are verified by Supabase Auth against a hashed password; this
 * process never sees the stored hash and the app never holds a password list.
 * Being signed in is still not sufficient to reach the studio — lib/dal.js
 * additionally requires an editor/admin role, and RLS enforces it at the
 * database.
 */
export async function signIn(prevState, formData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/admin');

  if (!email || !password) {
    return { error: 'Enter your email and password.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague: distinguishing "no such user" from "wrong password"
    // tells an attacker which emails are registered.
    return { error: 'Those credentials did not work.' };
  }

  // Only redirect to our own paths — never to an attacker-supplied host.
  const dest = next.startsWith('/') && !next.startsWith('//') ? next : '/admin';

  revalidatePath('/', 'layout');
  redirect(dest);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
