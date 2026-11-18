const assert = require("assert/strict");
const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        const errors = [];
        page.on("pageerror", (error) => errors.push(String(error)));
        const base = "http://127.0.0.1:4173/";
        await page.goto(base + "pages/programs.html");
        await page.evaluate(() => document.fonts.ready);
        const routes = await page
            .locator(".program-link")
            .evaluateAll((links) => links.map((link) => link.href));
        assert.equal(new Set(routes).size, 6);
        assert.equal(await page.locator(".program-meta").count(), 6);
        for (const [age, level, type, expected] of [
            [
                "adults",
                "",
                "",
                [
                    "Adult Swimming",
                    "Intermediate Skills",
                    "Advanced Performance",
                    "Private Coaching",
                ],
            ],
            ["adults", "advanced", "group", ["Advanced Performance"]],
            ["kids", "advanced", "group", []],
            ["teens", "intermediate", "group", ["Teen Swimming", "Intermediate Skills"]],
            ["adults", "", "private", ["Private Coaching"]],
        ]) {
            await page.selectOption("#age", age);
            await page.selectOption("#level", level);
            await page.selectOption("#type", type);
            const actual = await page
                .locator(".program-catalog .filter-item:visible h3")
                .allTextContents();
            assert.deepEqual(actual.sort(), expected.sort());
            if (!expected.length)
                assert(await page.locator(".program-catalog .empty-state").isVisible());
        }
        await page.locator(".filter-reset").click();
        assert.equal(await page.locator(".program-catalog .filter-item:visible").count(), 6);
        assert((await page.locator("#level-trigger").innerText()).includes("All levels"));
        for (const width of [320, 375, 640, 768, 1024, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            assert(
                await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
            );
            const cards = await page.locator(".program-catalog .filter-item").evaluateAll((nodes) =>
                nodes.map((el) => ({
                    rect: el.getBoundingClientRect().toJSON(),
                    title: el.querySelector("h3").getBoundingClientRect().top,
                    button: el.querySelector(".program-link").getBoundingClientRect().top,
                })),
            );
            for (const a of cards)
                for (const b of cards)
                    if (Math.abs(a.rect.top - b.rect.top) < 2) {
                        assert(Math.abs(a.rect.height - b.rect.height) < 2);
                        assert(Math.abs(a.title - b.title) < 2);
                        assert(Math.abs(a.button - b.button) < 2);
                    }
            const columns = width >= 1024 ? 3 : width >= 640 ? 2 : 1;
            const rows = new Map();
            for (const card of cards) {
                const top = Math.round(card.rect.top);
                rows.set(top, (rows.get(top) || 0) + 1);
            }
            assert(
                [...rows.values()].every((count) => count === columns),
                "Incomplete catalog row at " + width,
            );
        }
        for (const [slug, name, fee, skill] of [
            ["kids-swimming", "Kids Swimming", 89, "Feel comfortable"],
            ["teen-swimming", "Teen Swimming", 99, "Refine your strokes"],
            ["adult-swimming", "Adult Swimming", 89, "Feel comfortable"],
            ["beginner-foundations", "Beginner Foundations", 89, "Feel comfortable"],
            ["intermediate-skills", "Intermediate Skills", 119, "Refine your strokes"],
            ["advanced-performance", "Advanced Performance", 159, "Improve efficiency"],
            ["private-coaching", "Private Coaching", 199, "Start where you are"],
        ]) {
            await page.goto(base + "pages/program-details.html?program=" + slug);
            await page.waitForFunction((slug) => document.body.dataset.program === slug, slug);
            assert((await page.title()).includes(name));
            assert.equal(await page.locator(".price-card h3").innerText(), name);
            assert((await page.locator(".price").innerText()).startsWith("$" + fee));
            assert(await page.getByRole("heading", { name: skill, exact: true }).isVisible());
            await page.locator(".inner-hero img").evaluate((img) => img.decode());
            for (const width of [375, 768, 1440]) {
                await page.setViewportSize({ width, height: 1000 });
                for (const direction of ["ltr", "rtl"]) {
                    await page.locator("html").evaluate((el, dir) => (el.dir = dir), direction);
                    assert(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth <= innerWidth + 1,
                        ),
                        slug + " overflow at " + width + " " + direction,
                    );
                }
            }
            await page.locator("html").evaluate((el) => (el.dir = "ltr"));
            const curriculum = page.locator("main > section").nth(2).locator(".faq").first();
            await curriculum.locator("summary").click();
            assert(await curriculum.locator("p").isVisible());
            const next = page.locator('.price-card a[href*="dashboard/member/index.html"]');
            await next.click();
            await page.waitForURL('**/dashboard/member/index.html?program=' + slug + '#batch-enrollment');
            assert(await page.locator('#batch-enrollment').isVisible());
        }
        for (const invalid of ["unknown", "constructor", "__proto__"]) {
            await page.goto(base + "pages/program-details.html?program=" + invalid);
            await page.waitForFunction(() => document.body.dataset.program === "kids-swimming");
            assert((await page.title()).includes("Kids Swimming"));
        }
        assert.deepEqual(errors, []);
        console.log(
            "Program filter combinations, empty/reset states, centered rows, aligned cards, seven detail variants and enrollment preselection passed.",
        );
    } finally {
        await browser.close();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
