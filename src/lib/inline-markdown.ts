/**
 * Inline Markdown Renderer (minimal)
 *
 * 用於 frontmatter 字串欄位（definition / usage_notes / abstract_zh ...）
 * 中的 inline emphasis 標記。Astro Content Layer 不會自動 render
 * frontmatter 字串內的 markdown，因此這個 helper 補足這個 gap。
 *
 * 支援的語法（inline only，不含 block-level）：
 *   - **bold**          → <strong>bold</strong>
 *   - *italic*          → <em>italic</em>
 *   - `code`            → <code>code</code>
 *   - [text](url)       → <a href="url">text</a>
 *
 * 用法（搭配 Astro 的 set:html 指令）：
 *   <p set:html={renderInlineMarkdown(text)} />
 *
 * 安全性：
 *   - 先 escape HTML，再做 markdown replace，所以使用者輸入不會 XSS
 *   - URL 端只允許 http / https / mailto / 站內相對路徑（其他協定會被拒）
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/**
 * URL 安全白名單檢查。
 * 接受：http(s)://、mailto:、相對路徑（/...）、anchor（#...）
 * 拒絕：javascript:、data:、vbscript: 等可能注入的協定。
 */
function safeUrl(url: string): string {
  const trimmed = url.trim();
  // 相對路徑或 anchor
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
  // mailto / http(s)
  if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed;
  // 其他一律當作不安全，回退為 #
  return '#';
}

/**
 * Render 純文字（含 inline markdown）為 HTML 片段。
 *
 * @param input  純文字字串（可能含 inline markdown）
 * @returns      HTML 字串（可安全用於 set:html）
 */
export function renderInlineMarkdown(input: string): string {
  // 1. Escape HTML（防 XSS）
  let s = escapeHtml(input);

  // 2. Inline replacements（順序：bold 必須先於 italic，否則 ** 會被 * 規則吃掉）
  // **bold**
  s = s.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
  // *italic*（避開已處理的 strong）
  s = s.replace(/(^|[^\w*])\*([^*\n]+?)\*(?!\w)/g, '$1<em>$2</em>');
  // `code`
  s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
  // [text](url)
  s = s.replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, (_match, text: string, url: string) => {
    const href = escapeHtml(safeUrl(url));
    const isExternal = /^https?:/i.test(url);
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${href}"${attrs}>${text}</a>`;
  });

  return s;
}

/**
 * 移除 inline markdown 標記，回傳純文字（給 <meta>、<title> 等使用）。
 */
export function stripInlineMarkdown(input: string): string {
  return input
    .replace(/\*\*([^*\n]+?)\*\*/g, '$1')
    .replace(/\*([^*\n]+?)\*/g, '$1')
    .replace(/`([^`\n]+?)`/g, '$1')
    .replace(/\[([^\]]+?)\]\([^)]+?\)/g, '$1');
}

/**
 * 把含 \n\n 的長字串切成段落，每段 render inline markdown。
 *
 * @returns  HTML 段落字串陣列（直接 .map 成 <p set:html={...}>）
 */
export function renderParagraphs(input: string): string[] {
  return input
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map(renderInlineMarkdown);
}
