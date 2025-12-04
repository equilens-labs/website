const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8082/debug-symbol.html');
    // SVG rendered directly in browser usually scales to viewport or fits
    await page.screenshot({ path: 'debug-symbol.png', clip: { x: 0, y: 0, width: 200, height: 200 } });
    console.log('Screenshot captured: debug-symbol.png');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
})();
