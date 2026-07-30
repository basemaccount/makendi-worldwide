import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
desktop.on("pageerror", (error) => errors.push(error.message));
desktop.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

await desktop.goto(base, { waitUntil: "networkidle" });
await desktop.getByRole("navigation", { name: "Main menu" }).getByRole("link", { name: "Ingredients", exact: true }).click();
assert.equal(new URL(desktop.url()).pathname, "/products");

const search = desktop.getByPlaceholder("Search ingredients or families");
await search.fill("coffee");
await desktop.waitForTimeout(100);
assert.equal(await desktop.locator(".category-card").count(), 1);
await desktop.locator(".category-card").click();
assert.equal(new URL(desktop.url()).pathname, "/products/coffee");
await desktop.goBack();
await desktop.goBack();
assert.equal(new URL(desktop.url()).pathname, "/");

await desktop.getByRole("button", { name: "TR" }).click();
assert.equal(await desktop.locator("html").getAttribute("lang"), "tr");
assert.match(await desktop.locator("h1").innerText(), /Bileşenler/);
await desktop.getByRole("button", { name: "EN" }).click();

await desktop.goto(`${base}/network`, { waitUntil: "networkidle" });
await desktop.getByRole("button", { name: "Europe" }).click();
await desktop.getByRole("button", { name: "Germany" }).click();
await desktop.getByRole("link", { name: "Add to inquiry" }).click();
assert.equal(new URL(desktop.url()).pathname, "/contact");
assert.equal(await desktop.locator('select[name="destination"]').inputValue(), "de");

await desktop.locator('button[type="submit"]').click();
assert.ok(await desktop.locator(".form-message--error").isVisible());

await desktop.goto(`${base}/archive`, { waitUntil: "networkidle" });
await desktop.locator(".archive-tile").first().click();
assert.ok(await desktop.locator(".gallery-dialog").evaluate((dialog) => dialog.open));
await desktop.getByRole("button", { name: "Next image" }).click();
await desktop.getByRole("button", { name: "Close gallery" }).click();
assert.equal(await desktop.locator(".gallery-dialog").evaluate((dialog) => dialog.open), false);

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.getByRole("button", { name: "Open menu" }).click();
assert.equal(await mobile.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded"), "true");
await mobile.getByRole("link", { name: "Destinations" }).click();
assert.equal(new URL(mobile.url()).pathname, "/network");
assert.equal(await mobile.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "false");

await browser.close();
assert.deepEqual(errors, [], errors.join("\n"));
console.log("Desktop and mobile navigation, search, language, atlas, inquiry and gallery interactions passed.");
