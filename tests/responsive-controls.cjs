const assert = require('assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  for (const width of [320, 375, 640, 768, 820, 1024]) {
    for (const dir of ['ltr', 'rtl']) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:4173/dashboard/member/index.html');
      await page.evaluate(d => document.documentElement.dir = d, dir);
      if (width < 1024) {
        const toggle = page.locator('.sidebar-toggle');
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        await page.locator('.sidebar a[href$="#batch-enrollment"]').click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        await toggle.click();
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      }
      if (width < 640) {
        const table = page.locator('.table-wrap').first();
        assert(await table.evaluate(e => e.scrollWidth <= e.clientWidth + 1));
        assert.equal(await table.locator('td').first().getAttribute('data-label'), 'Session');
      }
      await page.goto('http://127.0.0.1:4173/pages/programs.html');
      await page.evaluate(d => document.documentElement.dir = d, dir);
      await page.locator('#level-trigger').click();
      const menu = page.locator('#level-options');
      const box = await menu.boundingBox();
      assert(box.x >= 0 && box.x + box.width <= width + 1);
      await menu.getByRole('option', { name: 'Beginner', exact: true }).click();
      assert.equal(await page.locator('#level').inputValue(), 'beginner');
    }
  }
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto('http://127.0.0.1:4173/dashboard/member/index.html');
  await page.locator('.sidebar-toggle').click();
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.equal(await page.locator('.sidebar-toggle').getAttribute('aria-expanded'), 'false');
  assert(!(await page.locator('.sidebar').getAttribute('class')).includes('is-open'));
  console.log('Phone/tablet sidebar, enrollment navigation, labeled tables, dropdown placement, RTL and orientation changes passed.');
  await browser.close();
})().catch(e => { console.error(e); process.exitCode = 1; });
