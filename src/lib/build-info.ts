/**
 * build-info.ts — 編譯時版本資訊（版本號 / git short hash / 建置日期）
 *
 * 用途：Footer 顯示「v0.1.0 · #abc1234 · built 2026-05-03」這類「真學術站」
 *       建置記錄（致敬 Stanford Encyclopedia of Philosophy 等學術站作風）。
 *
 * Module top-level 執行一次，import 後 build 期間共享 cache。
 *
 * Author: 光影師 艾莉兒（V2 polish 2026-05-03）
 */

import { execSync } from 'node:child_process';
import pkg from '../../package.json';

interface BuildInfo {
  /** package.json 的 semantic version（如 "0.1.0"） */
  version: string;
  /** git short hash（如 "abc1234"），無 git 環境時為 "unknown" */
  gitHash: string;
  /** 建置日期 YYYY-MM-DD（UTC） */
  buildDate: string;
}

function readVersion(): string {
  // v0.5.10：直接 import package.json，由 Vite/Rollup 在 build 時 inline，
  // 不再依賴運行時 readFileSync（之前 Windows 路徑解析失敗會 fallback unknown）。
  return typeof pkg.version === 'string' ? pkg.version : 'unknown';
}

function readGitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch (_) {
    return 'unknown';
  }
}

function readBuildDate(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/** Module top-level cache — build 期間僅執行一次 */
export const buildInfo: BuildInfo = {
  version: readVersion(),
  gitHash: readGitHash(),
  buildDate: readBuildDate(),
};
