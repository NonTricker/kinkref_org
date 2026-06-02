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
 * 互動：
 *   - 點 pill：active 狀態 → 取消；inactive 狀態 → 啟用
 *   - 多 filter 組合（AND）：點不同 key 的 pill 會累加，不會互相清除
 *   - History API + popstate：URL share-able、瀏覽器 back/forward 可用
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

/** filter key 中文 label（給 meta UI 用） */
const KEY_LABEL: Record<FilterKey, string> = {
  topic: '主題',
  access: '取得方式',
  study: '研究類型',
  type: '書類',
  difficulty: '難度',
  bdsm: 'BDSM 接受度',
  publisher: '出版社',
  zh: '中譯本',
};

/** 更新 result count + active filter chips + clear link */
function updateMeta(
  visibleCount: number,
  totalCount: number,
  filters: Partial<Record<FilterKey, string>>
) {
  const meta = document.querySelector<HTMLElement>('[data-filter-meta]');
  if (!meta) return;
  const activeEntries = Object.entries(filters);
  const hasFilter = activeEntries.length > 0;
  if (!hasFilter) {
    meta.hidden = true;
    meta.innerHTML = '';
    return;
  }
  const path = window.location.pathname;
  // 每個 active filter 用 chip 顯示，點 × 可單獨移除
  const chips = activeEntries
    .map(
      ([key, val]) => `
        <button
          type="button"
          class="filter-chip"
          data-remove-filter
          data-key="${key}"
          aria-label="移除篩選 ${KEY_LABEL[key as FilterKey] ?? key}: ${val}"
        >
          <span class="filter-chip-key">${KEY_LABEL[key as FilterKey] ?? key}</span>
          <span class="filter-chip-val">${escapeHtml(String(val))}</span>
          <span class="filter-chip-x" aria-hidden="true">×</span>
        </button>
      `
    )
    .join('');
  meta.hidden = false;
  meta.innerHTML = `
    <span class="filter-meta-count">顯示 <strong>${visibleCount}</strong> / ${totalCount} 條</span>
    <span class="filter-meta-chips">${chips}</span>
    <a href="${path}" class="filter-clear">全部清除 ×</a>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 寫入新的 URL params，用 history.pushState（不 reload） */
function setFilters(filters: Partial<Record<FilterKey, string>>) {
  const url = new URL(window.location.href);
  // 清除所有 filter key，再寫入留下的
  for (const key of FILTER_KEYS) url.searchParams.delete(key);
  for (const [key, val] of Object.entries(filters)) {
    if (val) url.searchParams.set(key, val);
  }
  // 用 pushState，讓 back/forward 可用
  window.history.pushState({}, '', url.toString());
  applyFilters();
}

/** Toggle 單個 filter（已 active 則移除，否則加入；保留其他 filter） */
function toggleFilter(key: FilterKey, val: string) {
  const current = readFilters();
  if (current[key] === val) {
    delete current[key];
  } else {
    current[key] = val;
  }
  setFilters(current);
}

/** 主執行 */
function applyFilters() {
  const filters = readFilters();

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
  updateMeta(visible, items.length, filters);
}

/** 攔截 pill click → toggle 而非單純 navigate */
function bindPillClicks() {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // 移除單一 filter chip 的 ×
    const chip = target.closest<HTMLButtonElement>('[data-remove-filter]');
    if (chip) {
      e.preventDefault();
      const key = chip.dataset.key as FilterKey | undefined;
      if (!key) return;
      const current = readFilters();
      delete current[key];
      setFilters(current);
      return;
    }

    // pill toggle
    const pill = target.closest<HTMLAnchorElement>('a.tag-pill[href*="?"]');
    if (!pill) return;
    const href = pill.getAttribute('href') ?? '';
    const idx = href.indexOf('?');
    if (idx < 0) return;
    const params = new URLSearchParams(href.slice(idx + 1));
    // 只處理單一 filter key（這正是 TagPill 的 href 結構）
    const keys = [...params.keys()].filter((k): k is FilterKey =>
      (FILTER_KEYS as readonly string[]).includes(k)
    );
    if (keys.length !== 1) return;
    const key = keys[0]!;
    const val = params.get(key);
    if (!val) return;
    e.preventDefault();
    toggleFilter(key, val);
  });
}

// 啟動
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyFilters();
      bindPillClicks();
    });
  } else {
    applyFilters();
    bindPillClicks();
  }
  window.addEventListener('popstate', applyFilters);
}

export {};
