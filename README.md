# Orynwave Swim Academy

A complete, buildless HTML5 template for an illustrative swimming academy. Open `index.html` through a local HTTP server for the intended experience.

## Start

Run `node scripts/serve.mjs` from this directory, then visit **http://127.0.0.1:4173**. Alternatively, upload the root HTML files and `assets`, `pages`, `dashboard`, and `documentation` folders to any static host. No runtime CDN, API key, installation, database, or build step is needed.

## Included pages

```text
index.html                 Root entry → pages/homepage1.html
pages/                     Both homepages and all public/authentication pages
dashboard/member/          Member screens and batch enrollment
dashboard/admin/           Administration screens
assets/                    Styles, scripts, fonts, images, and bundled libraries
scripts/                   Build, preview, formatting, and packaging tools
tests/                     Reusable checks
  artifacts/               Generated reports and screenshots (ignored)
documentation/             Site guide, page inventory, and image records
third-party/               Dependency licenses
dist/                      Clean generated deployment (ignored)
```

- `index.html`: root entry point that opens Homepage 1.
- `pages/homepage1.html`: classic homepage, exactly 10 major sections.
- `pages/homepage2.html`: editorial homepage, exactly 10 major sections.
- `pages/about.html`, `programs.html`, `program-details.html`, `coaches.html`, `batch-timings.html`, `pricing.html`, `contact.html`: six sections each.
- `pages/blog.html`, `blog-details.html`: five sections each.
- `pages/login.html`, `register.html`, `forgot-password.html`: standalone authentication demonstrations.
- `pages/404.html`, `coming-soon.html`: standalone utility screens.
- `dashboard/member/`: Overview (including Batch Enrollment), My Programs, Attendance, Skill Progress, My Schedule, Fee Payments, Notifications, My Profile, Settings.
- `dashboard/admin/`: Overview, Members, Coaches, Programs, Batches, Enrollments, Attendance, Payments, Messages, Analytics, Notifications, Settings.
- `documentation/index.html`: browser-readable guide.

Total: **38 content pages**, including documentation, plus the root entry point. Logout returns to login and clears the remembered demo role.

## Demo access

On the login page use `member@example.com` or `admin@example.com` with **SwimDemo!2026**. Direct dashboard links also work intentionally: these are interface demonstrations, not protected account areas. Registration validates a sample submission without creating an account. Google/Apple controls describe the required service integration.

## Customize

- Design tokens and fonts: `assets/css/variables.css`.
- Shared styling: `style.css`, `responsive.css`, `dashboard.css`, `dark-mode.css`, `rtl.css`.
- Shared source templates: `scripts/build.mjs`. `node scripts/build.mjs` regenerates the 38 content pages and root entry point, sitemap, page inventory, and image inventory. Direct HTML edits are also supported; do not regenerate over them.
- Browser behaviors: the focused scripts in `assets/js/`.
- Chart fixtures: `assets/js/demo-data.js`.
- Original WebP photographs: `assets/images/`. `-640.webp` files are responsive resolutions of the corresponding photo, not additional placements. All 46 photographic placements use different source images.
- Favicon: original SVG swimmer-and-wave mark, ICO, and Apple touch icon.

Keep the two brand colors `#542447` and `#9565B8`. Accessible text uses the darker violet `#79518F`. Dark surfaces, typography and chart labels use shared variables. RTL uses logical properties and a real document direction. Theme follows the system until manually changed.

## Demo state and integration boundaries

Browser storage contains theme, direction, non-personal preferences, sample record IDs/statuses, notification read states, countdown target, and enrollment selection IDs. Personal names, email addresses, phone numbers, passwords and payment details are **not persisted**. Profile and record-detail edits remain on the current screen; status changes persist locally. Clear keys beginning with `orynwave-` to reset demo state.

All names, portraits, coaching credentials, member stories, schedules, availability, operating hours, addresses, pricing, charts and invoices are illustrative. No actual facility or professional accreditation is represented. Contact, subscription and password-reset forms do not send email. Enrollment does not reserve a place. Payment controls never collect card data or process money. A downloaded sample invoice is plain text and is not a tax document.

Before production use, replace sample content and canonical URLs, connect server-side authentication and authorization, add a secure database and validation, integrate email and payment services, configure real policies and contact details, and review the actual business's accessibility and safety requirements. Static demos must not be mistaken for an operational academy platform.

## Verification

The provided scripts cover local links, duplicate image hashes, section counts, image loading, JavaScript errors, nine viewport widths from 320 to 1920, theme/RTL layouts, and 18 interaction scenarios.

- `node tests/static.cjs`: no dependencies required.
- `node tests/site.cjs`: requires Playwright and Microsoft Edge. Set `NODE_PATH` to an installed Playwright package directory, or install Playwright locally for development.
- `node tests/workflows.cjs`: interaction checks using Playwright and Edge.
- `tests/artifacts/`: generated verification reports and screenshots, excluded from deployment.

The browser tests use Edge/Chromium. No Lighthouse, PageSpeed, full WCAG certification, Safari or Firefox score is claimed. See `documentation/verification.md` for the scope.

## Credits

See `documentation/image-credits.md`, `image-prompts.json`, `reference-study.md` and `third-party/`. Bootstrap 5.3.3, Chart.js 4.4.8, Lucide 0.468.0 and Plus Jakarta Sans are bundled locally. The original visual identity and layouts were created for this project.
