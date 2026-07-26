'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getEditor } from '@/lib/dal';

/**
 * Create a new article from the admin studio.
 * Requires an authenticated editor session — RLS backstops this.
 */
export async function createArticle(prevState, formData) {
  const editor = await getEditor();
  if (!editor) return { error: 'You must be signed in as an editor.' };

  const title = String(formData.get('title') || '').trim();
  const slug = String(formData.get('slug') || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const subtitle = String(formData.get('subtitle') || '').trim();
  const summary = String(formData.get('summary') || '').trim();
  const categoryId = String(formData.get('category_id') || '').trim();
  const authorId = String(formData.get('author_id') || '').trim();
  const issueId = String(formData.get('issue_id') || '').trim();
  const tags = String(formData.get('tags') || '').trim().split(',').map((t) => t.trim()).filter(Boolean);
  const readingTime = String(formData.get('reading_time') || '').trim();
  const markdownContent = String(formData.get('markdown_content') || '').trim();
  const status = String(formData.get('status') || 'draft');
  const featured = formData.get('featured') === 'on';

  if (!title) return { error: 'Title is required.' };
  if (!slug) return { error: 'Slug is required.' };
  if (!markdownContent) return { error: 'Content is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('articles').insert({
    title,
    slug,
    subtitle,
    summary,
    category_id: categoryId || null,
    author_id: authorId || null,
    issue_id: issueId || null,
    tags,
    reading_time: readingTime || null,
    markdown_content: markdownContent,
    status,
    featured,
    publish_date: status === 'published' ? new Date().toISOString().split('T')[0] : null,
  });

  if (error) {
    if (error.code === '23505') return { error: 'That slug already exists. Choose a different one.' };
    return { error: 'Something went wrong: ' + error.message };
  }

  revalidatePath('/', 'layout');
  return { ok: true, message: `Article "${title}" created as ${status}.` };
}

/**
 * Toggle an article's publish status.
 */
export async function togglePublish(prevState, formData) {
  const editor = await getEditor();
  if (!editor) return { error: 'You must be signed in as an editor.' };

  const id = String(formData.get('id') || '');
  const currentStatus = String(formData.get('current_status') || '');

  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  const publishDate = newStatus === 'published' ? new Date().toISOString().split('T')[0] : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from('articles')
    .update({ status: newStatus, publish_date: publishDate })
    .eq('id', id);

  if (error) return { error: 'Failed to update: ' + error.message };

  revalidatePath('/', 'layout');
  return { ok: true, message: `Article is now ${newStatus}.` };
}
