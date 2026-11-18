(() => {
    const S = window.Orynwave;
    const syncControls = () => {
        const rtl = document.documentElement.dir === "rtl";
        document.querySelectorAll(".rtl-toggle").forEach((button) => {
            button.setAttribute("aria-pressed", String(rtl));
            button.setAttribute(
                "aria-label",
                rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout",
            );
        });
    };
    syncControls();
    document.addEventListener("appearancechange", syncControls);
    document.querySelectorAll(".rtl-toggle").forEach((button) =>
        button.addEventListener("click", () => {
            const direction = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
            document.documentElement.dir = direction;
            S.storage.set("direction", direction);
            document.dispatchEvent(new Event("appearancechange"));
            S.toast(
                direction === "rtl"
                    ? "Right-to-left layout enabled."
                    : "Left-to-right layout enabled.",
            );
        }),
    );
})();
