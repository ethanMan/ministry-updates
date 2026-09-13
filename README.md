# Ministry updates site

A static website for publishing updates to ministry partners. Each update
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

## Publishing an update

1. **Copy the template.** Duplicate `src/content/updates/_TEMPLATE.md` and rename it
   to something like `2026-03-spring-update.md`. The filename becomes the web address
   (`/updates/2026-03-spring-update`), so use lowercase words with dashes and no
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

Every photo on the site lives in one folder: `src/content/photos/`. Drop the image
file in there, then point at it with `../photos/`:

```markdown
![Kids at the day camp](../photos/day-camp.jpg)
```

Photos straight off a phone are fine — the build automatically resizes them, converts
them to modern formats, and serves the right size for each visitor's screen. Always
write a short description in the square brackets for anyone using a screen reader.

Photos are given more room than the text: they sit wider than the reading column so the
faces in them are easy to see.

To put several photos side by side, wrap them in a gallery. The blank lines around the
images matter:

```markdown
<div class="gallery">

![Kids at the day camp](../photos/day-camp.jpg)
![The new roof](../photos/roof.jpg)
![Tuesday night dinner](../photos/dinner.jpg)

</div>
```

A cover photo works the same way — `cover: '../photos/day-camp.jpg'` in the block at
the top of the file.

### Prayer requests

Wrapping a section in a prayer block sets it apart from the rest of the letter. The
blank lines matter here too:

```markdown
<div class="prayer">

### How to pray

- For the new students arriving in January
- For rest — it has been a long season

</div>
```

Your sign-off is added to the foot of every update automatically, so there is no need to
type it each time.

### The home page banner

The wide photo at the top of the home page is `src/assets/home-banner.jpg`. Replace that
file with your own photo — keep the name, or use a `.png`/`.webp` instead — and update
`bannerAlt` in `src/config.ts` to describe it. A landscape photo works best; something
around 2000px wide is plenty. Delete the file and the banner disappears.

### Drafts

Set `draft: true` while an issue is in progress. It shows up in `npm run dev` on your
own computer but stays off the live site until you flip it to `false`.

---

## The photo gallery

`/photos` is a collage of every photo you add, newest first. Photos of any shape can
go in it — tall, wide, square, panorama — and they are arranged into rows that each
run flush across the page, with nothing cropped.

Adding a photo takes two steps.

**1. Drop the file into `src/content/photos/.`** Straight off a phone or camera is
fine; the build resizes it. Name it however you like.

**2. Add a block to `src/content/photos/photos.yaml`:**

```yaml
'2026-03-day-camp.jpg':
  date: 2026-03-14
  caption: 'The last morning of day camp.'
  alt: 'Children and leaders sitting in a circle on the grass.'
```

The first line is the filename, exactly as it appears in the folder — `.jpg` and
`.JPG` are different names as far as the build is concerned. `date` sets where the
photo lands on the page, so the order of the blocks in the file does not matter and
new photos can just go at the top. `caption` is shown with the photo; `alt`
describes it for anyone using a screen reader, and falls back to the caption if you
leave it out.

The date and caption appear over the bottom of a photo when you point at it, and
always on a phone. Clicking a photo opens it large, with arrow keys to step through.

### One folder for every photo

`src/content/photos/` is the whole photo library — updates point into it with
`../photos/`, and the gallery lists the same files by name. A photo used in both
places is stored once.

There are only two rules:

- **Everything in the folder is a gallery photo.** A photo with no block in
  `photos.yaml` is left off the page and the build prints a warning, because a photo
  with no date has nowhere to go in a list that runs newest to oldest.
- **Unless it starts with `_`.** Name a photo `_roof-detail.jpg` and the gallery
  ignores it quietly — the same convention that keeps `_TEMPLATE.md` off the site.
  That is how a photo meant only for an update lives in the folder without nagging.

A block naming a file that is not there **stops the build**, with a message listing
every photo you could have meant.

Once there are a lot of photos, subfolders work too — put the file in
`src/content/photos/2026/` and list it as `'2026/retreat.jpg'`.

If you ever do want a photo from outside the folder, give its path:
`'~/assets/portrait.jpg'`, where `~` means the `src` folder.

### How the collage works

Every photo in a row is drawn at the same height and keeps its own shape, so the
widths come out different and the row ends exactly at the right-hand edge. The rows
are worked out during the build, in `src/lib/photos.ts`, because that is when the
size of every photo is known — so the browser gets a finished layout and nothing
shuffles around as the photos load. The last row usually cannot be filled, so it
simply stops short rather than stretching its photos to reach the edge.

On a phone the rows would be too small to see, so below 640px wide the collage
becomes a single column, each photo at its full shape.

To fit more or fewer photos per row, change the `target` in `packIntoRows` in
`src/lib/photos.ts`. Higher means smaller photos and more of them per row.

### Large galleries

Resizing photos is the slow part of a build, so the results are cached in
`.astro-cache/` and reused — only photos you have just added get processed.
`.github/workflows/deploy.yml` carries that cache between deploys too, which is what
keeps publishing quick once there are hundreds of photos in the gallery.

---

## Making it yours

Nearly everything personal lives in one file: **`src/config.ts`**. Open it to set your
name, tagline, description, the note in your own voice on the home page, your sign-off,
contact links, the giving link, the banner description, and the `url` / `base` pair that
tells the site what address it lives at.

`givingUrl` drives the **Give** button in the top right of the header. Empty it out to
remove giving from the site.

A few other spots:

- **`src/assets/home-banner.jpg`** — the wide photo at the top of the home page.
- **`src/assets/portrait.jpg`** — the photo of you beside the note and on the About
  page. Delete it to leave it out.
- **`src/pages/about.astro`** — the About page. Replace the placeholder text with your
  own story.
- **`src/styles/global.css`** — the look of the site. The block of settings at the very
  top controls colors and fonts everywhere; changing `--accent` alone re-themes the site.
  `--measure-wide` controls how far photos spread past the text column.
- **`public/favicon.svg`** — the little icon in the browser tab.

Delete the two sample updates and `sample-cover.jpg` whenever you are ready, along with
the `sample-*.jpg` photos in `src/content/photos/` and their entries in `photos.yaml`.
Keep `_TEMPLATE.md` — files starting with `_` are ignored by the build.

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

- **Home page** with a note from you and the most recent updates
- **Archive** at `/updates`, grouped by year
- **Photo gallery** at `/photos` — a collage of captioned photos, newest first
- **Individual update pages** with previous/next navigation
- **RSS feed** at `/rss.xml` for partners who use a reader
- **Sitemap** for Google
- **Link previews** — sharing an update by text or Facebook shows the title, summary, and
  cover photo
- **Automatic image optimization**, a wide banner and gallery layout, and a
  keyboard-accessible design

## Costs

$0. GitHub Pages is free for public repositories with a soft limit of 100 GB of traffic a
month; Cloudflare Pages' free tier allows 500 builds a month and unlimited visitors.
Either is far beyond what a site like this uses. A custom domain is the only optional
cost.
