// Builds the Diagrams and Examples pages (diagrams/index.html and diagrams/unit-1.html
// to unit-5.html) from the list in data/gallery.js. Each item copies its diagrams, queries
// or tables from a topic page, so nothing is drawn twice.
// Run with: node tools/build-gallery.mjs
// tools/check.mjs fails if a page is out of date with data/gallery.js or the topic pages.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const KINDS = [
  { id: "diagram", title: "Diagrams", one: "diagram", many: "diagrams" },
  { id: "query", title: "Queries", one: "query", many: "queries" },
  { id: "example", title: "Worked examples", one: "worked example", many: "worked examples" }
];

function loadRegistry() {
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const file of ["data/site.js", "data/topics.js", "data/gallery.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
  }
  return ctx.DBMS;
}

const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const plain = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const count = (n, k) => `${n} ${n === 1 ? k.one : k.many}`;

// The index just after the element that starts at index i, matching nested tags of the same name.
function elementEnd(html, i, where) {
  const tag = html.slice(i + 1).match(/^[a-z]+/)[0];
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, "g");
  re.lastIndex = i;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (!depth) return m.index + m[0].length;
  }
  throw new Error(`${where}: <${tag}> is not closed`);
}

// The element with the given id, and the topic section it sits in.
function findElement(html, id, where) {
  const at = html.indexOf(` id="${id}"`);
  if (at < 0) throw new Error(`${where}: no element with id "${id}"`);
  const start = html.lastIndexOf("<", at);
  const end = elementEnd(html, start, where);
  let section = null;
  for (const m of html.matchAll(/<section id="([^"]+)"/g)) {
    if (m.index > start) break;
    if (elementEnd(html, m.index, where) > end) section = m;
  }
  if (!section) throw new Error(`${where}: "${id}" is not inside a section`);
  const body = html.slice(section.index, elementEnd(html, section.index, where));
  const h2 = body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  return { html: html.slice(start, end), section: section[1], sectionTitle: h2 ? plain(h2[1]) : "" };
}

// Makes a copied element work on its new page: ids get the item's prefix, so two copies
// never clash, and links that were relative to the topic page still reach their targets.
function adapt(frag, item, rootId, topicHref) {
  frag = frag.replace(` id="${rootId}"`, "");
  const ids = new Set([...frag.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const ren = (id) => (ids.has(id) ? `${item.id}-${id}` : id);
  frag = frag
    .replace(/\sid="([^"]+)"/g, (m, id) => ` id="${ren(id)}"`)
    .replace(/\s(aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g, (m, a, v) => ` ${a}="${v.split(/\s+/).map(ren).join(" ")}"`)
    .replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${ren(id)})`)
    .replace(/\s(href|src)="([^"]+)"/g, (m, a, v) => {
      if (/^(https?:|mailto:|data:)/.test(v)) return m;
      if (v.startsWith("#")) return ids.has(v.slice(1)) ? ` ${a}="#${ren(v.slice(1))}"` : ` ${a}="${topicHref}${v}"`;
      return ` ${a}="${path.posix.normalize(path.posix.join(path.posix.dirname(topicHref), v))}"`;
    });
  return frag;
}

// The widget scripts a page needs, from the selectors each script looks for.
function widgetScripts(html) {
  const dir = path.join(ROOT, "assets/js/widgets");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js") && f !== "player.js").sort();
  const needed = files.filter((f) => {
    const js = fs.readFileSync(path.join(dir, f), "utf8");
    return [...js.matchAll(/querySelectorAll\(['"]\[(data-widget="[^"]+"|data-[a-z-]+-static)\]['"]\)/g)].some((m) => html.includes(m[1]));
  });
  return needed.length ? ["player.js", ...needed] : [];
}

const HEAD = (title, desc, widgets) => `<!doctype html>
<html lang="en">
<head>
  <!-- Built by tools/build-gallery.mjs from data/gallery.js and the topic pages. Edit those, then run the script again. -->
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
${widgets ? '  <link rel="stylesheet" href="../assets/css/widgets.css">\n' : ""}  <link rel="stylesheet" href="../assets/css/print.css" media="print">
  <script>try{var t=localStorage.getItem("dbms-theme");if(t)document.documentElement.setAttribute("data-theme",JSON.parse(t))}catch(e){}</script>
</head>
`;

const FOOT = (scripts) => `  <footer id="site-footer" class="site-footer"></footer>
  <script src="../data/site.js"></script>
  <script src="../data/topics.js"></script>
  <script src="../assets/js/layout.js"></script>
${scripts.map((s) => `  <script src="../assets/js/widgets/${s}"></script>\n`).join("")}</body>
</html>
`;

function itemBlock(D, item) {
  const t = D.topics.find((x) => x.id === item.topic);
  const where = `data/gallery.js [${item.id}]`;
  if (!t) throw new Error(`${where}: unknown topic ${item.topic}`);
  if (t.status !== "published") throw new Error(`${where}: topic ${t.id} is not published`);
  if (!KINDS.some((k) => k.id === item.kind)) throw new Error(`${where}: bad kind "${item.kind}"`);
  if (!item.title || !item.note || !(item.refs || []).length) throw new Error(`${where}: needs a title, a note and refs`);
  const file = `units/unit-${t.unit}/${t.slug}.html`;
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const topicHref = `../${file}`;
  const parts = item.refs.map((id) => findElement(html, id, `${file} (for ${item.id})`));
  const first = parts[0];
  return [
    `          <article class="gallery-item" id="${item.id}" aria-labelledby="${item.id}-title">`,
    `            <h3 id="${item.id}-title">${escText(item.title)}</h3>`,
    `            <p class="gallery-note">${escText(item.note)}</p>`,
    ...parts.map((p, i) => adapt(p.html, item, item.refs[i], topicHref)),
    `            <p class="gallery-source">From <a href="${topicHref}#${first.section}"><span class="rev-num">${t.id}</span> ${escText(t.title)}: ${escText(first.sectionTitle)}</a></p>`,
    "          </article>"
  ].join("\n");
}

function unitPage(D, u, items) {
  const kinds = KINDS.map((k) => ({ ...k, items: items.filter((i) => i.kind === k.id) })).filter((k) => k.items.length);
  const body = kinds
    .map((k) => [
      `        <section id="${k.id}s" class="section gallery-kind" aria-labelledby="${k.id}s-title">`,
      `          <h2 id="${k.id}s-title">${k.title}</h2>`,
      ...k.items.map((i) => itemBlock(D, i)),
      "        </section>"
    ].join("\n"))
    .join("\n\n");
  const scripts = widgetScripts(body);
  const summary = kinds.map((k) => count(k.items.length, k)).join(", ").replace(/, ([^,]*)$/, " and $1");
  return (
    HEAD(`Unit ${u.roman} Diagrams and Examples`, `The important diagrams, queries and worked examples of Unit ${u.roman} (${u.title}) in one place, each linked to its topic page.`, true) +
    `<body data-root="../" data-page="diagrams" data-unit="${u.n}" data-sidebar="static">
  <a class="skip-link" href="#main">Skip to main content</a>
  <header id="site-header" class="site-header"></header>
  <div class="page">
    <main id="main" class="main" tabindex="-1">
      <div class="content u-${u.n}">
        <nav id="breadcrumbs" class="breadcrumbs"></nav>
        <header class="gallery-head">
          <span class="eyebrow">Unit ${u.roman}: ${escText(u.title)}</span>
          <h1>Unit ${u.roman} Diagrams and Examples</h1>
          <p class="lead">${summary} from the Unit ${u.roman} topics. Use them to practice drawing and writing before the exam. Each one links back to its topic page.</p>
        </header>

        <nav class="on-this-page" aria-labelledby="toc-title">
          <strong id="toc-title">On this page</strong>
          <ol>
${kinds.map((k) => `            <li><a href="#${k.id}s">${k.title}</a> <span class="muted">(${k.items.length})</span></li>`).join("\n")}
          </ol>
        </nav>

${body}

        <div class="btn-row gallery-more">
          <a class="btn" href="../outlines/${u.slug}.html">Unit ${u.roman} 16-mark outlines</a>
          <a class="btn" href="../revision/${u.slug}.html">Unit ${u.roman} revision sheet</a>
          <a class="btn" href="../units/${u.slug}/index.html">Unit ${u.roman} topics</a>
        </div>
      </div>
    </main>
  </div>
` + FOOT(scripts)
  );
}

function hubPage(D, byUnit) {
  const total = Object.values(byUnit).flat();
  const totals = KINDS.map((k) => count(total.filter((i) => i.kind === k.id).length, k));
  const cards = D.units
    .filter((u) => byUnit[u.n].length)
    .map((u) => {
      const counts = KINDS.map((k) => [k, byUnit[u.n].filter((i) => i.kind === k.id).length]).filter(([, n]) => n);
      return [
        `            <a class="card unit-card u-${u.n}" href="${u.slug}.html">`,
        `              <span class="unit-label">Unit ${u.roman}</span>`,
        `              <h3>${escText(u.title)}</h3>`,
        `              <div class="card-foot">${counts.map(([k, n]) => `<span class="badge badge-unit">${count(n, k)}</span>`).join("")}</div>`,
        "            </a>"
      ].join("\n");
    })
    .join("\n");
  const index = D.units
    .filter((u) => byUnit[u.n].length)
    .map((u) => {
      const lists = KINDS.map((k) => [k, byUnit[u.n].filter((i) => i.kind === k.id)])
        .filter(([, list]) => list.length)
        .map(([k, list]) => [
          `            <h4>${k.title}</h4>`,
          '            <ul class="chips">',
          ...list.map((i) => `              <li><a class="chip" href="${u.slug}.html#${i.id}">${escText(i.title)}</a></li>`),
          "            </ul>"
        ].join("\n"));
      return [
        `          <div class="gallery-index u-${u.n}">`,
        `            <h3><a href="${u.slug}.html">Unit ${u.roman}: ${escText(u.title)}</a></h3>`,
        ...lists,
        "          </div>"
      ].join("\n");
    })
    .join("\n");
  return (
    HEAD("Diagrams and Examples", "The important diagrams, queries and worked examples of every unit in one place, such as the database architecture, E-R diagrams and transaction schedules. Each one links to its topic page.", false) +
    `<body data-root="../" data-page="diagrams" data-sidebar="static">
  <a class="skip-link" href="#main">Skip to main content</a>
  <header id="site-header" class="site-header"></header>
  <div class="page">
    <main id="main" class="main" tabindex="-1">
      <div class="content">
        <nav id="breadcrumbs" class="breadcrumbs"></nav>
        <h1>Diagrams and Examples</h1>
        <p class="lead">The diagrams, queries and worked examples you are most likely to need in the exam, gathered from the topic pages. Each one links back to the topic, so you can read the full explanation.</p>

        <section class="section" aria-labelledby="units-title">
          <h2 id="units-title">Choose a unit</h2>
          <p>There are ${totals.slice(0, -1).join(", ")} and ${totals[totals.length - 1]} in all.</p>
          <div class="grid">
${cards}
          </div>
        </section>

        <section class="section" aria-labelledby="how-title">
          <h2 id="how-title">How to use them</h2>
          <ul>
            <li><strong>Diagrams:</strong> look at one, close the page and draw it from memory. Then check your labels.</li>
            <li><strong>Queries:</strong> read the question in the note, write your own query, then compare.</li>
            <li><strong>Worked examples:</strong> cover the answer and work through the problem step by step.</li>
            <li>The 16-mark outlines say which diagram to draw for each question.</li>
          </ul>
        </section>

        <section class="section" aria-labelledby="all-title">
          <h2 id="all-title">Everything in one list</h2>
${index}
        </section>
      </div>
    </main>
  </div>
` + FOOT([])
  );
}

// Returns { "diagrams/index.html": html, "diagrams/unit-1.html": html, ... }.
export function buildGallery() {
  const D = loadRegistry();
  const items = D.gallery || [];
  const seen = new Set();
  for (const i of items) {
    if (seen.has(i.id)) throw new Error(`data/gallery.js [${i.id}]: duplicate id`);
    seen.add(i.id);
  }
  const byUnit = {};
  // Items keep the order of the topics; items of one topic keep their order in the list.
  const order = (i) => D.topics.findIndex((t) => t.id === i.topic);
  for (const u of D.units) {
    byUnit[u.n] = items.filter((i) => String(i.topic).split(".")[0] === String(u.n)).sort((a, b) => order(a) - order(b));
  }
  const out = { "diagrams/index.html": hubPage(D, byUnit) };
  for (const u of D.units) {
    if (byUnit[u.n].length) out[`diagrams/${u.slug}.html`] = unitPage(D, u, byUnit[u.n]);
  }
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const [file, html] of Object.entries(buildGallery())) {
    fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, file), html);
    console.log(`wrote ${file}`);
  }
}
