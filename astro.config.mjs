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

  // Resized photos are cached here so a rebuild only has to process the photos
  // that are new. This normally lives inside node_modules, which GitHub Actions
  // wipes on every deploy; keeping it outside means the gallery does not get
  // re-processed from scratch each time. See .github/workflows/deploy.yml.
  cacheDir: './.astro-cache',


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
