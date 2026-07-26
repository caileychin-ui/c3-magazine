import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  ['Articles', '/articles'],
  ['Issues', '/issues'],
  ['About', '/about'],
  ['Contribute', '/contribute'],
  ['Pitch', '/pitch'],
];

export default function Navbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,253,247,0.88)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <Image src="/c3-logo.png" alt="" width={34} height={34} priority />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink)' }}>
            c³
          </span>
        </Link>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
