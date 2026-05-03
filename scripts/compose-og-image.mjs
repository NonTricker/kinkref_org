#!/usr/bin/env node
/**
 * compose-og-image.mjs — 主人精簡版 OG image + 右上 KrMonogram Logo
 *
 * 用法：node scripts/compose-og-image.mjs <source-image-path>
 * 預設從 Downloads 讀執政官 2026-05-03 生成的黑底紅 ornament 版。
 *
 * 流程：
 *   1. Load 主人的圖（黑底紅 ornament + 中央 typography + 右下手銬 flourish）
 *   2. Resize 到 1200×630（保持 aspect ratio，主人圖約 1800×940 比例已正確）
 *   3. 右上角合成 KrMonogram SVG（跟右下手銬對位）
 *      - Logo 約 110×110 px
 *      - 距邊緣 right 60px / top 50px（跟手銬 flourish 距邊距對位）
 *      - 用 dark mode 變體（紅 #C25555 在黑底上更亮）
 *   4. Output 到 public/og-image.png
 *
 * 銘文師席琳 KrMonogram V5.7 + 主人精簡 OG
 * 織法者整合 · 2026-05-03 v0.5.5
 */

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

// 預設來源（執政官 Downloads）— 可命令列覆蓋
const DEFAULT_SOURCE =
  './source-images/og-source.png';
const sourcePath = process.argv[2] ?? DEFAULT_SOURCE;

console.log('🎴 OG image composer');
console.log(`   Source: ${sourcePath}`);
console.log('');

// ─────────────────────────────────────────────────────────────
// 1. Load source + verify dimensions
// ─────────────────────────────────────────────────────────────
const sourceBuffer = await readFile(sourcePath);
const sourceMeta = await sharp(sourceBuffer).metadata();
console.log(`① Source image: ${sourceMeta.width} × ${sourceMeta.height}`);

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;

// Resize to fit 1200×630 (cover mode 確保不變形 + 保持構圖)
const baseImage = await sharp(sourceBuffer)
  .resize(TARGET_WIDTH, TARGET_HEIGHT, {
    fit: 'cover',
    position: 'centre',
  })
  .png()
  .toBuffer();
console.log(`   ✅ Resized to ${TARGET_WIDTH} × ${TARGET_HEIGHT}`);

// ─────────────────────────────────────────────────────────────
// 2. Render KrMonogram for top-right corner
// ─────────────────────────────────────────────────────────────
console.log('');
console.log('② KrMonogram for top-right corner');

// 用 dark mode 紅 #C25555 給黑底版（比 #7A1D1D 在深底上更亮）
// favicon.svg 用 prefers-color-scheme，sharp 不會 honor，所以這裡手寫一個 dark variant SVG
const monogramSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" role="img">
  <g fill="#C25555">
    <rect x="6" y="198.5" width="16" height="1.5"/>
    <rect x="198" y="198.5" width="16" height="1.5"/>
    <path d="M 28 24 L 56 24 L 56 30 C 54 30, 52 32, 52 36 L 52 184 C 52 188, 54 190, 56 190 L 56 196 L 28 196 L 28 190 C 30 190, 36 188, 36 184 L 36 36 C 36 32, 30 30, 28 30 Z"/>
    <path d="M 62 24 L 90 24 L 90 30 C 88 30, 82 32, 82 36 L 82 184 C 82 188, 88 190, 90 190 L 90 196 L 62 196 L 62 190 C 64 190, 66 188, 66 184 L 66 36 C 66 32, 64 30, 62 30 Z"/>
    <path d="M 82 30 C 122 28, 156 38, 162 60 C 166 88, 128 110, 82 110 L 82 96 C 122 96, 152 80, 146 62 C 139 50, 120 44, 82 42 Z"/>
    <path d="M 52 102 C 78 130, 108 158, 132 184 L 140 188 L 134 196 C 108 168, 78 144, 52 118 Z"/>
    <path d="M 82 102 C 106 130, 142 158, 175 184 L 184 188 L 178 196 C 142 168, 106 144, 82 118 Z"/>
    <path d="M 52 100 C 88 80, 130 55, 165 30 L 178 32 L 174 40 C 138 60, 94 88, 52 118 Z"/>
    <rect x="125" y="190" width="20" height="10" rx="2"/>
    <rect x="168" y="190" width="20" height="10" rx="2"/>
    <rect x="145" y="198.5" width="23" height="1.5"/>
  </g>
</svg>`;

// Logo 大小：跟右下手銬對位 — 手銬 flourish 視覺重量約 110-120px
const LOGO_SIZE = 110;
const logoBuffer = await sharp(Buffer.from(monogramSvg))
  .resize(LOGO_SIZE, LOGO_SIZE, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();
console.log(`   ✅ Logo rendered ${LOGO_SIZE}×${LOGO_SIZE}`);

// ─────────────────────────────────────────────────────────────
// 3. Composite — 主人圖 + 右上 Logo
// ─────────────────────────────────────────────────────────────
console.log('');
console.log('③ Composite');

// 右上角位置：跟主人原圖右下手銬距邊距視覺對位
// 主人圖右下手銬大致從 (右邊距 80) (下邊距 80) 起 — 鏡像對位上方
const LOGO_RIGHT_OFFSET = 60;
const LOGO_TOP_OFFSET = 50;

const logoLeft = TARGET_WIDTH - LOGO_SIZE - LOGO_RIGHT_OFFSET;
const logoTop = LOGO_TOP_OFFSET;

const composedImage = await sharp(baseImage)
  .composite([
    {
      input: logoBuffer,
      top: logoTop,
      left: logoLeft,
    },
  ])
  .png({ quality: 90, compressionLevel: 9 })
  .toBuffer();

const outputPath = join(PUBLIC_DIR, 'og-image.png');
await writeFile(outputPath, composedImage);
console.log(`   ✅ og-image.png written (${composedImage.byteLength} bytes)`);
console.log(`   📍 Logo position: top=${logoTop}, left=${logoLeft}`);

// ─────────────────────────────────────────────────────────────
// Done
// ─────────────────────────────────────────────────────────────
console.log('');
console.log('🎴 OG image composed.');
console.log('   File: public/og-image.png');
console.log('   Recommended verify:');
console.log('     - https://www.opengraph.xyz/');
console.log('     - https://cards-dev.twitter.com/validator');
