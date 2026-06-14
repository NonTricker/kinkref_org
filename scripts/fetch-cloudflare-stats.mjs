#!/usr/bin/env node
/**
 * fetch-cloudflare-stats.mjs — Build-time fetch Cloudflare Web Analytics
 *
 * 在 npm run build 前跑，fetch RUM 數據 → 寫 public/api/stats.json
 * Dashboard + 首頁讀這個 JSON 顯示即時統計。
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

// 7-day range
const now = new Date();
const end = now.toISOString();
const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

const GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql';

const query = `{
  viewer {
    accounts(filter: { accountTag: "${CF_ACCOUNT_ID}" }) {
      topPaths: rumPageloadEventsAdaptiveGroups(
        filter: { datetime_geq: "${start}", datetime_leq: "${end}" }
        limit: 40
        orderBy: [count_DESC]
      ) {
        count
        dimensions { requestPath }
      }
      topCountries: rumPageloadEventsAdaptiveGroups(
        filter: { datetime_geq: "${start}", datetime_leq: "${end}" }
        limit: 10
        orderBy: [count_DESC]
      ) {
        count
        dimensions { countryName }
      }
      totalViews: rumPageloadEventsAdaptiveGroups(
        filter: { datetime_geq: "${start}", datetime_leq: "${end}" }
        limit: 1
      ) {
        count
      }
    }
  }
}`;

console.log('📊 Fetching Cloudflare Web Analytics...');
console.log(`   Range: ${start.slice(0, 10)} → ${end.slice(0, 10)}`);

try {
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
    // ⛔ Build pipeline 等級的優先順序：站台可部署 > stats 新鮮度。
    //   CF API 偶發 500 / token 過期不該 break 整個 deploy。
    console.warn('⚠️  Cloudflare API errors — preserving existing stats.json:', JSON.stringify(json.errors));
    process.exit(0);
  }

  const account = json.data.viewer.accounts[0];

  // Parse top paths into glossary vs other
  const allPaths = account.topPaths.map((p) => ({
    path: p.dimensions.requestPath,
    views: p.count,
  }));

  const glossaryPaths = allPaths
    .filter((p) => p.path.startsWith('/glossary/') && p.path !== '/glossary/')
    .slice(0, 5);

  const otherPaths = allPaths
    .filter((p) => !p.path.startsWith('/glossary/') || p.path === '/glossary/')
    .slice(0, 5);

  // Top content entries (bibliography + books + journals 個別條目，不含 index)
  const contentCollections = ['/bibliography/', '/books/', '/journals/'];
  const contentPaths = allPaths
    .filter((p) =>
      contentCollections.some((c) => p.path.startsWith(c) && p.path !== c)
    )
    .slice(0, 5);

  // Parse countries
  const countries = account.topCountries.map((c) => ({
    code: c.dimensions.countryName,
    views: c.count,
  }));

  const totalViews = account.totalViews.reduce((sum, g) => sum + g.count, 0);

  const stats = {
    generated: now.toISOString(),
    period: { start: start.slice(0, 10), end: end.slice(0, 10) },
    totalPageviews: totalViews,
    topGlossary: glossaryPaths,
    topContent: contentPaths,
    topOther: otherPaths,
    countries,
  };

  // Ensure /public/api/ exists
  const { mkdirSync } = await import('node:fs');
  mkdirSync(join(__dirname, '..', 'public', 'api'), { recursive: true });

  writeFileSync(OUTPUT_PATH, JSON.stringify(stats, null, 2), 'utf-8');
  console.log(`✅ Wrote ${OUTPUT_PATH}`);
  console.log(`   Total pageviews (7d): ${totalViews}`);
  console.log(`   Top country: ${countries[0]?.code} (${countries[0]?.views})`);
  console.log(`   Top glossary: ${glossaryPaths[0]?.path} (${glossaryPaths[0]?.views})`);
} catch (err) {
  // 同上：fetch 失敗 → graceful degrade，保留現有 stats.json。
  console.warn(`⚠️  Fetch failed: ${err.message} — preserving existing stats.json`);
  process.exit(0);
}
