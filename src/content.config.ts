/**
 * Astro Content Collections — Schema Definitions
 *
 * Mirror of docs/CONTENT_SCHEMA.md (v1.4).
 * Three collections currently active: glossary / books / bibliography (papers).
 *
 * v1.3 新增 5 個 type 的 schema 定義（journals / counselors / legal / campus-groups / medical）
 *      待織法者整合，見 BDSMWebsite/HANDOFF_TO_WEAVER_2026-05-03.md。
 * v1.4 修正：bibliography 中 doi 改為選填 + 新增 article_url + refine 驗證「doi 或 article_url 至少一個」。
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
    'wikipedia', // v1.5：學術書目常引 wikipedia 條目作 quick overview
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

const accessTypeJournalEnum = z.enum(['diamond-oa', 'gold-oa', 'hybrid', 'paywalled']);
const acceptsBdsmEnum = z.enum([
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
    oa_apc_usd: z.number().nullish(),
    impact_factor: z.number().nullish(),
    impact_factor_year: z.number().nullish(),
    impact_factor_source: z
      .enum(['JCR', 'Scopus', 'journal-self-reported', 'other'])
      .nullish(),
    ranking_quartile: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).nullish(),
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
    license_number: z.string().nullish(),
    specialty: z.array(z.string()),
    kink_friendly_statement: z.string(),
    location: z.string(),
    service_modes: z.array(z.enum(['in-person', 'online', 'hybrid'])),
    languages: z.array(z.string()),
    contact_email: z.string().email().nullish(),
    contact_website: z.string().url().nullish(),
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
    contact_email: z.string().email().nullish(),
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
};
