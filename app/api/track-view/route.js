import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * POST /api/track-view
 * Increments the view count for an article. Called client-side when
 * someone opens an article page. Uses the service role key to write
 * to the private analytics bucket.
 *
 * Body: { slug: string }
 */
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const slug = String(body.slug || '').trim();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  // Sanitize the slug for use as a filename
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '-');
  const filePath = `views/${safeSlug}.json`;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Try to download the current count file
  const { data: existing, error: downloadError } = await supabase.storage
    .from('analytics')
    .download(filePath);

  let count = 0;
  if (existing) {
    try {
      const parsed = JSON.parse(await existing.text());
      count = parsed.count || 0;
    } catch {
      count = 0;
    }
  }

  count += 1;

  // Upload the updated count
  const fileContent = JSON.stringify({ count, updatedAt: new Date().toISOString() });
  const { error: uploadError } = await supabase.storage
    .from('analytics')
    .upload(filePath, fileContent, {
      contentType: 'application/json',
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count });
}

/**
 * GET /api/track-view?slug=xxx
 * Returns the current view count for an article.
 */
export async function GET(request) {
  const slug = String(new URL(request.url).searchParams.get('slug') || '').trim();

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '-');
  const filePath = `views/${safeSlug}.json`;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await supabase.storage
    .from('analytics')
    .download(filePath);

  let count = 0;
  if (data) {
    try {
      const parsed = JSON.parse(await data.text());
      count = parsed.count || 0;
    } catch {
      count = 0;
    }
  }

  return NextResponse.json({ slug, count });
}
