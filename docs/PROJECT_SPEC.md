# 專案規格 — kinkref.org

> **版本**：v1.0（公開版）
> **最後更新**：2026-05-02
> **License**：CC-BY-SA 4.0

本文件是 kinkref.org 的對外規格說明，目的是讓潛在貢獻者、引用者、研究者快速理解這個站做什麼、不做什麼、邊界在哪。內部規劃文件（含 maintainer 個人決策過程）不在此公開範圍內。

---

## 一、定位

**轉譯派 (Translator-Curator)。**

這個站不是：
- 介紹站（不做「BDSM 是什麼」的通識教育）
- 橋樑站（不做圈內外橋接）
- 論壇（不做社群互動）
- 全域知識庫（不做 BDSM 領域的全方位百科）

這個站是：**英文 BDSM 學術文獻的中文摘要與索引站。**

核心價值主張：台灣中文圈完全沒有結構化的 BDSM 學術入口，本站填補這個缺口。

---

## 二、內容三柱

| 柱 | 說明 | 規模目標 |
|---|------|---------|
| **Glossary（術語表）** | 中英對照 + 來源年代 + 首見文獻。重點接住 bdsmtest.org 等測驗工具測完後「我是 X 但跟 Y 差在哪」的搜尋流量 | 50-80 詞起手 |
| **Annotated Bibliography（文獻指南）** | 分主題（consent / psychopathology debate / aftercare / cross-cultural / harm reduction / methodology / legal 等），每篇 150-250 字中文摘要 + DOI + open access 指引 | 5-7 主題、首批 20-30 篇 |
| **Curated Reading List（書架清單）** | 已驗證書目，分類 + 3-5 句中文評介 + 取得方式 | 30-50 本 |

完整資料結構規範見 [`CONTENT_SCHEMA.md`](./CONTENT_SCHEMA.md)。

---

## 三、目標讀者

三類，互相不衝突：

- **入門者**：透過術語表、FAQ、白話解釋頁，建立基礎詞彙
- **引用者**：透過 DOI、APA 格式 export、Zotero 連結，快速取得學術引用
- **研究者**：透過按主題組織的 annotated bibliography，找到該領域的關鍵文獻

---

## 四、治理模型

### 4.1 角色

- **策展人 / 主編**：負責內容品質、最終裁決、爭議處理
- **貢獻者**：透過 PR 或 email 投稿術語、書目、論文摘要、翻譯
- **審校者**：協助方法論段落或翻譯品質的人工複審

### 4.2 開放投稿區

歡迎社群提交 PR：
- 術語表新增 / 中文定義補充 / 辨析
- 書目新增 / 書摘撰寫
- 論文新增 / 摘要撰寫 / 翻譯勘誤
- 引用格式修正
- 大學社團 directory / 專業人士 directory（自薦）

### 4.3 主編鎖定區

以下內容由主編獨立維護，**不接受外部修改型 PR**（但接受 Issue 提出意見）：
- 窒息 / Breath Play 相關（學界共識：不存在安全窒息，立場硬性鎖定）
- 法律章節（需專業審核）
- 未成年保護聲明（零爭議區）
- About 頁 / 治理說明（站主自述）
- 任何「安全操作指引」性質內容（本站明確不做此類）

詳細貢獻流程見 [`../CONTRIBUTING.md`](../CONTRIBUTING.md)。

---

## 五、翻譯授權三條路

本站對版權嚴格遵守 fair use 邊界：

1. **Open Access (CC-BY) 論文** → 直接翻，標 attribution
2. **Preprint 版** (PsyArXiv / SSRN) → 翻 preprint，不翻 published version
3. **Paywalled 論文** → 200-400 字策展摘要 + 註解 + DOI 連結（fair use）

**翻譯 pipeline**：AI 初譯 → 術語層校對 → 方法論段落人工複審 → 公開 commit history + 版本標註。

---

## 六、不做的事（Negative Charter）

以下內容**永遠不會出現在站上**：

- ❌ 場地 / 工作室介紹
- ❌ 個人背書（包括主編自己）
- ❌ 安全操作指引（風險最高，立場：本站不是安全教育機構）
- ❌ 金流、捐款、商品（以名聲為收益，非營利）
- ❌ 站內留言 / 投票 / 社群互動
- ❌ 即時通訊 / 聊天室 / 配對
- ❌ 活動報名 / 售票
- ❌ 帳號系統 / 登入註冊
- ❌ 任何色情意象（站內零情色圖片）
- ❌ 涉及未成年的任何內容（包括假設情境）

---

## 七、有限度做的事

- ✅ 外導流活動行事曆（aggregator，僅列外部連結，不自建主檔）
- ✅ 大學 kinky 社團 directory（僅名稱 + 官方聯絡 + 是否公開招生）
- ✅ Kink-friendly 專業人士 directory（僅限**本人主動申請**列入者）
- ✅ 圈內人投稿論文，可選擇收回到自己圈名身分（OPSEC 設計見 CONTRIBUTING.md）

---

## 八、技術棧

| 層 | 選擇 | 理由 |
|----|------|------|
| **網域** | `kinkref.org` | 已決定 |
| **靜態站生成** | Astro 6.x | 內容 SSOT、Markdown-first、Cloudflare Pages 友善 |
| **樣式** | TailwindCSS v4 | 視覺中性、貢獻者友善 |
| **內容** | Markdown + YAML frontmatter | 走 GitHub PR 即可貢獻 |
| **搜尋** | MiniSearch（客戶端） | 無後端負擔、即開即用 |
| **部署** | Cloudflare Pages | 免費 + 自動 PR preview |
| **License** | CC-BY-SA 4.0 | 防惡意 fork、保留 attribution |
| **AI 友好** | `llms.txt` + `robots.txt` 開放 | 對 AI 搜尋引擎友善 |
| **隱私** | Registrar 開 WHOIS privacy + 無追蹤 analytics | 配合 OPSEC |

---

## 九、Tagline

```
英：Kink Reference
中：中文 BDSM 學術文獻策展與術語索引
```

---

## 十、競品分析摘要

- **皮繩愉虐邦 (bdsmtw.com)**：2004 成立，台灣最老牌。DNA 是身分政治／運動派，非學術轉譯。網站 2026 年已無法連線。
- **二線**：Maya 緊縛人生、PTT BDSM 板、FetLife 中文用戶、Plurk 圈、Discord 群
- **結論**：無人佔住「學術轉譯」這個位置。差異化靠 rigor 與結構，不靠完整度。

---

## 十一、規模與維護量

- **v1.0 launch scope**：兩個週末
- **年產**：review 50 篇 abstract → 寫 15-25 篇摘要 → 5-10 篇翻譯
- **月耗工時**：4-6 小時

---

## 十二、相關文件

| 文件 | 用途 |
|------|------|
| [`README.md`](../README.md) | 專案首頁 |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | 貢獻流程、OPSEC 教學 |
| [`CONTENT_SCHEMA.md`](./CONTENT_SCHEMA.md) | 資料結構規範（必讀） |
| [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) | 對外設計原則 |
| [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) | 行為準則 |
| [`../SECURITY.md`](../SECURITY.md) | 安全回報流程 |
| [`../AGENTS.md`](../AGENTS.md) | AI Agent 協作指引 |

---

*Curated for public release — 2026-05-02*
