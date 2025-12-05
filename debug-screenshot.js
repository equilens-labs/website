const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8083/');
    // Wait for the hero logo
    await page.waitForSelector('.hero-logo'); 
    // Take a screenshot of the Hero + Grid + Footnote
    await page.screenshot({ path: 'debug-home-check.png', clip: { x: 0, y: 0, width: 1280, height: 2000 } });
    const box = await page.evaluate(() => {
      const el = document.querySelector('.hero .container > div:last-child p'); // Target the note
      if (!el) return 'Not found';
      const rect = el.getBoundingClientRect();
      const parent = el.parentElement.getBoundingClientRect();
      return { 
        text: el.innerText,
        rect: { x: rect.x, y: rect.y, width: rect.width },
        parent: { x: parent.x, y: parent.y, width: parent.width },
        window: window.innerWidth
      };
    });
    console.log('Footnote Debug:', JSON.stringify(box, null, 2));
    console.log('Screenshot captured: debug-home-check.png');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  } finally {
    await browser.close();
  }
})();
