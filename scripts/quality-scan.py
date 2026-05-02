#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
quality-scan.py — kinkref.org 批次品質掃描器
版本: v1.0
對應 schema: CONTENT_SCHEMA.md v1.1

掃描整個 content/ 目錄（或指定子目錄），對每個條目執行 self-check.py 的全部模組，
加上跨條目一致性與 citations 驗證。

用法:
    python scripts/quality-scan.py
    python scripts/quality-scan.py --path content/glossary
    python scripts/quality-scan.py --json
    python scripts/quality-scan.py --strict
    python scripts/quality-scan.py --diff           # 與上次 baseline 比較
    python scripts/quality-scan.py --worst 10       # 只顯示分數最高的 10 個

退出碼:
    0  全部通過
    1  發現錯誤
    2  系統失敗（找不到 rules / content 目錄)

----------------------------------------------------------------
Inspired by:
    Taiwan.md's `quality-scan.sh` (v3.x) — 批次掃描架構、評分分級邏輯、
        中國用語 detection table 設計、baseline diff 機制、--worst/--json 介面
    Taiwan.md's `self-check.sh` (v2)    — 投稿前自檢的分區報告格式

本腳本是 kinkref.org 領域的重新實作（YAML frontmatter / 跨條目驗證 /
高敏感詞 caveats 強制等為 BDSM 站特有），但設計骨架致謝 Taiwan.md 社群協作
所累積的模式。
----------------------------------------------------------------
"""

import sys
import os
import re
import json
import io
import argparse
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Tuple, Optional, Any

# Windows cp950 編碼相容
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except (AttributeError, ValueError):
        pass

try:
    import yaml
except ImportError:
    print("錯誤：需要 PyYAML。請執行: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

# 從 self-check.py 匯入共用函數
SCRIPT_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(SCRIPT_DIR))

try:
    # 直接匯入 self_check 模組（檔名含連字號需特別處理）
    import importlib.util
    sc_path = SCRIPT_DIR / 'self-check.py'
    spec = importlib.util.spec_from_file_location("self_check", sc_path)
    self_check = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(self_check)
except Exception as e:
    print(f"錯誤：無法載入 self-check.py: {e}", file=sys.stderr)
    sys.exit(2)


# ─── 顏色 ───────────────────────────────────────────
class C:
    if os.name == 'nt' and not os.environ.get('ANSICON'):
        try:
            import colorama
            colorama.init()
            _enabled = True
        except ImportError:
            _enabled = False
    else:
        _enabled = True

    RED = '\033[0;31m' if _enabled else ''
    YEL = '\033[0;33m' if _enabled else ''
    GRN = '\033[0;32m' if _enabled else ''
    DIM = '\033[0;90m' if _enabled else ''
    CYN = '\033[0;36m' if _enabled else ''
    BLD = '\033[1m'   if _enabled else ''
    RST = '\033[0m'   if _enabled else ''


# ─── 跨條目驗證 ────────────────────────────────────
class CrossEntryValidator:
    """跨條目一致性檢查（citations、related_terms 連結驗證等）。"""

    def __init__(self, content_root: Path):
        self.content_root = content_root
        self.glossary_slugs: set = set()
        self.book_slugs: set = set()
        self.paper_slugs: set = set()
        self._scan_existing_entries()

    def _scan_existing_entries(self) -> None:
        """掃描 content/ 取得所有現存 slug。"""
        for sub, target in [
            ('glossary', self.glossary_slugs),
            ('books', self.book_slugs),
            ('bibliography', self.paper_slugs),
        ]:
            sub_dir = self.content_root / sub
            if sub_dir.exists():
                for f in sub_dir.glob('*.md'):
                    target.add(f.stem)

    def validate_citations(self, frontmatter: Dict, file_path: Path) -> List[str]:
        """
        驗證 citations 中的 internal-* 引用指向真實存在的 slug。
        回傳錯誤訊息列表。
        """
        errors = []
        citations = frontmatter.get('citations') or []

        for i, c in enumerate(citations):
            if not isinstance(c, dict):
                errors.append(f"citations[{i}] 不是 dict 結構")
                continue

            ctype = c.get('type', '')
            ref = c.get('ref', '')

            if ctype == 'internal-paper':
                if not ref:
                    errors.append(f"citations[{i}] type=internal-paper 但無 ref")
                elif ref not in self.paper_slugs:
                    errors.append(f"citations[{i}] ref \"{ref}\" 不存在於 bibliography/")
            elif ctype == 'internal-book':
                if not ref:
                    errors.append(f"citations[{i}] type=internal-book 但無 ref")
                elif ref not in self.book_slugs:
                    errors.append(f"citations[{i}] ref \"{ref}\" 不存在於 books/")
            elif ctype == 'internal-term':
                if not ref:
                    errors.append(f"citations[{i}] type=internal-term 但無 ref")
                elif ref not in self.glossary_slugs:
                    errors.append(f"citations[{i}] ref \"{ref}\" 不存在於 glossary/")
            elif ctype == 'external':
                # 至少要有 apa 或 doi
                if not c.get('apa') and not c.get('doi'):
                    errors.append(f"citations[{i}] type=external 至少需有 apa 或 doi")
            else:
                if ctype:
                    errors.append(f"citations[{i}] 未知 type: \"{ctype}\"")
                else:
                    errors.append(f"citations[{i}] 缺少 type 欄位")

        return errors

    def validate_related_terms(self, frontmatter: Dict, file_path: Path) -> List[str]:
        """驗證 related_terms 中的 slug 都存在於 glossary/。"""
        errors = []
        related = frontmatter.get('related_terms') or []
        for slug in related:
            if slug not in self.glossary_slugs:
                errors.append(f"related_terms 引用的 \"{slug}\" 不存在於 glossary/")
        return errors

    def validate_doi_format(self, frontmatter: Dict) -> List[str]:
        """驗證 DOI 格式正確（必須是 https://doi.org/... 或 doi:... 形式）。"""
        errors = []
        doi = frontmatter.get('doi', '')
        if not doi:
            return errors
        if not isinstance(doi, str):
            errors.append(f"doi 應為字串，實際: {type(doi).__name__}")
            return errors
        if not (doi.startswith('https://doi.org/') or doi.startswith('http://doi.org/') or doi.startswith('doi:')):
            errors.append(f"doi 格式錯誤（應為 https://doi.org/... 或 doi:...）：{doi[:50]}")
        return errors


# ─── 單檔評分 ──────────────────────────────────────
class FileReport:
    """單檔的掃描結果。"""

    def __init__(self, rel_path: str):
        self.rel_path = rel_path
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.score: int = 0
        self.parse_failed: bool = False

    def add_error(self, msg: str, weight: int = 2) -> None:
        self.errors.append(msg)
        self.score += weight

    def add_warn(self, msg: str, weight: int = 1) -> None:
        self.warnings.append(msg)
        self.score += weight

    @property
    def status(self) -> str:
        if self.parse_failed:
            return 'parse_failed'
        if self.score == 0:
            return 'pass'
        if self.score >= 8:
            return 'critical'
        if self.score >= 4:
            return 'suspect'
        return 'minor'


# ─── 單檔掃描 ──────────────────────────────────────
def scan_single_file(file_path: Path, rules: Dict, validator: CrossEntryValidator,
                     content_root: Path) -> FileReport:
    """對單一檔案執行所有檢查（self-check.py 模組 + 跨條目驗證）。"""
    rel_path = str(file_path.relative_to(content_root))
    report = FileReport(rel_path)

    # 解析
    try:
        frontmatter, body, content = self_check.parse_entry(file_path)
    except ValueError as e:
        report.parse_failed = True
        report.add_error(f"解析失敗: {e}", weight=10)
        return report

    # 推斷類型
    try:
        entry_type = self_check.detect_entry_type(frontmatter, file_path)
    except ValueError as e:
        report.add_error(f"類型推斷失敗: {e}", weight=10)
        return report

    # 組合可檢查內容
    content_for_check = body
    for field in ('definition', 'abstract_zh', 'tagline', 'usage_notes',
                  'controversies', 'curator_note'):
        v = frontmatter.get(field, '')
        if isinstance(v, str):
            content_for_check += '\n' + v
    for item in (frontmatter.get('disambiguation') or []):
        if isinstance(item, dict):
            content_for_check += '\n' + (item.get('note', '') or '')

    # 跑所有 self-check 模組
    results = [
        self_check.check_schema(frontmatter, entry_type, rules),
        self_check.check_slug(file_path, rules),
        self_check.check_lengths(frontmatter, entry_type, rules),
        self_check.check_neutrality(content_for_check, rules),
        self_check.check_prescriptive(content_for_check, rules),
        self_check.check_ai_writing(content_for_check, rules),
        self_check.check_china_terms(content_for_check, rules),
        self_check.check_policy(content_for_check, frontmatter, file_path, rules),
        self_check.check_required_caveats(frontmatter, file_path, rules),
    ]

    for res in results:
        for e in res.errors:
            report.add_error(f"[{res.section}] {e}", weight=2)
        for w in res.warnings:
            report.add_warn(f"[{res.section}] {w}", weight=1)

    # 跨條目驗證
    citation_errors = validator.validate_citations(frontmatter, file_path)
    for e in citation_errors:
        report.add_error(f"[citations] {e}", weight=3)

    related_errors = validator.validate_related_terms(frontmatter, file_path)
    for e in related_errors:
        report.add_warn(f"[related_terms] {e}", weight=1)

    if entry_type == 'paper':
        doi_errors = validator.validate_doi_format(frontmatter)
        for e in doi_errors:
            report.add_error(f"[doi] {e}", weight=2)

    return report


# ─── Baseline 管理 ────────────────────────────────
def load_baseline(baseline_path: Path) -> Dict[str, int]:
    """載入上次 baseline 的 file→score 對照。"""
    if not baseline_path.exists():
        return {}
    try:
        with open(baseline_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return {item['file']: item['score'] for item in data.get('files', [])}
    except (json.JSONDecodeError, KeyError, IOError):
        return {}


def save_baseline(baseline_path: Path, reports: List[FileReport],
                  total: int, suspect: int) -> None:
    """儲存當次 baseline。"""
    data = {
        'version': '1.0',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'total': total,
        'suspect': suspect,
        'files': [
            {'file': r.rel_path, 'score': r.score, 'status': r.status}
            for r in reports if r.score > 0
        ],
    }
    baseline_path.parent.mkdir(parents=True, exist_ok=True)
    with open(baseline_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ─── 主流程 ────────────────────────────────────────
def main() -> int:
    parser = argparse.ArgumentParser(
        description="kinkref.org 批次品質掃描器",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('--path', default=None,
                        help='掃描目錄（預設: content/）')
    parser.add_argument('--rules', default=None,
                        help='Detection rules YAML（預設: scripts/data/detection-rules.yaml）')
    parser.add_argument('--strict', action='store_true',
                        help='嚴格模式：警告也視為失敗')
    parser.add_argument('--json', action='store_true',
                        help='輸出 JSON 格式（CI 友善）')
    parser.add_argument('--diff', action='store_true',
                        help='與上次 baseline 比較，顯示變化')
    parser.add_argument('--worst', type=int, default=0,
                        help='只顯示分數最高的 N 個（隱含 --sort）')
    parser.add_argument('--sort', action='store_true',
                        help='按分數高→低排序')
    parser.add_argument('--samples', action='store_true',
                        help='也掃描 scripts/samples/（預設不掃，避免汙染 baseline）')

    args = parser.parse_args()

    # repo root（scripts/ 的上一層）
    repo_root = SCRIPT_DIR.parent

    # 找 detection rules
    rules_path = Path(args.rules).resolve() if args.rules else SCRIPT_DIR / 'data' / 'detection-rules.yaml'
    if not rules_path.exists():
        print(f"{C.RED}錯誤：找不到 detection rules: {rules_path}{C.RST}", file=sys.stderr)
        return 2

    try:
        with open(rules_path, 'r', encoding='utf-8') as f:
            rules = yaml.safe_load(f)
    except yaml.YAMLError as e:
        print(f"{C.RED}錯誤：detection rules YAML 格式錯誤: {e}{C.RST}", file=sys.stderr)
        return 2

    # 找掃描目錄
    if args.path:
        scan_root = Path(args.path).resolve()
    else:
        if args.samples:
            scan_root = SCRIPT_DIR / 'samples'
        else:
            scan_root = repo_root / 'content'

    if not scan_root.exists():
        print(f"{C.RED}錯誤：掃描目錄不存在: {scan_root}{C.RST}", file=sys.stderr)
        return 2

    # 跨條目驗證器（基於 content/ 完整目錄）
    content_dir = repo_root / 'content'
    validator = CrossEntryValidator(content_dir if content_dir.exists() else scan_root)

    # 蒐集所有 .md 檔案
    md_files = sorted(scan_root.rglob('*.md'))
    if not md_files:
        if not args.json:
            print(f"{C.YEL}⚠️  在 {scan_root} 下找不到 .md 檔案{C.RST}")
        return 0

    # Header
    if not args.json:
        print()
        print(f"🔍 {C.BLD}quality-scan v1.0{C.RST} — 批次品質掃描")
        print(f"   掃描目錄: {scan_root.relative_to(repo_root) if scan_root.is_relative_to(repo_root) else scan_root}")
        print(f"   檔案數: {len(md_files)}")
        print(f"   schema 版本: v{rules['schema']['current_version']}")
        print(f"   評分: 0 ✅ pass | 1-3 minor | 4-7 ⚠️ suspect | 8+ 🔴 critical")
        print("=" * 60)

    # 掃描所有檔案
    reports: List[FileReport] = []
    for f in md_files:
        report = scan_single_file(f, rules, validator, scan_root)
        reports.append(report)

    # 排序
    if args.sort or args.worst > 0:
        reports.sort(key=lambda r: r.score, reverse=True)

    # 限制顯示數量
    display_reports = reports
    if args.worst > 0:
        display_reports = [r for r in reports if r.score > 0][:args.worst]

    # Baseline diff
    baseline_path = SCRIPT_DIR / 'data' / '.quality-baseline.json'
    baseline_lookup = {}
    if args.diff:
        baseline_lookup = load_baseline(baseline_path)

    # 統計
    total = len(reports)
    pass_count = sum(1 for r in reports if r.score == 0)
    minor_count = sum(1 for r in reports if 1 <= r.score < 4)
    suspect_count = sum(1 for r in reports if 4 <= r.score < 8)
    critical_count = sum(1 for r in reports if r.score >= 8)
    parse_fail_count = sum(1 for r in reports if r.parse_failed)

    new_count = improved_count = worsened_count = 0
    fixed_count = 0
    if args.diff:
        for r in reports:
            old = baseline_lookup.get(r.rel_path)
            if old is None and r.score > 0:
                new_count += 1
            elif old is not None:
                if r.score > old:
                    worsened_count += 1
                elif r.score < old:
                    improved_count += 1
        # 已修復 = baseline 有但這次沒有（score 0 或不存在）
        current_files = {r.rel_path for r in reports}
        for old_file, old_score in baseline_lookup.items():
            if old_file not in current_files or next(
                (r.score for r in reports if r.rel_path == old_file), 0) == 0:
                if old_score > 0:
                    fixed_count += 1

    # 輸出
    if args.json:
        output = {
            'version': '1.0',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'scan_root': str(scan_root),
            'schema_version': rules['schema']['current_version'],
            'total': total,
            'pass': pass_count,
            'minor': minor_count,
            'suspect': suspect_count,
            'critical': critical_count,
            'parse_failed': parse_fail_count,
            'files': [
                {
                    'file': r.rel_path,
                    'score': r.score,
                    'status': r.status,
                    'errors': r.errors,
                    'warnings': r.warnings,
                }
                for r in display_reports if r.score > 0 or args.worst == 0
            ],
        }
        if args.diff:
            output['diff'] = {
                'new': new_count,
                'worsened': worsened_count,
                'improved': improved_count,
                'fixed': fixed_count,
            }
        print(json.dumps(output, ensure_ascii=False, indent=2))
    else:
        # 文字輸出
        for r in display_reports:
            if r.score == 0:
                continue

            # diff 標記
            diff_tag = ''
            if args.diff:
                old = baseline_lookup.get(r.rel_path)
                if old is None:
                    diff_tag = f" {C.CYN}🆕{C.RST}"
                elif r.score > old:
                    diff_tag = f" {C.RED}↑{old}→{r.score}{C.RST}"
                elif r.score < old:
                    diff_tag = f" {C.GRN}↓{old}→{r.score}{C.RST}"

            # 等級標記
            if r.score >= 8:
                tag = f"{C.RED}🔴 [{r.score}]{C.RST}"
            elif r.score >= 4:
                tag = f"{C.YEL}⚠️  [{r.score}]{C.RST}"
            else:
                tag = f"{C.DIM}∙ [{r.score}]{C.RST}"

            print(f"\n{tag} {r.rel_path}{diff_tag}")
            for e in r.errors[:5]:  # 最多顯示 5 條
                print(f"   {C.RED}⛔{C.RST} {e}")
            if len(r.errors) > 5:
                print(f"   {C.DIM}...（還有 {len(r.errors) - 5} 個錯誤）{C.RST}")
            for w in r.warnings[:3]:  # 最多顯示 3 條警告
                print(f"   {C.YEL}⚠️ {C.RST} {w}")
            if len(r.warnings) > 3:
                print(f"   {C.DIM}...（還有 {len(r.warnings) - 3} 個警告）{C.RST}")

        # 總結
        print()
        print("━" * 60)
        print(f"📊 掃描完成: {total} 個條目")
        print(f"   {C.GRN}✅ pass: {pass_count}{C.RST}  "
              f"{C.DIM}∙ minor: {minor_count}{C.RST}  "
              f"{C.YEL}⚠️  suspect: {suspect_count}{C.RST}  "
              f"{C.RED}🔴 critical: {critical_count}{C.RST}")
        if parse_fail_count > 0:
            print(f"   {C.RED}❌ 解析失敗: {parse_fail_count}{C.RST}")

        if args.diff:
            print()
            print("📈 vs 上次 baseline:")
            print(f"   {C.CYN}🆕 新增: {new_count}{C.RST}")
            print(f"   {C.RED}↑ 惡化: {worsened_count}{C.RST}")
            print(f"   {C.GRN}↓ 改善: {improved_count}{C.RST}")
            print(f"   {C.GRN}✅ 已修復: {fixed_count}{C.RST}")

        print("━" * 60)

    # 儲存 baseline（總是儲存，給下次 diff 用）
    save_baseline(baseline_path, reports, total, suspect_count + critical_count)

    # 退出碼
    has_errors = critical_count + suspect_count + parse_fail_count > 0
    has_minor = minor_count > 0

    if has_errors:
        return 1
    if has_minor and args.strict:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
