import Link from 'next/link';

export const metadata = {
  title: 'Content Guide',
  description: 'How to add and manage articles on c³ Magazine.',
};

const stepStyle = {
  background: 'var(--surface-card)',
  border: '2px solid var(--ink)',
  borderRadius: 'var(--radius-lg)',
  padding: 28,
  marginBottom: 20,
};

const stepNumStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'var(--yellow)',
  border: '2px solid var(--ink)',
  fontFamily: 'var(--font-display)',
  fontSize: 20,
  fontWeight: 700,
  marginRight: 12,
};

const codeStyle = {
  fontFamily: 'ui-monospace, monospace',
  fontSize: 14,
  background: 'var(--surface-soft)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px 16px',
  display: 'block',
  margin: '10px 0',
  overflowX: 'auto',
};

export default function ContentGuidePage() {
  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 'var(--leading-heading)', margin: '0 0 8px' }}>
          Content Guide
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40 }}>
          How to add articles, manage issues, and publish content on c³ Magazine.
        </p>

        {/* Overview */}
        <div style={{ padding: 20, background: 'var(--blue-tint)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--ink)', marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, margin: 0, color: 'var(--blue-deep)' }}>
            <strong>Quick summary:</strong> You'll create an editor account in Supabase (one-time setup),
            then log in at <Link href="/admin/login" style={{ fontWeight: 700 }}>/admin/login</Link> to write and publish articles.
            No coding required — everything is done through your browser.
          </p>
        </div>

        {/* Step 1 */}
        <div style={stepStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 16px', display: 'flex', alignItems: 'center' }}>
            <span style={stepNumStyle}>1</span> Create your editor account (one-time)
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: '0 0 12px' }}>
            Go to your Supabase dashboard and create a user account that can edit the magazine.
          </p>
          <ol style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, paddingLeft: 20, margin: '0 0 12px' }}>
            <li>
              Open{' '}
              <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx/auth/users" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                Supabase → Authentication → Users
              </a>
            </li>
            <li>Click <strong>"Add user"</strong> → enter your email and a password</li>
            <li>Click <strong>"Create user"</strong> — you'll see the new user in the list with a UUID</li>
          </ol>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: '0 0 8px' }}>
            Now give that user editor permissions:
          </p>
          <ol style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, paddingLeft: 20, margin: '0 0 12px' }}>
            <li>
              Go to{' '}
              <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx/editor" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                Supabase → Table Editor → profiles
              </a>
            </li>
            <li>Click <strong>"Insert row"</strong></li>
            <li>Set <strong>id</strong> to the user's UUID (copy from the Users page)</li>
            <li>Set <strong>email</strong> to your email</li>
            <li>Set <strong>role</strong> to <code style={{ background: 'var(--surface-soft)', padding: '2px 6px', borderRadius: 4 }}>admin</code></li>
            <li>Click <strong>"Save"</strong></li>
          </ol>
        </div>

        {/* Step 2 */}
        <div style={stepStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 16px', display: 'flex', alignItems: 'center' }}>
            <span style={stepNumStyle}>2</span> Log in to the Studio
          </h2>
          <ol style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, paddingLeft: 20, margin: '0 0 12px' }}>
            <li>Go to{' '}
              <Link href="/admin/login" style={{ fontWeight: 600 }}>c3-magazine.vercel.app/admin/login</Link>
            </li>
            <li>Enter the email and password you created in Step 1</li>
            <li>Click <strong>"Enter studio"</strong></li>
          </ol>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
            You'll see the dashboard with article stats, a "New article" button, and your existing articles.
          </p>
        </div>

        {/* Step 3 */}
        <div style={stepStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 16px', display: 'flex', alignItems: 'center' }}>
            <span style={stepNumStyle}>3</span> Write an article
          </h2>
          <ol style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, paddingLeft: 20, margin: '0 0 12px' }}>
            <li>Click <strong>"+ New article"</strong></li>
            <li>Fill in the form:
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li><strong>Title</strong> — the headline</li>
                <li><strong>Slug</strong> — the URL (e.g. <code style={{ background: 'var(--surface-soft)', padding: '2px 6px', borderRadius: 4 }}>ivies-hardest-ever</code>)</li>
                <li><strong>Subtitle</strong> — one line under the title</li>
                <li><strong>Summary</strong> — appears on the card grid</li>
                <li><strong>Category</strong> — pick from the dropdown</li>
                <li><strong>Author</strong> — pick from the dropdown</li>
                <li><strong>Content</strong> — write in <strong>Markdown</strong> (see below)</li>
                <li><strong>Status</strong> — choose "Draft" to hide, "Published" to show on the site</li>
              </ul>
            </li>
            <li>Click <strong>"Create article"</strong></li>
          </ol>
        </div>

        {/* Step 4 */}
        <div style={stepStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 16px', display: 'flex', alignItems: 'center' }}>
            <span style={stepNumStyle}>4</span> Publish or unpublish
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            In the article list, each article has a <strong>Publish</strong> or <strong>Unpublish</strong> button.
            Click it to toggle visibility. Published articles appear on the public site immediately.
          </p>
        </div>

        {/* Markdown cheat sheet */}
        <div style={stepStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 16px' }}>
            Markdown cheat sheet
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: '0 0 12px' }}>
            Use these simple formatting codes in the Content field:
          </p>
          <pre style={codeStyle}>{`## Section heading

**Bold text**
*Italic text*

> Pull quote (the indented callout box)

- Bullet point
- Another point

1. Numbered item
2. Second item

[A link](https://example.com)`}</pre>
        </div>

        {/* Add authors/categories */}
        <div style={stepStyle}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 16px' }}>
            Adding authors & categories
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: '0 0 12px' }}>
            Before you can select an author or category in the article form, they need to exist in the database.
            You only need to do this once for each new author or category.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: '0 0 8px' }}>
            <strong>To add an author:</strong>
          </p>
          <ol style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, paddingLeft: 20, margin: '0 0 12px' }}>
            <li>Go to{' '}
              <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx/editor" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                Supabase → Table Editor → authors
              </a>
            </li>
            <li>Click <strong>"Insert row"</strong></li>
            <li>Fill in: <strong>name</strong>, <strong>role</strong> (e.g. "Staff writer"), <strong>bio</strong></li>
            <li>Click <strong>"Save"</strong></li>
          </ol>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, margin: '0 0 8px' }}>
            <strong>To add a category:</strong>
          </p>
          <ol style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
            <li>Go to{' '}
              <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx/editor" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                Supabase → Table Editor → categories
              </a>
            </li>
            <li>Click <strong>"Insert row"</strong></li>
            <li>Fill in: <strong>name</strong> (e.g. "Admissions"), <strong>slug</strong> (e.g. "admissions"),
              <strong>color_token</strong> (use one: admissions, financial-aid, policy, international, essays, campus, data)</li>
            <li>Click <strong>"Save"</strong></li>
          </ol>
        </div>

        {/* Links */}
        <div style={{ ...stepStyle, background: 'var(--surface-soft)' }}>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, margin: '0 0 16px' }}>
            Your links
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-body)', fontSize: 16 }}>
            <a href="https://c3-magazine.vercel.app" style={{ fontWeight: 600 }}>🌐 Your live website: c3-magazine.vercel.app</a>
            <a href="https://c3-magazine.vercel.app/admin/login" style={{ fontWeight: 600 }}>🔑 Admin login: c3-magazine.vercel.app/admin/login</a>
            <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx" style={{ fontWeight: 600 }}>🗄️ Supabase dashboard</a>
            <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx/auth/users" style={{ fontWeight: 600 }}>👤 Supabase → Users (create editor account)</a>
            <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx/editor" style={{ fontWeight: 600 }}>📋 Supabase → Table Editor (add authors/categories)</a>
            <a href="https://github.com/caileychin-ui/c3-magazine" style={{ fontWeight: 600 }}>📦 GitHub repo (code)</a>
          </div>
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
            textDecoration: 'none', background: 'var(--ink)', color: '#fff',
            padding: '14px 28px', borderRadius: 'var(--radius-pill)',
            display: 'inline-block',
          }}>
            ← Back to c³
          </Link>
        </div>
      </div>
    </>
  );
}
