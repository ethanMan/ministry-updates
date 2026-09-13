---
title: 'Your headline here'
date: 2026-01-01
summary: 'One or two sentences. This shows up on the archive page and in the preview when someone shares the link in a text message.'
tags: ['update']
draft: true
---

Dear friends and partners,

Start writing here. Regular paragraphs just work — leave a blank line between them.

## A heading

Use `##` for section headings. You can **bold** things, use _italics_, and
[link to a page](https://example.com).

- Bullet lists work like this
- One dash per line

> Use a `>` at the start of a line for a pulled-out quote or verse.

## Prayer requests

Wrap prayer requests in a prayer block and they are set apart from the rest of
the letter. Keep the blank lines above and below what is inside:

<div class="prayer">

### How to pray

- For the new students arriving in January
- For rest — it has been a long season

</div>

You do not need to sign the bottom — your sign-off from `src/config.ts` is added
to every update automatically.

## Adding photos

Every photo lives in one place — `src/content/photos/` — whether it is used here, on
the gallery page, or both. Put the image file in there, then point at it with
`../photos/`:

![A short description of the photo for screen readers](../photos/my-photo.jpg)

Photos are shown wider than the text, so they have room to breathe.

To put several photos side by side, wrap them in a gallery. Keep the blank lines
above and below the images — they are what makes it work:

<div class="gallery">

![First photo](../photos/my-photo.jpg)
![Second photo](../photos/my-other-photo.jpg)

</div>

To add a cover photo at the top of the issue, add these two lines to the block at the
very top of this file:

```
cover: '../photos/my-photo.jpg'
coverAlt: 'A short description of the photo'
```

A photo you want in an update but *not* on the gallery page should be named with a
leading underscore — `_my-photo.jpg` — which keeps it off the gallery quietly.

---

**How to publish this issue:**

1. Copy this file and rename it something like `2026-03-spring-update.md`
   (the filename becomes the web address).
2. Fill in the title, date, and summary at the top.
3. Change `draft: true` to `draft: false`.
4. Save, commit, and push. Cloudflare rebuilds the site automatically.

While `draft: true`, the issue shows up when you run `npm run dev` on your own computer
but stays off the live site.
