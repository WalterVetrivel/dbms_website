// Builds the unit revision sheets (revision/unit-1.html to unit-5.html) from the
// "Key points" section of each published topic page, so each key point is written once.
// Run with: node tools/build-revision.mjs
// tools/check.mjs fails if a sheet is out of date with its topic pages.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadRegistry() {
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const file of ["data/site.js", "data/topics.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
  }
  return ctx.DBMS;
}

const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Links in a key point are relative to its topic page; make them work from revision/.
function fixLinks(html, unitSlug, topicFile) {
  return html.replace(/\shref="([^"]+)"/g, (m, href) => {
    if (/^(https?:|mailto:)/.test(href)) return m;
    if (href.startsWith("#")) return ` href="../units/${unitSlug}/${topicFile}${href}"`;
    return ` href="${path.posix.normalize(`../units/${unitSlug}/${href}`)}"`;
  });
}

// The bullets and callouts of one topic's Key points section.
function keyPoints(html, where) {
  const section = (html.match(/<section id="key-points"[\s\S]*?<\/section>/) || [])[0];
  if (!section) throw new Error(`${where}: no Key points section`);
  const bullets = [...section.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1].trim());
  if (!bullets.length) throw new Error(`${where}: Key points has no bullets`);
  const callouts = [...section.matchAll(/<div class="callout callout-([a-z]+)">\s*<div class="callout-title">([\s\S]*?)<\/div>([\s\S]*?)<\/div>/g)].map((m) => ({
    kind: m[1],
    title: m[2].trim(),
    body: [...m[3].matchAll(/<p>([\s\S]*?)<\/p>/g)].map((p) => p[1].trim()).join(" ")
  }));
  return { bullets, callouts };
}

const HEAD = (title, desc) => `<!doctype html>
<html lang="en">
<head>
  <!-- Built by tools/build-revision.mjs from the Key points of each topic page. Edit the topic pages, then run the script again. -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | DBMS Study Guide</title>
  <meta name="description" content="${escAttr(desc)}">
  <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;600&amp;display=swap">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/layout.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="../assets/css/print.css" media="print">
  <script>try{var t=localStorage.getItem("dbms-theme");if(t)document.documentElement.setAttribute("data-theme",JSON.parse(t))}catch(e){}</script>
</head>
`;

function sheet(D, u) {
  const topics = D.topics.filter((t) => t.unit === u.n && t.status === "published");
  if (!topics.length) return null;
  const blocks = topics.map((t) => {
    const file = `${t.slug}.html`;
    const where = `units/${u.slug}/${file}`;
    const { bullets, callouts } = keyPoints(fs.readFileSync(path.join(ROOT, where), "utf8"), where);
    const anchor = "t" + t.id.replace(".", "-");
    const lines = [
      `          <section class="rev-topic" id="${anchor}" aria-labelledby="${anchor}-title">`,
      `            <h2 id="${anchor}-title"><a href="../units/${u.slug}/${file}"><span class="rev-num">${t.id}</span> ${escText(t.title)}</a></h2>`,
      "            <ul>",
      ...bullets.map((b) => `              <li>${fixLinks(b, u.slug, file)}</li>`),
      "            </ul>",
      ...callouts.map((c) => `            <p class="rev-callout rev-${c.kind}"><strong>${c.title}:</strong> ${fixLinks(c.body, u.slug, file)}</p>`),
      "          </section>"
    ];
    return lines.join("\n");
  });
  const all = topics.length === D.topics.filter((t) => t.unit === u.n).length;
  const count = all ? `all ${topics.length} topics` : `the ${topics.length} topics written so far`;
  return (
    HEAD(`Unit ${u.roman} Revision Sheet`, `The key points of every Unit ${u.roman} topic (${u.title}) on one sheet that prints on about two A4 pages.`) +
    `<body data-root="../" data-page="revision" data-unit="${u.n}" data-sidebar="static">
  <a class="skip-link" href="#main">Skip to main content</a>
  <header id="site-header" class="site-header"></header>
  <div class="page">
    <main id="main" class="main" tabindex="-1">
      <div class="content content-wide">
        <nav id="breadcrumbs" class="breadcrumbs"></nav>
        <header class="u-${u.n} rev-head">
          <span class="eyebrow">Unit ${u.roman}: ${escText(u.title)}</span>
          <h1>Unit ${u.roman} Revision Sheet</h1>
          <p class="lead">The key points of ${count} in one place. Read it the day before the exam, or print it on about two A4 pages.</p>
        </header>

        <div class="btn-row no-print">
          <button type="button" class="btn btn-primary" data-print>Print the sheet</button>
          <a class="btn" href="../quizzes/${u.slug}.html">Take the Unit ${u.roman} quiz</a>
          <a class="btn" href="../question-bank/${u.slug}.html">Unit ${u.roman} question bank</a>
        </div>

        <div class="rev-sheet u-${u.n}">
${blocks.join("\n")}
        </div>
      </div>
    </main>
  </div>
  <footer id="site-footer" class="site-footer"></footer>
  <script src="../data/site.js"></script>
  <script src="../data/topics.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/revision.js"></script>
</body>
</html>
`
  );
}

// Returns { "revision/unit-1.html": html, ... } for every unit with published topics.
export function buildRevision() {
  const D = loadRegistry();
  const out = {};
  for (const u of D.units) {
    const html = sheet(D, u);
    if (html) out[`revision/${u.slug}.html`] = html;
  }
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const [file, html] of Object.entries(buildRevision())) {
    fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, file), html);
    console.log(`wrote ${file}`);
  }
}
