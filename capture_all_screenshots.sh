#!/bin/bash

# Automated screenshot capture for all pages and viewports
# Usage: ./capture_all_screenshots.sh

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create screenshots directory
mkdir -p screenshots

# Define pages to capture
PAGES=(
    "/:homepage"
    "/contact/:contact"
    "/pricing/:pricing"
    "/legal/:legal"
    "/fl-bsa/:product"
    "/trust-center/:trust"
    "/faq/:faq"
    "/press/:press"
)

# Define viewport sizes
VIEWPORTS=(
    "375,812:mobile-iphone"
    "768,1024:tablet-ipad"
    "1440,900:desktop"
    "1920,1080:desktop-fullhd"
)

# Base URL
BASE_URL="http://localhost:8000"

echo -e "${BLUE}Starting screenshot capture...${NC}"
echo ""

# Ensure server is running
if ! curl -s "$BASE_URL" > /dev/null; then
    echo "Starting local server..."
    python3 -m http.server 8000 &
    SERVER_PID=$!
    sleep 2
fi

# Capture screenshots for each page and viewport
for page_info in "${PAGES[@]}"; do
    IFS=':' read -r path name <<< "$page_info"
    echo -e "${BLUE}Capturing $name page...${NC}"

    for viewport_info in "${VIEWPORTS[@]}"; do
        IFS=':' read -r size device <<< "$viewport_info"
        filename="screenshots/${name}-${device}.png"
        url="${BASE_URL}${path}"

        echo -n "  $device ($size): "
        google-chrome --headless --disable-gpu \
            --window-size=$size \
            --screenshot="$filename" \
            "$url" 2>/dev/null

        if [ -f "$filename" ]; then
            size=$(ls -lh "$filename" | awk '{print $5}')
            echo -e "${GREEN}✓${NC} ($size)"
        else
            echo "✗ Failed"
        fi
    done
    echo ""
done

# Generate index HTML to view all screenshots
cat > screenshots/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Screenshot Gallery</title>
    <style>
        body { font-family: system-ui; padding: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        .page-section { margin-bottom: 40px; background: white; padding: 20px; border-radius: 8px; }
        .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .screenshot { text-align: center; }
        .screenshot img { max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }
        .screenshot p { margin: 10px 0 5px; font-weight: bold; }
        .device { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>Equilens Website Screenshots</h1>
EOF

# Add images to the HTML
for page_info in "${PAGES[@]}"; do
    IFS=':' read -r path name <<< "$page_info"
    echo "<div class='page-section'><h2>${name^} Page</h2><div class='screenshots'>" >> screenshots/index.html

    for viewport_info in "${VIEWPORTS[@]}"; do
        IFS=':' read -r size device <<< "$viewport_info"
        filename="${name}-${device}.png"
        if [ -f "screenshots/$filename" ]; then
            echo "<div class='screenshot'><img src='$filename' alt='$name $device'><p>${device^}</p><span class='device'>$size</span></div>" >> screenshots/index.html
        fi
    done
    echo "</div></div>" >> screenshots/index.html
done

echo "</body></html>" >> screenshots/index.html

echo -e "${GREEN}Screenshot capture complete!${NC}"
echo ""
echo "View all screenshots:"
echo "  1. Open screenshots/index.html in a browser"
echo "  2. Or run: python3 -m http.server 8001 --directory screenshots"
echo ""
ls -lh screenshots/*.png | wc -l | xargs echo "Total screenshots captured:"

# Kill server if we started it
if [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID 2>/dev/null
fi