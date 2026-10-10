// Builds the Comparisons pages (comparisons/index.html and comparisons/unit-1.html to
// unit-5.html) and the search list data/comparison-index.js from data/comparisons/.
// A comparison either copies its table from a topic page (so it is written once) or
// carries its own rows.
// Run with: node tools/build-comparisons.mjs
// tools/check.mjs fails if a page is out of date with the data or the topic pages.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { escAttr, escText, plain, findElement, adapt, widgetScripts } from "./build-gallery.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROMAN = ["", "I", "II", "III", "IV", "V"];

function loadRegistry() {
  const ctx = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  const files = ["data/site.js", "data/topics.js"];
  for (const dir of ["data/questions", "data/comparisons"]) {
    const full = path.join(ROOT, dir);
    if (fs.existsSync(full)) files.push(...fs.readdirSync(full).filter((f) => f.endsWith(".js")).sort().map((f) => `${dir}/${f}`));
  }
  for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
  }
  return ctx.DBMS;
}

const count = (n) => `${n} ${n === 1 ? "comparison" : "comparisons"}`;

const HEAD = (title, desc) => `<!doctype html>
<html lang="en">
<head>
  <!-- Built by tools/build-comparisons.mjs from data/comparisons and the topic pages. Edit those, then run the script again. -->
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

const FOOT = (scripts) => `  <footer id="site-footer" class="site-footer"></footer>
  <script src="../data/site.js"></script>
  <script src="../data/topics.js"></script>
  <script src="../assets/js/layout.js"></script>
${scripts.map((s) => `  <script src="../assets/js/${s}"></script>\n`).join("")}</body>
</html>
`;

// A table written in the data file. The first cell of each row is the row heading.
function ownTable(t, where) {
  if (!t.caption || !(t.head || []).length || !(t.rows || []).length) throw new Error(`${where}: a table needs a caption, head and rows`);
  for (const r of t.rows) {
    if (r.length !== t.head.length) throw new Error(`${where}: row "${plain(r[0])}" has ${r.length} cells (expected ${t.head.length})`);
  }
  return [
    '            <div class="table-wrap">',
    '              <table class="cmp-table">',
    `                <caption>${t.caption}</caption>`,
    `                <thead><tr>${t.head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>`,
    "                <tbody>",
    ...t.rows.map((r) => `                  <tr><th scope="row">${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join("")}</tr>`),
    "                </tbody>",
    "              </table>",
    "            </div>"
  ].join("\n");
}

function topicFile(t) {
  return `units/unit-${t.unit}/${t.slug}.html`;
}

function itemBlock(D, c) {
  const where = `data/comparisons [${c.id}]`;
  const topicOf = (id) => {
    const t = D.topics.find((x) => x.id === id);
    if (!t) throw new Error(`${where}: unknown topic ${id}`);
    if (t.status !== "published") throw new Error(`${where}: topic ${id} is not published`);
    return t;
  };
  const pages = {};
  const pageOf = (t) => (pages[t.id] = pages[t.id] || fs.readFileSync(path.join(ROOT, topicFile(t)), "utf8"));
  const reads = [];
  const addRead = (t, section, sectionTitle) => {
    if (!reads.some((r) => r.t === t && r.section === section)) reads.push({ t, section, sectionTitle });
  };

  const tables = (c.tables || []).map((tb, i) => {
    if (tb.from) {
      const t = topicOf(tb.from);
      const file = topicFile(t);
      const el = findElement(pageOf(t), tb.ref, `${file} (for ${c.id})`);
      if (!/<table[\s>]/.test(el.html)) throw new Error(`${where}: ${tb.ref} in ${file} is not a table`);
      addRead(t, el.section, el.sectionTitle);
      return adapt(el.html, { id: `${c.id}-${i + 1}` }, tb.ref, `../${file}`).replace(/^\s*/, "            ");
    }
    return ownTable(tb, `${where} table ${i + 1}`);
  });
  if (!tables.length) throw new Error(`${where}: needs at least one table`);
  for (const ref of c.read || []) {
    const [id, anchor] = ref.split("#");
    const t = topicOf(id);
    const m = pageOf(t).match(new RegExp(`<section id="${anchor}"[\\s\\S]*?<h2[^>]*>([\\s\\S]*?)</h2>`));
    if (!m) throw new Error(`${where}: read link ${ref} is not a section of ${topicFile(t)}`);
    addRead(t, anchor, plain(m[1]));
  }
  for (const id of c.topics) {
    const t = topicOf(id);
    if (!reads.some((r) => r.t === t)) addRead(t, null, "");
  }

  const syntax = (c.syntax || []).map((s) => [
    '              <div class="code-block">',
    `                <span class="code-label">${escText(s.label)}</span>`,
    `                <pre><code>${escText(s.code)}</code></pre>`,
    "              </div>",
    ...(s.note ? [`              <p class="cmp-syntax-note">${s.note}</p>`] : [])
  ].join("\n"));

  const asked = (c.questions || []).map((id) => {
    const q = (D.questions || []).find((x) => x.id === id);
    if (!q) throw new Error(`${where}: unknown question ${id}`);
    return `<a href="../question-bank/unit-${q.unit}.html#q-${q.id}">Unit ${ROMAN[q.unit]} QB, ${q.marks} marks</a>`;
  });

  return [
    `          <article class="cmp-item" id="${c.id}" aria-labelledby="${c.id}-title">`,
    // The title, summary and first table print together.
    '            <div class="cmp-lead">',
    `            <h3 id="${c.id}-title">${escText(c.title)}</h3>`,
    `            <p class="cmp-summary"><strong>In one line:</strong> ${c.summary}</p>`,
    tables[0],
    "            </div>",
    ...tables.slice(1),
    ...(syntax.length
      ? [
          '            <div class="cmp-syntax">',
          `              <h4>${escText(c.syntaxTitle || "Syntax side by side")}</h4>`,
          `              <div class="cmp-syntax-grid${syntax.length > 2 ? " cmp-syntax-many" : ""}">`,
          ...syntax.map((s) => `              <div>\n${s}\n              </div>`),
          "              </div>",
          "            </div>"
        ]
      : []),
    ...(c.tip ? [`            <div class="callout callout-tip"><div class="callout-title">Exam tip</div><p>${c.tip}</p></div>`] : []),
    `            <div class="cmp-source">Read more: ${reads
      .map((r) => `<a href="../${topicFile(r.t)}${r.section ? "#" + r.section : ""}"><span class="rev-num">${r.t.id}</span> ${escText(r.t.title)}${r.sectionTitle ? ": " + escText(r.sectionTitle) : ""}</a>`)
      .join("; ")}${asked.length ? `<br>Asked in: ${asked.join(", ")}` : ""}</div>`,
    "          </article>"
  ].join("\n");
}

// Each comparison sits under its first topic; topics keep syllabus order.
function groups(D, items) {
  const order = (id) => D.topics.findIndex((t) => t.id === id);
  const sorted = items.slice().sort((a, b) => order(a.topics[0]) - order(b.topics[0]));
  const out = [];
  for (const c of sorted) {
    const t = D.topics.find((x) => x.id === c.topics[0]);
    let g = out.find((x) => x.t === t);
    if (!g) out.push((g = { t, items: [] }));
    g.items.push(c);
  }
  return out;
}

function unitPage(D, u, items) {
  const gs = groups(D, items);
  const body = gs
    .map((g) => {
      const sid = `t${g.t.id.replace(".", "-")}`;
      return [
        `        <section id="${sid}" class="section cmp-topic" aria-labelledby="${sid}-title">`,
        `          <h2 id="${sid}-title"><a href="../${topicFile(g.t)}"><span class="rev-num">${g.t.id}</span> ${escText(g.t.title)}</a></h2>`,
        ...g.items.map((c) => itemBlock(D, c)),
        "        </section>"
      ].join("\n");
    })
    .join("\n\n");
  const scripts = widgetScripts(body).map((s) => `widgets/${s}`);
  return (
    HEAD(`Unit ${u.roman} Comparisons`, `Tables that compare the related concepts of Unit ${u.roman} (${u.title}), with the syntax side by side for SQL. Each one links to its topic page. Prints well.`) +
    `<body data-root="../" data-page="comparisons" data-unit="${u.n}" data-sidebar="static">
  <a class="skip-link" href="#main">Skip to main content</a>
  <header id="site-header" class="site-header"></header>
  <div class="page">
    <main id="main" class="main" tabindex="-1">
      <div class="content u-${u.n}">
        <nav id="breadcrumbs" class="breadcrumbs"></nav>
        <header class="cmp-head">
          <span class="eyebrow">Unit ${u.roman}: ${escText(u.title)}</span>
          <h1>Unit ${u.roman} Comparisons</h1>
          <p class="lead">${count(items.length)} of the related ideas in Unit ${u.roman}, as tables you can learn and write in the exam. Each one links to its topic page.</p>
        </header>

        <div class="btn-row no-print">
          <button type="button" class="btn btn-primary" data-print>Print the comparisons</button>
          <a class="btn" href="../revision/${u.slug}.html">Unit ${u.roman} revision sheet</a>
          <a class="btn" href="../question-bank/${u.slug}.html">Unit ${u.roman} question bank</a>
        </div>

        <nav class="on-this-page cmp-toc" aria-labelledby="toc-title">
          <strong id="toc-title">On this page</strong>
          <ol>
${gs
  .map((g) => [
    `            <li><a href="#t${g.t.id.replace(".", "-")}">${g.t.id} ${escText(g.t.title)}</a>`,
    "              <ol>",
    ...g.items.map((c) => `                <li><a href="#${c.id}">${escText(c.title)}</a></li>`),
    "              </ol>",
    "            </li>"
  ].join("\n"))
  .join("\n")}
          </ol>
        </nav>

${body}

        <div class="btn-row cmp-more no-print">
          <a class="btn" href="../diagrams/${u.slug}.html">Unit ${u.roman} diagrams and examples</a>
          <a class="btn" href="../outlines/${u.slug}.html">Unit ${u.roman} 16-mark outlines</a>
          <a class="btn" href="../units/${u.slug}/index.html">Unit ${u.roman} topics</a>
        </div>
      </div>
    </main>
  </div>
` + FOOT([...scripts, "revision.js"])
  );
}

function hubPage(D, byUnit) {
  const live = D.units.filter((u) => byUnit[u.n].length);
  const total = live.reduce((n, u) => n + byUnit[u.n].length, 0);
  const cards = live
    .map((u) => [
      `            <a class="card unit-card u-${u.n}" href="${u.slug}.html">`,
      `              <span class="unit-label">Unit ${u.roman}</span>`,
      `              <h3>${escText(u.title)}</h3>`,
      `              <div class="card-foot"><span class="badge badge-unit">${count(byUnit[u.n].length)}</span></div>`,
      "            </a>"
    ].join("\n"))
    .join("\n");
  const index = live
    .map((u) => [
      `          <div class="gallery-index u-${u.n}">`,
      `            <h3><a href="${u.slug}.html">Unit ${u.roman}: ${escText(u.title)}</a></h3>`,
      '            <div class="table-wrap">',
      '              <table class="cmp-index">',
      `                <caption>Unit ${u.roman} comparisons by topic</caption>`,
      '                <thead><tr><th scope="col">Topic</th><th scope="col">Comparisons</th></tr></thead>',
      "                <tbody>",
      ...groups(D, byUnit[u.n]).map((g) => `                  <tr><th scope="row"><span class="rev-num">${g.t.id}</span> ${escText(g.t.title)}</th><td><ul class="chips">${g.items.map((c) => `<li><a class="chip" href="${u.slug}.html#${c.id}">${escText(c.title)}</a></li>`).join("")}</ul></td></tr>`),
      "                </tbody>",
      "              </table>",
      "            </div>",
      "          </div>"
    ].join("\n"))
    .join("\n");
  return (
    HEAD("Comparisons", "Tables that compare related DBMS concepts, such as DDL and DML, 3NF and BCNF, B tree and B+ tree, and two-phase and three-phase commit, with SQL syntax side by side.") +
    `<body data-root="../" data-page="comparisons" data-sidebar="static">
  <a class="skip-link" href="#main">Skip to main content</a>
  <header id="site-header" class="site-header"></header>
  <div class="page">
    <main id="main" class="main" tabindex="-1">
      <div class="content">
        <nav id="breadcrumbs" class="breadcrumbs"></nav>
        <h1>Comparisons</h1>
        <p class="lead">Exams often ask you to compare two ideas. These tables put related ideas side by side, unit by unit. For SQL, they also show the syntax of each one.</p>

        <section class="section" aria-labelledby="units-title">
          <h2 id="units-title">Choose a unit</h2>
          <p>There are ${count(total)} in all. Each unit page prints well, so you can keep a paper copy.</p>
          <div class="grid">
${cards}
          </div>
        </section>

        <section class="section" aria-labelledby="how-title">
          <h2 id="how-title">How to write a comparison answer</h2>
          <ul>
            <li>Draw a table. The first column is the <strong>basis of comparison</strong>, and there is one column for each idea.</li>
            <li>Start with a one-line definition of each idea, then give the differences.</li>
            <li>For a 2-mark question, two or three rows are enough.</li>
            <li>For a 16-mark question, write eight or more rows, then add an example, a diagram or a query for each idea.</li>
            <li>For SQL, write the syntax of each command and a short example.</li>
          </ul>
        </section>

        <section class="section" aria-labelledby="all-title">
          <h2 id="all-title">All comparisons</h2>
${index}
        </section>
      </div>
    </main>
  </div>
` + FOOT([])
  );
}

function searchIndex(D, byUnit) {
  const list = D.units.flatMap((u) =>
    groups(D, byUnit[u.n]).flatMap((g) => g.items).map((c) => ({ id: c.id, unit: u.n, title: c.title, text: plain(c.summary) + (c.keywords ? " " + c.keywords : "") }))
  );
  return `/* Built by tools/build-comparisons.mjs from data/comparisons. Do not edit by hand.
   The search box loads this list when it first opens. */
window.DBMS = window.DBMS || {};

DBMS.comparisonIndex = [
${list.map((x) => "  " + JSON.stringify(x)).join(",\n")}
];
`;
}

// Returns { "comparisons/index.html": html, ..., "data/comparison-index.js": js }.
export function buildComparisons() {
  const D = loadRegistry();
  const items = D.comparisons || [];
  const seen = new Set();
  for (const c of items) {
    const where = `data/comparisons [${c.id}]`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id || "")) throw new Error(`${where}: bad id`);
    if (seen.has(c.id)) throw new Error(`${where}: duplicate id`);
    seen.add(c.id);
    if (!c.title || !c.summary || !(c.topics || []).length) throw new Error(`${where}: needs a title, a summary and topics`);
  }
  const byUnit = {};
  for (const u of D.units) byUnit[u.n] = items.filter((c) => String(c.topics[0]).split(".")[0] === String(u.n));
  const out = { "comparisons/index.html": hubPage(D, byUnit) };
  for (const u of D.units) {
    if (byUnit[u.n].length) out[`comparisons/${u.slug}.html`] = unitPage(D, u, byUnit[u.n]);
  }
  out["data/comparison-index.js"] = searchIndex(D, byUnit);
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const [file, html] of Object.entries(buildComparisons())) {
    fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, file), html);
    console.log(`wrote ${file}`);
  }
}
