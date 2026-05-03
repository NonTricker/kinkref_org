#!/usr/bin/env node
/**
 * generate-icons.mjs — KR Monogram raster derivative generator
 *
 * 用法: node scripts/generate-icons.mjs
 *
 * 從 public/favicon.svg 產出:
 *   - public/favicon.ico (16/32/48 multi-size)
 *   - public/apple-touch-icon.png (180×180)
 *   - public/og-image.png (1200×630)
 *
 * 銘文師席琳 V5.7 · 2026-05-03
 *
 * 依賴：sharp + to-ico（已加入 devDependencies）
 */

import sharp from 'sharp';
import toIco from 'to-ico';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// 主 SVG（含 dark mode media query — sharp render 時用 light mode default）
const SVG_PATH = join(PUBLIC_DIR, 'favicon.svg');
const svgBuffer = await readFile(SVG_PATH);

console.log('🎴 KR Monogram raster generator');
console.log(`   Source: ${SVG_PATH}`);
console.log('');

// ─────────────────────────────────────────────────────────────
// 1. favicon.ico (16/32/48 multi-size)
// ─────────────────────────────────────────────────────────────
console.log('① favicon.ico (16/32/48 multi-size)');

const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(
  icoSizes.map((size) =>
    sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()
  )
);
const icoBuffer = await toIco(icoBuffers);
await writeFile(join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
console.log(`   ✅ favicon.ico written (${icoBuffer.byteLength} bytes)`);

// ─────────────────────────────────────────────────────────────
// 2. apple-touch-icon.png (180×180 with cream background)
// ─────────────────────────────────────────────────────────────
console.log('');
console.log('② apple-touch-icon.png (180×180)');

// iOS 期待 solid background（不喜歡透明），用 #FAF7F2 paper cream
// padding: monogram 佔 75% (135px)，居中
const touchIconSize = 180;
const monogramOnTouchIcon = 135;
const touchPadding = (touchIconSize - monogramOnTouchIcon) / 2;

const touchIcon = await sharp({
  create: {
    width: touchIconSize,
    height: touchIconSize,
    channels: 3,
    background: { r: 250, g: 247, b: 242 }, // #FAF7F2
  },
})
  .composite([
    {
      input: await sharp(svgBuffer)
        .resize(monogramOnTouchIcon, monogramOnTouchIcon, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer(),
      top: Math.round(touchPadding),
      left: Math.round(touchPadding),
    },
  ])
  .png()
  .toBuffer();

await writeFile(join(PUBLIC_DIR, 'apple-touch-icon.png'), touchIcon);
console.log(`   ✅ apple-touch-icon.png written (${touchIcon.byteLength} bytes)`);

// ─────────────────────────────────────────────────────────────
// 3. og-image.png (1200×630 social card)
// ─────────────────────────────────────────────────────────────
console.log('');
console.log('③ og-image.png (1200×630)');

const ogWidth = 1200;
const ogHeight = 630;
const monogramOnOg = 280;

// OG image SVG 範本（純背景 + 文字 + hairline 框）
const ogTextLayoutSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ogWidth} ${ogHeight}" width="${ogWidth}" height="${ogHeight}">
  <!-- 紙白背景 -->
  <rect width="${ogWidth}" height="${ogHeight}" fill="#FAF7F2"/>
  <!-- Hairline 內框（書院書扉頁感） -->
  <rect x="40" y="40" width="${ogWidth - 80}" height="${ogHeight - 80}" fill="none" stroke="#D8CFC2" stroke-width="1"/>
  <!-- 主標題 -->
  <text x="${ogWidth / 2}" y="490"
        font-family="'IBM Plex Serif', 'Noto Serif TC', serif"
        font-size="56" font-weight="600"
        text-anchor="middle" fill="#1C1A17"
        letter-spacing="-0.5">Kink Reference</text>
  <!-- 中文副標 -->
  <text x="${ogWidth / 2}" y="540"
        font-family="'Noto Serif TC', serif"
        font-size="22"
        text-anchor="middle" fill="#5C544A"
        letter-spacing="2">中文 BDSM 學術文獻策展</text>
  <!-- Footer 標記 -->
  <text x="${ogWidth / 2}" y="585"
        font-family="'JetBrains Mono', monospace"
        font-size="14"
        text-anchor="middle" fill="#8B8275"
        letter-spacing="2">— kinkref.org · CC BY-SA 4.0 —</text>
</svg>`;

// Render text layout to PNG
const ogTextLayer = await sharp(Buffer.from(ogTextLayoutSvg))
  .png()
  .toBuffer();

// Render monogram (center-top)
const ogMonogramLayer = await sharp(svgBuffer)
  .resize(monogramOnOg, monogramOnOg, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

// Composite: text layout + monogram on top
const monogramLeft = Math.round((ogWidth - monogramOnOg) / 2);
const monogramTop = 100;

const ogImage = await sharp(ogTextLayer)
  .composite([
    {
      input: ogMonogramLayer,
      top: monogramTop,
      left: monogramLeft,
    },
  ])
  .png()
  .toBuffer();

await writeFile(join(PUBLIC_DIR, 'og-image.png'), ogImage);
console.log(`   ✅ og-image.png written (${ogImage.byteLength} bytes)`);

// ─────────────────────────────────────────────────────────────
// Done
// ─────────────────────────────────────────────────────────────
console.log('');
console.log('🎴 All raster derivatives generated successfully.');
console.log('   Files:');
console.log('     - public/favicon.ico');
console.log('     - public/apple-touch-icon.png');
console.log('     - public/og-image.png');
