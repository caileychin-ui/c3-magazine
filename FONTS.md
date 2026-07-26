# Fonts — read before launch

The prototype embedded four typefaces. Only one of them is licensed for use on
a public website.

| Font | Where it's used | Licence | Safe to publish? |
|---|---|---|---|
| **Nunito** | `--font-ui`, and the fallback for everything | SIL Open Font License | ✅ Yes |
| **Nexa** (Light + Bold) | `--font-body`, `--font-headline` | Commercial — © Svetoslav Simov / [Fontfabric](http://fontfabric.com/) | ❌ Not yet |
| **Colinoosh** | `--font-display` (headlines, drop caps) | Commercial | ❌ Not yet |
| **Makcasa** | declared; light use | Commercial — © TimelessType.co | ❌ Not yet |

## Why this matters

A desktop font licence — the kind you get when you buy a font to use in Canva,
Figma or Illustrator — **does not permit web embedding**. Publishing a site that
serves `Nexa-Bold.otf` to every visitor puts the raw font file one right-click
away from anyone who loads the page. That is redistribution, and it's the thing
webfont licences exist to authorise.

Foundries do enforce this. Fontfabric in particular sells a separate webfont
licence, and font-licensing audits of public sites are routine.

## What this repo does about it

The four `.otf` files are in `public/fonts/`, which is **gitignored**. They are
on your machine so local development looks right, but they will not be committed
and will not reach Vercel.

`app/globals.css` declares them with fallback chains that degrade cleanly:

```css
--font-display: "Colinoosh", "Nexa", var(--font-nunito), system-ui, sans-serif;
--font-headline: "Nexa", var(--font-nunito), system-ui, sans-serif;
--font-body:     "Nexa", var(--font-nunito), system-ui, sans-serif;
--font-ui:                var(--font-nunito), system-ui, sans-serif;
```

If a file is missing, the browser fails the fetch and falls through to Nunito.
The site stays coherent — rounded, friendly, correct spacing — it just loses the
distinctive display face. Nothing breaks, and `font-display: swap` means text is
never invisible while this resolves.

**So: deploying today is legally safe.** It will render in Nunito.

## Your three options

1. **Buy webfont licences.** Nexa is at fontfabric.com; Colinoosh and Makcasa
   are on the marketplaces they came from. Then convert to `.woff2` (see below),
   commit those, and drop the `public/fonts/` line from `.gitignore`.

2. **Substitute an open font with similar character.** Good rounded-geometric
   candidates on Google Fonts: **Baloo 2**, **Fredoka**, **Nunito Sans**,
   **Outfit**. Swap the family name in `globals.css` and add it to the
   `next/font/google` import in `app/layout.js`.

3. **Ship on Nunito alone.** Already works. Change nothing.

## If you do buy a licence

`.otf` is a poor web format — Makcasa is 163 KB as OTF and would be roughly
40 KB as WOFF2. Convert before shipping:

```bash
npx --yes ttf2woff2 < public/fonts/Nexa-Bold.otf > public/fonts/Nexa-Bold.woff2
```

Then update the `@font-face` blocks in `app/globals.css` to
`format("woff2")`, and prefer `next/font/local` over raw `@font-face` so Next
preloads and fingerprints them.
