#!/usr/bin/env node
/**
 * fetch-cloudflare-stats.mjs — Build-time fetch Cloudflare Web Analytics
 *
 * 在 npm run build 前跑，fetch RUM 數據 → 寫 public/api/stats.json
 * Dashboard + 首頁讀這個 JSON 顯示即時統計。
 *
 * Schema：
 *   {
 *     generated,
 *     // 近 7 天（Dashboard 顯示「近 7 天」面板用）
 *     period, totalPageviews, topGlossary, topContent, topOther, countries,
 *     // 自啟站累計（首頁「讀者來自」累計數字用）
 *     lifetime: { period, totalPageviews, countries }
 *   }
 *
 * 環境變數（.env 或 Cloudflare Pages env）：
 *   CF_API_TOKEN  — Cloudflare API token (Account Analytics Read)
 *   CF_ACCOUNT_ID — Cloudflare Account ID
 *
 * 用法：node scripts/fetch-cloudflare-stats.mjs
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env if exists (local dev)
try {
  const { config } = await import('dotenv');
  config();
} catch {
  // dotenv not installed in prod — env vars come from Cloudflare Pages settings
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'public', 'api', 'stats.json');

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;

if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
  // ⛔ Iron Law：不覆寫現有 stats.json，避免 break 既有顯示。
  //   CF Pages 上若 secrets 缺失，dashboard / 首頁仍會用 repo 內 commit 進去的舊版本。
  console.warn('⚠️  CF_API_TOKEN or CF_ACCOUNT_ID not set — preserving existing stats.json');
  process.exit(0);
}

// ── 兩個時間窗口 ──
const now = new Date();
const end = now.toISOString();

// 近 7 天（Dashboard 看趨勢）
const last7Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

// 自啟站累計（2026-05-03 15:30 UTC+8 = 2026-05-03 07:30 UTC）
const LAUNCH_DATE_UTC = '2026-05-03T07:30:00Z';
const lifetimeStart = new Date(LAUNCH_DATE_UTC).toISOString();

const GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql';

/**
 * 拉一個時間窗口的 RUM 數據。
 * @param {string} startISO
 * @param {string} endISO
 * @param {{ withTopPaths: boolean }} opts — lifetime 只需要 countries + total，不需要 topPaths
 */
async function fetchWindow(startISO, endISO, { withTopPaths }) {
  const pathsBlock = withTopPaths
    ? `
        topPaths: rumPageloadEventsAdaptiveGroups(
          filter: { datetime_geq: "${startISO}", datetime_leq: "${endISO}" }
          limit: 40
          orderBy: [count_DESC]
        ) {
          count
          dimensions { requestPath }
        }`
    : '';

  const query = `{
    viewer {
      accounts(filter: { accountTag: "${CF_ACCOUNT_ID}" }) {${pathsBlock}
        topCountries: rumPageloadEventsAdaptiveGroups(
          filter: { datetime_geq: "${startISO}", datetime_leq: "${endISO}" }
          limit: 10
          orderBy: [count_DESC]
        ) {
          count
          dimensions { countryName }
        }
        totalViews: rumPageloadEventsAdaptiveGroups(
          filter: { datetime_geq: "${startISO}", datetime_leq: "${endISO}" }
          limit: 1
        ) {
          count
        }
      }
    }
  }`;

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(`CF API errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data.viewer.accounts[0];
}

console.log('📊 Fetching Cloudflare Web Analytics (2 windows)...');
console.log(`   Last 7d:  ${last7Start.slice(0, 10)} → ${end.slice(0, 10)}`);
console.log(`   Lifetime: ${lifetimeStart.slice(0, 10)} → ${end.slice(0, 10)}`);

try {
  // 並行拉兩個窗口
  const [last7, lifetime] = await Promise.all([
    fetchWindow(last7Start, end, { withTopPaths: true }),
    fetchWindow(lifetimeStart, end, { withTopPaths: false }),
  ]);

  // ── 解析 last 7 days ──
  const allPaths = last7.topPaths.map((p) => ({
    path: p.dimensions.requestPath,
    views: p.count,
  }));
  const glossaryPaths = allPaths
    .filter((p) => p.path.startsWith('/glossary/') && p.path !== '/glossary/')
    .slice(0, 5);
  const otherPaths = allPaths
    .filter((p) => !p.path.startsWith('/glossary/') || p.path === '/glossary/')
    .slice(0, 5);
  const contentCollections = ['/bibliography/', '/books/', '/journals/'];
  const contentPaths = allPaths
    .filter((p) =>
      contentCollections.some((c) => p.path.startsWith(c) && p.path !== c)
    )
    .slice(0, 5);
  const last7Countries = last7.topCountries.map((c) => ({
    code: c.dimensions.countryName,
    views: c.count,
  }));
  const last7TotalViews = last7.totalViews.reduce((sum, g) => sum + g.count, 0);

  // ── 解析 lifetime ──
  const lifetimeCountries = lifetime.topCountries.map((c) => ({
    code: c.dimensions.countryName,
    views: c.count,
  }));
  const lifetimeTotalViews = lifetime.totalViews.reduce((sum, g) => sum + g.count, 0);

  const stats = {
    generated: now.toISOString(),
    // ── 近 7 天（Dashboard 用 top-level fields）──
    period: { start: last7Start.slice(0, 10), end: end.slice(0, 10) },
    totalPageviews: last7TotalViews,
    topGlossary: glossaryPaths,
    topContent: contentPaths,
    topOther: otherPaths,
    countries: last7Countries,
    // ── 自啟站累計（首頁讀 lifetime.*）──
    lifetime: {
      period: { start: lifetimeStart.slice(0, 10), end: end.slice(0, 10) },
      totalPageviews: lifetimeTotalViews,
      countries: lifetimeCountries,
    },
  };

  // Ensure /public/api/ exists
  const { mkdirSync } = await import('node:fs');
  mkdirSync(join(__dirname, '..', 'public', 'api'), { recursive: true });

  writeFileSync(OUTPUT_PATH, JSON.stringify(stats, null, 2), 'utf-8');
  console.log(`✅ Wrote ${OUTPUT_PATH}`);
  console.log(`   Last 7d total:  ${last7TotalViews.toLocaleString()}`);
  console.log(`   Lifetime total: ${lifetimeTotalViews.toLocaleString()}`);
  console.log(`   Top country (lifetime): ${lifetimeCountries[0]?.code} (${lifetimeCountries[0]?.views?.toLocaleString()})`);
  console.log(`   Top glossary (7d):      ${glossaryPaths[0]?.path} (${glossaryPaths[0]?.views})`);
} catch (err) {
  // 同上：fetch 失敗 → graceful degrade，保留現有 stats.json。
  console.warn(`⚠️  Fetch failed: ${err.message} — preserving existing stats.json`);
  process.exit(0);
}
