// Builds the site map in about.html (between the site-map:start and site-map:end comments).
// It lists every page of the site, grouped with the help of data/site.js and data/topics.js.
// Run with: node tools/build-sitemap.mjs
// tools/check.mjs fails if the site map is out of date, or if a page is missing from it.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = "about.html";
const START = "<!-- site-map:start -->";
const END = "<!-- site-map:end -->";
// Pages that are not for readers, so they are left out of the site map.
const LEFT_OUT = new Set(["404.html", "styleguide.html"]);
const SKIP_DIRS = new Set([".git", "node_modules", "tools", ".github"]);

function loadRegistry() {
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const file of ["data/site.js", "data/topics.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
  }
  return ctx.DBMS;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(path.relative(ROOT, full).split(path.sep).join("/"));
  }
  return out;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const exists = (href) => fs.existsSync(path.join(ROOT, href));
const titleOf = (href) => {
  const m = fs.readFileSync(path.join(ROOT, href), "utf8").match(/<title>([^<|]+)/);
  return m ? m[1].trim() : href;
};

export function buildSitemap() {
  const D = loadRegistry();
  const pages = D.pages.filter((p) => p.status === "published");
  const listed = new Set();
  const link = (href, text) => {
    if (!exists(href)) throw new Error(`the site map links to ${href}, which does not exist`);
    listed.add(href);
    return `<a href="${href}">${esc(text)}</a>`;
  };
  const item = (href, text, num) =>
    `<li>${num ? `<span class="site-map-num">${esc(num)}</span>` : ""}${link(href, text)}</li>`;
  const group = (cls, head, items, tag = "ul") =>
    `            <div class="site-map-group${cls ? " " + cls : ""}">\n` +
    `              <h4>${head}</h4>\n` +
    `              <${tag} class="site-map-list">\n${items.map((x) => "                " + x).join("\n")}\n              </${tag}>\n` +
    `            </div>`;
  const grid = (groups) => `          <div class="site-map-grid">\n${groups.join("\n")}\n          </div>`;

  // Main pages: the published pages at the top level of the site.
  const main = pages.filter((p) => !p.href.includes("/")).map((p) => item(p.href, p.title));

  // Units: the unit page, then each published topic in order.
  const units = D.units.map((u) =>
    group(`u-${u.n}`, link(`units/${u.slug}/index.html`, `Unit ${u.roman}: ${u.title}`),
      D.topics.filter((t) => t.unit === u.n && t.status === "published")
        .map((t) => item(`units/${u.slug}/${t.slug}.html`, t.title, t.id)), "ol"));

  // Study tools: each hub in the menu, then its page for each unit.
  const hubs = pages.filter((p) => /^[a-z-]+\/index\.html$/.test(p.href) && p.id !== "labs").map((p) => {
    const dir = p.href.split("/")[0];
    const items = D.units.filter((u) => exists(`${dir}/${u.slug}.html`))
      .map((u) => item(`${dir}/${u.slug}.html`, titleOf(`${dir}/${u.slug}.html`)));
    return group("", link(p.href, p.title), items);
  });

  // Labs: the labs page, each exercise, and the files to download.
  const labsPage = pages.find((p) => p.id === "labs");
  const labItems = D.labs.map((l) => item(`labs/${l.slug}.html`, `Exercise ${l.n}: ${l.short}`));
  const downloads = walk(path.join(ROOT, "labs", "files")).sort()
    .map((f) => item(f, `Starter script: ${path.basename(f)}`));
  const labs = group("", link(labsPage.href, labsPage.title), [...labItems, ...downloads], "ol");

  // Every reader's page on the site must be in the map.
  const missing = walk(ROOT).filter((f) => f.endsWith(".html") && !LEFT_OUT.has(f) && !listed.has(f));
  if (missing.length) throw new Error(`these pages are not in the site map: ${missing.join(", ")}`);
  const count = [...listed].filter((f) => f.endsWith(".html")).length;

  const block = [
    START,
    `        <section class="section site-map" aria-labelledby="site-map-title">`,
    `          <h2 id="site-map-title">Site map</h2>`,
    `          <p>Every page on this site, ${count} pages in all.</p>`,
    `          <h3>Main pages</h3>`,
    `          <ul class="site-map-list site-map-main">`,
    ...main.map((x) => "            " + x),
    `          </ul>`,
    `          <h3>Units and topics</h3>`,
    grid(units),
    `          <h3>Study tools</h3>`,
    grid(hubs),
    `          <h3>Lab exercises</h3>`,
    grid([labs]),
    `        </section>`,
    `        ${END}`
  ].join("\n");

  const html = fs.readFileSync(path.join(ROOT, PAGE), "utf8");
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < a) throw new Error(`${PAGE} has no ${START} ... ${END} block`);
  return { [PAGE]: html.slice(0, a) + block + html.slice(b + END.length) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const [file, html] of Object.entries(buildSitemap())) {
    fs.writeFileSync(path.join(ROOT, file), html);
    console.log(`wrote ${file}`);
  }
}
