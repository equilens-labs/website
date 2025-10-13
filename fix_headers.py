#!/usr/bin/env python3
import os
import re
from pathlib import Path

def fix_html_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix brand structure
    old_brand = r'<span class="brand-name">Equilens</span>\s*<span class="brand-pill"[^>]*>FL-BSA</span>'
    new_brand = '''<div class="brand-text">
        <span class="brand-name">Equilens</span>
        <span class="brand-tagline">Algorithmic Compliance</span>
      </div>'''
    content = re.sub(old_brand, new_brand, content)

    # Remove duplicate CSS links
    lines = content.split('\n')
    seen_css = set()
    new_lines = []

    for line in lines:
        # Check for CSS links
        if 'href="../assets/base.css"' in line or 'href="./assets/base.css"' in line:
            if 'base.css' not in seen_css:
                # Ensure proper format
                if 'rel="stylesheet"' not in line:
                    line = re.sub(r'href="([^"]+base\.css)"[^>]*', r'href="\1" rel="stylesheet"', line)
                new_lines.append(line)
                seen_css.add('base.css')
        elif 'href="../assets/elegant.css"' in line or 'href="./assets/elegant.css"' in line:
            if 'elegant.css' not in seen_css:
                # Ensure proper format
                if 'rel="stylesheet"' not in line:
                    line = re.sub(r'href="([^"]+elegant\.css)"[^>]*', r'href="\1" rel="stylesheet"', line)
                new_lines.append(line)
                seen_css.add('elegant.css')
        elif 'href="../assets/product.css"' in line or 'href="./assets/product.css"' in line:
            if 'product.css' not in seen_css:
                # Ensure proper format
                if 'rel="stylesheet"' not in line:
                    line = re.sub(r'href="([^"]+product\.css)"[^>]*', r'href="\1" rel="stylesheet"', line)
                new_lines.append(line)
                seen_css.add('product.css')
        else:
            new_lines.append(line)

    content = '\n'.join(new_lines)

    with open(filepath, 'w') as f:
        f.write(content)

    print(f"Fixed: {filepath}")

# Find and fix all HTML files
for root, dirs, files in os.walk('.'):
    # Skip certain directories
    if 'output' in root or '.git' in root or 'screenshots' in root:
        continue

    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            fix_html_file(filepath)

print("All files fixed!")