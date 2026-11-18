(() => {
    const S = window.Orynwave;
    document.querySelectorAll(".password-toggle").forEach((button) =>
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.target);
            const show = input.type === "password";
            input.type = show ? "text" : "password";
            button.setAttribute("aria-label", `${show ? "Hide" : "Show"} password`);
            button.innerHTML = `<i data-lucide="${show ? "eye-off" : "eye"}" aria-hidden="true"></i>`;
            S.icons();
        }),
    );
    document.querySelectorAll(".demo-form").forEach((form) =>
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            form.querySelector(".form-feedback").textContent =
                form.dataset.message || "Your form has been validated. No data was sent.";
            form.reset();
        }),
    );
    let registered = null;
    const register = document.getElementById("register-form");
    register?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const password = document.getElementById("auth-password");
        const confirm = document.getElementById("auth-confirm");
        const feedback = register.querySelector(".form-feedback");
        if (password.value !== confirm.value) {
            confirm.setCustomValidity("Passwords must match.");
            confirm.reportValidity();
            return;
        }
        confirm.setCustomValidity("");
        if (!register.reportValidity()) return;
        // Only an in-memory digest is kept; passwords and contact details are never persisted.
        const digest = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(password.value),
        );
        registered = { email: document.getElementById("auth-email").value, digest };
        register.reset();
        feedback.textContent =
            "Your details have been validated. No account has been created. You can explore the member workspace below.";
        const a = document.createElement("a");
        a.href = "../dashboard/member/index.html";
        a.className = "btn dashboard-row";
        a.textContent = "Open member dashboard";
        feedback.append(document.createElement("br"), a);
    });
    document
        .getElementById("auth-confirm")
        ?.addEventListener("input", (e) => e.target.setCustomValidity(""));
    document.getElementById("login-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const email = document.getElementById("auth-email").value.trim().toLowerCase();
        const password = document.getElementById("auth-password").value;
        if (
            !["member@example.com", "admin@example.com"].includes(email) ||
            password !== "SwimDemo!2026"
        ) {
            form.querySelector(".form-feedback").textContent =
                "Please check your email and password. Workspace access details are available in the project guide.";
            return;
        }
        const role = email.startsWith("admin") ? "admin" : "member";
        if (document.getElementById("remember-me").checked) S.storage.set("demo-role", role);
        location.href = `../dashboard/${role}/index.html`;
    });
    document.querySelectorAll(".profile-form").forEach((form) =>
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!form.reportValidity()) return;
            // Personal details deliberately stay in the DOM for this session only.
            form.querySelector(".form-feedback").textContent =
                "Profile updated for this session. Personal details were not saved in browser storage.";
        }),
    );
    document.querySelectorAll(".preferences-form").forEach((form) => {
        const preferences = S.storage.get("preferences", {});
        for (const key of ["pref-theme", "pref-notify", "pref-other"])
            if (preferences[key]) form.querySelector(`[name="${key}"]`).value = preferences[key];
        form.querySelector('[name="pref-theme"]').value = S.storage.get("theme", "system");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!form.reportValidity()) return;
            const prefs = Object.fromEntries(new FormData(form));
            S.storage.set("preferences", prefs);
            S.applyTheme(prefs["pref-theme"]);
            if (
                prefs["pref-other"] === "Right to left" ||
                prefs["pref-other"] === "Left to right"
            ) {
                document.documentElement.dir =
                    prefs["pref-other"] === "Right to left" ? "rtl" : "ltr";
                S.storage.set("direction", document.documentElement.dir);
                document.dispatchEvent(new Event("appearancechange"));
            }
            form.querySelector(".form-feedback").textContent =
                "Workspace preferences saved in this browser.";
        });
    });
    document.querySelectorAll(".change-password").forEach((form) =>
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const p = form.querySelector('[name="new-pass"]');
            const c = form.querySelector('[name="confirm-pass"]');
            if (p.value !== c.value) {
                c.setCustomValidity("The new passwords must match.");
                c.reportValidity();
                return;
            }
            c.setCustomValidity("");
            if (!form.reportValidity()) return;
            form.reset();
            form.querySelector(".form-feedback").textContent =
                "Password fields validated. No actual password was changed; secure backend integration is required.";
        }),
    );
    document
        .getElementById("confirm-pass")
        ?.addEventListener("input", (e) => e.target.setCustomValidity(""));
})();
(() => {
    document.querySelectorAll("form").forEach((form) => {
        form.addEventListener(
            "invalid",
            (event) => {
                const input = event.target;
                const field = input.closest(".field");
                if (!field) return;
                let error = field.querySelector(".field-error");
                if (!error) {
                    error = document.createElement("span");
                    error.className = "error field-error";
                    error.id = input.id + "-error";
                    field.append(error);
                }
                error.textContent = input.validationMessage;
                input.setAttribute("aria-invalid", "true");
                input.setAttribute("aria-describedby", error.id);
            },
            true,
        );
        form.addEventListener("input", (event) => {
            const input = event.target;
            input.removeAttribute("aria-invalid");
            input.closest(".field")?.querySelector(".field-error")?.remove();
            input.removeAttribute("aria-describedby");
        });
    });
    document.querySelectorAll("main table").forEach((table) => {
        const heads = [...table.querySelectorAll("thead th")].map((th) => th.textContent.trim());
        table.querySelectorAll("tbody tr").forEach((row) =>
            [...row.cells].forEach((cell, i) => {
                cell.dataset.label = heads[i] || "Action";
            }),
        );
    });
})();
(() => {
    const role = window.Orynwave.storage.get("demo-role");
    const input = document.querySelector("#login-form #auth-email");
    if (input && ["member", "admin"].includes(role)) input.value = role + "@example.com";
})();
(() => {
    document.querySelectorAll(".profile-form").forEach((form) => {
        const admin = form.dataset.profileRole === "admin";
        const demo = {
            "profile-name": admin ? "Orynwave Swimming Academy" : "Alex Johnson",
            "profile-email": admin ? "hello@example.com" : "alex@example.com",
            "profile-phone": "+1 (555) 010-2040",
            "profile-program": admin ? "6:00 AM–9:00 PM" : "Adult Foundations",
        };
        Object.entries(demo).forEach(([name, value]) => {
            const input = form.elements[name];
            if (input && !input.value) input.value = value;
        });
    });
})();
