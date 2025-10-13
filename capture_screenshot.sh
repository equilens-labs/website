#!/bin/bash

# Script to capture website screenshots using Chromium headless
# Works around snap sandbox restrictions

URL="${1:-http://localhost:8000}"
OUTPUT="${2:-homepage.png}"
VIEWPORT="${3:-1920,1080}"

# Use current directory for output
FULL_PATH="$(pwd)/screenshots/$OUTPUT"

echo "Capturing screenshot..."
echo "URL: $URL"
echo "Output: $FULL_PATH"
echo "Viewport: $VIEWPORT"

# Create screenshots directory if it doesn't exist
mkdir -p screenshots

# Try different methods to get a screenshot
echo ""
echo "Method 1: Using chromium with current directory..."
chromium-browser --headless --disable-gpu --no-sandbox \
    --window-size=$VIEWPORT \
    --screenshot="screenshot.png" \
    "$URL" 2>/dev/null

if [ -f "screenshot.png" ]; then
    mv screenshot.png "screenshots/$OUTPUT"
    echo "✓ Screenshot saved to screenshots/$OUTPUT"
    ls -lh "screenshots/$OUTPUT"
else
    echo "Method 1 failed. Trying alternative..."

    # Method 2: Use wget to at least get the HTML
    echo "Method 2: Using wget to save HTML..."
    wget -q -O "screenshots/${OUTPUT%.png}.html" "$URL"

    if [ -f "screenshots/${OUTPUT%.png}.html" ]; then
        echo "✓ HTML saved to screenshots/${OUTPUT%.png}.html"
        echo "Note: This is just the HTML, not a visual screenshot."
        echo "The snap version of Chromium has sandbox restrictions."
        echo ""
        echo "To get actual screenshots, you may need to:"
        echo "1. Install chromium-browser from apt (not snap)"
        echo "2. Use a Docker container"
        echo "3. Take screenshots manually and upload them"
    fi
fi