import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = (process.env.PRODUCTION_URL || "https://makendi-worldwide.vercel.app").replace(/\/$/, "");
const paths = ["/", "/products", "/network", "/archive", "/contact", "/robots.txt", "/sitemap.xml"];

for (const path of paths) {
  const response = await fetch(`${base}${path}`, { redirect: "follow" });
  assert.ok(response.ok, `${path} returned ${response.status}`);
  if (path === "/") {
    const headers = response.headers;
    assert.equal(headers.get("x-content-type-options"), "nosniff");
    assert.ok(headers.get("content-security-policy")?.includes("default-src 'self'"));
    assert.equal(headers.get("cross-origin-resource-policy"), "same-origin");
    assert.equal(headers.get("origin-agent-cluster"), "?1");
    assert.equal(headers.get("x-dns-prefetch-control"), "off");
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(base, { waitUntil: "networkidle" });
assert.match(await page.locator("h1").innerText(), /Ingredients/);
await page.goto(`${base}/network`, { waitUntil: "networkidle" });
assert.ok(await page.locator(".destination-chip").count() >= 28);
await browser.close();
assert.deepEqual(errors, []);
console.log(`Production smoke verification passed for ${base}.`);
