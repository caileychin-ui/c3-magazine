# c³ Magazine

Next.js 16 (App Router) + Supabase. Ported from the `c3 Magazine (standalone).html`
prototype artifact.

---

## Setup

### 1. Create the Supabase project

At [supabase.com](https://supabase.com) → New project. Save the database password
somewhere safe; it's shown once.

### 2. Create the schema

Supabase dashboard → SQL Editor → paste the whole of `supabase/schema.sql` → Run.

This creates the tables, the Row Level Security policies, and the `covers` /
`issues` storage buckets.

### 3. Add your keys

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
Project Settings → API.

> The `anon` key is meant to be public — it ships to the browser and authorises
> nothing on its own. RLS is what protects the data.
>
> The `service_role` key is a different animal: it bypasses RLS entirely. Only
> `scripts/seed.mjs` uses it, only locally. Never commit it, never put it in
> Vercel, never paste it into a chat or an issue.

### 4. Run it

```bash
npm run dev
```

Without keys you'll get a setup screen instead of a crash, so this works at any
stage.

### 5. Make yourself an editor

Supabase dashboard → Authentication → Users → **Add user** (email + password;
tick "Auto Confirm User").

Then in the SQL editor, promote that account:

```sql
insert into public.profiles (id, email, role)
select id, email, 'admin' from auth.users where email = 'you@example.com'
on conflict (id) do update set role = 'admin';
```

Sign in at `/admin/login`.

> There is no public sign-up. Editors are created by hand in the dashboard —
> which is what you want for a masthead of a handful of people.

### 6. Optional — import the demo content

```bash
node scripts/seed.mjs
```

Paste `SUPABASE_SERVICE_ROLE_KEY` into `.env.local` first, then blank it out
after.

Everything lands as **draft** and every issue as **unpublished**. That's
deliberate — see the warning below.

---

## ⚠️ The demo content is fabricated

The five seeded articles contain **invented admissions statistics, a made-up
court case, and `example.com` citations**. They were written to demonstrate
layout, not to be read.

RLS makes drafts invisible to the public, so seeding is safe. But **rewrite each
piece before publishing — don't just flip the status.** Publishing invented
figures under a real education magazine's name is the kind of mistake that is
very hard to walk back.

---

## Architecture

```
app/
  page.js                  home
  admin/page.js            studio (editor-gated)
  admin/login/             sign-in + auth server actions
  actions/forms.js         newsletter / pitch / contribute handlers
components/                shared UI
lib/
  supabase/server.js       RLS-bound server client (anon key)
  supabase/client.js       browser client
  dal.js                   auth boundary — getUser / getEditor / requireEditor
  queries.js               data layer; returns prototype-shaped objects
proxy.js                   session refresh + optimistic /admin redirect
supabase/schema.sql        tables, RLS, storage buckets
scripts/seed.mjs           demo import with old-id → UUID remapping
```

### Authorization is three layers deep

1. **`proxy.js`** — cheap cookie check, bounces strangers off `/admin`.
   Optimistic only. Next's own docs say proxy must not be the security
   boundary, since it runs on prefetches and can't safely hit the database.
2. **`lib/dal.js`** — the real gate. `getUser()` uses `supabase.auth.getUser()`,
   which revalidates the JWT, *not* `getSession()`, which would trust a forged
   cookie. Then it requires an `editor`/`admin` role from the `profiles` table —
   so a user can't promote themselves by tampering with a token.
3. **Postgres RLS** — enforced even if 1 and 2 are bypassed. Anonymous readers
   can only ever see `status = 'published'`.

### What changed from the prototype

| Prototype | Now |
|---|---|
| `if (pass === "c3admin")` in shipped JS, password printed on the login screen | Supabase Auth + role check + RLS |
| `/admin` linked from the public navbar and footer | Not signposted publicly |
| Edits lived in `setState`, lost on refresh | Persisted to Postgres |
| Three forms that `preventDefault()` and faked a success toast | Real server actions, validated, honeypot + rate limit |
| Hash routing (`#/article/slug`) — invisible to search engines | Real routes, per-article metadata |
| `<title>Bundled Page</title>` | Real metadata, OG tags |
| Fonts embedded as base64 in the HTML | See [FONTS.md](FONTS.md) — licensing matters |

---

## Still to do

- Port remaining pages: `/articles`, `/articles/[slug]`, `/issues`, `/about`,
  `/contribute`, `/pitch` (prototype source is in `prototype-app.js.reference`)
- Article editor + issue editor in the studio
- Uploads tab → Supabase Storage `covers` / `issues` buckets
- `sitemap.xml` + `robots.txt`
- Decide the font question ([FONTS.md](FONTS.md))
- Replace all demo content with real reporting

## Notes

- **Rate limiting** on the public forms is per-instance memory: fine for a
  magazine, but it resets on deploy and doesn't coordinate across serverless
  instances. If spam becomes real, move to Upstash Redis or put Cloudflare
  Turnstile in front.
- **`AGENTS.md`** is from the Next.js scaffold and is worth heeding — this is
  Next 16, where `middleware.ts` is now `proxy.ts`.
