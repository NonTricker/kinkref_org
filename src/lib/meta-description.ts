/**
 * meta-description.ts — collection 級 meta description 模板
 *
 * v0.7.2（脈流師 SEO 工單 #2）：
 *   針對 glossary / bibliography / books / journals 四個 collection
 *   產生對齊的 meta description，提升 long-tail query 與 brand mention 一致性。
 *
 * 設計原則：
 *   - 每個 collection 採固定模板（讓 Google 看到 entity 結構）
 *   - abstract / curator note 切片時清掉換行 / markdown 標記 / 多餘空白
 *   - 結尾用「｜kinkref.org」做 brand mention（Google E-E-A-T 加分）
 *   - 控制長度在 ~155 chars 以下（Google SERP 切斷上限）
 */

import { stripInlineMarkdown } from './inline-markdown';

/**
 * 把 multi-paragraph 文字壓成單行（清 newline / markdown / 多空白），
 * 用於 meta description slice。
 */
export function flattenForMeta(text: string | null | undefined): string {
  if (!text) return '';
  // 先 strip inline markdown（**bold** / *italic* / `code` / [link]）
  // 再壓縮 whitespace
  return stripInlineMarkdown(text).replace(/\s+/g, ' ').trim();
}

/** 取 N 字 slice，配合 ellipsis（用於 abstract 預覽） */
export function metaSlice(text: string | null | undefined, n: number): string {
  const flat = flattenForMeta(text);
  if (flat.length <= n) return flat;
  return flat.slice(0, n);
}

/** Glossary entry meta description */
export function glossaryDescription(opts: {
  termZh: string;
  termEn: string;
  tagline: string;
}): string {
  return `${opts.termZh}（${opts.termEn}）的定義與辨析。${flattenForMeta(opts.tagline)}｜kinkref.org 學術策展`;
}

/**
 * v0.7.3：study_type 英文 enum → 中文 mapping（脈流師 non-blocking 建議）
 * 對齊 src/content.config.ts bibliography schema 的 study_type z.enum
 * 找不到的 fallback 顯示原值（schema 未來擴充時不崩）。
 */
const STUDY_TYPE_ZH: Record<string, string> = {
  quantitative: '量化研究',
  qualitative: '質性研究',
  'mixed-methods': '混合方法',
  theoretical: '理論分析',
  review: '文獻回顧',
  'systematic-review': '系統性回顧',
  'meta-analysis': '後設分析',
  'case-study': '個案研究',
  ethnography: '民族誌',
  commentary: '評論',
};

function studyTypeLabel(type: string): string {
  return STUDY_TYPE_ZH[type] ?? type;
}

/** Bibliography entry meta description */
export function bibliographyDescription(opts: {
  title: string;
  authors: string;
  year: number;
  studyType: string;
  abstractZh: string;
}): string {
  return `${opts.title} — ${opts.authors}（${opts.year}）${studyTypeLabel(opts.studyType)} 中文摘要。${metaSlice(opts.abstractZh, 40)}…｜kinkref.org`;
}

/** Book entry meta description */
export function booksDescription(opts: {
  title: string;
  author: string;
  year: number;
  difficulty: string;
  abstractZh: string;
}): string {
  return `《${opts.title}》${opts.author}（${opts.year}）— ${opts.difficulty} 級｜${metaSlice(opts.abstractZh, 35)}…｜kinkref.org`;
}

/** Journal entry meta description */
export function journalsDescription(opts: {
  title: string;
  abbreviation: string | null | undefined;
  impactFactor: string | number | null | undefined;
  accessType: string;
}): string {
  const abbrev = opts.abbreviation ? `（${opts.abbreviation}）` : '';
  const ifPart = opts.impactFactor ? `IF ${opts.impactFactor}・` : '';
  return `${opts.title}${abbrev}投稿地圖：${ifPart}${opts.accessType}｜kinkref.org`;
}
