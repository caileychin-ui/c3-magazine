import { createClient } from '@supabase/supabase-js';

/**
 * Fetches view counts for all articles from the analytics storage bucket.
 * Returns a map of slug -> count.
 * Called server-side from the admin dashboard.
 */
export async function getViewCounts(slugs) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const counts = {};

  await Promise.all(
    slugs.map(async (slug) => {
      const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '-');
      try {
        const { data, error } = await supabase.storage
          .from('analytics')
          .download(`views/${safeSlug}.json`);

        if (data) {
          const parsed = JSON.parse(await data.text());
          counts[slug] = parsed.count || 0;
        } else {
          counts[slug] = 0;
        }
      } catch {
        counts[slug] = 0;
      }
    })
  );

  return counts;
}
