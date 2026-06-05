// Custom server untuk cPanel / Domainesia (Phusion Passenger).
// Passenger menjalankan file ini sebagai startup file dan menyuntik PORT lewat env.
// Next.js dijalankan secara programatik agar bind ke port tersebut.

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = process.env.PORT || 3000;
const hostname = process.env.HOST || "0.0.0.0";

// Pastikan produksi. distDir mengikuti next.config.mjs (NEXT_DIST_DIR || ".next").
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Linkatalog ready on http://${hostname}:${port}`);
  });
});
