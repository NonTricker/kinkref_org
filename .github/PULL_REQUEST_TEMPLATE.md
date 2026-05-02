<!--
感謝你的貢獻！提交前請確認以下項目。
完整貢獻指南：CONTRIBUTING.md
資料結構規範：docs/CONTENT_SCHEMA.md
-->

## 變更類型

<!-- 勾選對應項目 -->

- [ ] 新增術語條目（content/glossary/）
- [ ] 新增論文摘要（content/bibliography/）
- [ ] 新增書摘（content/books/）
- [ ] 翻譯（已存在條目的延伸翻譯）
- [ ] 內容勘誤
- [ ] 站台程式碼 / 樣式
- [ ] 文件（README / CONTRIBUTING / docs/）
- [ ] 其他：

## 摘要

<!-- 一兩句話描述這個 PR 做了什麼 -->

## PR 自檢清單

<!-- 對應 CONTRIBUTING.md § 7 -->

### 內容類 PR

- [ ] frontmatter 符合 `docs/CONTENT_SCHEMA.md` v1.1
- [ ] 所有事實性斷言都有引用（DOI / ISBN / 標明社群口傳）
- [ ] 區分共識、單一研究、爭議三類斷言
- [ ] 不含安全操作指引
- [ ] 不含個人 / 工作室推薦
- [ ] 不含色情意象描述
- [ ] 跑過 `npm run selfcheck`（如已 setup Python 環境）

### 程式碼類 PR

- [ ] `npm run check`（Astro type check）通過
- [ ] `npm run build` 通過
- [ ] `npm run lint` 通過
- [ ] 無新的 console error / warning

### OPSEC（如你是圈內人匿名貢獻）

- [ ] 使用了 GitHub 專屬帳號（非主帳號）
- [ ] 設定了 directory-scoped git config
- [ ] commit author 用 GitHub noreply email
- [ ] frontmatter `contributor` 欄位用圈名

## 相關 Issue

<!-- 如關閉某個 Issue，使用 "Closes #123" -->

## 補充說明

<!-- 任何審查者需要知道的脈絡 -->
