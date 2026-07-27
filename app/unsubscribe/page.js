import { createServerClient } from '@supabase/ssr';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const dynamic = 'force-dynamic';

/**
 * Unsubscribe page. Accessed via ?email=foo@bar.com link in emails.
 * GET  — shows confirmation page with an unsubscribe button.
 * POST — marks the subscriber as unsubscribed (sets unsubscribed_at).
 */
export default async function UnsubscribePage({ searchParams }) {
  const { email } = await searchParams;
  const emailRaw = String(email || '').trim().toLowerCase();

  let alreadyUnsubscribed = false;
  let notFound = false;

  if (emailRaw) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data } = await supabase
      .from('subscribers')
      .select('email, unsubscribed_at')
      .eq('email', emailRaw)
      .single();

    if (data) {
      if (data.unsubscribed_at) alreadyUnsubscribed = true;
    } else {
      notFound = true;
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 520, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 'var(--leading-heading)', margin: '0 0 16px' }}>
          {alreadyUnsubscribed ? "You're already unsubscribed" : notFound ? "Email not found" : "Unsubscribe"}
        </h1>

        {alreadyUnsubscribed && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 24px' }}>
            You won't receive any more emails from c³ Magazine.
          </p>
        )}

        {notFound && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 24px' }}>
            We couldn't find that email in our subscriber list. You may have already unsubscribed, or the link may have expired.
          </p>
        )}

        {!alreadyUnsubscribed && !notFound && emailRaw && (
          <>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 28px' }}>
              Confirm that you want to stop receiving new article notifications from c³ Magazine at <strong>{emailRaw}</strong>.
            </p>
            <form action="/api/unsubscribe" method="POST">
              <input type="hidden" name="email" value={emailRaw} />
              <button type="submit" style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                background: 'var(--ink)', color: '#fff', border: 'none',
                padding: '14px 32px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
              }}>
                Yes, unsubscribe me
              </button>
            </form>
          </>
        )}

        {!emailRaw && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-secondary)', margin: '0 0 24px' }}>
            No email address was provided. Please use the unsubscribe link from your email.
          </p>
        )}

        <p style={{ marginTop: 32 }}>
          <a href="/" style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--blue-deep)' }}>
            ← Back to c³ Magazine
          </a>
        </p>
      </main>
      <Footer />
    </>
  );
}
