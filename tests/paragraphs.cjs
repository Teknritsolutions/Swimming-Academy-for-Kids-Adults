const fs = require("fs");
const assert = require("assert/strict");
const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    try {
        const page = await browser.newPage();
        const pages = JSON.parse(fs.readFileSync("documentation/pages.json", "utf8"));
        for (const { file } of pages) {
            await page.goto("http://127.0.0.1:4173/" + file);
            await page.evaluate(() => document.fonts.ready);
            for (const width of [375, 768, 1440]) {
                await page.setViewportSize({ width, height: 900 });
                const sizes = await page.locator("p, .check-list li, .article li, blockquote").evaluateAll(elements =>
                    [...new Set(elements.map(el => getComputedStyle(el).fontSize))]
                );
                assert(sizes.every(size => size === "17px"), `${file} at ${width}: ${sizes}`);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
                    `${file} overflows at ${width}`);
            }
        }
        console.log(JSON.stringify({ pages: pages.length, widths: [375, 768, 1440], paragraphSize: "17px", errors: [] }));
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
