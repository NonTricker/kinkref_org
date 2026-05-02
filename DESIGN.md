# Design System — kinkref.org

> **Mood**: The Reference Press（學術書院）
> **Curated by**: 光影師 艾莉兒（Designer Visual Ariel）
> **Standard**: VoltAgent / awesome-design-md (9-section）
> **Last Updated**: 2026-05-02
> **License**: CC-BY-SA 4.0（與站本體一致）

---

## 1. Visual Theme & Atmosphere — 視覺基調

kinkref.org 的視覺氛圍，是一本被翻舊的精裝辭典，攤開在橡木閱覽桌上，旁邊放著一杯熱咖啡。它不是新聞站、不是 SaaS dashboard、不是社群平台——它是**沒有門衛的圖書館之門**。任何人都可以走進來，不被盤問、不被分類、不被推銷，靜靜地找到他們需要的東西，再帶著更清晰的認知離開。

這個站對標的是 **Stanford Encyclopedia of Philosophy**、**MDN Web Docs（reader mode）**、**The Atlantic 長文版面**——學術權威、長文友善、零視覺噪音。它**不**對標任何 BDSM 圈內視覺：沒有皮革、沒有繩索、沒有霓虹、沒有暗室紅光。視覺合法性不靠主題渲染，靠**typographic restraint**（排版克制）與**editorial density**（編輯密度）建立。

簽名動作是**「紙紋三層」**：奶油紙白（`#FAF7F2`）作為全站底色，襯線中英並排（Noto Serif TC + Source Serif 4）作為閱讀層，古典酒紅（`#7A1D1D`）作為**唯一**的情感 accent——它出現在連結 hover、首字下沉、引用塊邊條，不出現在按鈕底色或裝飾紋路。次要 accent 是青銅金（`#8C6A2F`），專為 DOI、APA 引用、open-access 標記服務。整個站的色彩規則是：**色彩不傳達情緒，色彩傳達引用層級**。

### Key Characteristics

- 奶油紙白底色（非冷白、非螢光白），長時間閱讀不刺眼
- 中英並列雙襯線（Noto Serif TC + Source Serif 4）—— 所有 long-form 內容皆襯線
- UI 層用無襯線（Noto Sans TC + Inter）製造對比，但占比極低
- **單一情感色**（酒紅 `#7A1D1D`）+ 引用色（青銅 `#8C6A2F`），其餘全部灰階
- 內文最大寬度鎖定 **65ch (~720px)**，強制長文閱讀紀律
- **零陰影、零漸層、零 glassmorphism**——深度只靠 1px 紙紋邊框（`#D8CFC2`）與背景明度差
- 圓角極克制：`0` 為主，`2px` 為輔，最大不超過 `4px`（按鈕/卡片）
- 首字下沉（drop cap）用酒紅，僅出現在術語條目主定義段首
- 深色模式不是純黑，是**墨綠灰底**（`#161A18`）+ 暖白字（`#E8E2D6`），維持「夜讀檯燈」氣質

### Anti-Patterns（明確禁區）

- ❌ 任何 BDSM 視覺意象（皮革紋、繩索、鎖鏈、暗紅燈、皮鞭剪影）
- ❌ 漸層、glassmorphism、neumorphism、glow、blur 背景
- ❌ Hero banner 圖片、stock photo、人物頭像
- ❌ 圓角 ≥ 8px 的 SaaS 卡片風
- ❌ 紫色系（圈內口語的「紫色」聯想）、霓虹螢光色
- ❌ Emoji 作為 UI 元件（標記用文字或細描線 SVG icon）

---

## 2. Color Palette & Roles — 色彩規範

### Primary (Editorial Ink) — 主編輯墨色

- **Paper Cream** (`#FAF7F2`)：全站預設底色，奶油紙白。長時間閱讀的視網膜舒適區。任何時候都不可被替換為純白。
- **Card White** (`#FFFFFF`)：卡片、術語條目、文獻條目的浮起層。永遠搭配 1px `#D8CFC2` 邊框，用「明度差 + hairline」取代陰影。
- **Page Ink** (`#1C1A17`)：墨黑棕，所有 H1/H2/H3 與內文主色。比純黑暖、比 `#000` 軟，源自老印刷油墨的色相。
- **Faded Ink** (`#5C544A`)：褪墨灰，metadata、引用作者年份、麵包屑。帶赭色調，與 Page Ink 同色系。
- **Muted Ink** (`#8B8275`)：淺褪墨，禁用態、極次要 metadata、placeholder。

### Secondary (Editorial Voice) — 編輯之聲

- **Reference Crimson** (`#7A1D1D`)：古典酒紅，**全站唯一情感色**。用於：
  - 連結 hover 文字色（default 連結保持 ink，underline 為主視覺信號）
  - 術語條目主定義段首字下沉
  - 引用塊（blockquote）左側 3px 實心邊條
  - 「最近更新」徽章
  - Age Gate 確認按鈕
  - **絕不**用作背景填色或大面積色塊
- **Bronze Citation** (`#8C6A2F`)：青銅金，學術引用專屬色。用於：
  - DOI 連結文字色
  - APA 引用塊內的標題色
  - 「Open Access」徽章描邊
  - 「首見文獻」標記
  - 翻譯狀態 badge

### Surface & Background — 表面與背景

- **Paper Cream** (`#FAF7F2`)：站體背景。
- **Card White** (`#FFFFFF`)：條目卡、術語頁、文獻頁主內容區。
- **Subtle Tint** (`#F2EDE4`)：sidebar、metadata 側欄、二級背景。比 Paper Cream 略深一階。
- **Footer Earth** (`#2C2823`)：footer 區唯一深色塊，配 `#E8E2D6` 文字。

### Neutrals & Text — 中性與文字

| Role | Token | Hex |
|---|---|---|
| Heading Ink | `--ink-heading` | `#1C1A17` |
| Body Ink | `--ink-body` | `#1C1A17` |
| Metadata Ink | `--ink-meta` | `#5C544A` |
| Disabled Ink | `--ink-disabled` | `#8B8275` |
| Hairline Rule | `--rule-fine` | `#D8CFC2` |
| Section Rule | `--rule-section` | `#1C1A17` |

### Semantic & Accent — 語義色

學術站刻意**不**使用一般 SaaS 的 success/error/warning palette。狀態傳達靠**文字標籤 + 銅金徽章**，不靠顏色情緒。

- **Open Access** (`#5A7A3D`, 苔蘚綠)：僅用於「Open Access」徽章描邊與小圓點，飽和度極低。
- **Paywalled** (`#8B6F47`, 沙赭色)：「Paywalled」徽章，提醒用戶需要訪問權。
- **Translation Available** (`#8C6A2F`, 銅金)：「有全文翻譯」徽章。
- **Maintainer Lock** (`#5C544A`, 褪墨)：「Maintainer-locked section」標記，不喚起任何情緒。

### Gradient System — 漸層系統

**無**。整站零漸層。深度只能由 1px 紙紋邊框、背景明度差、與 typographic weight 表達。任何 `linear-gradient` 或 `radial-gradient` 出現在 chrome 中，都違反 Iron Law #4（Kill the AI Slop）。

### Dark Mode — 夜讀模式

夜讀檯燈氣質，不是工程黑。

| Role | Light | Dark |
|---|---|---|
| `--bg-base` | `#FAF7F2` | `#161A18` |
| `--bg-elevated` | `#FFFFFF` | `#1F2421` |
| `--bg-subtle` | `#F2EDE4` | `#22272A` |
| `--ink-body` | `#1C1A17` | `#E8E2D6` |
| `--ink-meta` | `#5C544A` | `#A8A095` |
| `--accent-primary` | `#7A1D1D` | `#C25555` |
| `--accent-citation` | `#8C6A2F` | `#C9A65A` |
| `--rule-fine` | `#D8CFC2` | `#3A3F3C` |

---

## 3. Typography Rules — 字體規範

### Font Family

- **Noto Serif TC**（思源宋體 / Google Fonts）—— 中文長文（術語定義、文獻摘要、書評、翻譯內文）
- **Source Serif 4**（Adobe / Google Fonts）—— 英文長文、英文 inline mix
- **Noto Sans TC**（思源黑體 / Google Fonts）—— 中文 UI（按鈕、導航、metadata、麵包屑）
- **Inter**（Google Fonts）—— 英文 UI、按鈕、導航
- **JetBrains Mono**（Google Fonts）—— DOI、APA 引用、code、識別碼、ISBN、技術 metadata
- 系統 fallback：`-apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif`

> **設計鐵律**：四個字族，四種職能。Serif 負責閱讀、Sans 負責點擊、Mono 負責引用。**永不交換職能**。出現「Sans-serif 設定 200 字術語定義」或「Serif 設定按鈕標籤」即破壞 voice。

### Hierarchy — 字級層級

| Role | Family | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display Title (Hero) | Noto Serif TC + Source Serif 4 | 48px / 3.00rem | 600 | 1.20 | -0.4px | 首頁 tagline 與條目主標題 |
| H1 (Page Title) | Noto Serif TC + Source Serif 4 | 36px / 2.25rem | 600 | 1.25 | -0.3px | 術語頁、文獻頁主標 |
| H2 (Section) | Noto Serif TC + Source Serif 4 | 26px / 1.625rem | 600 | 1.30 | -0.2px | 條目內章節標題 |
| H3 (Subsection) | Noto Serif TC + Source Serif 4 | 20px / 1.25rem | 600 | 1.35 | -0.1px | 條目內小標 |
| H4 (Inline Heading) | Noto Sans TC + Inter | 16px / 1.00rem | 700 | 1.40 | 0 | UI 區塊標題（如「相關術語」「最近更新」） |
| Body (Long-form) | Noto Serif TC + Source Serif 4 | 17px / 1.0625rem | 400 | 1.75 | 0 | **內文主體**。CJK 1.75 行高為閱讀甜點 |
| Body Small | Noto Serif TC + Source Serif 4 | 15px / 0.9375rem | 400 | 1.70 | 0 | metadata 旁的補述、註腳 |
| UI Label | Noto Sans TC + Inter | 14px / 0.875rem | 500 | 1.40 | 0.1px | 按鈕標籤、tab、表單 label |
| UI Caption | Noto Sans TC + Inter | 13px / 0.8125rem | 400 | 1.45 | 0.1px | 卡片 metadata、麵包屑 |
| Eyebrow / Kicker | Noto Sans TC + Inter | 12px / 0.75rem | 600 | 1.40 | 0.8px | UPPERCASE / 全形——主題分類、條目類型 |
| DOI / Identifier | JetBrains Mono | 13px / 0.8125rem | 400 | 1.50 | 0 | DOI、ISBN、Git SHA、URL |
| APA Citation Block | JetBrains Mono | 14px / 0.875rem | 400 | 1.65 | 0 | 在 `<pre>` 內顯示引用格式 |
| Footnote / Aside | Noto Serif TC + Source Serif 4 | 14px / 0.875rem | 400 | 1.60 | 0 | 策展人註解、編輯邊註 |
| Drop Cap (首字下沉) | Noto Serif TC | 56px / 3.5rem | 700 | 0.85 | -2px | 僅術語條目主定義段首字 |

### Principles — 排版原則

1. **CJK 行高永遠 ≥ 1.7**。中文字方塊密度高，1.5 以下行高會擠壓造成「文字牆」感。內文 1.75 是閱讀體驗的甜點。
2. **中英混排不切換字體**。Noto Serif TC + Source Serif 4 是同一字族 family stack，視覺上看不出切換點——這是這套字體選擇的核心理由。
3. **首字下沉只用一次**。每個術語頁的「主定義」段首一個字下沉酒紅，其他段落不再使用。重複使用會破壞莊嚴感。
4. **Eyebrow 全部大寫 + 0.8px tracking**。中文版 Eyebrow 用全形（如「術語 / 文獻 / 書目」），保持視覺重量。
5. **Mono 永遠不設定 long-form**。JetBrains Mono 只用於 DOI、識別碼、引用塊。出現 mono 排版超過 3 行的純文字段落即違規。
6. **數字用 `font-variant-numeric: tabular-nums`**。年份、頁碼、版本號對齊用 tabular numerals，避免左右跳動。

### Substitute Notes — 字體替代說明

- 若 Noto Serif TC 載入失敗，fallback 到 `"PingFang TC", "Source Han Serif TC", "Songti TC", serif`——避免 Microsoft JhengHei（無襯線）誤替換。
- 若 Source Serif 4 載入失敗，fallback 到 `"Charter", "Iowan Old Style", "Lora", serif`。
- Letter-spacing 值假設思源宋體與 Source Serif 4 的標準 metrics。若主機端字體渲染（如 Linux Liberation Serif）替換，可能需 -0.05px 微調 Display 級。

---

## 4. Component Stylings — 元件規範

### Buttons — 按鈕

學術參考站的按鈕設計克制——不出現「立即購買」「免費試用」這種 CTA 強度。按鈕僅用於：搜尋送出、Age Gate 確認、APA 一鍵複製、暗色模式切換。

**Primary — Reference Action**
- Background: `#FFFFFF` (Card White)
- Text: `#1C1A17` (Page Ink), Noto Sans TC + Inter 14px / 500 / 0.1px tracking
- Border: `1px solid #1C1A17`
- Border radius: `2px`（克制圓角，書院風）
- Padding: `10px 20px`
- Hover: 邊框與文字色翻轉為 `#7A1D1D`（酒紅），背景不變
- Transition: `border-color 150ms, color 150ms`

**Secondary — Quiet Link Button**
- Background: transparent
- Text: `#5C544A` (Faded Ink)
- Border: 無
- Underline: `1px solid currentColor`，hover 時 underline 與文字色變 `#7A1D1D`
- 用於：footer 連結、麵包屑、相關術語交叉引用

**Tertiary — Copy / Citation Action**
- Background: `#F2EDE4` (Subtle Tint)
- Text: `#8C6A2F` (Bronze Citation), JetBrains Mono 13px
- Border: `1px solid #D8CFC2`
- Border radius: `2px`
- Padding: `6px 12px`
- Icon: 細描線 SVG（如複製 icon）
- Hover: 背景變 `#FFFFFF`，邊框變 `#8C6A2F`
- 用於：APA 一鍵複製、DOI 複製

**Disabled**
- Text 與 border 同 `#8B8275`，cursor: not-allowed，不接收 hover

### Cards & Containers — 卡片與容器

**Term Entry Card**（術語條目卡）
- Background: `#FFFFFF`
- Border: `1px solid #D8CFC2`
- Border radius: `2px`
- Padding: `24px 28px`
- 結構：
  - Eyebrow（術語類型，如「D/s · 角色」）
  - 中文譯名 H2 + 英文原文 H3 在下
  - 一句話版本（30 字以內，italic Faded Ink）
  - 主定義段（首字下沉酒紅）
  - Metadata 區（首見文獻 + DOI + 來源年代）
  - 相關術語（小型 tag chip 列）
- **無 shadow，無 hover lift**。Hover 時邊框由 `#D8CFC2` 變 `#8C6A2F`，標題文字色變 `#7A1D1D`。

**Bibliography Card**（文獻條目卡）
- 同 Term Card 結構，但 metadata 區更密集：
  - 標題（英文原文）
  - 作者 + 年份（Faded Ink）
  - DOI（JetBrains Mono + 銅金）
  - Open Access / Paywalled badge
  - 中文摘要 150-250 字
  - 策展人註解（左側 3px 酒紅實心邊條）
  - 主題標籤 + 翻譯狀態 badge

**Reading List Book Card**
- 圖書版型，左側預留 60×90 占位區（**不放書封圖片，版權問題**——用 typographic 占位：書名首字 + 年份）
- 右側：書名 + 作者 + 類型 tag + 中文評介 3-5 句

**Reader's Letter Block**（讀者來信塊）
- Background: `#F2EDE4` (Subtle Tint)
- Border-left: `3px solid #D8CFC2`
- Padding: `16px 24px`
- 結構：「── 讀者來信 ──」分隔線 + 稱呼 + 內容 + metadata
- 每頁底部最多 3 則，超過折疊（`<details>`）

### Tags & Badges — 標籤與徽章

**Topic Tag** (主題標籤)
- Background: transparent
- Border: `1px solid #D8CFC2`
- Text: `#5C544A` Noto Sans TC + Inter 12px / 500 / 0.4px tracking
- Border radius: `2px`
- Padding: `2px 10px`
- Hover: 邊框變 `#7A1D1D`，文字變 `#7A1D1D`

**Status Badge** (狀態徽章)
- 設計同 Topic Tag，但分四種：
  - `Open Access`：邊框 `#5A7A3D`，文字 `#5A7A3D`，前綴小圓點
  - `Paywalled`：邊框 `#8B6F47`，文字 `#8B6F47`
  - `翻譯中`：邊框 `#8C6A2F`，文字 `#8C6A2F`
  - `已翻譯`：邊框 `#8C6A2F`，背景 `#F2EDE4`，文字 `#8C6A2F`，加粗

### Inputs & Forms — 輸入與表單

**Search Input**（搜尋框）
- Background: `#FFFFFF`
- Border: `1px solid #D8CFC2`
- Border radius: `2px`
- Padding: `10px 14px 10px 40px`（左側 40px 留給 search icon）
- Font: Noto Sans TC + Inter 15px
- Placeholder color: `#8B8275`
- Focus: 邊框變 `#1C1A17`，無 glow ring，無顏色變化
- 全站搜尋使用 [Pagefind](https://pagefind.app/) 或 [Fuse.js]，靜態 build-time index

**Long Text Input** (Box 投書表單，使用獨立外部表單服務如 Formspree 或 Tally)
- 結構同 Search Input，但 textarea
- Min height: 120px
- 字數計數器（500 字上限）顯示於右下，`#5C544A`

### Navigation — 導航

**Top Nav Bar**
- Background: `#FAF7F2` (與站體同)
- Border-bottom: `1px solid #D8CFC2`
- Height: 64px
- Logo 區（左）：「Kink Reference」WiredDisplay-style 設定，思源宋體 22px + Source Serif 4，**純文字 logo**，不做圖形 logo
- 主導航（中）：術語表 / 文獻指南 / 書架清單 / Directory / About，Noto Sans TC 14px
- 工具區（右）：搜尋按鈕 + 暗色模式切換 + GitHub icon link
- Hover: 文字底部出現 `2px solid #7A1D1D` underline

**Breadcrumb**（麵包屑）
- Noto Sans TC + Inter 13px / 400, `#5C544A`
- 分隔符：` / `（半形斜線 + 兩側半形空格）
- 最後一階文字加重為 `#1C1A17`

**Sidebar Index** (術語表/文獻指南索引頁的左側導航)
- Background: `#F2EDE4`
- Width: 240px (desktop), 折疊抽屜 (mobile)
- 字級：14px Noto Sans TC + Inter
- 當前項：左側 `3px solid #7A1D1D` 邊條 + 文字色 `#7A1D1D`

### Image Treatment — 圖片處理

整站幾乎不使用圖片。**例外**：
- 純 SVG 細描線 icon（搜尋、暗色切換、外部連結、複製）
- 詞彙地圖（術語頁底部 SVG static 樹狀圖，無互動）
- 站 logo（純文字，無圖形）

**禁用**：書封照片、人像、stock photo、hero banner、emoji 表情。

### Drop Cap — 首字下沉

- 僅出現於：術語頁 main definition 段首字
- 字級：56px Noto Serif TC 700
- 顏色：`#7A1D1D`（酒紅）
- Float: left；padding-right: 8px；line-height: 0.85
- 中文首字下沉用 `:first-letter` pseudo + `text-indent: 0` 避免錯位

### Citation Block — 引用塊

- Background: `#FFFFFF`
- Border-left: `3px solid #8C6A2F` (Bronze Citation)
- Padding: `12px 20px`
- Font: JetBrains Mono 14px
- Line-height: 1.65
- 配「複製 APA」Tertiary 按鈕在右上角

### Cross-Reference Map — 詞彙地圖

術語頁底部 SVG 靜態樹狀圖。樣式：
- 線條：`1px solid #5C544A`
- 節點文字：Noto Sans TC + Inter 13px
- 當前條目：背景 `#FAF7F2` + 邊框 `1px solid #7A1D1D`
- 其他條目：純文字連結，hover 變酒紅

### Age Gate Overlay — 年齡確認閘門

- Backdrop: `rgba(28, 26, 23, 0.92)`（Page Ink 透明）
- Modal Background: `#FAF7F2`
- Border: `1px solid #D8CFC2`
- Border radius: `2px`
- Padding: `40px 48px`
- 結構：
  - Eyebrow「進入須知」12px caps
  - H2「本站內容涉及成人議題的學術討論」
  - Body 兩段說明（中性、非恐嚇語氣）
  - 兩按鈕：Primary「我已成年，繼續」+ Secondary「離開」
- 不使用任何鎖頭、警告三角等情緒符號

---

## 5. Layout Principles — 版面原則

### Spacing System — 間距系統

- **Base unit**: `4px`
- **Scale**: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`
- 對應 token：`--space-1`（4px）到 `--space-13`（128px）
- 區塊間距（major sections）：`64px` desktop / `40px` mobile
- 段落間距：`20px`
- 卡片內 padding：`24px 28px` desktop / `16px 20px` mobile

### Grid & Container — 網格與容器

- **Long-form max width**: `65ch`（約 720px）—— 術語頁、文獻頁、翻譯頁、書評。長文閱讀紀律。
- **Index max width**: `1024px` —— 術語索引、文獻索引、Reading List 表格頁。
- **Site outer padding**: `24px` desktop / `16px` mobile
- **Two-column layout**（索引頁）：Sidebar 240px + 主內容 flex-1，gap 48px
- **三柱首頁卡片**：等寬 grid，gap 32px，desktop 三欄 / tablet 二欄 / mobile 單欄

### Whitespace Philosophy — 留白哲學

留白是書院的呼吸節奏，不是空無一物的畫布。kinkref.org 的留白介於 Stripe（過度寬鬆）與 WIRED（編輯密度）之間——**段落間呼吸足以讓讀者抬頭休息一秒，但不足以讓他懷疑頁面是否還有內容**。

具體：
- 段落 margin-bottom 等於行高（17 × 1.75 = 29.75px ≈ `--space-7`）
- 章節（H2）上方 margin-top 大於下方 margin-bottom 1.5x（製造「進入新章節」的呼吸感）
- 卡片之間垂直 gap 24px，水平 gap 32px
- Footer 與最後一個內容區塊之間 80px breathing room

### Border Radius Scale — 圓角規範

整站只有三個圓角值：
- `0` —— 圖片占位、分隔線、表格儲存格、Eyebrow ribbon
- `2px` —— 按鈕、卡片、輸入框、Tag、Badge（**最常用**）
- `4px` —— 大型容器（Modal、Age Gate）

**禁用**：`8px+` 的 SaaS 卡片風、`50%` 圓形按鈕（除外：純 icon button 可用 `50%`）、`9999px` 全圓 pill（學術站不需要）。

### Site Outer Frame

整站正中對齊，左右邊距 24px (mobile) → 64px (desktop)。最大內容容器 1024px。**不做** full-bleed background image 或 full-width hero。

---

## 6. Depth & Elevation — 深度與層次

| Level | Treatment | Use |
|---|---|---|
| 0 | 無邊框、無陰影 | Body 內文段落、Eyebrow、Metadata |
| 1 | `1px solid #D8CFC2` (hairline) | 卡片邊框、輸入框、表格分隔、麵包屑分隔 |
| 2 | `3px solid #7A1D1D` 左側實心邊條 | Sidebar 當前項、引用 callout、策展人註解區 |
| 3 | `3px solid #8C6A2F` 左側實心邊條 | APA Citation Block、DOI 標記區 |
| 4 | `1px solid #1C1A17` (page ink rule) | 章節分隔（`<hr>`）、Eyebrow ribbon |
| 5 | `#FFFFFF` 浮起層 + Level 1 邊框 | 卡片本體與 `#FAF7F2` 站底的明度差製造浮起 |
| 6 | `#2C2823` (Footer Earth) | Footer 區唯一深色塊 |

### Decorative Depth — 裝飾深度

**完全沒有**。零 box-shadow、零 gradient、零 glow、零 backdrop-blur。深度完全靠：
1. 1px hairline 邊框（紙紋灰 `#D8CFC2`）
2. 背景明度差（Card White vs Paper Cream）
3. 左側實心邊條（酒紅或銅金，3px）
4. 排版重量（字級、字重、letter-spacing）

如果需要視覺強調卻不能用陰影，**永遠先嘗試 typographic weight + hairline + 明度差的組合**。

---

## 7. Do's and Don'ts — 鐵律守則

### ✅ Do

- **Do** 用 Noto Serif TC + Source Serif 4 設定所有 ≥ 50 字的內文。Sans-serif 是 UI 字體，不是閱讀字體。
- **Do** 把酒紅 `#7A1D1D` 視為「全站只能用 5 次」的稀缺資源——hover、邊條、首字下沉、Age Gate 按鈕、最近更新徽章。多用一次即稀釋它。
- **Do** 把銅金 `#8C6A2F` **僅**用於引用相關元素（DOI、APA、Open Access）。它是學術徽章色，不是裝飾色。
- **Do** 內文寬度永遠鎖定 65ch (~720px)。寬度即紀律。
- **Do** 首字下沉只用在術語頁主定義段首。重複使用會降低儀式感。
- **Do** 中文行高 ≥ 1.75，英文行高 ≥ 1.6。CJK 不能擠。
- **Do** 用 1px hairline 邊框 + 明度差代替陰影。深度從不來自模擬光線。
- **Do** Eyebrow 用全形字（「術語 / 文獻 / 書目」）+ 0.8px tracking。
- **Do** 用 typographic placeholder 代替缺失圖片（書本 = 「《書名》首字 + 年份」占位框）。
- **Do** Hover 狀態永遠在 150ms 內完成，無 bouncy easing。

### ❌ Don't

- **Don't** 使用任何 BDSM 視覺意象：皮革紋、繩索剪影、鎖鏈、暗紅燈、皮鞭、紫色霓虹。**這是站的存在性禁區**。
- **Don't** 加 `box-shadow`。任何元件需要「浮起感」時，用 hairline + 明度差。
- **Don't** 用 `border-radius: 8px+` 的 SaaS 卡片風。學術不是 Stripe。
- **Don't** 讓酒紅與銅金以外的色彩出現在 chrome（標題、按鈕、邊條、accent）。攝影色不算（站上幾乎沒有圖片）。
- **Don't** 用 emoji 作為 UI 元件。標記用文字標籤或細描線 SVG。
- **Don't** 做 hero banner 或 stock photo background。kinkref.org 沒有「視覺主圖」這個概念。
- **Don't** 在 Sans-serif 設定 long-form。Sans 給按鈕、導航、metadata；長文必須襯線。
- **Don't** 用漸層、glassmorphism、neumorphism、glow、blur background。違反「殺死 AI 罐頭感」鐵律。
- **Don't** 做動態粒子、scroll-triggered animation、cursor follower。學術站靜如圖書館。
- **Don't** 在 Age Gate 用紅色驚嘆號或鎖頭。用中性字句：「本站內容涉及成人議題的學術討論」。
- **Don't** 加站主頭像、社群按鈕、捐款入口、newsletter 訂閱、cookie 追蹤橫幅。

---

## 8. Responsive Behavior — 響應式行為

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | <640px | 單欄；Sidebar 折疊為頂部下拉；nav 變漢堡選單；Eyebrow 字級從 12px 降至 11px |
| Tablet | 640–1023px | 主內容仍 65ch，但首頁三柱卡片變雙欄；nav 維持桌面版 |
| Desktop | 1024–1439px | 完整 sidebar + main 雙欄；首頁三欄 |
| Wide | ≥1440px | Container 鎖定 1024px，外圍留白擴大；不再放大字級 |

### Touch Targets

- 主按鈕：最小 `44 × 44px`（WCAG AAA）
- 內文連結：垂直內邊距增加至 4px 確保觸控命中
- Mobile sidebar 條目：高度 ≥ 48px

### Collapsing Strategy — 折疊策略

- **Nav**：Desktop 水平導航 → Mobile 漢堡 + slide-down drawer。Logo 永遠居左。
- **Sidebar**：240px 左欄 → Mobile 頂部 `<details>` 折疊抽屜，預設收合。
- **Three-pillar Home Cards**：3 欄 → 2 欄 → 1 欄。
- **Footer**：4 欄 metadata grid → 2 欄 → 1 欄堆疊。
- **內文寬度**：65ch 永遠不變。Mobile 自然小於 65ch（單欄為視窗寬 - 32px outer padding）。
- **Spacing**：垂直區塊間距從 64px → 40px（mobile）。Card padding 從 28px → 20px。
- **字級**：H1 從 36px → 28px (mobile)。內文 17px 不變（CJK 不能再小）。

### Image Behavior

- 整站幾乎無圖片。Icon SVG 用 `width/height` attribute + `currentColor` 上色。
- 詞彙地圖 SVG 在 mobile 下變垂直 list 式呈現（CSS Grid 切換）。

### Print Stylesheet

學術站建議提供 `print.css`：
- Background 強制白
- 字級 11pt 印刷
- 連結顯示 URL（`a::after { content: " (" attr(href) ")" }`）
- Sidebar、nav、footer 隱藏
- 引用塊與 metadata 完整保留
- 頁碼顯示

---

## 9. Agent Prompt Guide — AI 代理快速參考

### Quick Color Reference

- **Page Background**: "Paper Cream `#FAF7F2`"
- **Card Background**: "Card White `#FFFFFF`"
- **Subtle Tint**: "Subtle Tint `#F2EDE4`"
- **Body Text**: "Page Ink `#1C1A17`"
- **Metadata Text**: "Faded Ink `#5C544A`"
- **Link Hover / Drop Cap / Edge Strip**: "Reference Crimson `#7A1D1D`"
- **DOI / APA / Citation Accent**: "Bronze Citation `#8C6A2F`"
- **Hairline / Quiet Border**: "Rule Fine `#D8CFC2`"
- **Footer Block**: "Footer Earth `#2C2823`"

### Example Component Prompts

1. *「為 kinkref.org 製作術語條目卡：背景 Card White `#FFFFFF`，1px Rule Fine `#D8CFC2` 邊框，`2px` 圓角，`24px 28px` padding。標題用 Noto Serif TC + Source Serif 4 26px 600（中文譯名），下方副標 20px 400（英文原文）。主定義段首字下沉 56px Reference Crimson 酒紅。底部 metadata 用 Noto Sans TC + Inter 13px Faded Ink。Hover 時邊框變 Bronze Citation `#8C6A2F`，標題色變酒紅。**無陰影**。」*

2. *「設計 APA 引用塊：背景 Card White，左側 `3px solid #8C6A2F` 銅金邊條，內部 JetBrains Mono 14px / line-height 1.65。右上角放 Tertiary 複製按鈕（背景 Subtle Tint `#F2EDE4`，邊框 Rule Fine，文字 Bronze Citation 13px JetBrains Mono）。複製成功時按鈕短暫 flash 為 Open Access 苔蘚綠 `#5A7A3D`。」*

3. *「製作首頁三柱入口卡：三欄 grid，gap 32px。每張卡 Card White 背景，1px Rule Fine 邊框，`2px` 圓角，`32px` padding。內部結構：Eyebrow 全形「術語 / 文獻 / 書目」12px Noto Sans TC + Inter 600 0.8px tracking → H3 中文標題 → 一句中文描述 17px Noto Serif TC → 「進入 →」連結 14px Noto Sans TC + Inter Reference Crimson。Hover 全卡邊框變 Reference Crimson。」*

4. *「設計 Age Gate 覆蓋層：Backdrop `rgba(28,26,23,0.92)`，居中 modal 背景 Paper Cream，`1px solid #D8CFC2` 邊框，`4px` 圓角，`40px 48px` padding。內容：Eyebrow「進入須知」12px caps → H2「本站內容涉及成人議題的學術討論」26px Noto Serif TC → 兩段中性說明 17px → 兩按鈕橫排：Primary「我已成年，繼續」(Reference Crimson border + text, hover invert) + Secondary「離開」(no border, Faded Ink underline)。**不使用鎖頭、警告三角、紅色驚嘆號等情緒符號**。」*

5. *「製作術語頁詞彙地圖（cross-reference map）：純 SVG 樹狀圖，線條 `1px solid #5C544A`，節點文字 Noto Sans TC + Inter 13px。當前條目用 Paper Cream 背景 + `1px solid #7A1D1D` 邊框框起。其他節點純文字連結，hover 變 Reference Crimson。整圖最寬 600px，居中對齊。Mobile 下切換為垂直 list。**不做動畫，不做互動 zoom/pan**。」*

### Iteration Guide — 迭代守則

當審查既存的 kinkref.org 頁面或元件時，依以下優先順序檢查：

1. **Audit shadows first.** 如出現任何 `box-shadow` ≠ `none`，移除。深度只能來自 hairline + 明度差。
2. **Audit border-radius.** 如出現 ≥ `8px` 圓角，降至 `2px` 或 `4px`。學術不是 SaaS。
3. **Audit color sprawl.** 如 chrome 出現酒紅 `#7A1D1D`、銅金 `#8C6A2F` 以外的 accent 色（紫、綠、藍），移除。
4. **Audit typeface roles.** Sans-serif 設定 long-form 是 #1 違規。把超過 50 字的純文字換回 Noto Serif TC + Source Serif 4。
5. **Audit content width.** 長文寬度 ＞ 65ch (~720px) 即違規。寬度即紀律。
6. **Audit imagery.** 出現任何 BDSM 視覺意象（皮革、繩索、鎖鏈、紫色霓虹）→ 立即移除。這是存在性禁區。
7. **Audit hover behavior.** Hover 應為色彩變化（150ms 內），不應為 lift / scale / shadow / blur。
8. **Audit drop caps.** 首字下沉每頁最多一個。多個出現即降低儀式感。
9. **Audit Eyebrow.** 每個獨立條目應有全形 Eyebrow（「術語 / 文獻 / 書目」）。缺少 Eyebrow 會讓條目讀起來像泛泛 blog。
10. **Audit emoji.** UI 中出現 emoji → 替換為細描線 SVG icon 或文字標籤。

---

## Appendix A — Tokens 快取

完整 tokens 定義見 `src/styles/tokens.css`。摘要：

```css
:root {
  /* Surface */
  --bg-base:     #FAF7F2;
  --bg-elevated: #FFFFFF;
  --bg-subtle:   #F2EDE4;
  --bg-footer:   #2C2823;

  /* Ink */
  --ink-heading:  #1C1A17;
  --ink-body:     #1C1A17;
  --ink-meta:     #5C544A;
  --ink-disabled: #8B8275;
  --ink-inverse:  #E8E2D6;

  /* Accent */
  --accent-primary:  #7A1D1D; /* Reference Crimson */
  --accent-citation: #8C6A2F; /* Bronze Citation */

  /* Semantic */
  --status-oa:        #5A7A3D;
  --status-paywalled: #8B6F47;

  /* Rule */
  --rule-fine:    #D8CFC2;
  --rule-section: #1C1A17;

  /* Radius */
  --radius-flat:   0;
  --radius-sm:     2px;
  --radius-md:     4px;

  /* Spacing (4px scale) */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-7:  32px;
  --space-8:  40px;
  --space-9:  48px;
  --space-10: 64px;
  --space-11: 80px;
  --space-12: 96px;
  --space-13: 128px;

  /* Type */
  --font-serif: "Noto Serif TC", "Source Serif 4", "Charter", "Iowan Old Style", serif;
  --font-sans:  "Noto Sans TC", "Inter", -apple-system, "PingFang TC", sans-serif;
  --font-mono:  "JetBrains Mono", "Menlo", "Consolas", monospace;

  /* Reading width */
  --content-width-prose: 65ch;
  --content-width-index: 1024px;

  /* Transition */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-base:     #161A18;
    --bg-elevated: #1F2421;
    --bg-subtle:   #22272A;
    --ink-heading: #E8E2D6;
    --ink-body:    #E8E2D6;
    --ink-meta:    #A8A095;
    --accent-primary:  #C25555;
    --accent-citation: #C9A65A;
    --rule-fine:   #3A3F3C;
  }
}
```

---

## Appendix B — Page Inventory（v1.0 - v1.2）

設計系統服務的 11 個頁面：

| Tier | # | Page | Route | Layout |
|---|---|---|---|---|
| v1.0 | 1 | Landing | `/` | Three-pillar grid + recent updates |
| v1.0 | 2 | Glossary Index | `/glossary/` | Sidebar + alphabet/zhuyin index |
| v1.0 | 3 | Glossary Term | `/glossary/[slug]/` | Long-form 65ch + sidebar |
| v1.0 | 4 | Bibliography Index | `/bibliography/` | Topic-grouped list |
| v1.0 | 5 | Bibliography Entry | `/bibliography/[slug]/` | Long-form 65ch + APA box |
| v1.0 | 6 | Reading List | `/books/` | Filterable card grid |
| v1.0 | 7 | About | `/about/` | Long-form 65ch, no sidebar |
| v1.0 | 8 | Contributing | `/contribute/` | Long-form 65ch + TOC |
| v1.1 | 9 | Directory | `/directory/` | Table layout |
| v1.1 | 10 | Reading Roadmap | `/roadmap/` | 三類讀者三欄 path 圖 |
| v1.2 | 11 | FAQ / 圈外人 pathway | `/faq/` | Q&A accordion |

---

*Curated by 光影師 艾莉兒 (Designer Visual Ariel) — 2026-05-02*
*Mood: The Reference Press · For kinkref.org · CC-BY-SA 4.0*
