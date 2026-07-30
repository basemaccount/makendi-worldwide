import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto(base, { waitUntil: "networkidle" });
const metrics = await page.evaluate(() => {
  const navigation = performance.getEntriesByType("navigation")[0];
  const resources = performance.getEntriesByType("resource");
  const scripts = resources.filter((entry) => entry.initiatorType === "script");
  const styles = resources.filter((entry) => entry.initiatorType === "link" && entry.name.includes(".css"));
  const images = resources.filter((entry) => entry.initiatorType === "img");
  return {
    domContentLoaded: navigation.domContentLoadedEventEnd,
    load: navigation.loadEventEnd,
    transfer: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
    scriptTransfer: scripts.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
    styleTransfer: styles.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
    initialImageTransfer: images.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
    resources: resources.length,
  };
});

await browser.close();
assert.ok(metrics.domContentLoaded < 2500, `DOMContentLoaded ${metrics.domContentLoaded}ms`);
assert.ok(metrics.load < 3500, `Load ${metrics.load}ms`);
assert.ok(metrics.transfer < 1_200_000, `Initial transfer ${metrics.transfer} bytes`);
assert.ok(metrics.scriptTransfer < 400_000, `Script transfer ${metrics.scriptTransfer} bytes`);
assert.ok(metrics.styleTransfer < 120_000, `CSS transfer ${metrics.styleTransfer} bytes`);
console.log("Performance budgets passed:", metrics);
