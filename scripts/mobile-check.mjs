import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { catalogProducts, localized } from "../src/data/siteData.js";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const errors = [];
const primaryRoutes = [
  "/",
  "/products",
  "/products/coffee/freeze-dried-coffee",
  "/solutions",
  "/network",
  "/company",
  "/quality",
  "/responsibility",
  "/archive",
  "/contact",
  "/privacy",
  "/not-a-route",
];
const phoneViewports = [
  { width: 320, height: 700, label: "narrow" },
  { width: 360, height: 800, label: "compact" },
  { width: 390, height: 844, label: "baseline" },
  { width: 430, height: 932, label: "large" },
];

function watch(page) {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
}

async function setLanguage(page, language) {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.evaluate((value) => localStorage.setItem("makendi-language", value), language);
}

async function layoutMetrics(page) {
  return page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
}

for (const viewport of phoneViewports) {
  const page = await browser.newPage({ viewport });
  watch(page);
  for (const language of ["en", "tr"]) {
    await setLanguage(page, language);
    for (const route of primaryRoutes) {
      const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
      assert.ok(response?.ok(), `${route} returned ${response?.status()} at ${viewport.label}`);
      const layout = await layoutMetrics(page);
      assert.ok(
        layout.scrollWidth <= layout.clientWidth + 1 &&
          layout.bodyWidth <= layout.clientWidth + 1,
        `${language.toUpperCase()} ${route} overflows at ${viewport.label}: ${JSON.stringify(layout)}`,
      );
    }
  }
  await page.close();
}

const productPage = await browser.newPage({ viewport: { width: 320, height: 700 } });
watch(productPage);
for (const language of ["en", "tr"]) {
  await setLanguage(productPage, language);
  for (const product of catalogProducts) {
    const route = `/products/${product.categorySlug}/${product.slug}`;
    await productPage.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
    const layout = await layoutMetrics(productPage);
    assert.ok(
      layout.scrollWidth <= layout.clientWidth + 1 &&
        layout.bodyWidth <= layout.clientWidth + 1,
      `${language.toUpperCase()} ${route} overflows at 320px`,
    );
    assert.equal(
      (await productPage.locator("h1").innerText()).trim(),
      localized(product.name, language),
      `${language.toUpperCase()} ${route} has the wrong mobile heading`,
    );
  }
}
await productPage.close();

const interactionPage = await browser.newPage({
  viewport: { width: 320, height: 700 },
  hasTouch: true,
});
watch(interactionPage);
await setLanguage(interactionPage, "en");
await interactionPage.goto(base, { waitUntil: "networkidle" });

const alwaysVisibleTargets = await interactionPage
  .locator(".language-switcher button, .menu-toggle")
  .evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { label: element.textContent.trim(), width: rect.width, height: rect.height };
    }),
  );
for (const target of alwaysVisibleTargets) {
  assert.ok(
    target.width >= 44 && target.height >= 44,
    `Header target is below 44px: ${JSON.stringify(target)}`,
  );
}

await interactionPage.locator(".menu-toggle").click();
await interactionPage.waitForTimeout(450);
assert.equal(await interactionPage.locator(".mobile-menu nav a").count(), 7);
assert.equal(
  await interactionPage.evaluate(() => document.activeElement?.textContent?.trim()),
  "01Ingredients",
  "Opening the mobile menu did not focus its first destination",
);
const menuLayout = await interactionPage.locator(".mobile-menu").evaluate((element) => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    viewportWidth: innerWidth,
    viewportHeight: innerHeight,
  };
});
assert.ok(menuLayout.left >= 0 && menuLayout.right <= menuLayout.viewportWidth + 1);
assert.ok(menuLayout.top >= 0 && menuLayout.bottom <= menuLayout.viewportHeight + 1);
await interactionPage.keyboard.press("Escape");
assert.equal(await interactionPage.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
assert.equal(
  await interactionPage.evaluate(() => document.activeElement?.classList.contains("menu-toggle")),
  true,
  "Closing the mobile menu did not restore focus to its trigger",
);

await interactionPage.goto(`${base}/network`, { waitUntil: "networkidle" });
const atlasTargets = await interactionPage
  .locator(".atlas__pin, .filter-row button, .search-field")
  .evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { className: element.className, width: rect.width, height: rect.height };
    }),
  );
for (const target of atlasTargets) {
  assert.ok(
    target.width >= 44 && target.height >= 44,
    `Atlas target is below 44px: ${JSON.stringify(target)}`,
  );
}
await interactionPage.getByRole("button", { name: "Europe" }).click();
await interactionPage.getByRole("button", { name: "United Kingdom" }).click();
assert.ok(await interactionPage.getByRole("button", { name: "Clear selection" }).isVisible());

await interactionPage.goto(`${base}/archive`, { waitUntil: "networkidle" });
await interactionPage.locator(".archive-tile").first().click();
await interactionPage.waitForTimeout(400);
const dialogLayout = await interactionPage.locator(".gallery-dialog").evaluate((dialog) => {
  const rect = dialog.getBoundingClientRect();
  const targets = [...dialog.querySelectorAll("button, a")].map((target) => {
    const buttonRect = target.getBoundingClientRect();
    return { width: buttonRect.width, height: buttonRect.height };
  });
  return {
    open: dialog.open,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    viewportWidth: innerWidth,
    viewportHeight: innerHeight,
    targets,
  };
});
assert.equal(dialogLayout.open, true);
assert.ok(dialogLayout.left >= 0 && dialogLayout.right <= dialogLayout.viewportWidth + 1);
assert.ok(dialogLayout.top >= 0 && dialogLayout.bottom <= dialogLayout.viewportHeight + 1);
for (const target of dialogLayout.targets) {
  assert.ok(target.width >= 44 && target.height >= 44, "Gallery control is below 44px");
}
const galleryInner = interactionPage.locator(".gallery-dialog__inner");
for (const [type, x, y] of [
  ["touchstart", 270, 350],
  ["touchend", 40, 352],
]) {
  await galleryInner.evaluate(
    (element, eventData) => {
      const event = new Event(eventData.type, { bubbles: true });
      Object.defineProperty(event, "changedTouches", {
        value: [{ clientX: eventData.x, clientY: eventData.y }],
      });
      element.dispatchEvent(event);
    },
    { type, x, y },
  );
}
assert.match(
  await interactionPage.locator(".gallery-dialog__top span").innerText(),
  /^02 \//,
  "A left swipe did not advance the mobile gallery",
);
await interactionPage.getByRole("button", { name: "Zoom image" }).click();
assert.ok(await interactionPage.locator(".gallery-dialog__canvas").evaluate((element) => element.classList.contains("is-zoomed")));
assert.ok(await interactionPage.getByRole("link", { name: "Download image" }).getAttribute("href"));
await interactionPage.getByRole("button", { name: "Reset image zoom" }).click();
await interactionPage.getByRole("button", { name: "Close gallery" }).click();

await interactionPage.goto(`${base}/contact`, { waitUntil: "networkidle" });
await interactionPage.locator('button[type="submit"]').click();
await interactionPage.waitForFunction(
  () => document.activeElement?.getAttribute("name") === "name",
);
assert.equal(
  await interactionPage.evaluate(() => document.activeElement?.getAttribute("name")),
  "name",
  "Invalid mobile form submission did not focus the first incomplete field",
);
const formTargets = await interactionPage
  .locator(
    ".inquiry-form input:not([type='checkbox']), .inquiry-form select, .inquiry-form textarea, .form-submit button, .direct-contact a",
  )
  .evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { name: element.getAttribute("name") || element.textContent.trim(), height: rect.height };
    }),
  );
for (const target of formTargets) {
  assert.ok(target.height >= 44, `Form/contact target is below 44px: ${JSON.stringify(target)}`);
}

const landscape = await browser.newPage({ viewport: { width: 844, height: 390 } });
watch(landscape);
await landscape.goto(base, { waitUntil: "networkidle" });
await landscape.locator(".menu-toggle").click();
await landscape.waitForTimeout(450);
const landscapeMenu = await landscape.locator(".mobile-menu").evaluate((element) => ({
  clientHeight: element.clientHeight,
  scrollHeight: element.scrollHeight,
  rect: element.getBoundingClientRect().toJSON(),
  viewportHeight: innerHeight,
  viewportWidth: innerWidth,
}));
assert.ok(landscapeMenu.scrollHeight <= landscapeMenu.clientHeight + 1);
assert.ok(landscapeMenu.rect.right <= landscapeMenu.viewportWidth + 1);
assert.ok(landscapeMenu.rect.bottom <= landscapeMenu.viewportHeight + 1);
await landscape.close();

await interactionPage.close();
await browser.close();

assert.deepEqual(errors, [], errors.join("\n"));
console.log(
  `Mobile regression checks passed across ${phoneViewports.length} phone sizes, ${primaryRoutes.length} routes, ${catalogProducts.length} bilingual product profiles, overlays, forms, atlas controls, and landscape navigation.`,
);
