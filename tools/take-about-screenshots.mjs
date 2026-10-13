// Takes the screenshots in the How to use this site section of about.html.
// They are saved in assets/img/about. This script is not part of the checks.
// It needs Playwright with Chromium, and the site served on a local web server:
//   python3 -m http.server 8000
//   node tools/take-about-screenshots.mjs http://localhost:8000/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "img", "about");
const BASE = process.argv[2] || "http://localhost:8000/";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 760 }, colorScheme: "light", reducedMotion: "reduce" });
const page = await ctx.newPage();

const go = async (url) => {
  await page.goto(new URL(url, BASE).href);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
};
const shot = (name, opts = {}) => page.screenshot({ path: path.join(OUT, `${name}.jpg`), type: "jpeg", quality: 82, ...opts });
// The box of an element on the whole page, with a margin around it.
const box = async (loc, m = 16) => {
  const r = await loc.boundingBox();
  const sy = await page.evaluate(() => scrollY);
  return { x: Math.max(0, r.x - m), y: r.y + sy - m, width: r.width + 2 * m, height: r.height + 2 * m };
};

// Home page: the unit cards, then the search box. This runs first, before any progress is saved.
await go("index.html");
await shot("home-units", { fullPage: true, clip: await box(page.locator(".unit-card").first().locator("xpath=ancestor::section[1]"), 24) });
await page.keyboard.press("Control+k");
await page.keyboard.type("normal form");
await page.waitForTimeout(400);
await shot("search");

// A topic page.
await go("units/unit-1/keys.html");
await shot("topic-page");

// Its interactive diagram, with RollNo and Name ticked.
const finder = page.locator('[data-widget="key-finder"]');
await finder.scrollIntoViewIfNeeded();
await finder.locator('input[value="RollNo"]').check();
await finder.locator('input[value="Name"]').check();
await page.waitForTimeout(300);
await shot("interactive-diagram", { fullPage: true, clip: await box(finder) });

// Its important questions, with one sample answer open.
await page.locator("#questions").scrollIntoViewIfNeeded();
await page.locator("#q-u1-a11 summary").click();
await page.waitForTimeout(500);
await shot("model-answer", { fullPage: true, clip: await box(page.locator("#questions")) });

// Its quiz: one right answer and one wrong answer, after checking.
const cards = page.locator("#quiz .quiz-card");
await cards.nth(0).locator(".quiz-option input").nth(1).check();
await cards.nth(1).locator(".quiz-option input").nth(0).check();
await page.locator('#quiz [type="submit"]').click();
await page.waitForTimeout(300);
const first = await box(cards.nth(0));
const second = await box(cards.nth(1));
await shot("topic-quiz", { fullPage: true, clip: { ...first, height: second.y + second.height - first.y } });

// A revision sheet.
await go("revision/unit-1.html");
await shot("revision-sheet");

await browser.close();
console.log(`saved the screenshots in ${path.relative(ROOT, OUT)}`);
