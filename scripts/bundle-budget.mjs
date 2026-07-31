import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const directory = path.join(process.cwd(), "dist", "assets");
const files = await readdir(directory);
const html = await readFile(path.join(process.cwd(), "dist", "index.html"), "utf8");
const criticalAssets = [...html.matchAll(/\/assets\/([^"'?]+\.(?:js|css))/g)].map((match) => match[1]);
const deferredAssets = files.filter((file) => !criticalAssets.includes(file));

async function bytes(extension, candidates) {
  const matching = candidates.filter((file) => file.endsWith(extension));
  assert.ok(matching.length, `No ${extension} build assets found.`);
  let total = 0;
  for (const file of matching) total += (await stat(path.join(directory, file))).size;
  return total;
}

const criticalJs = await bytes(".js", criticalAssets);
const criticalCss = await bytes(".css", criticalAssets);
const deferredJs = await bytes(".js", deferredAssets);
const deferredCss = await bytes(".css", deferredAssets);
const total = criticalJs + criticalCss + deferredJs + deferredCss;

assert.ok(criticalJs <= 340_000, `Critical JavaScript ${criticalJs} bytes exceeds 340000.`);
assert.ok(criticalCss <= 92_000, `Critical CSS ${criticalCss} bytes exceeds 92000.`);
assert.ok(deferredJs <= 12_000, `Deferred JavaScript ${deferredJs} bytes exceeds 12000.`);
assert.ok(deferredCss <= 18_000, `Deferred CSS ${deferredCss} bytes exceeds 18000.`);
assert.ok(total <= 455_000, `All critical and deferred assets total ${total} bytes, exceeding 455000.`);

const kb = (value) => `${(value / 1024).toFixed(1)}KB`;
console.log(`Bundle budgets passed: ${kb(criticalJs)} critical JavaScript and ${kb(criticalCss)} critical CSS; ${kb(deferredJs)} deferred JavaScript and ${kb(deferredCss)} deferred CSS; ${kb(total)} total raw assets.`);
