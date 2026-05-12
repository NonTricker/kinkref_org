// Note: 不使用 Tailwind —— 整站樣式由光影師的 tokens.css + global.css（純 CSS Variables）
// 接管。Tailwind 在 Astro 6 + Rolldown 早期版本有相容性問題，且本站零 utility class 使用，
// 拿掉 dependency 反而更乾淨。
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kinkref.org',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/_'),
      changefreq: 'monthly',
      priority: 0.7,
      // v0.11.0：URL pattern 分級 — 讓 Google 知道哪些是重要 entry
      // 首頁 / collection index 給更高 priority + 更高 changefreq
      // 詳情頁維持 0.7 monthly（預設）
      // Lastmod 由 post-build script 從 git log 注入（更精準）
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';

        // 首頁 — 最高優先級
        if (path === '/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }

        // Collection index — 6 個主要入口
        if (/^\/(glossary|bibliography|books|journals|guides|resources)$/.test(path)) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }

        // Dashboard — 數據統計頁，低優先（純參考用）
        if (path === '/dashboard') {
          return { ...item, priority: 0.4, changefreq: 'weekly' };
        }

        // 靜態主頁 — about / contribute / qa
        if (path === '/about' || path === '/contribute' || path === '/qa') {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }

        // Guides 詳情 — pillar pages，高品質長文
        if (path.startsWith('/guides/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }

        // Translations — 全文翻譯，內容穩定
        if (path.startsWith('/translations/')) {
          return { ...item, priority: 0.7, changefreq: 'yearly' };
        }

        // Counselor 詳情 — 需要 re-verify，每年更新
        if (path.startsWith('/resources/counselors/')) {
          return { ...item, priority: 0.7, changefreq: 'monthly' };
        }

        // 其他 entry pages（glossary / bibliography / books / journals 詳情）
        return { ...item, priority: 0.7, changefreq: 'monthly' };
      },
      i18n: {
        defaultLocale: 'zh-TW',
        locales: {
          'zh-TW': 'zh-TW',
        },
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  // 預設靜態輸出（給 Cloudflare Pages 用）
  output: 'static',
});
