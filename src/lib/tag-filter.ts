/**
 * tag-filter.ts — 共用 URL-driven client-side filter
 *
 * Bind 一次，多個 index 頁面共用：glossary / bibliography / books / journals
 *
 * 流程：
 *   1. 讀 URL ?topic=X&access=Y 等 params
 *   2. 對每個 [data-filter-container] > li 比對 data-* attribute
 *   3. 不 match 的 hide；match 的 show
 *   4. 更新 active state（tag pill 高亮、result count、clear link）
 *
 * Data attr 格式：
 *   <li data-topic="consent,aftercare" data-access="open-access" ...>
 *   多值用 comma 分隔。filter 比對「子集匹配」（item attr 含 query value 即 match）
 *
 * 支援的 URL params（每頁面只用相關的 key）：
 *   topic / access / study / type / difficulty / bdsm / publisher / zh
 *
 * Iron Law: 純 client-side、no JS framework、無 dep。
 */

const FILTER_KEYS = [
  'topic',
  'access',
  'study',
  'type',
  'difficulty',
  'bdsm',
  'publisher',
  'zh',
] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

/** 從 URL 取所有 filter 條件 */
function readFilters(): Partial<Record<FilterKey, string>> {
  const params = new URLSearchParams(window.location.search);
  const out: Partial<Record<FilterKey, string>> = {};
  for (const key of FILTER_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v;
  }
  return out;
}

/** 把某個 item 的 data-key 屬性切 comma 後做包含比對 */
function matchItem(item: Element, filters: Partial<Record<FilterKey, string>>): boolean {
  for (const [key, queryVal] of Object.entries(filters)) {
    if (!queryVal) continue;
    const raw = item.getAttribute(`data-${key}`);
    if (!raw) return false;
    const values = raw.split(',').map((s) => s.trim());
    if (!values.includes(queryVal)) return false;
  }
  return true;
}

/** 更新 tag pill 的 active state（讓 user 知道哪個 filter 開著）
 *  Selector: 只抓 toolbar 內帶 query string 的 anchor tag-pill。
 *  Entry card 內的 tag-pill 是 <span>，沒 href，不會被誤抓。 */
function markActivePills(filters: Partial<Record<FilterKey, string>>) {
  document
    .querySelectorAll<HTMLAnchorElement>('a.tag-pill[data-active]')
    .forEach((el) => el.removeAttribute('data-active'));

  document
    .querySelectorAll<HTMLAnchorElement>('a.tag-pill[href*="?"]')
    .forEach((pill) => {
      const href = pill.getAttribute('href') ?? '';
      const pillParams = new URLSearchParams(href.split('?')[1] ?? '');
      for (const [key, val] of Object.entries(filters)) {
        if (pillParams.get(key) === val) {
          pill.setAttribute('data-active', 'true');
        }
      }
    });
}

/** 更新 result count + clear link 顯示 */
function updateMeta(visibleCount: number, totalCount: number, hasFilter: boolean) {
  const meta = document.querySelector<HTMLElement>('[data-filter-meta]');
  if (!meta) return;
  if (!hasFilter) {
    meta.hidden = true;
    return;
  }
  const path = window.location.pathname;
  meta.hidden = false;
  meta.innerHTML = `
    <span>篩選中：顯示 <strong>${visibleCount}</strong> / ${totalCount} 條</span>
    <a href="${path}" class="filter-clear">清除篩選 ×</a>
  `;
}

/** 主執行 */
function applyFilters() {
  const filters = readFilters();
  const hasFilter = Object.keys(filters).length > 0;

  const container = document.querySelector<HTMLElement>('[data-filter-container]');
  if (!container) return;

  const items = container.querySelectorAll<HTMLElement>(':scope > li');
  let visible = 0;
  items.forEach((item) => {
    const ok = matchItem(item, filters);
    item.style.display = ok ? '' : 'none';
    if (ok) visible++;
  });

  markActivePills(filters);
  updateMeta(visible, items.length, hasFilter);
}

// 啟動
if (typeof window !== 'undefined') {
  // DOM ready 立即跑一次（覆蓋 URL 直接帶 filter 進來的情況）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFilters);
  } else {
    applyFilters();
  }
  // 監聽 popstate（瀏覽器 back/forward）
  window.addEventListener('popstate', applyFilters);
}

export {};
