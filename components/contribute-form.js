'use client';

import { useActionState } from 'react';
import { submitApplication } from '@/app/actions/forms';

const inputStyle = {
  fontFamily: 'var(--font-ui)', fontSize: 16,
  padding: '12px 16px', border: '2px solid var(--border)',
  borderRadius: 'var(--radius-md)', background: '#fff',
  color: 'var(--ink)', outline: 'none',
};

export default function ContributeForm({ roles }) {
  const [state, formAction, pending] = useActionState(submitApplication, {});

  if (state?.ok) {
    return (
      <p role="status" style={{
        fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700,
        color: 'var(--success)', background: 'var(--success-bg)',
        display: 'inline-block', padding: '12px 22px',
        borderRadius: 'var(--radius-pill)', border: '2px solid var(--success)',
      }}>
        {state.message || "Application received. We'll be in touch."}
      </p>
    );
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      <input type="text" name="name" placeholder="Your name" required style={inputStyle} />
      <input type="email" name="email" placeholder="Email" required style={inputStyle} />
      <select name="role" required style={inputStyle}>
        <option value="">Select a role…</option>
        {roles.map((r) => <option key={r.key} value={r.key}>{r.title}</option>)}
      </select>
      <textarea name="message" placeholder="Tell us about yourself" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
      {state?.error && (
        <span role="alert" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--error)' }}>
          {state.error}
        </span>
      )}
      <button type="submit" disabled={pending} style={{
        fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16,
        background: 'var(--ink)', color: '#fff', border: 'none',
        padding: '14px 28px', borderRadius: 'var(--radius-pill)',
        cursor: pending ? 'wait' : 'pointer', alignSelf: 'flex-start',
      }}>
        {pending ? '…' : 'Submit application'}
      </button>
    </form>
  );
}
