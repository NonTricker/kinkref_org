#!/usr/bin/env python3
"""
add-internal-links.py — 半自動給 glossary entry 的 frontmatter 文字加 internal link

策略：
1. 建 slug → (term_en, term_zh) lookup table
2. 對每條 entry 的 related_terms 列表
3. 在 definition / usage_notes / disambiguation 找 mention 的 term_en 或 term_zh
4. 只替換第一次出現 → [term_en（term_zh）](/glossary/slug) 或反之
5. 跳過已經在 markdown link 內的（有 [ ] 包圍的）
6. 長 term 優先替換（避免 "top" 把 "topspace" 吃掉）

用法：python scripts/add-internal-links.py [--dry-run]
"""

import re
import sys
from pathlib import Path

GLOSSARY_DIR = Path('content/glossary')


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Simple YAML frontmatter parser. Returns (frontmatter_dict, body)."""
    if not text.startswith('---'):
        return {}, text
    parts = text.split('---', 2)
    if len(parts) < 3:
        return {}, text
    import yaml
    try:
        fm = yaml.safe_load(parts[1])
    except Exception:
        fm = {}
    return fm or {}, '---' + parts[1] + '---' + parts[2]


def build_lookup() -> dict[str, tuple[str, str]]:
    """Build slug → (term_en, term_zh) mapping from all glossary entries."""
    lookup = {}
    for f in sorted(GLOSSARY_DIR.glob('*.md')):
        text = f.read_text(encoding='utf-8')
        fm, _ = parse_frontmatter(text)
        slug = f.stem
        term_en = fm.get('term_en', '')
        term_zh = fm.get('term_zh', '')
        if term_en or term_zh:
            lookup[slug] = (term_en, term_zh)
    return lookup


def is_inside_link(text: str, pos: int) -> bool:
    """Check if position is inside an existing markdown link [...](...) ."""
    # Look backward for unmatched [
    depth = 0
    for i in range(pos - 1, max(pos - 200, -1), -1):
        if text[i] == ']':
            depth += 1
        elif text[i] == '[':
            if depth > 0:
                depth -= 1
            else:
                # We're inside a [ ... ] — check if it's a link
                return True
    return False


def add_link_first_occurrence(text: str, term: str, slug: str, anchor_text: str) -> tuple[str, bool]:
    """Replace first occurrence of `term` in text with markdown link, if not already linked."""
    pattern = re.compile(re.escape(term))
    for m in pattern.finditer(text):
        start, end = m.start(), m.end()
        # Skip if already inside a markdown link
        if is_inside_link(text, start):
            continue
        # Skip if immediately preceded by [ (part of existing link text)
        if start > 0 and text[start-1] == '[':
            continue
        # Get the full line containing this match
        line_start = text.rfind('\n', 0, start) + 1
        line_end = text.find('\n', start)
        if line_end == -1:
            line_end = len(text)
        line = text[line_start:line_end]
        stripped = line.strip()
        # Skip if it's a YAML key line (term appears as key value, not in pipe block)
        if ':' in stripped and stripped.startswith(term):
            continue
        # GUARD: Skip if line is a YAML plain scalar (e.g. "  - vs: Master/Slave")
        # These lines start with "- " or whitespace and contain ":" before our term
        # Adding [brackets] here would break YAML parsing
        if re.match(r'^\s*-?\s*\w+:', line):
            # This line looks like a YAML mapping key:value — check if our match
            # is in the value part (after the colon)
            colon_pos_in_line = line.find(':')
            match_pos_in_line = start - line_start
            if match_pos_in_line > colon_pos_in_line:
                # Match is in the value part of a YAML key:value
                # Check if this is a pipe `|` block (safe) or plain scalar (unsafe)
                value_part = line[colon_pos_in_line + 1:].strip()
                if value_part == '|' or value_part == '|-' or value_part == '>':
                    # This is the pipe/fold indicator line, match is on wrong line
                    continue
                elif value_part == '':
                    # Empty value, skip
                    continue
                else:
                    # Plain scalar value — adding [ ] would break YAML!
                    continue
        # Replace
        replacement = f'[{anchor_text}](/glossary/{slug})'
        new_text = text[:start] + replacement + text[end:]
        return new_text, True
    return text, False


def process_entry(filepath: Path, lookup: dict, dry_run: bool = False) -> int:
    """Process a single glossary entry. Returns number of links added."""
    text = filepath.read_text(encoding='utf-8')
    fm, _ = parse_frontmatter(text)

    related = fm.get('related_terms', [])
    if not related:
        return 0

    slug_self = filepath.stem
    links_added = 0

    # Sort related terms by term length (longest first) to avoid substring conflicts
    related_with_names = []
    for rel_slug in related:
        if rel_slug in lookup and rel_slug != slug_self:
            term_en, term_zh = lookup[rel_slug]
            related_with_names.append((rel_slug, term_en, term_zh))

    # Sort by longest term first
    related_with_names.sort(key=lambda x: max(len(x[1]), len(x[2])), reverse=True)

    for rel_slug, term_en, term_zh in related_with_names:
        # Skip if already linked in this file
        if f'](/glossary/{rel_slug})' in text:
            continue

        # Decide anchor text format based on context
        # Try term_en first (most glossary definitions use English terms)
        added = False
        if term_en and term_en in text:
            # English term found — anchor: term_en（term_zh）
            anchor = f'{term_en}（{term_zh}）' if term_zh and term_zh != term_en else term_en
            text, added = add_link_first_occurrence(text, term_en, rel_slug, anchor)

        if not added and term_zh and term_zh in text and term_zh != term_en:
            # Chinese term found — anchor: term_zh（term_en）
            anchor = f'{term_zh}（{term_en}）' if term_en else term_zh
            text, added = add_link_first_occurrence(text, term_zh, rel_slug, anchor)

        if added:
            links_added += 1

    if links_added > 0 and not dry_run:
        # YAML validation guard — 寫入前確認 frontmatter 仍合法
        import yaml
        try:
            parts = text.split('---', 2)
            if len(parts) >= 3:
                yaml.safe_load(parts[1])
        except yaml.YAMLError as e:
            print(f'  [!YAML ERROR] {filepath.name} — reverting ({e})')
            return 0  # Don't write, return 0 links

        filepath.write_text(text, encoding='utf-8', newline='\n')

    return links_added


def main():
    dry_run = '--dry-run' in sys.argv
    lookup = build_lookup()
    print(f'Lookup table: {len(lookup)} entries')
    print(f'Mode: {"DRY RUN" if dry_run else "WRITE"}\n')

    total_links = 0
    files_changed = 0

    for f in sorted(GLOSSARY_DIR.glob('*.md')):
        n = process_entry(f, lookup, dry_run)
        if n > 0:
            files_changed += 1
            print(f'  [+{n}] {f.name}')
        total_links += n

    print(f'\nTOTAL: {total_links} links added across {files_changed} files')
    if dry_run:
        print('(DRY RUN — no files modified)')


if __name__ == '__main__':
    main()
