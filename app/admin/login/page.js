'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { signIn } from './actions';

const inputStyle = {
  fontFamily: 'var(--font-ui)',
  fontSize: 15,
  padding: '12px 16px',
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--ink)',
  width: '100%',
  background: '#fff',
};

function LoginForm() {
  const params = useSearchParams();
  const next = params.get('next') || '/admin';
  const [state, formAction, pending] = useActionState(signIn, { error: null });

  return (
    <form
      action={formAction}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <input type="hidden" name="next" value={next} />

      <label htmlFor="email" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700 }}>
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
        style={inputStyle}
      />

      <label htmlFor="password" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700 }}>
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        style={inputStyle}
      />

      {state?.error && (
        <span
          role="alert"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--error)',
            fontWeight: 600,
          }}
        >
          {state.error}
        </span>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          fontSize: 16,
          padding: '14px 22px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--admin-accent)',
          color: '#fff',
          border: '2px solid var(--admin-accent)',
          cursor: pending ? 'wait' : 'pointer',
          opacity: pending ? 0.7 : 1,
          width: '100%',
        }}
      >
        {pending ? 'Signing in…' : 'Enter studio'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--admin-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          border: '2px solid var(--ink)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sticker)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            margin: 0,
            textAlign: 'center',
          }}
        >
          c³ studio
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Editors only. Accounts are created in Supabase — there is no public
          sign-up.
        </p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
