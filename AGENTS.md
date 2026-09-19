## What this is

A static Astro site for publishing ministry updates to partners. One markdown file per
update; the home page, archive, photo gallery, RSS feed, and sitemap all derive themselves
from content. No database, no server, no client framework — the only client-side
JavaScript on the site is the photo lightbox.

`README.md` is the owner's manual: how to publish an update, add photos, add songs, and
deploy. It is thorough and kept current — read it before answering a "how do I publish /
add a photo" question, and update it alongside any change to the authoring workflow.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview at `http://localhost:4321/ministry-updates/` (note the base path) |
| `npm run build` | Builds to `dist/`. Fails loudly on schema and missing-photo errors. |
| `npm run preview` | Serves `dist/` the way the host will |
| `npx astro check` | Types and Astro diagnostics. The only check that exists — no test suite, linter, or formatter. |
| `npm run song "song artist"` | Interactive: searches Apple's catalogue, saves album art, prints frontmatter to paste |

Node 22+ (`.nvmrc`).

## Layout

```
src/config.ts              every personal detail — name, tagline, copy, links, url/base
src/content.config.ts      the two content collections and their Zod schemas
src/content/updates/*.md   one file per update; filename is the URL slug
src/content/photos/        the whole photo library + photos.yaml (captions/dates)
src/content/songs/         album covers fetched by `npm run song` (not a collection)
src/lib/                   photos.ts (gallery layout), updates.ts (queries, dates),
                           figures.ts (markdown plugin), url.ts (withBase)
src/components/            no scoped styles; all styling is global.css classes
src/styles/global.css      the entire stylesheet, design tokens at the top
scripts/song.mjs           the `npm run song` helper
```

## Things to know before editing

**`src/config.ts` is the single source of personal detail.** Name, tagline, home-page
copy, sign-off, contact links, giving URL, `url`/`base`. Never hardcode any of it into a
template — read it from `site`. `astro.config.mjs` imports `site.url`/`site.base` rather
than repeating them.

**`base` is `/ministry-updates`, so hand-written links must use `withBase()`** from
[url.ts](src/lib/url.ts). Astro handles the base path for images, CSS, and anything it
bundles; raw `href` strings it does not. A link that works in dev at the root and breaks
on the live site is almost always a missing `withBase()`.

**`~/` is the import alias for `src/`** ([tsconfig.json](tsconfig.json)). Inside markdown
and YAML, paths are relative instead (`../photos/x.jpg` from an update), and `~/` in
`photos.yaml` means `src/` — see `resolvePath` in [photos.ts](src/lib/photos.ts#L72).

**A leading `_` means "in the folder on purpose, but not part of the site."** It keeps
`_TEMPLATE.md` out of the updates collection (the glob pattern excludes `!**/_*`) and
keeps an update-only photo out of the gallery without a build warning. Preserve this
convention in any new content folder.

**Drafts.** `draft: true` entries are filtered out only when `import.meta.env.PROD`, so
they render in `npm run dev` and vanish from `npm run build`. Always query updates through
`getPublishedUpdates()` — never `getCollection('updates')` directly — or drafts leak.

**Image sizing is explicit and deliberate everywhere.** Every `<Image>` passes
`width`/`widths`/`sizes`, and the `sizes` string mirrors the CSS that will lay the image
out (`--measure-wide` is 880px; `--page-max` 1080px). Get `sizes` wrong and the browser
assumes full viewport width and downloads a much larger file than it shows. Compression is
set once for the whole site in [astro.config.mjs](astro.config.mjs#L57) (`webp`, quality
90, effort 6) — including for markdown images, which otherwise take a lower default.

**`.astro-cache/` holds resized photos** and lives outside `node_modules` on purpose:
[deploy.yml](.github/workflows/deploy.yml) restores it between deploys so only new photos
are processed. Do not move it or add it to git.

**The gallery layout is computed at build time.** [photos.ts](src/lib/photos.ts) reads
every image's real dimensions via `import.meta.glob`, then `packIntoRows` groups photos
into rows whose aspect ratios sum to ~`target` (4.5). [PhotoGrid.astro](src/components/PhotoGrid.astro)
turns that into CSS custom properties (`--divisor`, `--count`, `--fill`, `--ratio`) and
exact per-photo widths. Nothing is measured in the browser, nothing is cropped, and nothing
reflows as images load. Raise `target` for more, smaller photos per row.

A row's target is not fixed: `rowTarget` tightens it to `narrowest ratio / minShare` (0.25)
so no photo is drawn under a quarter of the width, floored at `target / 2` so one very tall
photo cannot claim the page. Rows containing portraits therefore hold fewer photos and come
out taller — that is deliberate, not drift, and row heights varying down the page is the
intended look.

**Photo error behaviour is intentional** and worth keeping: a `photos.yaml` entry naming a
missing file **throws** with a list of every valid name; a photo in the folder with no
entry only **warns** and is skipped. Extensions are matched literally — `.jpg` and `.JPG`
are different files.

**Markdown figures.** [figures.ts](src/lib/figures.ts) is a satteri hast plugin registered
in `astro.config.mjs`. Any paragraph containing nothing but images is replaced by
`<figure>` elements, and the markdown `title` (`![alt](path 'caption')`) becomes a
`<figcaption>` instead of a tooltip. It runs before Astro's image handling, so optimization
still applies. Two structural classes are authored by hand in markdown and styled in
`global.css`: `<div class="prayer">` and `<div class="gallery">`.

**Styling.** One stylesheet, no Tailwind, no scoped `<style>` blocks in any component. The
token block at the top of [global.css](src/styles/global.css#L6) restyles the whole site;
`--accent` alone re-themes it. Sections are separated by banner comments in page order.

**Accessibility is load-bearing in the existing code**, not decoration — match it. Decorative
images get `alt=""` (song covers, since the title sits beside them); external links that
open a tab say so in their `aria-label`; the lightbox is progressive enhancement over a
plain link to the full-size photo, restores focus on close, and wraps around with arrow
keys; the header sets `aria-current="page"`, and there is a skip link.

**Songs** are frontmatter on an update, not a collection: an array validated by a Zod
`.refine()` that requires a Spotify link, an Apple Music link, or both. `npm run song`
exists because Apple's catalogue needs no API key and Spotify's does — so the Spotify URL
is the one field a human pastes in. Titles with apostrophes take double quotes in YAML.

## Voice

Both the site copy and the code comments are written for the site's owner, not for a
systems programmer: full sentences, plain English, and the *reason* for a decision rather
than a restatement of the code. Comment density is high and the comments are long by
normal standards. This is the house style — match it rather than trimming it, and keep
user-facing copy in the same warm, first-person register as `src/config.ts`.

## Deploying

Push to `main`; [deploy.yml](.github/workflows/deploy.yml) builds and publishes to GitHub
Pages. There is no manual deploy step. Cloudflare Pages also works and reads
`public/_headers` (GitHub Pages ignores it). `trailingSlash: 'ignore'` with
`build.format: 'directory'` keeps dev and production URLs consistent across both hosts.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
