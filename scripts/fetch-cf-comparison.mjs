#!/usr/bin/env node
/**
 * fetch-cf-comparison.mjs — 一次性 launch-to-now vs recent comparison
 *
 * 拉兩個窗口：
 *   1. Launch-to-now: 2026-05-03 → today
 *   2. Last 7 days
 *
 * 不寫入 stats.json，直接 console output。
 */

import { config } from 'dotenv';
config();

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;

if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
  console.error('Missing CF_API_TOKEN or CF_ACCOUNT_ID');
  process.exit(1);
}

const GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql';

async function fetchRange(label, startISO, endISO) {
  const query = `{
    viewer {
      accounts(filter: { accountTag: "${CF_ACCOUNT_ID}" }) {
        topPaths: rumPageloadEventsAdaptiveGroups(
          filter: { datetime_geq: "${startISO}", datetime_leq: "${endISO}" }
          limit: 25
          orderBy: [count_DESC]
        ) {
          count
          dimensions { requestPath }
        }
        topCountries: rumPageloadEventsAdaptiveGroups(
          filter: { datetime_geq: "${startISO}", datetime_leq: "${endISO}" }
          limit: 15
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
    console.error(`❌ ${label} errors:`, json.errors);
    return null;
  }

  const account = json.data.viewer.accounts[0];
  return {
    label,
    period: `${startISO.slice(0, 10)} → ${endISO.slice(0, 10)}`,
    total: account.totalViews.reduce((sum, g) => sum + g.count, 0),
    paths: account.topPaths.map((p) => ({ path: p.dimensions.requestPath, views: p.count })),
    countries: account.topCountries.map((c) => ({ code: c.dimensions.countryName, views: c.count })),
  };
}

const now = new Date();
const endISO = now.toISOString();

// Launch-to-now: 2026-05-03 15:30 UTC+8 = 2026-05-03 07:30 UTC
const launchISO = new Date('2026-05-03T07:30:00Z').toISOString();

// Last 7 days
const last7ISO = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

console.log('Fetching launch-to-now + last 7 days...');

const [launchToNow, last7days] = await Promise.all([
  fetchRange('Launch-to-now', launchISO, endISO),
  fetchRange('Last 7 days', last7ISO, endISO),
]);

const output = { launchToNow, last7days, generated: now.toISOString() };

// Write to seo/
const outPath = 'P:/Project/BDSMWebsite/seo/cf_comparison_' + now.toISOString().slice(0, 10) + '.json';
const { writeFileSync } = await import('node:fs');
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`\n✅ Wrote ${outPath}`);

console.log('\n=== LAUNCH-TO-NOW ===');
console.log(`Period: ${launchToNow.period}`);
console.log(`Total pageviews: ${launchToNow.total}`);
console.log('Top 10 countries:');
launchToNow.countries.slice(0, 10).forEach((c) =>
  console.log(`  ${c.code}: ${c.views} (${((c.views / launchToNow.total) * 100).toFixed(1)}%)`),
);
console.log('Top 15 paths:');
launchToNow.paths.slice(0, 15).forEach((p) =>
  console.log(`  ${p.path}: ${p.views}`),
);

console.log('\n=== LAST 7 DAYS ===');
console.log(`Period: ${last7days.period}`);
console.log(`Total pageviews: ${last7days.total}`);
console.log('Top 10 countries:');
last7days.countries.slice(0, 10).forEach((c) =>
  console.log(`  ${c.code}: ${c.views} (${((c.views / last7days.total) * 100).toFixed(1)}%)`),
);
console.log('Top 15 paths:');
last7days.paths.slice(0, 15).forEach((p) =>
  console.log(`  ${p.path}: ${p.views}`),
);
