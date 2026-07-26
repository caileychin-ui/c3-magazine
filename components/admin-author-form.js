'use client';

import { useActionState, useState } from 'react';
import { createAuthor } from '@/app/admin/actions';

const inputStyle = {
  fontFamily: 'var(--font-ui)', fontSize: 15,
  padding: '10px 14px', border: '2px solid var(--border)',
  borderRadius: 'var(--radius-md)', background: '#fff',
  color: 'var(--ink)', outline: 'none', width: '100%',
};

const labelStyle = {
  fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700,
  display: 'block', marginBottom: 4,
};

export default function AuthorForm() {
  const [state, formAction, pending] = useActionState(createAuthor, {});
  const [showForm, setShowForm] = useState(false);

  if (state?.ok && showForm) {
    return (
      <div style={{ padding: 14, background: 'var(--mint-tint)', borderRadius: 'var(--radius-md)', border: '1px solid var(--mint)' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--mint-deep)', margin: 0 }}>
          ✓ {state.message}
        </p>
        <button onClick={() => { setShowForm(false); state.ok = false; }} style={{ marginTop: 8, fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', color: 'var(--blue-deep)', cursor: 'pointer', padding: 0 }}>
          ← Back
        </button>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15,
          background: 'var(--ink)', color: '#fff', border: 'none',
          padding: '12px 22px', borderRadius: 'var(--radius-pill)',
          cursor: 'pointer',
        }}
      >
        + New author
      </button>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 20, margin: '0 0 16px' }}>New author</h3>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input name="name" required style={inputStyle} placeholder="Jane Doe" />
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Handle</label>
            <input name="handle" style={inputStyle} placeholder="janedoe" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Role</label>
            <input name="author_role" style={inputStyle} placeholder="Editor, Contributor…" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Bio</label>
          <textarea name="bio" rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short biography." />
        </div>
        <div>
          <label style={labelStyle}>Avatar URL</label>
          <input name="avatar_url" style={inputStyle} placeholder="https://…" />
        </div>
        {state?.error && (
          <span role="alert" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--error)' }}>
            {state.error}
          </span>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={pending} style={{
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 15,
            background: 'var(--ink)', color: '#fff', border: 'none',
            padding: '12px 22px', borderRadius: 'var(--radius-pill)', cursor: pending ? 'wait' : 'pointer',
          }}>
            {pending ? 'Adding…' : 'Add author'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} style={{
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15,
            background: 'none', color: 'var(--text-secondary)', border: '2px solid var(--border)',
            padding: '12px 22px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
          }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
