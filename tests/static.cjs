const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const pages = JSON.parse(fs.readFileSync("documentation/pages.json", "utf8"));
const images = JSON.parse(fs.readFileSync("assets/image-inventory.json", "utf8"));
const errors = [];
for (const p of [...pages, { file: "index.html" }]) {
    const html = fs.readFileSync(p.file, "utf8");
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url = m[1];
        if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
        const target = path.resolve(path.dirname(p.file), url.split(/[?#]/)[0]);
        if (!fs.existsSync(target)) errors.push(p.file + " -> " + url);
    }
}
const hashes = new Set();
const names = new Set();
for (const im of images) {
    if (names.has(im.name)) errors.push("Repeated image name " + im.name);
    names.add(im.name);
    const hash = crypto
        .createHash("sha256")
        .update(fs.readFileSync("assets/images/" + im.name + ".webp"))
        .digest("hex");
    if (hashes.has(hash)) errors.push("Duplicate image bytes " + im.name);
    hashes.add(hash);
}
console.log(JSON.stringify({ pages: pages.length, uniqueImages: hashes.size, errors }, null, 2));
if (errors.length) process.exitCode = 1;
