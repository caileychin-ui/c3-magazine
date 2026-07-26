-- ============================================================
-- c³ Magazine — Supabase schema
-- Mirrors the shapes in contentData so components don't change.
-- Run in the Supabase SQL editor.
-- ============================================================

-- ---------- editors (who may write) ----------
-- Profile row per auth user; role gates all writes.
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  role        text not null default 'viewer'
              check (role in ('viewer','editor','admin')),
  created_at  timestamptz not null default now()
);

create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('editor','admin')
  );
$$;

-- ---------- taxonomy ----------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  color_token text not null,          -- 'admissions', 'financial-aid', ...
  description text,
  sort_order  int  not null default 0
);

create table public.authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  handle     text,
  role       text,
  bio        text,
  avatar_url text
);

-- ---------- issues ----------
create table public.issues (
  id            uuid primary key default gen_random_uuid(),
  number        text not null,        -- '01', '02' — kept as text for zero-padding
  title         text not null,
  season        text,
  year          int,
  description   text,
  color         text,                 -- 'var(--yellow)'
  text_color    text,
  cover_image   text,                 -- Storage public URL
  pdf_url       text,                 -- Storage public URL
  publish_date  date,
  published     boolean not null default false
);

-- ---------- articles ----------
create table public.articles (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  title               text not null,
  subtitle            text,
  summary             text,
  author_id           uuid references public.authors on delete set null,
  category_id         uuid references public.categories on delete set null,
  issue_id            uuid references public.issues on delete set null,
  tags                text[] not null default '{}',
  status              text not null default 'draft'
                      check (status in ('draft','review','published','archived')),
  featured            boolean not null default false,
  publish_date        date,
  updated_date        date,
  reading_time        text,
  cover_image         text,
  pdf_url             text,
  markdown_content    text,
  citations           jsonb not null default '[]'::jsonb,
  editor_note         text,
  sources_methodology text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index articles_status_date_idx
  on public.articles (status, publish_date desc);
create index articles_tags_idx on public.articles using gin (tags);

-- related articles (many-to-many, self-referential)
create table public.article_relations (
  article_id  uuid references public.articles on delete cascade,
  related_id  uuid references public.articles on delete cascade,
  primary key (article_id, related_id),
  check (article_id <> related_id)
);

-- keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger articles_touch
  before update on public.articles
  for each row execute function public.touch_updated_at();

-- ---------- inbound: pitches + contributor applications ----------
create table public.submissions (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('pitch','apply')),
  name       text not null,
  email      text not null,
  role       text,        -- apply: which role they want
  angle      text,        -- pitch: the story angle
  message    text,
  status     text not null default 'new'
             check (status in ('new','reviewing','accepted','declined')),
  created_at timestamptz not null default now()
);

create table public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  confirmed     boolean not null default false,
  created_at    timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ============================================================
-- Row Level Security
-- Public sees published content only. Writes require an editor.
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.categories        enable row level security;
alter table public.authors           enable row level security;
alter table public.issues            enable row level security;
alter table public.articles          enable row level security;
alter table public.article_relations enable row level security;
alter table public.submissions       enable row level security;
alter table public.subscribers       enable row level security;

-- profiles: you see yourself; editors see all
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_editor());

-- taxonomy + authors: world-readable, editor-writable
create policy categories_read on public.categories for select using (true);
create policy categories_write on public.categories for all
  using (public.is_editor()) with check (public.is_editor());

create policy authors_read on public.authors for select using (true);
create policy authors_write on public.authors for all
  using (public.is_editor()) with check (public.is_editor());

-- issues: public sees published
create policy issues_read on public.issues
  for select using (published or public.is_editor());
create policy issues_write on public.issues for all
  using (public.is_editor()) with check (public.is_editor());

-- articles: public sees published only (drafts stay invisible)
create policy articles_read on public.articles
  for select using (status = 'published' or public.is_editor());
create policy articles_write on public.articles for all
  using (public.is_editor()) with check (public.is_editor());

create policy relations_read on public.article_relations
  for select using (true);
create policy relations_write on public.article_relations for all
  using (public.is_editor()) with check (public.is_editor());

-- submissions: anyone may insert (the forms); only editors may read.
-- Note: pair this with a captcha or rate limit at the edge — an open
-- insert policy is spammable on its own.
create policy submissions_insert on public.submissions
  for insert with check (true);
create policy submissions_read on public.submissions
  for select using (public.is_editor());
create policy submissions_update on public.submissions
  for update using (public.is_editor()) with check (public.is_editor());

-- subscribers: insert-only for the public, never readable client-side
create policy subscribers_insert on public.subscribers
  for insert with check (true);
create policy subscribers_read on public.subscribers
  for select using (public.is_editor());

-- ============================================================
-- Storage buckets (create in dashboard, or via these calls)
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('covers', 'covers', true),
  ('issues', 'issues', true),
  ('pdfs', 'pdfs', true)
on conflict (id) do nothing;

create policy covers_public_read on storage.objects
  for select using (bucket_id in ('covers','issues','pdfs'));
create policy covers_editor_write on storage.objects
  for all using (bucket_id in ('covers','issues','pdfs') and public.is_editor())
  with check (bucket_id in ('covers','issues','pdfs') and public.is_editor());
