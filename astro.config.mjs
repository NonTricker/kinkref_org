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
