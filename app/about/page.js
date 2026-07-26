import { getSiteData } from '@/lib/queries';
import { FALLBACK_STAFF } from '@/lib/fallback-data';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import NewsletterForm from '@/components/newsletter-form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About',
  description: 'c³ — college access, decoded. A student-led magazine about admissions, aid, and policy.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 48px)', lineHeight: 'var(--leading-heading)', margin: '0 0 20px' }}>
          About c³
        </h1>

        <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
          <p style={{ margin: '0 0 18px' }}>
            <strong>c³</strong> — <em>college access, decoded</em> — is a student-led magazine about
            admissions, financial aid, higher-ed policy, and the institutions students are expected
            to understand without help.
          </p>
          <p style={{ margin: '0 0 18px' }}>
            We explain how these systems actually work, we platform student voices, and we try to
            make something confusing feel a little more human.
          </p>
          <blockquote style={{
            borderLeft: '3px solid var(--ink)', margin: '24px 0', padding: '8px 20px',
            fontFamily: 'var(--font-body)', fontSize: 18, fontStyle: 'italic',
            color: 'var(--text-secondary)',
          }}>
            c³ exists to decode those systems — and to make them feel navigable for the students
            who were never handed the map.
          </blockquote>
        </div>

        {/* Masthead */}
        <section style={{ marginTop: 56 }}>
          <h2 style={{
            fontFamily: 'var(--font-headline)', fontSize: 16, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
            color: 'var(--text-secondary)', marginBottom: 24,
          }}>
            Masthead
          </h2>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {FALLBACK_STAFF.map((person) => (
              <div key={person.id} style={{
                background: 'var(--surface-card)', border: '2px solid var(--ink)',
                borderRadius: 'var(--radius-lg)', padding: 24,
              }}>
                <div style={{
                  display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: 12,
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
                  background: person.color, color: person.textColor,
                  padding: '5px 12px', borderRadius: 'var(--radius-pill)', marginBottom: 12,
                }}>
                  {person.role}
                </div>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 4px' }}>
                  {person.name}
                </h3>
                {person.handle && (
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-caption)', margin: '0 0 12px' }}>
                    {person.handle}
                  </p>
                )}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {person.bio}
                </p>
                {person.accomplishments?.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    {person.accomplishments.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
