import fs from "node:fs/promises";
const sources = {
    "bootstrap-LICENSE.txt": "https://raw.githubusercontent.com/twbs/bootstrap/v5.3.3/LICENSE",
    "chartjs-LICENSE.md": "https://raw.githubusercontent.com/chartjs/Chart.js/v4.4.8/LICENSE.md",
    "lucide-LICENSE.txt": "https://raw.githubusercontent.com/lucide-icons/lucide/0.468.0/LICENSE",
    "plus-jakarta-sans-OFL.txt":
        "https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/OFL.txt",
};
for (const [name, url] of Object.entries(sources)) {
    const r = await fetch(url);
    if (!r.ok) throw Error(url + " " + r.status);
    await fs.writeFile("third-party/" + name, await r.text());
    console.log(name);
}
