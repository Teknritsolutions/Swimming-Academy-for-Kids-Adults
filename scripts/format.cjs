const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
async function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (
            e.name === "dist" ||
            e.name === "node_modules" ||
            e.name === ".git" ||
            e.name === "vendor" ||
            e.name === "third-party"
        )
            continue;
        const f = path.join(dir, e.name);
        if (e.isDirectory()) await walk(f);
        else if (/\.(html|css|js|mjs|cjs|json)$/.test(f) && !f.includes("generated-assets")) {
            try {
                const input = fs.readFileSync(f, "utf8").replace(/^\uFEFF/, "");
                const output = await prettier.format(input, {
                    filepath: f,
                    tabWidth: 4,
                    useTabs: false,
                    printWidth: 100,
                    htmlWhitespaceSensitivity: "ignore",
                    endOfLine: "lf",
                });
                fs.writeFileSync(f, output);
            } catch (e) {
                console.log("format error", f, e.message);
                process.exitCode = 1;
            }
        }
    }
}
walk(".").then(() => console.log("Formatted readable project source."));
