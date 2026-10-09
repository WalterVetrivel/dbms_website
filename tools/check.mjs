// Site checks. Run with: node tools/check.mjs
// No dependencies. Errors make the script exit with code 1. Warnings do not.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { buildRevision } from "./build-revision.mjs";
import { buildGallery } from "./build-gallery.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([".git", "node_modules", "tools", ".github"]);
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const rel = (f) => path.relative(ROOT, f).split(path.sep).join("/");
const files = walk(ROOT);
const textFiles = files.filter((f) => /\.(html|js|css|json|md|txt|svg|xml)$/i.test(f));
const htmlFiles = files.filter((f) => f.endsWith(".html"));

// 1. The course code must never appear on the site.
// The pattern is built from parts so that this file does not contain the code itself.
const codePattern = new RegExp(["BE", "\\s*23", "\\s*CS", "\\s*405"].join(""), "i");
for (const f of textFiles) {
  if (codePattern.test(fs.readFileSync(f, "utf8"))) err(rel(f), "contains the course code");
}

// 2. Page structure.
const stripTags = (s) => s.replace(/<[^>]+>/g, " ");
for (const f of htmlFiles) {
  const name = rel(f);
  const html = fs.readFileSync(f, "utf8");
  if (!/^<!doctype html>/i.test(html)) err(name, "missing <!doctype html>");
  if (!/<html[^>]*\slang="en"/.test(html)) err(name, 'missing <html lang="en">');
  if (!/<title>[^<]+<\/title>/.test(html)) err(name, "missing <title>");
  if (!/<meta name="viewport"/.test(html)) err(name, "missing viewport meta tag");
  if (!/<meta name="description" content="[^"]+"/.test(html)) warn(name, "missing meta description");
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(name, `has ${h1} <h1> elements (expected 1)`);

  const rootMatch = html.match(/<body[^>]*\sdata-root="([^"]*)"/);
  if (!rootMatch) err(name, "body has no data-root");
  else if (name !== "404.html") {
    const depth = name.split("/").length - 1;
    const expected = "../".repeat(depth);
    if (rootMatch[1] !== expected) err(name, `data-root is "${rootMatch[1]}" (expected "${expected}")`);
  }

  // Local links and sources must point to files that exist.
  if (name === "404.html") continue; // uses an absolute site root
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(target)) continue;
    const clean = target.split("#")[0].split("?")[0];
    if (!clean) continue;
    const resolved = path.resolve(path.dirname(f), decodeURIComponent(clean));
    if (!fs.existsSync(resolved)) err(name, `broken link: ${target}`);
  }
}

// 3. Data registry.
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
for (const file of ["data/site.js", "data/topics.js"]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
}
const D = ctx.DBMS || {};
const units = D.units || [];
const topics = D.topics || [];
const STATUSES = new Set(["planned", "draft", "published"]);
const EXPECTED = { 1: 13, 2: 17, 3: 14, 4: 11, 5: 15 };

if (units.length !== 5) err("data/topics.js", `has ${units.length} units (expected 5)`);
if (topics.length !== 70) err("data/topics.js", `has ${topics.length} topics (expected 70)`);
for (const [u, n] of Object.entries(EXPECTED)) {
  const count = topics.filter((t) => t.unit === Number(u)).length;
  if (count !== n) err("data/topics.js", `unit ${u} has ${count} topics (expected ${n})`);
}
const ids = new Set();
const slugs = new Set();
for (const t of topics) {
  const where = `data/topics.js [${t.id}]`;
  if (ids.has(t.id)) err(where, "duplicate id");
  ids.add(t.id);
  const key = `${t.unit}/${t.slug}`;
  if (slugs.has(key)) err(where, `duplicate slug ${t.slug}`);
  slugs.add(key);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug || "")) err(where, `bad slug "${t.slug}"`);
  if (!t.title) err(where, "missing title");
  if (!STATUSES.has(t.status)) err(where, `bad status "${t.status}"`);
  if (String(t.id).split(".")[0] !== String(t.unit)) err(where, "id does not match unit");
  if (t.status === "published") {
    const page = path.join(ROOT, "units", `unit-${t.unit}`, `${t.slug}.html`);
    if (!fs.existsSync(page)) err(where, `published but ${rel(page)} is missing`);
  }
}
for (const t of topics) {
  for (const field of ["prereqs", "related"]) {
    for (const ref of t[field] || []) {
      if (!ids.has(ref)) err(`data/topics.js [${t.id}]`, `${field} refers to unknown topic ${ref}`);
    }
  }
}
for (const p of D.pages || []) {
  if (!STATUSES.has(p.status)) err(`data/site.js [${p.id}]`, `bad status "${p.status}"`);
  if (p.status === "published" && !fs.existsSync(path.join(ROOT, p.href))) {
    err(`data/site.js [${p.id}]`, `published but ${p.href} is missing`);
  }
}

// 4. Question bank data.
// Questions are mapped to units only, never to a test paper (spec FR-3.1).
const testPattern = new RegExp("\\b" + ["I", "A", "T"].join("") + "\\b");
for (const f of textFiles) {
  if (testPattern.test(fs.readFileSync(f, "utf8"))) err(rel(f), "mentions an internal test paper; map questions to units only");
}
const qDir = path.join(ROOT, "data", "questions");
const qFiles = fs.existsSync(qDir) ? fs.readdirSync(qDir).filter((f) => f.endsWith(".js")).sort() : [];
for (const f of qFiles) vm.runInContext(fs.readFileSync(path.join(qDir, f), "utf8"), ctx, { filename: f });
const questions = D.questions || [];
const ROMAN = ["", "I", "II", "III", "IV", "V"];
const qIds = new Set();
const numbered = {};
const mapped = new Set();
for (const q of questions) {
  const where = `data/questions [${q.id}]`;
  const m = /^u([1-5])-([ab])(\d+)$/.exec(q.id || "");
  if (!m) { err(where, "bad id (expected u<unit>-<a|b><number>)"); continue; }
  if (qIds.has(q.id)) err(where, "duplicate id");
  qIds.add(q.id);
  if (q.unit !== Number(m[1])) err(where, "unit does not match id");
  if (q.part !== m[2].toUpperCase()) err(where, "part does not match id");
  if (q.marks !== (q.part === "A" ? 2 : 16)) err(where, `marks ${q.marks} do not match Part ${q.part}`);
  if (!q.question || !q.original) err(where, "missing question or original wording");
  if (!Array.isArray(q.topics) || !q.topics.length) err(where, "has no topic");
  for (const t of q.topics || []) {
    if (!ids.has(t)) err(where, `refers to unknown topic ${t}`);
    mapped.add(t);
  }
  if (q.part === "A" && !q.answer) err(where, "2-mark question has no answer");
  for (const s of q.sources || []) {
    if (s.bank !== "Unit " + ROMAN[q.unit]) err(where, `source "${s.bank}" is not its own unit bank`);
    if (!s.extra) (numbered[q.unit + q.part] = numbered[q.unit + q.part] || []).push(s.no);
  }
  if (!(q.sources || []).length) err(where, "has no source");
}
// The numbered questions of each unit bank run 1, 2, 3 ... with no gaps.
for (const [key, nos] of Object.entries(numbered)) {
  nos.sort((x, y) => x - y).forEach((n, i) => {
    if (n !== i + 1) err("data/questions", `Unit ${ROMAN[key[0]]} Part ${key[1]}: expected question ${i + 1}, found ${n}`);
  });
}
for (const t of topics) {
  if (questions.length && !mapped.has(t.id)) warn(`data/topics.js [${t.id}]`, "no question bank item is mapped to this topic");
}

// 5. Quiz data. Every item needs a valid answer and a link to a section of its topic page.
const zDir = path.join(ROOT, "data", "quizzes");
const zFiles = fs.existsSync(zDir) ? fs.readdirSync(zDir).filter((f) => f.endsWith(".js")).sort() : [];
for (const f of zFiles) {
  const before = (D.quizzes || []).length;
  vm.runInContext(fs.readFileSync(path.join(zDir, f), "utf8"), ctx, { filename: f });
  const added = D.quizzes.slice(before);
  if (Object.keys(added).length !== added.length) err(`data/quizzes/${f}`, "has an empty slot in its list (look for a doubled comma)");
}
const quizzes = (D.quizzes || []).filter(Boolean);
const zIds = new Set();
const perUnit = {};
const pageHtml = {};
const TYPES = new Set(["mcq", "multi", "tf", "order"]);
for (const q of quizzes) {
  const where = `data/quizzes [${q.id}]`;
  if (zIds.has(q.id)) err(where, "duplicate id");
  zIds.add(q.id);
  const t = topics.find((x) => x.id === q.topic);
  if (!t) { err(where, `refers to unknown topic ${q.topic}`); continue; }
  if (!new RegExp(`^q${t.id.replace(".", "\\.")}-\\d+$`).test(q.id || "")) err(where, "id does not match its topic (expected q<topic>-<number>)");
  perUnit[t.unit] = (perUnit[t.unit] || 0) + 1;
  if (!TYPES.has(q.type)) { err(where, `bad type "${q.type}"`); continue; }
  if (!q.question || !q.explain) err(where, "missing question or explanation");
  const n = (q.options || []).length;
  if (q.type === "tf") {
    if (typeof q.answer !== "boolean") err(where, "a true or false answer must be true or false");
  } else if (n < 2) err(where, "needs at least two options");
  else if (q.type === "mcq" && !(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < n)) err(where, "answer is not an option number");
  else if (q.type === "multi" && !(Array.isArray(q.answer) && q.answer.length && q.answer.every((a) => Number.isInteger(a) && a >= 0 && a < n))) err(where, "answer must list option numbers");
  if (!q.link) warn(where, "has no link to its topic section");
  else if (t.status === "published") {
    const file = path.join(ROOT, "units", `unit-${t.unit}`, `${t.slug}.html`);
    pageHtml[file] = pageHtml[file] || (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
    if (!q.link.startsWith("#") || !pageHtml[file].includes(`id="${q.link.slice(1)}"`)) err(where, `link ${q.link} is not a section of ${rel(file)}`);
  }
}
for (const u of units) {
  const live = topics.filter((t) => t.unit === u.n && t.status === "published").length;
  if (live === topics.filter((t) => t.unit === u.n).length && (perUnit[u.n] || 0) < 40) {
    err(`data/quizzes/unit-${u.n}.js`, `has ${perUnit[u.n] || 0} items (a unit quiz needs at least 40)`);
  }
}

// 5b. 16-mark outlines. A question has outline: true exactly when its outline exists,
// and every "Read" link points to a section of a published topic page.
const oDir = path.join(ROOT, "data", "outlines");
const oFiles = fs.existsSync(oDir) ? fs.readdirSync(oDir).filter((f) => f.endsWith(".js")).sort() : [];
for (const f of oFiles) vm.runInContext(fs.readFileSync(path.join(oDir, f), "utf8"), ctx, { filename: f });
const outlines = D.outlines || {};
for (const q of questions) {
  if (q.part === "B" && (q.outline === true) !== !!outlines[q.id]) {
    err(`data/questions [${q.id}]`, q.outline ? "has outline: true but no outline in data/outlines" : "has an outline in data/outlines but outline is not true");
  }
}
for (const [id, o] of Object.entries(outlines)) {
  const where = `data/outlines [${id}]`;
  const q = questions.find((x) => x.id === id);
  if (!q || q.part !== "B") { err(where, "is not a 16-mark question"); continue; }
  if (!o.aim || !Array.isArray(o.sections) || o.sections.length < 3) { err(where, "needs an aim and at least three sections"); continue; }
  const pages = o.sections.reduce((n, s) => n + (s.pages || 0), 0);
  if (pages < 5 || pages > 6.5) err(where, `space plan adds up to ${pages} pages (expected 5 to 6.5)`);
  if (!o.sections.some((s) => (s.draw || []).length || (s.table || []).length)) warn(where, "has no diagram or table");
  o.sections.forEach((s, i) => {
    const sw = `${where} section ${i + 1}`;
    if (!s.title || !(s.pages > 0) || !(s.points || []).length) err(sw, "needs a title, pages and points");
    for (const ref of s.see || []) {
      const [tid, anchor] = ref.split("#");
      const t = topics.find((x) => x.id === tid);
      if (!t) { err(sw, `refers to unknown topic ${tid}`); continue; }
      if (t.status !== "published") continue;
      const file = path.join(ROOT, "units", `unit-${t.unit}`, `${t.slug}.html`);
      pageHtml[file] = pageHtml[file] || (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
      if (anchor && !pageHtml[file].includes(`id="${anchor}"`)) err(sw, `link ${ref} is not a section of ${rel(file)}`);
    }
  });
}

// 6. Revision sheets must match the Key points on the topic pages.
try {
  for (const [file, html] of Object.entries(buildRevision())) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full) || fs.readFileSync(full, "utf8") !== html) err(file, "is out of date; run node tools/build-revision.mjs");
  }
} catch (e) {
  err("tools/build-revision.mjs", e.message);
}

// 6b. The Diagrams and Examples pages must match data/gallery.js and the topic pages.
try {
  for (const [file, html] of Object.entries(buildGallery())) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full) || fs.readFileSync(full, "utf8") !== html) err(file, "is out of date; run node tools/build-gallery.mjs");
  }
} catch (e) {
  err("tools/build-gallery.mjs", e.message);
}

// 7. Readability (Flesch reading ease). A warning only.
function syllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}
function flesch(text) {
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().split(/\s+/).length > 2);
  const words = text.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  if (sentences.length < 3 || words.length < 50) return null;
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  return 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syl / words.length);
}
const report = [];
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [""])[0]
    .replace(/<(pre|code|table|script|style|noscript)[\s\S]*?<\/\1>/g, " ");
  const paras = [...main.matchAll(/<(p|li|dd)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)].map((m) => stripTags(m[2]));
  const text = paras.map((p) => p.trim().replace(/[^.!?]$/, "$&.")).join(" ").replace(/&[a-z]+;/g, " ");
  const score = flesch(text);
  if (score === null) continue;
  report.push([rel(f), score]);
  if (score < 60) warn(rel(f), `reading ease ${score.toFixed(0)} (aim for 60 or more)`);
  for (const p of paras) {
    for (const s of p.split(/(?<=[.!?])\s+/)) {
      const n = s.split(/\s+/).filter(Boolean).length;
      if (n > 30) warn(rel(f), `long sentence (${n} words): "${s.trim().slice(0, 60)}..."`);
    }
  }
}

console.log("Reading ease (higher is easier):");
for (const [f, s] of report.sort((a, b) => a[1] - b[1])) console.log(`  ${s.toFixed(0).padStart(4)}  ${f}`);
console.log(`\nChecked ${htmlFiles.length} pages, ${textFiles.length} text files, ${topics.length} topics, ${questions.length} questions, ${quizzes.length} quiz items, ${Object.keys(outlines).length} outlines.`);
for (const w of warnings) console.log(`warning  ${w}`);
for (const e of errors) console.log(`error    ${e}`);
console.log(`\n${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
