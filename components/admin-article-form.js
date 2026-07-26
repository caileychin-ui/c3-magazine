'use client';

import { useActionState, useState } from 'react';
import { createArticle, togglePublish } from '@/app/admin/actions';

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

export default function ArticleForm({ categories, authors, issues }) {
  const [state, formAction, pending] = useActionState(createArticle, {});
  const [showForm, setShowForm] = useState(false);

  if (state?.ok && showForm) {
    return (
      <div style={{ padding: 16, background: 'var(--mint-tint)', borderRadius: 'var(--radius-md)', border: '1px solid var(--mint)' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--mint-deep)', margin: 0 }}>
          ✓ {state.message}
        </p>
        <button onClick={() => { setShowForm(false); }} style={{ marginTop: 10, fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', color: 'var(--blue-deep)', cursor: 'pointer', padding: 0 }}>
          ← Back to dashboard
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
        + New article
      </button>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 20, margin: '0 0 16px' }}>New article</h3>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input name="title" required style={inputStyle} placeholder="The Ivies Have Never Been This Hard to Get Into" />
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Slug * (URL)</label>
            <input name="slug" required style={inputStyle} placeholder="ivies-hardest-ever" />
          </div>
          <div style={{ width: 120 }}>
            <label style={labelStyle}>Reading time</label>
            <input name="reading_time" style={inputStyle} placeholder="6 min" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Subtitle</label>
          <input name="subtitle" style={inputStyle} placeholder="Record low admit rates, decoded." />
        </div>
        <div>
          <label style={labelStyle}>Summary</label>
          <textarea name="summary" rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="One-sentence summary for the card." />
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category</label>
            <select name="category_id" style={inputStyle}>
              <option value="">—</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Author</label>
            <select name="author_id" style={inputStyle}>
              <option value="">—</option>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Issue</label>
            <select name="issue_id" style={inputStyle}>
              <option value="">—</option>
              {issues.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input name="tags" style={inputStyle} placeholder="admissions, testing" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Content (Markdown) *</label>
          <textarea name="markdown_content" required rows={12} style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', fontSize: 14, resize: 'vertical' }} placeholder={'## Your headline\n\nWrite your article in **markdown** here.\n\n> Use blockquotes for pull quotes.'} />
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <label style={labelStyle}>Status</label>
          <select name="status" style={{ ...inputStyle, width: 'auto' }}>
            <option value="draft">Draft (hidden from public)</option>
            <option value="published">Published (visible on site)</option>
          </select>
          <label style={{ fontFamily: 'var(--font-ui)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" name="featured" /> Featured
          </label>
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
            {pending ? 'Creating…' : 'Create article'}
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

function PublishToggle({ article }) {
  const [state, formAction, pending] = useActionState(togglePublish, {});
  const isPublished = article.status === 'published';

  return (
    <form action={formAction} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={article.id} />
      <input type="hidden" name="current_status" value={article.status} />
      <button type="submit" disabled={pending} style={{
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
        padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: 'none',
        background: isPublished ? 'var(--coral-tint)' : 'var(--mint-tint)',
        color: isPublished ? 'var(--coral-deep)' : 'var(--mint-deep)',
        cursor: pending ? 'wait' : 'pointer',
      }}>
        {pending ? '…' : isPublished ? 'Unpublish' : 'Publish'}
      </button>
      {state?.ok && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--mint-deep)' }}>{state.message}</span>}
    </form>
  );
}

export { PublishToggle };
