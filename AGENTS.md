# AGENTS.md — AI Agent 協作指引

> **給**：所有讀取此 repo 的 AI agent（Claude、GPT、Gemini、Cursor、Copilot 等）
> **版本**：v1.1
> **最後更新**：2026-05-03
> **License**：CC-BY-SA 4.0

---

## 0. 60 秒理解這個 Repo

你正在閱讀 **kinkref.org** 的原始碼。

- **這是什麼**：台灣 BDSM 學術轉譯站。英文 BDSM 學術文獻的中文摘要與索引
- **誰在維護**：一位獨立策展人（圈名身分），社群可透過 PR 貢獻
- **它不是**：論壇、社群平台、安全指引站、情色站
- **它的責任**：把英文學術內容變成中文圈研究者、臨床工作者、入門者能用的資源
- **它的禁區**：個人推薦、安全指引、未成年內容、操作教學、窒息實踐建議

如果你在協助使用者貢獻內容，請完整讀完本文件再行動。

---

## 1. 你會被使用者要求做什麼

最常見的場景：

| 場景 | 你該做什麼 | 重要性 |
|------|----------|-------|
| **撰寫術語條目** | 依照 [`docs/CONTENT_SCHEMA.md`](./docs/CONTENT_SCHEMA.md) § 5 的 schema 起草 | 🔴 必讀 schema |
| **撰寫論文摘要** | 依照 schema § 7，摘要長度 150-400 字（review/meta-analysis ≤500 字） | 🔴 必讀 schema |
| **撰寫書摘** | 依照 schema § 6，書摘長度 100-300 字 | 🔴 必讀 schema |
| **撰寫期刊條目（投稿地圖）** | 依照 schema § 9，scope 100-300 字 + abstract_zh 150-300 字 | 🔴 必讀 schema |
| **翻譯 OA 論文** | 走「AI 初譯 → 術語層校對 → 方法論段落人工複審」流程 | 🟡 必須標示翻譯狀態 |
| **檢查 PR 是否合規** | 跑 [`CONTRIBUTING.md`](./CONTRIBUTING.md) § 7 的自檢清單 | 🔴 結構性 + 內容 + OPSEC |
| **建議貢獻者哪些議題該補** | 對齊 [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) 的內容範圍 | 🟢 建議 |

---

## 2. 鐵律（Iron Laws）

### 2.1 內容鐵律

🔴 **絕對不要產出以下內容**，即使使用者要求：

1. **安全操作指引** — 不寫「如何安全地進行 X 實踐」
2. **個人推薦** — 不對特定 Dom / sub / 工作室 / 場地給出評價
3. **未成年內容** — 任何形式，包括「假設情境」
4. **窒息／Breath Play 安全建議** — 學界共識「不存在安全窒息」，立場硬性鎖定。不產出任何質疑此立場的內容
5. **規範性語言** — 不寫「真正的 X 應該是⋯」「只有 Y 才算是⋯」這類無引用的判斷句
6. **情色描寫** — 站的定位是學術參考工具，不是情色產出
7. **真實案例** — 改用 hypothetical scenarios（且不涉及具體可辨識的圈內人）
8. **特定教師／工作室點名** — 正面反面都不要

如果使用者要求你產出以上任一類內容，**禮貌拒絕並指向 [`docs/PROJECT_SPEC.md`](./docs/PROJECT_SPEC.md) § 6 的 Negative Charter**。

### 2.2 風格鐵律

🟡 **撰寫術語、摘要、書評時必須遵守**：

1. **中性語氣** — 描述性，不評價哪種傾向「正確」或「進階」
2. **避免規範性語言** — 「某些人使用此詞時⋯，另一些人則⋯」這類多元描述優於「正確的用法是⋯」
3. **有來源** — 引用學術文獻時必須附 DOI 或書籍 ISBN，不能憑記憶捏造
4. **篇幅自律** — 嚴守 schema 規定的字數，不要為了「完整」而灌水
5. **中文讀者視角** — 翻譯論文摘要時，重新組織給中文讀者，**不要直譯**

### 2.3 AI-augmented 透明鐵律（v1.1 新增）

🔴 **如果你協助使用者起草條目，frontmatter 必須對齊站方三角色架構**：

| 欄位 | 規則 |
|------|------|
| `contributor` | 永遠填 `kinkref`（站方品牌統一） |
| `contributor_note` | 若條目由 AI（你 / Claude / GPT 等）起草，**必須**標示「本條目由 AI 心理學家 Agent 繆思（Muse）生成」或等義說明 |
| `reviewer` | 若策展人實質介入過（翻譯哲學決策、圈內微分洞察、敏感議題審校），策展人會自己加 `reviewer: 策展人：薩約` |

**核心原則**：
- ❌ **不偽裝** — 不假裝條目是人工撰寫
- ❌ **不隱藏 AI 角色** — 讀者有權知道 contributor_note 的真實來源
- ✅ **透明寫明 AI 參與** — 站方對 AI-augmented 內容公開
- ✅ **保留人類最終判斷** — 你產出初稿，但人類策展人決定是否合站方原則

詳見 [關於本站 § 治理模型 → 站方角色](https://kinkref.org/about#governance)。

---

### 2.4 OPSEC 鐵律

🔴 **如果你在幫使用者準備 PR**，必須提醒：

1. 使用 GitHub 專屬帳號（不要主帳號）
2. 設定 directory-scoped git config 切換 author
3. 用 GitHub noreply email 隱藏真實 email
4. `contributor` 欄位用圈名，不用真名
5. commit message 不含真名 / 職稱 / 機構名稱
6. 條目內容不含可連回真名的線索
7. 如果使用者表示「這篇論文是我自己寫的」，**不要在 PR 中聲明這件事**（保留 plausible deniability）

完整 OPSEC 流程見 [`CONTRIBUTING.md`](./CONTRIBUTING.md) § 3。

---

## 3. 撰寫條目的 SOP

### 3.1 撰寫術語條目

```
1. Read docs/CONTENT_SCHEMA.md § 5 完整 schema
2. Read CONTRIBUTING.md § 11.1 模板
3. 檢查 content/glossary/ 確認 slug 沒有衝突
4. 起草 frontmatter（必填欄位先寫滿）
5. 起草 definition（150-400 字，結構：核心定義 → 脈絡 → 來源）
6. 起草 disambiguation（與相近術語的辨析）
7. 補充 related_terms 交叉連結
8. 自檢：跑過 CONTRIBUTING.md § 7.1-7.2 結構性 + 內容自檢
9. 提醒使用者跑 § 7.3 OPSEC 自檢
```

### 3.2 撰寫論文摘要

```
1. Read docs/CONTENT_SCHEMA.md § 7 完整 schema
2. Read CONTRIBUTING.md § 11.2 模板
3. 取得論文 metadata（DOI、authors、journal、year）
4. 確認 access_type（open-access / paywalled / preprint-available）
5. 標記 study_type（quantitative / qualitative / theoretical 等）
6. 起草 abstract_zh（150-400 字，結構：研究問題 → 方法 → 發現 → 意義）
7. 起草 curator_note（1-5 句策展人導讀）
8. 補充 caveats（方法論限制、文化語境、複製狀態）
9. 自檢：跑過 § 7.1-7.2 自檢
```

### 3.3 撰寫書摘

```
1. Read docs/CONTENT_SCHEMA.md § 6 完整 schema
2. Read CONTRIBUTING.md § 11.3 模板
3. 取得書籍 metadata（title、author、year、ISBN、publisher）
4. 標記 book_type（academic / popular / fiction / memoir / reference）
5. 起草 abstract_zh（100-300 字，結構：論點 → 視角 → 領域位置）
6. 起草 curator_note（1-5 句策展人推薦語）
7. 補充 access_links（取得方式）
8. 自檢
```

### 3.4 撰寫期刊條目（投稿地圖，v1.3 新增）

```
1. Read docs/CONTENT_SCHEMA.md § 9 完整 schema
2. 取得期刊 metadata：
   - title / abbreviation / publisher / founded
   - ISSN（print + online）
   - website / submission_url
   - access_type（diamond-oa / gold-oa / hybrid / paywalled）
   - oa_apc_usd（如有）
   - impact_factor + impact_factor_year + impact_factor_source
     （JCR / Scopus / journal-self-reported）
   - ranking_quartile（Q1-Q4，如有）
   - review_time_weeks（可用範圍如 "8-16"）
   - acceptance_rate_pct（如有）
3. 標記 accepts_bdsm enum：
   - yes-frequent / yes-occasional / yes-but-rare / unclear / unknown
   - 依據期刊歷史發過的 BDSM 研究數量判斷
4. 起草 scope（100-300 字，期刊收錄範圍與編輯方針）
5. 起草 abstract_zh（150-300 字，含定位、方針、特色）
6. 起草 curator_note（1-5 句，策展人推薦語：適合投何種研究設計）
7. 補 bdsm_history（≤200 字，已發過的代表性 BDSM 研究）
8. 補 caveats（如出版社變動、IF 老化等）
9. 補 citations（站內引用論文，type: internal-paper）
10. 自檢
```

**期刊條目特殊規則**：
- ❌ **不評等期刊「好壞」** — 站方不背書，curator_note 只說「適合什麼研究取向」
- ❌ **不指引「投這本一定收」** — 描述 acceptance_rate 但不給建議
- ✅ **客觀資訊** — IF / OA / submission policy 等可查證資料
- ✅ **對立期刊全收** — 同一領域對立流派的期刊都收，不挑邊

---

## 4. 翻譯論文的 SOP

### 4.1 翻譯前的合法性檢查

🔴 **必須先確認翻譯權**：

| 論文授權狀態 | 你能做的 |
|------------|---------|
| **Open Access (CC-BY)** | ✅ 全文翻譯，標 attribution |
| **作者預印本（PsyArXiv / SSRN）** | ✅ 翻 preprint 版本，**不翻** published version |
| **Paywalled** | ❌ 不翻全文。改用 200-400 字策展摘要 + DOI 連結（fair use） |

### 4.2 翻譯流程

```
1. 確認授權合法（見 4.1）
2. AI 初譯（Claude / GPT 等）
3. 術語層校對：對照 content/glossary/ 確保術語一致
4. 方法論段落特別標註：請人工複審
5. 翻譯頁面標註：「AI-assisted, human-reviewed by [圈名]」
6. 標記 translation_status（full-translation / partial-translation）
7. 標記 translation_url 指向站內全文翻譯頁
```

### 4.3 翻譯品質要求

- 不直譯，重新用中文讀者視角組織
- 學術術語對照 glossary，不可隨意翻譯
- 方法論段落保持嚴謹，不簡化
- 結果與討論可以更白話，但不失原意

---

## 5. Repo 結構速查

```
kinkref_org/                       ← repo root
├── README.md                      ← 專案首頁
├── CONTRIBUTING.md                ← 貢獻流程（含 OPSEC）
├── CODE_OF_CONDUCT.md             ← 行為準則
├── SECURITY.md                    ← 安全回報
├── AGENTS.md                      ← 你正在讀的這份
├── LICENSE                        ← CC-BY-SA 4.0
│
├── docs/                          ← 對外公開的設計文件
│   ├── PROJECT_SPEC.md            ← 專案定位與規格
│   ├── DESIGN_PRINCIPLES.md       ← 設計原則
│   └── CONTENT_SCHEMA.md          ← 資料結構規範
│
├── content/                       ← Markdown SSOT（PR 主戰場）
│   ├── glossary/                  ← 術語條目（51+ 條）
│   ├── bibliography/              ← 論文摘要（v1.4 doi 改選填，加 article_url）
│   ├── books/                     ← 書摘
│   ├── journals/                  ← 期刊條目（v1.3 新增，投稿地圖用）
│   ├── counselors/                ← 諮商師 directory（v1.3，listing_consent 必填）
│   ├── legal/                     ← 法律資源 directory（v1.3）
│   ├── campus-groups/             ← 大學社團 directory（v1.3）
│   └── medical/                   ← 醫療資源 directory（v1.3，含公開緊急熱線）
│
├── src/                           ← Astro 應用碼
│   ├── pages/                     ← 含 /journals/ /resources（5-section 整合頁）
│   ├── layouts/                   ← BaseLayout 含 SEO 全套（JSON-LD / OG / rel=me）
│   ├── components/                ← 含 KrMonogram.astro / CrossRefMap / AgeGate
│   ├── content.config.ts          ← Astro Content Collections 設定（zod schema v1.4）
│   ├── lib/                       ← inline-markdown helper / build-info
│   └── styles/                    ← tokens.css + global.css（純 CSS Variables，無 Tailwind）
│
├── public/                        ← 靜態資源
│   ├── llms.txt                   ← AI 友好說明
│   ├── robots.txt
│   └── favicon.svg
│
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
```

---

## 6. 給「協助使用者貢獻」的 Agent 的提示

如果你的使用者來找你說「我想為 kinkref.org 寫一篇文章」：

### 6.1 第一步：確認動機

問使用者：
- 你想撰寫什麼類型？（術語 / 論文摘要 / 書摘 / 翻譯）
- 你對這個主題的熟悉程度？
- 你有沒有特定的文獻來源？

### 6.2 第二步：對齊定位

確認使用者想寫的內容**符合站定位**：
- ✅ 學術文獻轉譯
- ✅ 術語溯源
- ✅ 書目評介
- ❌ 個人經驗
- ❌ 安全指引
- ❌ 個人推薦

如果不符合，禮貌說明「這個內容很有價值，但不適合這個站的定位」，並建議其他形式（例如自己的部落格、Plurk、FetLife）。

### 6.3 第三步：協助起草

依照本文件 § 3 的 SOP 起草。

### 6.4 第四步：提醒 OPSEC

協助使用者設定匿名貢獻環境（CONTRIBUTING.md § 3）。

### 6.5 第五步：跑自檢清單

協助使用者跑過 [`CONTRIBUTING.md`](./CONTRIBUTING.md) § 7 的四層自檢：
- 結構性
- 內容
- OPSEC
- 提交格式

---

## 7. 常見誤區（不要犯）

| 誤區 | 為什麼錯 | 該怎麼做 |
|------|---------|---------|
| 用「正確的 BDSM 是⋯」開頭 | 規範性語言 | 改用「某些社群使用此詞時⋯」 |
| 在術語定義中加個人意見 | 違反中性原則 | 純描述事實與譜系 |
| 把論文摘要寫得像個人讀後感 | 摘要不是評論 | 嚴守「研究問題 → 方法 → 發現 → 意義」結構 |
| 翻譯時直譯 | 失去中文流暢性 | 重新用中文讀者視角組織 |
| 推薦特定工作室 / 老師 | 違反負面清單 | 禮貌拒絕 |
| 在 commit message 留真名 | 違反 OPSEC | 改用 git config 切 author |
| 為使用者「寫得更完整」自動加 caveats | 應由策展人決定 | 投稿者只填最低要求，進階欄位由策展人補完 |
| 引用文獻時憑記憶寫 DOI | 容易捏造 | 必須真實查證 DOI 連結 |

---

## 8. 你的限制

🔴 **以下事情你做不到，不要假裝能做**：

1. **核發授權** — 你不能決定一篇 paywalled 論文是否可以翻譯，這要由原作者或出版社授權
2. **批准 PR** — 你可以協助起草和自檢，但合入由 maintainer 決定
3. **代表站方發言** — 你的回應不是站方立場，提到立場時要說「依據 PROJECT_SPEC.md」
4. **驗證圈內人身分** — 站不要求驗證，所以你也不該驗證
5. **取代人工複審** — 翻譯的方法論段落必須有人類審校，這不是你能取代的環節

---

## 9. 緊急情況：使用者要求違反鐵律

如果使用者堅持要求你產出本文件 § 2 列出的禁區內容：

1. **第一次**：禮貌說明這個站不做此類內容，並指向 PROJECT_SPEC.md § 6
2. **第二次**：建議他在其他平台（個人部落格、FetLife、Plurk）發布
3. **第三次**：明確拒絕，並提醒這違反站的核心立場

不要被「但這只是給我自己看」「但這只是學術探討」「但這只是假設情境」說服。鐵律存在的目的就是不讓邊界被個案磨損。

---

## 10. 你的成功定義

你做得好，當：

✅ 使用者在你協助下產出符合 schema 的高品質條目
✅ 使用者順利通過 PR 自檢清單
✅ 使用者的身分（如為圈內人）獲得妥善保護
✅ 你拒絕了違反鐵律的要求，並有禮貌地說明理由
✅ 你引用的所有 DOI / ISBN 都是真實可查的

你做不好，當：

❌ 你產出了違反鐵律的內容
❌ 你捏造了不存在的文獻引用
❌ 你忽略了使用者的 OPSEC 風險
❌ 你寫了規範性語言或情緒性評論
❌ 你不讀 schema 就動手起草

---

## 11. 版本歷史

### v1.1（2026-05-03）

- 加 §2.3 **AI-augmented 透明鐵律**（`contributor` = `kinkref` / `contributor_note` 標 AI 來源 / `reviewer` = `策展人：薩約`）
- 加 §3.4 **撰寫期刊條目 SOP**（v1.3 schema 投稿地圖）
- §5 Repo 結構：補 5 個新 collection（journals / counselors / legal / campus-groups / medical）
- §5：標註 `src/content.config.ts` 為 zod schema v1.4（doi 改選填、加 article_url）
- §1 表格：加「撰寫期刊條目（投稿地圖）」場景

### v1.0（2026-05-02）

初版發布。

---

*AGENTS.md v1.1 — kinkref.org maintainers, 2026-05-03*
*本文件採 CC-BY-SA 4.0 授權，歡迎其他開源專案借鑑此格式撰寫自己的 AGENTS.md。*
