# Ministry newsletter site

A static website for publishing newsletter updates to ministry partners. Each newsletter
is a single markdown file; the home page, archive, RSS feed, and sitemap all build
themselves from those files. Hosted free on GitHub Pages or Cloudflare Pages.

---

## Quick start

```bash
npm install      # once
npm run dev      # preview at http://localhost:4321
```

Leave `npm run dev` running while you write — the browser updates as you save.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview, auto-refreshing. Drafts are visible here. |
| `npm run build` | Builds the real site into `dist/`. Fails loudly on mistakes. |
| `npm run preview` | Serves the built site, exactly as Cloudflare will. |

---

## Publishing a newsletter

1. **Copy the template.** Duplicate `src/content/newsletters/_TEMPLATE.md` and rename it
   to something like `2026-03-spring-update.md`. The filename becomes the web address
   (`/newsletters/2026-03-spring-update`), so use lowercase words with dashes and no
   spaces. Leading the name with the date keeps the folder tidy.

2. **Fill in the top block.** The section between the `---` lines controls how the issue
   appears everywhere else on the site:

   ```yaml
   ---
   title: 'Spring Update'
   date: 2026-03-14                      # YYYY-MM-DD
   summary: 'One or two sentences.'      # shown in the archive and link previews
   cover: './team-photo.jpg'             # optional, see below
   coverAlt: 'Our team outside the school'
   tags: ['update', 'prayer']            # optional
   draft: false                          # true hides it from the live site
   ---
   ```

3. **Write the body** below that block in markdown — blank line between paragraphs, `##`
   for headings, `**bold**`, `- ` for bullets, `> ` for a quoted verse.

4. **Publish** by committing and pushing:

   ```bash
   git add .
   git commit -m "Add spring update"
   git push
   ```

   Your host rebuilds and deploys within a couple of minutes. There is no separate
   publish step.

### Adding photos

Drop the image file into `src/content/newsletters/` next to your markdown file, then
reference it by name:

```markdown
![Kids at the day camp](./day-camp.jpg)
```

Photos straight off a phone are fine — the build automatically resizes them, converts
them to modern formats, and serves the right size for each visitor's screen. Always
write a short description in the square brackets for anyone using a screen reader.

### Drafts

Set `draft: true` while an issue is in progress. It shows up in `npm run dev` on your
own computer but stays off the live site until you flip it to `false`.

---

## Making it yours

Nearly everything personal lives in one file: **`src/config.ts`**. Open it to set your
name, tagline, description, contact links, an optional giving link, and the `url` /
`base` pair that tells the site what address it lives at.

A few other spots:

- **`src/pages/about.astro`** — the About page. Replace the placeholder text with your
  own story.
- **`src/styles/global.css`** — the look of the site. The block of settings at the very
  top controls colors and fonts everywhere; changing `--accent` alone re-themes the site.
  Dark mode is handled automatically and follows the visitor's device setting.
- **`public/favicon.svg`** — the little icon in the browser tab.

Delete the two sample newsletters and `sample-cover.jpg` whenever you are ready. Keep
`_TEMPLATE.md` — files starting with `_` are ignored by the build.

---

## Deploying

The site is a folder of plain HTML files, so any static host will serve it. Two free
options are set up and ready; **GitHub Pages** is the simpler of the two because the code
and the hosting live in the same place.

Either way you only do the setup once — after that, `git push` publishes.

---

### Option A — GitHub Pages (recommended)

`.github/workflows/deploy.yml` is already written. GitHub builds and publishes the site
itself; you never run a deploy command.

**1. Create the repository**

Go to [github.com/new](https://github.com/new). Name it `ministry-website` and set it to
**Public** (GitHub Pages requires a public repo on free accounts). Do not add a README,
`.gitignore`, or license — this folder already has them.

**2. Push the code**

```bash
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ministry-website.git
git push -u origin main
```

**3. Turn Pages on**

In the repository: **Settings** → **Pages** → under **Build and deployment**, set
**Source** to **GitHub Actions**. There is nothing to save; it applies immediately.

**4. Set your address in `src/config.ts`**

```ts
url:  'https://YOUR-USERNAME.github.io',   // your username, no path
base: '/ministry-website',                 // must match the repo name exactly
```

Then `git add . && git commit -m "Set site URL" && git push`.

Watch the **Actions** tab; the first build takes two or three minutes. Your site lands at
`https://YOUR-USERNAME.github.io/ministry-website/`.

> **Why `base` matters.** GitHub serves a normal repository from a subfolder, and every
> link on the site has to include it. If `base` does not match the repository name, the
> pages will load but the styling and photos will not.
>
> To drop the subfolder, name the repository `YOUR-USERNAME.github.io` instead. Then the
> site is served at `https://YOUR-USERNAME.github.io/` and you set `base: '/'`. You only
> get one repository like this per GitHub account.

**Optional: a custom domain**

Buy a domain (~$10–15/year), then in **Settings** → **Pages** → **Custom domain**, enter
it and follow the DNS instructions. Afterwards set `url` to your domain and `base` back
to `'/'`, since a custom domain serves from the root.

---

### Option B — Cloudflare Pages

1. Push to GitHub first (steps 1–2 above).
2. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com) — the free plan is enough.
3. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, and pick your repo.
4. Build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

5. **Save and Deploy.** You get a URL like `https://ministry-website.pages.dev`.
6. In `src/config.ts` set `url` to that address and `base` to `'/'` — Cloudflare serves
   from the root, not a subfolder. Commit and push.

Cloudflare also reads `public/_headers` for caching and security headers. GitHub Pages
ignores that file, which is harmless.

You can run both hosts at once off the same repository, but they cannot use different
`base` values, so pick one as the real address.

---

## What's included

- **Home page** with the latest issues as cards
- **Archive** at `/newsletters`, grouped by year
- **Individual issue pages** with previous/next navigation
- **RSS feed** at `/rss.xml` for partners who use a reader
- **Sitemap** for Google
- **Link previews** — sharing an issue by text or Facebook shows the title, summary, and
  cover photo
- **Automatic image optimization**, dark mode, and a keyboard-accessible layout

## Costs

$0. GitHub Pages is free for public repositories with a soft limit of 100 GB of traffic a
month; Cloudflare Pages' free tier allows 500 builds a month and unlimited visitors.
Either is far beyond what a newsletter site uses. A custom domain is the only optional
cost.
