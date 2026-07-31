import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });

async function clickAndWaitForPath(page, locator, pathname) {
  await Promise.all([
    page.waitForURL((url) => url.pathname === pathname),
    locator.click(),
  ]);
}

const slowSearchContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const slowSearchPage = await slowSearchContext.newPage();
let searchActivationArmed = false;
let searchDocumentRequests = 0;
let searchMainFrameNavigations = 0;
await slowSearchPage.addInitScript(() => {
  window.__searchLifecycle = [];
  window.__searchDocumentToken = crypto.randomUUID();
  addEventListener("beforeunload", () => window.__searchLifecycle.push("beforeunload"));
  addEventListener("pagehide", () => window.__searchLifecycle.push("pagehide"));
});
slowSearchPage.on("request", (request) => {
  if (searchActivationArmed && request.resourceType() === "document") searchDocumentRequests += 1;
});
slowSearchPage.on("framenavigated", (frame) => {
  if (searchActivationArmed && frame === slowSearchPage.mainFrame()) searchMainFrameNavigations += 1;
});
await slowSearchPage.route(/\/assets\/DiscoveryDeck-[^/]+\.(?:js|css)(?:\?.*)?$/, async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 1_100));
  await route.continue();
});
await slowSearchPage.goto(base, { waitUntil: "networkidle" });
const originalSearchToken = await slowSearchPage.evaluate(() => window.__searchDocumentToken);
const slowSearchTrigger = slowSearchPage.getByRole("button", { name: "Open quick discovery" });
searchActivationArmed = true;
await slowSearchTrigger.click();
await slowSearchPage.locator(".discovery-boot").waitFor({ state: "visible", timeout: 350 });
assert.equal(await slowSearchTrigger.getAttribute("aria-busy"), "true", "slow search activation did not expose immediate busy feedback");
assert.equal(await slowSearchTrigger.getAttribute("aria-expanded"), "false", "search trigger expanded before its dialog was ready");
await slowSearchPage.locator("#discovery-dialog").waitFor({ state: "attached", timeout: 5_000 });
await slowSearchPage.waitForFunction(() => document.querySelector("#discovery-dialog")?.open === true);
assert.equal(await slowSearchPage.locator(".discovery-boot").count(), 0, "search preparation feedback remained after the dialog opened");
assert.equal(await slowSearchTrigger.getAttribute("aria-busy"), null, "search trigger remained busy after the dialog opened");
assert.equal(await slowSearchTrigger.getAttribute("aria-expanded"), "true", "search trigger did not expose its expanded state");
await slowSearchPage.keyboard.press("Escape");
await slowSearchPage.waitForFunction(() => document.querySelector('[aria-controls="discovery-dialog"]')?.getAttribute("aria-expanded") === "false");
assert.equal(await slowSearchTrigger.getAttribute("aria-expanded"), "false", "search trigger remained expanded after close");
for (let index = 0; index < 3; index += 1) {
  await slowSearchTrigger.click();
  await slowSearchPage.waitForFunction(() => document.querySelector("#discovery-dialog")?.open === true);
  await slowSearchPage.keyboard.press("Escape");
  await slowSearchPage.waitForFunction(() => document.querySelector("#discovery-dialog")?.open === false);
}
assert.equal(searchDocumentRequests, 0, "search activation requested a replacement document");
assert.equal(searchMainFrameNavigations, 0, "search activation caused a main-frame navigation");
assert.equal(await slowSearchPage.evaluate((token) => window.__searchDocumentToken === token, originalSearchToken), true, "search activation replaced the browser document");
assert.equal((await slowSearchPage.evaluate(() => window.__searchLifecycle)).length, 0, "search activation fired an unload lifecycle event");
await slowSearchContext.close();
console.log("Interaction progress: slow first search activation and repeated no-reload lifecycle checked.");

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
desktop.on("pageerror", (error) => errors.push(error.message));
desktop.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

await desktop.goto(base, { waitUntil: "networkidle" });
const discoveryTrigger = desktop.getByRole("button", { name: "Open quick discovery" });
assert.equal(await desktop.locator(".discovery-deck").count(), 0, "portfolio compass mounted before search intent");
await discoveryTrigger.click();
assert.equal(await desktop.locator(".discovery-deck").evaluate((dialog) => dialog.open), true);
const discoveryInput = desktop.getByPlaceholder("Search ingredient, family, destination or page…");
assert.equal(await discoveryInput.evaluate((element) => document.activeElement === element), true, "portfolio compass did not focus its input");
assert.equal(await desktop.locator(".discovery-deck__quick-picks button").count(), 4, "portfolio compass did not expose quick family filters");
await desktop.locator(".discovery-deck__quick-picks button").first().click();
assert.match(await discoveryInput.inputValue(), /starch/i, "portfolio quick filter did not update the query");
await desktop.getByRole("button", { name: "Clear search" }).click();
assert.equal(await discoveryInput.inputValue(), "", "portfolio clear control did not reset the query");
await discoveryInput.fill("freeze");
await desktop.locator('.discovery-deck__results a[href="/products/coffee/freeze-dried-coffee"]').waitFor();
await desktop.waitForFunction(() => document.querySelector(".discovery-deck__results")?.getAttribute("aria-busy") === "false");
assert.equal(await desktop.locator(".discovery-deck__results").getAttribute("aria-busy"), "false", "portfolio results remained busy after deferred filtering");
assert.equal(await desktop.locator('.discovery-deck__results a[href="/products/coffee/freeze-dried-coffee"]').count(), 1);
await clickAndWaitForPath(desktop, desktop.locator('.discovery-deck__results a[href="/products/coffee/freeze-dried-coffee"]'), "/products/coffee/freeze-dried-coffee");
await desktop.goto(base, { waitUntil: "networkidle" });
await desktop.getByRole("button", { name: "Open quick discovery" }).click();
const motionControl = desktop.locator(".discovery-deck__footer > button");
await motionControl.click();
assert.equal(await desktop.locator("html").getAttribute("data-motion"), "calm");
await motionControl.click();
await desktop.keyboard.press("Escape");
assert.equal(await discoveryTrigger.evaluate((element) => document.activeElement === element), true);

const discoveryMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
await discoveryMobile.goto(base, { waitUntil: "networkidle" });
await discoveryMobile.keyboard.press("Control+k");
await discoveryMobile.getByPlaceholder("Search ingredient, family, destination or page…").fill("cocoa");
await discoveryMobile.getByRole("button", { name: "Clear search" }).waitFor();
await discoveryMobile.waitForTimeout(240);
const mobileClearBounds = await discoveryMobile.getByRole("button", { name: "Clear search" }).boundingBox();
const mobileChipBounds = await discoveryMobile.locator(".discovery-deck__quick-picks button").first().boundingBox();
assert.ok(mobileClearBounds?.width >= 43.5 && mobileClearBounds?.height >= 43.5, `portfolio mobile clear control was smaller than 44px: ${JSON.stringify(mobileClearBounds)}`);
assert.ok(mobileChipBounds?.height >= 43.5, "portfolio mobile quick filter was smaller than 44px");
assert.equal(await discoveryMobile.locator(".discovery-deck").evaluate((dialog) => getComputedStyle(dialog, "::backdrop").backdropFilter), "none", "portfolio mobile backdrop retained an expensive blur filter");
assert.equal(await discoveryMobile.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), true, "portfolio compass overflowed on mobile");
assert.match(await discoveryMobile.locator(".discovery-deck__results > a").first().evaluate((element) => getComputedStyle(element).animationName), /mobile/, "portfolio results did not use the mobile motion treatment");
await discoveryMobile.close();

await desktop.goto(base, { waitUntil: "networkidle" });
await clickAndWaitForPath(
  desktop,
  desktop.getByRole("navigation", { name: "Main menu" }).getByRole("link", { name: "Ingredients", exact: true }),
  "/products",
);
assert.equal(new URL(desktop.url()).pathname, "/products");

const search = desktop.getByPlaceholder("Search ingredients or families");
await search.fill("coffee");
await desktop.waitForTimeout(100);
assert.equal(await desktop.locator(".category-card").count(), 1);
await clickAndWaitForPath(desktop, desktop.locator(".category-card"), "/products/coffee");
assert.equal(new URL(desktop.url()).pathname, "/products/coffee");
await clickAndWaitForPath(
  desktop,
  desktop.getByRole("link", { name: "Freeze-dried Coffee", exact: true }),
  "/products/coffee/freeze-dried-coffee",
);
assert.equal(
  new URL(desktop.url()).pathname,
  "/products/coffee/freeze-dried-coffee",
);
await clickAndWaitForPath(
  desktop,
  desktop.getByRole("link", { name: "Ask about this format", exact: true }).first(),
  "/contact",
);
assert.equal(new URL(desktop.url()).pathname, "/contact");
assert.equal(await desktop.locator('select[name="category"]').inputValue(), "coffee");
assert.equal(
  await desktop.locator('select[name="product"]').inputValue(),
  "freeze-dried-coffee",
);
await desktop.goBack();
await desktop.goBack();
await desktop.goBack();
await desktop.goBack();
assert.equal(new URL(desktop.url()).pathname, "/");

await desktop.getByRole("button", { name: "TR" }).click();
await desktop.waitForFunction(
  () => document.querySelector("h1")?.textContent?.includes("Bileşenler"),
);
assert.equal(await desktop.locator("html").getAttribute("lang"), "tr");
assert.match(await desktop.locator("h1").innerText(), /Bileşenler/);
await desktop.getByRole("button", { name: "EN" }).click();

await desktop.goto(`${base}/network`, { waitUntil: "networkidle" });
await desktop.getByRole("button", { name: "Europe" }).click();
await desktop.getByRole("button", { name: "Germany" }).click();
await clickAndWaitForPath(
  desktop,
  desktop.getByRole("link", { name: "Add to inquiry" }),
  "/contact",
);
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
await clickAndWaitForPath(
  mobile,
  mobile.getByRole("link", { name: "Destinations" }),
  "/network",
);
assert.equal(new URL(mobile.url()).pathname, "/network");
assert.equal(await mobile.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "false");

await browser.close();
assert.deepEqual(errors, [], errors.join("\n"));
console.log("Desktop and mobile navigation, search, language, atlas, inquiry and gallery interactions passed.");
