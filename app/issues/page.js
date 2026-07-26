import Link from 'next/link';
import { getIssues, getPublishedArticles } from '@/lib/queries';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Issues',
  description: 'Past issues of c³ Magazine.',
};

function fmtDate(d) {
  if (!d) return '';
  const p = String(d).split('-');
  if (p.length < 3) return d;
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(p[1]) - 1];
  return `${mo} ${Number(p[2])}, ${p[0]}`;
}

export default async function IssuesPage() {
  const [issues, articles] = await Promise.all([getIssues(), getPublishedArticles()]);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 48px)', lineHeight: 'var(--leading-heading)', margin: '0 0 8px' }}>
          Issues
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40 }}>
          Each issue collects our reporting into a themed edition.
        </p>

        {issues.map((issue) => {
          const issueArticles = (issue.articleIds || [])
            .map((id) => articles.find((a) => a.id === id))
            .filter(Boolean);

          return (
            <div key={issue.id} style={{
              background: issue.color || 'var(--yellow)',
              border: '2px solid var(--ink)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sticker)',
              padding: '32px 28px',
              marginBottom: 24,
            }}>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
              }}>
                Issue {issue.number} · {issue.season} {issue.year}
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, margin: '8px 0 10px' }}>
                {issue.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, maxWidth: 620, margin: '0 0 20px', color: 'var(--ink-soft)' }}>
                {issue.description}
              </p>

              {issueArticles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {issueArticles.map((a) => (
                    <Link key={a.id} href={`/articles/${a.slug}`} style={{
                      fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
                      textDecoration: 'none', color: 'var(--ink)',
                      background: 'rgba(255,255,255,0.5)',
                      padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--ink)',
                    }}>
                      {a.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
