'use client';

import { useActionState } from 'react';
import { subscribe } from '@/app/actions/forms';

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribe, {});

  if (state?.ok) {
    return (
      <p
        role="status"
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--success)',
          background: 'var(--success-bg)',
          display: 'inline-block',
          padding: '12px 22px',
          borderRadius: 'var(--radius-pill)',
          border: '2px solid var(--success)',
          margin: 0,
        }}
      >
        {state.message || "You're on the list."}
      </p>
    );
  }

  return (
    <form
      action={formAction}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          border: '2px solid var(--ink)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 6px 6px 20px',
          boxShadow: 'var(--shadow-sticker)',
          maxWidth: 460,
          width: '100%',
        }}
      >
        <label htmlFor="newsletter-email" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@school.edu"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            background: 'transparent',
            minWidth: 0,
          }}
        />

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />

        <button
          type="submit"
          disabled={pending}
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: 15,
            padding: '11px 22px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--ink)',
            color: '#fff',
            border: 'none',
            cursor: pending ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {pending ? '…' : 'Subscribe'}
        </button>
      </div>

      {state?.error && (
        <span
          role="alert"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--error)',
          }}
        >
          {state.error}
        </span>
      )}
    </form>
  );
}
