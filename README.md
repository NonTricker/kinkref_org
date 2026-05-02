# Kink Reference

> **中文 BDSM 學術文獻策展與術語索引**
> A curated index of BDSM academic literature in Traditional Chinese.

[🌐 kinkref.org](https://kinkref.org)
[📖 術語表](https://kinkref.org/glossary)
[📚 文獻指南](https://kinkref.org/bibliography)
[📕 書架清單](https://kinkref.org/books)
[🤝 貢獻](https://kinkref.org/contribute)

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](./CONTRIBUTING.md)

---

## 為什麼存在這個站

台灣中文圈完全沒有結構化的 BDSM 學術入口。

當有人在 bdsmtest.org 看到自己的測驗結果、想要嚴肅理解這些術語的學術定義時，他們找到的是色情站、是同溫層、是品質參差的 Plurk 串。沒有一個地方能讓他們以學術的方式理解自己正在體驗的事。

這個站填補這個缺口。

---

## 這個站是什麼

**轉譯派 (Translator-Curator)**：英文 BDSM 學術文獻的中文摘要與索引站。

### 內容三柱

| 柱 | 說明 |
|---|------|
| **📖 術語表 (Glossary)** | 50-80 詞起手。中英對照 + 來源年代 + 首見文獻 + 與相近術語的辨析 |
| **📚 文獻指南 (Annotated Bibliography)** | 5-7 主題分類。每篇 150-400 字中文摘要 + DOI + open access 指引 |
| **📕 書架清單 (Curated Reading List)** | 30-50 本已驗證書目。分類 + 中文評介 + 取得方式 |

### 三類讀者

- **入門者**：透過術語表、白話解釋頁，建立基礎詞彙
- **引用者**：DOI、APA 格式 export、Zotero 連結
- **研究者**：按主題組織的 annotated bibliography

---

## 這個站不是什麼

❌ 不是社群論壇
❌ 不是安全指引站
❌ 不是個人或工作室推薦平台
❌ 不是情色站

完整負面清單見 [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) § 6。

---

## 如何貢獻

### 🤖 用 AI 協助貢獻（推薦）

把以下文字貼給你的 AI（Claude / ChatGPT / Gemini）：

```
請閱讀 https://github.com/[org]/kinkref/blob/main/AGENTS.md
和 https://github.com/[org]/kinkref/blob/main/CONTRIBUTING.md
然後協助我為 kinkref.org 撰寫一篇 [術語/論文摘要/書摘]。
```

AI 會引導你完成符合 schema 的條目。

### 📝 直接 PR

1. Fork 本 repo
2. 讀 [`CONTRIBUTING.md`](./CONTRIBUTING.md) — 包含 OPSEC 教學
3. 讀 [`docs/CONTENT_SCHEMA.md`](./docs/CONTENT_SCHEMA.md) — 資料結構規範
4. 在 `content/` 對應目錄新增 Markdown 檔
5. 跑過 PR 自檢清單（CONTRIBUTING.md § 7）
6. 提交 PR

### 📧 不想用 GitHub？

寄信至站主投稿信箱（見網站 Contact 頁）。圈名、匿名、一次性讀者皆歡迎。

---

## OPSEC 注意事項

如果你是圈內人，本站為你設計了完整的身分保護機制：

- 使用 GitHub 專屬帳號（不要用主帳號）
- 設定 directory-scoped git config
- 用 GitHub noreply email
- `contributor` 欄位用圈名

完整流程見 [`CONTRIBUTING.md`](./CONTRIBUTING.md) § 3。

---

## 治理模型

- **策展人 / 主編**：獨立維護，最終裁決
- **開放投稿區**：歡迎 PR（術語、書目、論文摘要、翻譯、勘誤）
- **主編鎖定區**：窒息相關 / 法律 / 未成年保護 / About / 安全立場

詳見 [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) § 4。

---

## 技術棧

| 層 | 選擇 |
|----|------|
| 靜態站生成 | [Astro](https://astro.build/) 6.x |
| 樣式 | [TailwindCSS](https://tailwindcss.com/) v4 |
| 內容 | Markdown + YAML frontmatter |
| 搜尋 | [MiniSearch](https://lucaong.github.io/minisearch/)（客戶端） |
| 部署 | [Cloudflare Pages](https://pages.cloudflare.com/) |
| AI 友好 | `llms.txt` + `robots.txt` 開放 |

---

## 開發

```bash
# 需要 Node.js >= 22.12.0
nvm use

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置
npm run build

# 預覽
npm run preview
```

完整指令見 [`package.json`](./package.json)。

---

## 文件導航

| 文件 | 用途 |
|------|------|
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 貢獻流程（含 OPSEC 教學） |
| [`AGENTS.md`](./AGENTS.md) | AI Agent 協作指引 |
| [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) | 行為準則 |
| [`SECURITY.md`](./SECURITY.md) | 安全回報 |
| [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) | 專案定位與規格 |
| [`docs/DESIGN_PRINCIPLES.md`](./docs/DESIGN_PRINCIPLES.md) | 設計原則 |
| [`docs/CONTENT_SCHEMA.md`](./docs/CONTENT_SCHEMA.md) | 資料結構規範 |

---

## 相關資源

- [bdsmtest.org](https://bdsmtest.org) — 英文 BDSM 傾向測驗工具
- [PsyArXiv](https://psyarxiv.com/) — 心理學預印本
- [SSRN](https://www.ssrn.com/) — 社會科學預印本
- [Unpaywall](https://unpaywall.org/) — 查找合法 open access 版本

---

## License

本站內容採 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 授權。

- ✅ 可以自由引用、改作、傳播
- ✅ 商業使用也可以
- ⚠️ 必須註明來源
- ⚠️ 改作後須以相同授權釋出

完整授權見 [`LICENSE`](./LICENSE)。

---

## 聯絡

- 📬 投稿信箱：見網站 [Contact](https://kinkref.org/about) 頁
- 💬 [GitHub Issues](../../issues) — 提建議、回報問題
- 🔀 [Pull Requests](../../pulls) — 直接貢獻

---

*kinkref.org — Curating BDSM scholarship for the Traditional Chinese reading public.*
