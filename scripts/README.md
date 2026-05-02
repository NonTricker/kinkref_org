# scripts/ — kinkref.org 自動化工具

本目錄存放投稿與策展用的自動化腳本。所有腳本對齊 `docs/CONTENT_SCHEMA.md` 與 `CONTRIBUTING.md` 的規範。

---

## 工具一覽

| 腳本 | 用途 | 適用對象 |
|------|------|---------|
| `self-check.py` | 投稿前單檔自檢 | **投稿者**（PR 提交前必跑） |
| `quality-scan.py` | 批次掃描整個 `content/` 目錄 + 跨條目驗證 | **策展人 + CI** |
| `data/detection-rules.yaml` | 外部維護的偵測規則庫 | 維護者（修改規則不需動程式碼） |

---

## 安裝需求

```bash
# Python 3.8+ 已內建在現代系統
python --version

# 安裝相依套件
pip install pyyaml

# Windows 用戶建議額外裝 colorama 以支援 ANSI 顏色
pip install colorama
```

---

## `self-check.py` — 投稿前自檢

對應 `CONTRIBUTING.md` 第七節「PR 提交前自檢清單」的自動化版本。

### 用法

```bash
# 基本用法
python scripts/self-check.py content/glossary/dominant.md

# 嚴格模式（警告也視為失敗，CI 友善）
python scripts/self-check.py content/glossary/dominant.md --strict

# 強制指定條目類型（不靠路徑與 frontmatter 自動推斷）
python scripts/self-check.py path/to/file.md --type glossary

# 使用自訂規則檔
python scripts/self-check.py content/glossary/dominant.md --rules custom-rules.yaml
```

### 退出碼

| 退出碼 | 意義 |
|-------|------|
| `0` | 全部通過，或僅警告（非 strict 模式） |
| `1` | 發現錯誤，或 strict 模式下有警告 |
| `2` | 檔案解析失敗（YAML / 路徑錯誤） |

### 檢查模組（共 9 項）

| # | 檢查項 | 對應 schema/規範 |
|---|-------|----------------|
| 1 | Schema 合法性 | schema_version、必填欄位、標籤合法性、enum 值 |
| 2 | Slug 命名 | lowercase、hyphen、長度、禁止字元 |
| 3 | 篇幅規範 | tagline、definition、disambiguation、abstract_zh 等 |
| 4 | 語氣中性化 | 第一人稱、修飾性主觀詞 |
| 5 | 規範性語言 | 「應該」「只有...才算是」等絕對化句型 |
| 6 | AI 寫作偵測 | 塑膠句式、破折號濫用、空洞修飾詞 |
| 7 | 中國用語偵測 | 視頻 / 質量 / 軟件 等（含 false-positive 排除） |
| 8 | 政策禁區 | 安全指引、個人背書、未成年（context-aware）、窒息立場 |
| 9 | 高敏感詞 caveats 強制 | master / slave / ageplayer / DSM 系列等 |

### 範例輸出

通過：

```
🔍 self-check v1.0 — 投稿前自檢
   檔案: dominant.md
   類型: glossary
   schema 版本: v1.1
============================================================

【1】Schema 合法性
  schema_version: 1.1 ✓
  必填欄位完整（共 10 個）

...

============================================================
✅ 全部通過，可以提交
```

失敗：

```
【1】Schema 合法性
  ⛔ schema_version 應為 "1.1"，實際為 "1.0"
  ⛔ 缺少必填欄位: last_reviewed
  ⛔ topic_tag 「glossary」已棄用：v1.1 移除（對術語條目永真冗餘）

【4】語氣中性化
  ⛔ 發現第一人稱/主觀觀察詞: 我認為, 個人觀點, 淺見

============================================================
⛔ 6 個錯誤、2 個警告
```

---

## `data/detection-rules.yaml` — 外部規則庫

所有偵測規則集中在這個 YAML 檔，**修改規則不需要動程式碼**。

### 結構

```yaml
schema:                    # Schema 結構規則（必填欄位、標籤 enum）
  current_version: "1.1"
  required_fields: { ... }
  topic_tags_valid: [ ... ]
  topic_tags_deprecated: { ... }
  ...

length_limits:             # 篇幅規範
  glossary:
    definition: { min: 150, max: 400 }
  ...

neutrality:                # 第一人稱與主觀觀察詞
  forbidden_phrases: [ ... ]

prescriptive_language:     # 規範性語言（regex pattern）
  patterns: [ ... ]

ai_plastic_phrases:        # AI 塑膠句式偵測
  patterns: [ ... ]
  thresholds: { ... }
  hollow_modifiers: [ ... ]

china_terms:               # 中國用語（含 false-positives）
  - cterm: 視頻
    severity: A
    taiwan: 影片
    false_positives: [ ... ]

policy_violations:         # 政策禁區（context-aware）
  underage:
    patterns: [ ... ]
    allowed_in_slug: [ ... ]    # 僅這些條目允許出現
    allowed_only_in_fields: [ ... ]   # 僅這些欄位允許作為保護聲明

required_caveats:          # 高敏感詞 caveats 強制
  ageplayer:
    required_fields: [ caveats, audience_warning ]
    required_in_tagline: [ 成年 ]
    ...
```

### 修改規則的常見場景

| 場景 | 修改位置 |
|------|---------|
| 新增 topic_tag 或 reader_tag | `schema.topic_tags_valid` / `schema.reader_tags_valid` |
| 棄用某個標籤 | 移到 `schema.*_tags_deprecated` 區塊（值為棄用原因說明） |
| 調整篇幅 | `length_limits.<entry_type>.<field>.{min,max}` |
| 加新的塑膠句式 | `ai_plastic_phrases.patterns` 增加 regex |
| 加新的中國用語 | `china_terms` 增加新項目 |
| 為某條目強制 caveats | `required_caveats.<slug>` 增加新規則 |

### Schema 版本升級

當 `CONTENT_SCHEMA.md` 升級到 v1.2/v2.0 時：

1. 更新 `schema.current_version`
2. 更新 `schema.required_fields`（新增/移除欄位）
3. 將舊欄位移到 `*_deprecated` 區塊（軟性提醒）
4. 修改 `length_limits` 或 `enums` 對應變更

---

## `samples/` — 測試樣本

| 檔案 | 用途 | 預期結果 |
|------|------|---------|
| `valid-dominant.md` | 完整合規條目 | ✅ 全部通過 |
| `bad-example.md` | 故意違規（多種錯誤） | ⛔ 6 錯誤 + 2 警告 |
| `ageplayer.md` | 高敏感詞合規條目 | ✅ 通過（僅小警告） |
| `broken-ageplayer.md` | 高敏感詞缺保護聲明 | ⛔ 觸發 §8 + §9 強制檢查 |

### 跑全部測試

```bash
cd kinkref_org
for f in scripts/samples/*.md; do
  echo "=== $f ==="
  python scripts/self-check.py "$f"
  echo ""
done
```

---

## `quality-scan.py` — 批次品質掃描

`self-check.py` 的批次版本，加上跨條目驗證。給策展人定期掃描全 `content/` 用，也適合 CI 整合。

### 用法

```bash
# 掃描整個 content/ 目錄
python scripts/quality-scan.py

# 掃指定子目錄
python scripts/quality-scan.py --path content/glossary

# 掃 samples 目錄（避免汙染 content baseline）
python scripts/quality-scan.py --samples

# JSON 輸出（CI 友善）
python scripts/quality-scan.py --json

# 嚴格模式（minor 也算失敗）
python scripts/quality-scan.py --strict

# 只顯示分數最高的 N 個（快速找最大問題）
python scripts/quality-scan.py --worst 10

# 與上次 baseline 比較，顯示新增 / 惡化 / 改善 / 已修復
python scripts/quality-scan.py --diff
```

### 進階功能（相對 self-check 多出的部分）

| 進階功能 | 說明 |
|---------|------|
| **批次掃描** | 一次掃整個 `content/` 目錄 + rglob 子目錄 |
| **Citations 驗證** | `internal-paper` / `internal-book` / `internal-term` 的 `ref` 指向真實 slug |
| **DOI 格式驗證** | 必須是 `https://doi.org/...` 或 `doi:...` |
| **related_terms 驗證** | 引用的 slug 必須存在於 glossary/ |
| **Baseline 差分** | 與上次掃描的 `data/.quality-baseline.json` 比較 |
| **JSON 輸出** | 完整結構化輸出（CI 整合、儀表板） |
| **評分分級** | 0 pass / 1-3 minor / 4-7 suspect / 8+ critical |

### 評分權重

| 類型 | 權重 |
|------|------|
| 解析失敗 | 10 |
| Schema / 篇幅 / 政策 / caveats 錯誤 | 2 |
| Citations 內部引用錯誤 | 3 |
| Schema / 篇幅 / 政策 / 中性 警告 | 1 |
| related_terms forward reference | 1（開發初期常見，可忽略） |

### Baseline

每次掃描都會自動更新 `data/.quality-baseline.json`，下次跑 `--diff` 即可比較。
**Baseline 檔案不應 commit 到 repo**（建議加入 `.gitignore`）。

### 範例輸出

```
🔍 quality-scan v1.0 — 批次品質掃描
   掃描目錄: content
   檔案數: 12
============================================================

∙ [1] glossary/dominant.md
   ⚠️  [related_terms] related_terms 引用的 "master" 不存在於 glossary/

🔴 [14] glossary/bad-entry.md
   ⛔ [【1】Schema 合法性] schema_version 應為 "1.1"...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 掃描完成: 12 個條目
   ✅ pass: 5  ∙ minor: 6  ⚠️ suspect: 0  🔴 critical: 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 整合 CI（規劃）

未來可在 GitHub Actions 加入：

```yaml
# .github/workflows/self-check.yml
name: PR Self-Check

on:
  pull_request:
    paths:
      - 'content/**/*.md'

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install pyyaml
      - name: Run self-check on changed files
        run: |
          for f in $(git diff --name-only origin/main...HEAD -- 'content/**/*.md'); do
            python scripts/self-check.py "$f" --strict
          done
```

---

## 貢獻規則改進

如果你發現：
- 偵測規則有 false positive（誤殺）→ 在 `china_terms[].false_positives` 加排除模式
- 漏掉某個 AI 塑膠句式 → 在 `ai_plastic_phrases.patterns` 加 regex
- 篇幅應該調整 → 修改 `length_limits`
- 新增的高敏感詞 → 在 `required_caveats` 增加 entry

請開 Issue 討論，或直接提 PR 修改 `detection-rules.yaml`。

---

---

## Acknowledgments

本目錄的兩個腳本在設計骨架上致謝 [Taiwan.md](https://github.com/taiwan-md/taiwan-md) 社群協作的工具集：

- **`self-check.py`**：分區報告格式、中國用語 false-positive 排除模式 — 借鑑 `self-check.sh` v2
- **`quality-scan.py`**：批次掃描架構、評分分級、baseline diff 機制、`--worst` / `--json` 介面 — 借鑑 `quality-scan.sh` v3.x

兩個腳本都是針對 kinkref.org 領域的重新實作（YAML frontmatter schema / 跨條目驗證 / 高敏感詞 caveats 強制 / context-aware 政策偵測 / BDSM 政策禁區等都是本站特有的擴展），但模式來源在此致謝。

---

*scripts/README.md — 靈範師（Muse）撰寫，2026-05-02*
