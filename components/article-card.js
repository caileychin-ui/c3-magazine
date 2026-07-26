import Link from 'next/link';

/** Category colour token -> the CSS vars defined in globals.css. */
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
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
    Number(p[1]) - 1
  ];
  return `${mo} ${Number(p[2])}, ${p[0]}`;
}

export default function ArticleCard({ article, authors = [], featured = false }) {
  const cat = CATMAP[article.category] || {
    label: article.categoryName || 'Story',
    bg: 'var(--surface-soft)',
    text: 'var(--ink-soft)',
  };

  const author =
    article.authorObj || authors.find((a) => a.id === article.author) || null;

  return (
    <article
      style={{
        background: 'var(--surface-card)',
        border: '2px solid var(--ink)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: featured ? 'var(--shadow-sticker)' : 'var(--shadow-card)',
        padding: featured ? '32px 30px' : '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        height: '100%',
      }}
    >
      <span
        style={{
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--track-tag)',
          background: cat.bg,
          color: cat.text,
          padding: '5px 12px',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        {cat.label}
      </span>

      <h3
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: featured ? 32 : 20,
          lineHeight: 'var(--leading-heading)',
          margin: 0,
        }}
      >
        <Link
          href={`/articles/${article.slug}`}
          style={{ color: 'var(--ink)', textDecoration: 'none' }}
        >
          {article.title}
        </Link>
      </h3>

      {article.summary && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: featured ? 17 : 15,
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {article.summary}
        </p>
      )}

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 8,
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text-caption)',
        }}
      >
        {author?.name && <span>{author.name}</span>}
        {author?.name && article.publishDate && <span> · </span>}
        {article.publishDate && <time dateTime={article.publishDate}>{fmtDate(article.publishDate)}</time>}
        {article.readingTime && <span> · {article.readingTime}</span>}
      </div>
    </article>
  );
}
