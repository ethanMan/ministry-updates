import { getCollection, type CollectionEntry } from 'astro:content';

export type Update = CollectionEntry<'updates'>;

/**
 * Every published update, newest first.
 *
 * Drafts are hidden from the built site but still show while you are running
 * `npm run dev`, so you can preview an issue before publishing it.
 */
export async function getPublishedUpdates(): Promise<Update[]> {
  const entries = await getCollection('updates', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );

  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Formats a date as "September 11, 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Formats a date as "Sep 1, 2026", used in the compact archive list. */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Formats a date as "September 2026" — the way you would refer to an issue in
 * conversation, rather than to the day.
 */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Groups issues by calendar year for the archive page. */
export function groupByYear(entries: Update[]): [number, Update[]][] {
  const groups = new Map<number, Update[]>();

  for (const entry of entries) {
    const year = entry.data.date.getUTCFullYear();
    const bucket = groups.get(year);
    if (bucket) bucket.push(entry);
    else groups.set(year, [entry]);
  }

  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}
