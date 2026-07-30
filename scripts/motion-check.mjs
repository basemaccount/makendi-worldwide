import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const errors = [];

const desktop = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
});
desktop.on("pageerror", (error) => errors.push(error.message));
desktop.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

await desktop.goto(base, { waitUntil: "networkidle" });
assert.equal(
  await desktop.evaluate(() => typeof document.startViewTransition),
  "function",
  "The test browser should exercise the native View Transition path",
);
await desktop.waitForFunction(() => document.querySelector("[data-reveal]"));
const revealKinds = await desktop
  .locator("[data-reveal]")
  .evaluateAll((nodes) => [...new Set(nodes.map((node) => node.dataset.reveal))]);
assert.ok(revealKinds.includes("card"), "Card choreography was not assigned");
assert.ok(revealKinds.includes("heading"), "Heading choreography was not assigned");

await Promise.all([
  desktop.waitForURL("**/products"),
  desktop
    .getByRole("navigation", { name: "Main menu" })
    .getByRole("link", { name: "Ingredients", exact: true })
    .click(),
]);
assert.equal(new URL(desktop.url()).pathname, "/products");
assert.equal(
  await desktop.locator("html").evaluate((node) =>
    node.classList.contains("is-transitioning"),
  ),
  true,
  "A supported route change should activate the progressive transition layer",
);
await desktop.waitForFunction(
  () => !document.documentElement.classList.contains("is-transitioning"),
);

await desktop.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await desktop.waitForTimeout(80);
assert.ok(
  Number(
    await desktop
      .locator(".scroll-progress span")
      .evaluate((node) => node.style.getPropertyValue("--scroll-progress")),
  ) > 0.9,
  "Scroll progress should update through the requestAnimationFrame path",
);

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.getByRole("button", { name: "Open menu" }).click();
const menuDelays = await mobile
  .locator(".mobile-menu nav a")
  .evaluateAll((links) =>
    links.map((link) => Number.parseFloat(getComputedStyle(link).transitionDelay) || 0),
  );
assert.ok(
  menuDelays.every(
    (delay, index) => index === 0 || delay > menuDelays[index - 1],
  ),
  `Mobile menu links should enter progressively: ${menuDelays.join(", ")}`,
);

const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const reduced = await reducedContext.newPage();
await reduced.goto(base, { waitUntil: "networkidle" });
await reduced.getByRole("button", { name: "Open menu" }).click();
await reduced
  .locator("#mobile-navigation")
  .getByRole("link", { name: "Destinations" })
  .click();
assert.equal(new URL(reduced.url()).pathname, "/network");
assert.equal(
  await reduced.locator("html").evaluate((node) =>
    node.classList.contains("is-transitioning"),
  ),
  false,
  "Reduced-motion mode must bypass native route animation",
);
assert.equal(
  await reduced.evaluate(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ),
  true,
);

await reducedContext.close();
await browser.close();
assert.deepEqual(errors, [], errors.join("\n"));
console.log(
  "Native route motion, staggered mobile navigation, reveal variants, scroll progress and reduced-motion fallback passed.",
);
