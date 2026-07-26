'use client';

import { useActionState, useState } from 'react';
import { createIssue } from '@/app/admin/actions';

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

const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];

export default function IssueForm() {
  const [state, formAction, pending] = useActionState(createIssue, {});
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
        + New issue
      </button>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 20, margin: '0 0 16px' }}>New issue</h3>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ width: 100 }}>
            <label style={labelStyle}>Number *</label>
            <input name="number" required style={inputStyle} placeholder="01" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Title *</label>
            <input name="title" required style={inputStyle} placeholder="The College Admissions Issue" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Season</label>
            <select name="season" style={inputStyle}>
              <option value="">—</option>
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Year</label>
            <input name="year" style={inputStyle} placeholder="2025" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Publish date</label>
            <input name="publish_date" type="date" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short description of this issue." />
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Color (CSS var)</label>
            <input name="color" style={inputStyle} placeholder="var(--yellow)" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Text color (CSS var)</label>
            <input name="text_color" style={inputStyle} placeholder="var(--ink)" />
          </div>
        </div>
        <label style={{ fontFamily: 'var(--font-ui)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" name="published" /> Published (visible on site)
        </label>
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
            {pending ? 'Adding…' : 'Add issue'}
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
