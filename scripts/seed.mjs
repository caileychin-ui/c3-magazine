/**
 * Seed the c³ database from the prototype's demo content.
 *
 *   node scripts/seed.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * The service role key bypasses RLS, which is exactly why this runs locally and
 * never in the deployed app. Clear the key from .env.local when you're done.
 *
 * ---------------------------------------------------------------------------
 * EVERY ARTICLE IS INSERTED AS status='draft', ALWAYS.
 *
 * The demo content contains fabricated admissions statistics, invented court
 * cases and example.com citations. Under the RLS policy in supabase/schema.sql,
 * drafts are invisible to the public — only signed-in editors can see them. So
 * this content can never reach a reader, no matter what the source data says.
 * Rewrite a piece properly, then publish it from the admin studio.
 * ---------------------------------------------------------------------------
 *
 * The prototype used string ids ("a1", "c1", "art1", "i1"). Postgres uses
 * UUIDs. This script builds an id map as it inserts, then rewires every
 * cross-reference (author, category, issue, related articles) through it.
 *
 * Safe to re-run: every insert is an upsert keyed on a natural unique column.
 */

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

import {
  ARTICLES,
  AUTHORS,
  CATEGORIES,
  ISSUES,
  INTRO,
} from './seed-data.mjs';

/* ----------------------------------------------------------- env loading --- */

function loadEnv() {
  let raw;
  try {
    raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  } catch {
    die('No .env.local found. Copy .env.local.example to .env.local first.');
  }
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

function die(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) die('NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
if (!serviceKey) {
  die(
    'SUPABASE_SERVICE_ROLE_KEY is not set in .env.local.\n' +
      '    Find it in Supabase → Project Settings → API → service_role.\n' +
      '    Paste it in, run this script, then blank it out again.',
  );
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ------------------------------------------------------------- id mapping -- */

/** old string id -> new uuid */
const catIds = new Map();
const authorIds = new Map();
const issueIds = new Map();
const articleIds = new Map();

/* ------------------------------------------------------------------ steps -- */

async function seedCategories() {
  const rows = CATEGORIES.map((c, i) => {
    const id = randomUUID();
    catIds.set(c.id, id);
    // The prototype keyed article.category off colorToken, not the category id,
    // so keep colorToken addressable — queries.js reads it back as `category`.
    catIds.set(c.colorToken, id);
    return {
      id,
      name: c.name,
      slug: c.slug,
      color_token: c.colorToken,
      description: c.description,
      sort_order: i,
    };
  });

  const { error } = await db
    .from('categories')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: false });
  if (error) die(`categories: ${error.message}`);

  // Re-read: on a re-run the upsert keeps the ORIGINAL uuid, not the one we
  // just minted, so the map above would be stale and every FK would break.
  const { data } = await db.from('categories').select('id, slug, color_token');
  for (const row of data ?? []) {
    const src = CATEGORIES.find((c) => c.slug === row.slug);
    if (src) {
      catIds.set(src.id, row.id);
      catIds.set(src.colorToken, row.id);
    }
  }
  console.log(`  categories  ${rows.length}`);
}

async function seedAuthors() {
  const rows = AUTHORS.map((a) => ({
    id: randomUUID(),
    name: a.name,
    handle: a.handle ?? null,
    role: a.role ?? null,
    bio: a.bio ?? null,
    avatar_url: a.avatar || null,
  }));

  // authors has no natural unique key in the schema, so insert only when empty
  // rather than duplicating people on every run.
  const { count } = await db
    .from('authors')
    .select('id', { count: 'exact', head: true });

  if (!count) {
    const { error } = await db.from('authors').insert(rows);
    if (error) die(`authors: ${error.message}`);
  }

  const { data } = await db.from('authors').select('id, name');
  for (const a of AUTHORS) {
    const hit = (data ?? []).find((r) => r.name === a.name);
    if (hit) authorIds.set(a.id, hit.id);
  }
  console.log(`  authors     ${authorIds.size}`);
}

async function seedIssues() {
  const rows = ISSUES.map((i) => ({
    id: randomUUID(),
    number: i.number,
    title: i.title,
    season: i.season,
    year: i.year,
    description: i.description,
    color: i.color,
    text_color: i.textColor,
    cover_image: i.coverImage || null,
    pdf_url: i.pdfUrl || null,
    publish_date: i.publishDate,
    // Issues stay unpublished for the same reason articles stay drafts.
    published: false,
  }));

  const { count } = await db
    .from('issues')
    .select('id', { count: 'exact', head: true });
  if (!count) {
    const { error } = await db.from('issues').insert(rows);
    if (error) die(`issues: ${error.message}`);
  }

  const { data } = await db.from('issues').select('id, number');
  for (const i of ISSUES) {
    const hit = (data ?? []).find((r) => r.number === i.number);
    if (hit) issueIds.set(i.id, hit.id);
  }
  console.log(`  issues      ${issueIds.size}  (all unpublished)`);
}

async function seedArticles() {
  // INTRO is the founder's letter; it has the same shape minus a few fields.
  const source = [...ARTICLES, { ...INTRO, category: INTRO.category ?? 'essays' }];

  const rows = source.map((a) => ({
    id: randomUUID(),
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle ?? null,
    summary: a.summary ?? null,
    author_id: authorIds.get(a.author) ?? null,
    category_id: catIds.get(a.category) ?? null,
    issue_id: issueIds.get(a.issueId) ?? null,
    tags: a.tags ?? [],
    // Forced, never read from the source. See the header comment.
    status: 'draft',
    featured: false,
    publish_date: a.publishDate ?? null,
    updated_date: a.updatedDate ?? null,
    reading_time: a.readingTime ?? null,
    cover_image: a.coverImage || null,
    pdf_url: a.pdfUrl || null,
    markdown_content: a.markdownContent ?? '',
    citations: a.citations ?? [],
    editor_note: a.editorNote ?? null,
    sources_methodology: a.sourcesMethodology ?? null,
  }));

  const { error } = await db
    .from('articles')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: false });
  if (error) die(`articles: ${error.message}`);

  const { data } = await db.from('articles').select('id, slug');
  for (const a of source) {
    const hit = (data ?? []).find((r) => r.slug === a.slug);
    if (hit) articleIds.set(a.id, hit.id);
  }
  console.log(`  articles    ${articleIds.size}  (all drafts)`);

  // Related articles — resolved last, once every article has a real uuid.
  const relations = [];
  for (const a of source) {
    const from = articleIds.get(a.id);
    if (!from) continue;
    for (const relOld of a.relatedArticleIds ?? []) {
      const to = articleIds.get(relOld);
      if (to && to !== from) relations.push({ article_id: from, related_id: to });
    }
  }
  if (relations.length) {
    const { error: relErr } = await db
      .from('article_relations')
      .upsert(relations, { onConflict: 'article_id,related_id' });
    if (relErr) die(`article_relations: ${relErr.message}`);
  }
  console.log(`  relations   ${relations.length}`);
}

/* ------------------------------------------------------------------- main -- */

console.log(`\n  Seeding ${url}\n`);

await seedCategories();
await seedAuthors();
await seedIssues();
await seedArticles();

console.log(`
  ✓ Done.

    Everything landed as DRAFT / unpublished, so none of it is publicly
    visible. Sign in at /admin to read, rewrite and publish.

    Reminder: this content contains invented statistics. Rewrite before
    publishing — don't just flip the status.

    Now blank out SUPABASE_SERVICE_ROLE_KEY in .env.local.
`);
