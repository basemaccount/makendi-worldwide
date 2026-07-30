import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const routes = [
  "/",
  "/products",
  "/products/starches",
  "/products/coffee",
  "/products/coffee/freeze-dried-coffee",
  "/solutions",
  "/network",
  "/company",
  "/quality",
  "/responsibility",
  "/archive",
  "/contact",
  "/privacy",
  "/not-a-real-route",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const failures = [];

for (const route of routes) {
  const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  assert.ok(response?.ok(), `${route} returned ${response?.status()}`);
  const state = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim(),
    internalLinks: [...document.querySelectorAll('a[href^="/"]')].map((anchor) => anchor.pathname),
  }));
  assert.ok(state.title.includes("Makendi"), `${route} has no route title`);
  assert.ok(state.h1, `${route} has no h1`);
  for (const pathname of state.internalLinks) {
    if (pathname.startsWith("/documents/")) continue;
    const result = await page.request.get(`${base}${pathname}`);
    if (!result.ok()) failures.push(`${route} -> ${pathname}: ${result.status()}`);
  }
}

await browser.close();
assert.deepEqual([...new Set(failures)], [], failures.join("\n"));
console.log(`Link and route verification passed for ${routes.length} representative routes.`);
