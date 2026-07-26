'use client';

import { useActionState, useState, useRef } from 'react';
import { createArticle, updateArticle, togglePublish, deleteArticle } from '@/app/admin/actions';

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

function CitationManager({ article }) {
  const [citations, setCitations] = useState(
    article?.citations?.length > 0
      ? article.citations
      : [{ id: 'c1', marker: '1', title: '', author: '', publication: '', url: '', note: '' }]
  );

  const update = (i, field, val) => {
    const next = [...citations];
    next[i] = { ...next[i], [field]: val };
    setCitations(next);
  };

  const addCitation = () => {
    const nextId = `c${citations.length + 1}`;
    setCitations([...citations, { id: nextId, marker: String(citations.length + 1), title: '', author: '', publication: '', url: '', note: '' }]);
  };

  const removeCitation = (i) => {
    const next = citations.filter((_, idx) => idx !== i);
    next.forEach((c, idx) => (c.marker = String(idx + 1)));
    setCitations(next);
  };

  return (
    <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Citations</label>
        <button type="button" onClick={addCitation} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, background: 'var(--blue-tint)', color: 'var(--blue-deep)', border: 'none', padding: '4px 10px', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>
          + Add citation
        </button>
      </div>
      <input type="hidden" name="citations" value={JSON.stringify(citations)} />
      {citations.map((c, i) => (
        <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < citations.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: 'var(--text-caption)' }}>Citation {i + 1}</span>
            {citations.length > 1 && (
              <button type="button" onClick={() => removeCitation(i)} style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, background: 'var(--coral-tint)', color: 'var(--coral-deep)', border: 'none', padding: '2px 8px', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }}>
                Remove
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <input placeholder="Title" value={c.title} onChange={(e) => update(i, 'title', e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: '6px 10px' }} />
            <input placeholder="Author" value={c.author} onChange={(e) => update(i, 'author', e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: '6px 10px' }} />
            <input placeholder="Publication" value={c.publication} onChange={(e) => update(i, 'publication', e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: '6px 10px' }} />
            <input placeholder="URL (optional)" value={c.url} onChange={(e) => update(i, 'url', e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: '6px 10px' }} />
          </div>
          <input placeholder="Note (optional)" value={c.note} onChange={(e) => update(i, 'note', e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: '6px 10px', marginTop: 8, width: '100%' }} />
        </div>
      ))}
    </div>
  );
}

function ArticleFields({ categories, authors, issues, article }) {
  const fileInputRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(article?.pdfUrl || '');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }
    // Upload via fetch to the server action endpoint
    const formData = new FormData();
    formData.append('pdf_file', file);
    formData.append('article_id', article?.id || 'new');
    try {
      const res = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setPdfUrl(data.url);
      } else {
        alert(data.error || 'Upload failed.');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <>
      <div>
        <label style={labelStyle}>Title *</label>
        <input name="title" required style={inputStyle} defaultValue={article?.title || ''} placeholder="The Ivies Have Never Been This Hard to Get Into" />
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Slug * (URL)</label>
          <input name="slug" required style={inputStyle} defaultValue={article?.slug || ''} placeholder="ivies-hardest-ever" />
        </div>
        <div style={{ width: 120 }}>
          <label style={labelStyle}>Reading time</label>
          <input name="reading_time" style={inputStyle} defaultValue={article?.readingTime || ''} placeholder="6 min" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Subtitle</label>
        <input name="subtitle" style={inputStyle} defaultValue={article?.subtitle || ''} placeholder="Record low admit rates, decoded." />
      </div>
      <div>
        <label style={labelStyle}>Summary</label>
        <textarea name="summary" rows={2} style={{ ...inputStyle, resize: 'vertical' }} defaultValue={article?.summary || ''} placeholder="One-sentence summary for the card." />
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Category</label>
          <select name="category_id" style={inputStyle} defaultValue={article?.categoryId || ''}>
            <option value="">—</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Author</label>
          <select name="author_id" style={inputStyle} defaultValue={article?.authorId || ''}>
            <option value="">—</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Issue</label>
          <select name="issue_id" style={inputStyle} defaultValue={article?.issueId || ''}>
            <option value="">—</option>
            {issues.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input name="tags" style={inputStyle} defaultValue={article?.tags?.join(', ') || ''} placeholder="admissions, testing" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Content (Markdown) *</label>
        <textarea name="markdown_content" required rows={12} style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', fontSize: 14, resize: 'vertical' }} defaultValue={article?.markdownContent || ''} placeholder={'## Your headline\n\nWrite your article in **markdown** here.\n\n> Use blockquotes for pull quotes.'} />
      </div>

      {/* PDF upload */}
      <div>
        <label style={labelStyle}>PDF version (optional)</label>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input name="pdf_url" style={inputStyle} value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://…supabase.co/storage/v1/object/public/pdfs/…" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700,
              background: 'var(--blue-tint)', color: 'var(--blue-deep)', border: '2px solid var(--blue)',
              padding: '10px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Upload PDF
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} style={{ display: 'none' }} />
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--blue-deep)', marginTop: 4, display: 'inline-block' }}>
            View current PDF →
          </a>
        )}
      </div>

      {/* Citations */}
      <CitationManager article={article} />

      {/* Editor's note */}
      <div>
        <label style={labelStyle}>Editor's note (optional)</label>
        <textarea name="editor_note" rows={2} style={{ ...inputStyle, resize: 'vertical' }} defaultValue={article?.editorNote || ''} placeholder="A note from the editor about this piece." />
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <label style={labelStyle}>Status</label>
        <select name="status" style={{ ...inputStyle, width: 'auto' }} defaultValue={article?.status || 'draft'}>
          <option value="draft">Draft (hidden from public)</option>
          <option value="published">Published (visible on site)</option>
        </select>
        <label style={{ fontFamily: 'var(--font-ui)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" name="featured" defaultChecked={article?.featured} /> Featured
        </label>
      </div>
    </>
  );
}

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
        <ArticleFields categories={categories} authors={authors} issues={issues} />
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

export function EditArticleForm({ article, categories, authors, issues }) {
  const [state, formAction, pending] = useActionState(updateArticle, {});
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
          padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: 'none',
          background: 'var(--blue-tint)', color: 'var(--blue-deep)',
          cursor: 'pointer',
        }}
      >
        Edit
      </button>
    );
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginTop: 8 }}>
      <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 20, margin: '0 0 16px' }}>Edit article</h3>
      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input type="hidden" name="id" value={article.id} />
        <ArticleFields categories={categories} authors={authors} issues={issues} article={article} />
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
            {pending ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} style={{
            fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15,
            background: 'none', color: 'var(--text-secondary)', border: '2px solid var(--border)',
            padding: '12px 22px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
          }}>
            Cancel
          </button>
        </div>
        {state?.ok && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--mint-deep)', margin: 0 }}>
            ✓ {state.message}
          </p>
        )}
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

export function DeleteButton({ article }) {
  const [state, formAction, pending] = useActionState(deleteArticle, {});

  return (
    <form action={formAction} style={{ display: 'inline' }}
      onSubmit={(e) => {
        if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) e.preventDefault();
      }}>
      <input type="hidden" name="id" value={article.id} />
      <button type="submit" disabled={pending} style={{
        fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 'var(--track-tag)',
        padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: 'none',
        background: 'var(--coral-tint)', color: 'var(--coral-deep)',
        cursor: pending ? 'wait' : 'pointer',
      }}>
        {pending ? '…' : 'Delete'}
      </button>
    </form>
  );
}

export { PublishToggle };
