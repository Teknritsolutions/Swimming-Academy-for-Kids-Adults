(() => {
    const S = window.Orynwave;
    const sidebar = document.querySelector(".sidebar");
    const toggle = document.querySelector(".sidebar-toggle");
    const closeSidebar = () => {
        sidebar?.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
    };
    toggle?.addEventListener("click", () => {
        const open = sidebar.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        if (open) sidebar.querySelector("a")?.focus();
    });
    document.querySelector(".sidebar-close")?.addEventListener("click", closeSidebar);
    // Do not leave an off-canvas focus trap active after changing orientation.
    matchMedia("(max-width: 1023px)").addEventListener("change", closeSidebar);
    document
        .querySelectorAll('.sidebar a[href$="#batch-enrollment"]')
        .forEach((link) => link.addEventListener("click", closeSidebar));
    const enrollmentSection = document.getElementById("batch-enrollment");
    if (enrollmentSection) {
        const overviewLink = sidebar?.querySelector('a[href="index.html"]');
        const enrollmentLink = sidebar?.querySelector('a[href="index.html#batch-enrollment"]');
        const syncSection = () => {
            const enrolling = location.hash === "#batch-enrollment";
            overviewLink?.classList.toggle("active", !enrolling);
            enrollmentLink?.classList.toggle("active", enrolling);
            overviewLink?.removeAttribute("aria-current");
            enrollmentLink?.removeAttribute("aria-current");
            (enrolling ? enrollmentLink : overviewLink)?.setAttribute(
                "aria-current",
                enrolling ? "location" : "page",
            );
        };
        syncSection();
        addEventListener("hashchange", syncSection);
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeSidebar();
            toggle?.focus();
        }
        if (e.key === "Tab" && sidebar?.classList.contains("is-open")) {
            const controls = [...sidebar.querySelectorAll("a,button")];
            const first = controls[0],
                last = controls.at(-1);
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
    document.addEventListener("click", (e) => {
        if (
            sidebar?.classList.contains("is-open") &&
            !sidebar.contains(e.target) &&
            !toggle?.contains(e.target)
        )
            closeSidebar();
    });
    document.querySelectorAll("[data-logout]").forEach((a) =>
        a.addEventListener("click", () => {
            S.storage.remove("demo-role");
        }),
    );
    const read = S.storage.get("read-notices", []);
    document.querySelectorAll("[data-notice-id]").forEach((el) => {
        if (read.includes(el.dataset.noticeId)) {
            el.dataset.read = "true";
            el.querySelector("button").textContent = "Mark as unread";
        }
    });
    function setRead(el, value) {
        el.dataset.read = String(value);
        el.querySelector("button").textContent = value ? "Mark as unread" : "Mark as read";
        let ids = S.storage.get("read-notices", []).filter((x) => x !== el.dataset.noticeId);
        if (value) ids.push(el.dataset.noticeId);
        S.storage.set("read-notices", ids);
    }
    document.querySelectorAll(".mark-read").forEach((b) =>
        b.addEventListener("click", () => {
            const item = b.closest("[data-notice-id]");
            setRead(item, item.dataset.read !== "true");
        }),
    );
    document.querySelector(".mark-all-read")?.addEventListener("click", () => {
        document.querySelectorAll("[data-notice-id]").forEach((x) => setRead(x, true));
        S.toast("All notifications marked as read.");
    });
    document.querySelectorAll(".batch-enroll").forEach((button) =>
        button.addEventListener("click", () => {
            const box = document.getElementById("member-enrollment-confirmation");
            box.innerHTML = `<span class="eyebrow">Review your selection</span><h3>${S.escape(button.dataset.batch)}</h3><p>Your batch selection will be saved on this device. It does not reserve a seat or collect payment.</p><div class="actions dashboard-row"><label class="checkbox"><input type="checkbox" id="batch-ack">I understand this request does not reserve a place.</label><button class="btn" id="confirm-batch">Save request</button></div><p class="form-feedback" role="status"></p>`;
            box.querySelector("#confirm-batch").addEventListener("click", () => {
                if (!box.querySelector("#batch-ack").checked) {
                    box.querySelector(".form-feedback").textContent =
                        "Please acknowledge that this request does not reserve a place.";
                    return;
                }
                S.storage.set("member-batch-id", button.dataset.batch);
                box.querySelector(".form-feedback").textContent =
                    "Batch request saved on this device. No place has been reserved.";
            });
            box.scrollIntoView({ block: "center", behavior: "smooth" });
        }),
    );
    const savedBatch = S.storage.get("member-batch-id");
    const confirmation = document.getElementById("member-enrollment-confirmation");
    if (
        confirmation &&
        [...document.querySelectorAll(".batch-enroll")].some(
            (button) => button.dataset.batch === savedBatch,
        )
    ) {
        confirmation.innerHTML = `<span class="eyebrow">Saved request</span><h3>${S.escape(savedBatch)}</h3><p>Your request is saved on this device. No place has been reserved and no payment has been collected.</p>`;
    }
    const manage = document.querySelector("[data-manage]");
    function tableFilter() {
        if (!manage) return;
        const query = document.querySelector("[data-table-search]").value.toLowerCase();
        const status = document.querySelector("[data-table-status]").value;
        let count = 0;
        manage.querySelectorAll("tbody tr").forEach((row) => {
            const cells = row.querySelectorAll("td[data-col]");
            const match =
                row.textContent.toLowerCase().includes(query) &&
                (!status || cells[cells.length - 1].textContent.trim() === status);
            row.hidden = !match;
            if (match) count++;
        });
        document.querySelector("[data-table-count]").textContent =
            `${count} ${count === 1 ? "record" : "records"} shown`;
        document.querySelector("[data-table-empty]").hidden = count > 0;
    }
    document.querySelector("[data-table-search]")?.addEventListener("input", tableFilter);
    document.querySelector("[data-table-status]")?.addEventListener("change", tableFilter);
    function restoreStatus() {
        const state = S.storage.get("record-statuses", {});
        document.querySelectorAll("[data-record]").forEach((row) => {
            if (state[row.dataset.record]) {
                const cells = row.querySelectorAll("td[data-col]");
                cells[cells.length - 1].innerHTML =
                    `<span class="badge">${S.escape(state[row.dataset.record])}</span>`;
            }
        });
    }
    function saveStatus(row, value) {
        const status = S.storage.get("record-statuses", {});
        status[row.dataset.record] = value;
        S.storage.set("record-statuses", status);
        const cells = row.querySelectorAll("td[data-col]");
        cells[cells.length - 1].innerHTML = `<span class="badge">${S.escape(value)}</span>`;
        tableFilter();
    }
    function recordEditor(kind, row = null) {
        const headers = JSON.parse(manage.dataset.headers);
        const values = row
            ? [...row.querySelectorAll("td[data-col]")].map((c) => c.textContent.trim())
            : headers.map(() => "");
        const lastOptions = {
            members: ["Active", "Pending", "Paused"],
            coaches: ["Active", "Unavailable"],
            programs: ["Active", "Paused"],
            batches: ["1", "2", "3", "4", "5", "6", "7", "8"],
            enrollments: ["Pending", "Approved", "Declined"],
            attendance: ["Present", "Absent"],
        };
        const controls = headers
            .map(
                (h, i) =>
                    `<div class="field"><label for="edit-${i}">${S.escape(h)}</label>${i === headers.length - 1 ? `<select id="edit-${i}" name="c${i}" required>${lastOptions[kind].map((v) => `<option ${v === values[i] ? "selected" : ""}>${v}</option>`).join("")}</select>` : `<input id="edit-${i}" name="c${i}" placeholder="Enter ${h.toLowerCase()}" value="${S.escape(values[i])}" required>`}</div>`,
            )
            .join("");
        S.dialog(
            `${row ? "Edit" : "Add"} ${{ batches: "batch", coaches: "coach", attendance: "attendance record" }[kind] || kind.replace(/s$/, "")}`,
            `<p>Changes to names and details stay in this session only. Record status changes are saved locally.</p><form id="record-form" class="dashboard-row">${controls}<button class="btn">Save record</button><p class="form-feedback" role="status"></p></form>`,
        );
        document.getElementById("record-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            if (!form.reportValidity()) return;
            const vals = headers.map((_, i) => form.elements["c" + i].value);
            if (row) {
                row.querySelectorAll("td[data-col]").forEach((cell, i) => {
                    cell.innerHTML =
                        i === vals.length - 1
                            ? `<span class="badge">${S.escape(vals[i])}</span>`
                            : S.escape(vals[i]);
                });
                saveStatus(row, vals.at(-1));
            } else {
                const record = document.createElement("tr");
                record.dataset.record = `${kind}-new-${Date.now()}`;
                record.innerHTML =
                    vals
                        .map(
                            (v, i) =>
                                `<td data-col="${i}">${i === vals.length - 1 ? `<span class="badge">${S.escape(v)}</span>` : S.escape(v)}</td>`,
                        )
                        .join("") +
                    `<td><button class="btn btn-secondary btn-sm manage-edit" data-kind="${kind}">Edit</button>${kind === "enrollments" ? '<button class="btn btn-sm approve-enrollment">Approve</button>' : ""}${kind === "attendance" ? '<button class="btn btn-sm toggle-attendance">Toggle</button>' : ""}</td>`;
                manage.querySelector("tbody").append(record);
            }
            document.getElementById("app-dialog").close();
            tableFilter();
            S.toast("Record updated for this session. Personal details are not persisted.");
        });
    }
    document
        .querySelector(".manage-add")
        ?.addEventListener("click", (e) => recordEditor(e.currentTarget.dataset.kind));
    manage?.addEventListener("click", (e) => {
        const edit = e.target.closest(".manage-edit");
        if (edit) recordEditor(edit.dataset.kind, edit.closest("tr"));
        const approve = e.target.closest(".approve-enrollment");
        if (approve) {
            saveStatus(approve.closest("tr"), "Approved");
            S.toast("Approval status saved on this device. No reservation has been made.");
        }
        const toggle = e.target.closest(".toggle-attendance");
        if (toggle) {
            const row = toggle.closest("tr");
            const cells = row.querySelectorAll("[data-col]");
            saveStatus(
                row,
                cells[cells.length - 1].textContent.trim() === "Present" ? "Absent" : "Present",
            );
            S.toast("Attendance updated on this device.");
        }
    });
    restoreStatus();
    tableFilter();
    const paymentStates = S.storage.get("payment-states", {});
    document.querySelectorAll("[data-payment]").forEach((row) => {
        if (paymentStates[row.dataset.payment])
            row.querySelector(".payment-status").textContent = paymentStates[row.dataset.payment];
    });
    document.querySelectorAll(".payment-status-btn").forEach((button) =>
        button.addEventListener("click", () => {
            const row = button.closest("tr");
            const badge = row.querySelector(".payment-status");
            badge.textContent = badge.textContent === "Paid" ? "Pending" : "Paid";
            paymentStates[row.dataset.payment] = badge.textContent;
            S.storage.set("payment-states", paymentStates);
            S.toast("Payment status updated on this device. No money was processed.");
        }),
    );
    document.querySelectorAll(".invoice-btn").forEach((button) =>
        button.addEventListener("click", () => {
            const cells = [...button.closest("tr").querySelectorAll("td")]
                .slice(0, 5)
                .map((x) => x.textContent.trim());
            S.dialog(
                "Sample invoice",
                `<span class="eyebrow">Sample invoice</span><h3>${S.escape(cells[0])}</h3><p class="dashboard-row">${S.escape(cells[1])}<br>${S.escape(cells[2])}</p><div class="price">${S.escape(cells[3])}</div><p>Status: ${S.escape(cells[4])}</p><p>For reference only. This is not a tax invoice or payment receipt.</p><button class="btn dashboard-row" id="download-invoice">Download sample invoice</button>`,
            );
            document.getElementById("download-invoice").addEventListener("click", () => {
                const blob = new Blob(
                    [
                        `ORYNWAVE — SAMPLE INVOICE\n${cells.join("\n")}\nFor reference only. No actual payment was processed.`,
                    ],
                    { type: "text/plain" },
                );
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = cells[0] + "-sample.txt";
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
            });
        }),
    );
    document.querySelectorAll(".message-open").forEach((button) =>
        button.addEventListener("click", () => {
            const box = document.getElementById("message-detail");
            box.innerHTML = `<span class="eyebrow">Sample member inquiry</span><h2>${S.escape(button.dataset.subject)}</h2><p>From ${S.escape(button.dataset.sender)}</p><p>${S.escape(button.dataset.body)}</p><form class="reply-form"><div class="field"><label for="reply-text">Your local reply</label><textarea id="reply-text" placeholder="Write a helpful reply" required minlength="10" rows="5"></textarea></div><button class="btn">Save reply</button><p class="form-feedback" role="status"></p></form>`;
            button.closest(".notice").querySelector(".message-status").textContent = "Read";
            box.querySelector("form").addEventListener("submit", (e) => {
                e.preventDefault();
                if (!e.currentTarget.reportValidity()) return;
                e.currentTarget.querySelector(".form-feedback").textContent =
                    "Reply validated for this session. No message was sent or saved.";
            });
        }),
    );
})();
(() => {
    const table = document.querySelector('[data-manage="attendance"]');
    if (!table) return;
    const filter = document.createElement("div");
    filter.className = "field";
    filter.innerHTML =
        '<label for="attendance-batch">Batch</label><select id="attendance-batch"><option value="">All batches</option></select>';
    const batch = filter.querySelector("select");
    [
        ...new Set(
            [...table.querySelectorAll("tbody tr")].map((row) =>
                row.querySelector('[data-col="1"]').textContent.trim(),
            ),
        ),
    ].forEach((value) => {
        const option = document.createElement("option");
        option.textContent = value;
        batch.append(option);
    });
    document.querySelector(".filter-bar").append(filter);
    batch.addEventListener("change", () => {
        document.querySelector("[data-table-search]").dispatchEvent(new Event("input"));
        let count = 0;
        table.querySelectorAll("tbody tr").forEach((row) => {
            if (
                !row.hidden &&
                batch.value &&
                row.querySelector('[data-col="1"]').textContent.trim() !== batch.value
            )
                row.hidden = true;
            if (!row.hidden) count++;
        });
        document.querySelector("[data-table-count]").textContent = `${count} records shown`;
        document.querySelector("[data-table-empty]").hidden = count > 0;
    });
})();
