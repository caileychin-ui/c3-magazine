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

/**
 * Update an existing article (edit mode).
 */
export async function updateArticle(prevState, formData) {
  const editor = await getEditor();
  if (!editor) return { error: 'You must be signed in as an editor.' };

  const id = String(formData.get('id') || '');
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

  if (!id) return { error: 'Article ID is required.' };
  if (!title) return { error: 'Title is required.' };
  if (!slug) return { error: 'Slug is required.' };
  if (!markdownContent) return { error: 'Content is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('articles').update({
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
  }).eq('id', id);

  if (error) {
    if (error.code === '23505') return { error: 'That slug already exists. Choose a different one.' };
    return { error: 'Something went wrong: ' + error.message };
  }

  revalidatePath('/', 'layout');
  return { ok: true, message: `Article "${title}" updated.` };
}

/**
 * Delete an article.
 */
export async function deleteArticle(prevState, formData) {
  const editor = await getEditor();
  if (!editor) return { error: 'You must be signed in as an editor.' };

  const id = String(formData.get('id') || '');
  if (!id) return { error: 'Article ID is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('articles').delete().eq('id', id);

  if (error) return { error: 'Failed to delete: ' + error.message };

  revalidatePath('/', 'layout');
  return { ok: true, message: 'Article deleted.' };
}

/**
 * Create a new author.
 */
export async function createAuthor(prevState, formData) {
  const editor = await getEditor();
  if (!editor) return { error: 'You must be signed in as an editor.' };

  const name = String(formData.get('name') || '').trim();
  const handle = String(formData.get('handle') || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const role = String(formData.get('author_role') || '').trim();
  const bio = String(formData.get('bio') || '').trim();
  const avatarUrl = String(formData.get('avatar_url') || '').trim();

  if (!name) return { error: 'Author name is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('authors').insert({
    name,
    handle: handle || null,
    role: role || null,
    bio: bio || null,
    avatar_url: avatarUrl || null,
  });

  if (error) return { error: 'Something went wrong: ' + error.message };

  revalidatePath('/', 'layout');
  return { ok: true, message: `Author "${name}" added.` };
}

/**
 * Create a new issue.
 */
export async function createIssue(prevState, formData) {
  const editor = await getEditor();
  if (!editor) return { error: 'You must be signed in as an editor.' };

  const number = String(formData.get('number') || '').trim();
  const title = String(formData.get('title') || '').trim();
  const season = String(formData.get('season') || '').trim();
  const year = String(formData.get('year') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const color = String(formData.get('color') || '').trim();
  const textColor = String(formData.get('text_color') || '').trim();
  const publishDate = String(formData.get('publish_date') || '').trim();
  const published = formData.get('published') === 'on';

  if (!number) return { error: 'Issue number is required.' };
  if (!title) return { error: 'Issue title is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('issues').insert({
    number,
    title,
    season: season || null,
    year: year ? parseInt(year, 10) : null,
    description: description || null,
    color: color || null,
    text_color: textColor || null,
    publish_date: publishDate || null,
    published,
  });

  if (error) return { error: 'Something went wrong: ' + error.message };

  revalidatePath('/', 'layout');
  return { ok: true, message: `Issue "${title}" added.` };
}
