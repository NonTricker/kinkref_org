#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
self-check.py — kinkref.org 投稿前自檢器
版本: v1.0
對應 schema: CONTENT_SCHEMA.md v1.1
對應指南: CONTRIBUTING.md v1.1 第七節

用法:
    python self-check.py <file.md>
    python self-check.py <file.md> --strict
    python self-check.py <file.md> --rules <custom-rules.yaml>

範例:
    python scripts/self-check.py content/glossary/dominant.md
    python scripts/self-check.py content/bibliography/wismeijer-2013.md --strict

退出碼:
    0  全部通過（或僅警告且非 strict 模式）
    1  發現錯誤（或 strict 模式下有警告）
    2  檔案解析失敗

----------------------------------------------------------------
Inspired by:
    Taiwan.md's `self-check.sh` (v2) — 投稿前自檢 UX、分區報告格式、
        中國用語 false-positive 排除模式

本腳本針對 kinkref.org 重新實作（YAML schema 驗證 / context-aware 政策
偵測 / 高敏感詞 caveats 強制等為 BDSM 站特有），但分區報告與 false-positive
邏輯的設計致謝 Taiwan.md 社群所累積的模式。
----------------------------------------------------------------
"""

import sys
import os
import re
import argparse
import io
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any

# Windows cp950 編碼相容：強制 stdout/stderr 為 UTF-8
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except (AttributeError, ValueError):
        pass  # 某些環境（IDE buffer）不支援，靜默 fallback

try:
    import yaml
except ImportError:
    print("錯誤：需要 PyYAML。請執行: pip install pyyaml", file=sys.stderr)
    sys.exit(2)


# ─── 顏色（支援 Windows / *nix）───────────────────────
class C:
    """ANSI 顏色碼。Windows 命令提示字元若不支援可加 colorama。"""
    if os.name == 'nt' and not os.environ.get('ANSICON'):
        # Windows 預設 cmd.exe 不渲染 ANSI（但 PowerShell / Git Bash / Windows Terminal 支援）
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


# ─── 檢查結果容器 ─────────────────────────────────────
class Result:
    """單一檢查模組的結果容器。"""

    def __init__(self, section_name: str):
        self.section = section_name
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.notes: List[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def note(self, msg: str) -> None:
        self.notes.append(msg)

    @property
    def has_issues(self) -> bool:
        return bool(self.errors or self.warnings)

    def render(self) -> None:
        print(f"\n{C.BLD}{self.section}{C.RST}")
        if self.errors:
            for e in self.errors:
                print(f"  {C.RED}⛔ {e}{C.RST}")
        if self.warnings:
            for w in self.warnings:
                print(f"  {C.YEL}⚠️  {w}{C.RST}")
        if self.notes:
            for n in self.notes:
                print(f"  {C.DIM}{n}{C.RST}")
        if not self.has_issues and not self.notes:
            print(f"  {C.GRN}✅ 通過{C.RST}")


# ─── 工具函數 ─────────────────────────────────────────
def count_chinese_chars(text: str) -> int:
    """計算中文字符數，不算空白、英文字母、數字、標點。"""
    if not text:
        return 0
    return len(re.findall(r'[\u4e00-\u9fff]', text))


def count_sentences_zh(text: str) -> int:
    """粗略計算中文句子數（依 。！？ 結尾分割）。"""
    if not text:
        return 0
    sentences = re.split(r'[。！？\n]+', text.strip())
    return len([s for s in sentences if s.strip()])


def parse_entry(file_path: Path) -> Tuple[Dict, str, str]:
    """
    解析條目檔案，回傳 (frontmatter dict, body markdown, full content).
    Frontmatter 必須以 --- 包圍。
    """
    content = file_path.read_text(encoding='utf-8')
    if not content.lstrip().startswith('---'):
        raise ValueError("檔案缺少 frontmatter（應以 --- 開頭）")

    parts = content.split('---', 2)
    if len(parts) < 3:
        raise ValueError("frontmatter 格式錯誤（缺少結尾的 ---）")

    try:
        frontmatter = yaml.safe_load(parts[1])
    except yaml.YAMLError as e:
        raise ValueError(f"YAML 解析錯誤: {e}")

    if not isinstance(frontmatter, dict):
        raise ValueError("frontmatter 不是合法的 YAML mapping")

    body = parts[2]
    return frontmatter, body, content


def detect_entry_type(frontmatter: Dict, file_path: Path) -> str:
    """
    根據 frontmatter 與路徑推斷條目類型。
    回傳 'glossary' / 'book' / 'paper' / 'journal' / 'counselor' / 'legal' / 'campus-group' / 'medical'。
    """
    path_str = str(file_path).replace('\\', '/').lower()

    # 路徑優先（v1.3 加 5 個新 type）
    if '/glossary/' in path_str or path_str.endswith('/glossary'):
        return 'glossary'
    if '/books/' in path_str or path_str.endswith('/books'):
        return 'book'
    if '/bibliography/' in path_str or path_str.endswith('/bibliography'):
        return 'paper'
    if '/journals/' in path_str or path_str.endswith('/journals'):
        return 'journal'
    if '/counselors/' in path_str or path_str.endswith('/counselors'):
        return 'counselor'
    if '/legal/' in path_str or path_str.endswith('/legal'):
        return 'legal'
    if '/campus-groups/' in path_str or path_str.endswith('/campus-groups'):
        return 'campus-group'
    if '/medical/' in path_str or path_str.endswith('/medical'):
        return 'medical'

    # Frontmatter 特徵欄位
    if 'term_zh' in frontmatter or 'term_en' in frontmatter:
        return 'glossary'
    if 'book_type' in frontmatter:
        return 'book'
    if 'doi' in frontmatter or 'authors' in frontmatter or 'study_type' in frontmatter:
        return 'paper'
    # v1.3 新增 type 的特徵欄位
    if 'accepts_bdsm' in frontmatter or 'impact_factor' in frontmatter:
        return 'journal'
    if 'kink_friendly_statement' in frontmatter and 'credentials' in frontmatter:
        return 'counselor'
    if 'bar_admission' in frontmatter or 'statute_url' in frontmatter:
        return 'legal'
    if 'university' in frontmatter and 'recruitment_open' in frontmatter:
        return 'campus-group'
    if 'services_offered' in frontmatter or 'medical_specialty' in frontmatter:
        return 'medical'

    raise ValueError("無法判斷條目類型（路徑與 frontmatter 都無明確指標）")


def get_yaml_field_value_as_str(value: Any) -> str:
    """把 YAML 欄位值轉為字串以利 grep。對於 list/dict 也能處理。"""
    if value is None:
        return ''
    if isinstance(value, str):
        return value
    if isinstance(value, (list, dict)):
        return yaml.dump(value, allow_unicode=True, default_flow_style=False)
    return str(value)


def get_canonical_term_key(frontmatter: Dict, file_path: Path) -> str:
    """
    取得用於 detection rule lookup 的 canonical key。
    優先順序：
      1. file_path.stem（slug）
      2. term_en lowercase + 連字號化（fallback）
    生產環境中 slug 與 term_en 應一致，但測試樣本或非標準命名時 term_en 是更穩健的識別。
    """
    slug = file_path.stem
    return slug


def get_alternate_term_keys(frontmatter: Dict, file_path: Path) -> List[str]:
    """
    回傳此條目可能對應的所有 detection key（slug + term_en 衍生形式）。
    給 required_caveats 等需要識別「這是哪個術語」的檢查使用。
    """
    keys = [file_path.stem]
    term_en = (frontmatter.get('term_en') or '').strip().lower()
    if term_en:
        # 把空格與斜線轉為連字號，移除其他標點
        normalized = re.sub(r'[\s/]+', '-', term_en)
        normalized = re.sub(r'[^a-z0-9-]', '', normalized)
        if normalized and normalized != file_path.stem:
            keys.append(normalized)
    return keys


# ─── 檢查模組 ─────────────────────────────────────────
def check_schema(frontmatter: Dict, entry_type: str, rules: Dict) -> Result:
    r = Result("【1】Schema 合法性")
    schema_rules = rules['schema']

    # schema_version
    sv = str(frontmatter.get('schema_version', ''))
    expected = schema_rules['current_version']
    if sv == expected:
        r.note(f"schema_version: {sv} ✓")
    else:
        r.error(f"schema_version 應為 \"{expected}\"，實際為 \"{sv or '(未填寫)'}\"")

    # 必填欄位
    required = schema_rules['required_fields'].get(entry_type, [])
    missing = []
    for field in required:
        v = frontmatter.get(field)
        if v is None or v == '' or v == []:
            missing.append(field)
    if missing:
        r.error(f"缺少必填欄位: {', '.join(missing)}")
    else:
        r.note(f"必填欄位完整（共 {len(required)} 個）")

    # 標籤合法性
    topic_tags = frontmatter.get('topic_tags') or []
    reader_tags = frontmatter.get('reader_tags') or []

    valid_topic = set(schema_rules['topic_tags_valid'])
    deprecated_topic = schema_rules.get('topic_tags_deprecated', {}) or {}
    valid_reader = set(schema_rules['reader_tags_valid'])
    deprecated_reader = schema_rules.get('reader_tags_deprecated', {}) or {}

    for t in topic_tags:
        if t in deprecated_topic:
            r.error(f"topic_tag 「{t}」已棄用：{deprecated_topic[t]}")
        elif t not in valid_topic:
            r.error(f"無效的 topic_tag: \"{t}\"")

    for rt in reader_tags:
        if rt in deprecated_reader:
            r.error(f"reader_tag 「{rt}」已棄用：{deprecated_reader[rt]}")
        elif rt not in valid_reader:
            r.error(f"無效的 reader_tag: \"{rt}\"")

    # 標籤數量
    if len(topic_tags) < 1:
        r.error("topic_tags 至少需 1 個")
    elif len(topic_tags) > 4:
        r.error(f"topic_tags 上限 4 個，實際 {len(topic_tags)} 個")

    if len(reader_tags) < 1:
        r.error("reader_tags 至少需 1 個")
    elif len(reader_tags) > 3:
        r.error(f"reader_tags 上限 3 個，實際 {len(reader_tags)} 個")

    # Enum 欄位驗證
    enums = schema_rules.get('enums', {})

    if entry_type == 'book':
        for field, valid_values in [
            ('book_type', enums.get('book_type', [])),
            ('difficulty', enums.get('difficulty', [])),
        ]:
            v = frontmatter.get(field)
            if v and valid_values and v not in valid_values:
                r.error(f"{field} 「{v}」不在合法列表 {valid_values}")

    if entry_type == 'paper':
        for field, valid_values in [
            ('access_type', enums.get('access_type', [])),
            ('study_type', enums.get('study_type', [])),
            ('translation_status', enums.get('translation_status', [])),
            ('difficulty', enums.get('difficulty', [])),
        ]:
            v = frontmatter.get(field)
            if v and valid_values and v not in valid_values:
                r.error(f"{field} 「{v}」不在合法列表 {valid_values}")

        # v1.4: doi 或 article_url 至少一個（conditional required）
        has_doi = bool(frontmatter.get('doi'))
        has_article_url = bool(frontmatter.get('article_url'))
        if not has_doi and not has_article_url:
            r.error("paper 條目必須有 doi 或 article_url 至少一個（v1.4）")

        # 選填 enum
        for field, valid_values in [
            ('oa_type', enums.get('oa_type', [])),
            ('replication_status', enums.get('replication_status', [])),
        ]:
            v = frontmatter.get(field)
            if v and valid_values and v not in valid_values:
                r.warn(f"{field} 「{v}」不在合法列表 {valid_values}")

    return r


def check_slug(file_path: Path, rules: Dict) -> Result:
    r = Result("【2】Slug 命名")
    slug_rules = rules['schema'].get('slug_rules', {})
    slug = file_path.stem

    pattern = slug_rules.get('pattern', '')
    if pattern and not re.match(pattern, slug):
        r.error(f"slug \"{slug}\" 不符合命名規則（lowercase、hyphen 分隔、不以 -/數字 結尾）")
    else:
        r.note(f"slug: {slug} ✓")

    max_len = slug_rules.get('max_length', 40)
    if len(slug) > max_len:
        r.warn(f"slug 長度 {len(slug)} 超過建議 {max_len}")

    forbidden = slug_rules.get('forbidden_chars', [])
    found_forbidden = [c for c in forbidden if c in slug]
    if found_forbidden:
        r.error(f"slug 包含禁止字元: {found_forbidden}")

    return r


def check_lengths(frontmatter: Dict, entry_type: str, rules: Dict) -> Result:
    r = Result("【3】篇幅規範")
    limits = rules['length_limits'].get(entry_type, {})

    if entry_type == 'glossary':
        # tagline
        tagline = frontmatter.get('tagline', '') or ''
        max_tag = limits.get('tagline', {}).get('max', 30)
        if len(tagline) > max_tag:
            r.error(f"tagline {len(tagline)} 字超過上限 {max_tag}")
        else:
            r.note(f"tagline: {len(tagline)}/{max_tag} 字 ✓")

        # definition
        definition = frontmatter.get('definition', '') or ''
        chars = count_chinese_chars(definition)
        d_min = limits.get('definition', {}).get('min', 150)
        d_max = limits.get('definition', {}).get('max', 400)
        if chars < d_min:
            r.warn(f"definition {chars} 字低於建議下限 {d_min}")
        elif chars > d_max:
            r.warn(f"definition {chars} 字超過建議上限 {d_max}")
        else:
            r.note(f"definition: {chars} 字（{d_min}-{d_max} 範圍內）✓")

        # disambiguation
        disambig = frontmatter.get('disambiguation') or []
        if disambig:
            per_max = limits.get('disambiguation_per_item', {}).get('max', 100)
            total_max = limits.get('disambiguation_total', {}).get('max', 500)
            total = 0
            for i, item in enumerate(disambig):
                note_text = item.get('note', '') if isinstance(item, dict) else ''
                item_chars = count_chinese_chars(note_text)
                total += item_chars
                if item_chars > per_max:
                    r.warn(f"disambiguation[{i}] {item_chars} 字超過單條上限 {per_max}")
            if total > total_max:
                r.warn(f"disambiguation 總計 {total} 字超過上限 {total_max}")
            else:
                r.note(f"disambiguation 共 {len(disambig)} 條 / {total} 字")

        # usage_notes
        un = frontmatter.get('usage_notes', '') or ''
        un_chars = count_chinese_chars(un)
        un_max = limits.get('usage_notes', {}).get('max', 200)
        if un_chars > un_max:
            r.warn(f"usage_notes {un_chars} 字超過上限 {un_max}")

        # controversies
        cv = frontmatter.get('controversies', '') or ''
        cv_chars = count_chinese_chars(cv)
        cv_max = limits.get('controversies', {}).get('max', 200)
        if cv_chars > cv_max:
            r.warn(f"controversies {cv_chars} 字超過上限 {cv_max}")

    elif entry_type == 'book':
        abstract = frontmatter.get('abstract_zh', '') or ''
        chars = count_chinese_chars(abstract)
        a_min = limits.get('abstract_zh', {}).get('min', 100)
        a_max = limits.get('abstract_zh', {}).get('max', 300)
        if chars < a_min:
            r.warn(f"abstract_zh {chars} 字低於建議下限 {a_min}")
        elif chars > a_max:
            r.warn(f"abstract_zh {chars} 字超過建議上限 {a_max}")
        else:
            r.note(f"abstract_zh: {chars} 字（{a_min}-{a_max} 範圍內）✓")

    elif entry_type == 'paper':
        abstract = frontmatter.get('abstract_zh', '') or ''
        chars = count_chinese_chars(abstract)
        # Review/meta-analysis 用較寬鬆的上限
        is_review = frontmatter.get('study_type') in ('review', 'systematic-review', 'meta-analysis')
        if is_review:
            spec = limits.get('abstract_zh_review', {})
        else:
            spec = limits.get('abstract_zh', {})
        a_min = spec.get('min', 150)
        a_max = spec.get('max', 400)
        if chars < a_min:
            r.warn(f"abstract_zh {chars} 字低於建議下限 {a_min}")
        elif chars > a_max:
            r.warn(f"abstract_zh {chars} 字超過建議上限 {a_max}{'（review 類）' if is_review else ''}")
        else:
            r.note(f"abstract_zh: {chars} 字（{a_min}-{a_max} 範圍內）✓")

    # 通用：curator_note 句數
    cn = frontmatter.get('curator_note', '') or ''
    if cn:
        sentences = count_sentences_zh(cn)
        if sentences < 1 or sentences > 5:
            r.warn(f"curator_note 句數 {sentences}（建議 1-5 句）")

    return r


def check_neutrality(content_for_check: str, rules: Dict) -> Result:
    """檢查第一人稱與主觀觀察詞。"""
    r = Result("【4】語氣中性化")
    forbidden = rules['neutrality']['forbidden_phrases']
    found = []
    for phrase in forbidden:
        if phrase in content_for_check:
            found.append(phrase)
    if found:
        r.error(f"發現第一人稱/主觀觀察詞: {', '.join(found)}")
    else:
        r.note("語氣中性 ✓")
    return r


def check_prescriptive(content_for_check: str, rules: Dict) -> Result:
    """檢查規範性語言（避免「應該」式絕對化）。"""
    r = Result("【5】規範性語言")
    patterns = rules['prescriptive_language']['patterns']
    found = []
    for p in patterns:
        if re.search(p, content_for_check):
            found.append(p)
    if found:
        r.warn(f"發現規範性語言模式: {len(found)} 個")
        for p in found:
            r.note(f"  pattern: {p}")
    else:
        r.note("無絕對化語言 ✓")
    return r


def check_ai_writing(content_for_check: str, rules: Dict) -> Result:
    """檢查 AI 塑膠句式、破折號濫用、空洞修飾詞。"""
    r = Result("【6】AI 寫作偵測")
    ai_rules = rules['ai_plastic_phrases']

    # 塑膠句式
    plastic_count = 0
    matched_patterns = []
    for p in ai_rules['patterns']:
        matches = re.findall(p, content_for_check)
        if matches:
            plastic_count += len(matches)
            matched_patterns.append((p, len(matches)))

    thresholds = ai_rules.get('thresholds', {})
    error_at = thresholds.get('error_at', 3)
    warn_at = thresholds.get('warn_at', 1)

    if plastic_count >= error_at:
        r.error(f"AI 塑膠句式過多: {plastic_count} 處（≥{error_at} 視為 error）")
        for p, c in matched_patterns:
            r.note(f"  「{p}」 x{c}")
    elif plastic_count >= warn_at:
        r.warn(f"AI 塑膠句式: {plastic_count} 處")
        for p, c in matched_patterns:
            r.note(f"  「{p}」 x{c}")

    # 破折號濫用
    dash_count = content_for_check.count('——')
    dash_max = ai_rules.get('dash_max', 4)
    if dash_count > dash_max:
        r.warn(f"破折號「——」{dash_count} 個（建議 ≤{dash_max}）")

    # 空洞修飾詞
    hollow_words = ai_rules.get('hollow_modifiers', [])
    hollow_count = 0
    for w in hollow_words:
        hollow_count += content_for_check.count(w)
    h_thresh = ai_rules.get('hollow_thresholds', {})
    h_warn = h_thresh.get('warn_at', 4)
    h_error = h_thresh.get('error_at', 8)
    if hollow_count >= h_error:
        r.error(f"空洞修飾詞過多: {hollow_count} 個")
    elif hollow_count >= h_warn:
        r.warn(f"空洞修飾詞: {hollow_count} 個")

    if not r.has_issues:
        r.note("AI 寫作特徵 clean ✓")

    return r


def check_china_terms(content_for_check: str, rules: Dict) -> Result:
    """檢查中國用語。"""
    r = Result("【7】中國用語偵測")
    a_count = 0
    b_count = 0
    for term_def in rules.get('china_terms', []):
        term = term_def['cterm']
        count = content_for_check.count(term)
        if count == 0:
            continue
        # 處理 false positives
        false_pos = 0
        for fp in term_def.get('false_positives', []):
            false_pos += content_for_check.count(fp)
        actual = count - false_pos
        if actual <= 0:
            continue

        severity = term_def.get('severity', 'A')
        taiwan = term_def.get('taiwan', '')
        msg = f"「{term}」x{actual}"
        if taiwan:
            msg += f"（建議改用「{taiwan}」）"

        if severity == 'A':
            r.error(msg)
            a_count += actual
        else:
            r.warn(msg)
            b_count += actual

    if a_count == 0 and b_count == 0:
        r.note("無中國用語 ✓")
    return r


def check_policy(content_for_check: str, frontmatter: Dict, file_path: Path, rules: Dict) -> Result:
    """政策禁區檢查（包含 context-aware 邏輯）。"""
    r = Result("【8】政策禁區")
    policy = rules.get('policy_violations', {})
    keys = get_alternate_term_keys(frontmatter, file_path)
    slug = file_path.stem

    # 1. 操作安全指引
    safety = policy.get('safety_instructions', {})
    for p in safety.get('patterns', []):
        if re.search(p, content_for_check):
            r.error(f"安全指引模式「{p}」（{safety.get('note', '')}）")

    # 2. 個人/工作室背書
    endorse = policy.get('personal_endorsement', {})
    for p in endorse.get('patterns', []):
        if re.search(p, content_for_check):
            r.error(f"個人背書模式「{p}」（{endorse.get('note', '')}）")

    # 3. 未成年（context-aware）
    underage = policy.get('underage', {})
    allowed_slugs = underage.get('allowed_in_slug', [])
    allowed_fields = underage.get('allowed_only_in_fields', [])

    # 找出所有違規詞
    underage_hits = []
    for p in underage.get('patterns', []):
        if re.search(p, content_for_check):
            underage_hits.append(p)

    if underage_hits:
        # 任一 alternate key 命中允許清單即視為 ageplay 系列條目
        is_allowed_entry = any(k in allowed_slugs for k in keys)
        if is_allowed_entry:
            # 在允許條目中，檢查是否僅出現於允許欄位
            # 檢查方式：把允許欄位的內容拼出來，然後從 content 中扣除，
            # 看剩下的部分是否還有違規詞
            allowed_text = ''
            for af in allowed_fields:
                v = frontmatter.get(af)
                allowed_text += '\n' + get_yaml_field_value_as_str(v)

            # 簡化檢查：若違規詞同樣出現在允許欄位中，視為合法
            for p in underage_hits:
                in_allowed = bool(re.search(p, allowed_text))
                in_other = False
                # 檢查 definition / tagline / usage_notes 等其他主要欄位
                for other_field in ('definition', 'tagline', 'usage_notes', 'abstract_zh', 'curator_note'):
                    other_text = get_yaml_field_value_as_str(frontmatter.get(other_field, ''))
                    if re.search(p, other_text):
                        in_other = True
                        break
                if in_other and not in_allowed:
                    r.error(f"未成年詞「{p}」出現於主要欄位（應僅在 {allowed_fields} 中作為保護聲明）")
                elif in_allowed:
                    r.note(f"未成年詞「{p}」於允許欄位中（保護聲明用途）✓")
        else:
            for p in underage_hits:
                r.error(f"未成年詞「{p}」於非 ageplay 條目（{underage.get('note', '')}）")

    # 4. 窒息立場質疑
    breath = policy.get('breath_play_dispute', {})
    for p in breath.get('patterns', []):
        if re.search(p, content_for_check):
            r.error(f"窒息立場質疑模式「{p}」（{breath.get('note', '')}）")

    if not r.has_issues:
        r.note("無政策禁區命中 ✓")

    return r


def check_required_caveats(frontmatter: Dict, file_path: Path, rules: Dict) -> Result:
    """高敏感詞 caveats 強制檢查。"""
    r = Result("【9】高敏感詞 caveats 強制")
    keys = get_alternate_term_keys(frontmatter, file_path)
    required = rules.get('required_caveats', {})

    # 任一 key 命中即套用對應規則（slug 優先）
    matched_key = None
    for k in keys:
        if k in required:
            matched_key = k
            break

    if matched_key is None:
        r.note(f"條目 {file_path.stem} 不在高敏感清單，跳過")
        return r

    spec = required[matched_key]
    if matched_key != file_path.stem:
        r.note(f"由 term_en「{matched_key}」匹配高敏感清單（slug 為 {file_path.stem}）")
    note = spec.get('note', '')
    r.note(f"高敏感詞: {note}")

    # 必填欄位
    for field in spec.get('required_fields', []):
        v = frontmatter.get(field)
        if not v:
            r.error(f"必須有 {field} 欄位")

    # tagline 必含詞
    for word in spec.get('required_in_tagline', []):
        tagline = frontmatter.get('tagline', '') or ''
        if word not in tagline:
            r.error(f"tagline 必須含「{word}」字樣（保護聲明）")

    # caveats 必含特定 type
    required_types = spec.get('required_caveats_types', [])
    if required_types:
        caveats = frontmatter.get('caveats') or []
        caveat_types = [c.get('type', '') for c in caveats if isinstance(c, dict)]
        for t in required_types:
            if t not in caveat_types:
                r.error(f"caveats 必須包含 type: {t}")

    # 必含關鍵字（DSM 區別）
    keywords_spec = spec.get('required_keywords_in', {})
    for location, keywords in keywords_spec.items():
        if location == 'definition_or_disambiguation':
            target_text = ''
            target_text += get_yaml_field_value_as_str(frontmatter.get('definition', ''))
            target_text += '\n' + get_yaml_field_value_as_str(frontmatter.get('disambiguation', []))
            target_text += '\n' + get_yaml_field_value_as_str(frontmatter.get('controversies', ''))
            for kw in keywords:
                if kw not in target_text:
                    r.error(f"definition / disambiguation / controversies 必須提及「{kw}」")

    return r


# ─── 主流程 ───────────────────────────────────────────
def main() -> int:
    parser = argparse.ArgumentParser(
        description="kinkref.org 投稿前自檢器（self-check.py v1.0）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('file', help='要檢查的 .md 檔案路徑')
    parser.add_argument('--rules', default=None,
                        help='Detection rules YAML 路徑（預設: scripts/data/detection-rules.yaml）')
    parser.add_argument('--strict', action='store_true',
                        help='嚴格模式：警告也視為失敗（退出碼 1）')
    parser.add_argument('--type', choices=['glossary', 'book', 'paper'], default=None,
                        help='強制指定條目類型（不靠路徑與 frontmatter 自動推斷）')

    args = parser.parse_args()

    # 找 detection rules
    if args.rules:
        rules_path = Path(args.rules)
    else:
        script_dir = Path(__file__).parent.resolve()
        rules_path = script_dir / 'data' / 'detection-rules.yaml'

    if not rules_path.exists():
        print(f"{C.RED}錯誤：找不到 detection rules: {rules_path}{C.RST}", file=sys.stderr)
        return 2

    try:
        with open(rules_path, 'r', encoding='utf-8') as f:
            rules = yaml.safe_load(f)
    except yaml.YAMLError as e:
        print(f"{C.RED}錯誤：detection rules YAML 格式錯誤: {e}{C.RST}", file=sys.stderr)
        return 2

    # 找目標檔案
    file_path = Path(args.file).resolve()
    if not file_path.exists():
        print(f"{C.RED}錯誤：找不到檔案: {file_path}{C.RST}", file=sys.stderr)
        return 2

    # 解析 frontmatter
    try:
        frontmatter, body, content = parse_entry(file_path)
    except ValueError as e:
        print(f"{C.RED}❌ 解析失敗: {e}{C.RST}", file=sys.stderr)
        return 2

    # 推斷條目類型
    try:
        entry_type = args.type or detect_entry_type(frontmatter, file_path)
    except ValueError as e:
        print(f"{C.RED}❌ {e}{C.RST}", file=sys.stderr)
        return 2

    # 標題
    print()
    print(f"🔍 {C.BLD}self-check v1.0{C.RST} — 投稿前自檢")
    print(f"   檔案: {file_path.name}")
    print(f"   類型: {entry_type}")
    print(f"   schema 版本: v{rules['schema']['current_version']}")
    print("=" * 60)

    # 用於語氣/政策/AI 偵測的合併內容（不含 frontmatter 的 schema 元資料，但含所有可閱讀欄位）
    content_for_check = body  # 主 body
    # 把所有文本欄位也加入
    for field in ('definition', 'abstract_zh', 'tagline', 'usage_notes',
                  'controversies', 'curator_note'):
        v = frontmatter.get(field, '')
        if isinstance(v, str):
            content_for_check += '\n' + v
    # disambiguation 內的 note
    for item in (frontmatter.get('disambiguation') or []):
        if isinstance(item, dict):
            content_for_check += '\n' + (item.get('note', '') or '')

    # 執行所有檢查
    results: List[Result] = []
    results.append(check_schema(frontmatter, entry_type, rules))
    results.append(check_slug(file_path, rules))
    results.append(check_lengths(frontmatter, entry_type, rules))
    results.append(check_neutrality(content_for_check, rules))
    results.append(check_prescriptive(content_for_check, rules))
    results.append(check_ai_writing(content_for_check, rules))
    results.append(check_china_terms(content_for_check, rules))
    results.append(check_policy(content_for_check, frontmatter, file_path, rules))
    results.append(check_required_caveats(frontmatter, file_path, rules))

    # 渲染結果
    for res in results:
        res.render()

    # 統計
    total_errors = sum(len(r.errors) for r in results)
    total_warnings = sum(len(r.warnings) for r in results)

    # 總結
    print()
    print("=" * 60)
    if total_errors == 0 and total_warnings == 0:
        print(f"{C.GRN}✅ 全部通過，可以提交{C.RST}")
        return 0
    elif total_errors == 0:
        print(f"{C.YEL}⚠️  {total_warnings} 個警告（可提交但建議檢查）{C.RST}")
        return 1 if args.strict else 0
    else:
        if total_warnings:
            print(f"{C.RED}⛔ {total_errors} 個錯誤、{total_warnings} 個警告{C.RST}")
        else:
            print(f"{C.RED}⛔ {total_errors} 個錯誤{C.RST}")
        return 1


if __name__ == '__main__':
    sys.exit(main())
