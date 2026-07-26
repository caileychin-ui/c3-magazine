/**
 * Shown instead of page content while .env.local has no Supabase keys, so the
 * app runs from the first `npm run dev` rather than crashing.
 */
export default function SetupNotice() {
  const step = {
    fontFamily: 'var(--font-ui)',
    fontSize: 15,
    lineHeight: 1.6,
    margin: '0 0 10px',
  };

  const code = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 13,
    background: 'var(--surface-soft)',
    padding: '2px 7px',
    borderRadius: 6,
    border: '1px solid var(--border)',
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 560,
          background: '#fff',
          border: '2px solid var(--ink)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sticker)',
          padding: 32,
        }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, margin: '0 0 6px' }}>
          c³ — almost there
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            color: 'var(--text-secondary)',
            margin: '0 0 20px',
          }}
        >
          The site is running, but it has no database to read from yet.
        </p>

        <ol style={{ paddingLeft: 20, margin: '0 0 20px' }}>
          <li style={step}>
            Create a project at <strong>supabase.com</strong>.
          </li>
          <li style={step}>
            Open the SQL editor and run <span style={code}>supabase/schema.sql</span>.
          </li>
          <li style={step}>
            Copy your project URL and <span style={code}>anon</span> key from Project
            Settings → API into <span style={code}>.env.local</span>.
          </li>
          <li style={step}>
            Optional: <span style={code}>node scripts/seed.mjs</span> to import the demo
            articles as drafts.
          </li>
          <li style={step}>Restart the dev server.</li>
        </ol>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--text-caption)',
            margin: 0,
          }}
        >
          Full walkthrough in <span style={code}>README.md</span>.
        </p>
      </div>
    </main>
  );
}
