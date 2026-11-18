require('fs').mkdirSync('tests/artifacts', { recursive: true });
const fs = require("fs");
const assert = require("assert/strict");
const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    try {
        const page = await browser.newPage();
        const pages = JSON.parse(fs.readFileSync("documentation/pages.json", "utf8")).filter(
            (item) => item.kind === "public" && item.file.startsWith("pages/") && !item.file.includes("homepage"),
        );
        const desktopHeights = [];
        for (const { file } of pages) {
            await page.goto("http://127.0.0.1:4173/" + file);
            await page.evaluate(() => document.fonts.ready);
            assert.equal(await page.locator(".inner-hero").count(), 1, file);
            const image = page.locator(".inner-hero-media img");
            await image.evaluate((el) => el.decode());
            assert(await image.evaluate((el) => el.naturalWidth > 0), file);
            for (const width of [320, 375, 768, 1024, 1440]) {
                await page.setViewportSize({ width, height: 1000 });
                for (const direction of ["ltr", "rtl"]) {
                    await page.locator("html").evaluate((el, dir) => (el.dir = dir), direction);
                    assert(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth <= innerWidth + 1,
                        ),
                        file + " overflow " + width + " " + direction,
                    );
                    const bounds = await page.locator(".inner-hero-layout").evaluate((el) => {
                        const card = el.getBoundingClientRect();
                        const copy = el.querySelector(".inner-hero-copy").getBoundingClientRect();
                        return (
                            copy.left >= card.left &&
                            copy.right <= card.right &&
                            copy.top >= card.top &&
                            copy.bottom <= card.bottom
                        );
                    });
                    assert(bounds, file + " hero copy escapes its card");
                }
            }
            await page.locator("html").evaluate((el) => (el.dir = "ltr"));
            desktopHeights.push({
                file,
                height: await page.locator(".inner-hero-layout").evaluate((el) => el.offsetHeight),
            });
            if (
                ["pages/about.html", "pages/contact.html", "pages/enrollment.html"].includes(file)
            ) {
                await page
                    .locator(".inner-hero")
                    .screenshot({ path: "tests/artifacts/inner-hero-" + file.split("/").pop() + ".png" });
            }
        }
        await page.goto("http://127.0.0.1:4173/pages/about.html");
        await page.evaluate(async () => {
            document.querySelectorAll("img").forEach((el) => (el.loading = "eager"));
            await Promise.all([...document.images].map((el) => el.decode().catch(() => {})));
        });
        assert.equal(await page.locator(".stats--4 > div").count(), 4);
        assert.equal(await page.locator(".about-story").count(), 1);
        assert.equal(await page.locator("main > section").count(), 6);
        await page.screenshot({ path: "tests/artifacts/about-refined-desktop.png", fullPage: true });
        await page.setViewportSize({ width: 375, height: 900 });
        await page.screenshot({ path: "tests/artifacts/about-refined-mobile.png", fullPage: true });
        console.log(
            JSON.stringify({
                innerPages: pages.length,
                widths: 5,
                directions: 2,
                desktopHeights,
                about: "passed",
            }),
        );
    } finally {
        await browser.close();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
