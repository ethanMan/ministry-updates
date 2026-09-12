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
  url: 'https://ethanman.github.io',

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
   * A link to your giving/support page. Shown as the accented button in the
   * top right of the header and again at the bottom of the home page.
   * Leave empty to hide both.
   */
  givingUrl: 'https://app.aplos.com/aws/give/SoonMovementGlobal/EthanMan',
  givingLabel: 'Partner with us',
  /** Shorter wording for the header button, where space is tight. */
  givingLabelShort: 'Give',

  /**
   * The full-width photo at the top of the home page, which the headline and
   * buttons sit on top of.
   *
   * To use your own, replace src/assets/home-banner.jpg with your photo
   * (keep the filename, or use .png/.webp — either is picked up automatically)
   * and update the description below. Delete the file and the home page falls
   * back to plain text. A wide landscape photo works best, and one with some
   * open space along the bottom leaves room for the words.
   */
  bannerAlt: 'Our team on the steps of the community center',
} as const;

/** Top navigation links. */
export const nav = [
  { href: '/', label: 'Home' },
  { href: '/newsletters', label: 'Newsletters' },
  { href: '/about', label: 'About' },
] as const;
