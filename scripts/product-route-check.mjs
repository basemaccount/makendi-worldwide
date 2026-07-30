import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import {
  catalogProducts,
  localized,
} from "../src/data/siteData.js";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
const errors = [];

page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

for (const product of catalogProducts) {
  const route = `/products/${product.categorySlug}/${product.slug}`;
  const response = await page.goto(`${base}${route}`, {
    waitUntil: "domcontentloaded",
  });
  assert.ok(response?.ok(), `${route} returned ${response?.status()}`);
  assert.equal(
    (await page.locator("h1").innerText()).trim(),
    localized(product.name, "en"),
    `${route} did not resolve to its English product profile`,
  );
  assert.equal(
    await page.locator('a[href^="/contact?category="]').first().getAttribute("href"),
    `/contact?category=${product.categorySlug}&product=${product.slug}`,
    `${route} lost its exact inquiry preselection`,
  );
}

await page.getByRole("button", { name: "TR" }).click();
const lastProduct = catalogProducts.at(-1);
assert.equal(
  (await page.locator("h1").innerText()).trim(),
  localized(lastProduct.name, "tr"),
  "The product profile did not switch to its Turkish catalog name",
);

await browser.close();
assert.deepEqual(errors, [], errors.join("\n"));
console.log(
  `All ${catalogProducts.length} bilingual product profile routes resolved with exact inquiry preselection.`,
);
