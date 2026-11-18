require('fs').mkdirSync('tests/artifacts', { recursive: true });
const fs = require("fs");
const assert = require("assert");
const { chromium } = require("playwright");
const pages = JSON.parse(fs.readFileSync("documentation/pages.json", "utf8"));
(async () => {
    const browser = await chromium.launch({ headless: true, channel: "msedge" });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    fs.mkdirSync("tests/artifacts/visual", { recursive: true });
    page.on("pageerror", (e) => errors.push(String(e)));
    const broken = [];
    page.on("response", (r) => {
        if (r.status() >= 400) broken.push([r.status(), r.url()]);
    });
    await page.goto("http://127.0.0.1:4173");
    await page.evaluate(async () => {
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    });
    await page.screenshot({ path: "tests/artifacts/home-desktop.png", fullPage: true });
    for (const p of pages) {
        await page.goto("http://127.0.0.1:4173/" + p.file);
        await page.evaluate(async () => {
            document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
            await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
        });
        assert.equal(await page.locator("h1").count(), 1, p.file + " H1 count");
        const imageErrors = await page
            .locator("img")
            .evaluateAll((imgs) =>
                imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
            );
        if (imageErrors.length) broken.push([p.file, imageErrors]);
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.evaluate(() => {
            document.documentElement.dataset.theme = "light";
            document.documentElement.dir = "ltr";
            document.dispatchEvent(new Event("appearancechange"));
        });
        await page.screenshot({ path: "tests/artifacts/visual/" + p.file.replaceAll("/", "-") + ".png" });
        const expected =
            p.file === "pages/homepage1.html" || p.file === "pages/homepage2.html"
                ? 10
                : p.kind === "public" && !p.file.includes("documentation")
                  ? p.file.includes("blog")
                      ? 5
                      : 6
                  : null;
        if (expected)
            assert.equal(
                await page.locator("main > section,main > form > section").count(),
                expected,
                p.file + " section count",
            );
        for (const width of [320, 375, 430, 640, 768, 1024, 1280, 1440, 1920]) {
            await page.setViewportSize({ width, height: 900 });
            const over = await page.evaluate(
                () => document.documentElement.scrollWidth > innerWidth + 1,
            );
            if (over) errors.push(`${p.file}: overflow at ${width}`);
        }
        for (const mode of ["light", "dark"]) {
            await page.evaluate((m) => {
                document.documentElement.dataset.theme = m;
                document.documentElement.dir = "rtl";
                document.dispatchEvent(new Event("appearancechange"));
            }, mode);
            await page.setViewportSize({ width: 375, height: 900 });
            if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
                errors.push(`${p.file}: ${mode} RTL overflow`);
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const [file, name, theme, dir] of [
        ["pages/homepage1.html", "home-dark", "dark", "ltr"],
        ["pages/homepage2.html", "home2", "light", "ltr"],
        ["dashboard/admin/index.html", "admin", "light", "ltr"],
        ["dashboard/member/index.html", "member-dark", "dark", "ltr"],
        ["pages/login.html", "login", "light", "ltr"],
        ["pages/programs.html", "programs", "light", "ltr"],
    ]) {
        await page.goto("http://127.0.0.1:4173/" + file);
        await page.evaluate(
            ([theme, dir]) => {
                document.documentElement.dataset.theme = theme;
                document.documentElement.dir = dir;
                document.dispatchEvent(new Event("appearancechange"));
            },
            [theme, dir],
        );
        await page.evaluate(async () => {
            document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
            await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
        });
        await page.waitForTimeout(450);
        await page.screenshot({ path: `tests/artifacts/${name}.png`, fullPage: true });
    }
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("http://127.0.0.1:4173");
    await page.evaluate(async () => {
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    });
    await page.screenshot({ path: "tests/artifacts/home-mobile.png", fullPage: true });
    const report = { pages: pages.length, viewports: 9, errors, broken };
    fs.writeFileSync("tests/artifacts/audit.json", JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    await browser.close();
    if (errors.length || broken.length) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
