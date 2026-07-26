import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import PitchForm from '@/components/pitch-form';

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
          <PitchForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

