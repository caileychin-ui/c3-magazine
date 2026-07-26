'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Auto-setup: called when an authenticated user without a profile row
 * visits /admin. If the service role key is configured, this creates
 * the profile row and grants admin role.
 *
 * This only works if SUPABASE_SERVICE_ROLE_KEY is set in the environment.
 */
export async function autoSetupProfile() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return { error: 'Service role key not configured. See /content-guide for setup instructions.' };
  }

  const supabase = await createClient();
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { error: 'You must be signed in first.' };
  }

  // Use the service role key to bypass RLS and insert the profile
  const { createClient: createSupabase } = await import('@supabase/supabase-js');
  const adminClient = createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Check if profile already exists
  const { data: existing } = await adminClient
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) {
    // Profile exists, just make sure it has admin role
    await adminClient
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);
  } else {
    // Create the profile
    const { error: insertErr } = await adminClient
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        role: 'admin',
      });

    if (insertErr) {
      return { error: 'Failed to create profile: ' + insertErr.message };
    }
  }

  revalidatePath('/', 'layout');
  return { ok: true, message: 'Admin profile created. You can now manage content.' };
}

/**
 * Also confirm the user's email via the admin API.
 */
export async function confirmEmail() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return { error: 'Service role key not configured.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${user.id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_confirm: true }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { error: `Failed to confirm email: ${body}` };
  }

  return { ok: true };
}
