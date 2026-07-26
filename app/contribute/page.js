import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { FALLBACK_ROLES } from '@/lib/fallback-data';

export const metadata = {
  title: 'Contribute',
  description: 'Join c³ as a writer, editor, designer, researcher, or more.',
};

export default function ContributePage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 48px)', lineHeight: 'var(--leading-heading)', margin: '0 0 8px' }}>
          Contribute
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40 }}>
          c³ is built by students, for students. Here's how you can help.
        </p>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {FALLBACK_ROLES.map((role) => (
            <div key={role.key} style={{
              background: 'var(--surface-card)', border: '2px solid var(--ink)',
              borderRadius: 'var(--radius-lg)', padding: 24,
            }}>
              <div style={{
                display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: 12,
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
                background: role.color, color: 'var(--ink)',
                padding: '5px 12px', borderRadius: 'var(--radius-pill)', marginBottom: 12,
              }}>
                {role.title}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 12px' }}>
                {role.does}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-caption)', margin: 0 }}>
                <strong>Who:</strong> {role.who}
              </p>
            </div>
          ))}
        </div>

        {/* Simple application form */}
        <section style={{ marginTop: 48, padding: 32, background: 'var(--surface-soft)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--ink)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 8px' }}>Apply to join</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Tell us who you are and how you'd like to contribute.
          </p>
          <form action="/api/contribute" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="text" name="name" placeholder="Your name" required style={inputStyle} />
            <input type="email" name="email" placeholder="Email" required style={inputStyle} />
            <select name="role" required style={inputStyle}>
              <option value="">Select a role…</option>
              {FALLBACK_ROLES.map((r) => <option key={r.key} value={r.key}>{r.title}</option>)}
            </select>
            <textarea name="message" placeholder="Tell us about yourself" rows="4" style={{ ...inputStyle, resize: 'vertical' }} />
            <button type="submit" style={{
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
              background: 'var(--ink)', color: '#fff', border: 'none',
              padding: '14px 28px', borderRadius: 'var(--radius-pill)',
              cursor: 'pointer', alignSelf: 'flex-start',
            }}>
              Submit application
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

const inputStyle = {
  fontFamily: 'var(--font-ui)', fontSize: 16,
  padding: '12px 16px', border: '2px solid var(--border)',
  borderRadius: 'var(--radius-md)', background: '#fff',
  color: 'var(--ink)', outline: 'none',
};
