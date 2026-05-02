# Content Schema — kinkref.org

> **給**：內容策展人、貢獻者、工程師
> **版本**：v1.2
> **最後更新**：2026-05-02
> **變更紀錄**：見[附錄 A](#附錄-a變更紀錄)

---

## 目錄

1. [Schema 版本管理](#一schema-版本管理)
2. [標籤系統](#二標籤系統全站共用)
3. [Slug 命名規則](#三slug-命名規則)
4. [共用欄位](#四共用欄位)
5. [術語條目 Schema](#五術語條目-schemaglossary-entry)
6. [書目條目 Schema](#六書目條目-schemabook-entry)
7. [論文條目 Schema](#七論文條目-schemapaper-entry)
8. [貢獻者提交格式](#八貢獻者提交格式)
9. [附錄 A：變更紀錄](#附錄-a變更紀錄)

---

## 一、Schema 版本管理

每筆條目須在 frontmatter 標記 `schema_version`，格式為 `1.1`、`1.2` 等。

| 變更類型 | 版號變動 | 範例 |
|---------|---------|------|
| 新增欄位（向後相容） | minor +1 | v1.0 → v1.1 |
| 棄用欄位但保留 | minor +1 | v1.1 → v1.2 |
| 移除欄位（破壞性） | major +1 | v1.x → v2.0 |
| 字串內容修正、註解、範例增補 | patch +1 | v1.1 → v1.1.1 |

舊版條目不強制升級，但**新建條目必須使用最新 minor 版**。重大版本升級會發 migration guide。

---

## 二、標籤系統（全站共用）

所有內容類型共用同一套標籤。標籤分兩個維度：

### 2.1 主題標籤（Topic Tags）

| 標籤 slug | 中文顯示名 | 說明 |
|-----------|-----------|------|
| `consent` | 同意框架 | SSC、RACK、PRICK、4Cs、Wheel of Consent |
| `psychopathology` | 病理化論辯 | DSM 歷史、去病理化文獻、心理健康研究 |
| `aftercare` | 事後照護 | Sub-drop、Top-drop、HPA 軸、aftercare 實踐 |
| `cross-cultural` | 跨文化比較 | 日美台差異、詞源學、文化譜系 |
| `harm-reduction` | 風險降低 | 神經損傷、窒息風險、身體安全 |
| `methodology` | 研究方法 | 抽樣、研究倫理、IRB、測量工具 |
| `legal` | 法律 | 台灣刑法、同意能力、傷害罪實務 |
| `neuroscience` | 神經科學 | 內啡肽、壓力—激發研究、生理機制 |
| `identity` | 身分認同 | 性身分、自我概念、標籤使用 |
| `relationship-dynamics` | 關係動態 | D/s 結構、TPE、協商、Protocol |
| `gender-sexuality` | 性別與性傾向 | 酷兒研究、性別研究中的 BDSM |
| `subculture-ethnography` | 次文化民族誌 | Newmahr、Weiss 等社群文化研究 |
| `practice-specific` | 特定實踐研究 | 針對特定 practice 的學術研究（如 rope-stress） |
| `history` | 歷史與譜系 | Old Guard、Leather 文化、台灣圈內史 |

> **v1.1 變更**：移除 `glossary` 標籤（對術語條目永真冗餘）；新增 `gender-sexuality`、`subculture-ethnography`、`practice-specific`。

### 2.2 讀者標籤（Reader Tags）

| 標籤 slug | 中文顯示名 | 說明 |
|-----------|-----------|------|
| `beginner` | 入門者 | 無前置知識可讀 |
| `practitioner` | 實踐者 | 有基礎認識的圈內人 |
| `researcher` | 研究者 | 學術研究用途 |
| `clinical` | 臨床專業 | 心理師、醫師、社工 |
| `legal-pro` | 法律專業 | 律師、法律研究者 |
| `educator` | 教育工作者 | 性教育、學校老師、講師 |
| `media` | 媒體 | 記者、內容創作者 |
| `policy-maker` | 政策相關者 | 碰政策但非法律專業者 |
| `loved-ones` | 親密他人 | 圈內人的伴侶、朋友、家人 |

> **v1.1 變更**：`partner-family` 改為 `loved-ones`（避免「家屬」一詞的病理化聯想）；新增 `educator`、`policy-maker`。

### 2.3 標籤使用規則

- 每筆內容**至少 1 個主題標籤、至少 1 個讀者標籤**
- 主題標籤上限 **4 個**（避免稀釋）
- 讀者標籤上限 **3 個**
- 標籤由策展人賦予，**不開放投稿者自行新增標籤**
- 若需新增標籤，請開 Issue 提案，由主編審核

---

## 三、Slug 命名規則

所有條目使用 URL-safe slug 作為檔名與內部識別。

### 3.1 通用規則

- 全部 lowercase
- 單詞間用 hyphen `-` 分隔（**不用** underscore `_`）
- 只允許 `[a-z0-9-]`
- 不以數字開頭（除非是年份前綴的論文）
- 長度建議 ≤40 字元

### 3.2 各類條目的 slug 規則

| 類型 | 規則 | 範例 |
|------|------|------|
| 術語 | 英文原詞 lowercase | `dominant.md` / `submissive.md` / `aftercare.md` |
| 多詞術語 | 連字號分隔 | `total-power-exchange.md` / `safe-word.md` |
| 論文 | 第一作者姓氏 + 年份 | `wismeijer-2013.md` / `moser-2006.md` |
| 同作者同年 | 加 a/b/c 後綴 | `connolly-2006a.md` / `connolly-2006b.md` |
| 書目 | 主標題的核心 slug | `sm101.md` / `different-loving.md` / `topping-book.md` |
| 多版本書目 | 加版本 | `sm101-2nd.md`（僅在第二版內容大幅修改時） |

### 3.3 衝突處理

- 如果新術語與現有 slug 衝突，新增者用 `term-disambig.md` 形式（如 `master-bdsm.md` 區別於潛在的 `master-degree.md`）
- 論文若同姓作者同年同期刊，用更明確 prefix（如 `connolly-jphs-2006.md`）

---

## 四、共用欄位

以下欄位在多種條目中共用，集中定義以避免重複。

### 4.1 `citations`（站內外引用）

選填，用於標記與其他條目或外部文獻的關聯。

```yaml
citations:
  - type: internal-paper       # 站內論文
    ref: wismeijer-2013         # 對應的 slug
    note: "對 Dominant 人格特質的實證研究"
  
  - type: internal-book        # 站內書目
    ref: different-loving
    note: "Brame 對 Dom/Master 區別的早期社群觀察"
  
  - type: internal-term        # 站內術語
    ref: submissive
    note: "本術語的對偶角色"
  
  - type: external             # 站外文獻
    apa: "Connolly, P. H. (2006). Psychological functioning of bondage/domination/sado-masochism (BDSM) practitioners. Journal of Psychology & Human Sexuality, 18(1), 79-120."
    doi: "https://doi.org/10.1300/J056v18n01_05"
    note: "Dominant/Submissive 心理健康比較研究"
```

`type` enum：`internal-paper` / `internal-book` / `internal-term` / `external`

### 4.2 `external_references`（外部標準對應）

選填，用於對應其他平台的標準分類。取代 v1.0 的 `bdsmtest_archetype` 欄位。

```yaml
external_references:
  - source: bdsmtest.org
    name: "Dominant"
  - source: wikipedia
    url: "https://en.wikipedia.org/wiki/Dominance_and_submission"
  - source: fetlife
    name: "Dominant"
```

`source` 開放枚舉：`bdsmtest.org` / `wikipedia` / `fetlife` / `psychology-today` 等。

### 4.3 `caveats`（注意事項）

選填，用於記錄方法論限制、文化語境、爭議立場等需要讀者預先知道的內容。

```yaml
caveats:
  - type: methodology
    note: "樣本來自荷蘭 BDSM 社群網路，可能高估實踐者的心理健康水準"
  - type: cultural-context
    note: "本研究在歐美語境下進行，台灣讀者引用時需考慮文化差異"
  - type: dated
    note: "資料蒐集時間為 2010 年代初，部分變項可能已不適用當代社群"
```

`type` enum：`methodology` / `cultural-context` / `dated` / `controversy` / `legal-context`

### 4.4 `audience_warning`（敏感內容提示）

選填，用於提示含有敏感案例描述的條目。

```yaml
audience_warning:
  - "包含真實 abuse 案例的詳細描述"
  - "包含臨床訪談中的創傷敘事"
```

### 4.5 `last_reviewed`（最後審校日期）

**必填**（v1.0 為選填，v1.1 改為必填）。
格式：`YYYY-MM-DD`。
用途：內容老化追蹤。建議每 24 個月主動重新審校核心條目。

### 4.6 `contributor_note`（貢獻者註腳）

**選填**（v1.2 新增）。
格式：純文字字串（中文，≤80 字）。
用途：在 `contributor` 欄位之外提供額外說明，例如標示 AI 生成、合作模式、特殊產製方式等。

```yaml
# 站方 AI 生成條目的標準格式：
contributor: kinkref
contributor_note: "本條目由 AI 心理學家 Agent 繆思（Muse）生成"

# 經人類審校的條目：
contributor: kinkref
contributor_note: "本條目由 AI 心理學家 Agent 繆思（Muse）生成"
reviewer: 策展人：薩約
```

**設計意圖**：
- 對讀者透明標示「初稿是 AI 生成」，符合 AI-augmented 內容的學術倫理
- `contributor_note` 與 `contributor` 分離，讓 `contributor` 保持為短身分名（便於 citations 引用）
- `reviewer` 欄位獨立表示「有人類審校」，不需在 `contributor_note` 中重複此資訊

---

## 五、術語條目 Schema（Glossary Entry）

### 5.1 欄位規格

| 欄位名 | 必填 | 格式 | 說明 |
|--------|------|------|------|
| `schema_version` | ✅ | 純文字 | 條目使用的 schema 版本（如 `1.1`） |
| `term_zh` | ✅ | 純文字 | 中文主標 |
| `term_en` | ✅ | 純文字 | 英文原文（標準拼法） |
| `term_ja` | ❌ | 純文字 | 日文對應詞（如 緊縛） |
| `term_alt_zh` | ❌ | 純文字列表 | 其他中文譯名（用「;」分隔） |
| `aliases_en` | ❌ | 純文字列表 | 英文別稱（如 sub / submissive） |
| `tagline` | ✅ | 純文字，≤30 字 | 一句話定義，給快速查閱用 |
| `definition` | ✅ | Markdown，150-400 字 | 正文定義（見篇幅規範） |
| `disambiguation` | ❌ | 結構化列表 | 與相近術語的辨析（見 5.2） |
| `usage_notes` | ❌ | Markdown，≤200 字 | 不同社群的用法差異 |
| `controversies` | ❌ | Markdown，≤200 字 | 該術語的爭議點（如殖民意涵） |
| `origin_year` | ❌ | YYYY 或 YYYY-YYYY | 詞彙首見或流行年代 |
| `first_source` | ❌ | APA 格式字串 | 首見文獻；社群口傳可標「圈內口傳」 |
| `first_source_doi` | ❌ | DOI URL | 首見文獻的 DOI |
| `related_terms` | ❌ | slug 列表 | 相關術語的 slug，用於交叉連結 |
| `external_references` | ❌ | 結構化列表 | 外部標準對應（見 4.2） |
| `citations` | ❌ | 結構化列表 | 站內外引用（見 4.1） |
| `topic_tags` | ✅ | slug 列表（1-4 個） | 主題標籤 |
| `reader_tags` | ✅ | slug 列表（1-3 個） | 讀者標籤 |
| `contributor` | ✅ | 圈名或 GitHub handle | 初稿撰寫者 |
| `contributor_note` | ❌ | 純文字 | 貢獻者註腳，標示 AI 生成等（v1.2 新增，見 4.6） |
| `reviewer` | ❌ | 圈名或 GitHub handle | 審校者 |
| `created_date` | ✅ | YYYY-MM-DD | 條目建立日期 |
| `last_reviewed` | ✅ | YYYY-MM-DD | 最後審校日期（v1.1 改為必填） |
| `revision_history` | ❌ | 結構化列表 | 條目迭代記錄（見 5.3） |

### 5.2 `disambiguation` 結構

```yaml
disambiguation:
  - vs: Sadist
    note: |
      Dominant 描述的是關係中的角色傾向（主導），Sadist 描述的是
      從施加痛苦中獲得愉悅的傾向。一個人可以是 Dominant 但非 Sadist，
      或 Sadist 但非 Dominant。
  - vs: Top
    note: |
      Top 是場景中的「動作執行方」，Dominant 是關係/動態中的「主導角色」。
      Service top 即為「Top 但非 Dominant」的典型案例。
```

**規範**：
- 每條 ≤ 100 字
- 整個 disambiguation 區塊總計 ≤ 500 字
- `vs` 欄位填英文標準術語名

### 5.3 `revision_history` 結構

```yaml
revision_history:
  - date: 2026-05-02
    version: 1.0
    by: "[圈名]"
    note: "初稿"
  - date: 2026-08-15
    version: 1.1
    by: "[圈名]"
    note: "新增 disambiguation 區塊；修正 origin_year"
```

### 5.4 篇幅規範：術語定義本文（150-400 字）

**結構（依序）**：
1. **核心定義**（80-150 字）：這個詞是什麼，盡量不用被定義的詞本身，語氣中性
2. **脈絡說明**（60-150 字）：使用情境、跟相關詞的區別（簡略，詳細辨析放 disambiguation）
3. **來源說明**（30-100 字，選填）：詞彙從哪裡來、何時開始流行

**語氣原則**：
- 中性描述，不評價哪種傾向「正確」或「進階」
- 避免「只有⋯才算是」「真正的⋯應該」等規範性語言
- 允許「某些人使用此詞時⋯，另一些人則⋯」的多元描述

**不寫**：個人實踐經驗、安全指引、操作說明。

### 5.5 範例條目（Dominant）

```yaml
schema_version: "1.1"
term_zh: 支配者
term_en: Dominant
aliases_en: Dom; Domme
term_alt_zh: 主動方; D
tagline: 在 BDSM 動態中擔任主導、掌控方角色的人。
definition: |
  Dominant 是在 BDSM 關係或場景中選擇擔任主導角色的人。其角色通常
  包括設定場景框架、引導互動進行，以及在雙方協商的範圍內對另一方
  （通常稱為 submissive）施加控制或影響。
  
  Dominant 與 submissive 的關係建立在雙方知情同意的基礎上，控制的邊界
  由協商決定，而非單方面強加。Dominant 這個詞本身不預設性別、性向或
  特定的 BDSM 實踐形式——支配可以發生在任何關係類型和實踐風格中。
  
  Dominant 有時縮寫為「Dom」（男性或中性）或「Domme」（女性），
  但這些縮寫並無一致的業界標準，使用者各有偏好。

disambiguation:
  - vs: Sadist
    note: |
      Dominant 描述的是關係角色傾向（主導），Sadist 描述的是從施加
      痛苦中獲得愉悅的傾向。兩者可獨立存在或重疊。
  - vs: Top
    note: |
      Top 是場景中的動作執行方，Dominant 是關係/動態中的主導角色。
      Service top（執行方但非主導方）是兩者分離的典型案例。
  - vs: Master
    note: |
      Master 通常指 24/7 或 TPE（Total Power Exchange）結構下的長期
      權力交換對象，Dominant 是更通用、可涵蓋場景型動態的稱謂。

usage_notes: |
  在台灣中文圈，「Dom」常作為日常稱呼，「支配者」一詞較常出現在
  學術或翻譯文獻中。「老師」「先生」等中文敬稱在某些社群中也被
  作為 Dom 的替代稱謂使用。

origin_year: "1990s"
related_terms: [submissive, switch, master, top, sadist]
external_references:
  - source: bdsmtest.org
    name: "Dominant"
  - source: wikipedia
    url: "https://en.wikipedia.org/wiki/Dominance_and_submission"
citations:
  - type: internal-paper
    ref: wismeijer-2013
    note: "對 Dominant 傾向者人格特質的實證研究"
topic_tags: [identity, relationship-dynamics]
reader_tags: [beginner, practitioner]
contributor: "[圈名]"
created_date: 2026-05-02
last_reviewed: 2026-05-02
```

---

## 六、書目條目 Schema（Book Entry）

### 6.1 欄位規格

| 欄位名 | 必填 | 格式 | 說明 |
|--------|------|------|------|
| `schema_version` | ✅ | 純文字 | 條目使用的 schema 版本 |
| `title` | ✅ | 純文字 | 原文書名 |
| `title_zh` | ❌ | 純文字 | 中文譯名（若有正式中譯本） |
| `author` | ✅ | 純文字列表 | 作者（多作者用「;」分隔） |
| `translator` | ❌ | 純文字 | 中譯本譯者 |
| `year` | ✅ | YYYY | 原文出版年 |
| `year_zh_translation` | ❌ | YYYY | 中譯本出版年 |
| `publisher` | ✅ | 純文字 | 原文出版社 |
| `publisher_zh` | ❌ | 純文字 | 中譯本出版社 |
| `isbn` | ❌ | ISBN-13 | |
| `editions` | ❌ | 結構化列表 | 多版本記錄（見 6.2） |
| `language` | ✅ | 語言代碼 | 原文語言（`en` `ja` `zh` 等） |
| `has_zh_translation` | ✅ | boolean | 是否有中文譯本 |
| `out_of_print` | ❌ | boolean | 是否絕版（影響取得方式） |
| `book_type` | ✅ | enum | `academic` / `popular` / `fiction` / `memoir` / `reference` |
| `topic_tags` | ✅ | slug 列表（1-4 個） | 主題標籤 |
| `reader_tags` | ✅ | slug 列表（1-3 個） | 讀者標籤 |
| `difficulty` | ✅ | enum | `entry` / `intermediate` / `advanced` |
| `abstract_zh` | ✅ | Markdown，100-300 字 | 策展人中文書摘 |
| `curator_note` | ✅ | 純文字，1-5 句 | 策展人推薦語 |
| `recommended_chapters` | ❌ | 結構化列表 | 推薦章節（見 6.3） |
| `access_links` | ❌ | 結構化列表 | 取得方式（見 6.4） |
| `caveats` | ❌ | 結構化列表 | 注意事項（見 4.3） |
| `audience_warning` | ❌ | 字串列表 | 敏感內容提示（見 4.4） |
| `citations` | ❌ | 結構化列表 | 站內外引用（見 4.1） |
| `contributor` | ✅ | 圈名或 GitHub handle | |
| `reviewer` | ❌ | 圈名或 GitHub handle | |
| `created_date` | ✅ | YYYY-MM-DD | |
| `last_reviewed` | ✅ | YYYY-MM-DD | 最後審校日期（v1.1 改為必填） |

### 6.2 `editions` 結構

```yaml
editions:
  - version: "1st"
    year: 1996
    isbn: "978-1881943129"
    note: "初版，已絕版"
  - version: "2nd"
    year: 2001
    isbn: "978-1881943143"
    note: "增補版，目前流通版本"
```

### 6.3 `recommended_chapters` 結構

```yaml
recommended_chapters:
  - chapter: "Chapter 3: Negotiation"
    pages: "45-72"
    note: "本書最具實務參考價值的部分"
  - chapter: "Chapter 7: Aftercare"
    pages: "143-160"
    note: "可獨立閱讀"
```

### 6.4 `access_links` 結構（v1.1 結構化）

```yaml
access_links:
  - type: amazon
    url: "https://www.amazon.com/..."
    note: "Kindle 版可購買"
  - type: openlibrary
    url: "https://openlibrary.org/..."
    note: "可線上免費借閱"
  - type: bookstore-tw
    url: "https://www.books.com.tw/..."
    note: "博客來繁體中文版"
  - type: library
    url: "https://www.worldcat.org/..."
    note: "查詢圖書館館藏"
```

`type` 開放枚舉：`amazon` / `openlibrary` / `bookstore-tw` / `library` / `publisher` / `archive-org` / `other`

### 6.5 篇幅規範：書摘（100-300 字）+ 策展人推薦語（1-5 句）

**書摘結構**：
1. 主要論點或內容（1-2 句）
2. 採用的方法或視角（1 句）
3. 在領域中的位置（1 句）

**策展人推薦語格式**：嵌在書摘後，以 `*策展人註：⋯⋯*` 開頭。

內容包含：
- 適合誰讀
- 閱讀建議（前置閱讀、需要的基礎）
- 必要時的限制說明

---

## 七、論文條目 Schema（Paper Entry）

### 7.1 欄位規格

| 欄位名 | 必填 | 格式 | 說明 |
|--------|------|------|------|
| `schema_version` | ✅ | 純文字 | |
| `title` | ✅ | 純文字 | 英文論文標題 |
| `authors` | ✅ | 純文字列表 | 作者（Last, F. 格式，「;」分隔） |
| `year` | ✅ | YYYY | 發表年份 |
| `journal` | ✅ | 純文字 | 期刊名稱 |
| `volume` | ❌ | 純文字 | |
| `issue` | ❌ | 純文字 | |
| `pages` | ❌ | 純文字 | |
| `doi` | ✅ | DOI URL | |
| `access_type` | ✅ | enum | 見 7.2 |
| `oa_type` | ❌ | enum | OA 細分類（見 7.2） |
| `preprint_url` | ❌ | URL | PsyArXiv / SSRN / 作者個人頁 |
| `study_type` | ✅ | enum | 見 7.3 |
| `methodology_keywords` | ❌ | 字串列表 | 方法關鍵字（見 7.4） |
| `sample_size` | ❌ | 整數或字串 | 樣本數（質性研究可填「N=15」「8 訪談」等） |
| `sample_population` | ❌ | 純文字 | 樣本來源描述 |
| `original_abstract` | ❌ | 純文字 | 原文 abstract（fair use 範圍內保留） |
| `translation_status` | ✅ | enum | 見 7.5 |
| `translation_url` | ❌ | 站內 URL | 指向全文翻譯頁 |
| `topic_tags` | ✅ | slug 列表（1-4 個） | |
| `reader_tags` | ✅ | slug 列表（1-3 個） | |
| `difficulty` | ✅ | enum | `entry` / `intermediate` / `advanced` |
| `abstract_zh` | ✅ | Markdown，150-400 字（review/meta 可 ≤500） | 策展人中文摘要 |
| `curator_note` | ✅ | 純文字，1-5 句 | 策展人導讀 |
| `caveats` | ❌ | 結構化列表 | 注意事項（見 4.3） |
| `audience_warning` | ❌ | 字串列表 | 敏感內容提示 |
| `replication_status` | ❌ | enum | 見 7.6 |
| `corrigenda` | ❌ | URL | 勘誤連結 |
| `citations` | ❌ | 結構化列表 | 站內外引用（見 4.1） |
| `contributor` | ✅ | 圈名或 GitHub handle | |
| `reviewed_by` | ❌ | 圈名或 GitHub handle | 方法論段落審校者 |
| `created_date` | ✅ | YYYY-MM-DD | |
| `last_reviewed` | ✅ | YYYY-MM-DD | （v1.1 改為必填） |

### 7.2 `access_type` 與 `oa_type`

`access_type`（必填，大類）：
- `open-access` — 任何形式的開放取用
- `paywalled` — 需付費或機構訂閱
- `preprint-available` — 期刊版需付費，但有合法 preprint

`oa_type`（選填，OA 細分）：
- `gold` — 期刊本身是 OA 期刊
- `green` — 作者自存的 preprint/postprint
- `bronze` — 出版社臨時釋出（無正式 OA license）
- `hybrid` — 訂閱期刊中的個別 OA 文章
- `diamond` — 對讀者作者皆免費的 OA 期刊

### 7.3 `study_type` enum

| 值 | 說明 |
|---|------|
| `quantitative` | 量化研究 |
| `qualitative` | 質性研究 |
| `mixed-methods` | 混合方法 |
| `theoretical` | 理論論述 / 概念論文 |
| `review` | 一般文獻綜述 |
| `systematic-review` | 系統性綜述 |
| `meta-analysis` | 後設分析 |
| `case-study` | 案例研究 |
| `ethnography` | 民族誌 |
| `commentary` | 評論 / 回應 |

### 7.4 `methodology_keywords`

開放標籤，常見值：
- `online-survey` / `paper-survey`
- `semi-structured-interview` / `unstructured-interview`
- `focus-group`
- `participant-observation`
- `content-analysis` / `discourse-analysis`
- `cross-sectional` / `longitudinal`
- `experimental` / `quasi-experimental`

### 7.5 `translation_status` enum

| 值 | 說明 |
|---|------|
| `full-translation` | 全文翻譯已完成 |
| `partial-translation` | 部分翻譯（如譯了 abstract + intro） |
| `abstract-only` | 僅有策展摘要（中文，非原文翻譯） |
| `planned` | 已排入翻譯計畫 |
| `none` | 無翻譯計畫 |

### 7.6 `replication_status` enum

| 值 | 說明 |
|---|------|
| `replicated` | 已被獨立研究複製 |
| `partially-replicated` | 部分結果被複製 |
| `failed-replication` | 後續複製失敗 |
| `disputed` | 結果有重大爭議 |
| `unknown` | 尚未檢索或無相關後續研究 |

### 7.7 篇幅規範：論文摘要（150-400 字，review/meta 可 ≤500）+ 策展人導讀（1-5 句）

**論文中文摘要結構**（重新用中文讀者視角撰寫，**非直譯**）：
1. 研究問題（1-2 句）
2. 方法概述（1-2 句，技術細節可簡化）
3. 主要發現（2-4 句）
4. 意義（1 句）

**策展人導讀格式**：嵌在摘要後，以 `*策展人導讀：⋯⋯*` 開頭。

內容包含：
- 前置建議
- 注意事項（方法論段落跳讀建議等）
- 與其他文獻的關係

### 7.8 範例條目（Wismeijer & van Assen, 2013）

```yaml
schema_version: "1.1"
title: "Psychological Characteristics of BDSM Practitioners"
authors: "Wismeijer, A. A. J.; van Assen, M. A. L. M."
year: 2013
journal: "Journal of Sexual Medicine"
volume: "10"
issue: "8"
pages: "1943-1952"
doi: "https://doi.org/10.1111/jsm.12192"
access_type: paywalled
preprint_url: null
study_type: quantitative
methodology_keywords:
  - online-survey
  - cross-sectional
  - case-control
sample_size: "1336 (BDSM 902 / 對照組 434)"
sample_population: "荷蘭 BDSM 社群網路招募 + 一般網路招募對照"
original_abstract: |
  In this study, the differences between BDSM practitioners (N = 902) 
  and a control group (N = 434) were investigated...
  (原文 abstract 完整保留，策展人視 fair use 邊界決定收錄與否)
translation_status: abstract-only
topic_tags: [psychopathology, identity, methodology]
reader_tags: [researcher, clinical, beginner]
difficulty: intermediate
abstract_zh: |
  本研究比較了 902 位 BDSM 實踐者與 434 位非 BDSM 對照組在人格特質
  和心理健康指標上的差異。研究透過荷蘭 BDSM 社群網路招募樣本，
  以標準化心理測量工具評估神經質、外向性、開放性、宜人性、盡責性
  （大五人格）及主觀幸福感。
  
  結果顯示，BDSM 實踐者在多數指標上的心理健康狀況優於或等同於
  非 BDSM 群體——神經質較低、主觀幸福感較高、對新經驗的開放性較強。
  Dominant 傾向者在宜人性和盡責性上得分較低，Submissive 傾向者
  則無顯著差異。
  
  本研究是支持「BDSM 實踐者心理健康並無異於一般人」這一論點的
  重要實證文獻之一，常被引用為反對 BDSM 病理化的學術基礎。

curator_note: |
  策展人導讀：這篇是入門文獻推薦清單的必讀之一，適合想以學術語言
  說明「BDSM 不是心理疾病」的讀者。方法論段落可直接跳到 Results 
  和 Discussion。建議搭配 Connolly（2006）一起讀以建立更完整的
  文獻脈絡。

caveats:
  - type: methodology
    note: "樣本來自荷蘭 BDSM 社群網路，可能高估實踐者的心理健康水準（self-selection bias）"
  - type: cultural-context
    note: "歐洲樣本，台灣讀者引用時需考慮文化差異"

replication_status: partially-replicated

citations:
  - type: external
    apa: "Connolly, P. H. (2006). Psychological functioning of bondage/domination/sado-masochism (BDSM) practitioners. Journal of Psychology & Human Sexuality, 18(1), 79-120."
    doi: "https://doi.org/10.1300/J056v18n01_05"
    note: "另一個指標性的去病理化研究"

contributor: "[圈名]"
created_date: 2026-05-02
last_reviewed: 2026-05-02
```

---

## 八、貢獻者提交格式

詳見 `CONTRIBUTING.md`。本節定義**提交資料的最小可接受格式**。

### 8.1 術語投稿最低要求

必填欄位中，投稿者至少需提供：
- `term_zh`、`term_en`、`tagline`、`definition`
- `topic_tags`（至少 1 個）、`reader_tags`（至少 1 個）

其餘欄位（`disambiguation`、`citations`、`external_references` 等）為**進階欄位**。投稿者可省略，由策展人補完。

### 8.2 書目投稿最低要求

- `title`、`author`、`year`、`book_type`、`language`、`has_zh_translation`
- `abstract_zh` 或 說明「我無法撰寫摘要，請策展人撰寫」

策展人可補完其他欄位，但**不會代投稿者撰寫整份條目**。

### 8.3 論文投稿最低要求

- `title`、`authors`、`year`、`doi`、`study_type`
- `abstract_zh` 或說明「我無法撰寫摘要」

若提供 DOI，策展人可自行取得 metadata。若連摘要都無法撰寫，條目進入「待策展」佇列。

### 8.4 策展人接手流程

當投稿者僅提供最低要求時：
1. 策展人於 1-2 週內補完進階欄位
2. 投稿者列為 `contributor`，策展人列為 `reviewer`
3. 條目首發版本標記 `revision_history` 為「策展補完」
4. 投稿者可在後續迭代提出修改建議

---

## 附錄 A：變更紀錄

### v1.2（2026-05-02）

**新增欄位**：
- `contributor_note`（共用，選填）：貢獻者註腳，主要用於標示 AI 生成等特殊產製方式（見 §4.6）

**設計動機**：
- 站方採用 `contributor: kinkref` 作為條目歸屬，但需要對讀者透明標示「初稿是 AI 生成」
- `contributor_note` 與 `contributor` 分離，讓 `contributor` 保持為短身分名（便於 citations 引用），`contributor_note` 容納自由文字說明

**站方使用慣例**：
```yaml
# 純 AI 生成條目（多數）：
contributor: kinkref
contributor_note: "本條目由 AI 心理學家 Agent 繆思（Muse）生成"

# 經策展人薩約審校的條目：
contributor: kinkref
contributor_note: "本條目由 AI 心理學家 Agent 繆思（Muse）生成"
reviewer: 策展人：薩約
```

**遷移**：v1.1 條目向後相容，`contributor_note` 是選填。

### v1.1（2026-05-02）

**Bug 修正**：
- 移除 v1.0 範例中不存在的 `preprint_available` 欄位
- 移除 `glossary` topic tag（對術語條目永真冗餘）

**標籤系統調整**：
- 主題標籤新增：`gender-sexuality`、`subculture-ethnography`、`practice-specific`
- 讀者標籤新增：`educator`、`policy-maker`
- 讀者標籤更名：`partner-family` → `loved-ones`

**新增章節**：
- 第一節：Schema 版本管理
- 第三節：Slug 命名規則
- 第四節：共用欄位（citations / external_references / caveats / audience_warning / last_reviewed）

**術語條目新增欄位**：
- `disambiguation`（結構化辨析）
- `usage_notes`（使用差異）
- `controversies`（爭議）
- `aliases_en`（英文別稱）
- `external_references`（取代並擴展 v1.0 的 `bdsmtest_archetype`）
- `revision_history`（迭代記錄）

**書目條目新增欄位**：
- `translator`、`year_zh_translation`、`publisher_zh`
- `editions`（多版本）
- `out_of_print`（絕版狀態）
- `recommended_chapters`（推薦章節）
- `caveats`、`audience_warning`
- `access_links` 改為結構化列表

**論文條目新增欄位**：
- `study_type`（必填，研究類型）
- `methodology_keywords`（方法關鍵字）
- `sample_size`、`sample_population`
- `original_abstract`（原文 abstract）
- `oa_type`（OA 細分類）
- `caveats`、`audience_warning`
- `replication_status`（複製狀態）
- `corrigenda`（勘誤連結）

**篇幅放寬**：
- 術語 definition：150-300 → 150-400 字
- 書摘 abstract_zh：100-200 → 100-300 字
- 論文 abstract_zh：150-250 → 150-400 字（review/meta-analysis 可 ≤500）
- curator_note：2-3 句 → 1-5 句

**必填變更**：
- `last_reviewed`：選填 → 必填
- 論文 `study_type`：新增為必填

**translation_status 擴展**：
- 新增 `partial-translation` 選項

### v1.0（2026-05-02）

初版發布。

---

*Content Schema v1.1 — 靈範師 (Muse) 制定，2026-05-02*
