/**
 * build-search-index.mjs
 *
 * Build a MiniSearch-friendly JSON index from the three content collections.
 * Output: public/search-index.json
 *
 * Run after `astro build`. Wired into the `npm run build` script.
 *
 * The index is intentionally minimal: just enough fields for client-side
 * fuzzy matching. Full record metadata stays on the entry detail pages.
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');
const OUT_PATH = join(ROOT, 'public', 'search-index.json');

const collections = [
  { name: 'glossary', path: join(CONTENT_DIR, 'glossary'), route: 'glossary' },
  { name: 'bibliography', path: join(CONTENT_DIR, 'bibliography'), route: 'bibliography' },
  { name: 'books', path: join(CONTENT_DIR, 'books'), route: 'books' },
];

/** @typedef {{
 *   id: string,
 *   collection: string,
 *   url: string,
 *   title: string,
 *   subtitle: string,
 *   tagline: string,
 *   tags: string[],
 *   year?: number,
 * }} IndexEntry */

/** @returns {Promise<IndexEntry[]>} */
async function readCollection({ name, path: dir, route }) {
  /** @type {IndexEntry[]} */
  const out = [];
  let files = [];
  try {
    files = await readdir(dir);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    return out;
  }

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(join(dir, file), 'utf8');
    const { data } = matter(raw);

    /** @type {IndexEntry} */
    const entry = {
      id: `${name}:${slug}`,
      collection: name,
      url: `/${route}/${slug}`,
      title: '',
      subtitle: '',
      tagline: '',
      tags: [
        ...(Array.isArray(data.topic_tags) ? data.topic_tags : []),
        ...(Array.isArray(data.reader_tags) ? data.reader_tags : []),
      ],
    };

    if (name === 'glossary') {
      entry.title = data.term_en ?? slug;
      entry.subtitle = data.term_zh ?? '';
      entry.tagline = data.tagline ?? '';
    } else if (name === 'bibliography') {
      entry.title = data.title ?? slug;
      entry.subtitle = `${data.authors ?? ''} (${data.year ?? '?'})`;
      entry.tagline = data.curator_note ?? '';
      entry.year = typeof data.year === 'number' ? data.year : undefined;
    } else if (name === 'books') {
      entry.title = data.title ?? slug;
      entry.subtitle = `${data.author ?? ''} (${data.year ?? '?'})`;
      entry.tagline = data.curator_note ?? '';
      entry.year = typeof data.year === 'number' ? data.year : undefined;
    }

    out.push(entry);
  }

  return out;
}

async function main() {
  console.log('🔍 Building search index…');
  const entries = (await Promise.all(collections.map(readCollection))).flat();

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(
    OUT_PATH,
    JSON.stringify(
      {
        version: 1,
        generatedAt: new Date().toISOString(),
        count: entries.length,
        entries,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`✅ Wrote ${entries.length} entries → ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('❌ Failed to build search index:', err);
  process.exit(1);
});
