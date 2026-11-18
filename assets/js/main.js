(() => {
    const S = window.Orynwave;
    document.querySelector("[data-go-back]")?.addEventListener("click", (event) => {
        if (document.referrer && new URL(document.referrer).origin === location.origin) {
            event.preventDefault();
            history.back();
        }
    });
    S.escape = (value) =>
        String(value).replace(
            /[&<>"']/g,
            (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
        );
    S.icons = () => window.lucide?.createIcons();
    S.toast = (message) => {
        const el = document.getElementById("toast");
        el.textContent = message;
        el.hidden = false;
        clearTimeout(S.toastTimer);
        S.toastTimer = setTimeout(() => {
            el.hidden = true;
        }, 5500);
    };
    const dialog = document.getElementById("app-dialog");
    S.dialog = (title, html) => {
        document.getElementById("dialog-title").textContent = title;
        document.getElementById("dialog-content").innerHTML = html;
        dialog.showModal();
        S.icons();
    };
    document.getElementById("dialog-close")?.addEventListener("click", () => dialog.close());
    dialog?.addEventListener("click", (e) => {
        if (e.target === dialog) {
            const b = dialog.getBoundingClientRect();
            if (
                e.clientX < b.left ||
                e.clientX > b.right ||
                e.clientY < b.top ||
                e.clientY > b.bottom
            )
                dialog.close();
        }
    });
    S.applyTheme = (preference) => {
        S.storage.set("theme", preference);
        document.documentElement.dataset.theme =
            preference === "system"
                ? matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : preference;
        document.dispatchEvent(new Event("appearancechange"));
        updateThemeControls();
    };
    function updateThemeControls() {
        const dark = document.documentElement.dataset.theme === "dark";
        document.querySelectorAll(".theme-toggle").forEach((b) => {
            b.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}" aria-hidden="true"></i>`;
            b.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
        });
        S.icons();
    }
    document
        .querySelectorAll(".theme-toggle")
        .forEach((b) =>
            b.addEventListener("click", () =>
                S.applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"),
            ),
        );
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (S.storage.get("theme", "system") === "system") S.applyTheme("system");
    });
    updateThemeControls();
    const nav = document.getElementById("public-nav");
    const menu = document.querySelector(".menu-toggle:not(.sidebar-toggle)");
    function closeNav() {
        nav?.classList.remove("is-open");
        menu?.setAttribute("aria-expanded", "false");
        menu?.setAttribute("aria-label", "Open navigation");
    }
    menu?.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        menu.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    matchMedia("(min-width: 1200px)").addEventListener("change", closeNav);
    document.querySelectorAll(".public-nav > .nav-drop").forEach((dropdown) => {
        dropdown.addEventListener("pointerenter", (event) => {
            if (event.pointerType === "mouse" && matchMedia("(min-width: 1200px)").matches)
                dropdown.open = true;
        });
        dropdown.addEventListener("pointerleave", (event) => {
            if (event.pointerType === "mouse" && !dropdown.contains(document.activeElement))
                dropdown.open = false;
        });
        dropdown.addEventListener("focusout", (event) => {
            if (!dropdown.contains(event.relatedTarget) && !dropdown.matches(":hover"))
                dropdown.open = false;
        });
    });
    document.querySelectorAll(".nav-drop").forEach((detail) => {
        detail.addEventListener("toggle", () => {
            if (detail.open)
                document.querySelectorAll(".nav-drop").forEach((other) => {
                    if (other !== detail) other.open = false;
                });
        });
    });
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".nav-drop").forEach((d) => {
            if (!d.contains(e.target)) d.open = false;
        });
        if (nav && !nav.contains(e.target) && !menu?.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const openDropdown = document.querySelector(".nav-drop[open]");
            if (nav?.classList.contains("is-open")) menu?.focus();
            else openDropdown?.querySelector("summary")?.focus();
            closeNav();
            document.querySelectorAll(".nav-drop").forEach((d) => {
                d.open = false;
            });
        }
    });
    const current = location.pathname.replace(/\/$/, "/index.html");
    document.querySelectorAll(".public-nav a").forEach((a) => {
        if (new URL(a.href).pathname === current) {
            a.classList.add("active");
            a.setAttribute("aria-current", "page");
        }
    });
    document.querySelectorAll(".integration-btn").forEach((b) =>
        b.addEventListener("click", () => {
            S.dialog(
                b.dataset.integration + " · integration preview",
                `<p>This interface supports ${S.escape(b.dataset.integration.toLowerCase())}. Connect a real service and secure backend to enable it. No account, payment or message has been created.</p><p class="dashboard-row"><button class="btn" onclick="document.getElementById('app-dialog').close()">Got it</button></p>`,
            );
        }),
    );
    document.querySelectorAll("[data-period]").forEach((b) =>
        b.addEventListener("click", () => {
            const quarterly = b.dataset.period === "quarterly";
            document.querySelectorAll("[data-period]").forEach((x) => {
                x.classList.toggle("active", x === b);
                x.setAttribute("aria-pressed", String(x === b));
            });
            document.querySelectorAll("[data-monthly]").forEach((p) => {
                p.textContent =
                    "$" +
                    (quarterly
                        ? Number(p.dataset.monthly) * 3 * 0.9
                        : Number(p.dataset.monthly)
                    ).toFixed(quarterly ? 2 : 0);
            });
            document.querySelectorAll(".price-period").forEach((p) => {
                p.textContent = quarterly ? " / quarter" : " / month";
            });
        }),
    );
    const back = document.querySelector(".back-top");
    if (back) {
        window.addEventListener(
            "scroll",
            () => {
                back.hidden = scrollY < 600;
            },
            { passive: true },
        );
        back.addEventListener("click", () =>
            scrollTo({
                top: 0,
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth",
            }),
        );
    }
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(location.href);
            S.toast("Article link copied.");
        } catch {
            S.dialog(
                "Copy article link",
                `<input aria-label="Article URL" readonly value="${S.escape(location.href)}">`,
            );
        }
    };
    document.querySelector("[data-copy]")?.addEventListener("click", copy);
    document.querySelector("[data-share]")?.addEventListener("click", async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: document.title, url: location.href });
            } catch {}
        } else await copy();
    });
    const countdown = document.querySelector("[data-countdown]");
    if (countdown) {
        let end = S.storage.get("countdown");
        if (!end || end < Date.now()) {
            end = Date.now() + 30 * 86400000;
            S.storage.set("countdown", end);
        }
        const update = () => {
            const t = Math.max(0, end - Date.now());
            const values = {
                days: Math.floor(t / 86400000),
                hours: Math.floor(t / 3600000) % 24,
                minutes: Math.floor(t / 60000) % 60,
                seconds: Math.floor(t / 1000) % 60,
            };
            for (const [key, v] of Object.entries(values))
                countdown.querySelector(`[data-${key}]`).textContent = String(v).padStart(2, "0");
        };
        update();
        setInterval(update, 1000);
    }
})();
