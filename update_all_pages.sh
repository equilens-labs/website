#!/bin/bash

# Update all HTML pages with elegant CSS

echo "Updating all pages with elegant CSS..."

# Find all HTML files and update them
find . -name "*.html" -type f ! -path "./output/*" ! -path "./.git/*" | while read file; do
    # Check if file already has elegant.css
    if ! grep -q "elegant.css" "$file"; then
        # Check if it has base.css reference
        if grep -q "base.css" "$file"; then
            echo "Updating: $file"

            # Determine the correct path prefix based on file location
            depth=$(echo "$file" | tr -cd '/' | wc -c)
            if [ "$depth" -eq 1 ]; then
                # Root level file
                prefix="."
            elif [ "$depth" -eq 2 ]; then
                # One level deep
                prefix=".."
            else
                # Two or more levels deep
                prefix="../.."
            fi

            # Add elegant.css after base.css
            sed -i "s|${prefix}/assets/base.css\"|${prefix}/assets/base.css\">\n  <link rel=\"stylesheet\" href=\"${prefix}/assets/elegant.css\"|" "$file" 2>/dev/null || \
            sed -i "" "s|${prefix}/assets/base.css\"|${prefix}/assets/base.css\">\n  <link rel=\"stylesheet\" href=\"${prefix}/assets/elegant.css\"|" "$file"

            # Also handle different formatting (with href= instead of rel=)
            sed -i "s|href=\"${prefix}/assets/base.css\" rel|href=\"${prefix}/assets/base.css\" rel=\"stylesheet\"/>\n  <link href=\"${prefix}/assets/elegant.css\" rel|" "$file" 2>/dev/null || \
            sed -i "" "s|href=\"${prefix}/assets/base.css\" rel|href=\"${prefix}/assets/base.css\" rel=\"stylesheet\"/>\n  <link href=\"${prefix}/assets/elegant.css\" rel|" "$file"
        fi
    else
        echo "Already updated: $file"
    fi
done

echo "Done! All pages updated."