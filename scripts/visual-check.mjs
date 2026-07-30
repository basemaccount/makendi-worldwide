import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const output = process.env.VISUAL_OUTPUT || "/tmp/makendi-visual";
const routes = [
  "/",
  "/products",
  "/products/coffee/freeze-dried-coffee",
  "/network",
  "/archive",
  "/contact",
];
const viewports = [
  { width: 1440, height: 1000, label: "desktop" },
  { width: 768, height: 1024, label: "tablet" },
  { width: 390, height: 844, label: "mobile" },
  { width: 320, height: 700, label: "narrow" },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const overflows = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  for (const route of routes) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(150);
    const layout = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyWidth: document.body.scrollWidth,
      emptyButtons: [...document.querySelectorAll("button")].filter(
        (button) => !button.textContent.trim() && !button.getAttribute("aria-label"),
      ).length,
    }));
    if (layout.scrollWidth > layout.clientWidth + 1 || layout.bodyWidth > layout.clientWidth + 1) {
      overflows.push({ route, viewport: viewport.label, ...layout });
    }
    assert.equal(layout.emptyButtons, 0, `${route} has unnamed buttons at ${viewport.label}`);
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({
      path: `${output}/${slug}-${viewport.label}.png`,
      fullPage: route === "/" || route === "/network",
    });
  }
  await page.close();
}

await browser.close();
assert.deepEqual(overflows, [], JSON.stringify(overflows, null, 2));
console.log(`Visual and overflow checks passed at 1440, 768, 390 and 320 CSS pixels.`);
