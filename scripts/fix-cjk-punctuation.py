#!/usr/bin/env python3
"""
fix-cjk-punctuation.py — 修正中文段落中誤用的半形逗號 / 分號

替換規則（中文+標點+中文 才替換，避免動到英文 metadata）：
- 中文,中文 → 中文，中文
- 中文;中文 → 中文；中文

不動：
- frontmatter YAML 內的英文姓名 / DOI / authors
- code block 內容
- 引文標題（純英文不會踩 pattern）
- 半形句號（已盤點 0 處，無需處理）

用法：python scripts/fix-cjk-punctuation.py file1.md file2.md ...
"""

import re
import sys
from pathlib import Path

# 中文範圍：CJK Unified Ideographs 主範圍 + 擴充 A
CHINESE = r'[\u3400-\u9fff]'

PATTERNS = [
    (re.compile(f'({CHINESE}),({CHINESE})'), r'\1，\2'),
    (re.compile(f'({CHINESE});({CHINESE})'), r'\1；\2'),
]


def fix_file(path: Path) -> tuple[int, int]:
    """Return (comma_count, semi_count) of substitutions made."""
    text = path.read_text(encoding='utf-8')
    counts = []
    for pattern, replacement in PATTERNS:
        text, n = pattern.subn(replacement, text)
        counts.append(n)
    if any(counts):
        path.write_text(text, encoding='utf-8', newline='\n')
    return tuple(counts)


def main() -> None:
    if len(sys.argv) < 2:
        print('Usage: python fix-cjk-punctuation.py file1.md [file2.md ...]', file=sys.stderr)
        sys.exit(1)

    total_comma = 0
    total_semi = 0
    files_changed = 0

    for arg in sys.argv[1:]:
        path = Path(arg)
        if not path.exists():
            print(f'  [skip] not found: {arg}', file=sys.stderr)
            continue
        comma, semi = fix_file(path)
        if comma or semi:
            files_changed += 1
            print(f'  [fix] {path.name}: {comma} commas, {semi} semis')
        total_comma += comma
        total_semi += semi

    print(f'\n  TOTAL: {total_comma} commas, {total_semi} semis fixed across {files_changed} files')


if __name__ == '__main__':
    main()
