import { getCollection } from 'astro:content';

/** Where a photo listed with a bare filename is looked for. */
const PHOTOS_DIR = '/src/content/photos';

/**
 * Every image anywhere in src/, keyed by its path.
 *
 * Vite reads this at build time, which is what gives us each photo's real
 * pixel width and height before any HTML is written — and that is the whole
 * trick behind the collage on /photos. Knowing the shape of every photo up
 * front means the rows can be worked out during the build, so the browser
 * receives a finished layout instead of having to measure and shuffle images
 * after they load.
 *
 * This deliberately reaches past the photos folder so a photo already in the
 * site — the cover of an update, say — can be shown in the gallery too,
 * without keeping a second copy of it. Only the handful actually listed in
 * photos.yaml are ever read; this is a table of what is available.
 *
 * The patterns have to be written out in full, including the shouty extensions
 * phones produce (IMG_1234.JPG), because Vite matches them literally.
 */
const files = import.meta.glob<ImageMetadata>(
  [
    '/src/content/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
    '/src/assets/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  ],
  { eager: true, import: 'default' },
);

/** A photo with its caption, ready to place. */
export interface Photo {
  /** The filename, e.g. "2026-09-retreat.jpg". */
  id: string;
  image: ImageMetadata;
  date: Date;
  caption: string;
  alt: string;
  /** Width divided by height. 1.5 for a typical landscape, 0.667 for a tall one. */
  ratio: number;
}

/** One row of the collage: photos that together span the full width. */
export interface PhotoRow {
  photos: Photo[];
  /** The ratios of the photos in the row, added up. */
  ratioSum: number;
  /**
   * The number the row's height is divided by. Normally `ratioSum`, so the row
   * fills the width exactly. The final row is usually short, and gets padded up
   * to the target so its photos keep the height of the rows above them rather
   * than being blown up to reach the right-hand edge.
   *
   * `ratioSum / divisor` is therefore how much of the width the row covers.
   */
  divisor: number;
}

/**
 * Turns what is written in photos.yaml into a full path.
 *
 *   'retreat.jpg'              -> /src/content/photos/retreat.jpg
 *   '2026/retreat.jpg'         -> /src/content/photos/2026/retreat.jpg
 *   '../updates/cover.jpg'     -> /src/content/updates/cover.jpg
 *   '~/assets/portrait.jpg'    -> /src/assets/portrait.jpg
 *
 * A plain name is the common case; the rest are for showing a photo that is
 * already somewhere else in the site. `~/` means the src folder, the same as it
 * does in the import lines at the top of these files.
 */
function resolvePath(id: string): string {
  const start = id.startsWith('~/')
    ? `/src/${id.slice(2)}`
    : `${PHOTOS_DIR}/${id}`;

  // Work out what the '..' segments mean, so the path can be looked up.
  const parts: string[] = [];
  for (const part of start.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }

  return `/${parts.join('/')}`;
}

/** How a path reads back in photos.yaml, for error messages. */
function describePath(path: string): string {
  return path.startsWith(`${PHOTOS_DIR}/`)
    ? path.slice(PHOTOS_DIR.length + 1)
    : `~${path.slice('/src'.length)}`;
}

/** Looks up the image file a caption block refers to. */
function findImage(id: string): ImageMetadata {
  const path = resolvePath(id);
  const match = files[path];
  if (match) return match;

  const available = Object.keys(files).map(describePath).sort();

  throw new Error(
    `src/content/photos/photos.yaml lists a photo called "${id}", but there is ` +
      `no image at ${path.slice(1)}.\n\n` +
      `Check the spelling, including the extension — ".jpg" and ".JPG" are ` +
      `different names as far as the build is concerned.\n\n` +
      (available.length
        ? `Photos you can list, written the way photos.yaml wants them:\n  ` +
          available.join('\n  ')
        : `There are no images in src/ yet.`),
  );
}

/**
 * Every photo, newest first.
 *
 * Photos sitting in the folder without a block in photos.yaml are left out,
 * with a warning during the build — a photo with no date has nowhere to go in
 * a list that runs newest to oldest.
 */
export async function getPhotos(): Promise<Photo[]> {
  const entries = await getCollection('photos');

  const listed = new Set(entries.map((entry) => resolvePath(entry.id)));
  for (const path of Object.keys(files)) {
    // Only the photos folder is expected to be exhaustively listed. Images
    // elsewhere in src/ belong to updates and to the rest of the site, so they
    // are not missing from the gallery — they are simply not in it.
    if (!path.startsWith(`${PHOTOS_DIR}/`)) continue;

    // A leading underscore means "kept here on purpose, but not for the
    // gallery" — the same convention that keeps _TEMPLATE.md off the site. It
    // lets a photo used only by an update live in this folder with the rest of
    // them, without being nagged about on every build.
    if (path.split('/').pop()!.startsWith('_')) continue;

    if (!listed.has(path)) {
      console.warn(
        `[photos] ${path.slice(1)} is not listed in photos.yaml, ` +
          `so it is being left off the gallery page.`,
      );
    }
  }

  return entries
    .map((entry) => {
      const image = findImage(entry.id);
      return {
        id: entry.id,
        image,
        date: entry.data.date,
        caption: entry.data.caption,
        alt: entry.data.alt || entry.data.caption,
        ratio: image.width / image.height,
      };
    })
    .sort(
      (a, b) =>
        b.date.getTime() - a.date.getTime() || a.id.localeCompare(b.id),
    );
}

/**
 * Packs photos into rows that each fill the page width exactly, in the order
 * given — so the collage still reads newest to oldest, left to right.
 *
 * Every photo in a row is drawn at the same height, and a row's height is the
 * width available divided by the sum of the photos' ratios. So a row is "full"
 * once those ratios add up to `target`: at 1080px wide, a target of 4.5 lands
 * rows around 240px tall. A wide panorama fills a row on its own; four tall
 * portraits fit side by side.
 *
 * Photos are never cropped — each one is drawn at its own shape, and the row
 * comes out flush because the heights, not the widths, are what match.
 */
export function packIntoRows(photos: Photo[], target = 4.5): PhotoRow[] {
  const rows: PhotoRow[] = [];
  let current: Photo[] = [];
  let sum = 0;

  for (const photo of photos) {
    // Adding this photo may overshoot the target so far that the row ends up
    // noticeably shorter than its neighbours. When stopping one photo earlier
    // lands closer to the target, do that instead.
    if (current.length > 0 && sum + photo.ratio > target) {
      const overshoot = sum + photo.ratio - target;
      const undershoot = target - sum;
      if (overshoot > undershoot) {
        rows.push({ photos: current, ratioSum: sum, divisor: sum });
        current = [];
        sum = 0;
      }
    }

    current.push(photo);
    sum += photo.ratio;

    if (sum >= target) {
      rows.push({ photos: current, ratioSum: sum, divisor: sum });
      current = [];
      sum = 0;
    }
  }

  // Whatever is left over cannot fill a row. Pad the divisor up to the target
  // so these last photos keep the height of the rows above them; the row simply
  // stops short of the right-hand edge instead of stretching to reach it.
  if (current.length > 0) {
    rows.push({ photos: current, ratioSum: sum, divisor: Math.max(sum, target) });
  }

  return rows;
}
