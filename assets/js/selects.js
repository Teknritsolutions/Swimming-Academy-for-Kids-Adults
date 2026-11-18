/* Branded dropdowns retain native select values and form validation. */
(() => {
    const widgets = new Map();
    let opened = null;
    let sequence = 0;
    function enhance(select) {
        if (widgets.has(select) || select.multiple || select.size > 1) return;
        const id = select.id || (select.id = `select-${++sequence}`);
        const shell = document.createElement("div");
        shell.className = "select-shell";
        select.before(shell);
        shell.append(select);
        select.classList.add("select-native");
        select.tabIndex = -1;
        select.setAttribute("aria-hidden", "true");
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.id = `${id}-trigger`;
        trigger.className = "select-trigger";
        trigger.setAttribute("role", "combobox");
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML = `<span id="${id}-value"></span><svg class="lucide select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
        const label = select.labels?.[0];
        if (label) {
            label.id ||= `${id}-label`;
            trigger.setAttribute("aria-labelledby", `${label.id} ${id}-value`);
        } else
            trigger.setAttribute(
                "aria-label",
                select.getAttribute("aria-label") || select.name || "Choose an option",
            );
        const menu = document.createElement("div");
        menu.id = `${id}-options`;
        menu.className = "select-menu";
        menu.setAttribute("role", "listbox");
        menu.setAttribute("aria-label", label?.textContent.trim() || "Options");
        menu.hidden = true;
        if (typeof menu.showPopover === "function") menu.setAttribute("popover", "manual");
        (select.closest("dialog") || document.body).append(menu);
        trigger.setAttribute("aria-controls", menu.id);
        const error = document.createElement("div");
        error.id = `${id}-select-error`;
        error.className = "select-error";
        error.hidden = true;
        error.setAttribute("role", "alert");
        shell.append(trigger, error);
        let active = -1;
        let search = "";
        let searchTimer;
        const widget = { select, trigger, menu, close, refresh, position };
        widgets.set(select, widget);
        function refresh() {
            trigger.firstElementChild.textContent =
                select.selectedOptions[0]?.label || "Choose an option";
            trigger.disabled = select.disabled;
            trigger.setAttribute("aria-required", String(select.required));
            menu.replaceChildren(
                ...[...select.options].map((option, index) => {
                    const row = document.createElement("div");
                    row.className = "select-option";
                    row.id = `${id}-option-${index}`;
                    row.dataset.index = index;
                    row.textContent = option.label;
                    row.setAttribute("role", "option");
                    row.setAttribute("aria-selected", String(option.selected));
                    row.setAttribute(
                        "aria-disabled",
                        String(option.disabled || option.parentElement.disabled),
                    );
                    return row;
                }),
            );
            if (select.validity.valid) {
                trigger.removeAttribute("aria-invalid");
                error.hidden = true;
                trigger.removeAttribute("aria-describedby");
            }
            active = -1;
            trigger.removeAttribute("aria-activedescendant");
            if (opened === widget) position();
        }
        function position() {
            const rect = trigger.getBoundingClientRect();
            const below = innerHeight - rect.bottom - 12;
            const above = rect.top - 12;
            const up = below < 180 && above > below;
            const height = Math.max(80, Math.min(280, up ? above : below));
            const width = Math.min(Math.max(rect.width, 180), innerWidth - 24);
            const left = document.documentElement.dir === "rtl" ? rect.right - width : rect.left;
            Object.assign(menu.style, {
                width: `${width}px`,
                maxHeight: `${height}px`,
                left: `${Math.max(12, Math.min(left, innerWidth - width - 12))}px`,
                top: "auto",
                bottom: "auto",
            });
            if (up) menu.style.bottom = `${innerHeight - rect.top + 6}px`;
            else menu.style.top = `${rect.bottom + 6}px`;
        }
        function close() {
            if (menu.matches(":popover-open")) menu.hidePopover();
            menu.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
            trigger.removeAttribute("aria-activedescendant");
            menu.querySelectorAll(".is-highlighted").forEach((row) =>
                row.classList.remove("is-highlighted"),
            );
            active = -1;
            if (opened === widget) opened = null;
        }
        function open() {
            if (select.disabled) return;
            opened?.close();
            refresh();
            opened = widget;
            menu.hidden = false;
            if (menu.hasAttribute("popover")) menu.showPopover();
            trigger.setAttribute("aria-expanded", "true");
            position();
        }
        function highlight(index) {
            const rows = [...menu.children];
            rows.forEach((row) => row.classList.remove("is-highlighted"));
            active = index;
            const row = rows[index];
            if (!row) return;
            row.classList.add("is-highlighted");
            trigger.setAttribute("aria-activedescendant", row.id);
            row.scrollIntoView({ block: "nearest" });
        }
        function choose(index) {
            if (select.options[index]?.disabled || select.options[index]?.parentElement.disabled)
                return;
            select.selectedIndex = index;
            select.dispatchEvent(new Event("input", { bubbles: true }));
            select.dispatchEvent(new Event("change", { bubbles: true }));
            refresh();
            close();
            trigger.focus({ preventScroll: true });
        }
        trigger.addEventListener("click", () => (opened === widget ? close() : open()));
        trigger.addEventListener("blur", close);
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Tab") return close();
            if (event.key === "Escape") {
                event.preventDefault();
                return close();
            }
            if (["Enter", " "].includes(event.key)) {
                event.preventDefault();
                if (opened !== widget) open();
                else if (active >= 0) choose(active);
                else close();
                return;
            }
            const enabled = [...menu.children].filter(
                (row) => row.getAttribute("aria-disabled") !== "true",
            );
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                if (opened !== widget) open();
                let next = enabled.findIndex((row) => Number(row.dataset.index) === active);
                if (event.key === "Home") next = 0;
                else if (event.key === "End") next = enabled.length - 1;
                else if (next < 0) next = event.key === "ArrowDown" ? 0 : enabled.length - 1;
                else
                    next =
                        (next + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) %
                        enabled.length;
                if (enabled[next]) highlight(Number(enabled[next].dataset.index));
                return;
            }
            if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                if (opened !== widget) open();
                search += event.key.toLowerCase();
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => (search = ""), 700);
                const match = enabled.find((row) =>
                    row.textContent.toLowerCase().startsWith(search),
                );
                if (match) highlight(Number(match.dataset.index));
            }
        });
        menu.addEventListener("pointerdown", (event) => event.preventDefault());
        menu.addEventListener("pointermove", () => {
            menu.querySelectorAll(".is-highlighted").forEach((row) =>
                row.classList.remove("is-highlighted"),
            );
            trigger.removeAttribute("aria-activedescendant");
            active = -1;
        });
        menu.addEventListener("click", (event) => {
            const row = event.target.closest(".select-option");
            if (row && row.getAttribute("aria-disabled") !== "true")
                choose(Number(row.dataset.index));
        });
        select.addEventListener("change", refresh);
        select.addEventListener("focus", () => trigger.focus());
        select.addEventListener("invalid", (event) => {
            event.preventDefault();
            trigger.setAttribute("aria-invalid", "true");
            trigger.setAttribute("aria-describedby", error.id);
            error.textContent = select.validationMessage;
            error.hidden = false;
            trigger.focus();
        });
        refresh();
    }
    function scan(root) {
        if (root instanceof HTMLSelectElement) enhance(root);
        root.querySelectorAll?.("select").forEach(enhance);
    }
    scan(document);
    new MutationObserver((changes) => {
        for (const change of changes) {
            const select =
                change.target instanceof HTMLSelectElement
                    ? change.target
                    : change.target.parentElement?.closest("select");
            if (select) widgets.get(select)?.refresh();
            change.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && !node.closest(".select-menu")) scan(node);
            });
        }
        for (const [select, widget] of widgets)
            if (!select.isConnected) {
                widget.close();
                widget.menu.remove();
                widgets.delete(select);
            }
    }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled", "required", "selected"],
    });
    document.addEventListener("pointerdown", (event) => {
        if (opened && !opened.trigger.contains(event.target) && !opened.menu.contains(event.target))
            opened.close();
    });
    document.addEventListener("reset", () =>
        setTimeout(() => widgets.forEach((widget) => widget.refresh()), 0),
    );
    document.addEventListener("appearancechange", () => opened?.close());
    addEventListener("resize", () => opened?.position());
    addEventListener(
        "scroll",
        (event) => {
            if (opened && !opened.menu.contains(event.target)) {
                const rect = opened.trigger.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > innerHeight) opened.close();
                else opened.position();
            }
        },
        true,
    );
})();
