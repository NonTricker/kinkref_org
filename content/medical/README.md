# Medical — 醫療資源 + 緊急/支持資源 directory

> 對應 schema：CONTENT_SCHEMA.md v1.3 §十三

---

## 狀態

**待填**。schema 已就位，但部分公開緊急資源（如 113 婦幼保護專線、1995 自殺防治專線）可優先收錄為基礎資源。

## entry_type

| 類型 | 適用 | listing_consent |
|------|------|----------------|
| `physician` | 個別醫師 | 必填 true |
| `clinic` | 診所/醫院科別 | 必填 true |
| `hotline` | 緊急熱線（公開資源）| 預設 true（無需個別取得）|
| `support-org` | 支持組織（公開資源）| 預設 true |

## 收錄原則

- ✅ **個別醫師/診所須有 listing_consent**
- ✅ **公開熱線/組織為公共資源**，可直接列入
- ✅ **每 6 個月 re-verify**（醫療資源變動較快）
- ❌ **不背書個人能力**

## 投稿方式

詳見 [CONTRIBUTING.md](../../CONTRIBUTING.md)。
