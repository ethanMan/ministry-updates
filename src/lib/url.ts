/**
 * Builds an internal link that still works when the site is served from a
 * subfolder, which is what GitHub Pages does for a normal repository
 * (username.github.io/ministry-updates/).
 *
 * Always use this for hand-written internal links:
 *
 *   <a href={withBase('/updates')}>Updates</a>
 *
 * Astro already handles the base path for images, CSS, and anything it bundles,
 * so this is only needed for `href` strings you write yourself.
 */
export function withBase(path = '/'): string {
  // '/' when base is not set, otherwise something like '/ministry-updates/'.
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;

  // Keep the root link as '/' rather than an empty string.
  return `${base}${suffix}` || '/';
}
