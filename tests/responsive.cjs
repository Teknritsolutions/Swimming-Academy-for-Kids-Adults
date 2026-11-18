require('fs').mkdirSync('tests/artifacts', { recursive: true });
const fs = require('fs');
const { chromium } = require('playwright');
const pages = JSON.parse(fs.readFileSync('documentation/pages.json', 'utf8'));
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const issues = [];
  fs.mkdirSync('tests/artifacts/responsive', { recursive: true });
  for (const { file } of pages) {
    await page.goto('http://127.0.0.1:4173/' + file);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 375, 480, 600, 640, 768, 820, 1024, 1199, 1200]) {
      await page.setViewportSize({ width, height: 900 });
      const problems = await page.evaluate(() => {
        const visible = e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden';
        return [...document.querySelectorAll('main h1, main h2, main h3, main p, main .btn, main .text-link, main .select-trigger, main label, main .schedule-event, main .metric, footer a')]
          .filter(visible).filter(e => e.scrollWidth > e.clientWidth + 3)
          .map(e => ({ element: e.tagName + '.' + e.className, text: e.textContent.trim().slice(0, 70), excess: e.scrollWidth - e.clientWidth }));
      });
      if (problems.length) issues.push({ file, width, problems });
      if ([375, 768].includes(width)) {
        await page.evaluate(async () => {
          document.querySelectorAll('img').forEach(i => i.loading = 'eager');
          await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
        });
        await page.screenshot({ path: `tests/artifacts/responsive/${file.replaceAll('/', '-')}-${width}.png`, fullPage: true });
      }
    }
  }
  fs.writeFileSync('tests/artifacts/responsive-report.json', JSON.stringify(issues, null, 2));
  console.log(JSON.stringify({ pages: pages.length, widths: 10, issues }, null, 2));
  await browser.close();
  if (issues.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
