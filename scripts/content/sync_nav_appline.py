#!/usr/bin/env python3
import pathlib, re

root = pathlib.Path('.')

def depth_prefix(p: pathlib.Path) -> str:
    parts = p.relative_to(root).parts
    return '' if len(parts) <= 1 else '../' * (len(parts)-1)

HEADER = """
<header class="relative z-50 w-full border-b border-slate-200 bg-white">
  <div class="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
    <a class="flex items-center gap-2 text-slate-900 no-underline" href="{D}">
      <img class="h-8 w-8" src="{D}assets/brand/logo-mark.svg" width="32" height="32" alt="">
      <span class="font-semibold">Equilens</span>
      <span class="ml-1 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">FL-BSA</span>
    </a>
    <nav class="hidden md:flex items-center gap-6" aria-label="Primary">
      <a href="{D}">Home</a>
      <a href="{D}fl-bsa/">FL-BSA</a>
      <a href="{D}trust-center/">Trust Center</a>
      <a href="{D}pricing/">Pricing</a>
      <a href="{D}contact/">Contact</a>
      <a href="{D}legal/">Legal</a>
    </nav>
  </div>
</header>
""".strip()

FOOTER = """
<footer class="border-t border-slate-200 bg-white">
  <div class="mx-auto max-w-7xl px-6 py-6 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
    <span>© 2025 Equilens</span>
    <a href="{D}docs/">Docs</a>
    <a href="{D}faq/">FAQ</a>
    <a href="{D}press/">Press</a>
    <a href="{D}procurement/">Procurement</a>
  </div>
</footer>
""".strip()

for html in root.rglob('*.html'):
    s = html.read_text(encoding='utf-8')
    D = depth_prefix(html)
    new = re.sub(r"<header[\s\S]*?</header>", HEADER.replace('{D}', D), s, flags=re.I)
    new = re.sub(r"<footer[\s\S]*?</footer>", FOOTER.replace('{D}', D), new, flags=re.I)
    if new != s:
        html.write_text(new, encoding='utf-8')
        print('[shell] updated', html)

print('Done.')

