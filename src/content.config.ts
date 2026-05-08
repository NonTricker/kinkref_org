/**
 * Astro Content Collections — Schema Definitions
 *
 * Mirror of docs/CONTENT_SCHEMA.md (v1.4).
 * Three collections currently active: glossary / books / bibliography (papers).
 *
 * v1.3 新增 5 個 type 的 schema 定義（journals / counselors / legal / campus-groups / medical）
 *      待織法者整合，見 BDSMWebsite/HANDOFF_TO_WEAVER_2026-05-03.md。
 * v1.4 修正：bibliography 中 doi 改為選填 + 新增 article_url + refine 驗證「doi 或 article_url 至少一個」。
 * v1.5 counselors collection 上線：
 *      - license_number (string) → licenses (string[])，可表達多證號
 *      - 新增 referral_source enum（禁羈名單 / 自薦），
 *        ※ 禁羈名單與自薦皆為心理師主動同意收錄，差別僅在資格審查方
 *      - 新增 institution / contact_method_label / affiliation_extra
 *      - Iron Law: repo 是公開的，PII（手機、私 email、未公開地址）絕不入 schema。
 *        內部聯絡資訊放 internal/counselors/REGISTRY.md（不入 git）。
 * v1.6 counselors 升級（基於 #009-#015 7 位新增資料）：
 *      - 新增 pro_bono（公益訊號）— 對社群福祉有實質意義
 *      - 新增 introduction（自介 / 邀請語）— 保留本人原話風格
 *      - 新增 contact_phone（機構公開電話 ONLY，個人手機絕不入）
 *      - 新增 contact_extras（多管道：LINE / IG / 補助頁等）
 *      - 對 4 個 collection 的 contact_email 欄位加紅線註解
 *        （2026-05-08 PII 事故教訓 — 詳見 counselors.contact_email 註解）
 *
 * Content SSOT 位於 repo 根目錄 `content/`，
 * 透過 Content Layer `glob` loader 讀入。
 *
 * Iron Law: 任何 frontmatter 欄位異動必須同步更新 CONTENT_SCHEMA.md。
 * 任何 schema 異動需 bump schema_version。
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ──────────────────────────────────────────────────────
// Shared sub-schemas
// ──────────────────────────────────────────────────────

const externalReferenceSchema = z.object({
  source: z.string(),
  name: z.string().nullish(),
  url: z.string().url().nullish(),
});

// citation.type 與 caveat.type 為「開放枚舉」（CONTENT_SCHEMA.md §4）
// 業務規則檢查交給 scripts/quality-scan.py 與 detection-rules.yaml
// 此處只做型別保證與必填欄位，不限縮 enum。
const citationSchema = z.object({
  type: z.string(), // 例：internal-paper / internal-book / internal-glossary / external
  ref: z.string().nullish(),
  url: z.string().url().nullish(),
  doi: z.string().nullish(),
  apa: z.string().nullish(),
  note: z.string().nullish(),
});

const caveatSchema = z.object({
  type: z.string(), // 例：methodology / cultural-context / legal-context / dated / sample-bias 等
  note: z.string(),
});

const revisionSchema = z.object({
  date: z.string(),
  version: z.string(),
  by: z.string(),
  note: z.string(),
});

// ──────────────────────────────────────────────────────
// Topic / Reader tag enums
//
// SSOT：scripts/data/detection-rules.yaml（靈範師維護）
// 修改任何 tag 都必須同步更新 detection-rules.yaml + CONTENT_SCHEMA.md
// ──────────────────────────────────────────────────────

const topicTagEnum = z.enum([
  // 同意 / 安全 / 倫理
  'consent',
  'aftercare',
  'harm-reduction',
  'legal',
  // 心理 / 神經科學
  'psychopathology',
  'neuroscience',
  // 文化與方法
  'cross-cultural',
  'methodology',
  // 身分與動態
  'identity',
  'relationship-dynamics',
  'gender-sexuality',
  // 文化研究 / 實踐
  'subculture-ethnography',
  'practice-specific',
  'history',
]);

const readerTagEnum = z.enum([
  'beginner',
  'practitioner',
  'researcher',
  'clinical',
  'legal-pro',
  'educator',
  'media',
  'policy-maker',
  'loved-ones',
]);

// ──────────────────────────────────────────────────────
// Glossary collection
// ──────────────────────────────────────────────────────

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/glossary' }),
  schema: z.object({
    schema_version: z.string(),
    term_zh: z.string(),
    term_en: z.string(),
    term_ja: z.string().nullish(),
    term_alt_zh: z.string().nullish(),
    aliases_en: z.string().nullish(),
    tagline: z.string().max(60),
    definition: z.string(),
    disambiguation: z
      .array(
        z.object({
          vs: z.string(),
          note: z.string(),
        })
      )
      .nullish(),
    usage_notes: z.string().nullish(),
    controversies: z.string().nullish(),
    origin_year: z.string().nullish(),
    first_source: z.string().nullish(),
    first_source_doi: z.string().nullish(),
    related_terms: z.array(z.string()).nullish(),
    external_references: z.array(externalReferenceSchema).nullish(),
    citations: z.array(citationSchema).nullish(),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    reader_tags: z.array(readerTagEnum).min(1).max(3),
    contributor: z.string(),
    contributor_note: z.string().nullish(),  // v1.2 新增
    reviewer: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
    revision_history: z.array(revisionSchema).nullish(),
  }),
});

// ──────────────────────────────────────────────────────
// Books collection
// ──────────────────────────────────────────────────────

const editionSchema = z.object({
  version: z.string(),
  // v1.5：年份允許 null（早期譯本年份不可考時用 null + note 註明）
  year: z.number().nullish(),
  isbn: z.string().nullish(),
  note: z.string().nullish(),
});

const recommendedChapterSchema = z.object({
  chapter: z.string(),
  pages: z.string().nullish(),
  note: z.string().nullish(),
});

const accessLinkSchema = z.object({
  type: z.enum([
    'amazon',
    'openlibrary',
    'bookstore-tw',
    'library',
    'publisher',
    'archive-org',
    'archive', // v1.6：archive-org 的別名（內容團隊偏好簡稱）
    'gutenberg', // v1.6：Project Gutenberg 公版電子書平台
    'wikipedia', // v1.5：學術書目常引 wikipedia 條目作 quick overview
    'review', // v1.6：書評 link（學術書評 / journal review / Goodreads 等）
    'other',
  ]),
  url: z.string().url(),
  note: z.string().nullish(),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/books' }),
  schema: z.object({
    schema_version: z.string(),
    title: z.string(),
    title_zh: z.string().nullish(),
    author: z.string(),
    translator: z.string().nullish(),
    year: z.number(),
    year_zh_translation: z.number().nullish(),
    publisher: z.string(),
    publisher_zh: z.string().nullish(),
    isbn: z.string().nullish(),
    editions: z.array(editionSchema).nullish(),
    language: z.string(),
    has_zh_translation: z.boolean(),
    out_of_print: z.boolean().nullish(),
    book_type: z.enum(['academic', 'popular', 'fiction', 'memoir', 'reference']),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    // v1.5：books reader_tags max 從 3 提到 5（綜合性著作如 ethical-slut 跨 4 群讀者）
    reader_tags: z.array(readerTagEnum).min(1).max(5),
    difficulty: z.enum(['entry', 'intermediate', 'advanced']),
    abstract_zh: z.string(),
    curator_note: z.string(),
    recommended_chapters: z.array(recommendedChapterSchema).nullish(),
    access_links: z.array(accessLinkSchema).nullish(),
    caveats: z.array(caveatSchema).nullish(),
    audience_warning: z.array(z.string()).nullish(),
    citations: z.array(citationSchema).nullish(),
    contributor: z.string(),
    contributor_note: z.string().nullish(),  // v1.2 新增
    reviewer: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
  }),
});

// ──────────────────────────────────────────────────────
// Bibliography (Papers) collection
// ──────────────────────────────────────────────────────

const bibliography = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/bibliography' }),
  schema: z
    .object({
      schema_version: z.string(),
      title: z.string(),
      authors: z.string(),
      year: z.number(),
      journal: z.string(),
      volume: z.string().nullish(),
      issue: z.string().nullish(),
      pages: z.string().nullish(),
      // v1.4: doi 改選填，新增 article_url（給無 Crossref DOI 的論文，如 EJHS、學位論文等）
      doi: z.string().nullish(),
      article_url: z.string().url().nullish(),
      access_type: z.enum(['open-access', 'paywalled', 'preprint-available']),
    oa_type: z.enum(['gold', 'green', 'bronze', 'hybrid', 'diamond']).nullish(),
    preprint_url: z.string().url().nullish(),
    study_type: z.enum([
      'quantitative',
      'qualitative',
      'mixed-methods',
      'theoretical',
      'review',
      'systematic-review',
      'meta-analysis',
      'case-study',
      'ethnography',
      'commentary',
    ]),
    methodology_keywords: z.array(z.string()).nullish(),
    sample_size: z.union([z.number(), z.string()]).nullish(),
    sample_population: z.string().nullish(),
    original_abstract: z.string().nullish(),
    translation_status: z.enum([
      'full-translation',
      'partial-translation',
      'abstract-only',
      'planned',
      'none',
    ]),
    translation_url: z.string().nullish(),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    reader_tags: z.array(readerTagEnum).min(1).max(3),
    difficulty: z.enum(['entry', 'intermediate', 'advanced']),
    abstract_zh: z.string(),
    curator_note: z.string(),
    caveats: z.array(caveatSchema).nullish(),
    audience_warning: z.array(z.string()).nullish(),
    replication_status: z
      .enum(['replicated', 'partially-replicated', 'failed-replication', 'disputed', 'unknown'])
      .nullish(),
    corrigenda: z.string().url().nullish(),
    citations: z.array(citationSchema).nullish(),
    contributor: z.string(),
    contributor_note: z.string().nullish(),
    reviewed_by: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
  })
    .refine(
      (data) => Boolean(data.doi) || Boolean(data.article_url),
      {
        message: 'paper 條目必須有 doi 或 article_url 至少一個（v1.4）',
        path: ['doi'],
      }
    ),
});

// ──────────────────────────────────────────────────────
// Journals collection (v1.3 新增)
// ──────────────────────────────────────────────────────

// v1.9：subscription 加入 enum（學術出版業用「訂閱制」比 paywalled 更精確）
const accessTypeJournalEnum = z.enum(['diamond-oa', 'gold-oa', 'hybrid', 'paywalled', 'subscription']);
const acceptsBdsmEnum = z.enum([
  'yes', // v1.9：未細分頻率時的通用值（內容團隊偏好簡稱）
  'yes-frequent',
  'yes-occasional',
  'yes-but-rare',
  'unclear',
  'unknown',
]);

const journals = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './content/journals' }),
  schema: z.object({
    schema_version: z.string(),
    title: z.string(),
    title_zh: z.string().nullish(),
    abbreviation: z.string().nullish(),
    issn_print: z.string().nullish(),
    issn_online: z.string().nullish(),
    publisher: z.string(),
    founded: z.number().nullish(),
    website: z.string().url(),
    language: z.string(),
    scope: z.string(),
    accepts_bdsm: acceptsBdsmEnum,
    bdsm_history: z.string().nullish(),
    access_type: accessTypeJournalEnum,
    // v1.9：oa_apc_usd 接受 number 或 string——某些期刊有範圍 APC（如 "1931-2382"）
    oa_apc_usd: z.union([z.number(), z.string()]).nullish(),
    impact_factor: z.number().nullish(),
    impact_factor_year: z.number().nullish(),
    impact_factor_source: z
      .enum(['JCR', 'Scopus', 'journal-self-reported', 'other'])
      .nullish(),
    // v1.9：放寬 ranking_quartile 至 z.string()——同期刊在不同 subject category
    // 可有不同 quartile（如「Q1 (Urology)」），strict enum 太窄
    ranking_quartile: z.string().nullish(),
    submission_url: z.string().url().nullish(),
    review_time_weeks: z.string().nullish(),
    acceptance_rate_pct: z.number().nullish(),
    typical_article_length: z.string().nullish(),
    abstract_zh: z.string(),
    curator_note: z.string(),
    caveats: z.array(caveatSchema).nullish(),
    citations: z.array(citationSchema).nullish(),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    reader_tags: z.array(readerTagEnum).min(1).max(3),
    contributor: z.string(),
    contributor_note: z.string().nullish(),
    reviewer: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
  }),
});

// ──────────────────────────────────────────────────────
// Counselors collection (v1.3 新增)
// 收錄原則：listing_consent: true、self-attestation 為主、12 個月 re-verify
// ──────────────────────────────────────────────────────

const counselors = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './content/counselors' }),
  schema: z.object({
    schema_version: z.string(),
    name: z.string(),
    pronouns: z.string().nullish(),
    credentials: z.array(z.string()),
    /**
     * 證號（複數，v1.5）
     * 範例：['諮心字 003363', '台灣性諮商學會性諮商師 23002']
     * 政策：當事人主動提供才列；未列出 ≠ 未具備資格
     */
    licenses: z.array(z.string()).nullish(),
    specialty: z.array(z.string()),
    kink_friendly_statement: z.string(),
    location: z.string(),
    /**
     * 機構（v1.5）— location 是地區（縣市）；institution 是執業單位
     * 多單位可在同一字串裡用 / 分隔，或前端 split 後 list
     */
    institution: z.string().nullish(),
    service_modes: z.array(z.enum(['in-person', 'online', 'hybrid'])),
    languages: z.array(z.string()),
    /**
     * 預約 email — ⛔ 紅線欄位（2026-05-08 事故教訓）
     *
     * 只能填寫當事人「明確同意作為公開預約管道」的 email。
     *
     * Decision rule（書記官 / agent / 任何想加 counselor 條目者請讀這裡）：
     *   1. 來源是禁羈名單？查 REGISTRY 該 entry 的「備註」欄是否註明
     *      「本人主動公開為預約管道」/「本人於名單上將同一 email 同時
     *      作為預約方式公開」之類字樣 → 才能填。
     *   2. 來源是自薦？來信本身對「公開 email 為預約管道」是否有
     *      明確、書面、針對該頁面的同意 → 才能填。
     *   3. 模糊 / 簽名檔附帶 / 「re-verify 用」/ 任何有疑慮的情況
     *      → 不填，留 internal/counselors/REGISTRY.md。
     *
     * Iron Law: repo 公開。schema 欄位 ≠ 不公開。即使前端不渲染，
     *   .md 檔案內容會被 GitHub 全文搜尋、fork、scraper 拿到。
     *
     * 2026-05-08 事故記錄：曾將 7 個 re-verify 用的 email 誤填此欄，
     *   導致 PII 進入 git history，需 force-push rewrite + GitHub Support
     *   申請 GC。所有人時間損失約 90 分鐘 + 對 7 位心理師的 trust 風險。
     *
     * 通過此 review 的歷史 OK 案例：#007 徐維廷、#011 曾御俊、#013 史捷、
     *   #014 林瑞敏、#015 陳丁豪、其他自薦時當事人明確聲明者。
     */
    contact_email: z.string().email().nullish(),
    contact_website: z.string().url().nullish(),
    /**
     * 預約管道顯示文字（v1.5）— 例如「機構官方網站 / 官方 LINE @xxx」
     * 給前端詳情頁顯示用，contact_website 是 URL，這個是描述
     */
    contact_method_label: z.string().nullish(),
    /**
     * 機構公開電話（v1.6）— 例如「(03) 335-9532 分機 401」
     * Iron Law: 僅機構公開電話（事務所總機 / 諮商所分機），絕不接受個人手機。
     * 個人手機留 internal/counselors/REGISTRY.md。
     */
    contact_phone: z.string().nullish(),
    /**
     * 額外管道（v1.6）— LINE / IG / 補助方案頁 / 其他公開連結
     * 每個 entry: { label: 顯示文字, url?: 可點擊連結 }
     * 例：{ label: '官方 LINE @984fwzkq', url: 'https://line.me/...' }
     */
    contact_extras: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url().nullish(),
        })
      )
      .nullish(),
    /**
     * 額外協會 / 機構身份（v1.5）— 例如「道埕協會秘書長」
     * Iron Law: 必須當事人明確同意公開才填，簽名檔附帶資訊不算同意
     */
    affiliation_extra: z.array(z.string()).nullish(),
    /**
     * 邀請語 / 自介長文（v1.6）— 保留本人原話風格
     * 例：「我是名專門做伴侶/婚姻/親友/家族的諮商心理師...」（#010 蔡佳賢）
     * 沒填就不渲染（不強迫每位心理師都要寫）
     */
    introduction: z.string().nullish(),
    /**
     * 公益訊號（v1.6）— 對社群福祉有實質意義
     * - available: 是否提供公益管道
     * - note: 簡短說明（例：「可提供公益諮詢」）
     * - programs: 具體補助方案清單（例：「15-45 歲青壯年方案」）
     */
    pro_bono: z
      .object({
        available: z.boolean(),
        note: z.string().nullish(),
        programs: z.array(z.string()).nullish(),
      })
      .nullish(),

    // ─────────────────────────────────────────────────────
    // 為什麼這裡沒有 contact_phone / contact_phone_internal 欄位？
    //
    // ❌ Iron Law（律法家 + 執政官 2026-05-08）：
    //    repo 是公開的。schema 欄位 ≠ 不公開——即使前端不渲染，
    //    .md 檔案內容會被 GitHub 全文搜尋、fork、scraper 拿到。
    //    任何 PII（手機、私 email、未公開地址）絕不入 schema。
    //
    // ✅ 內部聯絡資訊請放：
    //    `internal/counselors/REGISTRY.md`（不入 git）
    // ─────────────────────────────────────────────────────
    /**
     * 來源（v1.5）— 區分資格審查方
     * - 禁羈名單：禁羈友善助人者資源網代審
     * - 自薦：站方自行收件
     * 兩者皆為心理師主動同意收錄
     */
    referral_source: z.enum(['禁羈名單', '自薦']).nullish(),
    listing_consent: z.boolean(),
    self_attestation: z.boolean(),
    last_verified: z.coerce.date(),
    verification_method: z.enum([
      'direct-contact',
      'public-page-confirmed',
      'peer-referred',
    ]),
    caveats: z.array(caveatSchema).nullish(),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    reader_tags: z.array(readerTagEnum).min(1).max(3),
    contributor: z.string(),
    contributor_note: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
  }),
});

// ──────────────────────────────────────────────────────
// Legal collection (v1.3 新增)
// ──────────────────────────────────────────────────────

const legal = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './content/legal' }),
  schema: z.object({
    schema_version: z.string(),
    entry_type: z.enum(['lawyer', 'law-firm', 'legal-aid', 'statute-reference']),
    name: z.string(),
    bar_admission: z.string().nullish(),
    specialty: z.array(z.string()),
    location: z.string().nullish(),
    service_modes: z.array(z.string()).nullish(),
    languages: z.array(z.string()).nullish(),
    /**
     * 預約 email — ⛔ 紅線欄位。
     * 規則同 counselors.contact_email（見上方完整註解）：
     * 只能填當事人「明確同意作為公開預約管道」的 email。
     * 律師事務所總信箱通常 OK；個人律師私 email 必須有書面同意。
     */
    contact_email: z.string().email().nullish(),
    /**
     * 機構公開電話（事務所總機 / 診所總機）。
     * Iron Law: 不接受個人手機。個人聯絡資訊放 internal/ 不入 git。
     */
    contact_phone: z.string().nullish(),
    contact_website: z.string().url().nullish(),
    statute_url: z.string().url().nullish(),
    description: z.string(),
    bdsm_relevance: z.string().nullish(),
    listing_consent: z.boolean(),
    self_attestation: z.boolean(),
    last_verified: z.coerce.date(),
    caveats: z.array(caveatSchema).nullish(),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    reader_tags: z.array(readerTagEnum).min(1).max(3),
    contributor: z.string(),
    contributor_note: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
  }),
});

// ──────────────────────────────────────────────────────
// Campus Groups collection (v1.3 新增)
// ──────────────────────────────────────────────────────

const campusGroups = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './content/campus-groups' }),
  schema: z.object({
    schema_version: z.string(),
    name: z.string(),
    name_en: z.string().nullish(),
    university: z.string(),
    university_en: z.string().nullish(),
    department_affiliation: z.string().nullish(),
    official_status: z.enum(['registered', 'unregistered', 'informal-group']),
    recruitment_open: z.boolean(),
    recruitment_period: z.string().nullish(),
    recruitment_requirements: z.string().nullish(),
    focus_areas: z.array(z.string()),
    bdsm_engagement_level: z.enum([
      'core-focus',
      'partial-focus',
      'friendly-but-not-focus',
    ]),
    /**
     * 社團公開信箱 — ⛔ 紅線欄位。
     * 規則同 counselors.contact_email（見上方完整註解）：
     * 只能填社團對外公開的官方信箱（社團官方代表書面同意），
     * 不接受個別社員的私 email。
     */
    contact_email: z.string().email().nullish(),
    contact_social: z.string().url().nullish(),
    description: z.string(),
    listing_consent: z.boolean(),
    last_verified: z.coerce.date(),
    caveats: z.array(caveatSchema).nullish(),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    reader_tags: z.array(readerTagEnum).min(1).max(3),
    contributor: z.string(),
    contributor_note: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date().nullish(),
  }),
});

// ──────────────────────────────────────────────────────
// Medical collection (v1.3 新增)
// 含緊急/支持熱線（hotline / support-org），可不需 explicit consent
// ──────────────────────────────────────────────────────

const medical = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/README.md'], base: './content/medical' }),
  schema: z.object({
    schema_version: z.string(),
    entry_type: z.enum(['physician', 'clinic', 'hotline', 'support-org']),
    name: z.string(),
    pronouns: z.string().nullish(),
    credentials: z.array(z.string()).nullish(),
    medical_specialty: z.array(z.string()).nullish(),
    kink_friendly_statement: z.string().nullish(),
    services_offered: z.array(z.string()),
    location: z.string().nullish(),
    contact_phone: z.string().nullish(),
    /**
     * 預約 email — ⛔ 紅線欄位。
     * 規則同 counselors.contact_email（見上方完整註解）：
     * 只能填當事人「明確同意作為公開預約管道」的 email。
     * 診所總信箱通常 OK；個人醫師私 email 必須有書面同意。
     */
    contact_email: z.string().email().nullish(),
    contact_website: z.string().url().nullish(),
    languages: z.array(z.string()).nullish(),
    available_hours: z.string().nullish(),
    description: z.string(),
    bdsm_relevance: z.string().nullish(),
    cost: z.enum(['free', 'subsidized', 'private-rate', 'varies']).nullish(),
    listing_consent: z.boolean(),
    last_verified: z.coerce.date(),
    caveats: z.array(caveatSchema).nullish(),
    topic_tags: z.array(topicTagEnum).min(1).max(4),
    reader_tags: z.array(readerTagEnum).min(1).max(3),
    contributor: z.string(),
    contributor_note: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date().nullish(),
  }),
});

// ──────────────────────────────────────────────────────
// Translations collection (v1.8) — 全文中譯
// ──────────────────────────────────────────────────────
// 對應 bibliography 條目的中文全文翻譯（CC BY 授權的開源學術論文）。
// File naming convention：translations/{paper-slug}-zh.md
//   去掉 -zh suffix 即對應 content/bibliography/{paper-slug}.md
//
// frontmatter 對齊內容團隊（繆思 Muse）的標準翻譯格式。
const translations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/translations' }),
  schema: z.object({
    title: z.string(), // 中文翻譯標題
    original_title: z.string(), // 英文原題
    authors: z.string(),
    journal: z.string(),
    year: z.number(),
    volume: z.union([z.number(), z.string()]).nullish(),
    issue: z.union([z.number(), z.string()]).nullish(),
    pages: z.string().nullish(),
    doi: z.string(),
    license: z.string(), // 原文授權（如 CC BY 4.0）
    translator: z.string(), // 翻譯者署名
    translation_date: z.coerce.date(),
    note: z.string(), // 翻譯授權聲明
  }),
});

// ──────────────────────────────────────────────────────
// Guides collection (v1.9 — pillar pages，脈流師 SPEC v1)
// ──────────────────────────────────────────────────────
// 主題包 / topic cluster pillar page。
// 每個 guide 是 curated curation：將既有 entry 編成「給某類讀者的閱讀地圖」。
//
// SSOT: seo/SPEC_guides_pillar_pages_v1.md（脈流師）
// 內容由靈範師 Phase 2 填寫；織法者 Phase 1 只建 skeleton。
//
// File naming：content/guides/{audience}.md（如 beginners.md）

const guideEntryRefSchema = z.object({
  type: z.enum(['glossary', 'bibliography', 'books', 'journals']),
  slug: z.string(),
  why_in_this_cluster: z.string().nullish(),
});

const guideClusterSchema = z.object({
  cluster_title: z.string(),
  cluster_lead: z.string(), // 50-100 字導讀
  entries: z.array(guideEntryRefSchema).min(2).max(10),
});

const guideFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const guideAudienceEnum = z.enum([
  'beginners',
  'practitioners',
  'researchers',
  'clinical',       // M5 預留
  'cross-cultural', // M6 預留
]);

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/guides' }),
  schema: z.object({
    schema_version: z.string(),
    audience: guideAudienceEnum,
    title_zh: z.string(),
    title_en: z.string(), // BreadcrumbList / orientation 用
    tagline: z.string().max(80),
    lead_paragraph: z.string(), // 200-400 字
    estimated_reading_time_min: z.number(),

    // FAQ Q&A pairs（FAQPage Schema 用）
    faq: z.array(guideFaqSchema).min(3).max(8),

    // Curated entry clusters
    clusters: z.array(guideClusterSchema).min(2).max(6),

    // Cross-link to other guides（guide slug / filename ID list）
    // v1.9.1：改用 z.string()（guide slug）取代 guideAudienceEnum——
    //   因為多篇 guide 可共用同一個 audience（如 beginners），用 audience 做 cross-link 不夠用。
    related_guides: z.array(z.string()).nullish(),

    // English orientation note（200-300 字英文）
    english_orientation: z.string(),

    contributor: z.string(),
    contributor_note: z.string().nullish(),
    reviewer: z.string().nullish(),
    created_date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
  }),
});

// ──────────────────────────────────────────────────────
// Export
// ──────────────────────────────────────────────────────

export const collections = {
  glossary,
  books,
  bibliography,
  journals,       // v1.3
  counselors,     // v1.3
  legal,          // v1.3
  campusGroups,   // v1.3（folder: campus-groups）
  medical,        // v1.3
  translations,   // v1.8 全文中譯
  guides,         // v1.9 pillar pages
};
