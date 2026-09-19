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

## Songs of the season

A song is printed at the foot of the letter, just above your sign-off, with its
album cover beside it.

Start by searching for it:

```
npm run song "goodness of god bethel"
```

Pick your song from the list it prints. It saves the album cover into
`src/content/songs/` and hands you the lines to paste into the block at the very
top of this file:

```
songs:
  - title: 'Goodness of God'
    artist: 'Bethel Music'
    art: '../songs/goodness-of-god.jpg'
    # spotify: 'paste the Spotify link here, then delete the #'
    appleMusic: 'https://music.apple.com/us/album/goodness-of-god/1748012530?i=1748012533'
```

The Spotify line is the one thing left to fill in, because Spotify's catalogue
needs an account to search and Apple's does not. Open the song in Spotify, hit
the `...` menu, choose **Share → Copy Song Link**, paste it in, and delete the `#`
from the front of the line.

No single player works on both services — a Spotify player shows an Apple Music
listener nothing — so each song is linked out to both instead. Whoever is reading
taps the one they already pay for, and it opens in their own app, signed in, with
the whole song rather than a thirty-second sample. One of the two links is enough
if you cannot get the other, but both is the point.

For more than one song, run `npm run song` again and add the second `- title:`
block underneath the first, indented the same way:

```
songs:
  - title: 'Goodness of God'
    artist: 'Bethel Music'
    art: '../songs/goodness-of-god.jpg'
    spotify: 'https://open.spotify.com/track/...'
    appleMusic: 'https://music.apple.com/us/album/...'
  - title: 'Way Maker'
    artist: 'Sinach'
    art: '../songs/way-maker.jpg'
    spotify: 'https://open.spotify.com/track/...'
    appleMusic: 'https://music.apple.com/us/album/...'
```

Every line except `title` is optional — a song with no cover simply prints
without one. If the title or the artist has an apostrophe in it, it takes double
quotes instead of single — `"Firm Foundation (He Won't)"` — the same as with a
photo caption, and `npm run song` already writes it that way for you.

Leave the `songs:` lines out entirely for an issue with no song.

## Adding photos

Every photo lives in one place — `src/content/photos/` — whether it is used here, on
the gallery page, or both. Put the image file in there, then point at it with
`../photos/`:

![A short description of the photo for screen readers](../photos/my-photo.jpg)

Photos are shown wider than the text, so they have room to breathe. Put in as many
as you like — one line each, with a blank line above and below.

### Captions

Add a caption by putting it in quotes after the path, still inside the brackets:

![A short description for screen readers](../photos/my-photo.jpg 'Printed under the photo.')

The square brackets and the quotes do two different jobs, so it is worth writing
both. The brackets describe the photo for anyone who cannot see it. The quotes are
the caption everybody reads — a name, a place, what was happening.

If the caption itself needs an apostrophe, use double quotes around it instead:
`"Ethan's first week"`.

### Several photos side by side

Wrap them in a gallery. Keep the blank lines above and below the images — they are
what makes it work:

<div class="gallery">

![First photo](../photos/my-photo.jpg 'A caption for this one.')
![Second photo](../photos/my-other-photo.jpg 'And one for this one.')

</div>

Two photos come out side by side, three across, four as two rows of two. Captions
work the same way in here.

### A photo at the top of the issue

Add these lines to the block at the very top of this file:

```
cover: '../photos/my-photo.jpg'
coverAlt: 'A short description of the photo'
coverCaption: 'The line printed under it.'
```

`coverCaption` is optional, the same as a caption anywhere else.

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
