import fs from "node:fs";
import path from "node:path";
// Rebuild only the generated deployment directory so removed files cannot linger.
const output = path.resolve("dist");
if (path.dirname(output) !== process.cwd() || path.basename(output) !== "dist")
    throw new Error("Deployment output must stay inside the project.");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of ["index.html", "sitemap.xml", "robots.txt"])
    fs.copyFileSync(file, path.join("dist", file));
for (const dir of ["assets", "pages", "dashboard", "documentation", "third-party"])
    fs.cpSync(dir, path.join("dist", dir), { recursive: true });
fs.writeFileSync("dist/404.html", fs.readFileSync("pages/404.html", "utf8").replaceAll('="../', '="'));
console.log("Prepared static deployment in dist/");
