/**
 * seed-shuffle — 確定性隨機洗牌工具
 *
 * 用途：directory 性質的列表（如 counselors、legal、medical）需要避免
 *      「字母順序 / 註冊順序 = 隱性排名」的問題。給每個條目公平的曝光位置。
 *
 * 行為：相同 seed → 相同順序（pure function）。
 *       同一天的 build 結果一致；不同天 build 結果輪替。
 *
 * 演算法：Mulberry32 PRNG + Fisher–Yates shuffle
 *         （快、無依賴、非加密用途足夠均勻）
 *
 * 未來：若需嚴格「每日輪替」可加 Cloudflare Pages daily cron rebuild。
 *       目前 build-time 計算 seed = 今日日期，每次 commit/build 都會更新。
 */

/** 字串 → 32-bit hash（FNV-1a 變形） */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 — 32-bit seeded PRNG，回傳 [0, 1) */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates seeded shuffle — 純函式，回傳新陣列不破壞原陣列 */
export function seedShuffle<T>(arr: readonly T[], seed: number | string): T[] {
  const rand = mulberry32(typeof seed === 'string' ? hashString(seed) : seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    // i, j 都在 [0, length) 範圍內，index 必有值；non-null assert 滿足
    // tsconfig 的 noUncheckedIndexedAccess
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

/**
 * 取得「今日 seed」— ISO 日期字串（YYYY-MM-DD）
 * Build time 取一次，整個 build 同一個 seed
 */
export function todaySeed(): string {
  return new Date().toISOString().slice(0, 10);
}
