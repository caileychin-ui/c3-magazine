import { getSiteData } from '@/lib/queries';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ArticleCard from '@/components/article-card';
import NewsletterForm from '@/components/newsletter-form';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Articles',
  description: 'All published stories from c³ Magazine.',
};

export default async function ArticlesPage() {
  const { ARTICLES, AUTHORS } = await getSiteData();

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 48px)', lineHeight: 'var(--leading-heading)', margin: '0 0 8px' }}>
          Articles
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40 }}>
          Explainers, essays, and reporting on admissions, aid, and policy.
        </p>

        {ARTICLES.length > 0 ? (
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {ARTICLES.map((a) => (
              <ArticleCard key={a.id} article={a} authors={AUTHORS} />
            ))}
          </div>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>No published stories yet.</p>
        )}

        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
