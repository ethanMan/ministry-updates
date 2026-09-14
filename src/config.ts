/**
 * Site-wide settings.
 *
 * This is the one file to edit with your own details. Everything else on the
 * site reads from here, so you should not need to hunt through the templates.
 */

export const site = {
  /** Shown in the header and as the browser tab title. */
  name: 'Ethan Man',

  /** The short line under your name in the header, and in the browser tab. */
  tagline: 'SOON Movement Global',

  /** The headline across the photo at the top of the home page. */
  homeHeading: 'Come with me...',

  /** Used for SEO descriptions and the RSS feed. */
  description:
    'A window into the happenings, stories, and prayers of GCTC and SOON Movement Global.',

  /**
   * The short note in your own voice at the top of the home page. Write it the
   * way you would open a letter — a few sentences is plenty.
   */
  greeting: 'Hi friends,',
  intro:
    "Thank you for being part of this season and joining me in pursuing " +
    'my vision to reach millions of college students in His name. I’m excited ' +
    'to share updates, stories, and prayer requests with you. Thank you for ' +
    'your prayers, support, and partnership!',

  /**
   * How you close a letter. Both lines appear at the foot of the home page and
   * of every update:
   *
   *   In His love,
   *   Ethan
   *
   * Leave either one empty to drop that line.
   */
  closing: 'In His love,',
  signOff: 'Ethan',

  /**
   * The small photo of you shown beside the note on the home page and on the
   * About page. Replace src/assets/portrait.jpg with your own, or delete the
   * file to leave it out.
   */
  portraitAlt: 'Ethan',

  /**
   * The domain your site lives on. Must start with https:// and have NO path
   * and no trailing slash.
   *
   *   GitHub Pages  ->  'https://YOUR-USERNAME.github.io'
   *   Cloudflare    ->  'https://ministry-updates.pages.dev'
   *   Own domain    ->  'https://yourministry.org'
   */
  url: 'https://ethanman.github.io',

  /**
   * The subfolder the site is served from. Almost always '/'.
   *
   * The one exception is GitHub Pages with a normal repository: GitHub serves
   * it at username.github.io/REPO-NAME/, so you must set this to the repository
   * name, e.g. '/ministry-updates'.
   *
   * Set it back to '/' if you name the repo YOUR-USERNAME.github.io, or once
   * you move to your own domain.
   */
  base: '/ministry-updates',

  /** Where partners can reach you. Leave any of these as an empty string to hide them. */
  contact: {
    email: 'ethan.man@smglobal.org',
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
  { href: '/updates', label: 'Updates' },
  { href: '/photos', label: 'Photos' },
  { href: '/about', label: 'About' },
] as const;
