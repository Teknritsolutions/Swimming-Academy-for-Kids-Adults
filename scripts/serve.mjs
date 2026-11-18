import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".xml": "application/xml",
    ".json": "application/json",
};
const server = http.createServer((req, res) => {
    let url;
    try {
        url = decodeURIComponent(req.url.split("?")[0]);
    } catch {
        res.writeHead(400);
        res.end();
        return;
    }
    const file = path.resolve(root, "." + (url.endsWith("/") ? url + "index.html" : url));
    if (!file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
    }
    fs.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(fs.readFileSync(path.join(root, "pages/404.html")));
        } else {
            res.writeHead(200, {
                "Content-Type": types[path.extname(file)] || "application/octet-stream",
                "Cache-Control": "no-cache",
            });
            res.end(data);
        }
    });
});
server.listen(4173, "127.0.0.1", () => console.log("Orynwave preview: http://127.0.0.1:4173"));
