require('fs').mkdirSync('tests/artifacts', { recursive: true });
const fs = require("fs");
const assert = require("assert/strict");
const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const page = await browser.newPage();
    const results = [];
    for (const width of [320, 375, 768, 1024, 1199, 1200, 1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("http://127.0.0.1:4173");
        await page.evaluate(() => document.fonts.ready);
        if (width < 1200) {
            await page.locator(".menu-toggle").click();
            assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
        }
        const geometry = await page.locator(".site-header").evaluate((header) => {
            const items = [
                ...header.querySelectorAll(
                    ".brand, .public-nav > a, .public-nav > details > summary, .header-tools button",
                ),
            ]
                .filter(
                    (el) =>
                        el.getBoundingClientRect().width &&
                        getComputedStyle(el).visibility !== "hidden",
                )
                .map((el) => ({
                    text: el.textContent.trim(),
                    rect: el.getBoundingClientRect().toJSON(),
                }));
            const overlap = items.flatMap((a, i) =>
                items
                    .slice(i + 1)
                    .filter(
                        (b) =>
                            a.rect.left < b.rect.right - 1 &&
                            a.rect.right > b.rect.left + 1 &&
                            a.rect.top < b.rect.bottom - 1 &&
                            a.rect.bottom > b.rect.top + 1,
                    )
                    .map((b) => [a.text, b.text]),
            );
            return { overlap, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
        });
        assert.deepEqual(geometry.overlap, [], `Header overlaps at ${width}`);
        assert.equal(geometry.overflow, false, `Overflow at ${width}`);
        const programs = page
            .locator(".public-nav > details")
            .filter({ has: page.locator("summary", { hasText: "Programs" }) });
        if (width >= 1200) await programs.locator("summary").hover();
        else await programs.locator("summary").click();
        assert(
            await programs.getByRole("link", { name: "Batch Timings", exact: true }).isVisible(),
        );
        await page.keyboard.press("Escape");
        assert.equal(await programs.getAttribute("open"), null);
        if (width < 1200) {
            assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
            assert(
                await page.locator(".menu-toggle").evaluate((el) => el === document.activeElement),
            );
        }
        const uneven = await page.locator("main .grid").evaluateAll((grids) =>
            grids.flatMap((grid) => {
                const cards = [...grid.children].filter((el) => el.classList.contains("card"));
                return cards.flatMap((card, i) =>
                    cards
                        .slice(i + 1)
                        .filter(
                            (other) =>
                                Math.abs(
                                    card.getBoundingClientRect().top -
                                        other.getBoundingClientRect().top,
                                ) < 2 &&
                                Math.abs(
                                    card.getBoundingClientRect().height -
                                        other.getBoundingClientRect().height,
                                ) > 2,
                        )
                        .map(() => "Unequal card heights"),
                );
            }),
        );
        assert.deepEqual(uneven, [], `Card alignment at ${width}`);
        if (width === 1440 || width === 375) {
            await page.evaluate(async () => {
                document.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
                await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
                document.activeElement?.blur();
            });
            await page.screenshot({ path: `tests/artifacts/alignment-${width}.png`, fullPage: true });
            if (width === 375) {
                await page.locator(".menu-toggle").click();
                await page.screenshot({ path: "tests/artifacts/alignment-mobile-menu.png" });
            }
        }
        results.push(width);
    }
    console.log(
        JSON.stringify({ headerAndCardAlignment: results, dropdownsAndKeyboard: "passed" }),
    );
    await browser.close();
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
