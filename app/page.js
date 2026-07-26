import Link from 'next/link';
import { getSiteData } from '@/lib/queries';
import { isSupabaseConfigured } from '@/lib/config';
import SetupNotice from './setup-notice';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ArticleCard from '@/components/article-card';
import NewsletterForm from '@/components/newsletter-form';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const { ARTICLES, ISSUES, AUTHORS } = await getSiteData();

  const featured = ARTICLES.find((a) => a.featured) || ARTICLES[0] || null;
  const rest = ARTICLES.filter((a) => a.id !== featured?.id).slice(0, 6);
  const latestIssue = ISSUES[0] || null;

  return (
    <>
      <Navbar />

      <main>
        {/* ---------------------------------------------------------- hero -- */}
        <section
          style={{
            position: 'relative',
            padding: '72px 24px 56px',
            maxWidth: 1100,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--track-tag)',
              background: 'var(--yellow)',
              border: '2px solid var(--ink)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 16px',
              boxShadow: 'var(--shadow-sticker)',
            }}
          >
            An education magazine
          </span>

          <h1
            className="c3-fluid-hero"
            style={{
              fontFamily: 'var(--font-display)',
              lineHeight: 'var(--leading-heading)',
              margin: '22px 0 14px',
            }}
          >
            College access, decoded.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 19,
              color: 'var(--text-secondary)',
              maxWidth: 620,
              margin: '0 auto 28px',
            }}
          >
            Everything you&rsquo;re expected to figure out alone, broken down.
          </p>

          <NewsletterForm />
        </section>

        {/* ------------------------------------------------------ featured -- */}
        {featured && (
          <section style={{ padding: '0 24px 56px', maxWidth: 1100, margin: '0 auto' }}>
            <ArticleCard article={featured} authors={AUTHORS} featured />
          </section>
        )}

        {/* --------------------------------------------------------- grid -- */}
        {rest.length > 0 && (
          <section style={{ padding: '0 24px 64px', maxWidth: 1100, margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 15,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--track-tag)',
                color: 'var(--text-secondary)',
                margin: '0 0 20px',
              }}
            >
              Latest
            </h2>
            <div
              style={{
                display: 'grid',
                gap: 20,
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              }}
            >
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} authors={AUTHORS} />
              ))}
            </div>
          </section>
        )}

        {/* -------------------------------------------------- empty state --- */}
        {ARTICLES.length === 0 && (
          <section
            style={{
              padding: '0 24px 80px',
              maxWidth: 620,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                background: '#fff',
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 40,
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, margin: '0 0 8px' }}>
                No published stories yet
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 15,
                  color: 'var(--text-secondary)',
                  margin: '0 0 18px',
                }}
              >
                Drafts stay private until you publish them from the studio.
              </p>
              <Link
                href="/admin"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: 'none',
                  background: 'var(--ink)',
                  color: '#fff',
                  padding: '12px 22px',
                  borderRadius: 'var(--radius-pill)',
                  display: 'inline-block',
                }}
              >
                Open the studio
              </Link>
            </div>
          </section>
        )}

        {/* -------------------------------------------------- latest issue -- */}
        {latestIssue && (
          <section style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
            <Link href="/issues" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  background: latestIssue.color || 'var(--yellow)',
                  border: '2px solid var(--ink)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sticker)',
                  padding: '32px 28px',
                  cursor: 'pointer',
                  transition: 'transform var(--dur-med) var(--ease-bubble), box-shadow var(--dur-med) var(--ease-smooth)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--track-tag)',
                  }}
                >
                  Issue {latestIssue.number} · {latestIssue.season} {latestIssue.year}
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, margin: '8px 0 10px' }}>
                  {latestIssue.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 16,
                    maxWidth: 620,
                    margin: '0 0 14px',
                    color: 'var(--ink-soft)',
                  }}
                >
                  {latestIssue.description}
                </p>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Browse all issues →
                </span>
              </div>
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
