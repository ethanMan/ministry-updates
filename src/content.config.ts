import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

/**
 * Each newsletter is one markdown file in src/content/newsletters/.
 * The block of settings at the top of that file (the "frontmatter") has to
 * match the shape below, otherwise the build fails with a readable error.
 */
const newsletters = defineCollection({
  // Files starting with an underscore are ignored, which is what keeps
  // _TEMPLATE.md out of the site.
  loader: glob({
    pattern: ['**/*.{md,mdx}', '!**/_*'],
    base: './src/content/newsletters',
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
      /** Optional tags like ["prayer", "travel"] for grouping issues. */
      tags: z.array(z.string()).default([]),
      /** Set to true to keep an issue out of the site while you work on it. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { newsletters };
