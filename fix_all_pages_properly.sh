#!/bin/bash

echo "Comprehensive fix for all pages..."

# Function to fix a single file
fix_file() {
    local file=$1
    echo "Fixing: $file"

    # Create temporary file
    temp_file="${file}.tmp"

    # Read and process the file
    while IFS= read -r line; do
        # Skip duplicate CSS links
        if [[ "$line" == *"<link href="*"assets/base.css\""* ]] && [[ "$prev_line" == *"assets/base.css"* ]]; then
            continue
        fi
        if [[ "$line" == *"<link"*"assets/elegant.css"* ]] && [[ "$prev_line" == *"assets/elegant.css"* ]]; then
            continue
        fi
        if [[ "$line" == *"<link"*"assets/product.css"* ]] && [[ "$prev_line" == *"assets/product.css"* ]]; then
            continue
        fi

        # Fix brand structure - replace old with new
        if [[ "$line" == *"<span class=\"brand-name\">Equilens</span>"* ]]; then
            # Check if next line has brand-pill
            read -r next_line
            if [[ "$next_line" == *"brand-pill"* ]]; then
                echo '      <div class="brand-text">' >> "$temp_file"
                echo '        <span class="brand-name">Equilens</span>' >> "$temp_file"
                echo '        <span class="brand-tagline">Algorithmic Compliance</span>' >> "$temp_file"
                echo '      </div>' >> "$temp_file"
                continue
            else
                # Write original line if not followed by brand-pill
                echo "$line" >> "$temp_file"
                echo "$next_line" >> "$temp_file"
            fi
        else
            echo "$line" >> "$temp_file"
        fi

        prev_line="$line"
    done < "$file"

    # Replace original file
    mv "$temp_file" "$file"
}

# Fix all HTML files
find . -name "*.html" -type f ! -path "./output/*" ! -path "./.git/*" ! -path "./screenshots/*" | while read file; do
    fix_file "$file"
done

echo "Done with comprehensive fixes!"