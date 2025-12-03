const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8081/');
    // Wait for the logo to ensure it's loaded
    await page.waitForSelector('.hero-logo'); 
    // Take a screenshot of the top part of the page (Hero)
    await page.screenshot({ path: 'debug-hero.png', clip: { x: 0, y: 0, width: 1280, height: 600 } });
    console.log('Screenshot captured: debug-hero.png');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
})();
