#!/bin/bash

# Install Google Chrome (not Chromium) which doesn't use snap
echo "Installing Google Chrome..."

# Download and add Google's signing key
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -

# Add Chrome repository
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list

# Update and install Chrome
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Test it
google-chrome --version

echo ""
echo "Chrome installed! Now you can take screenshots with:"
echo "google-chrome --headless --disable-gpu --screenshot=homepage.png http://localhost:8000"