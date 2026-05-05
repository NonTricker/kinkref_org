#!/usr/bin/env python3
"""
audit-internal-links.py — 內部連結審計工具

掃描所有 content/glossary/*.md 條目的 frontmatter，
檢查 related_terms 中的 slug 是否已在正文（definition + usage_notes + disambiguation notes）
中以 [text](/glossary/slug) 格式連結。

輸出：純文字報告至 stdout。
"""

import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML is required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


def parse_frontmatter(filepath: Path) -> dict | None:
    """Parse YAML frontmatter delimited by --- from a markdown file."""
    text = filepath.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return None
    try:
        return yaml.safe_load(match.group(1))
    except yaml.YAMLError as e:
        print(f"  WARNING: YAML parse error in {filepath.name}: {e}", file=sys.stderr)
        return None


def extract_combined_text(fm: dict) -> str:
    """Extract combined text from definition, usage_notes, and disambiguation notes."""
    parts = []

    definition = fm.get("definition", "")
    if definition:
        parts.append(str(definition))

    usage_notes = fm.get("usage_notes", "")
    if usage_notes:
        parts.append(str(usage_notes))

    disambiguation = fm.get("disambiguation", [])
    if disambiguation:
        for item in disambiguation:
            note = item.get("note", "")
            if note:
                parts.append(str(note))

    return "\n".join(parts)


def extract_linked_slugs(text: str) -> set[str]:
    """Find all markdown links pointing to /glossary/slug and return the set of slugs."""
    # Pattern: [any text](/glossary/some-slug)
    pattern = r"\[[^\]]*\]\(/glossary/([a-z0-9\-]+)\)"
    return set(re.findall(pattern, text))


def check_slug_mentioned(text: str, slug: str) -> bool:
    """Check if a slug is mentioned in text (as plain text, ignoring links)."""
    # Check if the slug appears as plain text (not inside a link target)
    # We look for the slug string anywhere in the text
    return slug in text


def main():
    project_root = Path(__file__).resolve().parent.parent
    glossary_dir = project_root / "content" / "glossary"

    if not glossary_dir.exists():
        print(f"ERROR: Glossary directory not found: {glossary_dir}", file=sys.stderr)
        sys.exit(1)

    md_files = sorted(glossary_dir.glob("*.md"))
    if not md_files:
        print("ERROR: No .md files found in glossary directory.", file=sys.stderr)
        sys.exit(1)

    # Collect all existing slugs (filenames without .md)
    existing_slugs = {f.stem for f in md_files}

    total_entries = 0
    entries_with_zero_links = []
    total_links_all = 0

    print("=" * 72)
    print("  INTERNAL LINK AUDIT REPORT")
    print(f"  Glossary entries scanned: {len(md_files)}")
    print("=" * 72)
    print()

    for filepath in md_files:
        fm = parse_frontmatter(filepath)
        if fm is None:
            print(f"[SKIP] {filepath.name} — could not parse frontmatter")
            print()
            continue

        total_entries += 1
        slug = filepath.stem
        related_terms = fm.get("related_terms", []) or []
        combined_text = extract_combined_text(fm)
        linked_slugs = extract_linked_slugs(combined_text)
        total_links = len(re.findall(r"\[[^\]]*\]\(/glossary/[a-z0-9\-]+\)", combined_text))

        total_links_all += total_links

        # Classify each related_term
        already_linked = []
        mentioned_not_linked = []
        not_mentioned = []

        for rt in related_terms:
            rt = str(rt).strip()
            if rt in linked_slugs:
                already_linked.append(rt)
            elif check_slug_mentioned(combined_text, rt):
                mentioned_not_linked.append(rt)
            else:
                not_mentioned.append(rt)

        # Flag entries with 0 links
        if total_links == 0:
            entries_with_zero_links.append(slug)

        # Output per entry
        print(f"--- {slug} ---")
        print(f"  Total internal links in text: {total_links}")
        print(f"  Related terms declared: {len(related_terms)}")

        if already_linked:
            print(f"  [OK] Linked ({len(already_linked)}): {', '.join(already_linked)}")
        if mentioned_not_linked:
            print(f"  [~]  Mentioned but NOT linked ({len(mentioned_not_linked)}): {', '.join(mentioned_not_linked)}")
        if not_mentioned:
            print(f"  [!]  Not mentioned at all ({len(not_mentioned)}): {', '.join(not_mentioned)}")

        if total_links == 0:
            print(f"  ** FLAG: Zero internal links **")

        # Also report links to slugs NOT in related_terms
        extra_linked = linked_slugs - set(str(rt).strip() for rt in related_terms)
        if extra_linked:
            print(f"  [i]  Linked but not in related_terms: {', '.join(sorted(extra_linked))}")

        # Report links to non-existent entries
        broken = linked_slugs - existing_slugs
        if broken:
            print(f"  [X]  BROKEN links (target does not exist): {', '.join(sorted(broken))}")

        print()

    # Summary
    print("=" * 72)
    print("  SUMMARY")
    print("=" * 72)
    print(f"  Total entries audited: {total_entries}")
    print(f"  Total internal links found: {total_links_all}")
    print(f"  Average links per entry: {total_links_all / max(total_entries, 1):.1f}")
    print()
    print(f"  Entries with ZERO links: {len(entries_with_zero_links)}")
    if entries_with_zero_links:
        for s in entries_with_zero_links:
            print(f"    - {s}")
    print()
    print("=" * 72)
    print("  END OF REPORT")
    print("=" * 72)


if __name__ == "__main__":
    main()
