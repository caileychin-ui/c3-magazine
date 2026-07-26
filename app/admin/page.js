import { requireEditor } from '@/lib/dal';
import { getAllArticlesForAdmin, getAllIssuesForAdmin, getSubmissions, getCategories, getAuthors } from '@/lib/queries';
import { isSupabaseConfigured } from '@/lib/config';
import SetupNotice from '../setup-notice';
import { signOut } from './login/actions';
import ArticleForm, { EditArticleForm, PublishToggle, DeleteButton } from '@/components/admin-article-form';
import AuthorForm from '@/components/admin-author-form';
import IssueForm from '@/components/admin-issue-form';

export const metadata = { title: 'Studio' };

// Never cache the admin surface — it shows drafts and per-user data.
export const dynamic = 'force-dynamic';

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: color,
        border: '2px solid var(--ink)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-sticker)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1 }}>{value}</div>
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--track-tag)',
          color: 'var(--text-secondary)',
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

const sectionStyle = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 20,
};

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const { profile } = await requireEditor();

  const [articles, issues, submissions, categories, authors] = await Promise.all([
    getAllArticlesForAdmin(),
    getAllIssuesForAdmin(),
    getSubmissions(),
    getCategories(),
    getAuthors(),
  ]);

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    drafts: articles.filter((a) => a.status === 'draft').length,
    issues: issues.length,
  };

  const newSubs = submissions.filter((s) => s.status === 'new').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg)', padding: '28px 24px' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, margin: 0 }}>c³ studio</h1>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              color: 'var(--text-secondary)',
              margin: '4px 0 0',
            }}
          >
            Signed in as {profile.email} · {profile.role}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid var(--ink)',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Log out
          </button>
        </form>
      </header>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          marginBottom: 28,
        }}
      >
        <StatCard label="Total articles" value={stats.total} color="var(--blue-tint)" />
        <StatCard label="Published" value={stats.published} color="var(--mint-tint)" />
        <StatCard label="Drafts" value={stats.drafts} color="var(--tangerine-tint)" />
        <StatCard label="Issues" value={stats.issues} color="var(--yellow-tint)" />
        <StatCard label="New submissions" value={newSubs} color="var(--pink-tint)" />
      </div>

      <section style={{ marginBottom: 24 }}>
        <ArticleForm categories={categories} authors={authors} issues={issues} />
      </section>

      <section style={{ marginBottom: 24, ...sectionStyle }}>
        <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 18, margin: '0 0 14px' }}>
          Articles
        </h2>

        {articles.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)', fontSize: 15 }}>
            No articles yet. Click &ldquo;New article&rdquo; above to create your first one.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {articles.map((a) => (
              <li key={a.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-soft)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600 }}>
                    {a.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--track-tag)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        background:
                          a.status === 'published' ? 'var(--mint-tint)' : 'var(--tangerine-tint)',
                        color:
                          a.status === 'published' ? 'var(--mint-deep)' : 'var(--tangerine-deep)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {a.status}
                    </span>
                    <EditArticleForm article={a} categories={categories} authors={authors} issues={issues} />
                    <PublishToggle article={a} />
                    <DeleteButton article={a} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        <section style={sectionStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 18, margin: '0 0 14px' }}>
            Authors
          </h2>
          {authors.length > 0 && (
            <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0, display: 'grid', gap: 6 }}>
              {authors.map((a) => (
                <li key={a.id} style={{ fontFamily: 'var(--font-ui)', fontSize: 14, padding: '6px 10px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                  {a.name}{a.role ? ` — ${a.role}` : ''}
                </li>
              ))}
            </ul>
          )}
          <AuthorForm />
        </section>

        <section style={sectionStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 18, margin: '0 0 14px' }}>
            Issues
          </h2>
          {issues.length > 0 && (
            <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0, display: 'grid', gap: 6 }}>
              {issues.map((i) => (
                <li key={i.id} style={{ fontFamily: 'var(--font-ui)', fontSize: 14, padding: '6px 10px', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
                  {i.number ? `№ ${i.number}: ` : ''}{i.title}{i.published ? '' : ' (draft)'}
                </li>
              ))}
            </ul>
          )}
          <IssueForm />
        </section>
      </div>
    </div>
  );
}
