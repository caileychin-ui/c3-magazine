import 'server-only';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import {
  FALLBACK_ARTICLES,
  FALLBACK_AUTHORS,
  FALLBACK_CATEGORIES,
  FALLBACK_ISSUES,
} from '@/lib/fallback-data';

/**
 * The data layer.
 *
 * Every function here returns objects in the SAME shape the prototype's
 * contentData module produced, so the ported components need no changes:
 *
 *   article.author           -> author id      (was "a1")
 *   article.category         -> category slug  (was "admissions")
 *   article.issueId          -> issue id
 *   article.tags             -> string[]
 *   article.citations        -> Citation[]
 *   article.relatedArticleIds-> string[]
 *
 * Reads go through the RLS-bound anon client, so `status='published'` filtering
 * is enforced by Postgres, not by the code below. The explicit .eq('status',
 * 'published') calls are belt-and-braces — if someone loosens a policy by
 * mistake, drafts still don't appear on public pages.
 */

const ARTICLE_COLUMNS = `
  id, slug, title, subtitle, summary, tags, status, featured,
  publish_date, updated_date, reading_time, cover_image, pdf_url,
  markdown_content, citations, editor_note, sources_methodology,
  author_id, category_id, issue_id,
  category:categories ( id, slug, name, color_token ),
  author:authors ( id, name, handle, role, bio, avatar_url ),
  related:article_relations!article_relations_article_id_fkey ( related_id )
`;

/** DB row -> prototype Article shape. */
function toArticle(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    author: row.author_id,
    authorId: row.author_id,
    categoryId: row.category_id,
    category: row.category?.color_token ?? null,
    categoryName: row.category?.name ?? null,
    categorySlug: row.category?.slug ?? null,
    tags: row.tags ?? [],
    issueId: row.issue_id,
    issue_id: row.issue_id,
    status: row.status,
    featured: row.featured,
    publishDate: row.publish_date,
    updatedDate: row.updated_date,
    readingTime: row.reading_time,
    coverImage: row.cover_image || '',
    pdfUrl: row.pdf_url || '',
    markdownContent: row.markdown_content || '',
    citations: row.citations ?? [],
    editorNote: row.editor_note,
    sourcesMethodology: row.sources_methodology,
    relatedArticleIds: (row.related ?? []).map((r) => r.related_id),
    // Joined author kept alongside the id so cards don't need a second lookup.
    authorObj: row.author
      ? {
          id: row.author.id,
          name: row.author.name,
          handle: row.author.handle,
          role: row.author.role,
          bio: row.author.bio,
          avatar: row.author.avatar_url || '',
        }
      : null,
  };
}

function toIssue(row) {
  if (!row) return null;
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    season: row.season,
    year: row.year,
    description: row.description,
    color: row.color,
    textColor: row.text_color,
    coverImage: row.cover_image || '',
    pdfUrl: row.pdf_url || '',
    publishDate: row.publish_date,
    published: row.published,
    articleIds: row.articleIds ?? [],
  };
}

function toAuthor(row) {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    role: row.role,
    bio: row.bio,
    avatar: row.avatar_url || '',
  };
}

function toCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    colorToken: row.color_token,
    description: row.description,
  };
}

/* ---------------------------------------------------------------- public --- */

export const getPublishedArticles = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .eq('status', 'published')
      .order('publish_date', { ascending: false });

    if (error) throw new Error(`getPublishedArticles: ${error.message}`);
    const articles = (data ?? []).map(toArticle);
    return articles.length > 0 ? articles : FALLBACK_ARTICLES;
  } catch {
    return FALLBACK_ARTICLES;
  }
});

export const getArticleBySlug = cache(async (slug) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw new Error(`getArticleBySlug(${slug}): ${error.message}`);
    const article = toArticle(data);
    return article || FALLBACK_ARTICLES.find((a) => a.slug === slug) || null;
  } catch {
    return FALLBACK_ARTICLES.find((a) => a.slug === slug) || null;
  }
});

/** Slugs for generateStaticParams / sitemap. Published only. */
export const getPublishedSlugs = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('slug, updated_date, publish_date')
      .eq('status', 'published');

    if (error) throw new Error(`getPublishedSlugs: ${error.message}`);
    if (data && data.length > 0) return data;
    return FALLBACK_ARTICLES.map((a) => ({ slug: a.slug, publish_date: a.publishDate, updated_date: a.updatedDate }));
  } catch {
    return FALLBACK_ARTICLES.map((a) => ({ slug: a.slug, publish_date: a.publishDate, updated_date: a.updatedDate }));
  }
});

export const getIssues = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('published', true)
      .order('publish_date', { ascending: false });

    if (error) throw new Error(`getIssues: ${error.message}`);
    if (!data || data.length === 0) return FALLBACK_ISSUES;

    // Attach each issue's published article ids in one extra round trip rather
    // than N+1 per issue.
    const { data: arts } = await supabase
      .from('articles')
      .select('id, issue_id')
      .eq('status', 'published');

    const byIssue = new Map();
    for (const a of arts ?? []) {
      if (!a.issue_id) continue;
      if (!byIssue.has(a.issue_id)) byIssue.set(a.issue_id, []);
      byIssue.get(a.issue_id).push(a.id);
    }

    return data.map((row) =>
      toIssue({ ...row, articleIds: byIssue.get(row.id) ?? [] }),
    );
  } catch {
    return FALLBACK_ISSUES;
  }
});

export const getAuthors = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('authors').select('*').order('name');
    if (error) throw new Error(`getAuthors: ${error.message}`);
    const authors = (data ?? []).map(toAuthor);
    return authors.length > 0 ? authors : FALLBACK_AUTHORS;
  } catch {
    return FALLBACK_AUTHORS;
  }
});

export const getCategories = cache(async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (error) throw new Error(`getCategories: ${error.message}`);
    const cats = (data ?? []).map(toCategory);
    return cats.length > 0 ? cats : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
});

/**
 * One call for pages that need the whole content graph (home, archive).
 * Shaped like the prototype's `D` object so components can keep using
 * D.ARTICLES / D.ISSUES / D.AUTHORS / D.CATEGORIES.
 */
export const getSiteData = cache(async () => {
  const [ARTICLES, ISSUES, AUTHORS, CATEGORIES] = await Promise.all([
    getPublishedArticles(),
    getIssues(),
    getAuthors(),
    getCategories(),
  ]);
  return { ARTICLES, ISSUES, AUTHORS, CATEGORIES };
});

/* ----------------------------------------------------------------- admin --- */

/**
 * Admin listing — includes drafts. RLS only returns rows to an editor, so a
 * non-editor calling this gets an empty array rather than leaked drafts.
 * Callers must still go through requireEditor() first.
 */
export async function getAllArticlesForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`getAllArticlesForAdmin: ${error.message}`);
  return (data ?? []).map(toArticle);
}

export async function getAllIssuesForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('publish_date', { ascending: false });
  if (error) throw new Error(`getAllIssuesForAdmin: ${error.message}`);
  return (data ?? []).map((r) => toIssue({ ...r, articleIds: [] }));
}

export async function getSubmissions(kind) {
  const supabase = await createClient();
  let q = supabase.from('submissions').select('*').order('created_at', { ascending: false });
  if (kind) q = q.eq('kind', kind);
  const { data, error } = await q;
  if (error) throw new Error(`getSubmissions: ${error.message}`);
  return data ?? [];
}
