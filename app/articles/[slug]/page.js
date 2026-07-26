import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAuthors, getSiteData } from '@/lib/queries';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import MarkdownRenderer from '@/components/markdown';
import ArticleCard from '@/components/article-card';

export const dynamic = 'force-dynamic';

const CATMAP = {
  admissions: { label: 'Admissions', bg: 'var(--blue-tint)', text: 'var(--blue-deep)' },
  'financial-aid': { label: 'Financial aid', bg: 'var(--mint-tint)', text: 'var(--mint-deep)' },
  policy: { label: 'Policy', bg: 'var(--coral-tint)', text: 'var(--coral-deep)' },
  international: { label: 'International', bg: 'var(--lavender-tint)', text: 'var(--lavender-deep)' },
  essays: { label: 'Student essays', bg: 'var(--pink-tint)', text: 'var(--pink-deep)' },
  campus: { label: 'Campus culture', bg: 'var(--tangerine-tint)', text: 'var(--tangerine-deep)' },
  data: { label: 'Data & explainers', bg: 'var(--lime-tint)', text: 'var(--lime-deep)' },
};

function fmtDate(d) {
  if (!d) return '';
  const p = String(d).split('-');
  if (p.length < 3) return d;
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(p[1]) - 1];
  return `${mo} ${Number(p[2])}, ${p[0]}`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.summary || article.subtitle || '' };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const { ARTICLES } = await getSiteData();
  const related = (article.relatedArticleIds || [])
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter(Boolean);

  const cat = CATMAP[article.category] || { label: article.categoryName || 'Story', bg: 'var(--surface-soft)', text: 'var(--ink-soft)' };
  const author = article.authorObj || (await getAuthors()).find((a) => a.id === article.author);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px' }}>
        {/* Breadcrumb */}
        <Link href="/articles" style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← All articles
        </Link>

        {/* Category badge */}
        <span style={{
          display: 'inline-block', marginTop: 20,
          fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
          background: cat.bg, color: cat.text,
          padding: '5px 12px', borderRadius: 'var(--radius-pill)',
        }}>
          {cat.label}
        </span>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)',
          lineHeight: 'var(--leading-heading)', margin: '16px 0 8px',
        }}>
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 20,
            color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.5,
          }}>
            {article.subtitle}
          </p>
        )}

        {/* Meta */}
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-caption)',
          marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--border)',
        }}>
          {author?.name && <span>{author.name}</span>}
          {article.publishDate && <span> · {fmtDate(article.publishDate)}</span>}
          {article.readingTime && <span> · {article.readingTime}</span>}
        </div>

        {/* Content */}
        <MarkdownRenderer content={article.markdownContent} />

        {/* Citations */}
        {article.citations?.length > 0 && (
          <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--track-tag)', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Citations
            </h2>
            <ol style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {article.citations.map((c) => (
                <li key={c.id} id={`cite-${c.marker}`} style={{ marginBottom: 8 }}>
                  {c.title}. {c.author}. {c.publication}.
                  {c.url && c.url !== 'https://example.com' && (
                    <> <a href={c.url} target="_blank" rel="noopener noreferrer">{c.url}</a>.</>
                  )}
                  {c.note && <em> {c.note}</em>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Editor's note */}
        {article.editorNote && (
          <section style={{ marginTop: 32, padding: 20, background: 'var(--surface-soft)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ fontFamily: 'var(--font-ui)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 'var(--track-tag)' }}>Editor's note</strong>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 8, margin: 0 }}>{article.editorNote}</p>
          </section>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--track-tag)', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Related
            </h2>
            <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {related.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
