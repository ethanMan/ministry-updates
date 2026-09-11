// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { site } from './src/config.ts';

// https://astro.build/config
export default defineConfig({
  // Used to build absolute URLs in the sitemap, RSS feed, and link previews.
  // Change both of these in src/config.ts, not here.
  site: site.url,
  base: site.base,

  integrations: [sitemap()],

  // Cloudflare Pages serves /about as /about/, so matching that here keeps
  // links consistent between local dev and the live site.
  trailingSlash: 'ignore',

  build: {
    format: 'directory',
  },

  image: {
    // Photos from phones are huge; cap the widths we bother generating.
    responsiveStyles: true,
  },
});
