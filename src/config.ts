/**
 * Site-wide settings.
 *
 * This is the one file to edit with your own details. Everything else on the
 * site reads from here, so you should not need to hunt through the templates.
 */

export const site = {
  /** Shown in the header and as the browser tab title. */
  name: 'Ethan Man',

  /** The short line under your name in the header. */
  tagline: 'Ministry updates for our partners',

  /** Used for SEO descriptions and the RSS feed. */
  description:
    'Newsletter updates, prayer requests, and stories from the field — written for the friends and family who partner with us.',

  /**
   * The domain your site lives on. Must start with https:// and have NO path
   * and no trailing slash.
   *
   *   GitHub Pages  ->  'https://YOUR-USERNAME.github.io'
   *   Cloudflare    ->  'https://ministry-website.pages.dev'
   *   Own domain    ->  'https://yourministry.org'
   */
  url: 'https://YOUR-USERNAME.github.io',

  /**
   * The subfolder the site is served from. Almost always '/'.
   *
   * The one exception is GitHub Pages with a normal repository: GitHub serves
   * it at username.github.io/REPO-NAME/, so you must set this to the repository
   * name, e.g. '/ministry-website'.
   *
   * Set it back to '/' if you name the repo YOUR-USERNAME.github.io, or once
   * you move to your own domain.
   */
  base: '/ministry-website',

  /** Where partners can reach you. Leave any of these as an empty string to hide them. */
  contact: {
    email: '',
    instagram: '',
    facebook: '',
  },

  /**
   * Optional: a link to your giving/support page (Venmo, PayPal, your sending
   * organization's donation page, etc). Leave empty to hide the button.
   */
  givingUrl: '',
  givingLabel: 'Partner with us',
} as const;

/** Top navigation links. */
export const nav = [
  { href: '/', label: 'Home' },
  { href: '/newsletters', label: 'Newsletters' },
  { href: '/about', label: 'About' },
] as const;
