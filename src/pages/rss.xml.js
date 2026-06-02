/**
 * /rss.xml — 站方 RSS feed
 *
 * 整合 4 個 collection 的最新更新：
 *   glossary / bibliography / books / journals + guides + translations
 *
 * 排序：按 last_reviewed（或對應日期欄位）降序，top 30 筆。
 *
 * Reader 用途：訂閱 BDSM 學術新文獻、新術語、新書、新翻譯。
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://kinkref.org';
const SITE_TITLE = 'kinkref.org · 中文 BDSM 學術策展';
const SITE_DESC = 'BDSM 學術文獻、術語、書目、期刊、助人者資源的中文策展站。';

// 把 collection 各自正規化成 RSS item 結構
async function loadEntries() {
  const [glossary, bibliography, books, journals, guides, translations] = await Promise.all([
    getCollection('glossary'),
    getCollection('bibliography'),
    getCollection('books'),
    getCollection('journals'),
    getCollection('guides'),
    getCollection('translations'),
  ]);

  const items = [];

  for (const e of glossary) {
    items.push({
      title: `[術語] ${e.data.term_zh}（${e.data.term_en}）`,
      link: `${SITE_URL}/glossary/${e.id}`,
      description: e.data.tagline ?? '',
      pubDate: e.data.last_reviewed,
      categories: e.data.topic_tags ?? [],
    });
  }
  for (const e of bibliography) {
    items.push({
      title: `[論文] ${e.data.title}`,
      link: `${SITE_URL}/bibliography/${e.id}`,
      description: e.data.curator_note ?? `${e.data.authors} (${e.data.year}) · ${e.data.journal}`,
      pubDate: e.data.last_reviewed,
      categories: e.data.topic_tags ?? [],
    });
  }
  for (const e of books) {
    items.push({
      title: `[書籍] ${e.data.title_zh ?? e.data.title}`,
      link: `${SITE_URL}/books/${e.id}`,
      description: e.data.curator_note ?? `${e.data.author} (${e.data.year})`,
      pubDate: e.data.last_reviewed,
      categories: e.data.topic_tags ?? [],
    });
  }
  for (const e of journals) {
    items.push({
      title: `[期刊] ${e.data.title}${e.data.abbreviation ? ` (${e.data.abbreviation})` : ''}`,
      link: `${SITE_URL}/journals/${e.id}`,
      description: e.data.curator_note ?? '',
      pubDate: e.data.last_reviewed,
      categories: e.data.topic_tags ?? [],
    });
  }
  for (const e of guides) {
    items.push({
      title: `[指南] ${e.data.title_zh}`,
      link: `${SITE_URL}/guides/${e.id}`,
      description: e.data.tagline ?? '',
      pubDate: e.data.last_reviewed,
      categories: [e.data.audience].filter(Boolean),
    });
  }
  for (const e of translations) {
    items.push({
      title: `[翻譯] ${e.data.title}`,
      link: `${SITE_URL}/translations/${e.id}`,
      description: `${e.data.original_title}（${e.data.authors}, ${e.data.year}）${e.data.journal} 全文中譯`,
      pubDate: e.data.translation_date,
      categories: ['全文翻譯'],
    });
  }

  return items;
}

export async function GET(context) {
  const items = await loadEntries();

  // 排序：pubDate 降序，取 top 30（reader 一次看不需要太多）
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  const recent = items.slice(0, 30);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESC,
    site: context.site ?? SITE_URL,
    items: recent,
    customData: `<language>zh-Hant-TW</language>`,
  });
}
