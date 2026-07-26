'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

/**
 * Real handlers for the three forms that were demo-only in the prototype:
 * newsletter signup, contributor application, and story pitch.
 *
 * The RLS insert policy on `submissions` and `subscribers` is intentionally
 * open — anonymous visitors must be able to write. That makes these the most
 * abusable surface on the site, so each action applies:
 *
 *   1. a honeypot field bots fill in and humans never see
 *   2. a per-IP in-memory rate limit
 *   3. server-side validation (never trust the client's checks)
 *
 * The rate limiter is per-instance memory. That is fine for a magazine's
 * traffic but resets on deploy and doesn't coordinate across serverless
 * instances. If spam becomes a real problem, move to Upstash Redis or put
 * Cloudflare Turnstile in front — see README.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

async function rateLimited() {
  const h = await headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const rec = hits.get(ip);

  if (!rec || now - rec.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }

  rec.count += 1;

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now - v.start > WINDOW_MS) hits.delete(k);
  }

  return rec.count > MAX_PER_WINDOW;
}

function validEmail(v) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v || '').trim());
}

/** Bots fill hidden fields; a filled honeypot is a silent success. */
function isBot(formData) {
  return Boolean(String(formData.get('website') || '').trim());
}

/* ------------------------------------------------------------ newsletter --- */

export async function subscribe(prevState, formData) {
  if (isBot(formData)) return { ok: true };
  if (await rateLimited()) {
    return { ok: false, error: 'Too many attempts. Try again in a minute.' };
  }

  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!validEmail(email)) {
    return { ok: false, error: 'That email address does not look right.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('subscribers').insert({ email });

  // 23505 = unique violation. Already subscribed is a success from the
  // visitor's point of view, and saying otherwise leaks who's on the list.
  if (error && error.code !== '23505') {
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }

  return { ok: true, message: "You're on the list." };
}

/* ------------------------------------------------------ pitch / contribute -- */

async function insertSubmission(kind, fields) {
  const supabase = await createClient();
  const { error } = await supabase.from('submissions').insert({ kind, ...fields });
  if (error) return { ok: false, error: 'Something went wrong. Please try again.' };
  return { ok: true };
}

export async function submitPitch(prevState, formData) {
  if (isBot(formData)) return { ok: true };
  if (await rateLimited()) {
    return { ok: false, error: 'Too many attempts. Try again in a minute.' };
  }

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const angle = String(formData.get('angle') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name) return { ok: false, error: 'Tell us your name.' };
  if (!validEmail(email)) return { ok: false, error: 'That email address does not look right.' };
  if (!angle) return { ok: false, error: 'What is the story?' };

  const res = await insertSubmission('pitch', { name, email, angle, message });
  if (!res.ok) return res;

  return { ok: true, message: "Pitch received — we read every one." };
}

export async function submitApplication(prevState, formData) {
  if (isBot(formData)) return { ok: true };
  if (await rateLimited()) {
    return { ok: false, error: 'Too many attempts. Try again in a minute.' };
  }

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const role = String(formData.get('role') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name) return { ok: false, error: 'Tell us your name.' };
  if (!validEmail(email)) return { ok: false, error: 'That email address does not look right.' };

  const res = await insertSubmission('apply', { name, email, role, message });
  if (!res.ok) return res;

  return { ok: true, message: "Application received. We'll be in touch." };
}
