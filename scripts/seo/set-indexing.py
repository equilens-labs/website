#!/usr/bin/env python3
"""Toggle meta robots tag across all HTML files.

Usage: python3 scripts/seo/set-indexing.py private|public
Defaults to private if no argument supplied. Works regardless of the
current working directory by resolving the repository root relative to
this script.
"""
from __future__ import annotations

import pathlib
import re
import sys

ALLOWED_MODES = {"private", "public"}
DEFAULT_MODE = "private"
META_PRIVATE = '<meta name="robots" content="noindex, nofollow">'
META_NOINDEX = '<meta name="robots" content="noindex">'
PUBLIC_NOINDEX_PATHS = {"404.html"}
META_PATTERN = re.compile(
    r"\s*<meta[^>]*\sname=['\"]robots['\"][^>]*>\s*", re.IGNORECASE
)


def repo_root() -> pathlib.Path:
    script_path = pathlib.Path(__file__).resolve()
    candidate = script_path.parents[2]
    if candidate.joinpath("index.html").exists():
        return candidate
    return pathlib.Path.cwd()


def inject_robots_meta(content: str, meta_tag: str) -> str:
    injected = False

    def _inject_after(match: re.Match[str]) -> str:
        segment = match.group(1)
        if segment.endswith("\n"):
            return f"{segment}  {meta_tag}\n"
        return f"{segment}\n  {meta_tag}\n"

    content, count = re.subn(
        r"(<meta\s+name=['\"]viewport['\"][^>]*>\s*)",
        _inject_after,
        content,
        count=1,
        flags=re.IGNORECASE,
    )
    injected = injected or count > 0

    if not injected:
        content, count = re.subn(
            r"(<meta\s+charset[^>]*>\s*)",
            _inject_after,
            content,
            count=1,
            flags=re.IGNORECASE,
        )
        injected = injected or count > 0

    if not injected:
        if "<head" in content.lower():
            content, count = re.subn(
                r"<head(\s*[^>]*)>",
                lambda m: f"{m.group(0)}\n  {meta_tag}",
                content,
                count=1,
                flags=re.IGNORECASE,
            )
            if count == 0:
                content = content.replace("<head>", f"<head>\n  {meta_tag}", 1)
        else:
            content = meta_tag + "\n" + content

    return content


def set_mode(html_path: pathlib.Path, mode: str, root: pathlib.Path) -> None:
    original = html_path.read_text(encoding="utf-8")
    content = META_PATTERN.sub("", original)

    relative_path = html_path.relative_to(root).as_posix()
    if mode == "private":
        content = inject_robots_meta(content, META_PRIVATE)
    elif relative_path in PUBLIC_NOINDEX_PATHS:
        content = inject_robots_meta(content, META_NOINDEX)

    content = re.sub(
        r"(<head[^>]*>)(?!\s*\n)",
        lambda m: f"{m.group(1)}\n",
        content,
        count=1,
        flags=re.IGNORECASE,
    )

    for tag in ("meta", "title", "link"):
        content = re.sub(
            rf"\n\s*(<(?:{tag})[^>]*>)",
            lambda m: "\n  " + m.group(1).lstrip(),
            content,
            flags=re.IGNORECASE,
        )

    content = re.sub(
        r">\s*<(meta|title|link)([^>]*)>",
        lambda m: f">\n  <{m.group(1)}{m.group(2)}>",
        content,
        flags=re.IGNORECASE,
    )

    if content != original:
        html_path.write_text(content, encoding="utf-8")


def main() -> int:
    mode = sys.argv[1].lower() if len(sys.argv) > 1 else DEFAULT_MODE
    if mode not in ALLOWED_MODES:
        raise SystemExit("mode must be private|public")

    root = repo_root()
    html_files = sorted(root.rglob("*.html"))
    for html_file in html_files:
        set_mode(html_file, mode, root)

    print(f"[OK] set-indexing: {mode} ({len(html_files)} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
