/**
 * caveat-labels.ts — caveat type 中文 label lookup
 *
 * v0.7.1（schema doc v1.7 配套）：
 *   把 caveat.type 的英文 raw ID 翻譯成讀者友善的中文 label。
 *   未列入此 table 的 type 會 fallback 顯示原始 ID（避免 UI 崩）。
 *
 * Source: docs/CONTENT_SCHEMA.md §4.3 caveat type 表（v1.7）
 */

export interface CaveatLabel {
  /** 顯示給讀者的中文 label */
  zh: string;
  /** 訊號類型：warning（學術警告）vs trust（策展信度聲明） */
  signal: 'warning' | 'trust';
  /** 對 trust 訊號：positive（信度高）/ negative（信度限制） */
  tone?: 'positive' | 'negative';
}

const CAVEAT_LABELS: Record<string, CaveatLabel> = {
  // ── 學術警告（warning）── 寫在「注意事項」區塊
  methodology: { zh: '方法論限制', signal: 'warning' },
  'cultural-context': { zh: '文化語境提醒', signal: 'warning' },
  dated: { zh: '年代久遠', signal: 'warning' },
  controversy: { zh: '學術爭議', signal: 'warning' },
  'legal-context': { zh: '法律語境', signal: 'warning' },
  scope: { zh: '主題範疇', signal: 'warning' },
  difficulty: { zh: '閱讀難度', signal: 'warning' },
  'tier-classification': { zh: '書架分類', signal: 'warning' },
  'harmful-framework': { zh: '歷史性有害框架', signal: 'warning' },
  posthumous: { zh: '死後出版', signal: 'warning' },
  'volume-scope': { zh: '卷次範圍', signal: 'warning' },

  // ── 策展信度聲明（trust）── 抽出來放 meta bar
  'source-verified': { zh: '全文閱讀', signal: 'trust', tone: 'positive' },
  'source-limited': { zh: '公開摘要為主', signal: 'trust', tone: 'negative' },
};

/** 取 caveat type 的中文 label（找不到 fallback 顯示原 type） */
export function caveatLabel(type: string): string {
  return CAVEAT_LABELS[type]?.zh ?? type;
}

/** 取 caveat 的訊號分類（用於 UI 分流） */
export function caveatSignal(type: string): 'warning' | 'trust' | 'unknown' {
  return CAVEAT_LABELS[type]?.signal ?? 'unknown';
}

/** 取 trust caveat 的 tone（positive/negative） */
export function caveatTone(type: string): 'positive' | 'negative' | undefined {
  return CAVEAT_LABELS[type]?.tone;
}

/** 從 caveats array 過濾出策展信度聲明（trust signal） */
export function pickTrustSignal<T extends { type: string }>(
  caveats: T[] | null | undefined
): T | undefined {
  if (!caveats) return undefined;
  return caveats.find((c) => caveatSignal(c.type) === 'trust');
}

/** 從 caveats array 過濾出學術警告（排除 trust signals） */
export function pickWarnings<T extends { type: string }>(
  caveats: T[] | null | undefined
): T[] {
  if (!caveats) return [];
  return caveats.filter((c) => caveatSignal(c.type) !== 'trust');
}
