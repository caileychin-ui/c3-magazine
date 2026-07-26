import { requireEditor } from '@/lib/dal';
import { getAllArticlesForAdmin, getAllIssuesForAdmin, getSubmissions, getCategories, getAuthors } from '@/lib/queries';
import { isSupabaseConfigured } from '@/lib/config';
import SetupNotice from '../setup-notice';
import { signOut } from './login/actions';
import ArticleForm, { PublishToggle } from '@/components/admin-article-form';

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

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  // The real gate. proxy.js only did a cookie check; this verifies the JWT
  // with Supabase and requires an editor role, and RLS backstops both.
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

      <section
        style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 18, margin: '0 0 14px' }}>
          Articles
        </h2>

        {articles.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)', fontSize: 15 }}>
            No articles yet. Click "New article" above to create your first one.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {articles.map((a) => (
              <li
                key={a.id}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  <PublishToggle article={a} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
