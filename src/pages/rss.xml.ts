import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '~/config';
import { getPublishedNewsletters } from '~/lib/newsletters';
import { withBase } from '~/lib/url';

/**
 * An RSS feed, so partners who use a reader can follow along without email.
 * Available at /rss.xml
 */
export async function GET(context: APIContext) {
  const entries = await getPublishedNewsletters();

  return rss({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    // The homepage of the feed, including the subfolder when there is one.
    site: new URL(withBase('/'), context.site ?? site.url),
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: withBase(`/newsletters/${entry.id}/`),
    })),
  });
}
