/**
 * Looks up a song and fetches its album cover, so that adding one to an update
 * is a search rather than a hunt through a browser for an image to save.
 *
 *   npm run song "goodness of god bethel"
 *
 * It searches Apple's public catalogue, asks which of the matches you meant,
 * saves that album's cover into src/content/songs/, and prints the block of
 * lines to paste into the top of your update.
 *
 * The cover is filed under the album's name rather than the song's, because the
 * cover belongs to the album: three songs off the same record share one image
 * instead of leaving three identical copies of it in the folder. Run the script
 * for a song whose album is already there and it simply points you at the cover
 * you already have.
 *
 * The catalogue is the same one the Music app searches and needs no account or
 * key of any kind. Spotify's does need an account, so the Spotify link is the
 * one line the script leaves for you to paste in — open the song in Spotify,
 * hit the `...` menu, and choose Share -> Copy Song Link.
 */

import { createInterface } from 'node:readline/promises';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ART_DIR = join(ROOT, 'src/content/songs');

/** How many search results to offer before it stops being a short list. */
const RESULT_COUNT = 8;

/**
 * Covers are square and shown small, but they are saved large: Astro resizes
 * every photo on the site on the way out, and it can only ever shrink one.
 */
const ART_SIZE = 1000;

const query = process.argv.slice(2).join(' ').trim();

if (!query) {
  console.error('Usage: npm run song "song name and artist"');
  process.exit(1);
}

const results = await search(query);

if (results.length === 0) {
  console.error(`\nNothing found for "${query}".`);
  console.error('Try the artist name as well, or fewer words.\n');
  process.exit(1);
}

console.log(`\nMatches for "${query}":\n`);
results.forEach((song, index) => {
  const year = song.releaseDate?.slice(0, 4) ?? '';
  console.log(`  ${index + 1}. ${song.trackName} — ${song.artistName}`);
  console.log(`     ${song.collectionName}${year && ` (${year})`}`);
});

const choice = await ask(results.length);
const song = results[choice];

await mkdir(ART_DIR, { recursive: true });
const { name, reused } = await saveArt(song, await downloadArt(song));

console.log(
  reused
    ? `\nYou already have that album's cover, so nothing was downloaded: ${relative(ROOT, join(ART_DIR, `${name}.jpg`))}\n`
    : `\nSaved the cover to ${relative(ROOT, join(ART_DIR, `${name}.jpg`))}\n`,
);
console.log('Paste this into the top of your update:\n');
console.log(block(song, name));

/** Asks Apple's catalogue for songs matching what was typed. */
async function search(term) {
  const url = new URL('https://itunes.apple.com/search');
  url.searchParams.set('term', term);
  url.searchParams.set('entity', 'song');
  url.searchParams.set('limit', String(RESULT_COUNT));

  const response = await fetch(url);

  if (!response.ok) {
    console.error(`\nThe search failed (${response.status}). Try again in a moment.\n`);
    process.exit(1);
  }

  return (await response.json()).results ?? [];
}

/**
 * The catalogue hands back a URL for a 100px thumbnail. The size is just a
 * piece of the filename, so asking for a bigger one is a swap rather than a
 * different request.
 */
async function downloadArt(song) {
  const url = song.artworkUrl100.replace(
    /\/\d+x\d+bb\.jpg$/,
    `/${ART_SIZE}x${ART_SIZE}bb.jpg`,
  );

  const response = await fetch(url);

  if (!response.ok) {
    console.error(`\nCould not download the cover (${response.status}).\n`);
    process.exit(1);
  }

  return Buffer.from(await response.arrayBuffer());
}

/**
 * Files the cover under the album's name, unless something is already sitting
 * there. Two records can share a name — every band has a "Live" album in them
 * somewhere — so a name already taken is only the same cover if the image
 * behind it is the same image, byte for byte. When it is, the existing file is
 * left alone and reused. When it is not, the artist's name is added to tell the
 * two apart, and a number after that in the vanishingly unlikely event that one
 * artist has two different covers under the same album name.
 */
async function saveArt(song, art) {
  for (const name of candidateNames(song)) {
    const existing = await readFile(join(ART_DIR, `${name}.jpg`)).catch(() => null);

    if (!existing) {
      await writeFile(join(ART_DIR, `${name}.jpg`), art);
      return { name, reused: false };
    }

    if (existing.equals(art)) return { name, reused: true };
  }
}

/** The filenames to try, in order, for one song's cover. */
function* candidateNames(song) {
  // Some corners of the catalogue — the odd single — come back without an
  // album, and the song's own name is the best there is to fall back on.
  const album = slugify(song.collectionName ?? song.trackName);
  const artist = slugify(song.artistName);

  yield album;
  yield `${album}-${artist}`;
  for (let n = 2; ; n++) yield `${album}-${artist}-${n}`;
}

async function ask(count) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (true) {
      const answer = (await rl.question(`\nWhich one? [1-${count}, or q to quit] `)).trim();

      if (answer.toLowerCase() === 'q') process.exit(0);

      const index = Number(answer) - 1;
      if (Number.isInteger(index) && index >= 0 && index < count) return index;

      console.log('Please enter one of the numbers above.');
    }
  } finally {
    rl.close();
  }
}

/** The lines to paste into an update's frontmatter. */
function block(song, name) {
  return [
    'songs:',
    `  - title: ${quote(song.trackName)}`,
    `    artist: ${quote(song.artistName)}`,
    `    art: '../songs/${name}.jpg'`,
    // Left commented rather than left empty: an empty link is not a link, and
    // the build would stop on it. Pasted as it stands, this already works.
    `    # spotify: 'paste the Spotify link here, then delete the #'`,
    `    appleMusic: '${appleMusicUrl(song)}'`,
    '',
  ].join('\n');
}

/**
 * The catalogue's link carries a tracking parameter on the end, which is no
 * business of anyone reading the letter.
 */
function appleMusicUrl(song) {
  const url = new URL(song.trackViewUrl);
  url.searchParams.delete('uo');
  return url.toString();
}

/**
 * Titles are wrapped in single quotes, except the ones with an apostrophe in
 * them — "He Won't" — which take double quotes instead, the same rule the
 * template gives for photo captions.
 */
function quote(value) {
  return value.includes("'") ? `"${value}"` : `'${value}'`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
