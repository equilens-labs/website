#!/bin/bash

# Script to install headless browser on Ubuntu Server
# Run with: sudo bash install_headless_browser.sh

echo "Installing headless browser for website screenshot capability..."

# Update package lists
apt-get update

# Install Chromium browser and dependencies for headless operation
apt-get install -y \
    chromium-browser \
    chromium-chromedriver \
    xvfb \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils

echo "Installation complete!"
echo ""
echo "Test with:"
echo "chromium-browser --headless --disable-gpu --screenshot='test.png' 'http://localhost:8000'"
echo ""
echo "Or use with virtual display:"
echo "xvfb-run -a chromium-browser --no-sandbox --disable-gpu --screenshot='test.png' 'http://localhost:8000'"