#!/usr/bin/env node
/**
 * build-sitemap-lastmod.mjs
 *
 * Post-build script: 給 dist/sitemap-0.xml 注入精準 <lastmod>。
 *
 * 為什麼需要？
 *   @astrojs/sitemap 預設不輸出 lastmod；統一用 build time 會被 Google
 *   視為「全站同時更新」反而失真。本 script 對每個 URL 解析對應的 source
 *   檔案（content/*.md 或 src/pages/*.astro），用 git log 取最後 commit
 *   時間注入，給 Google 真實的內容新鮮度信號。
 *
 * 用法：build 流程結尾自動執行
 *   astro check && astro build && build:search && THIS_SCRIPT
 *
 * 規則：
 *   - 找不到對應 source file 時 → 用 build time fallback
 *   - 找不到 git history（新檔案）→ 用 build time fallback
 *   - 對 windows 路徑做正規化
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITEMAP_PATH = join(process.cwd(), 'dist', 'sitemap-0.xml');
const NOW_ISO = new Date().toISOString();

/**
 * 從 URL pathname 推導對應的 source file 路徑（相對 repo root）
 *
 * @param {string} pathname  例: /glossary/aftercare
 * @returns {string|null}    例: content/glossary/aftercare.md
 */
function urlToSourcePath(pathname) {
  const p = pathname.replace(/\/$/, '') || '/';

  // 首頁 / collection index / 靜態頁
  if (p === '/') return 'src/pages/index.astro';
  if (p === '/about') return 'src/pages/about.astro';
  if (p === '/contribute') return 'src/pages/contribute.astro';
  if (p === '/qa') return 'src/pages/qa.astro';
  if (p === '/dashboard') return 'src/pages/dashboard.astro';
  if (p === '/resources') return 'src/pages/resources.astro';
  if (p === '/glossary') return 'src/pages/glossary/index.astro';
  if (p === '/bibliography') return 'src/pages/bibliography/index.astro';
  if (p === '/books') return 'src/pages/books/index.astro';
  if (p === '/journals') return 'src/pages/journals/index.astro';
  if (p === '/guides') return 'src/pages/guides/index.astro';

  // Content collection entries
  const collectionMatch = p.match(/^\/(glossary|bibliography|books|journals|guides|translations)\/(.+)$/);
  if (collectionMatch) {
    const [, collection, slug] = collectionMatch;
    return `content/${collection}/${slug}.md`;
  }

  // Counselor detail
  const counselorMatch = p.match(/^\/resources\/counselors\/(.+)$/);
  if (counselorMatch) {
    return `content/counselors/${counselorMatch[1]}.md`;
  }

  return null;
}

/**
 * 取得檔案在 git history 中最後 commit 的 ISO 時間
 *
 * @param {string} relPath  repo-relative 路徑
 * @returns {string|null}   ISO 8601 字串 or null（檔案不存在 / 未追蹤）
 */
function gitLastModified(relPath) {
  if (!existsSync(join(process.cwd(), relPath))) return null;
  try {
    const out = execSync(`git log -1 --format=%cI -- "${relPath}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

if (!existsSync(SITEMAP_PATH)) {
  console.error(`❌ sitemap not found: ${SITEMAP_PATH}`);
  process.exit(1);
}

const original = readFileSync(SITEMAP_PATH, 'utf8');

// 解析所有 <url>...</url> block
let urlCount = 0;
let injectedCount = 0;
let fallbackCount = 0;

const updated = original.replace(
  /<url>(.*?)<\/url>/gs,
  (_, urlBlock) => {
    urlCount++;
    const locMatch = urlBlock.match(/<loc>(.+?)<\/loc>/);
    if (!locMatch) return `<url>${urlBlock}</url>`;

    let pathname;
    try {
      pathname = new URL(locMatch[1]).pathname;
    } catch {
      return `<url>${urlBlock}</url>`;
    }

    const sourcePath = urlToSourcePath(pathname);
    const lastmod = sourcePath ? gitLastModified(sourcePath) : null;

    if (lastmod) {
      injectedCount++;
    } else {
      fallbackCount++;
    }

    const finalLastmod = lastmod ?? NOW_ISO;

    // 如果原本已有 lastmod 就替換，否則插入到 <loc> 後
    if (urlBlock.includes('<lastmod>')) {
      const replaced = urlBlock.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${finalLastmod}</lastmod>`);
      return `<url>${replaced}</url>`;
    }
    const withLastmod = urlBlock.replace(
      /<\/loc>/,
      `</loc><lastmod>${finalLastmod}</lastmod>`
    );
    return `<url>${withLastmod}</url>`;
  }
);

writeFileSync(SITEMAP_PATH, updated, 'utf8');

console.log(`🗺️  Sitemap lastmod injection complete:`);
console.log(`    ${urlCount} URLs processed`);
console.log(`    ${injectedCount} got precise git timestamp`);
console.log(`    ${fallbackCount} fell back to build time (${NOW_ISO.slice(0, 10)})`);
console.log(`    → ${SITEMAP_PATH}`);
