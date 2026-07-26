/**
 * Is Supabase wired up yet?
 *
 * Lets the app boot and build before .env.local has real keys, so you can run
 * `npm run dev` immediately and see a setup screen instead of a stack trace.
 * Every page that reads from the database checks this first.
 */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
