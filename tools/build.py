#!/usr/bin/env python3
"""
Build a portable single-file version of the site.

The site itself stays split (index.html + css/ + js/ + fonts/ + assets/)
because that is what you push to GitHub. This script produces ONE
self-contained HTML file with the stylesheet, the script, the fonts and the
project images all inlined as data URIs, so it renders anywhere:

    python3 tools/build.py

Output: single-file.html  (drop it in an email, a chat, or any static host)

Why keep both? The split version caches properly (fonts and images are
immutable), loads faster on a second visit, and is readable. The single
file has no requests at all, which is what you want for a file that has to
survive being moved around.
"""

from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"
OUT = ROOT / "single-file.html"

MIME = {
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
}


def data_uri(path: Path) -> str:
    """Read a file and return a base64 data URI."""
    mime = MIME.get(path.suffix.lower(), "application/octet-stream")
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{payload}"


def inline_fonts(css: str) -> str:
    """Replace url('../fonts/x.woff2') with an inlined data URI."""
    def repl(match):
        rel = match.group(1)
        target = (ROOT / "css" / rel).resolve()
        return f"url('{data_uri(target)}')" if target.exists() else match.group(0)

    return re.sub(r"url\('([^']*fonts/[^']+\.woff2)'\)", repl, css)


def main() -> None:
    html = SRC.read_text()
    css = inline_fonts((ROOT / "css" / "style.css").read_text())
    js = (ROOT / "js" / "main.js").read_text()

    # 1. stylesheet -> inline <style>
    html = html.replace(
        '<link rel="stylesheet" href="css/style.css">',
        f"<style>\n{css}\n</style>",
    )

    # 2. script -> inline, keep `defer` semantics by placing it at the end of body
    html = html.replace(
        '<script src="js/main.js" defer></script>',
        f"<script>\n{js}\n</script>",
    )

    # 3. project images -> data URIs
    def inline_img(match):
        rel = match.group(1)
        target = (ROOT / rel).resolve()
        return f'src="{data_uri(target)}"' if target.exists() else match.group(0)

    html = re.sub(r'src="(assets/[^"]+\.(?:webp|png|jpe?g|svg))"', inline_img, html)

    # 4. make the OG image absolute-friendly note (it can't be a relative path once inlined)
    OUT.write_text(html)

    kb = OUT.stat().st_size / 1024
    print(f"wrote {OUT.relative_to(ROOT)} — {kb:.0f} KB, zero network requests")


if __name__ == "__main__":
    main()
