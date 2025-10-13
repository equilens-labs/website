#!/bin/bash

echo "Fixing headers on all pages..."

# Fix all HTML files
find . -name "*.html" -type f ! -path "./output/*" ! -path "./.git/*" ! -path "./screenshots/*" | while read file; do
    echo "Fixing: $file"

    # Replace the old brand structure with new one
    sed -i 's|<span class="brand-name">Equilens</span>\s*<span class="brand-pill"[^>]*>FL-BSA</span>|<div class="brand-text"><span class="brand-name">Equilens</span><span class="brand-tagline">Algorithmic Compliance</span></div>|g' "$file" 2>/dev/null || \
    sed -i "" 's|<span class="brand-name">Equilens</span>\s*<span class="brand-pill"[^>]*>FL-BSA</span>|<div class="brand-text"><span class="brand-name">Equilens</span><span class="brand-tagline">Algorithmic Compliance</span></div>|g' "$file"

    # Add product.css to all pages that have elegant.css
    if grep -q "elegant.css" "$file" && ! grep -q "product.css" "$file"; then
        # Determine path prefix
        depth=$(echo "$file" | tr -cd '/' | wc -c)
        if [ "$depth" -eq 1 ]; then
            prefix="."
        elif [ "$depth" -eq 2 ]; then
            prefix=".."
        else
            prefix="../.."
        fi

        sed -i "s|href=\"${prefix}/assets/elegant.css\"|href=\"${prefix}/assets/elegant.css\">\n  <link rel=\"stylesheet\" href=\"${prefix}/assets/product.css\"|" "$file" 2>/dev/null || \
        sed -i "" "s|href=\"${prefix}/assets/elegant.css\"|href=\"${prefix}/assets/elegant.css\">\n  <link rel=\"stylesheet\" href=\"${prefix}/assets/product.css\"|" "$file"
    fi
done

echo "Done fixing headers!"