/* Apply appearance before styles load to prevent a theme flash. */
(() => {
    const storage = {
        get(key, fallback = null) {
            try {
                return JSON.parse(localStorage.getItem("orynwave-" + key)) ?? fallback;
            } catch {
                return fallback;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem("orynwave-" + key, JSON.stringify(value));
            } catch {
                /* Private browsing may block storage. */
            }
        },
        remove(key) {
            try {
                localStorage.removeItem("orynwave-" + key);
            } catch {}
        },
    };
    window.Orynwave = { storage };
    const preferred = storage.get("theme", "system");
    document.documentElement.dataset.theme =
        preferred === "system"
            ? matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            : preferred;
    document.documentElement.dir = storage.get("direction", "ltr");
})();
