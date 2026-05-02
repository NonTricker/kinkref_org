#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
migrate-v1.1-to-v1.2.py — 一次性遷移腳本

從 v1.1 schema 遷移到 v1.2：
1. schema_version: "1.1" → "1.2"
2. contributor: "策展人" → "kinkref"
3. 全部加 contributor_note: "本條目由 AI 心理學家 Agent 繆思（Muse）生成"
4. 對 REVIEWER_ENTRIES 列表中的條目加 reviewer: "策展人：薩約"

只在所有條目都是 v1.1 時跑一次。已遷移的條目不會被重複處理。

用法:
    python scripts/migrate-v1.1-to-v1.2.py
    python scripts/migrate-v1.1-to-v1.2.py --dry-run
"""

import sys
import os
import re
import io
import argparse
from pathlib import Path

# Windows cp950 編碼相容
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except (AttributeError, ValueError):
        pass

# 主人實質介入過的 15 個條目（slug，不含副檔名）
REVIEWER_ENTRIES = {
    # Tier 1: 主人寫完後直接 review 並指示修正（14 條）
    'slave', 'master', 'pet', 'owner', 'boy-girl', 'daddy-mommy',
    'submissive', 'primal-hunter', 'primal-prey',
    'aftercare', 'subspace', 'topspace', 'sub-drop', 'top-drop',
    # Tier 2: 主人特定發言被條目核心消化（1 條）
    'rack',
}

CONTRIBUTOR_NOTE = "本條目由 AI 心理學家 Agent 繆思（Muse）生成"
NEW_CONTRIBUTOR = "kinkref"
NEW_REVIEWER = "策展人：薩約"


def migrate_file(file_path: Path, dry_run: bool = False) -> dict:
    """遷移單一條目檔案。回傳變更摘要。"""
    content = file_path.read_text(encoding='utf-8')
    original = content
    changes = []

    # 1. schema_version: "1.1" → "1.2"
    new_content, n = re.subn(
        r'^(schema_version:\s*)"1\.1"',
        r'\g<1>"1.2"',
        content,
        flags=re.MULTILINE,
    )
    if n > 0:
        changes.append('schema_version → 1.2')
        content = new_content

    # 2. contributor: "策展人" / 策展人 → "kinkref"
    new_content, n = re.subn(
        r'^(contributor:\s*)"?策展人"?\s*$',
        f'\\g<1>"{NEW_CONTRIBUTOR}"',
        content,
        flags=re.MULTILINE,
    )
    if n > 0:
        changes.append('contributor → kinkref')
        content = new_content

    # 3. 加 contributor_note（如果還沒有）
    has_note = bool(re.search(r'^contributor_note:', content, re.MULTILINE))
    if not has_note:
        # 在 contributor 行下一行插入 contributor_note
        new_content = re.sub(
            r'^(contributor:\s*"?[^\n]+"?\s*)$',
            f'\\g<1>\ncontributor_note: "{CONTRIBUTOR_NOTE}"',
            content,
            count=1,
            flags=re.MULTILINE,
        )
        if new_content != content:
            changes.append('+ contributor_note')
            content = new_content

    # 4. 對 REVIEWER_ENTRIES 加 reviewer
    slug = file_path.stem
    if slug in REVIEWER_ENTRIES:
        has_reviewer = bool(re.search(r'^reviewer:', content, re.MULTILINE))
        if not has_reviewer:
            # 在 contributor_note 行下一行插入 reviewer
            new_content = re.sub(
                r'^(contributor_note:\s*"[^"]*"\s*)$',
                f'\\g<1>\nreviewer: "{NEW_REVIEWER}"',
                content,
                count=1,
                flags=re.MULTILINE,
            )
            if new_content != content:
                changes.append(f'+ reviewer (Tier 1/2)')
                content = new_content

    # 寫回
    if content != original and not dry_run:
        file_path.write_text(content, encoding='utf-8')

    return {
        'file': str(file_path.relative_to(file_path.parents[2])),
        'changes': changes,
        'modified': content != original,
    }


def main():
    parser = argparse.ArgumentParser(description='Migrate v1.1 → v1.2')
    parser.add_argument('--dry-run', action='store_true', help='不寫入檔案，只顯示會做什麼')
    parser.add_argument('--path', default=None, help='掃描目錄（預設: ../content）')
    args = parser.parse_args()

    script_dir = Path(__file__).parent.resolve()
    scan_root = Path(args.path) if args.path else (script_dir.parent / 'content')

    if not scan_root.exists():
        print(f"錯誤：找不到 content 目錄: {scan_root}", file=sys.stderr)
        return 2

    md_files = sorted(scan_root.rglob('*.md'))
    if not md_files:
        print(f"⚠️ 在 {scan_root} 下找不到 .md 檔案")
        return 0

    print(f"🔧 migrate-v1.1-to-v1.2 — {'DRY RUN' if args.dry_run else '寫入模式'}")
    print(f"   掃描: {scan_root}")
    print(f"   檔案: {len(md_files)}")
    print(f"   Tier 1+2 reviewer 條目: {len(REVIEWER_ENTRIES)}")
    print('=' * 60)

    modified = 0
    no_change = 0
    by_type = {'glossary': 0, 'bibliography': 0, 'books': 0}
    reviewer_added = 0

    for f in md_files:
        result = migrate_file(f, dry_run=args.dry_run)
        rel = result['file']
        if result['modified']:
            modified += 1
            # 統計類型
            for t in by_type:
                if t in rel:
                    by_type[t] += 1
                    break
            # 統計 reviewer 新增
            if any('reviewer' in c for c in result['changes']):
                reviewer_added += 1
            print(f"  ✏️  {rel}")
            for c in result['changes']:
                print(f"      • {c}")
        else:
            no_change += 1

    print('=' * 60)
    print(f"📊 修改: {modified} | 無變化: {no_change}")
    print(f"   按類型: glossary {by_type['glossary']} | bibliography {by_type['bibliography']} | books {by_type['books']}")
    print(f"   reviewer 新增: {reviewer_added} 條（預期 {len(REVIEWER_ENTRIES)}）")

    if args.dry_run:
        print()
        print("🟡 DRY RUN 模式，未實際寫入檔案。確認後請去掉 --dry-run 重跑。")

    return 0


if __name__ == '__main__':
    sys.exit(main())
