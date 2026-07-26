import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Pitch a story',
  description: 'Have a story idea? Pitch it to c³ Magazine.',
};

export default function PitchPage() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 48px)', lineHeight: 'var(--leading-heading)', margin: '0 0 8px' }}>
          Pitch a story
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-secondary)', marginBottom: 40 }}>
          Have an idea for an explainer, essay, or feature? We want to hear it.
        </p>

        <div style={{
          padding: 32, background: 'var(--surface-soft)',
          borderRadius: 'var(--radius-lg)', border: '2px solid var(--ink)',
        }}>
          <form action="/api/pitch" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="text" name="name" placeholder="Your name" required style={inputStyle} />
            <input type="email" name="email" placeholder="Email" required style={inputStyle} />
            <input type="text" name="angle" placeholder="Story angle / headline idea" required style={inputStyle} />
            <textarea name="message" placeholder="Tell us the story, who it's for, and why it matters" rows="6" style={{ ...inputStyle, resize: 'vertical' }} />
            <button type="submit" style={{
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
              background: 'var(--ink)', color: '#fff', border: 'none',
              padding: '14px 28px', borderRadius: 'var(--radius-pill)',
              cursor: 'pointer', alignSelf: 'flex-start',
            }}>
              Submit pitch
            </button>
          </form>
        </div>
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
