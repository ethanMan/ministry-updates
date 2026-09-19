import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'zod';

/**
 * Each update is one markdown file in src/content/updates/.
 * The block of settings at the top of that file (the "frontmatter") has to
 * match the shape below, otherwise the build fails with a readable error.
 */
const updates = defineCollection({
  // Files starting with an underscore are ignored, which is what keeps
  // _TEMPLATE.md out of the site.
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!**/_*'],
    base: './src/content/updates',
  }),
  schema: ({ image }) =>
    z.object({
      /** Headline of the issue, e.g. "Fall Update 2026". */
      title: z.string(),
      /** Publish date, written as YYYY-MM-DD. */
      date: z.coerce.date(),
      /** One or two sentences shown on the archive page and in link previews. */
      summary: z.string(),
      /** Optional photo at the top of the issue. Put the file next to the .md file. */
      cover: image().optional(),
      /** Describes the cover photo for screen readers and when images fail to load. */
      coverAlt: z.string().optional(),
      /** Optional line printed under the cover photo, for everyone to read. */
      coverCaption: z.string().optional(),
      /**
       * What you had on repeat this season. Each song needs a title and at
       * least one link — both where you have them, so that the partners
       * listening on Spotify and the ones on Apple Music can each play it
       * without hunting for it.
       */
      songs: z
        .array(
          z
            .object({
              /** The name of the track. */
              title: z.string(),
              /** Who it is by. */
              artist: z.string().optional(),
              /**
               * The album cover. Put the file in src/content/songs/ and point
               * at it with '../songs/…'. `npm run song` fetches it for you.
               */
              art: image().optional(),
              /** Full link to the track on Spotify. */
              spotify: z.url().optional(),
              /** Full link to the track on Apple Music. */
              appleMusic: z.url().optional(),
            })
            .refine((song) => song.spotify || song.appleMusic, {
              message:
                'A song needs a spotify link, an appleMusic link, or (best) both.',
            }),
        )
        .default([]),
      /** Optional tags like ["prayer", "travel"] for grouping issues. */
      tags: z.array(z.string()).default([]),
      /** Set to true to keep an issue out of the site while you work on it. */
      draft: z.boolean().default(false),
    }),
});

/**
 * The gallery at /photos. Unlike updates, all of the photos are described in
 * one file — src/content/photos/photos.yaml — because a line or two per photo
 * is easier to keep up with than a file per photo.
 *
 * The key of each block in that file is the image filename, which is how a
 * caption finds its photo.
 */
const photos = defineCollection({
  loader: file('src/content/photos/photos.yaml'),
  schema: z.object({
    /** When the photo was taken, written as YYYY-MM-DD. Sets the order. */
    date: z.coerce.date(),
    /** The line shown with the photo. */
    caption: z.string().default(''),
    /** Describes the photo for screen readers. Falls back to the caption. */
    alt: z.string().default(''),
  }),
});

export const collections = { updates, photos };
