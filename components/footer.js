import Link from 'next/link';

/**
 * The prototype linked "Admin console" from the public footer and navbar.
 * That's dropped here — there's no reason to advertise the editorial login to
 * every reader. /admin still works if you type it; it's just not signposted.
 */
export default function Footer() {
  const link = {
    fontFamily: 'var(--font-ui)',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
  };

  return (
    <footer style={{ background: 'var(--ink)', color: '#fff', padding: '48px 24px 36px' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30 }}>c³</div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: 'rgba(255,255,255,0.72)',
              margin: '8px 0 0',
              lineHeight: 1.6,
            }}
          >
            Making post-secondary education legible for the students usually left
            out of the conversation.
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link href="/articles" style={link}>Articles</Link>
          <Link href="/issues" style={link}>Issues</Link>
          <Link href="/about" style={link}>About</Link>
          <Link href="/contribute" style={link}>Contribute</Link>
          <Link href="/pitch" style={link}>Pitch a story</Link>
        </nav>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: '32px auto 0',
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.16)',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        © {new Date().getFullYear()} c³ Magazine
      </div>
    </footer>
  );
}
