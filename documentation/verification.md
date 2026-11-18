# Verification scope

- 40 HTML pages were served through a local HTTP server and checked in Microsoft Edge via Playwright.
- Both homepages contain exactly 10 major sections; specified content pages contain six sections, except the two blog pages with five.
- All pages were checked at widths 320, 375, 430, 640, 768, 1024, 1280, 1440 and 1920 pixels. No document-level horizontal overflow was found in the final automated audit.
- Every page was checked in light/dark RTL at mobile size. Representative full-page desktop, dark-mode, mobile, login and dashboard screenshots were produced for visual review.
- All local links and assets were resolved. All image placements have alt text. There are 46 unique photographic source hashes and no repeated placement paths.
- Eighteen workflow scenarios cover persistent appearance, filters, search, pagination, pricing arithmetic, enrollment and privacy, contact feedback, demo login, registration, notifications, admin record editing, approval, attendance, invoices, messages, analytics, sidebar and logout.
- Static HTML metadata, one H1 per page, semantic forms, accessible labels, native details accordions, keyboard focus, dialog behavior and reduced-motion styles were implemented. This is not a third-party WCAG audit.
- External identity providers, actual email, payments, multi-user storage, real availability and real account recovery remain backend integration points, explicitly labeled in the UI.
- No PageSpeed, Lighthouse, Core Web Vitals or cross-browser certification score is claimed.

Latest machine-readable results: `tests/audit.json` and `tests/workflows.json`.
