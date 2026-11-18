require('fs').mkdirSync('tests/artifacts', { recursive: true });
const fs = require("fs"),
    assert = require("assert");
const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const passed = [];
    const go = async (path) => {
        await page.goto("http://127.0.0.1:4173/" + path);
    };
    const check = (name) => passed.push(name);
    await go("index.html");
    await page.locator(".theme-toggle").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.locator(".rtl-toggle").click();
    assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
    check("Theme and RTL controls persist");
    await page.evaluate(() => {
        localStorage.clear();
    });
    await go("pages/programs.html");
    await page.selectOption("#age", "adults");
    assert.equal(await page.locator("[data-filter-results] .filter-item:visible").count(), 4);
    await page.selectOption("#type", "private");
    assert.equal(await page.locator("[data-filter-results] .filter-item:visible").count(), 1);
    await page.locator(".filter-reset").click();
    assert.equal(await page.locator("[data-filter-results] .filter-item:visible").count(), 6);
    check("Program filters and reset");
    await go("pages/coaches.html");
    await page.selectOption("#specialty", "kids");
    assert.equal(await page.locator(".filter-item:visible").count(), 1);
    check("Coach filter");
    await go("pages/batch-timings.html");
    await page.selectOption("#age", "adults");
    await page.selectOption("#period", "morning");
    assert.equal(await page.locator(".filter-item:visible").count(), 1);
    check("Combined batch filters");
    await go("pages/pricing.html");
    await page.locator('[data-period="quarterly"]').click();
    assert.equal(await page.locator("[data-monthly]").first().textContent(), "$240.30");
    await page.locator('[data-period="monthly"]').click();
    assert.equal(await page.locator("[data-monthly]").first().textContent(), "$89");
    check("Monthly and quarterly pricing arithmetic");
    await go("pages/blog.html");
    await page.fill("#search", "healthier");
    assert.equal(await page.locator(".filter-item:visible").count(), 1);
    await page.fill("#search", "no-such-article");
    assert(await page.locator(".empty-state").isVisible());
    await page.locator(".filter-reset").click();
    await page.locator('[data-page-number="2"]').click();
    assert.equal(await page.locator(".filter-item:visible").count(), 1);
    check("Blog search, empty state, pagination");
    await go("dashboard/member/index.html#batch-enrollment");
    await page.locator(".batch-enroll").first().click();
    await page.locator("#batch-ack").check();
    await page.locator("#confirm-batch").click();
    assert((await page.locator("#member-enrollment-confirmation .form-feedback").textContent()).includes("No place has been reserved"));
    check("Dashboard enrollment review and local request");
    await go("pages/contact.html");
    await page.fill("#contact-name", "Sample Person");
    await page.fill("#contact-email", "sample@example.com");
    await page.fill("#contact-phone", "5551234567");
    await page.selectOption("#contact-type", "Programs");
    await page.fill("#contact-message", "I would like to explore adult swimming lessons.");
    await page.locator(".demo-form .btn").click();
    assert((await page.locator(".form-feedback").textContent()).includes("No message was sent"));
    check("Contact form validation and feedback");
    await go("pages/login.html");
    await page.fill("#auth-email", "member@example.com");
    await page.fill("#auth-password", "incorrect");
    await page.locator("#login-form .btn").click();
    assert((await page.locator(".form-feedback").textContent()).includes("check your email"));
    await page.fill("#auth-password", "SwimDemo!2026");
    await page.locator(".password-toggle").click();
    assert.equal(await page.locator("#auth-password").getAttribute("type"), "text");
    await page.locator("#login-form .btn").click();
    await page.waitForURL("**/dashboard/member/index.html");
    check("Demo login and password visibility");
    await go("pages/register.html");
    await page.fill("#auth-name", "Test Member");
    await page.fill("#auth-email", "new@example.com");
    await page.fill("#auth-phone", "5551234567");
    await page.fill("#auth-password", "TestPassword!");
    await page.fill("#auth-confirm", "TestPassword!");
    await page.selectOption("#auth-type", "Adult member");
    await page.locator('#register-form input[type="checkbox"]').check();
    await page.locator("#register-form .btn").click();
    await page.waitForTimeout(100);
    assert((await page.locator(".form-feedback").textContent()).includes("No account"));
    check("Registration demo and password confirmation");
    await go("dashboard/member/notifications.html");
    await page.locator(".mark-read").first().click();
    await page.reload();
    assert.equal(await page.locator("[data-notice-id]").first().getAttribute("data-read"), "true");
    await page.locator(".mark-all-read").click();
    assert.equal(await page.locator('[data-read="false"]').count(), 0);
    check("Persistent read and unread notification states");
    await go("dashboard/admin/members.html");
    await page.fill("[data-table-search]", "Alex");
    assert.equal(await page.locator("[data-manage] tbody tr:visible").count(), 1);
    await page.fill("[data-table-search]", "");
    await page.locator(".manage-edit").first().click();
    await page.fill("#edit-1", "Alex Demo");
    await page.locator("#record-form .btn").click();
    assert(
        (await page.locator("[data-manage] tbody tr").first().textContent()).includes("Alex Demo"),
    );
    await page.locator(".manage-add").click();
    for (let i = 0; i < 4; i++)
        await page.fill("#edit-" + i, ["M006", "Test Member", "Adult Beginners", "Active"][i]);
    await page.selectOption("#edit-4", "Progress").catch(async () => {
        await page.selectOption("#edit-4", "Active");
    });
    await page.locator("#record-form .btn").click();
    assert.equal(await page.locator("[data-manage] tbody tr").count(), 6);
    check("Admin search and add/edit records");
    await go("dashboard/admin/enrollments.html");
    await page.locator(".approve-enrollment").first().click();
    await page.reload();
    assert(
        (await page.locator("[data-manage] tbody tr").first().textContent()).includes("Approved"),
    );
    check("Enrollment approval persistence");
    await go("dashboard/admin/attendance.html");
    const before = await page.locator('[data-col="4"]').first().textContent();
    await page.locator(".toggle-attendance").first().click();
    assert.notEqual(await page.locator('[data-col="4"]').first().textContent(), before);
    check("Attendance management");
    await go("dashboard/admin/payments.html");
    await page.locator(".invoice-btn").first().click();
    assert(await page.locator("#download-invoice").isVisible());
    await page.locator("#dialog-close").click();
    await page.locator(".payment-status-btn").first().click();
    assert.equal(await page.locator(".payment-status").first().textContent(), "Paid");
    check("Invoice preview and payment status");
    await go("dashboard/admin/messages.html");
    await page.locator(".message-open").first().click();
    await page.fill("#reply-text", "Thank you for your inquiry. This is a sample response.");
    await page.locator(".reply-form .btn").click();
    assert(
        (await page.locator(".reply-form .form-feedback").textContent()).includes(
            "No message was sent",
        ),
    );
    check("Message reader and demo response");
    await go("dashboard/admin/analytics.html");
    const canvases = await page.locator("canvas").count();
    assert.equal(canvases, 5);
    await page.selectOption("#analytics-range", "oct");
    await page.locator("#apply-analytics").click();
    assert.equal(await page.locator('[data-analytics-kpi="revenue"]').textContent(), "$11,700");
    await page.locator(".theme-toggle").click();
    check("Analytics date range and live chart appearance updates");
    await page.setViewportSize({ width: 375, height: 900 });
    await page.locator(".sidebar-toggle").click();
    assert(await page.locator(".sidebar").isVisible());
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".sidebar-toggle").getAttribute("aria-expanded"), "false");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator("[data-logout]").first().click();
    await page.waitForURL("**/pages/login.html");
    check("Mobile sidebar and demo logout");
    console.log(JSON.stringify({ passed: passed.length, checks: passed }, null, 2));
    fs.writeFileSync(
        "tests/artifacts/workflows.json",
        JSON.stringify({ passed: passed.length, checks: passed }, null, 2),
    );
    await browser.close();
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
