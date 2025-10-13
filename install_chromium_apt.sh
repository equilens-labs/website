#!/bin/bash

# Remove snap chromium and install from apt
echo "Removing snap chromium and installing proper version..."

# Add repository for non-snap chromium
sudo add-apt-repository -y ppa:saiarcot895/chromium-beta
sudo apt-get update

# Install chromium-browser from apt (not snap)
sudo apt-get install -y chromium-browser

# Test it
chromium-browser --version

echo "Now test with:"
echo "chromium-browser --headless --disable-gpu --screenshot=test.png http://localhost:8000"