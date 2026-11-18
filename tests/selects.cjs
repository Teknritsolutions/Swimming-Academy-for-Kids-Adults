const { chromium } = require("playwright");
const assert = require("assert/strict");

(async () => {
    const browser = await chromium.launch({ channel: "msedge" });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        const errors = [];
        page.on("pageerror", (error) => errors.push(String(error)));
        await page.goto("http://127.0.0.1:4173/pages/programs.html");
        const trigger = page.locator("#level-trigger");
        const menu = page.locator("#level-options");
        await trigger.click();
        assert(await menu.isVisible());
        assert(
            await menu
                .locator(".select-option")
                .evaluateAll((rows) =>
                    rows.every(
                        (row) => getComputedStyle(row).backgroundColor === "rgba(0, 0, 0, 0)",
                    ),
                ),
        );
        const beginner = menu.getByRole("option", { name: "Beginner", exact: true });
        await beginner.hover();
        assert.equal(
            await beginner.evaluate((el) => getComputedStyle(el).backgroundColor),
            "rgb(84, 36, 71)",
        );
        await beginner.click();
        assert.equal(await page.locator("#level").inputValue(), "beginner");
        assert((await trigger.innerText()).includes("Beginner"));
        await page.locator(".filter-reset").click();
        assert((await trigger.innerText()).includes("All levels"));
        await trigger.focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("End");
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("#level").inputValue(), "advanced");
        await page.selectOption("#level", "intermediate");
        assert((await trigger.innerText()).includes("Intermediate"));
        await page.setViewportSize({ width: 375, height: 900 });
        await trigger.scrollIntoViewIfNeeded();
        await trigger.click();
        await menu.waitFor({ state: "visible" });
        const bounds = await menu.boundingBox();
        assert(
            bounds.x >= 0 &&
                bounds.x + bounds.width <= 376 &&
                bounds.y >= 0 &&
                bounds.y + bounds.height <= 901,
        );
        await page.keyboard.press("Escape");
        assert.equal(await trigger.getAttribute("aria-expanded"), "false");
        await page.locator(".theme-toggle").click();
        await page.locator(".rtl-toggle").click();
        await trigger.click();
        assert(await menu.isVisible());
        await menu.getByRole("option", { name: "Beginner", exact: true }).click();
        assert.equal(await page.locator("#level").inputValue(), "beginner");
        await page.goto("http://127.0.0.1:4173/pages/contact.html");
        const required = page.locator("select[required]").first();
        const id = await required.getAttribute("id");
        assert.equal(await required.evaluate((el) => el.reportValidity()), false);
        assert.equal(
            await page.locator("#" + id + "-trigger").getAttribute("aria-invalid"),
            "true",
        );
        await required.selectOption({ index: 1 });
        assert.equal(await page.locator("#" + id + "-trigger").getAttribute("aria-invalid"), null);
        assert.deepEqual(errors, []);
        console.log(
            "Neutral defaults, brand hover, keyboard/touch selection, reset, synchronization, validation, dark mode and RTL passed.",
        );
    } finally {
        await browser.close();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
