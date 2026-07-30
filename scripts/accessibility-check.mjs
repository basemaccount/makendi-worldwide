import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const routes = [
  "/",
  "/products",
  "/products/coffee/freeze-dried-coffee",
  "/network",
  "/company",
  "/archive",
  "/contact",
];
const viewports = [
  { width: 1440, height: 1000, label: "desktop" },
  { width: 390, height: 844, label: "mobile" },
];

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    if (results.violations.length) {
      failures.push({
        route,
        viewport: viewport.label,
        violations: results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.length,
          help: violation.help,
        })),
      });
    }
  }
  await context.close();
}

await browser.close();
assert.deepEqual(failures, [], JSON.stringify(failures, null, 2));
console.log(`WCAG automated checks passed across ${routes.length} routes and 2 viewports.`);
