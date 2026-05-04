# 貢獻指南 — kinkref.org

> **給**：所有希望貢獻內容的人——圈內人、研究者、圈外關心者皆歡迎
> **版本**：v1.3
> **最後更新**：2026-05-04
> **License**：本站採 CC-BY-SA 4.0。貢獻即代表同意以此授權發布。

---

## 目錄

1. [貢獻前須知](#一貢獻前須知)
2. [貢獻者名稱認列](#二貢獻者名稱認列)
3. [OPSEC：貢獻者身分保護](#三opsec貢獻者身分保護)
4. [開放投稿區 vs. 主編鎖定區](#四開放投稿區-vs-主編鎖定區)
5. [貢獻方式一覽](#五貢獻方式一覽)
6. [GitHub PR 流程](#六github-pr-流程)
7. [PR 提交前自檢清單](#七pr-提交前自檢清單)
8. [圈名身分投稿論文](#八圈名身分投稿論文)
9. [審核標準](#九審核標準)
10. [常見拒絕原因](#十常見拒絕原因)
11. [投稿模板](#十一投稿模板)
12. [行為準則](#十二行為準則)
13. [OA 論文全文翻譯投稿](#十三oa-論文全文翻譯投稿v13-新增)
14. [附錄 A：常用來源資源](#附錄-a常用來源資源)
15. [附錄 B：變更紀錄](#附錄-b變更紀錄)

---

## 一、貢獻前須知

### 這個站是什麼

kinkref.org 是一個 **學術文獻轉譯站**，定位為「**國際學術知識 × 台灣文化的統合轉譯**」。
不是社群論壇，不是實踐指南站，不是任何個人或組織的宣傳管道。

站上的內容是：
- BDSM 相關學術文獻的中文摘要與索引（核心為英文，亦含日文、中文圈、台灣原生作品）
- BDSM 術語的學術溯源定義（含中英對照、辨析、文化適配說明）
- 學術書目的策展評介
- CC BY 授權 OA 論文的全文中譯（v0.8.0 新增 `content/translations/`）

站上的內容**不是**：
- 安全指引（如何操作某種實踐）
- 場地、工作室、個人推薦
- 任何人（包括站主）的個人觀點表達

### 貢獻的意義

你的貢獻幫助台灣中文圈的研究者、臨床工作者、記者、以及正在自我理解的圈內人，找到結構化的學術資源。這是知識基礎建設，不是意見仗。

---

## 二、貢獻者名稱認列

> 在動手之前，先決定「你要怎麼被署名」。本站的署名邏輯**不等同於 git commit 作者欄位**。

### 2.1 三種署名身分

本站對「貢獻者」的識別有三個層級，**可以彼此不一致**：

| 識別層 | 出現位置 | 用途 | 是否可自選 |
|--------|---------|------|-----------|
| **Git 作者** | commit history | 技術上的作者紀錄 | ✅ 可（透過 git config） |
| **GitHub handle** | PR 作者顯示 | 平台層識別 | ⚠️ 取決於登入帳號 |
| **Contributor 認列名** | 站上條目的 `contributor` 欄位 | 公開展示給讀者的署名 | ✅ 完全自由 |

### 2.2 `contributor` 欄位填什麼？

`contributor` 欄位接受**任何字串**作為署名，不需要等同 git author 或 GitHub handle。

合法的署名方式：

| 範例 | 適用情況 |
|------|---------|
| `"夜行者"` | 圈內暱稱（中文/英文/混合皆可） |
| `"Anonymous Switch"` | 半匿名描述性署名 |
| `"@github-handle"` | GitHub 用戶名（前綴 `@` 表示是 handle） |
| `"匿名讀者 #001"` | 完全匿名（策展人會分配編號） |
| `"[圈名]"` | 暫不公開圈名，但保留條目所有權 |
| `"Curated by editorial team"` | 編輯團隊代撰（少數情況） |

**不建議**的署名：
- ❌ 真實姓名（除非你有特殊理由公開實名）
- ❌ 能直接連回真名的職稱（「OO大學OO系副教授」）
- ❌ 含個資的暱稱（「住中山區的某某」）

### 2.3 為什麼可以不等同 git id？

因為**「在 commit history 出現」與「在站上被讀者看到」是兩個不同的曝光面**：

- **Commit history**：技術紀錄，預設只有貢獻者自己和策展人會仔細看
- **站上條目**：對所有讀者公開展示

例如：
- 你的 GitHub handle 是 `kinkref-contrib-3`（隨機），但你想在站上被認列為「**夜行者**」——`contributor: "夜行者"` 即可
- 你以電子郵件投稿，沒有 GitHub 帳號——commit 由策展人代提交，但 `contributor` 欄位填你選擇的圈名

### 2.3b 站方產製條目的 contributor 慣例

站方主動產製的條目（不是外部投稿）採用統一格式：

```yaml
# 純站方產製（多數）：
contributor: kinkref
contributor_note: "本條目由 AI 心理學家 Agent 繆思（Muse）生成"

# 經策展人薩約審校的條目：
contributor: kinkref
contributor_note: "本條目由 AI 心理學家 Agent 繆思（Muse）生成"
reviewer: 策展人：薩約
```

**設計意圖**：
- `contributor: kinkref` 統一站方歸屬，作為條目的官方發布者
- `contributor_note`（v1.2 新增）對讀者透明標示初稿是 AI 生成，符合 AI-augmented 內容的學術倫理
- 「繆思（Muse）」是站方 AI 心理學家 Agent 的識別名
- `reviewer` 欄位若有，表示策展人經實質審校或提供圈內視角

**關於繆思（Muse）**：
- 站方建置一個專責的 AI Agent 進行條目初稿生成與內部一致性維護
- 對外身分：「AI 心理學家 Agent 繆思」
- 對讀者完全透明，不假裝為人工撰寫

### 2.4 `reviewer` / `reviewed_by` 欄位

審校者署名規則同 `contributor`：可填圈名、GitHub handle、暱稱。

| 條目類型 | 審校欄位名 | 用途 |
|---------|-----------|------|
| 術語 | `reviewer` | 術語定義審校者 |
| 書目 | `reviewer` | 書摘審校者 |
| 論文 | `reviewed_by` | 方法論段落審校者 |

如果是策展人自己審校，可填 `"主編"` 或站主的圈名。

### 2.5 已認列的署名能改嗎？

**可以，但需要 PR**：
- 想換暱稱（如從「夜行者」改為「Switch001」）：開 PR 修改所有你署名過的條目
- 想撤回署名（轉為匿名）：開 PR 將 `contributor` 改為 `"匿名讀者"`，commit history 仍會留痕
- 想刪除所有貢獻紀錄：技術上不支援（CC-BY-SA 授權後無法收回），但可改成匿名

> ⚠️ **重要**：commit history 上的 git author 修改困難（需要 rebase 整個歷史），所以**第一次設定 git config 時就想好用什麼名字**。

### 2.6 多人協同條目的署名

如果一個條目由多人協作完成：

```yaml
contributor: "夜行者; Switch001"   # 用「;」分隔，列出所有貢獻者
reviewer: "[圈名]"                  # 審校者單獨列
```

協同優先順序由實際貢獻量決定，主要撰寫者列在前。

---

## 三、OPSEC：貢獻者身分保護

**這一節認真讀。** 本站歡迎圈內人以圈名投稿，並為此設計了保護機制。

### 3.1 如果你想以圈名/匿名投稿

- **不需要用真名**。所有貢獻欄位的 `contributor` 可以填圈名或 GitHub handle
- **GitHub 帳號本身可以是新建的**，不需要與你的主帳號相連
- **建議使用專屬的 GitHub 帳號**，不要用平日的主帳號提交 PR，尤其如果你的主帳號有真名/照片

### 3.2 設置匿名 GitHub 貢獻環境

```bash
# 在這個 repo 目錄下設定局部 git config（不影響你的主帳號設定）
git config user.name "你的圈名"
git config user.email "你的GitHub-noreply@users.noreply.github.com"
```

> 取得 GitHub noreply 地址：登入 GitHub → Settings → Emails
> 勾選「Keep my email address private」後，會顯示你的專屬 noreply 地址

驗證設定是否生效：
```bash
git config user.name    # 應顯示你的圈名
git config user.email   # 應顯示 noreply 地址
```

### 3.3 Commit 內容不要洩漏身分

- 不要在 commit message 或檔案內容中使用真名
- 不要在 `contributor` 或 `reviewer` 欄位填入能連回真名的資訊
- 如果你使用 GitHub Desktop 等 GUI 工具，確認 commit 簽名使用的是新帳號，不是主帳號

### 3.4 你可以完全匿名提交

如果你不想建立 GitHub 帳號，可以寄信至策展人信箱 **`curator@kinkref.org`** 以電子郵件提交。
來信不需要留真名，圈名即可，甚至「一次性讀者」也接受。

---

## 四、開放投稿區 vs. 主編鎖定區

### ✅ 開放投稿（歡迎 PR）

以下內容歡迎社群提交 PR 或來信投稿：

| 類型 | 說明 |
|------|------|
| 術語表新增 | 補充新術語，或現有術語的別稱、更正 |
| 術語中文定義 | 補充、修正，或提出異議（需附來源） |
| 術語辨析（disambiguation） | 補充與相近術語的區別 |
| 書目新增 | 補充尚未收錄的書，需附基本 metadata |
| 書摘撰寫 | 替現有書目撰寫中文書摘 |
| 論文新增 | 補充尚未收錄的論文，需附 DOI |
| 論文摘要撰寫 | 替現有論文條目撰寫中文摘要 |
| 翻譯勘誤 | 指出現有翻譯的錯誤或不準確之處 |
| **OA 論文全文翻譯** | CC BY 授權的論文，提交全文中譯（v0.8.0 新增，見 § 13） |
| 引用格式修正 | APA 格式、DOI 等欄位的勘誤 |
| 大學社團 directory | 自薦或代表社團申請收錄 |
| 專業人士 directory | 自薦收錄（見第八節） |

### 🔒 主編鎖定（不接受外部 PR）

以下內容由站主獨立維護，**不接受修改型 PR**（但接受來信提出意見）：

| 類型 | 鎖定原因 |
|------|---------|
| 窒息 / Breath Play 相關內容 | 安全立場需硬性一致，不容分歧 |
| 法律章節 | 法律判斷需專業審核，不開放社群修改 |
| 未成年保護聲明 | 零爭議區，主編決定 |
| 網站 About 頁及治理說明 | 站主自述 |
| 任何「安全操作指引」性質內容 | 本站明確不做此類內容 |

> 💬 **意見仍然歡迎**：即使是鎖定區，你仍可開 Issue 或來信提出意見。我們會看，會考慮，但修改決定由站主做。

---

## 五、貢獻方式一覽

### 方式 A：GitHub Pull Request（推薦）

適合：熟悉 git 流程、希望有版本記錄的貢獻者

流程見[第六節](#六github-pr-流程)，自檢清單見[第七節](#七pr-提交前自檢清單)。

### 方式 B：GitHub Issue

適合：有想法但不確定格式，或只是想提建議

在 GitHub Issues 開一個 issue，說明：
- 你想新增/修改什麼
- 為什麼（附來源或說明）
- 如果你有草稿，可以貼在 issue 內文

策展人會評估並決定是否採用、如何處理。

### 方式 C：電子郵件投稿

適合：不想建立 GitHub 帳號、或希望保持更高程度匿名

寄信至策展人信箱 **`curator@kinkref.org`**，主旨請標記：
- `[術語投稿]` / `[論文投稿]` / `[書目投稿]` / `[自薦 directory]` / `[勘誤]`

以圈名、匿名或任何你選擇的方式署名均可。

---

## 六、GitHub PR 流程

### 6.1 基本流程

```
1. Fork 本 repo
2. 在你的 fork 上建立新 branch
   命名：feature/add-term-{slug} 或 fix/correct-{slug} 等
3. 修改或新增 Markdown 檔案（依照 CONTENT_SCHEMA.md v1.1 格式）
4. 跑過第七節的「PR 提交前自檢清單」
5. 提交 Pull Request
6. 等待審核（通常 1-2 週）
```

### 6.2 PR 標題格式

```
[類型] 動詞：條目名稱
```

範例：
- `[術語] 新增：Submissive`
- `[論文] 新增：Moser & Kleinplatz 2006`
- `[書目] 修正：SM101 摘要篇幅`
- `[勘誤] 修正：Wismeijer 2013 樣本數`

### 6.3 PR 描述建議格式

```markdown
## 變更類型
新增 / 修正 / 翻譯 / 勘誤

## 變更摘要
（一兩句話說明這個 PR 做了什麼）

## 來源依據
（如果是新增條目或修正定義，列出 1-3 個依據文獻）

## 自檢清單
（勾選第七節的自檢項目）
```

### 6.4 檔案位置與命名

| 條目類型 | 路徑 | 命名規則 | 範例 |
|---------|------|---------|------|
| 術語 | `content/glossary/` | 英文 slug，lowercase，`-` 分隔 | `dominant.md`、`safe-word.md` |
| 論文 | `content/bibliography/` | 第一作者姓氏 + 年份 | `wismeijer-2013.md` |
| 書目 | `content/books/` | 書名核心 slug | `sm101.md`、`different-loving.md` |

詳細命名規則見 `CONTENT_SCHEMA.md` 第三節。

---

## 七、PR 提交前自檢清單

> **這份清單不是裝飾，是門檻。** 沒跑過自檢就提交，會被退回。

自檢分四層：**結構性 → 內容 → OPSEC → 提交格式**。建議按順序檢查。

### 7.1 結構性自檢（YAML 與 Schema 合法性）

- [ ] frontmatter 標記了 `schema_version: "1.1"`
- [ ] 所有 ✅ 必填欄位都已填寫（見 CONTENT_SCHEMA.md 對應條目類型）
- [ ] YAML 格式有效（無語法錯誤、縮排一致）
- [ ] slug 符合命名規則（lowercase、`-` 分隔、無底線、無大寫）
- [ ] `topic_tags` 從合法 enum 中選（1-4 個）
- [ ] `reader_tags` 從合法 enum 中選（1-3 個）
- [ ] 沒有使用已棄用的標籤（`glossary` topic、`partner-family` reader）
- [ ] 結構化欄位（`disambiguation` / `citations` / `caveats` 等）格式正確
- [ ] 引用其他條目時，`ref` 欄位指向實際存在的 slug
- [ ] `created_date` 與 `last_reviewed` 為合法日期格式 `YYYY-MM-DD`

### 7.2 內容自檢（質量與政策）

- [ ] `definition` / `abstract_zh` 篇幅符合 v1.1 規範
  - 術語 definition：150-400 字
  - 書摘：100-300 字
  - 論文摘要：150-400 字（review/meta-analysis 可 ≤500）
- [ ] `tagline`（術語）≤30 字
- [ ] `curator_note` 為 1-5 句
- [ ] 語氣中性，無「真正的⋯應該」「只有⋯才算是」等規範性語言
- [ ] 引用來源真實可查
  - DOI 連線可開啟
  - ISBN 可在書店/圖書館查到
  - 預印本連結有效
- [ ] **沒有**操作性安全指引（如何做某種實踐）
- [ ] **沒有**對特定個人、工作室、場地的評價（正面或負面）
- [ ] **沒有**任何涉及未成年的內容（包括假設情境）
- [ ] **沒有**質疑「不存在安全窒息」的內容
- [ ] 翻譯類條目註明翻譯來源版本與翻譯日期
- [ ] 進階欄位（如 `caveats`、`audience_warning`）必要時已填，不刻意省略影響讀者判斷的資訊

### 7.3 OPSEC 自檢（身分保護）

- [ ] 已執行 `git config user.name` 與 `user.email` 為投稿身分（非主帳號）
- [ ] 用 `git log` 檢視最近 commit，確認 author 顯示是投稿身分
- [ ] commit message 不含真名、職稱、機構名稱
- [ ] 條目內容不含可連回真名的線索（住所、就讀學校特定描述等）
- [ ] `contributor` 欄位填的是你選擇的署名（不是預設的 GitHub 真名）
- [ ] 如果論文是你自己寫的，**沒有**在 PR 中聲明「這是我的論文」（保留 plausible deniability）

### 7.4 提交格式自檢

- [ ] PR 標題符合 `[類型] 動詞：名稱` 格式
- [ ] PR 描述包含變更類型、摘要、來源依據
- [ ] 一個 PR 只動一條主條目（除非是批次勘誤類，需在 PR 描述說明）
- [ ] branch 名稱符合 `feature/...` 或 `fix/...` 慣例
- [ ] 沒有意外提交其他檔案（`.DS_Store`、IDE 設定、本地測試檔）
- [ ] commit 數量精簡（建議 1-3 個 commit；過多請 squash）

### 7.5 範本：直接複製到 PR 描述

```markdown
## 變更類型
- [ ] 新增條目
- [ ] 修正條目
- [ ] 翻譯
- [ ] 勘誤
- [ ] 其他：_____

## 變更摘要


## 來源依據


## 自檢清單

### 結構性
- [ ] schema_version 已標記為 1.1
- [ ] 必填欄位完整
- [ ] slug 命名合規
- [ ] 標籤合法（無已棄用標籤）

### 內容
- [ ] 篇幅符合 v1.1 規範
- [ ] 語氣中性
- [ ] 來源可驗證
- [ ] 無操作指引/個人評價/未成年內容

### OPSEC
- [ ] git config 為投稿身分
- [ ] commit message 無真名洩漏
- [ ] contributor 欄位填的是投稿署名

### 格式
- [ ] PR 標題符合格式
- [ ] 一個 PR 一條條目（或批次勘誤已說明）
- [ ] 無意外檔案
```

---

## 八、圈名身分投稿論文

### 8.1 什麼是「投稿論文收回到自己圈名身分」

如果你是圈內的研究者或學術工作者，你可能有正式發表（或正在撰寫）的學術論文想在本站收錄。

本站支援一種機制：**論文以你的圈名為策展身分**，不需要揭露你的真名與圈名之間的連結。

### 8.2 如何運作

1. 你提供：論文 DOI（或預印本連結）+ 中文摘要草稿
2. 你選擇：在 `contributor` 和 `reviewed_by` 欄位用圈名署名
3. 站主收錄：論文以標準格式收錄，策展人身分顯示你的圈名

**你不需要聲明「這是我自己的論文」**。策展人只需要確認論文是真實存在的學術文獻，不需要驗證你與論文的關係。

### 8.3 隱私說明

站主不會：
- 主動詢問或記錄你的真名
- 將你的圈名與任何可識別真名的資訊關聯
- 在任何地方揭露「圈名 X 就是真名 Y 論文的作者」

站主會：
- 在 commit history 中記錄你提交時的 git author（即第二節決定的署名）
- 公開顯示你選擇的 `contributor` 欄位內容

---

## 九、審核標準

### 9.1 通過的條件

所有投稿內容會依照以下標準審核：

**必要條件（任一不符即退回）**：
1. 內容符合本站定位（學術文獻轉譯 / 術語定義 / 書目評介）
2. 所有必填欄位已填寫且格式正確
3. 如有學術引用，來源真實可查（DOI 可連線、書籍 ISBN 可驗證）
4. 沒有對特定個人、工作室、場地給出評價（正面或負面）
5. 沒有操作性安全指引（如何做某種 BDSM 實踐）
6. 沒有任何涉及未成年的內容或假設情境
7. 通過第七節的自檢清單

**品質標準（未達標會要求修改）**：
- `definition` / `abstract_zh` 符合篇幅規範
- 語氣中性，不帶規範性判斷
- 術語定義有文獻依據（或清楚標明是社群口傳共識）
- 進階欄位（`caveats`、`audience_warning`）必要時應填

### 9.2 審核時間

- 一般投稿：**1-2 週**
- 如果投稿量增加，可能延長至 3-4 週
- 緊急勘誤（如重大事實錯誤）：**3 個工作日內**

### 9.3 你會收到回應

**所有投稿都會收到回應**——包括不採用的投稿。

回應類型：
- ✅ 採用：合入主線，感謝貢獻
- 🔄 需修改：說明哪裡需要改，改完可重新提交
- ❌ 不採用：說明拒絕原因（見下節常見原因）

---

## 十、常見拒絕原因

以下情況會被退回，**不帶情緒，只是範疇外**：

| 原因 | 說明 |
|------|------|
| **超出站定位** | 操作指南、場地介紹、個人推薦、活動資訊 |
| **安全指引性質** | 任何描述「如何安全進行⋯」的內容 |
| **個人評價** | 對特定 Dom/sub/工作室的正面或負面評語 |
| **無來源的絕對聲明** | 「只有⋯才算是真正的⋯」「正確的⋯應該是⋯」等無引用的規範性語言 |
| **未成年相關** | 任何形式，包括「假設情境」 |
| **窒息/breath play 立場分歧** | 本站立場已鎖定，不收錄質疑「不存在安全窒息」的內容 |
| **來源不可查** | DOI 連線失敗，書籍無法驗證存在 |
| **未通過自檢** | 第七節的結構性/內容/OPSEC 自檢未跑或顯著遺漏 |

---

## 十一、投稿模板

> **對齊 Schema v1.1**。複製對應模板，填入資料後提交 PR 或電子郵件。

模板分兩層：
- **最低要求**：投稿者必填的核心欄位
- **進階欄位**：選填，可省略由策展人補完

### 11.1 術語投稿模板

```yaml
schema_version: "1.1"

# === 最低要求（必填） ===
term_zh:                # 中文主標
term_en:                # 英文原文
tagline:                # 一句話定義，≤30 字

definition: |
  # 150-400 字中文定義
  # 結構：核心定義（80-150字）→ 脈絡說明（60-150字）→ 來源說明（30-100字，選填）
  # 語氣中性，不規範化

topic_tags: []          # 1-4 個，從以下選：
                        # consent / psychopathology / aftercare / cross-cultural
                        # harm-reduction / methodology / legal / neuroscience
                        # identity / relationship-dynamics / gender-sexuality
                        # subculture-ethnography / practice-specific / history
reader_tags: []         # 1-3 個，從以下選：
                        # beginner / practitioner / researcher / clinical
                        # legal-pro / educator / media / policy-maker / loved-ones

contributor:            # 你的署名（圈名 / @github-handle / 暱稱）
created_date: 2026-XX-XX
last_reviewed: 2026-XX-XX

# === 進階欄位（選填，可由策展人補完） ===
term_ja:                # 日文對應詞（如 緊縛）
term_alt_zh:            # 其他中文譯名，「;」分隔
aliases_en:             # 英文別稱，「;」分隔（如 "Dom; Domme"）

disambiguation:         # 與相近術語的辨析，每條 ≤100 字，總 ≤500 字
  - vs:
    note: |

usage_notes:            # 不同社群的用法差異，≤200 字
controversies:          # 爭議點（殖民意涵、跨文化敏感性等），≤200 字

origin_year:            # 詞彙首見/流行年代，如 "1990s"
first_source:           # 首見文獻 APA 格式
first_source_doi:

related_terms: []       # 相關術語的 slug 列表

external_references:    # 外部標準對應
  - source:             # bdsmtest.org / wikipedia / fetlife 等
    name:               # 或 url

citations:              # 站內外引用
  - type:               # internal-paper / internal-book / internal-term / external
    ref:                # 站內 slug
    note:

reviewer:               # 審校者署名（若有）
```

### 11.2 論文投稿模板

```yaml
schema_version: "1.1"

# === 最低要求（必填） ===
title:                  # 英文論文標題
authors:                # Last, F. 格式，「;」分隔
year:
journal:
doi:                    # https://doi.org/...

access_type:            # open-access / paywalled / preprint-available
study_type:             # 必填！從 enum 選：
                        # quantitative / qualitative / mixed-methods
                        # theoretical / review / systematic-review
                        # meta-analysis / case-study / ethnography / commentary

translation_status:     # full-translation / partial-translation
                        # / abstract-only / planned / none

topic_tags: []          # 1-4 個（標籤列表同術語模板）
reader_tags: []         # 1-3 個
difficulty:             # entry / intermediate / advanced

abstract_zh: |
  # 150-400 字（review/meta-analysis 可 ≤500）
  # 結構：研究問題（1-2句）→ 方法概述（1-2句）→ 主要發現（2-4句）→ 意義（1句）
  # 重新用中文讀者視角撰寫，非直譯
  # 如無法撰寫，請填「策展人排程」

curator_note: |
  策展人導讀：（1-5 句）
  # 如你是投稿者，可留空，由策展人撰寫

contributor:            # 你的署名
created_date: 2026-XX-XX
last_reviewed: 2026-XX-XX

# === 進階欄位（選填） ===
volume:
issue:
pages:

oa_type:                # gold / green / bronze / hybrid / diamond
preprint_url:           # PsyArXiv / SSRN / 作者個人頁

methodology_keywords: []  # online-survey / semi-structured-interview 等
sample_size:              # 樣本數（質性研究可填「N=15」「8 訪談」）
sample_population:        # 樣本來源描述

original_abstract: |    # 原文 abstract（fair use 範圍內保留）

translation_url:        # 站內全文翻譯頁 URL（若有）

caveats:                # 注意事項
  - type:               # methodology / cultural-context / dated / controversy / legal-context
    note:

audience_warning: []    # 敏感內容提示，字串列表

replication_status:     # replicated / partially-replicated / failed-replication
                        # / disputed / unknown
corrigenda:             # 勘誤連結 URL

citations:              # 同術語模板格式

reviewed_by:            # 方法論段落審校者署名
```

### 11.3 書目投稿模板

```yaml
schema_version: "1.1"

# === 最低要求（必填） ===
title:                  # 原文書名
author:                 # 多作者用「;」分隔
year:                   # 原文出版年
publisher:              # 原文出版社

language:               # en / ja / zh / 其他語言代碼
has_zh_translation:     # true / false

book_type:              # academic / popular / fiction / memoir / reference

topic_tags: []          # 1-4 個
reader_tags: []         # 1-3 個
difficulty:             # entry / intermediate / advanced

abstract_zh: |
  # 100-300 字中文書摘
  # 結構：主要論點（1-2句）→ 方法/視角（1句）→ 領域位置（1句）
  # 如無法撰寫，請填「策展人排程」

curator_note: |
  策展人註：（1-5 句）
  # 如你是投稿者，可留空，由策展人撰寫

contributor:
created_date: 2026-XX-XX
last_reviewed: 2026-XX-XX

# === 進階欄位（選填） ===
title_zh:               # 中文譯名（若有正式中譯本）
translator:             # 中譯本譯者
year_zh_translation:    # 中譯本出版年
publisher_zh:           # 中譯本出版社
isbn:

editions:               # 多版本記錄（經典書如 SM101 多版）
  - version:
    year:
    isbn:
    note:

out_of_print:           # true / false

recommended_chapters:   # 推薦章節（厚重文集適用）
  - chapter:
    pages:
    note:

access_links:           # 取得方式（v1.1 結構化）
  - type:               # amazon / openlibrary / bookstore-tw / library / publisher / archive-org / other
    url:
    note:

caveats:
  - type:
    note:

audience_warning: []

citations:              # 同術語模板格式

reviewer:               # 審校者署名
```

---

## 十二、行為準則

### 核心原則

**這是一個知識協作空間，不是意見表達或社群互動的場域。**

以下行為在本站的貢獻流程中不被接受：
- 在 Issue 或 PR 討論中攻擊其他貢獻者（包括策展人）
- 使用本站貢獻管道進行宣傳、招募或推廣個人/組織
- 提交你知道資訊不實的內容
- 試圖繞過主編鎖定區的機制

### 對爭議內容的立場

本站不是意見仗的戰場。如果你對本站的某個立場有學術層面的異議，請：
1. 開一個 Issue，附上你的來源
2. 說明「現有內容」和「你的依據」之間的具體差異
3. 不使用情緒性語言

策展人會認真考慮有文獻依據的異議。但最終決定由策展人做，沒有投票機制。

### 關於「圈內政治」

本站刻意迴避圈內的身分政治和社群紛爭。投稿請專注在學術文獻和術語定義，不要在投稿內容中表達對圈內某個群體/傾向/實踐方式的立場。

---

## 十三、OA 論文全文翻譯投稿（v1.3 新增）

對於 **CC BY 授權**的 OA 學術論文，本站接受全文中譯投稿。流程如下：

### 13.1 授權確認（必跑）

| 原文授權狀態 | 本站處理 |
|------------|---------|
| **CC BY 4.0 / CC BY 3.0** | ✅ 全文翻譯，譯本以 CC BY-SA 4.0 釋出 |
| **CC BY-SA / CC BY-NC** | ⚠️ 視 license 條款判斷；策展人會審 |
| **作者預印本（PsyArXiv / SSRN）** | ⚠️ 翻 preprint 版，不翻 published 版 |
| **Paywalled** | ❌ 不翻全文。改用策展摘要（150-400 字）放 bibliography |

### 13.2 對應規則

translation 必須對應一篇已存在的 bibliography 條目：

```
content/bibliography/li-2024.md           ← 須先存在
content/translations/li-2024-zh.md        ← 翻譯（slug 加 -zh suffix）
```

如 bibliography 條目尚未建立，請**先**提交 bibliography 條目 PR，再提交翻譯 PR。

### 13.3 frontmatter 模板

```yaml
---
title: "中文翻譯標題"
original_title: "Original English Title"
authors: "Author, A.; Co-author, B."
journal: "Journal Name"
year: 2024
volume: 53                # 選填
issue: 6                  # 選填
pages: "2269-2276"        # 選填
doi: "10.1007/..."
license: "CC BY 4.0"      # 原文授權
translator: "[圈名] / 譯者署名"
translation_date: "2026-05-04"
note: "本翻譯基於 CC BY 4.0 授權進行。原文版權歸原作者所有。翻譯版以 CC BY-SA 4.0 釋出。"
---

# 中文翻譯標題

[原作者名]

[正文翻譯⋯]
```

### 13.4 翻譯流程

```
1. 確認原文 license（CC BY 系列）
2. AI 初譯（Claude / GPT 等）
3. 術語層校對：對照 content/glossary/ 確保術語一致
4. 方法論段落人工複審
5. 不直譯，重新用中文讀者視角組織
6. 完整保留 attribution（原作者 / 期刊 / DOI）
```

### 13.5 站內呈現（自動）

提交後策展人合入，站內會自動：
- `/translations/{slug}-zh` 路由生成全文閱讀頁
- `/bibliography/{slug}` 詳情頁 meta bar 自動顯示「中文翻譯 → 閱讀全文中譯」cross-link
- `/bibliography/` index 卡片左上自動顯示紅底「譯」marker

---

## 附錄 A：常用來源資源

找論文：
- [PsyArXiv](https://psyarxiv.com/)（心理學預印本）
- [SSRN](https://www.ssrn.com/)（社會科學預印本）
- [Unpaywall](https://unpaywall.org/)（查找合法 open access 版本）

找書：
- [Open Library](https://openlibrary.org/)（免費借閱）
- [WorldCat](https://www.worldcat.org/)（圖書館館藏查詢）

APA 格式驗證：
- [APA Style 官方網站](https://apastyle.apa.org/)

> **請勿**上傳版權內容到本 repo。引用受版權保護的論文/書籍時，僅引用 metadata + DOI/ISBN，不複製全文。

---

## 附錄 B：變更紀錄

### v1.3（2026-05-04）

**對齊 about §定位 v1.3 + §編輯立場 v1.4 + translations collection v0.8.0**：

- §一 站定位描述升級：「英文學術文獻」→「國際學術知識 × 台灣文化的統合轉譯」
  （含日文、中文圈、台灣原生作品）
- §五 貢獻方式表新增「OA 論文全文翻譯」類別
- 新增 §十三 OA 論文全文翻譯投稿章節：
  - 13.1 授權確認表（CC BY 4.0/3.0 接受 / paywalled 拒絕）
  - 13.2 對應規則：translation slug 加 `-zh` suffix 對應 bibliography
  - 13.3 frontmatter 完整模板
  - 13.4 翻譯流程（同 AGENTS.md § 4）
  - 13.5 站內呈現（cross-link、index marker 自動）

### v1.2（2026-05-03）

- §二.3b 站方產製條目慣例：`contributor: kinkref` + `contributor_note` AI 透明標示
- 對齊 about §治理模型 三角色架構（kinkref / 繆思 Muse / 策展人薩約）

### v1.1（2026-05-02）

**新增章節**：
- 第二節：貢獻者名稱認列（澄清 git id ≠ contributor 欄位的關係）
- 第七節：PR 提交前自檢清單（四層結構：結構性 / 內容 / OPSEC / 提交格式 + 可複製範本）

**模板對齊 CONTENT_SCHEMA.md v1.1**：
- 所有模板新增 `schema_version: "1.1"`
- 標籤列表更新（移除 `glossary`、新增 `gender-sexuality` / `subculture-ethnography` / `practice-specific`、`partner-family` 改 `loved-ones`、新增 `educator` / `policy-maker`）
- 篇幅數字更新（術語 150-400 / 書摘 100-300 / 論文摘要 150-400）
- 術語模板：`bdsmtest_archetype` 改 `external_references`，新增 `disambiguation` / `usage_notes` / `controversies` / `aliases_en` 進階欄位
- 論文模板：新增 `study_type`（必填）/ `methodology_keywords` / `sample_size` / `original_abstract` / `caveats` / `replication_status` / `oa_type` 等
- 書目模板：新增 `translator` / `editions` / `out_of_print` / `recommended_chapters` / `caveats`，`access_links` 改結構化
- 所有模板：`last_reviewed` 改必填

**其他修正**：
- 第六節 PR 流程：明確 PR 標題格式與描述建議格式
- 第八節（原第六節）：commit history 紀錄改用「git author」描述，與第二節呼應
- 第十節新增「未通過自檢」拒絕原因
- 開放投稿區新增「術語辨析（disambiguation）」類型

### v1.0（2026-05-02）

初版發布。

---

*CONTRIBUTING.md v1.3 — 內容團隊草擬 + 工程整合，2026-05-04*
*本文件本身為開放投稿區，歡迎以 PR 改善不清楚的說明。*
