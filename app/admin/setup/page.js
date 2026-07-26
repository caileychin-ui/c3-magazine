'use client';

import { useActionState } from 'react';
import { autoSetupProfile, confirmEmail } from './actions';

export default function SetupPage() {
  const [setupState, setupAction, setupPending] = useActionState(autoSetupProfile, {});
  const [confirmState, confirmAction, confirmPending] = useActionState(confirmEmail, {});

  return (
    <div style={{ minHeight: '100vh', background: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#fff', border: '2px solid var(--ink)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sticker)', padding: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 8px', textAlign: 'center' }}>
          Finish setup
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 24px' }}>
          Your account exists but needs admin permissions. Click the button below to grant yourself admin access.
        </p>

        {setupState?.ok ? (
          <div style={{ padding: 16, background: 'var(--mint-tint)', borderRadius: 'var(--radius-md)', border: '1px solid var(--mint)', marginBottom: 16 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--mint-deep)', margin: 0 }}>
              ✓ {setupState.message}
            </p>
            <a href="/admin" style={{ display: 'inline-block', marginTop: 10, fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--blue-deep)' }}>
              Go to the studio →
            </a>
          </div>
        ) : (
          <form action={setupAction} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {setupState?.error && (
              <div style={{ padding: 12, background: 'var(--coral-tint)', borderRadius: 'var(--radius-md)', border: '1px solid var(--coral)' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--coral-deep)', margin: 0 }}>
                  {setupState.error}
                </p>
              </div>
            )}
            <button type="submit" disabled={setupPending} style={{
              fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
              padding: '14px 22px', borderRadius: 'var(--radius-pill)',
              background: 'var(--ink)', color: '#fff', border: 'none',
              cursor: setupPending ? 'wait' : 'pointer', width: '100%',
            }}>
              {setupPending ? 'Setting up…' : 'Grant admin access'}
            </button>
          </form>
        )}

        {setupState?.ok && (
          <form action={confirmAction} style={{ marginTop: 12 }}>
            <button type="submit" disabled={confirmPending} style={{
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14,
              padding: '10px 18px', borderRadius: 'var(--radius-pill)',
              background: 'none', color: 'var(--text-secondary)', border: '2px solid var(--border)',
              cursor: confirmPending ? 'wait' : 'pointer', width: '100%',
            }}>
              {confirmPending ? 'Confirming…' : 'Also confirm my email'}
            </button>
            {confirmState?.ok && <p style={{ fontSize: 13, color: 'var(--mint-deep)', marginTop: 8, textAlign: 'center' }}>✓ Email confirmed</p>}
          </form>
        )}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-caption)', margin: '0 0 8px' }}>
            <strong>One-time setup required:</strong> The service role key must be added to Vercel for this to work.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-caption)', margin: 0 }}>
            Get it from{' '}
            <a href="https://supabase.com/dashboard/project/xttyupcvxyaokheskzcx/settings/api" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: 'var(--blue-deep)' }}>
              Supabase → Settings → API → service_role key
            </a>
            {' '}and add it as a Vercel environment variable named <code style={{ background: 'var(--surface-soft)', padding: '2px 6px', borderRadius: 4 }}>SUPABASE_SERVICE_ROLE_KEY</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
