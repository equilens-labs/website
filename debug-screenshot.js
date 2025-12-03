const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8082/fl-bsa/');
    // Wait for the timeline
    await page.waitForSelector('.timeline'); 
    // Take a screenshot of the How it Works section
    await page.screenshot({ path: 'debug-flbsa.png', clip: { x: 0, y: 600, width: 1280, height: 800 } });
    console.log('Screenshot captured: debug-flbsa.png');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
})();
