(() => {
    document.querySelectorAll("[data-filter-controls]").forEach((controls) => {
        const name = controls.dataset.filterControls;
        const results = document.querySelector(`[data-filter-results="${name}"]`);
        if (!results) return;
        const items = [...results.querySelectorAll(".filter-item")];
        let page = 1;
        function update() {
            const query =
                controls.querySelector('input[type="search"]')?.value.trim().toLowerCase() || "";
            const fields = [...controls.querySelectorAll("[data-filter-key]")];
            let count = 0;
            items.forEach((item, i) => {
                const match =
                    (!query ||
                        (item.dataset.search || item.textContent.toLowerCase()).includes(query)) &&
                    fields.every(
                        (field) =>
                            !field.value ||
                            item.dataset[field.dataset.filterKey] === field.value ||
                            item.dataset[field.dataset.filterKey] === "all" ||
                            (item.dataset[field.dataset.filterKey] || "")
                                .split(/\s+/)
                                .includes(field.value),
                    );
                item.hidden =
                    !match ||
                    (name === "articles" &&
                        !query &&
                        !fields.some((f) => f.value) &&
                        (page === 1 ? i > 1 : i < 2));
                if (!item.hidden) count++;
            });
            const empty = results.querySelector(".empty-state");
            if (empty) empty.hidden = count > 0;
            const countLabel = document.querySelector(`[data-result-count="${name}"]`);
            if (countLabel)
                countLabel.textContent = `${count} ${count === 1 ? "result" : "results"} shown`;
            if (name === "articles") {
                const filtered = Boolean(query || fields.some((field) => field.value));
                const pagination = document.querySelector('[aria-label="Article pagination"]');
                if (pagination) pagination.hidden = filtered;
                document.getElementById("article-page-status").textContent = filtered
                    ? `${count} matching ${count === 1 ? "article" : "articles"}`
                    : `Page ${page} of 2`;
                document.querySelectorAll("[data-page-number]").forEach((b) => {
                    if (Number(b.dataset.pageNumber) === page)
                        b.setAttribute("aria-current", "page");
                    else b.removeAttribute("aria-current");
                });
            }
        }
        controls.addEventListener("input", () => {
            page = 1;
            update();
        });
        controls.querySelector(".filter-reset")?.addEventListener("click", () => {
            controls.querySelectorAll("select,input").forEach((x) => {
                x.value = "";
                if (x.tagName === "SELECT") x.dispatchEvent(new Event("change", { bubbles: true }));
            });
            page = 1;
            update();
        });
        if (name === "articles")
            document.querySelectorAll("[data-page-number]").forEach((b) =>
                b.addEventListener("click", () => {
                    page = Number(b.dataset.pageNumber);
                    update();
                }),
            );
        update();
    });
})();
