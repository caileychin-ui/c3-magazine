/* ============================================================================
 * c³ — seed content + content architecture
 * ----------------------------------------------------------------------------
 * This file is the single source of truth for demo content. In the real
 * Next.js app this maps 1:1 to your data layer:
 *
 *   /data/articles.ts   -> ARTICLES        (Article[])
 *   /data/issues.ts     -> ISSUES          (Issue[])
 *   /data/authors.ts    -> AUTHORS         (Author[])
 *   /data/categories.ts -> CATEGORIES      (Category[])
 *
 * MIGRATION NOTE:
 *   Swap these arrays for calls to Supabase / Postgres. Keep the same shapes
 *   (the TypeScript interfaces below) so components never change. e.g.
 *     export async function getArticles() {
 *       const { data } = await supabase.from('articles').select('*');
 *       return data as Article[];
 *     }
 *   Files (coverImage, pdfUrl) become Supabase Storage / S3 / Cloudinary URLs.
 *
 * NOTE ON CONTENT: every article below is CLEARLY LABELLED sample/demo content.
 * Figures, tuition numbers, policy and admissions claims are placeholders for
 * layout only and must NOT be treated as verified facts.
 * ==========================================================================*/

/* --- TypeScript interfaces (documentation; enforced in the .ts version) -----
interface Category   { id; name; slug; colorToken; description }
interface Author     { id; name; bio; avatar; role }
interface Citation   { id; marker; title; author; publication; url; accessedDate; note }
interface Issue      { id; title; season; year; description; coverImage; pdfUrl; articleIds[]; publishDate }
interface Article    { id; title; subtitle; slug; summary; author; category; tags[];
                       issueId; status; featured; publishDate; updatedDate; readingTime;
                       coverImage; pdfUrl; markdownContent; citations[]; editorNote;
                       sourcesMethodology; relatedArticleIds[] }
----------------------------------------------------------------------------- */

export const CATEGORIES = [
  { id: "c1", name: "Admissions",        slug: "admissions",    colorToken: "admissions",    description: "How students actually get in — and who gets left out." },
  { id: "c2", name: "Financial aid",     slug: "financial-aid", colorToken: "financial-aid", description: "Cost, aid, loans, and the sticker-price myth." },
  { id: "c3", name: "Policy",            slug: "policy",        colorToken: "policy",        description: "Higher-ed policy and the politics behind it." },
  { id: "c4", name: "International",      slug: "international",  colorToken: "international",  description: "Visas, status, and studying across borders." },
  { id: "c5", name: "Student essays",    slug: "essays",        colorToken: "essays",        description: "First-person student voice." },
  { id: "c6", name: "Campus culture",    slug: "campus",        colorToken: "campus",        description: "Life inside the institutions." },
  { id: "c7", name: "Data & explainers", slug: "data",          colorToken: "data",          description: "The numbers, decoded." },
];

export const AUTHORS = [
  { id: "a1", name: "Cailey Chin", handle: "@caileyskll", role: "Founder & Editor-in-Chief", avatar: "",
    bio: "UPenn Wharton student and content creator. Got into every business school she applied to — and started c³ to make college admissions, elite education, financial aid, and institutional policy legible for students who are usually left out of these conversations." },
  { id: "a2", name: "Sample Contributor", handle: "@sample", role: "Staff writer (demo)", avatar: "",
    bio: "Placeholder contributor used for demo bylines." },
];

export const ISSUES = [
  { id: "i1", title: "The Gatekeeping Issue", season: "Fall", year: 2025, number: "01",
    color: "var(--yellow)", textColor: "var(--ink)",
    description: "Our launch issue: who guards the gates of elite education, and what it costs the students trying to get through them. (Demo issue.)",
    coverImage: "", pdfUrl: "files/issues/c3-issue-01.pdf",
    articleIds: ["art1", "art2", "art3"], publishDate: "2025-09-15" },
  { id: "i2", title: "Money & Access", season: "Winter", year: 2026, number: "02",
    color: "var(--mint)", textColor: "var(--ink)",
    description: "Financial aid, sticker shock, and the widening gap between public and private cost. (Demo issue.)",
    coverImage: "", pdfUrl: "files/issues/c3-issue-02.pdf",
    articleIds: ["art4"], publishDate: "2026-01-20" },
  { id: "i3", title: "Borders & Status", season: "Spring", year: 2026, number: "03",
    color: "var(--lavender)", textColor: "var(--ink)",
    description: "International students, visa policy, and studying under uncertainty. (Demo issue.)",
    coverImage: "", pdfUrl: "files/issues/c3-issue-03.pdf",
    articleIds: ["art5"], publishDate: "2026-04-10" },
];

/* The intro / letter-from-the-founder article shown on the homepage. */
export const INTRO = {
  id: "intro", slug: "why-c3-exists", featured: true,
  title: "Why I started c³",
  subtitle: "A letter from the founder.",
  author: "a1", category: "essays", tags: ["student essays", "high school advice"],
  issueId: "i1", status: "published", featured_intro: true,
  publishDate: "2025-09-15", updatedDate: "2025-09-15", readingTime: "3 min",
  coverImage: "", pdfUrl: "",
  markdownContent:
`Hi — I'm **Cailey**. I'm a student at UPenn's Wharton School, and I make content about getting into college. Along the way I got into every business school I applied to, and I kept noticing the same thing: the students who most needed the information were the ones who never got it.

College admissions, elite education, financial aid, and the tangle of institutional policy are treated like insider knowledge. If you have a counselor, a parent who's done it, or a network, the systems are navigable. If you don't, you're handed a maze and told to figure it out alone.

> c³ exists to decode those systems — and to make them feel navigable for the students who were never handed the map.

**c³** — *college access, decoded* — is a student-led magazine about admissions, aid, higher-ed policy, and the institutions students are expected to understand without help. We explain how these systems actually work, we platform student voices, and we try to make something confusing feel a little more human.

If any of that sounds like you, [pitch us a story](#/apply). This is built by students, for students.`,
  citations: [], editorNote: "", sourcesMethodology: "", relatedArticleIds: ["art1", "art2"],
};

export const ARTICLES = [
  {
    id: "art1", slug: "ivies-hardest-ever",
    title: "The Ivies Have Never Been This Hard to Get Into",
    subtitle: "Record low admit rates, decoded — what the numbers actually mean for applicants.",
    summary: "Admit rates keep falling. We break down what's driving the squeeze and what it does (and doesn't) say about your chances.",
    author: "a1", category: "admissions", tags: ["admissions", "high school advice", "standardized testing"],
    issueId: "i1", status: "published", featured: true,
    publishDate: "2025-09-15", updatedDate: "2025-09-16", readingTime: "6 min",
    coverImage: "", pdfUrl: "files/articles/ivies-hardest-ever.pdf",
    markdownContent:
`> ⚠️ Sample / demo article. Figures below are **placeholders** for layout and are not verified.

## The squeeze is real — but misunderstood

Every spring the headlines announce another "record low" admit rate.[^1] The number is real, but it's also the most misread statistic in admissions.

Applications have ballooned while class sizes stayed flat. When the denominator explodes and the numerator holds, the rate falls — mechanically, not because you got less qualified.[^2]

## What actually changed

- **Test-optional** widened the applicant pool.
- **The common app** made it trivial to add one more school.
- **Rankings incentives** reward schools for rejecting more people.

> A falling admit rate measures institutional behavior at least as much as it measures you.

## What it means for you

Build a genuinely balanced list. A single-digit admit rate is a statement about the *pool*, not a verdict on any one applicant.`,
    citations: [
      { id: "ct1", marker: "1", title: "Class of 2029 admissions statistics", author: "Demo University", publication: "Office of Admissions (placeholder)", url: "https://example.com/stats", accessedDate: "2025-09-01", note: "Placeholder figure for demo." },
      { id: "ct2", marker: "2", title: "Application volume trends", author: "Sample Source", publication: "Higher-Ed Data (placeholder)", url: "https://example.com/trends", accessedDate: "2025-09-02", note: "Illustrative only." },
    ],
    editorNote: "This is demo content built to show c³'s article layout. Treat all figures as placeholders.",
    sourcesMethodology: "Sample methodology: figures are illustrative placeholders. In a real c³ piece this box would list datasets, date ranges, and how rates were computed.",
    relatedArticleIds: ["art2", "art3"],
  },
  {
    id: "art2", slug: "harvard-vs-dhs",
    title: "Harvard vs. DHS",
    subtitle: "A demo explainer on how a university and a federal agency end up in court.",
    summary: "When institutions and federal agencies collide, students are caught in between. A plain-language walkthrough. (Demo.)",
    author: "a1", category: "policy", tags: ["news", "admissions"],
    issueId: "i1", status: "published", featured: false,
    publishDate: "2025-09-10", updatedDate: "2025-09-10", readingTime: "5 min",
    coverImage: "", pdfUrl: "files/articles/harvard-vs-dhs.pdf",
    markdownContent:
`> ⚠️ Sample / demo article. This is a **placeholder** explainer and not legal reporting.

## Why this matters to students

When a university and a federal agency disagree about policy, the fight can decide whether students keep their status, funding, or programs.[^1]

## How a case like this moves

1. An agency issues guidance or an order.
2. The institution challenges it.
3. A court weighs in — often with a temporary hold while it decides.

> Students are rarely the plaintiffs, but they're almost always the people most affected.

We'll keep this explainer updated as the demo scenario evolves.`,
    citations: [
      { id: "ct3", marker: "1", title: "Placeholder case summary", author: "Sample Source", publication: "Demo Law Review", url: "https://example.com/case", accessedDate: "2025-09-05", note: "Illustrative placeholder." },
    ],
    editorNote: "Demo explainer. Nothing here is legal advice or verified reporting.",
    sourcesMethodology: "Sample methodology placeholder.",
    relatedArticleIds: ["art1", "art5"],
  },
  {
    id: "art3", slug: "death-of-test-optional",
    title: "The Death of Test-Optional College Admissions",
    subtitle: "Schools are bringing back the SAT/ACT. A demo look at what reinstated testing means.",
    summary: "Test-optional was supposed to be permanent. It wasn't. What the reversal means for applicants. (Demo.)",
    author: "a1", category: "admissions", tags: ["admissions", "standardized testing"],
    issueId: "i1", status: "published", featured: false,
    publishDate: "2025-08-28", updatedDate: "2025-08-28", readingTime: "5 min",
    coverImage: "", pdfUrl: "files/articles/death-of-test-optional.pdf",
    markdownContent:
`> ⚠️ Sample / demo article. Figures are **placeholders**.

## The reversal

A wave of selective schools quietly reinstated testing requirements.[^1] The pandemic-era "test-optional forever" narrative is over at many institutions.

## Who this helps and hurts

- Strong testers regain a lever.
- Students without cheap test access lose ground.

> The question was never "are scores useful" — it's "useful for whom, and at what cost to access."`,
    citations: [
      { id: "ct4", marker: "1", title: "Testing policy tracker (placeholder)", author: "Sample Source", publication: "Demo Data", url: "https://example.com/testing", accessedDate: "2025-08-20", note: "Illustrative." },
    ],
    editorNote: "Demo content. Placeholder figures only.",
    sourcesMethodology: "Sample methodology placeholder.",
    relatedArticleIds: ["art1", "art4"],
  },
  {
    id: "art4", slug: "out-of-state-publics-cost",
    title: "Out-of-State Publics Now Rival Private Costs",
    subtitle: "A demo data explainer on the shrinking public-vs-private price gap.",
    summary: "The 'affordable public' assumption breaks down out of state. We chart the demo numbers. (Demo.)",
    author: "a1", category: "financial-aid", tags: ["financial aid", "data"],
    issueId: "i2", status: "published", featured: true,
    publishDate: "2026-01-18", updatedDate: "2026-01-18", readingTime: "4 min",
    coverImage: "", pdfUrl: "files/articles/out-of-state-publics.pdf",
    markdownContent:
`> ⚠️ Sample / demo article. All tuition figures are **placeholders** and not verified.

## The gap is closing

Out-of-state sticker prices at flagship publics now approach private-university territory.[^1] For many families the "cheaper public" shortcut no longer holds.

## What to actually compare

- **Net price**, not sticker.
- Aid generosity, not headline tuition.
- Four-year cost, not one year.

> Sticker price is marketing. Net price is the number that matters.`,
    citations: [
      { id: "ct5", marker: "1", title: "Tuition comparison (placeholder)", author: "Sample Source", publication: "Demo Data", url: "https://example.com/tuition", accessedDate: "2026-01-10", note: "Illustrative placeholder figure." },
    ],
    editorNote: "Demo data explainer. Numbers are placeholders.",
    sourcesMethodology: "Sample methodology: net-price definitions would be listed here in a real piece.",
    relatedArticleIds: ["art3", "art1"],
  },
  {
    id: "art5", slug: "f1-visa-cap",
    title: "The 4-Year Visa Cap: F-1 Status Under Threat",
    subtitle: "A demo explainer on proposed fixed-term limits for international students.",
    summary: "A proposed cap would put a clock on F-1 status. What it could mean for international students. (Demo.)",
    author: "a1", category: "international", tags: ["news", "life in college"],
    issueId: "i3", status: "draft", featured: false,
    publishDate: "2026-04-08", updatedDate: "2026-04-08", readingTime: "5 min",
    coverImage: "", pdfUrl: "files/articles/f1-visa-cap.pdf",
    markdownContent:
`> ⚠️ Sample / demo article. This is a **placeholder** explainer, not immigration advice.

## What's being proposed

A rule change would replace open-ended "duration of status" with a fixed term — a hard clock on how long F-1 students can stay.[^1]

## Why students are worried

- Programs longer than the cap need extensions.
- Uncertainty affects enrollment decisions today.

> A visa clock doesn't just count years — it shapes which students even apply.`,
    citations: [
      { id: "ct6", marker: "1", title: "Proposed rule summary (placeholder)", author: "Sample Source", publication: "Demo Policy Brief", url: "https://example.com/f1", accessedDate: "2026-04-01", note: "Illustrative placeholder." },
    ],
    editorNote: "Demo explainer. Not immigration advice; figures are placeholders.",
    sourcesMethodology: "Sample methodology placeholder.",
    relatedArticleIds: ["art2", "art1"],
  },
];

/* Masthead / staff (shown on the About page). accomplishments is a short list. */
export const STAFF = [
  { id: "a1", name: "Cailey Chin", handle: "@caileyskll", role: "Founder & Editor-in-Chief", color: "var(--pink)", textColor: "#701052",
    bio: "UPenn Wharton student and content creator building c³ so more students can decode admissions, aid, and elite education.",
    accomplishments: [
      "Founded c³ and set its editorial mission",
      "Admitted to every business school she applied to",
      "Creator making college-admissions content for students",
    ] },
  { id: "s2", name: "Pushkal Srivastava", handle: "", role: "Managing Editor", color: "var(--blue)", textColor: "var(--blue-deep)",
    bio: "Managing editor keeping c³'s reporting sharp, sourced, and on schedule across issues.",
    accomplishments: [
      "Runs the editorial calendar and production pipeline",
      "Leads sourcing, fact-checking, and line editing",
      "Mentors first-time student contributors",
    ] },
];

/* Topic cloud for the homepage (label + category color token + optional count). */
export const TOPICS = [
  { label: "College admissions", token: "admissions" },
  { label: "Financial aid",      token: "financial-aid" },
  { label: "Education policy",   token: "policy" },
  { label: "International students", token: "international" },
  { label: "Student essays",     token: "essays" },
  { label: "Campus culture",     token: "campus" },
  { label: "Data explainers",    token: "data" },
  { label: "Accessibility",      token: "featured" },
];

/* Contributor roles for the Apply page + homepage CTA. */
export const ROLES = [
  { key: "writers",    title: "Writers",      color: "var(--blue)",      does: "Report and write explainers, essays, and features on admissions, aid, and policy.", who: "Curious students who can turn a confusing system into a clear story." },
  { key: "editors",    title: "Editors",      color: "var(--coral)",     does: "Shape pitches, line-edit drafts, and keep our sourcing honest.", who: "Detail-obsessed readers who love making writing sharper." },
  { key: "designers",  title: "Designers",    color: "var(--lavender)",  does: "Design covers, article art, and social graphics in the c³ visual language.", who: "Visual thinkers who like playful, bold, editorial design." },
  { key: "researchers",title: "Researchers",  color: "var(--mint)",      does: "Pull data, fact-check figures, and build the sources behind explainers.", who: "People who read the footnotes for fun." },
  { key: "social",     title: "Social media", color: "var(--pink)",      does: "Turn stories into carousels, shorts, and threads that actually reach students.", who: "Students fluent in how classmates really find information." },
  { key: "photovideo", title: "Photo / video",color: "var(--tangerine)", does: "Shoot and edit campus photo essays and short documentary video.", who: "Storytellers with a camera and a point of view." },
];

/* Convenience lookups (mirror the accessors you'd write over Supabase). */
export function authorById(id) { return AUTHORS.find(a => a.id === id) || AUTHORS[0]; }
export function issueById(id) { return ISSUES.find(i => i.id === id); }
export function articleBySlug(slug) { return ARTICLES.find(a => a.slug === slug); }
export function articleById(id) { return ARTICLES.find(a => a.id === id); }
export function categoryBySlug(slug) { return CATEGORIES.find(c => c.slug === slug); }
