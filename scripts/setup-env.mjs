/**
 * Interactive .env.local writer.
 *
 *   node scripts/setup-env.mjs
 *
 * You paste your Supabase values into YOUR OWN terminal — they go straight into
 * .env.local (which is gitignored) and nowhere else.
 *
 * The point of this script over hand-editing the file is the validation:
 * pasting a service_role / secret key into the NEXT_PUBLIC_SUPABASE_ANON_KEY
 * slot would ship an RLS-bypassing key to every visitor's browser. That is the
 * single worst mistake available at this step, it looks completely normal in a
 * diff, and it is silent until someone notices your database is world-writable.
 * So we decode the key and refuse it.
 */

import { readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

const ENV_PATH = new URL('../.env.local', import.meta.url);

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

/* ------------------------------------------------------------ key sniffing -- */

/**
 * Works out what a key actually is, regardless of which slot it was pasted in.
 *
 * Supabase has two key formats in the wild:
 *   - Legacy JWTs (eyJ...) whose payload carries {"role":"anon"|"service_role"}
 *   - Newer prefixed keys: sb_publishable_... / sb_secret_...
 */
function classifyKey(key) {
  const k = key.trim();

  if (k.startsWith('sb_publishable_')) return 'public';
  if (k.startsWith('sb_secret_')) return 'secret';

  if (k.startsWith('eyJ')) {
    try {
      const payload = JSON.parse(
        Buffer.from(k.split('.')[1], 'base64url').toString('utf8'),
      );
      if (payload.role === 'service_role') return 'secret';
      if (payload.role === 'anon') return 'public';
      return 'unknown-jwt';
    } catch {
      return 'malformed';
    }
  }

  return 'unknown';
}

/* -------------------------------------------------------------------- main -- */

/**
 * Line reader that behaves the same on a TTY and on a pipe.
 *
 * readline/promises' question() doesn't reliably resolve for a second prompt
 * when stdin is a pipe, which made this script untestable non-interactively.
 * Draining 'line' events into a queue sidesteps that entirely.
 */
const rl = createInterface({ input: stdin });
const queue = [];
const waiters = [];
let closed = false;

rl.on('line', (line) => {
  const w = waiters.shift();
  if (w) w(line);
  else queue.push(line);
});
rl.on('close', () => {
  closed = true;
  while (waiters.length) waiters.shift()(null);
});

function ask(prompt) {
  stdout.write(prompt);
  if (queue.length) return Promise.resolve(queue.shift());
  if (closed) return Promise.resolve(null);
  return new Promise((resolve) => waiters.push(resolve));
}

/** Input ended before we had everything — bail rather than write a half file. */
function bailOnEOF() {
  console.log(c.red('\n  ✗ Input ended early. Nothing written.\n'));
  process.exit(1);
}

console.log(`
${c.bold('c³ — Supabase setup')}

Open your Supabase dashboard, pick your project, then find:
  ${c.cyan('Project Settings → API')}   ${c.dim('(newer projects: Project Settings → API Keys)')}

Nothing you type here leaves this machine.
`);

/* --- 1. Project URL ------------------------------------------------------- */

let url = '';
while (!url) {
  const answer = await ask(
    `${c.bold('Project URL')} ${c.dim('(looks like https://abcdefgh.supabase.co)')}\n> `,
  );
  if (answer === null) bailOnEOF();

  const raw = answer.trim().replace(/\/+$/, '');
  if (!raw) continue;

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(raw)) {
    console.log(
      c.yellow(
        `  ! That doesn't look like a project URL. It should be just the origin —\n` +
        `    no /rest/v1, no trailing path. Try again.\n`,
      ),
    );
    continue;
  }
  url = raw;
  console.log(c.green('  ✓ looks right\n'));
}

/* --- 2. Anon / publishable key -------------------------------------------- */

let anon = '';
while (!anon) {
  const answer = await ask(
    `${c.bold('Anon / publishable key')}\n` +
    `${c.dim('  Labelled "anon public" or "Publishable key". Safe to expose.')}\n> `,
  );
  if (answer === null) bailOnEOF();

  const raw = answer.trim();
  if (!raw) continue;

  const kind = classifyKey(raw);

  if (kind === 'secret') {
    console.log(
      c.red(`
  ✗ STOP — that is a SECRET key (service_role).

    This value would be embedded in the JavaScript sent to every visitor,
    and it bypasses Row Level Security completely. Anyone who opened your
    site could read your drafts, your subscriber list, and delete the lot.

    Go back and copy the key labelled "anon public" or "Publishable key"
    instead — the one Supabase says is safe to share.

    If you already pasted this key somewhere public, rotate it in the
    dashboard before doing anything else.
`),
    );
    continue;
  }

  if (kind === 'unknown' || kind === 'malformed') {
    console.log(
      c.yellow(
        `  ! Didn't recognise that as a Supabase key.\n` +
        `    Expected something starting with "eyJ" or "sb_publishable_".\n`,
      ),
    );
    continue;
  }

  if (kind === 'unknown-jwt') {
    console.log(
      c.yellow(`  ! That's a JWT but not an anon key. Double-check which you copied.\n`),
    );
    continue;
  }

  anon = raw;
  console.log(c.green('  ✓ confirmed public key\n'));
}

/* --- 3. Write ------------------------------------------------------------- */

// Preserve anything already in the file (e.g. a service role key mid-seed)
// rather than clobbering it.
let existing = {};
if (existsSync(ENV_PATH)) {
  for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) existing[m[1]] = m[2];
  }
}

const contents = `# Written by scripts/setup-env.mjs — gitignored, never commit.

NEXT_PUBLIC_SUPABASE_URL=${url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}

# SECRET — bypasses Row Level Security. Only scripts/seed.mjs uses it, and only
# locally. Paste it in just before seeding, then blank it out again.
SUPABASE_SERVICE_ROLE_KEY=${existing.SUPABASE_SERVICE_ROLE_KEY || ''}

NEXT_PUBLIC_SITE_URL=${existing.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
`;

writeFileSync(ENV_PATH, contents, { mode: 0o600 });
// writeFileSync's mode only applies when CREATING the file, so an existing
// .env.local would keep its old 644. Set it explicitly — this file holds keys.
chmodSync(ENV_PATH, 0o600);

console.log(`${c.green('✓ Wrote .env.local')}

  Next:
    1. Make sure you've run ${c.cyan('supabase/schema.sql')} in the SQL editor.
    2. Restart the dev server ${c.dim('(Ctrl-C, then npm run dev)')}.
    3. Create your editor account — see step 5 in the README.
`);

rl.close();
