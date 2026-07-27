'use client';

import { useActionState } from 'react';
import { sendToSubscribers } from '@/app/admin/email-actions';

export default function SendToSubscribersButton({ article }) {
  const [state, formAction, pending] = useActionState(sendToSubscribers, {});

  return (
    <form action={formAction} style={{ display: 'inline' }}
      onSubmit={(e) => {
        if (!confirm(`Send "${article.title}" to all subscribers? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="article_id" value={article.id} />
      <button type="submit" disabled={pending} style={{
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
        padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: 'none',
        background: 'var(--yellow-tint)', color: 'var(--yellow-deep)',
        cursor: pending ? 'wait' : 'pointer',
      }}>
        {pending ? 'Sending…' : '✉ Send'}
      </button>
      {state?.ok && (
        <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--mint-deep)' }}>
          ✓ {state.message}
        </span>
      )}
      {state?.error && (
        <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--error)' }}>
          {state.error}
        </span>
      )}
    </form>
  );
}
