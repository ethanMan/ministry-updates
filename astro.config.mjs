// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';

import { site } from './src/config.ts';
import { markdownFigures } from './src/lib/figures.ts';

// https://astro.build/config
export default defineConfig({
  // Used to build absolute URLs in the sitemap, RSS feed, and link previews.
  // Change both of these in src/config.ts, not here.
  site: site.url,
  base: site.base,

  integrations: [sitemap()],

  markdown: {
    // `satteri()` is the markdown engine Astro uses anyway; naming it here is
    // just how you add a step to it. See src/lib/figures.ts for what this does.
    processor: satteri({ hastPlugins: [markdownFigures()] }),
  },

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

    /**
     * How hard photos are compressed on the way out. This is the one place to
     * change it — it covers every photo on the site, including the ones written
     * into updates with `![](...)`, which otherwise take a lower default.
     *
     * Sharp's own default is 80. That is tuned for files straight off a camera,
     * and is visibly soft when it runs over a photo that has already been
     * resized and saved once, which is the normal case here. 90 is the setting
     * for photographs of people, where faces are the point.
     *
     * `effort: 6` spends longer looking for a smaller file at the same quality.
     * It makes the first build of a photo slower and every later one free,
     * because the result is cached in .astro-cache/.
     */
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        webp: { quality: 90, effort: 6 },
      },
    },
  },
});
