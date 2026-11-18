import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
let page = "",
    base = "";
const allPages = [];
const photos = [];
const I = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const A = (url, text, cls = "") => `<a class="${cls}" href="${base}${url}">${text}</a>`;
const btn = (url, text, secondary = false) =>
    A(
        url,
        text + I("arrow-right"),
        "btn" +
            (secondary ? " btn-secondary" : "") +
            (text === "Explore Programs" ? " btn-featured" : ""),
    );
const logo = () =>
    A(
        "pages/homepage1.html",
        `<img src="${base}assets/favicon.svg" alt=""><div><strong>orynwave<span>Swimming academy</span></strong></div>`,
        "brand",
    );
const img = (name, alt, cls = "", eager = false) => {
    photos.push({ page, name, alt });
    return `<img src="${base}assets/images/${name}.webp" alt="${alt}" class="${cls}" width="1200" height="800" srcset="${base}assets/images/${name}-640.webp 640w, ${base}assets/images/${name}.webp 1200w" sizes="(max-width:767px) calc(100vw - 32px), (max-width:1023px) 48vw, 560px" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
};
const providerIcon = (name) =>
    name === "google"
        ? '<svg class="provider-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.93a6 6 0 0 1 0-3.86V7.48H3.06a10 10 0 0 0 0 9.04l3.34-2.59Z"/><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.48l3.34 2.59C7.19 7.71 9.4 5.95 12 5.95Z"/></svg>'
        : '<svg class="provider-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.54c.02 3.01 2.64 4.01 2.67 4.02-.02.07-.42 1.43-1.38 2.84-.83 1.22-1.69 2.43-3.05 2.45-1.33.03-1.76-.79-3.28-.79-1.52 0-2 .77-3.26.82-1.31.05-2.3-1.32-3.14-2.53-1.71-2.47-3.02-6.98-1.26-10.03a4.86 4.86 0 0 1 4.12-2.5c1.29-.03 2.5.87 3.28.87.79 0 2.26-1.08 3.8-.92.64.03 2.46.26 3.63 1.97-.1.06-2.17 1.26-2.13 3.8ZM14.53 5.13c.69-.84 1.16-2.01 1.03-3.18-.99.04-2.19.66-2.9 1.49-.63.73-1.18 1.9-1.03 3.02 1.11.08 2.21-.57 2.9-1.33Z"/></svg>';
const tools = () =>
    `<button class="icon-btn theme-toggle" aria-label="Switch color theme" title="Switch theme">${I("moon")}</button><button class="icon-btn rtl-toggle" aria-label="Switch text direction" title="Switch text direction"><span dir="ltr">RTL</span></button>`;
const testimonialPortrait = (initials, name) => {
    const asset = {
        AR: "portrait-amelia",
        DK: "portrait-daniel",
        ML: "portrait-maya",
        HM: "portrait-helen",
    }[initials];
    photos.push({ page, name: asset, alt: `Illustrative portrait of ${name}` });
    return `<img class="avatar avatar-photo" src="${base}assets/images/${asset}.webp" alt="Illustrative portrait of ${name}" width="52" height="52" loading="lazy" decoding="async">`;
};
function header() {
    const drop = (title, items) =>
        '<details class="nav-drop"><summary>' +
        title +
        I("chevron-down") +
        '</summary><div class="dropdown">' +
        items.map(([url, label]) => A(url, label)).join("") +
        "</div></details>";
    const links =
        drop("Home", [
            ["pages/homepage1.html", "Home Page 1"],
            ["pages/homepage2.html", "Home Page 2"],
        ]) +
        A("pages/about.html", "About") +
        drop("Programs", [
            ["pages/programs.html", "All Programs"],
            ["pages/program-details.html", "Program Details"],
            ["pages/batch-timings.html", "Batch Timings"],
        ]) +
        A("pages/coaches.html", "Coaches") +
        A("pages/pricing.html", "Pricing") +
        drop("Blog", [
            ["pages/blog.html", "Blog"],
            ["pages/blog-details.html", "Blog Details"],
        ]) +
        A("pages/contact.html", "Contact") +
        drop("Dashboard", [
            ["dashboard/member/index.html", "Member Dashboard"],
            ["dashboard/admin/index.html", "Admin Dashboard"],
        ]) +
        A("pages/login.html", "Login", "btn mobile-login");
    return (
        '<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="site-container header-inner">' +
        logo() +
        '<nav class="public-nav" id="public-nav" aria-label="Main navigation">' +
        links +
        '</nav><div class="header-tools">' +
        tools() +
        A("pages/login.html", "Login", "btn btn-sm login-button") +
        '<button class="icon-btn menu-toggle" aria-label="Open navigation" aria-controls="public-nav" aria-expanded="false">' +
        I("menu") +
        "</button></div></div></header>"
    );
}
function footer() {
    return `<footer class="site-footer"><div class="site-container"><div class="footer-grid"><div class="footer-brand">${logo()}<p>Small steps. Stronger strokes. A lifelong love of the water.</p><nav class="footer-social" aria-label="Social media"><a class="social-link" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)" title="Instagram"><i data-lucide="instagram" aria-hidden="true"></i></a><a class="social-link" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in a new tab)" title="Facebook"><i data-lucide="facebook" aria-hidden="true"></i></a><a class="social-link" href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube (opens in a new tab)" title="YouTube"><i data-lucide="youtube" aria-hidden="true"></i></a><a class="social-link" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn"><i data-lucide="linkedin" aria-hidden="true"></i></a></nav></div><div class="footer-links"><h3>Find your lane</h3>${A("pages/programs.html", "Our programs")}${A("pages/coaches.html", "Meet the coaches")}${A("pages/batch-timings.html", "Batch timings")}${A("pages/pricing.html", "Membership plans")}</div><div class="footer-links"><h3>The academy</h3>${A("pages/about.html", "Our story")}${A("pages/blog.html", "The swim journal")}${A("pages/contact.html", "Visit & contact")}${A("pages/coming-soon.html", "Coming soon")}</div><div class="footer-invitation"><h3>Your next chapter</h3><p>Find a comfortable starting point. We’ll help with the rest.</p>${A("dashboard/member/index.html#batch-enrollment", "Explore enrollment " + I("arrow-right"), "text-link")}</div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Orynwave. All rights reserved.</span><span>Designed for every age. Built around you.</span></div></div></footer>`;
}
const check = (items) =>
    `<ul class="check-list">${items.map((t) => `<li>${I("check")}${t}</li>`).join("")}</ul>`;
const head = (eyebrow, title, desc = "", link = "") =>
    `<div class="section-head"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${desc ? `<p>${desc}</p>` : ""}</div>${link}</div>`;
const section = (title, content, eyebrow = "", desc = "", extra = "") =>
    `<section class="section ${extra}"><div class="site-container">${title ? head(eyebrow, title, desc) : ""}${content}</div></section>`;
const valueImages = {
    "Care before competition": "care",
    "Safety without shortcuts": "safety",
    "Progress with purpose": "progress",
    "Belonging for everyone": "belonging",
};
const feature = (icon, title, text) => {
    const asset = page === "pages/about.html" ? valueImages[title] : null;
    const skill =
        page === "pages/program-details.html"
            ? {
                  "Feel comfortable": "comfort",
                  "Learn to breathe": "breathing",
                  "Float & move": "floating",
              }[title]
            : null;
    const availability =
        page === "pages/batch-timings.html"
            ? {
                  "Early start": "morning",
                  "After-school rhythm": "afterschool",
                  "Weekend moments": "weekend",
              }[title]
            : null;
    const coaching =
        page === "pages/coaches.html"
            ? {
                  "Teaching foundations": "foundations",
                  "Safety awareness": "awareness",
                  "Technical focus": "technique",
              }[title]
            : null;
    if (coaching) photos.push({ page, name: `coach-${coaching}`, alt: title });
    const pricingPhoto =
        page === "pages/pricing.html"
            ? {
                  "Payment information": "payment",
                  "Membership periods": "period",
                  "Need a little guidance?": "guidance",
              }[title]
            : null;
    if (pricingPhoto) photos.push({ page, name: `pricing-${pricingPhoto}`, alt: title });
    if (asset) photos.push({ page, name: `value-${asset}`, alt: title });
    if (skill) photos.push({ page, name: `skill-${skill}`, alt: title });
    if (availability) photos.push({ page, name: `batch-${availability}`, alt: title });
    return `<article class="card feature${asset ? ` value-photo value--${asset}` : ""}${skill ? ` skill-photo skill--${skill}` : ""}${availability ? ` batch-availability-photo availability--${availability}` : ""}${coaching ? ` coach-photo coach--${coaching}` : ""}${pricingPhoto ? ` pricing-photo pricing--${pricingPhoto}` : ""}"><span class="icon-box">${I(icon)}</span><h3>${title}</h3><p>${text}</p></article>`;
};
const features = (items, cols = 4) =>
    `<div class="grid grid-${cols}">${items.map((x) => feature(...x)).join("")}</div>`;
const journeyImages = {
    "Find your program": ["program", "An advisor helping a learner choose swimming lessons"],
    "Choose your time": ["timing", "A swimmer planning a weekly lesson schedule"],
    "Meet your coach": ["coach", "A swimming coach welcoming a new learner"],
    "See yourself grow": ["progress", "A swimmer celebrating progress with a coach"],
};
const steps = (items) =>
    `<div class="grid grid-${items.length} steps">${items
        .map(([t, d]) => {
            const asset = journeyImages[t];
            const batchAsset =
                page === "pages/batch-timings.html"
                    ? {
                          "Start with your level": "level",
                          "Think about consistency": "routine",
                          "Allow time to settle": "arrival",
                      }[t]
                    : null;
            if (asset && !photos.some((photo) => photo.name === `journey-${asset[0]}`))
                photos.push({ page, name: `journey-${asset[0]}`, alt: asset[1] });
            if (batchAsset) photos.push({ page, name: `batch-${batchAsset}`, alt: t });
            return `<article class="step${asset ? ` step-photo step--${asset[0]}` : ""}${batchAsset ? ` step-photo step--batch-${batchAsset}` : ""}"><h3>${t}</h3><p>${d}</p></article>`;
        })
        .join("")}</div>`;
const stats = (items) =>
    `<div class="stats${items.length === 4 ? " stats--4 milestone-stats" : ""}">${items.map(([v, l], index) => `<div>${items.length === 4 ? `<span class="icon-box" aria-hidden="true">${I(["calendar-days", "layers", "users", "sparkles"][index])}</span>` : ""}<strong>${v}</strong><small>${l}</small></div>`).join("")}</div>`;
const table = (headers, rows) =>
    `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const faqs = (items) =>
    items
        .map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`)
        .join("");
const defaultFAQs = [
    [
        "Do I need previous swimming experience?",
        "No. Our beginner pathways start with water comfort, safe entry and breathing. A coach-led assessment helps you choose a suitable starting group.",
    ],
    [
        "What should I bring to my first lesson?",
        "Bring a swimsuit, swimming cap, properly fitted goggles, a towel and water. Arrive 15 minutes early for your orientation.",
    ],
    [
        "Can I change my batch?",
        "Explore available batches. Any change depends on coach availability and class capacity.",
    ],
];
const field = (label, name, placeholder, type = "text", required = true) =>
    `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" placeholder="${placeholder}" ${required ? "required" : ""} ${type === "tel" ? 'pattern="[+0-9 ()-]{7,20}"' : ""} ${type === "password" ? 'minlength="8" autocomplete="new-password"' : ""}></div>`;
const select = (label, name, options, placeholder = "Select an option", attrs = "") =>
    `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}" ${attrs}><option value="">${placeholder}</option>${options.map((o) => (Array.isArray(o) ? `<option value="${o[0]}">${o[1]}</option>` : `<option>${o}</option>`)).join("")}</select></div>`;
const formFeedback = `<p class="form-feedback" role="status" aria-live="polite"></p>`;
const innerHeroPhotos = {
    "pages/batch-timings.html": "timings-hero",
    "pages/pricing.html": "pricing-hero",
    "pages/contact.html": "contact-hero",
};
const intro = (eyebrow, title, desc, photo = "") => {
    photo ||= innerHeroPhotos[page] || "";
    const copy = `<div class="stack${photo ? " inner-hero-copy" : ""}"><div class="breadcrumb">${A("pages/homepage1.html", "Home")} / ${eyebrow}</div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p class="lead">${desc}</p></div>`;
    return `<section class="page-intro${photo ? " inner-hero" : ""}"><div class="site-container">${photo ? `<div class="split inner-hero-layout">${copy}<div class="inner-hero-media">${img(photo, title, "inner-hero-image", true)}</div></div>` : copy}</div></section>`;
};
const cta = (title = "Your next chapter starts in the water.", photo = "", alt = false) =>
    section(
        "",
        `<div class="cta-panel ${alt ? "invitation" : ""}"><div class="stack"><span class="eyebrow">Make your first move</span><h2>${title}</h2><p>Every confident swimmer started somewhere. Find your program and take that first step with us.</p>${btn("dashboard/member/index.html#batch-enrollment", "Find your place")}</div>${photo ? img(photo, "Swimmers enjoying a supportive pool environment") : `<div class="stack"><h3>Let’s find your lane.</h3><p>Explore our sample programs and preferred batch options.</p>${btn("pages/contact.html", "Talk to the academy", true)}</div>`}</div>`,
    );
const programData = [
    [
        "Kids Swimming",
        "kids",
        "beginner",
        "group",
        "Ages 4–10",
        "Playful beginnings. Lifelong confidence.",
        "program-kids",
    ],
    [
        "Teen Swimming",
        "teens",
        "intermediate",
        "group",
        "Ages 11–17",
        "Build technique, stamina and independence.",
        "program-teens",
    ],
    [
        "Adult Swimming",
        "adults",
        "beginner",
        "group",
        "Ages 18+",
        "A calm, encouraging place to start.",
        "program-adults",
    ],
    [
        "Beginner Foundations",
        "all",
        "beginner",
        "group",
        "All ages",
        "Feel comfortable, breathe and float.",
        "program-beginner",
    ],
    [
        "Intermediate Skills",
        "all",
        "intermediate",
        "group",
        "Assessment required",
        "Refine your strokes and find your rhythm.",
        "program-intermediate",
    ],
    [
        "Advanced Performance",
        "teens adults",
        "advanced",
        "group",
        "Ages 13+",
        "Purposeful drills for stronger swimming.",
        "program-advanced",
    ],
    [
        "Private Coaching",
        "all",
        "all",
        "private",
        "All ages",
        "Your goals. Your pace. Your own coach.",
        "program-private",
    ],
];
const programCard = (p, photo = p[6]) =>
    `<article class="card filter-item" data-age="${p[1]}" data-level="${p[2]}" data-type="${p[3]}" data-search="${p[0].toLowerCase()}">${img(photo, `${p[0]} swimming lesson`)}<div class="card-body"><span class="eyebrow">${p[4]}</span><h3>${p[0]}</h3><div class="program-meta"><span class="pill">${{ beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", all: "All levels" }[p[2]]}</span><span class="pill">${p[3] === "private" ? "Private coaching" : "Group lessons"}</span></div><p>${p[5]}</p>${A("pages/program-details.html?program=" + p[0].toLowerCase().replace(/[^a-z0-9]+/g, "-"), `Explore program ${I("arrow-right")}`, "text-link program-link").replace("<a ", `<a aria-label="Explore ${p[0]}" `)}</div></article>`;
const timetable = (action = false) =>
    table(
        ["Program / batch", "Days", "Time", "Coach", "Availability", ...(action ? [""] : [])],
        [
            [
                "Kids Foundations · K01",
                "Mon / Wed / Fri",
                "4:00–4:45 PM",
                "Emma Wilson",
                "4 of 8 seats",
            ],
            ["Adult Beginners · A01", "Tue / Thu", "6:30–7:15 AM", "James Carter", "3 of 8 seats"],
            ["Junior Progress · J02", "Mon / Wed", "5:00–6:00 PM", "Sofia Reed", "2 of 10 seats"],
            [
                "Weekend Fundamentals · W01",
                "Sat / Sun",
                "9:00–9:45 AM",
                "Emma Wilson",
                "5 of 8 seats",
            ],
        ].map((r) => [
            ...r,
            ...(action
                ? [
                      A(
                          "dashboard/member/index.html#batch-enrollment",
                          "Select " + I("arrow-right"),
                          "text-link",
                      ),
                  ]
                : []),
        ]),
    );
function home1() {
    return (
        `<section class="hero"><div class="site-container"><div class="hero-grid"><div><span class="eyebrow">A little courage. A whole new world.</span><h1>Find your confidence.<br><em>Make your waves.</em></h1><p class="lead">From first splashes to stronger strokes, discover swimming lessons that meet you where you are. For little learners. For grown-up goals. For you.</p><div class="actions">${btn("pages/programs.html", "Explore Programs")}${btn("pages/batch-timings.html", "View Batch Timings", true)}</div><div class="trust-row"><span>${I("badge-check")}Certified coaching</span><span>${I("shield-check")}Safety comes first</span><span>${I("users")}Small group learning</span></div></div><div class="hero-visual">${img("home1-hero", "An instructor helping a child build swimming confidence", "", true)}<div class="image-note"><span class="icon-box">${I("waves")}</span><div><strong>Every stroke is a start.</strong><small>Your own pace. Your own progress.</small></div></div></div></div></div></section>` +
        section(
            "",
            features([
                [
                    "badge-check",
                    "Certified coaches",
                    "Thoughtful instruction from experienced swim educators.",
                ],
                [
                    "shield-check",
                    "A safer place to learn",
                    "Supervised sessions and clear poolside practices.",
                ],
                [
                    "clock-3",
                    "Time that works for you",
                    "Morning, evening and weekend sample batches.",
                ],
                [
                    "chart-no-axes-combined",
                    "Progress with purpose",
                    "Clear milestones. Encouragement at every step.",
                ],
            ]),
            "",
            "",
            "highlights",
        ) +
        section(
            "",
            head(
                "Find your lane",
                "Different goals. The same great start.",
                "Thoughtfully designed programs for every age, ability and ambition.",
                A("pages/programs.html", "All programs " + I("arrow-right"), "text-link"),
            ) +
                `<div class="grid grid-3">${[programCard(programData[0], "home1-kids"), programCard(programData[2], "home1-adults"), programCard(programData[5], "home1-advanced")].join("")}</div>`,
        ) +
        section(
            "",
            `<div class="split">${img("home1-about", "Students and an instructor talking beside an indoor pool")}<div class="stack"><span class="eyebrow">More than a swimming lesson</span><h2>Confidence in the water.<br>Confidence beyond it.</h2><p>We believe learning to swim should feel reassuring, rewarding and a little bit joyful. Our approach puts the person before the stopwatch.</p><p>With small groups, clear goals and a coach who knows your name, every lesson builds on the last.</p>${check(["Patient, age-appropriate teaching", "A structured pathway from first float to full stroke", "Personal attention in every session"])}${stats(
                [
                    ["1:8", "Sample beginner ratio"],
                    ["4", "Learning pathways"],
                    ["100%", "Committed to progress"],
                ],
            )}${A("pages/about.html", "Discover our approach " + I("arrow-right"), "text-link")}</div></div>`,
        ) +
        section(
            "Small steps. Remarkable progress.",
            steps([
                ["Find your program", "Choose a pathway that fits your age, comfort and goals."],
                ["Choose your time", "Explore batches that work around your everyday life."],
                ["Meet your coach", "Learn with a patient expert, one achievable step at a time."],
                ["See yourself grow", "Celebrate new skills and meaningful milestones."],
            ]),
            "Your learning journey",
        ) +
        section(
            "A space that helps you feel at ease.",
            `<div class="mosaic"><figure>${img("home1-pool", "Bright indoor swimming pool with dedicated lap lanes")}<figcaption>Purpose-built indoor training pool</figcaption></figure><figure>${img("home1-changing", "Clean modern swimming pool changing rooms")}<figcaption>Comfortable changing facilities</figcaption></figure><figure>${img("home1-equipment", "Swimming training equipment arranged by the pool")}<figcaption>The right tools for every lesson</figcaption></figure></div>`,
            "Designed around your comfort",
            "Supervised water, practical facilities and thoughtfully chosen training equipment.",
        ) +
        section(
            "",
            head(
                "Good people. Great guidance.",
                "The faces behind your firsts.",
                "Meet the sample coaching team. Credentials and people are illustrative.",
                A("pages/coaches.html", "Meet all coaches " + I("arrow-right"), "text-link"),
            ) +
                `<div class="grid grid-3">${[
                    ["Emma Wilson", "Kids & water confidence", "home1-coach-1"],
                    ["James Carter", "Adult foundations & technique", "home1-coach-2"],
                    ["Sofia Reed", "Stroke development & performance", "home1-coach-3"],
                ]
                    .map(
                        ([n, s, p]) =>
                            `<article class="card">${img(p, `Illustrative swimming coach ${n}`)}<div class="card-body"><span class="eyebrow">Swim educator · sample profile</span><h3>${n}</h3><p>${s}</p><p>Swim education & water confidence</p>${A("pages/coaches.html", "Meet your coach " + I("arrow-right"), "text-link")}</div></article>`,
                    )
                    .join("")}</div>`,
        ) +
        section(
            "",
            head(
                "Make room for the water",
                "A rhythm that fits your routine.",
                "A preview of our sample timetable. Availability is illustrative.",
                A("pages/batch-timings.html", "Full timetable " + I("arrow-right"), "text-link"),
            ) + timetable(),
        ) +
        section(
            "Little moments. Lasting confidence.",
            `<div class="grid grid-3">${[
                [
                    "“The first lesson felt like a big step. By week four, she was asking when we could go back.”",
                    "AR",
                    "Amelia R.",
                    "Parent of a little swimmer",
                ],
                [
                    "“I thought I’d left it too late. The calm pace and encouragement changed everything.”",
                    "DK",
                    "Daniel K.",
                    "Adult beginner",
                ],
                [
                    "“I finally understand what to work on. Every lesson has a purpose, and I can feel the difference.”",
                    "ML",
                    "Maya L.",
                    "Intermediate swimmer",
                ],
            ]
                .map(
                    ([q, i, n, t]) =>
                        `<article class="card quote"><span class="quote-mark">“</span><blockquote>${q.replace(/[“”]/g, "")}</blockquote><div class="person">${testimonialPortrait(i, n)}<div><strong>${n}</strong><small>${t} · sample story</small></div></div></article>`,
                )
                .join("")}</div>`,
            "Stories from the water",
            "Different starting points. Shared moments of confidence.",
        ) +
        cta("Your first splash is only the beginning.", "home1-cta")
    );
}
function home2() {
    return (
        `<section class="editorial-hero">${img("home2-hero", "A tranquil premium indoor pool with a swimmer in a lap lane", "", true)}<div class="site-container"><span class="eyebrow">The water is waiting</span><h1>A new perspective.<br>One stroke at a time.</h1><p>Step out of the everyday. Discover thoughtful swimming experiences for every stage of life.</p><div class="actions">${btn("pages/programs.html", "Discover your pathway")}${btn("pages/about.html", "Our philosophy", true)}</div></div></section>` +
        section(
            "",
            features(
                [
                    ["heart-handshake", "A personal welcome", "Your comfort shapes how we begin."],
                    ["waves", "A purposeful experience", "Every session brings a new possibility."],
                    ["sparkles", "Progress you can feel", "Small milestones, celebrated together."],
                ],
                3,
            ),
            "",
            "",
            "highlights",
        ) +
        section(
            "Every age has its own adventure.",
            `<div class="grid grid-4">${[
                ["01", "Little Swimmers", "Ages 4–7 · joyful water confidence"],
                ["02", "Junior Swimmers", "Ages 8–12 · foundations that last"],
                ["03", "Teen Swimmers", "Ages 13–17 · skills and independence"],
                ["04", "Adult Swimmers", "Ages 18+ · a fresh start at any age"],
            ]
                .map(
                    ([i, t, d]) =>
                        `<article class="card path-card">${img("pathway-" + ["little", "junior", "teen", "adult"][Number(i) - 1], `${t} swimming lesson`, "path-card-photo")}<span class="number">${i}</span><div class="path-card-content"><h3>${t}</h3><p>${d}</p>${A("pages/programs.html", "Find your pathway " + I("arrow-right"), "text-link")}</div></article>`,
                )
                .join("")}</div>`,
            "Growing with you",
        ) +
        section(
            "",
            `<div class="split"><div class="stack"><span class="eyebrow">The Orynwave method</span><h2>First comfort.<br>Then confidence.<br>Then possibility.</h2>${steps(
                [
                    ["Understand", "We start with how you feel and what you hope to achieve."],
                    ["Connect", "Your coach makes each new movement clear and achievable."],
                ],
            )}${check(["Repeat with purpose, never pressure", "Turn practice into positive habits", "Reflect on what you have accomplished"])}</div>${img("home2-method", "Coach explaining a swimming stroke to a teenager")}</div>`,
        ) +
        section(
            "Room to breathe. Space to grow.",
            img("home2-pool", "Indoor teaching pool with safe entry steps", "wide-photo") +
                `<div class="grid grid-3 pool-features"><div><span class="icon-box">${I("sparkles")}</span><h3>Thoughtfully maintained</h3><p>A comfortable indoor learning environment.</p></div><div><span class="icon-box">${I("layout-grid")}</span><h3>Clearly zoned</h3><p>Training areas designed around different skills.</p></div><div><span class="icon-box">${I("shield-check")}</span><h3>Always supervised</h3><p>Clear rules and attentive lesson supervision.</p></div></div>`,
            "The pool experience",
        ) +
        section(
            "A clear path. Your own pace.",
            steps([
                ["Beginner", "Feel at home with safe entry, breathing and floating."],
                ["Foundation", "Connect movement with balance and control."],
                ["Intermediate", "Bring rhythm and technique to your strokes."],
                ["Advanced", "Refine efficiency, distance and performance."],
            ]),
            "Skills for a lifetime",
        ) +
        section(
            "",
            `<div class="split">${img("home2-coach", "Illustrative head coach at the poolside")}<div class="stack"><span class="eyebrow">A coach in your corner</span><h2>Seen as a person.<br>Supported as a swimmer.</h2><p>Individual goals deserve individual attention. Our sample private coaching pathway adapts the lesson to you, with feedback that makes your next step clear.</p>${check(["One-to-one goal setting", "Practical feedback after each session", "A pace that respects your confidence"])}${btn("pages/coaches.html", "Discover personal coaching")}</div></div>`,
        ) +
        section(
            "Your membership, thoughtfully considered.",
            table(
                ["The experience", "Starter", "Progress", "Elite"],
                [
                    ["Coach-led lessons", "8 / month", "12 / month", "16 / month"],
                    ["Skill review", "Monthly", "Twice monthly", "Each week"],
                    ["Progress notes", "Included", "Included", "Included"],
                    ["Personal consultation", "—", "Quarterly", "Monthly"],
                ],
            ) +
                `<div class="actions dashboard-row">${btn("pages/pricing.html", "Compare memberships")}</div>`,
            "Belong to something good",
            "All plans and inclusions are illustrative content.",
        ) +
        section(
            "",
            `<div class="split"><div class="stack"><span class="eyebrow">Beyond the first length</span><h2>“I stopped wondering if I could. I started seeing that I can.”</h2><p>At 58, our illustrative member Helen took her first beginner lesson. The goal wasn’t speed. It was the freedom to feel comfortable in the water.</p><div class="person">${testimonialPortrait("HM", "Helen M.")}<div><strong>Helen M.</strong><small>Adult pathway · illustrative member story</small></div></div><div class="card feature"><p>“A patient coach makes all the difference. There is always a next small step.”</p><small>Robert P. · sample member reflection</small></div></div>${img("home2-story", "Older adult swimmer celebrating a completed lesson")}</div>`,
        ) +
        section(
            "",
            `<div class="split">${img("home2-cta", "Swimmer gliding through a pool lane")}<div class="stack"><span class="eyebrow">An invitation to begin</span><h2>Make a little room<br>for something<br>extraordinary.</h2><p>Explore a program, find a comfortable time, and take your first step toward the water.</p>${btn("dashboard/member/index.html#batch-enrollment", "Begin your journey")}</div></div>`,
        )
    );
}
function about() {
    return (
        intro(
            "Our story",
            "Good teaching changes everything.",
            "A thoughtful approach to swimming, built around a simple idea: people learn best when they feel supported.",
            "about-hero",
        ) +
        section(
            "A place for every starting point.",
            `<div class="grid grid-2 about-story"><div class="stack story-copy"><h3>Built around the learner</h3><p>The Orynwave story begins with a belief that confidence is a skill. It grows through patient instruction, understandable feedback and regular practice.</p><p>Our illustrative academy brings children, teenagers and adults into a shared culture of curiosity, care and steady progress.</p></div>${steps(
                [
                    ["The beginning", "A small teaching pool and a learner-first philosophy."],
                    ["The next chapter", "Age-specific pathways and personal progress reviews."],
                ],
            )}</div>`,
            "Our story",
        ) +
        section(
            "What we bring to every lesson.",
            features([
                [
                    "heart",
                    "Care before competition",
                    "Listen first. Make every learner feel welcome.",
                ],
                [
                    "shield-check",
                    "Safety without shortcuts",
                    "Clear procedures and attentive supervision.",
                ],
                [
                    "target",
                    "Progress with purpose",
                    "Teach achievable skills in a sensible sequence.",
                ],
                [
                    "users",
                    "Belonging for everyone",
                    "Respect every age, identity and starting point.",
                ],
            ]),
            "Mission & values",
        ) +
        section(
            "Our story, in meaningful milestones.",
            stats([
                ["2016", "Illustrative founding year"],
                ["4", "Learning stages"],
                ["8", "Sample group capacity"],
                ["2026", "A new chapter"],
            ]) +
                `<div class="dashboard-row">${steps([
                    ["First lessons", "Foundation classes for new swimmers."],
                    ["Broader pathways", "Programs across age groups and abilities."],
                    ["Shared progress", "Clearer goals and regular coach reviews."],
                ]).replace(
                    'class="grid grid-3 steps"',
                    'class="grid grid-3 steps milestone-timeline"',
                )}</div>`,
            "Academy milestones",
            "",
            "milestone-section",
        ) +
        section(
            "",
            `<div class="split">${img("about-safety", "Attentive lifeguard supervising swimming instruction")}<div class="stack"><span class="eyebrow">Care in every detail</span><h2>A thoughtful standard of teaching.</h2><p>These sample operating commitments show how an academy can communicate its safety practices. Confirm actual policies with your chosen operator.</p>${check(["Supervised lessons with clear coach-to-learner ratios", "Pre-lesson readiness checks and orientation", "Age-appropriate drills and progressive instruction", "Accessible communication with parents and members"])}</div></div>`,
        ) +
        section(
            "",
            `<div class="split"><div class="stack"><span class="eyebrow">Our people & culture</span><h2>A team that celebrates your firsts.</h2><p>Good coaching is more than technique. It is patience when something feels difficult, encouragement when you try again, and pride in every milestone.</p>${btn("pages/coaches.html", "Meet our coaches")}</div>${img("about-culture", "Illustrative swimming academy teaching team together")}</div>`,
        )
    );
}
const filters = (type, items, search = false) =>
    `<div class="filter-bar" data-filter-controls="${type}">${search ? field("Search", "search", `Search ${type}`, "search", false) : ""}${items.map(([label, key, opts]) => select(label, key, opts, ["programs", "member-batches"].includes(type) ? { Age: "All ages", Level: "All levels", "Skill level": "All levels", "Program type": "All program types" }[label] || "All " + label.toLowerCase() : "All " + label.toLowerCase(), `data-filter-key="${key}"`)).join("")}<button class="btn btn-secondary filter-reset" type="button">Reset filters</button></div>${type === "programs" ? "" : `<p class="result-count" data-result-count="${type}" role="status"></p>`}`;
function programs() {
    return (
        intro(
            "Our programs",
            "Find the lane that feels like you.",
            "Purposeful pathways for first splashes, fresh starts and your next personal best.",
            "programs-hero",
        ) +
        section(
            "Let’s find your starting point.",
            filters("programs", [
                [
                    "Age",
                    "age",
                    [
                        ["kids", "Kids"],
                        ["teens", "Teens"],
                        ["adults", "Adults"],
                    ],
                ],
                [
                    "Skill level",
                    "level",
                    [
                        ["beginner", "Beginner"],
                        ["intermediate", "Intermediate"],
                        ["advanced", "Advanced"],
                    ],
                ],
                [
                    "Program type",
                    "type",
                    [
                        ["group", "Group lessons"],
                        ["private", "Private coaching"],
                    ],
                ],
            ]),
            "Your program finder",
            "",
            "program-finder-section",
        ) +
        section(
            "One academy. Many ways to grow.",
            `<div class="grid grid-3 program-catalog" data-filter-results="programs" aria-label="Available swimming programs">${programData
                .filter((p) => p[0] !== "Beginner Foundations")
                .map((p) => programCard(p))
                .join(
                    "",
                )}<p class="empty-state" hidden>No programs match. Try another combination.</p></div>`,
            "Explore the collection",
            "",
            "program-collection-section",
        ) +
        section(
            "Choose a comfortable challenge.",
            table(
                ["Level", "Your starting point", "What comes next"],
                [
                    [
                        "Beginner",
                        "New to lessons or not comfortable floating",
                        "Water comfort, breathing and supported movement",
                    ],
                    [
                        "Intermediate",
                        "Comfortable floating and swimming short distances",
                        "Stroke coordination, rhythm and stamina",
                    ],
                    [
                        "Advanced",
                        "Consistent strokes over multiple lengths",
                        "Efficiency, technique and structured performance",
                    ],
                ],
            ),
            "Know your level",
        ) +
        section(
            "",
            `<div class="split">${img("program-benefits", "Swimming equipment carefully prepared for a lesson")}<div class="stack"><span class="eyebrow">The difference is in the details</span><h2>Everything you need to keep moving forward.</h2>${check(["Structured lesson objectives", "Equipment appropriate to each exercise", "Clear feedback from your coach", "Regular skill reviews and progress notes"])}${btn("pages/program-details.html", "Explore program details")}</div></div>`,
        ) +
        section(
            "Not sure where to begin?",
            features(
                [
                    [
                        "message-circle",
                        "Tell us your goals",
                        "Start with what you want to feel confident doing.",
                    ],
                    [
                        "clipboard-check",
                        "Find your level",
                        "A short assessment helps identify a comfortable starting point.",
                    ],
                    [
                        "calendar-check",
                        "Choose a routine",
                        "A manageable schedule makes consistent progress easier.",
                    ],
                ],
                3,
            ) +
                `<div class="actions dashboard-row">${btn("pages/contact.html", "Ask for guidance")}${btn("dashboard/member/index.html#batch-enrollment", "Explore enrollment", true)}</div>`,
            "We’ll help you choose",
        )
    );
}
function details() {
    return (
        intro(
            "Kids beginner swimming",
            "Small splashes. Big possibilities.",
            "Ages 4–10 · Beginner · 8-week sample pathway · 45-minute sessions. Build a happy, confident relationship with the water.",
            "details-hero",
        ) +
        section(
            "Confidence, one new skill at a time.",
            features(
                [
                    [
                        "waves",
                        "Feel comfortable",
                        "Safe entry, pool awareness and simple water exploration.",
                    ],
                    [
                        "wind",
                        "Learn to breathe",
                        "Exhale in the water and coordinate a relaxed breath.",
                    ],
                    ["move", "Float & move", "Build balance, kicking and supported movement."],
                ],
                3,
            ),
            "What they will learn",
        ) +
        section(
            "A clear, encouraging curriculum.",
            faqs([
                [
                    "Weeks 1–2 · Welcome to the water",
                    "Meet your coach, explore safe entry, practice bubbles and build confidence with supported play.",
                ],
                [
                    "Weeks 3–4 · Find your balance",
                    "Practice front and back floating, recovery to standing and controlled kicking with support.",
                ],
                [
                    "Weeks 5–6 · Put movement together",
                    "Connect kicking with simple arm movements and gentle breathing drills.",
                ],
                [
                    "Weeks 7–8 · Celebrate your progress",
                    "Review each skill, practice short independent movements and discuss the next appropriate pathway.",
                ],
            ]),
            "The eight-week journey",
        ) +
        section(
            "A little consistency goes a long way.",
            table(
                ["Session", "Focus", "Time"],
                [
                    ["Warm-up", "Welcome, readiness and gentle movement", "5 minutes"],
                    ["Skill practice", "Coach-led breathing, floating and kicking", "25 minutes"],
                    ["Apply & play", "Purposeful games that reinforce the lesson", "10 minutes"],
                    ["Wrap-up", "Celebrate progress and share feedback", "5 minutes"],
                ],
            ),
            "Weekly training structure",
        ) +
        section(
            "An encouraging start, clearly priced.",
            `<div class="grid grid-2"><div class="card price-card"><span class="eyebrow">Sample beginner pathway</span><h3>Kids Foundations</h3><div class="price">$89<small> / month · sample price</small></div>${check(["8 group sessions per month", "Sample ratio of one coach to eight learners", "Monthly progress notes", "Training equipment during lessons"])}${btn("dashboard/member/index.html#batch-enrollment", "Explore enrollment")}</div><div class="stack form-panel"><h3>Before the first splash</h3><p>Choose a beginner batch and tell us about your child’s experience. A parent or guardian should review the academy’s actual policies before enrollment.</p>${check(["Swim cap, goggles and swimsuit required", "Arrive 15 minutes before your first session", "Tell your actual instructor about individual support needs"])}${A("pages/contact.html", "Talk through your questions " + I("arrow-right"), "text-link")}</div></div>`,
            "Fees & enrollment",
        ) +
        section(
            "A few things you might be wondering.",
            faqs(defaultFAQs) +
                `<div class="actions dashboard-row">${btn("dashboard/member/index.html#batch-enrollment", "Take the next step")}</div>`,
            "Program questions",
        )
    );
}
function coaches() {
    const people = [
        ["Alex Morgan", "Adults", "adults", "coach-directory-1"],
        ["Nina Brooks", "Kids", "kids", "coach-directory-2"],
        ["Leo Hayes", "Performance", "advanced", "coach-directory-3"],
    ];
    return (
        intro(
            "Our coaches",
            "The right guidance makes the difference.",
            "Meet the fictional educators behind our sample programs. All names, portraits and qualifications are illustrative.",
            "coaches-hero",
        ) +
        section(
            "",
            `<div class="split">${img("coach-head", "Illustrative head coach Claire Bennett")}<div class="stack"><span class="eyebrow">Featured head coach · sample profile</span><h2>Claire Bennett</h2><h3>Patient teaching. Purposeful progress.</h3><p>Claire’s sample profile represents an experienced educator who makes difficult skills feel approachable, with a focus on confidence and clear instruction.</p>${check(["Head of curriculum · illustrative role", "Swim education & water confidence", "Specialism: beginner confidence and coach development"])}${btn("pages/contact.html", "Ask about a consultation")}</div></div>`,
        ) +
        section(
            "A team with a lane for everyone.",
            filters("coaches", [
                [
                    "Specialty",
                    "specialty",
                    [
                        ["kids", "Kids"],
                        ["adults", "Adults"],
                        ["advanced", "Performance"],
                    ],
                ],
            ]) +
                `<div class="grid grid-3 dashboard-row" data-filter-results="coaches">${people.map(([n, s, v, p]) => `<article class="card filter-item" data-specialty="${v}">${img(p, `Illustrative swim educator ${n}`)}<div class="card-body"><h3>${n}</h3><p>${s} instruction · sample profile</p><p>Swimming instruction and first-aid training · illustrative credential</p>${A("pages/contact.html", "Arrange an introduction " + I("arrow-right"), "text-link")}</div></article>`).join("")}<p class="empty-state" hidden>No coaches match this specialty.</p></div>`,
            "Find your coach",
        ) +
        section(
            "Professional knowledge. Human connection.",
            features(
                [
                    [
                        "badge-check",
                        "Teaching foundations",
                        "Age-aware communication and progressive skill instruction.",
                    ],
                    [
                        "shield-check",
                        "Safety awareness",
                        "Supervision, readiness and clear poolside procedures.",
                    ],
                    [
                        "target",
                        "Technical focus",
                        "Purposeful drills for movement, breathing and efficiency.",
                    ],
                ],
                3,
            ),
            "Specialties & standards",
        ) +
        section(
            "Good coaching starts with listening.",
            steps([
                ["Understand you", "Learn what feels easy, challenging and important."],
                ["Make it clear", "Explain the movement and demonstrate the next step."],
                ["Build together", "Practice, reflect and recognize progress."],
            ]),
            "Our teaching philosophy",
        ) +
        section(
            "Meet the person behind your progress.",
            `<div class="coach-consultation">${img("coach-consultation", "A swim coach discussing goals with an adult learner")}<div class="coach-consultation-copy"><h3>A conversation before a commitment.</h3><p>Explore your goals, discuss lesson styles and ask about a suitable coach. Share your questions using the inquiry form.</p>${check(["15-minute sample consultation", "Discuss confidence, goals and availability", "Get guidance on a suitable program"])}${btn("pages/contact.html", "Request a conversation")}</div></div>`,
            "Your next step",
        )
    );
}
const batches = [
    [
        "Kids Foundations",
        "kids",
        "beginner",
        "Kids Swimming",
        "Monday",
        "evening",
        "4:00 PM",
        "Emma Wilson",
        4,
    ],
    [
        "Adult Beginners",
        "adults",
        "beginner",
        "Adult Swimming",
        "Tuesday",
        "morning",
        "6:30 AM",
        "James Carter",
        3,
    ],
    [
        "Junior Progress",
        "teens",
        "intermediate",
        "Teen Swimming",
        "Wednesday",
        "evening",
        "5:00 PM",
        "Sofia Reed",
        2,
    ],
    [
        "Weekend Fundamentals",
        "kids",
        "beginner",
        "Kids Swimming",
        "Saturday",
        "morning",
        "9:00 AM",
        "Emma Wilson",
        5,
    ],
    [
        "Adult Technique",
        "adults",
        "intermediate",
        "Adult Swimming",
        "Thursday",
        "evening",
        "6:00 PM",
        "James Carter",
        4,
    ],
    [
        "Performance Lane",
        "teens",
        "advanced",
        "Advanced Performance",
        "Friday",
        "morning",
        "7:00 AM",
        "Sofia Reed",
        2,
    ],
];
function timings() {
    return (
        intro(
            "Batch timings",
            "Make the water part of your week.",
            "Explore class times across age groups, skill levels and routines. Availability shown is illustrative.",
        ) +
        section(
            "A time that works for you.",
            filters("batches", [
                [
                    "Age",
                    "age",
                    [
                        ["kids", "Kids"],
                        ["teens", "Teens"],
                        ["adults", "Adults"],
                    ],
                ],
                [
                    "Program",
                    "program",
                    ["Kids Swimming", "Teen Swimming", "Adult Swimming", "Advanced Performance"],
                ],
                [
                    "Skill level",
                    "level",
                    [
                        ["beginner", "Beginner"],
                        ["intermediate", "Intermediate"],
                        ["advanced", "Advanced"],
                    ],
                ],
                [
                    "Day",
                    "day",
                    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                ],
                [
                    "Session",
                    "period",
                    [
                        ["morning", "Morning"],
                        ["evening", "Evening"],
                    ],
                ],
            ]),
            "Schedule finder",
        ) +
        section(
            "Your week, with a little more water.",
            `<div class="table-wrap" data-filter-results="batches"><table><thead><tr>${["Batch", "Day", "Time", "Coach", "Seats", ""].map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${batches.map(([n, a, l, p, d, s, t, c, seats]) => `<tr class="filter-item" data-age="${a}" data-level="${l}" data-program="${p}" data-day="${d}" data-period="${s}"><td><strong>${n}</strong>${l}</td><td>${d}</td><td>${t}</td><td>${c}</td><td><span class="badge">${seats} sample seats</span></td><td>${A("dashboard/member/index.html#batch-enrollment", "Select " + I("arrow-right"), "text-link")}</td></tr>`).join("")}</tbody></table><p class="empty-state" hidden>No batches match these choices.</p></div>`,
            "Weekly timetable",
        ) +
        section(
            "A closer look at your options.",
            features(
                [
                    [
                        "sun",
                        "Early start",
                        "Adult Beginners · Tue / Thu · 6:30 AM. Three sample seats.",
                    ],
                    [
                        "sunset",
                        "After-school rhythm",
                        "Kids Foundations · Mon / Wed / Fri · 4:00 PM. Four sample seats.",
                    ],
                    [
                        "calendar-days",
                        "Weekend moments",
                        "Weekend Fundamentals · Sat / Sun · 9:00 AM. Five sample seats.",
                    ],
                ],
                3,
            ),
            "Sample availability",
        ) +
        section(
            "Choose a routine you can enjoy.",
            steps([
                [
                    "Start with your level",
                    "Find a class that suits your present comfort in the water.",
                ],
                [
                    "Think about consistency",
                    "Choose days you can attend regularly without rushing.",
                ],
                ["Allow time to settle", "Plan to arrive early, change and ease into the session."],
            ]),
            "Batch selection guide",
        ) +
        section(
            "Ready to find your place?",
            faqs([
                [
                    "Are the seat counts live?",
                    "No. All availability, coaches and times shown here are illustrative sample data.",
                ],
                [
                    "Can siblings choose different batches?",
                    "Yes, this example schedule includes different age pathways. Your actual academy would help coordinate suitable times.",
                ],
                [
                    "What if I miss a lesson?",
                    "Make-up lessons depend on the operator’s policy and availability. Contact your actual academy before booking.",
                ],
            ]) +
                `<div class="actions dashboard-row">${btn("dashboard/member/index.html#batch-enrollment", "Explore batch enrollment")}</div>`,
            "Schedule questions",
        )
    );
}
function pricing() {
    return (
        intro(
            "Membership",
            "A good investment in yourself.",
            "Choose a sample plan that fits your goals and routine. All prices and plan inclusions are illustrative.",
        ) +
        section(
            "Find your rhythm.",
            `<div class="segmented" role="group" aria-label="Billing period"><button type="button" class="active" data-period="monthly" aria-pressed="true">Monthly</button><button type="button" data-period="quarterly" aria-pressed="false">Quarterly · save 10%</button></div><p class="result-count">Quarterly prices show the total for three months with a 10% sample discount.</p>`,
            "Simple sample pricing",
            "",
            "pricing-controls-section",
        ) +
        section("Three ways to move forward.", pricingCards(), "Choose your membership") +
        section(
            "The details that matter.",
            table(
                ["Included in your plan", "Starter", "Progress", "Elite"],
                [
                    ["Group sessions / month", "8", "12", "16"],
                    ["Coach feedback", "Included", "Included", "Included"],
                    ["Progress review", "Monthly", "Twice monthly", "Weekly"],
                    ["Personal consultation", "—", "Quarterly", "Monthly"],
                    ["Training equipment", "Included", "Included", "Included"],
                ],
            ),
            "Compare the experience",
        ) +
        section(
            "No surprises. Just the next step.",
            features(
                [
                    [
                        "credit-card",
                        "Payment information",
                        "Payments are not collected through this interface.",
                    ],
                    [
                        "calendar-check",
                        "Membership periods",
                        "Explore monthly and quarterly sample plans. Real terms require operator configuration.",
                    ],
                    [
                        "message-circle",
                        "Need a little guidance?",
                        "Share your questions before choosing your membership.",
                    ],
                ],
                3,
            ),
            "Membership information",
        ) +
        section(
            "A clearer picture, before you begin.",
            faqs([
                [
                    "How should I confirm membership details?",
                    "Prices and inclusions are illustrative. Confirm membership details with the academy before making a commitment.",
                ],
                [
                    "What does quarterly billing mean?",
                    "The displayed quarterly price covers three months and includes a 10% sample discount compared with three monthly payments.",
                ],
                [
                    "Can I upgrade my membership?",
                    "This example is designed for flexible membership workflows. A real operator must confirm upgrade rules, dates and fees.",
                ],
            ]) +
                `<div class="actions dashboard-row">${btn("dashboard/member/index.html#batch-enrollment", "Explore your next step")}</div>`,
            "Membership questions",
        )
    );
}
const articles = [
    [
        "Finding your breathing rhythm",
        "swimming tips",
        "blog-breathing",
        "A calmer breath makes everything feel a little easier.",
    ],
    [
        "A confident start to water safety",
        "water safety",
        "blog-safety",
        "Simple habits to discuss with your child and instructor.",
    ],
    [
        "Swimming into a healthier routine",
        "adult fitness",
        "blog-fitness",
        "Build a sustainable practice, one comfortable session at a time.",
    ],
];
const articleCard = ([title, cat, photo, desc]) =>
    `<article class="card filter-item" data-category="${cat}" data-search="${(title + " " + desc).toLowerCase()}">${img(photo, title)}<div class="card-body"><span class="eyebrow">${cat} · 5 min read</span><h3>${title}</h3><p>${desc}</p>${A("pages/blog-details.html?article=" + ({ "Finding your breathing rhythm": "breathing-rhythm", "A confident start to water safety": "water-safety", "Swimming into a healthier routine": "healthy-routine", "What progress can feel like": "recognizing-progress" }[title] || "first-lesson"), "Read the journal " + I("arrow-right"), "text-link")}</div></article>`;
const newsletter = () =>
    `<div class="newsletter"><div><span class="eyebrow">A little inspiration</span><h2>A good read between swims.</h2><p>Tips, perspectives and new beginnings, in your inbox.</p></div><form class="demo-form" data-message="Subscription request validated. No email was sent or stored."><label for="newsletter-email">Your email address</label><div class="inline-form"> <input id="newsletter-email" type="email" placeholder="Enter your email address" required><button class="btn">Subscribe ${I("arrow-right")}</button></div>${formFeedback}<small>Email service is not connected.</small></form></div>`;
function blog() {
    return (
        intro(
            "The swim journal",
            "A fresh perspective on the water.",
            "Stories, practical tips and little discoveries for every part of your swimming journey.",
            "blog-hero",
        ) +
        section(
            "",
            `<div class="split">${img("blog-feature", "Parent helping a child prepare swimming goggles")}<div class="stack"><span class="eyebrow">Featured · Kids training · 6 min read</span><h2>Making the first lesson feel like a good beginning.</h2><p>From packing a familiar towel to meeting the coach, a few small preparations can help a new experience feel more approachable.</p>${A("pages/blog-details.html", "Read the story " + I("arrow-right"), "text-link")}</div></div>`,
        ) +
        section(
            "Find something for your next chapter.",
            filters(
                "articles",
                [["Category", "category", ["swimming tips", "water safety", "adult fitness"]]],
                true,
            ),
            "Explore the journal",
        ) +
        section(
            "Notes from the poolside.",
            `<div class="grid grid-3" data-filter-results="articles">${articles.map(articleCard).join("")}<p class="empty-state" hidden>No articles match. Try another search or category.</p></div><nav class="actions dashboard-row" aria-label="Article pagination"><button class="btn btn-secondary" data-page-number="1" aria-current="page">1</button><button class="btn btn-secondary" data-page-number="2">2</button></nav><p class="result-count" id="article-page-status" role="status">Page 1 of 2</p>`,
            "Latest reading",
        ) +
        section("", newsletter())
    );
}
function blogDetails() {
    return (
        intro(
            "Swim journal · Beginner confidence",
            "Your first swimming lesson, without the guesswork.",
            "By Claire Bennett · Sample editorial · November 10, 2026 · 6 minute read",
            "article-hero",
        ) +
        section(
            "",
            `<article class="article"><span class="eyebrow">A calmer beginning</span><h2 id="prepare">Give yourself room to be new.</h2><p>Starting something unfamiliar can feel bigger than the activity itself. A first swimming lesson brings a new space, new equipment and new movements. You do not need to arrive already knowing what to do. That is what the lesson is for.</p><p>Choose a beginner group that matches your current experience. If you feel unsure about water depth or putting your face in the water, tell your instructor before entering. A good learning conversation starts with an honest description of what feels comfortable.</p><h2 id="pack">Keep your preparation simple.</h2><p>Pack a well-fitting swimsuit, cap, goggles and towel. Check the facility’s own requirements ahead of time. Goggles should sit comfortably without needing to be painfully tight. Try them at home so the first adjustment does not have to happen in a busy changing room.</p>${img("article-body", "Adult swimmer wearing well-fitted goggles and a swimming cap")}<h2 id="pace">Focus on the next small step.</h2><p>Your first session may involve safe entry, supported floating and a few gentle breathing exercises. These are foundations, not hurdles to rush past. Ask your coach to explain or demonstrate again when you need it.</p><p>Compare your progress with your own starting point. Feeling more relaxed at the pool edge is progress. Understanding how to exhale is progress. Returning for your next lesson is progress too.</p><p>General learning information only. Follow the guidance of your qualified instructor and facility. Never practice in the water without appropriate supervision.</p></article>`,
        ) +
        section(
            "A quick guide to the story.",
            `<aside class="form-panel"><div class="grid grid-3"><a href="#prepare" class="text-link">01 · A calmer beginning ${I("arrow-right")}</a><a href="#pack" class="text-link">02 · What to bring ${I("arrow-right")}</a><a href="#pace" class="text-link">03 · Finding your pace ${I("arrow-right")}</a></div><p class="dashboard-row">Related topics: beginner confidence · lesson preparation · adult swimming.</p></aside>`,
            "On this page",
        ) +
        section(
            "A note from the author.",
            `<div class="form-panel"><div class="person"><span class="avatar">CB</span><div><h3>Claire Bennett</h3><p>Illustrative swim educator & editorial contributor</p></div></div><p class="dashboard-row">Clear guidance, patient teaching and a belief that it’s never too late to begin.</p><div class="actions dashboard-row"><button class="btn btn-secondary" data-share>Share this article ${I("share-2")}</button><button class="btn btn-secondary" data-copy>Copy article link ${I("copy")}</button></div></div>`,
            "The person behind the words",
        ) +
        section(
            "Keep your curiosity moving.",
            `<div class="grid grid-2">${articleCard(["What progress can feel like", "swimming tips", "article-related", "Look for small improvements you can recognize and repeat."])}<div class="card feature"><span class="eyebrow">Your next read</span><h3>Find a program for your starting point.</h3><p>From first floats to improving your technique, explore the skills each pathway helps you develop.</p><div class="actions dashboard-row">${btn("pages/programs.html", "Explore the programs")}</div></div></div>`,
            "Next on your reading list",
        )
    );
}
function contact() {
    return (
        intro(
            "Visit & contact",
            "Every good beginning starts with a conversation.",
            "Have a question about your next step? Explore the sample contact experience below.",
        ) +
        section(
            "Let’s get you to the right place.",
            features(
                [
                    ["mail", "General inquiries", "hello@example.com · sample contact only"],
                    ["phone", "A quick conversation", "+1 (555) 010-2040 · illustrative number"],
                    ["map-pin", "Example map location", "Indianapolis, Indiana ? example location"],
                ],
                3,
            ),
            "Say hello",
        ) +
        section(
            "What would you like to know?",
            `<div class="split contact-inquiry-layout"><div class="contact-inquiry-aside"><div class="stack contact-inquiry-copy"><h3>Tell us a little about your plans.</h3><p>Share your goals, preferred schedule or program questions. This form validates your message locally and does not send it.</p>${check(["Program & level guidance", "Sample batch and membership information", "General academy inquiries"])}</div>${img("contact-inquiry", "A swimming advisor helping a learner plan their lessons", "contact-inquiry-photo")}</div><form class="form-panel demo-form" data-message="Your inquiry has been validated. No message was sent.">${field("Full name", "contact-name", "Enter your full name")}${field("Email address", "contact-email", "Enter your email address", "email")}${field("Phone number", "contact-phone", "Enter your phone number", "tel")}${select("Inquiry type", "contact-type", ["Programs", "Batch timings", "Membership", "General question"], "Select an inquiry type", "required")}<div class="field"><label for="contact-message">Your message</label><textarea id="contact-message" placeholder="Write your message" rows="4" minlength="10" required></textarea></div><button class="btn">Send inquiry ${I("arrow-right")}</button>${formFeedback}</form></div>`,
            "Your questions matter",
        ) +
        section(
            "Picture your next visit.",
            `<div class="contact-location"><div class="contact-map"><iframe title="Google Map showing IU Natatorium, Indianapolis ? example location" src="https://www.google.com/maps?q=IU%20Natatorium%2C%20901%20West%20New%20York%20Street%2C%20Indianapolis%2C%20IN%2046202&amp;output=embed" width="800" height="460" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><div class="contact-address"><span class="icon-box"><i data-lucide="map-pin" aria-hidden="true"></i></span><span class="eyebrow">Example location</span><h3>IU Natatorium</h3><address>901 West New York Street<br>Indianapolis, IN 46202</address><p>A real Indianapolis swimming facility shown as an example location for this website. Orynwave is not affiliated with this venue.</p><a class="btn" href="https://www.google.com/maps/dir/?api=1&amp;destination=IU+Natatorium+901+West+New+York+Street+Indianapolis+IN+46202" target="_blank" rel="noopener noreferrer">Get directions<i data-lucide="arrow-right" aria-hidden="true"></i></a><a class="text-link" href="https://natatorium.indianapolis.iu.edu/contact-us.html" target="_blank" rel="noopener noreferrer">Venue information<i data-lucide="arrow-right" aria-hidden="true"></i></a></div></div>`,
            "Find the academy",
        ) +
        section(
            "A little planning goes a long way.",
            table(
                ["Day", "Sample operating hours", "Member support"],
                [
                    ["Monday–Friday", "6:00 AM–9:00 PM", "9:00 AM–6:00 PM"],
                    ["Saturday", "7:00 AM–6:00 PM", "9:00 AM–4:00 PM"],
                    ["Sunday", "8:00 AM–2:00 PM", "10:00 AM–1:00 PM"],
                ],
            ),
            "Visiting & support",
        ) +
        section(
            "Before you get in touch.",
            faqs([
                [
                    "Can I visit before choosing a program?",
                    "Ask about an orientation, your goals, and a suitable program using the inquiry form.",
                ],
                [
                    "Will this form send a message?",
                    "No. It validates the fields and displays local feedback. Connect your own backend before using it to receive inquiries.",
                ],
                [
                    "Where is the actual academy?",
                    "The map shows IU Natatorium in Indianapolis as an example location. Orynwave is not affiliated with this venue. Confirm your actual academy address before planning a visit.",
                ],
            ]),
            "A little more guidance",
        )
    );
}
function password(label, name, placeholder) {
    return `<div class="field"><label for="${name}">${label}</label><div class="password-wrap"><input id="${name}" name="${name}" type="password" placeholder="${placeholder}" required minlength="8" autocomplete="new-password"><button class="icon-btn password-toggle" type="button" aria-label="Show ${label.toLowerCase()}" data-target="${name}">${I("eye")}</button></div></div>`;
}
function auth(type) {
    const register = type === "register",
        forgot = type === "forgot-password";
    const controls = `<div class="auth-tools">${tools()}</div>`;
    let form = forgot
        ? `<h1>A fresh start.</h1><p>Enter your email to review a password-reset request. Email delivery is not connected.</p><form class="demo-form" data-message="Reset request validated. No email was sent; secure account recovery is not connected.">${field("Email address", "reset-email", "Enter your email address", "email")}<button class="btn">Send Reset Link ${I("arrow-right")}</button>${formFeedback}</form><p class="auth-note">${A("pages/login.html", "Back to Login")}</p>`
        : `<h1>${register ? "Your next chapter starts here." : "Welcome back."}</h1><p>${register ? "Start your swimming journey with a member profile." : "A little more confidence is waiting for you."}</p><form id="${register ? "register-form" : "login-form"}">${register ? field("Full name", "auth-name", "Enter your full name") : ""}${field("Email address", "auth-email", "Enter your email address", "email")}${register ? field("Mobile number", "auth-phone", "Enter your mobile number", "tel") : ""}${password("Password", "auth-password", register ? "Create a password (at least 8 characters)" : "Enter your password")}${register ? password("Confirm password", "auth-confirm", "Re-enter your password") + select("Member type", "auth-type", ["Adult member", "Parent / guardian"], "Select member type", "required") + `<label class="checkbox"><input type="checkbox" required>I accept the membership terms and privacy information.</label><div class="divider">Your membership journey</div>` : `<div class="form-row"><label class="checkbox"><input id="remember-me" type="checkbox">Remember Me</label>${A("pages/forgot-password.html", "Forgot Password?")}</div>`}<button class="btn">${register ? "Create account" : "Login"} ${I("arrow-right")}</button>${formFeedback}</form><div class="divider">or continue with</div><div class="social-row"><button class="btn btn-secondary integration-btn" data-integration="Google sign-in">${providerIcon("google")}Google</button><button class="btn btn-secondary integration-btn" data-integration="Apple sign-in">${providerIcon("apple")}Apple</button></div><p class="auth-note">${register ? "Already have an account? " + A("pages/login.html", "Login") : "New to Orynwave? " + A("pages/register.html", "Create an account " + I("arrow-right"), "create-account-link")}</p>${register ? "" : ``}`;
    return forgot
        ? `<main id="main" class="auth-layout"><div class="auth-photo">
                <a class="brand" href="${base}index.html">
                    <img src="${base}assets/favicon.svg" alt="" />
                    <div>
                        <strong>
                            orynwave
                            <span>Swimming academy</span>
                        </strong>
                    </div>
                </a>
                <img
                    src="${base}assets/images/login-photo.webp"
                    alt="A tranquil indoor swimming pool"
                    class=""
                    width="1200"
                    height="800"
                    srcset="
                        ${base}assets/images/login-photo-640.webp  640w,
                        ${base}assets/images/login-photo.webp     1200w
                    "
                    sizes="(max-width:767px) calc(100vw - 32px), (max-width:1023px) 48vw, 560px"
                    fetchpriority="high"
                    decoding="async"
                />
                <div class="auth-caption">
                    <span class="eyebrow">A lifelong love of the water</span>
                    <h2>A fresh start. Back to your next chapter.</h2>
                    <p>A little help getting back to your swimming journey.</p>
                </div>
            </div>
            <div class="auth-main"><div class="auth-tools">
                <button
                    class="icon-btn theme-toggle"
                    aria-label="Switch color theme"
                    title="Switch theme"
                >
                    <i data-lucide="moon" aria-hidden="true"></i>
                </button>
                <button
                    class="icon-btn rtl-toggle"
                    aria-label="Switch text direction"
                    title="Switch text direction"
                >
                    <span dir="ltr">RTL</span>
                </button>
            </div><div class="auth-card">
                <span class="eyebrow">Account recovery</span>
                <h1>A fresh start.</h1>
                <p>
                    Enter your email to review a password-reset request. Email delivery is not
                    connected.
                </p>
                <form
                    class="demo-form"
                    data-message="Reset request validated. No email was sent; secure account recovery is not connected."
                >
                    <div class="field">
                        <label for="reset-email">Email address</label>
                        <input
                            autocomplete="email" id="reset-email"
                            name="reset-email"
                            type="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>
                    <button class="btn">
                        Send Reset Link
                        <i data-lucide="arrow-right" aria-hidden="true"></i>
                    </button>
                    <p class="form-feedback" role="status" aria-live="polite"></p>
                </form>
                <p class="auth-note"><a class="" href="${base}pages/login.html">Back to Login</a></p></div></div></main>`
        : `<main id="main" class="auth-layout"><div class="auth-photo">${logo()}${img(register ? "register-photo" : "login-photo", register ? "Adults enjoying a supportive swimming lesson" : "A tranquil indoor swimming pool", "", true)}<div class="auth-caption"><span class="eyebrow">A lifelong love of the water</span><h2>${register ? "One small step. A world of possibility." : "Your lane. Your pace. Your next chapter."}</h2><p>More than lessons. A little more confidence, every time.</p></div></div><div class="auth-main">${controls}<div class="auth-card"><span class="eyebrow">${register ? "Begin your swimming journey" : "Member access"}</span>${form}<p class="auth-note">${A("pages/homepage1.html", "Back to academy " + I("arrow-right"))}</p></div></div></main>`;
}
function special(type) {
    const templates = {
        404: '<main id="main" class="utility-layout">\n            <div class="auth-tools">\n                <button\n                    class="icon-btn theme-toggle"\n                    aria-label="Switch color theme"\n                    title="Switch theme"\n                >\n                    <i data-lucide="moon" aria-hidden="true"></i>\n                </button>\n                <button\n                    class="icon-btn rtl-toggle"\n                    aria-label="Switch text direction"\n                    title="Switch text direction"\n                >\n                    <span dir="ltr">RTL</span>\n                </button>\n            </div>\n            <div class="utility-copy">\n                <a class="brand" href="../index.html">\n                    <img src="../assets/favicon.svg" alt="" />\n                    <div>\n                        <strong>\n                            orynwave\n                            <span>Swimming academy</span>\n                        </strong>\n                    </div>\n                </a>\n                <div class="error-number">404</div>\n                <span class="eyebrow">A little off course</span>\n                <h1>Let’s find your lane.</h1>\n                <p>The page you’re looking for isn’t here. There’s still plenty to explore.</p>\n                <div class="actions">\n                    <a class="btn" href="../index.html">\n                        Back to Home\n                        <i data-lucide="arrow-right" aria-hidden="true"></i>\n                    </a>\n                    <a class="btn btn-secondary" href="../index.html" data-go-back>\n                        Go back\n                        <i data-lucide="arrow-right" aria-hidden="true"></i>\n                    </a>\n                </div>\n                <p class="auth-note">\n                    <a class="" href="../pages/contact.html">Need a little help?</a>\n                </p>\n            </div>\n<figure class="utility-visual error-visual"><img src="../assets/images/utility-404.webp" alt="Swimming goggles and a kickboard beside a calm indoor pool" width="1200" height="800" fetchpriority="high"><figcaption>We will help you find your way back to the water.</figcaption></figure>\n</main>',
        "coming-soon":
            '<main id="main" class="utility-layout">\n            <div class="auth-tools">\n                <button\n                    class="icon-btn theme-toggle"\n                    aria-label="Switch color theme"\n                    title="Switch theme"\n                >\n                    <i data-lucide="moon" aria-hidden="true"></i>\n                </button>\n                <button\n                    class="icon-btn rtl-toggle"\n                    aria-label="Switch text direction"\n                    title="Switch text direction"\n                >\n                    <span dir="ltr">RTL</span>\n                </button>\n            </div>\n            <div class="utility-copy">\n                <a class="brand" href="../index.html">\n                    <img src="../assets/favicon.svg" alt="" />\n                    <div>\n                        <strong>\n                            orynwave\n                            <span>Swimming academy</span>\n                        </strong>\n                    </div>\n                </a>\n                <span class="eyebrow">Something good is on the horizon</span>\n                <h1>A new chapter is coming.</h1>\n                <p>\n                    We’re preparing our next swimming experience. Preview the journey with this\n                    sample launch countdown.\n                </p>\n                <div class="countdown" data-countdown>\n                    <div>\n                        <strong data-days>30</strong>\n                        <small>Days</small>\n                    </div>\n                    <div>\n                        <strong data-hours>00</strong>\n                        <small>Hours</small>\n                    </div>\n                    <div>\n                        <strong data-minutes>00</strong>\n                        <small>Minutes</small>\n                    </div>\n                    <div>\n                        <strong data-seconds>00</strong>\n                        <small>Seconds</small>\n                    </div>\n                </div>\n                <small>Illustrative countdown · launch date to be announced.</small>\n                <form\n                    class="demo-form dashboard-row"\n                    data-message="Demo subscription noted. No email was sent."\n                >\n                    <div class="field">\n                        <label for="launch-email">Email address</label>\n                        <input\n                            id="launch-email"\n                            name="launch-email"\n                            type="email"\n                            placeholder="Enter your email address"\n                            required\n                        />\n                    </div>\n                    <button class="btn">\n                        Keep me in the loop\n                        <i data-lucide="arrow-right" aria-hidden="true"></i>\n                    </button>\n                    <p class="form-feedback" role="status" aria-live="polite"></p>\n                </form>\n                <div class="actions dashboard-row">\n                    <button\n                        class="icon-btn integration-btn"\n                        data-integration="Instagram"\n                        aria-label="Instagram integration"\n                    >\n                        <i data-lucide="instagram" aria-hidden="true"></i>\n                    </button>\n                    <button\n                        class="icon-btn integration-btn"\n                        data-integration="Facebook"\n                        aria-label="Facebook integration"\n                    >\n                        <i data-lucide="facebook" aria-hidden="true"></i>\n                    </button>\n                    <a class="text-link" href="../index.html">Back to academy</a>\n                </div>\n            </div>\n<div class="utility-visual launch-visual"><img src="../assets/images/utility-coming.webp" alt="A swimming coach welcoming a learner to the pool" width="1200" height="800" fetchpriority="high"><div class="launch-panel"><span class="eyebrow">A fresh start awaits</span><h2>More confidence.<br>One stroke at a time.</h2><p>Thoughtful lessons, patient coaching, and a place for every starting point.</p><div class="launch-tags"><span><i data-lucide="shield-check" aria-hidden="true"></i>Patient coaching</span><span><i data-lucide="waves" aria-hidden="true"></i>All abilities</span></div></div></div>\n</main>',
    };
    photos.push({
        page,
        name: type === "404" ? "utility-404" : "utility-coming",
        alt:
            type === "404"
                ? "Swimming equipment beside a tranquil pool"
                : "A coach welcoming a swimmer",
    });
    return templates[type].replaceAll("../", base);
}
const memberNav = [
    ["index", "Overview", "layout-dashboard"],
    ["programs", "My Programs", "waves"],
    ["attendance", "Attendance", "clipboard-check"],
    ["progress", "Skill Progress", "chart-no-axes-combined"],
    ["schedule", "My Schedule", "calendar-days"],
    ["payments", "Fee Payments", "wallet"],
    ["notifications", "Notifications", "bell"],
    ["profile", "My Profile", "user-round"],
    ["settings", "Settings", "settings"],
];
const adminNav = [
    ["index", "Overview", "layout-dashboard"],
    ["members", "Members", "users"],
    ["coaches", "Coaches", "user-round-check"],
    ["programs", "Programs", "waves"],
    ["batches", "Batches", "calendar-days"],
    ["enrollments", "Enrollments", "clipboard-list"],
    ["attendance", "Attendance", "clipboard-check"],
    ["payments", "Payments", "wallet"],
    ["messages", "Messages", "messages-square"],
    ["analytics", "Analytics", "chart-no-axes-combined"],
    ["notifications", "Notifications", "bell"],
    ["settings", "Settings", "settings"],
];
function dashboardShell(role, key, content) {
    const nav = role === "admin" ? adminNav : memberNav;
    const label = nav.find((n) => n[0] === key)[1];
    return `<a class="skip" href="#main">Skip to content</a><div class="dashboard-shell" data-role="${role}"><aside class="sidebar" id="dashboard-sidebar">${logo()}<button class="icon-btn sidebar-close" aria-label="Close sidebar">${I("x")}</button><span class="sidebar-label">${role} workspace</span><nav aria-label="${role} dashboard">${nav.map(([url, t, i]) => `<a href="${url}.html" class="${url === key ? "active" : ""}" ${url === key ? 'aria-current="page"' : ""}>${I(i)}${t}</a>` + (role === "member" && url === "programs" ? `<a href="index.html#batch-enrollment">${I("calendar-plus")}Batch Enrollment</a>` : "")).join("")}<a href="${base}pages/login.html" data-logout>${I("log-out")}Logout</a></nav><div class="sidebar-profile"><div class="person"><span class="avatar">${role === "admin" ? "SC" : "AJ"}</span><div><strong>${role === "admin" ? "Sam Carter" : "Alex Johnson"}</strong><small>${role === "admin" ? "Academy administrator" : "Progress member"}</small></div></div></div></aside><div class="dashboard-main"><header class="dashboard-toolbar"><div class="actions"><button class="icon-btn menu-toggle sidebar-toggle" aria-label="Open dashboard navigation" aria-controls="dashboard-sidebar" aria-expanded="false">${I("menu")}</button><h2>${label}</h2></div><div class="toolbar-controls">${A(`dashboard/${role}/notifications.html`, I("bell"), "icon-btn")}${tools()}<details class="nav-drop"><summary aria-label="Profile menu"><span class="avatar">${role === "admin" ? "SC" : "AJ"}</span></summary><div class="dropdown profile-dropdown">${A(`dashboard/${role}/${role === "admin" ? "settings" : "profile"}.html`, "Your profile")}${A("pages/homepage1.html", "Visit academy")}<a href="${base}pages/login.html" data-logout>Logout</a></div></details></div></header><main id="main" class="dashboard-content"><div class="dashboard-heading"><div><span class="eyebrow">Your ${role === "admin" ? "academy, at a glance" : "swimming journey"}</span><h1>${key === "index" ? (role === "admin" ? "A good day to make progress." : "Welcome back, Alex.") : label}</h1><p>${dashDescriptions[role][key] || "A clear view of what matters. Explore the sample workspace below."}</p></div>${key === "index" ? `<div class="actions dashboard-overview-actions"><span class="pill">${I("calendar-days")}November 2026</span>${role === "member" ? `<a class="btn" href="#batch-enrollment">${I("calendar-plus")}Enroll in a batch</a>` : ""}</div>` : ""}</div>${content}</main></div></div>`;
}
const dashDescriptions = {
    member: {
        index: "One step closer to your next milestone. Here’s your week in the water.",
        programs: "Your programs, coaches and progress in one place.",
        enrollment: "Explore sample batches and preview your next enrollment.",
        attendance: "Show up, find your rhythm, and see your consistency grow.",
        progress: "Small improvements. Meaningful milestones.",
        schedule: "A little planning for your next good session.",
        payments: "Your fees, transactions and sample invoices, clearly laid out.",
        notifications: "A few things to keep on your radar.",
        profile: "Keep your profile up to date.",
        settings: "Make this workspace feel like yours.",
    },
    admin: {
        index: "A clear view of your academy, your members and the month ahead.",
        members: "People first. Find and manage your sample member records.",
        coaches: "The team behind every confident swimmer.",
        programs: "Shape a thoughtful pathway for every learner.",
        batches: "Balance coaches, capacities and session times.",
        enrollments: "Review sample requests and help members find their place.",
        attendance: "A clear view of who’s showing up and moving forward.",
        payments: "Track sample revenue, outstanding fees and transaction status.",
        messages: "Every question is the start of a conversation.",
        analytics: "See the patterns behind your academy’s progress.",
        notifications: "The updates that help keep things running smoothly.",
        settings: "The details that bring your academy together.",
    },
};
const metric = (label, value, icon, detail) =>
    `<article class="card metric"><div><small>${label}</small><span class="icon-box">${I(icon)}</span></div><strong>${value}</strong><span class="trend">${detail}</span></article>`;
const chart = (title, type, dataKey, subtitle = "Sample academy data") =>
    `<article class="card chart-card"><div class="chart-head"><div><h2>${title}</h2><p>${subtitle}</p></div><select aria-label="${title} date range" class="chart-range"><option value="current">This period</option><option value="previous">Previous period</option></select></div><div class="chart-area"><canvas data-chart="${type}" data-series="${dataKey}" aria-label="${title}" role="img"></canvas></div></article>`;
const panel = (title, content, link = "") =>
    `<section class="card"><div class="panel-head"><h2>${title}</h2>${link}</div>${content}</section>`;
const skills = () =>
    `<div class="form-panel"><h3>Your skill milestones</h3>${[
        ["Water confidence", 100],
        ["Breathing control", 85],
        ["Front crawl technique", 65],
        ["Endurance", 50],
    ]
        .map(
            ([t, v]) =>
                `<div class="skill-row"><div><span>${t}</span><strong>${v}%</strong></div><div class="progress-track" role="progressbar" aria-label="${t}" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100"><span style="width:${v}%"></span></div></div>`,
        )
        .join("")}</div>`;
const sessions = () =>
    table(
        ["Session", "Date", "Coach", "Status"],
        [
            [
                "Adult Foundations",
                "Nov 18 · 6:30 AM",
                "James Carter",
                '<span class="badge">Upcoming</span>',
            ],
            [
                "Technique Practice",
                "Nov 20 · 6:30 AM",
                "James Carter",
                '<span class="badge">Upcoming</span>',
            ],
            [
                "Progress Review",
                "Nov 25 · 6:30 AM",
                "James Carter",
                '<span class="badge">Scheduled</span>',
            ],
        ],
    );
const calendar = () => {
    const days = ["M", "T", "W", "T", "F", "S", "S"]
        .map((d) => '<div class="day">' + d + "</div>")
        .join("");
    const cells = Array.from({ length: 42 }, (_, i) => {
        const date = i - 5;
        if (date < 1 || date > 30) return "<div></div>";
        const classDay = [3, 5, 10, 12, 17, 19, 24, 26].includes(date);
        return (
            '<div class="' +
            (classDay ? "present" : "") +
            '">' +
            date +
            (classDay ? "<br>Class" : "") +
            "</div>"
        );
    }).join("");
    return '<div class="calendar">' + days + cells + "</div>";
};
const history = () =>
    table(
        ["Session", "Date", "Result"],
        [
            ["Adult Foundations", "Nov 3", "Present"],
            ["Technique Practice", "Nov 5", "Present"],
            ["Adult Foundations", "Nov 10", "Present"],
            ["Technique Practice", "Nov 12", "Present"],
            ["Adult Foundations", "Nov 17", "Present"],
            ["Technique Practice", "Oct 29", "Absent"],
        ],
    );
function notices(admin = false) {
    return `<div class="card" data-notification-list>${(admin
        ? [
              [
                  "New enrollment requests",
                  "Two sample members are waiting for a program review.",
                  "clipboard-list",
              ],
              [
                  "Batch capacity update",
                  "Kids Foundations has four sample seats available.",
                  "calendar-days",
              ],
              ["Payment follow-up", "Two illustrative invoices need your attention.", "wallet"],
          ]
        : [
              [
                  "Your next session is coming up",
                  "Adult Foundations · November 18 · 6:30 AM · Lane 2.",
                  "calendar-days",
              ],
              [
                  "Your progress notes are ready",
                  "James has shared your latest breathing and technique feedback.",
                  "chart-no-axes-combined",
              ],
              [
                  "A little reminder about your fees",
                  "Your November sample balance is $119. No real payment is due.",
                  "wallet",
              ],
          ]
    )
        .map(
            ([t, d, i], n) =>
                `<article class="notice" data-notice-id="${admin ? "admin" : "member"}-${n}" data-read="false"><span class="icon-box">${I(i)}</span><div><h3>${t}</h3><p>${d}</p><small>November 17, 2026 · sample notification</small></div><button class="btn btn-secondary btn-sm mark-read" type="button">Mark as read</button></article>`,
        )
        .join("")}</div>`;
}
const profileForm = (admin = false) =>
    `<form class="form-panel profile-form" data-profile-role="${admin ? "admin" : "member"}"><h3>${admin ? "Academy details" : "Your details"}</h3><p class="dashboard-row">${admin ? "Customize this sample academy profile." : "Personal details remain in memory for this session; they are not saved in browser storage."}</p><div class="grid grid-2 dashboard-row">${field(admin ? "Academy name" : "Full name", "profile-name", admin ? "Enter academy name" : "Enter your full name")}${field("Email address", "profile-email", "Enter your email address", "email")}${field("Phone number", "profile-phone", "Enter your mobile number", "tel")}${select(admin ? "Operating hours" : "Preferred program", "profile-program", admin ? ["6:00 AM–9:00 PM", "7:00 AM–8:00 PM"] : ["Adult Foundations", "Intermediate Skills", "Private Coaching"], "Select your preference", "required")}</div><button class="btn">Save profile ${I("check")}</button>${formFeedback}</form>`;
function settings(admin = false) {
    return `<div class="grid grid-2"><form class="form-panel preferences-form"><span class="eyebrow">Make it yours</span><h3>Workspace preferences</h3><div class="dashboard-row">${select(
        "Theme preference",
        "pref-theme",
        [
            ["system", "Use system preference"],
            ["light", "Light"],
            ["dark", "Dark"],
        ],
        "Choose theme",
        "required",
    )}${select("Notification preference", "pref-notify", ["Class reminders & updates", "Important updates only", "No reminders"], "Choose notification preference", "required")}${select(admin ? "Default membership" : "Preferred language direction", "pref-other", admin ? ["Starter", "Progress", "Elite"] : ["Left to right", "Right to left"], "Choose preference", "required")}</div><label class="checkbox"><input type="checkbox" name="summary" checked>Show ${admin ? "academy" : "weekly"} summary</label><button class="btn dashboard-row">Save preferences</button>${formFeedback}</form><form class="form-panel change-password"><span class="eyebrow">Your account</span><h3>Change password · UI preview</h3><p class="dashboard-row">A real password change requires secure backend authentication.</p><div class="dashboard-row">${password("Current password", "current-pass", "Enter current password")}${password("New password", "new-pass", "Create a new password")}${password("Confirm new password", "confirm-pass", "Re-enter new password")}</div><button class="btn btn-secondary">Validate password change</button>${formFeedback}</form></div>${admin ? `<div class="dashboard-row">${profileForm(true)}</div>` : ""}`;
}
function memberEnrollment() {
    return `<section id="batch-enrollment" class="member-enrollment dashboard-row" aria-labelledby="batch-enrollment-title" tabindex="-1"><div class="section-head"><div><span class="eyebrow">Batch enrollment</span><h2 id="batch-enrollment-title">Find your next batch.</h2><p>Filter by level, choose a suitable batch, and review your enrollment request.</p></div></div>${filters(
        "member-batches",
        [
            [
                "Level",
                "level",
                [
                    ["beginner", "Beginner"],
                    ["intermediate", "Intermediate"],
                    ["advanced", "Advanced"],
                ],
            ],
        ],
    )}<div class="grid grid-3" data-filter-results="member-batches">${batches
        .filter((b) => b[1] !== "kids")
        .map(
            (b) =>
                `<article class="card feature filter-item" data-level="${b[2]}"><span class="eyebrow">${b[2]} · sample availability</span><h3>${b[0]}</h3><p>${b[4]} · ${b[6]}<br>Coach ${b[7]}<br>${b[8]} sample seats</p><button class="btn dashboard-row batch-enroll" data-batch="${b[0]}">Choose this batch</button></article>`,
        )
        .join(
            "",
        )}<p class="empty-state" hidden>No batches match.</p></div><div id="member-enrollment-confirmation" aria-live="polite" class="form-panel dashboard-row"><h3>Your sample enrollment</h3><p>Select a batch to review it here. No real place is reserved.</p></div></section>`;
}
function member(key) {
    switch (key) {
        case "index":
            return `<div class="grid grid-4">${metric("Attendance", "92%", "clipboard-check", "22 of 24 sessions attended")}${metric("Current level", "Foundation", "waves", "Your next step: Intermediate")}${metric("Next session", "Nov 18", "calendar-days", "6:30 AM · Lane 2")}${metric("Balance", "$119", "wallet", "Novembernstration only")}</div><div class="grid grid-2 dashboard-row">${chart("Your weekly attendance", "bar", "attendance", "Sessions attended · last six weeks")}${chart("The skills you’re building", "radar", "skills", "Coach assessment · sample values")}</div><div class="grid grid-2 dashboard-row">${panel("Your next sessions", sessions(), A("dashboard/member/schedule.html", "Full schedule", "text-link"))}${skills()}</div><div class="dashboard-row">${panel("Your active pathway", `<div class="card-body"><span class="pill">In progress · 5 of 8 weeks</span><h3>Adult Foundations</h3><p>Coach James Carter · Tue / Thu · 6:30 AM · Lane 2</p><p>You’re building a steady breathing rhythm. Next up: comfortable side breathing.</p>${A("dashboard/member/programs.html", "View your program " + I("arrow-right"), "text-link")}</div>`)}</div>${memberEnrollment()}`;
        case "programs":
            return `<div class="grid grid-2"><article class="card"><div class="card-body"><span class="eyebrow">Your active program</span><h2>Adult Foundations</h2><p>Coach James Carter · 8-week sample program</p><span class="pill">In progress · week 5</span><p>Tuesday & Thursday · 6:30–7:15 AM</p><div class="progress-track"><span style="width:63%"></span></div><small>63% of your sample pathway completed</small>${A("dashboard/member/progress.html", "View skill progress " + I("arrow-right"), "text-link")}</div></article><article class="card"><div class="card-body"><span class="eyebrow">A next step to explore</span><h2>Intermediate Skills</h2><p>Refine coordination, improve stroke efficiency and build distance with a clear plan.</p><span class="pill">Next level · assessment required</span>${check(["Coach-led stroke development", "Practice with a purpose", "Regular feedback and progress reviews"])}${A("dashboard/member/index.html#batch-enrollment", "Explore your next program " + I("arrow-right"), "text-link")}</div></article></div><div class="dashboard-row">${panel(
                "Your learning plan",
                table(
                    ["Week", "Focus", "Sample status"],
                    [
                        ["1–2", "Water comfort & breathing", "Complete"],
                        ["3–4", "Floating & controlled kicking", "Complete"],
                        ["5–6", "Coordinated front crawl", "In progress"],
                        ["7–8", "Technique review & next steps", "Upcoming"],
                    ],
                ),
            )}</div>`;
        case "attendance":
            return `<div class="grid grid-3">${metric("Attendance rate", "92%", "clipboard-check", "22 of 24 sessions")}${metric("Attended", "22", "check", "Two sample absences")}${metric("Current streak", "5", "flame", "Consecutive sessions")}</div><div class="grid grid-2 dashboard-row">${chart("Monthly consistency", "bar", "attendance")}<div class="card chart-card"><div class="chart-head"><h2>November 2026</h2><span class="pill">Class days</span></div>${calendar()}</div></div><div class="dashboard-row">${panel("Your session history", history())}</div>`;
        case "progress":
            return `<div class="grid grid-2">${skills()}<div class="form-panel stack"><span class="eyebrow">Coach feedback · November 17</span><h2>More relaxed. More in control.</h2><p>“Your exhale is becoming smoother, and your body position is more stable. Next, we’ll practice turning for a breath without lifting your head.”</p><div class="person"><span class="avatar">JC</span><div><strong>James Carter</strong><small>Your sample coach</small></div></div>${check(["Completed: independent front and back float", "Completed: controlled kick over 10 meters", "Next: consistent side breathing", "Next: 25 meters of coordinated front crawl"])}</div></div><div class="grid grid-2 dashboard-row">${chart("Your progress over time", "line", "progress")}${chart("Your skill profile", "radar", "skills")}</div>`;
        case "schedule":
            return `<div class="form-panel"><div class="chart-head"><h2>Your week · November 16–20</h2><span class="pill">Your calendar</span></div><div class="schedule-grid">${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d, i) => `<div class="schedule-day"><h3>${d}</h3>${[1, 3].includes(i) ? '<div class="schedule-event"><strong>6:30–7:15 AM</strong>Adult Foundations<br>James Carter · Lane 2</div>' : "<p>Rest & recovery</p>"}</div>`).join("")}</div></div><div class="dashboard-row">${panel("Your upcoming sessions", sessions())}</div>`;
        case "payments":
            return payments(false);
        case "notifications":
            return `<div class="actions" style="margin-bottom:24px"><button class="btn btn-secondary mark-all-read">Mark all as read</button></div>${notices()}`;
        case "profile":
            return profileForm();
        case "settings":
            return settings();
    }
}
const sampleMembers = [
    ["M001", "Alex Johnson", "Adult Foundations", "Active", "Progress"],
    ["M002", "Amelia Ross", "Kids Foundations", "Active", "Starter"],
    ["M003", "Daniel King", "Adult Beginners", "Pending", "Starter"],
    ["M004", "Maya Lee", "Intermediate Skills", "Active", "Elite"],
    ["M005", "Robert Park", "Private Coaching", "Paused", "Elite"],
];
function manageTable(kind) {
    const configs = {
        members: {
            heads: ["Member ID", "Member", "Program", "Plan", "Status"],
            rows: sampleMembers.map((r) => [r[0], r[1], r[2], r[4], r[3]]),
        },
        coaches: {
            heads: ["Coach", "Specialization", "Availability", "Assigned batches", "Status"],
            rows: [
                ["Emma Wilson", "Kids foundations", "Mon / Wed / Fri", "K01, W01", "Active"],
                ["James Carter", "Adult technique", "Tue / Thu", "A01, A02", "Active"],
                ["Sofia Reed", "Performance", "Mon / Wed / Fri", "J02, P01", "Active"],
            ],
        },
        programs: {
            heads: ["Program", "Level", "Enrolled", "Duration", "Status"],
            rows: [
                ["Kids Foundations", "Beginner", "48", "8 weeks", "Active"],
                ["Adult Beginners", "Beginner", "32", "8 weeks", "Active"],
                ["Intermediate Skills", "Intermediate", "24", "10 weeks", "Active"],
                ["Advanced Performance", "Advanced", "16", "12 weeks", "Active"],
            ],
        },
        batches: {
            heads: ["Batch", "Program", "Coach", "Time", "Sample seats"],
            rows: batches.map((b, i) => [
                "B00" + (i + 1),
                b[0],
                b[7],
                b[4] + " " + b[6],
                String(b[8]),
            ]),
        },
        enrollments: {
            heads: ["Request", "Member", "Program", "Submitted", "Status"],
            rows: [
                ["E001", "Daniel King", "Adult Beginners", "Nov 17, 2026", "Pending"],
                ["E002", "Olivia Reed", "Kids Foundations", "Nov 16, 2026", "Pending"],
                ["E003", "Maya Lee", "Intermediate Skills", "Nov 15, 2026", "Approved"],
            ],
        },
        attendance: {
            heads: ["Member", "Batch", "Session date", "Coach", "Attendance"],
            rows: [
                ["Alex Johnson", "A01", "Nov 17, 2026", "James Carter", "Present"],
                ["Daniel King", "A01", "Nov 17, 2026", "James Carter", "Absent"],
                ["Maya Lee", "J02", "Nov 16, 2026", "Sofia Reed", "Present"],
            ],
        },
    };
    const c = configs[kind];
    return `<div class="filter-bar"><div class="field"><label for="manage-search">Search ${kind}</label><input id="manage-search" type="search" placeholder="Search ${kind}" data-table-search></div>${select("Status / group", "manage-status", [...new Set(c.rows.map((r) => r.at(-1)))], "All records", "data-table-status")}<button class="btn manage-add" data-kind="${kind}">${I("plus")}Add ${{ batches: "batch", coaches: "coach", attendance: "attendance record" }[kind] || kind.replace(/s$/, "")}</button></div><div class="table-wrap"><table data-manage="${kind}" data-headers='${JSON.stringify(c.heads)}'><thead><tr>${[...c.heads, "Actions"].map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${c.rows.map((r, n) => `<tr data-record="${kind}-${n}">${r.map((v, i) => `<td data-col="${i}">${i === c.heads.length - 1 ? `<span class="badge">${v}</span>` : v}</td>`).join("")}<td><button class="btn btn-secondary btn-sm manage-edit" data-kind="${kind}">Edit</button>${kind === "enrollments" ? '<button class="btn btn-sm approve-enrollment">Approve</button>' : ""}${kind === "attendance" ? '<button class="btn btn-sm toggle-attendance">Toggle</button>' : ""}</td></tr>`).join("")}</tbody></table><p class="empty-state" data-table-empty hidden>No records match your search.</p></div><p class="result-count" data-table-count role="status"></p>`;
}
function payments(admin) {
    return `<div class="grid grid-3">${metric(admin ? "Sample monthly revenue" : "Balance", admin ? "$12,480" : "$119", "wallet", admin ? "November 2026" : "November membership")}${metric(admin ? "Pending invoices" : "Paid this year", admin ? "2" : "$1,071", "receipt", admin ? "$238 outstanding" : "Nine sample transactions")}${metric(admin ? "Settled transactions" : "Current plan", admin ? "104" : "Progress", "credit-card", admin ? "Illustrative transaction count" : "Monthly sample membership")}</div><div class="dashboard-row">${panel(
        admin ? "Transaction management" : "Your transaction history",
        `<div class="table-wrap"><table data-payments><thead><tr>${["Invoice", "Member / plan", "Date", "Amount", "Status", "Actions"].map((t) => `<th>${t}</th>`).join("")}</tr></thead><tbody>${[
            ["INV-1101", "Alex Johnson · Progress", "Nov 1, 2026", "$119", "Pending"],
            ["INV-1001", "Alex Johnson · Progress", "Oct 1, 2026", "$119", "Paid"],
            [
                "INV-0901",
                admin ? "Maya Lee · Elite" : "Alex Johnson · Progress",
                "Sep 1, 2026",
                admin ? "$159" : "$119",
                "Paid",
            ],
        ]
            .map(
                (r, n) =>
                    `<tr data-payment="${n}">${r.map((c, i) => `<td>${i === 4 ? `<span class="badge payment-status">${c}</span>` : c}</td>`).join("")}<td><button class="btn btn-secondary btn-sm invoice-btn">Invoice</button>${admin ? '<button class="btn btn-secondary btn-sm payment-status-btn">Change status</button>' : n === 0 ? '<button class="btn btn-sm integration-btn" data-integration="Payment processing">Payment options</button>' : ""}</td></tr>`,
            )
            .join("")}</tbody></table></div>`,
    )}</div><div class="form-panel dashboard-row"><h3>Payment methods · integration preview</h3><p>Card and bank-transfer connections must be supplied by a payment provider. No payment information is collected and no money is processed here.</p></div>`;
}
function admin(key) {
    switch (key) {
        case "index":
            return `<div class="grid grid-4">${metric("Total members", "240", "users", "216 active · 24 inactive")}${metric("Active programs", "4", "waves", "Across 6 sample batches")}${metric("Enrollments this month", "36", "clipboard-list", "34 approved · 2 pending")}${metric("Monthly revenue", "$12,480", "wallet", "104 settled transactions")}</div><div class="grid grid-2 dashboard-row">${chart("Enrollment momentum", "bar", "enrollments")}${chart("Revenue overview", "line", "revenue")}</div><div class="grid grid-2 dashboard-row">${chart("Programs at a glance", "doughnut", "programs")}<div class="stack"><div class="grid grid-2">${metric("Average attendance", "92%", "clipboard-check", "Sample academy average")}${metric("Pending payments", "$238", "receipt", "Two sample invoices")}</div><div class="form-panel"><h3>Upcoming batches</h3>${check(["Adult Beginners · Tue / Thu · 6:30 AM", "Kids Foundations · Mon / Wed / Fri · 4:00 PM", "Weekend Fundamentals · Sat / Sun · 9:00 AM"])}${A("dashboard/admin/batches.html", "Manage batches " + I("arrow-right"), "text-link")}</div></div></div><div class="dashboard-row">${panel(
                "Recent enrollment requests",
                table(
                    ["Member", "Program", "Requested", "Status"],
                    [
                        ["Daniel King", "Adult Beginners", "Nov 17", "Pending"],
                        ["Olivia Reed", "Kids Foundations", "Nov 16", "Pending"],
                        ["Maya Lee", "Intermediate Skills", "Nov 15", "Approved"],
                    ],
                ),
                A("dashboard/admin/enrollments.html", "Review requests", "text-link"),
            )}</div>`;
        case "members":
        case "coaches":
        case "programs":
        case "batches":
        case "enrollments":
            return (
                manageTable(key) +
                (key === "batches" ? `<div class="dashboard-row">${timetable()}</div>` : "")
            );
        case "attendance":
            return `<div class="grid grid-3">${metric("Average attendance", "92%", "clipboard-check", "Sample academy average")}${metric("Attended sessions", "220", "check", "Of 240 expected visits")}${metric("Missed sessions", "20", "calendar-x", "Across all sample batches")}</div><div class="grid grid-2 dashboard-row">${chart("Monthly attendance", "line", "attendance")}<div class="form-panel"><h3>November 2026 · class dates</h3><div class="dashboard-row">${calendar()}</div></div></div><div class="dashboard-row">${manageTable("attendance")}</div>`;
        case "payments":
            return payments(true);
        case "messages":
            return `<div class="grid grid-2"><section class="card"><div class="panel-head"><h2>Your inbox</h2><span class="pill">3 sample inquiries</span></div>${[
                ["Jordan Taylor", "Adult beginner lessons", "Can I join a morning beginner batch?"],
                [
                    "Amelia Ross",
                    "Kids lesson timings",
                    "Do you offer Saturday sessions for ages 6–8?",
                ],
                [
                    "Robert Park",
                    "Private coaching",
                    "I would like to work on my breathing technique.",
                ],
            ]
                .map(
                    ([n, s, m], i) =>
                        `<article class="notice"><span class="avatar">${n
                            .split(" ")
                            .map((x) => x[0])
                            .join(
                                "",
                            )}</span><div><h3>${s}</h3><p>${n}</p><button class="text-link message-open" data-message-index="${i}" data-sender="${n}" data-subject="${s}" data-body="${m}" type="button">Read inquiry ${I("arrow-right")}</button></div><span class="badge message-status">Unread</span></article>`,
                )
                .join(
                    "",
                )}</section><section class="form-panel stack" id="message-detail"><span class="eyebrow">A conversation starts here</span><h2>Select an inquiry.</h2><p>Read a sample message and draft a local response. No messages are sent.</p></section></div>`;
        case "analytics":
            return `<div class="filter-bar">${select(
                "Date range",
                "analytics-range",
                [
                    ["nov", "November 2026"],
                    ["oct", "October 2026"],
                    ["quarter", "Sample quarter"],
                ],
                "Select period",
                "required",
            )}<button class="btn" id="apply-analytics">Apply range</button></div><div class="grid grid-4">${metric("Sample revenue", '<span data-analytics-kpi="revenue">$12,480</span>', "wallet", "Illustrative period total")}${metric("Enrollments", '<span data-analytics-kpi="enrollments">36</span>', "clipboard-list", "Sample period")}${metric("Membership growth", '<span data-analytics-kpi="growth">+12%</span>', "users", "Compared with previous period")}${metric("Attendance", "92%", "clipboard-check", "Sample academy average")}</div><div class="grid grid-2 dashboard-row">${chart("Revenue trend", "line", "revenue")}${chart("Enrollment trend", "bar", "enrollments")}${chart("Program distribution", "doughnut", "programs")}${chart("Attendance consistency", "line", "attendance")}${chart("Membership growth", "line", "growth")}${panel(
                "Program performance",
                table(
                    ["Program", "Members", "Attendance"],
                    [
                        ["Kids Foundations", "48", "94%"],
                        ["Adult Beginners", "32", "90%"],
                        ["Intermediate Skills", "24", "93%"],
                        ["Advanced Performance", "16", "91%"],
                    ],
                ),
            )}</div>`;
        case "notifications":
            return `<div class="actions" style="margin-bottom:24px"><button class="btn btn-secondary mark-all-read">Mark all as read</button></div>${notices(true)}`;
        case "settings":
            return settings(true);
    }
}
function layout(
    title,
    body,
    kind = "public",
    description = "Thoughtful swimming programs, patient coaching and purposeful progress for kids and adults.",
) {
    return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${description}"><meta name="theme-color" content="#542447"><title>${title} | Orynwave Swim Academy</title><link rel="canonical" href="https://teknritsolutions.github.io/Swimming-Academy-for-Kids-Adults/${page}"><meta property="og:title" content="${title} | Orynwave Swim Academy"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><link rel="icon" type="image/svg+xml" href="${base}assets/favicon.svg"><link rel="icon" href="${base}assets/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="${base}assets/apple-touch-icon.png"><script src="${base}assets/js/theme.js"></script><link rel="stylesheet" href="${base}assets/vendor/bootstrap.min.css">${["variables", "style", "components", "dark-mode", "rtl", ...(kind === "dashboard" ? ["dashboard"] : []), "responsive"].map((x) => `<link rel="stylesheet" href="${base}assets/css/${x}.css">`).join("")}<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description })}</script></head><body class="${kind === "auth" ? (page === "pages/forgot-password.html" ? "auth-body auth-premium auth-forgot" : page === "pages/login.html" ? "auth-body auth-premium auth-login" : page === "pages/register.html" ? "auth-body auth-premium auth-register" : page === "pages/404.html" ? "auth-body utility-page utility-404" : page === "pages/coming-soon.html" ? "auth-body utility-page utility-coming-soon" : "auth-body") : page === "pages/programs.html" ? "programs-page" : page === "pages/program-details.html" ? "program-details-page" : page === "pages/blog.html" ? "blog-page" : page === "pages/blog-details.html" ? "blog-details-page" : page === "pages/contact.html" ? "contact-page" : ""}">${kind === "public" ? header() + '<main id="main">' + body + "</main>" + footer() : body}<dialog id="app-dialog"><div class="dialog-head"><h2 id="dialog-title">Details</h2><button class="icon-btn" id="dialog-close" aria-label="Close dialog">${I("x")}</button></div><div id="dialog-content"></div></dialog><div class="toast" id="toast" role="status" hidden></div>${kind === "public" ? `<button class="icon-btn back-top" aria-label="Back to top" hidden>${I("arrow-up")}</button>` : ""}<script src="${base}assets/vendor/lucide.min.js"></script>${kind === "dashboard" ? `<script src="${base}assets/vendor/chart.umd.js"></script>` : ""}${["main", "rtl", "forms", "filters", ...(kind === "dashboard" ? ["demo-data", "dashboard", "charts"] : []), ...(page === "pages/program-details.html" ? ["program-details"] : []), ...(page === "pages/blog-details.html" ? ["blog-details"] : []), "selects"].map((x) => `<script src="${base}assets/js/${x}.js" defer></script>`).join("")}</body></html>`;
}
function write(file, title, render, kind = "public") {
    page = file;
    base = "../".repeat(file.split("/").length - 1);
    const content = render();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, layout(title, content, kind));
    allPages.push({ file, title, kind });
}
write("pages/homepage1.html", "Make your waves", home1);
write("pages/homepage2.html", "A new perspective", home2);
for (const [slug, title, fn] of [
    ["about", "Our story", about],
    ["programs", "Swimming programs", programs],
    ["program-details", "Kids beginner swimming", details],
    ["coaches", "Meet your coaches", coaches],
    ["batch-timings", "Batch timings", timings],
    ["pricing", "Membership pricing", pricing],
    ["blog", "The swim journal", blog],
    ["blog-details", "Your first swimming lesson", blogDetails],
    ["contact", "Contact the academy", contact],
])
    write(`pages/${slug}.html`, title, fn);
for (const type of ["login", "register", "forgot-password"])
    write(
        `pages/${type}.html`,
        type === "register"
            ? "Create an account"
            : type === "login"
              ? "Welcome back"
              : "Reset your password",
        () => auth(type),
        "auth",
    );
for (const type of ["404", "coming-soon"])
    write(
        `pages/${type}.html`,
        type === "404" ? "Page not found" : "Coming soon",
        () => special(type),
        "auth",
    );
for (const role of ["member", "admin"])
    for (const [key, label] of role === "member" ? memberNav : adminNav)
        write(
            `dashboard/${role}/${key}.html`,
            `${role === "admin" ? "Admin" : "Member"} · ${label}`,
            () => dashboardShell(role, key, role === "admin" ? admin(key) : member(key)),
            "dashboard",
        );
write(
    "documentation/index.html",
    "Academy documentation",
    () =>
        intro(
            "Documentation",
            "Make Orynwave your own.",
            "Installation, customization and integration guidance for the complete academy website.",
        ) +
        section(
            "Start with a simple local server.",
            `<div class="form-panel stack"><h3>Run locally</h3><p>Install Node.js, open a terminal in the project directory and run <code>node scripts/serve.mjs</code>. Open <code>http://localhost:4173</code>. No build or package installation is needed for the website.</p><h3>Customize the brand</h3><p>Edit design tokens in <code>assets/css/variables.css</code>, page content in the HTML files, and sample dashboard data in <code>assets/js/demo-data.js</code>. Reusable source templates live in <code>scripts/build.mjs</code>.</p><h3>Demo workflows</h3><p>All enrollments, statuses, invoices and charts are illustrative. Browser storage holds preferences and record IDs/statuses only. Passwords, personal contact details and payment card information are never stored.</p><h3>Production integration</h3><p>Connect secure authentication, a database, email and a payment provider before operating a real academy. Replace sample credentials, fictitious profiles, prices, contact details and canonical URLs.</p><h3>Images & dependencies</h3><p>Original AI-generated swimming photographs are in assets/images. See image-inventory.json and documentation/image-credits.md. Bootstrap 5.3.3, Chart.js 4.4.8 and Lucide 0.468.0 are bundled locally with their licenses. Plus Jakarta Sans is locally hosted.</p><h3>Navigation</h3><p>Two homepages, ten public content pages, five standalone pages, nine member screens with enrollment on the overview and twelve admin screens are included. Read README.md for the full sitemap and verification instructions.</p></div>`,
            "Academy guide",
        ),
);
fs.writeFileSync("assets/image-inventory.json", JSON.stringify(photos, null, 2));
fs.writeFileSync("documentation/pages.json", JSON.stringify(allPages, null, 2));
fs.writeFileSync(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allPages
        .filter((p) => p.kind === "public")
        .map((p) => `<url><loc>https://teknritsolutions.github.io/Swimming-Academy-for-Kids-Adults/${p.file}</loc></url>`)
        .join("")}</urlset>`,
);
fs.writeFileSync(
    "robots.txt",
    "User-agent: *\nAllow: /\nDisallow: /dashboard/\nSitemap: https://teknritsolutions.github.io/Swimming-Academy-for-Kids-Adults/sitemap.xml\n",
);
console.log(`Built ${allPages.length} pages and ${photos.length} unique photograph placements.`);

// The root document is an entry point; homepage content lives in pages/.
fs.writeFileSync("index.html", "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <meta http-equiv=\"refresh\" content=\"0; url=pages/homepage1.html\">\n  <link rel=\"canonical\" href=\"pages/homepage1.html\">\n  <title>Orynwave Swim Academy</title>\n  <script>location.replace(\"pages/homepage1.html\" + location.search + location.hash);</script>\n</head>\n<body><p>Continue to <a href=\"pages/homepage1.html\">Orynwave Swim Academy</a>.</p></body>\n</html>\n");
