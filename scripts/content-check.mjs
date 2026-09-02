import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import {
  catalogProducts,
  categories,
  companyContact,
  destinationCountries,
  documentedTouchpoints,
  findCatalogProduct,
  slugifyProduct,
  originCountries,
} from "../src/data/siteData.js";
import { productSpecification, specificationDocumentUrl } from "../src/data/productExperience.js";

assert.equal(categories.length, 12, "The catalog must contain 12 ingredient families");
assert.equal(
  categories.reduce((total, category) => total + category.products.length, 0),
  60,
  "The catalog must contain 60 published product formats",
);
assert.equal(new Set(categories.map((category) => category.slug)).size, categories.length);
assert.equal(catalogProducts.length, 60, "Every published format needs a product profile");
assert.equal(
  new Set(
    catalogProducts.map(
      (product) => `${product.categorySlug}/${product.slug}`,
    ),
  ).size,
  catalogProducts.length,
  "Every product profile route must be unique",
);

for (const category of categories) {
  assert.match(category.slug, /^[a-z0-9-]+$/);
  assert.ok(category.name.en && category.name.tr, `${category.slug} needs EN/TR names`);
  assert.ok(category.note.en && category.note.tr, `${category.slug} needs EN/TR context`);
  assert.ok(category.products.length > 0, `${category.slug} cannot be empty`);
  for (const product of category.products) {
    assert.equal(product.length, 2, `${category.slug} product needs EN/TR labels`);
    assert.ok(product[0] && product[1]);
  }
}

for (const product of catalogProducts) {
  assert.match(product.slug, /^[a-z0-9-]+$/);
  assert.equal(product.slug, slugifyProduct(product.name.en));
  assert.ok(product.name.en && product.name.tr);
  assert.ok(
    categories.some((category) => category.slug === product.categorySlug),
  );
  assert.equal(
    findCatalogProduct(product.categorySlug, product.slug),
    product,
  );
}

assert.equal(destinationCountries.length, 28, "The destination desk must contain 28 countries");
assert.equal(
  new Set(destinationCountries.map((country) => country.iso)).size,
  destinationCountries.length,
);

for (const country of destinationCountries) {
  assert.ok(country.name.en && country.name.tr, `${country.iso} needs EN/TR names`);
  await access(new URL(`../public/flags/${country.iso}.svg`, import.meta.url));
}

for (const point of documentedTouchpoints) {
  assert.ok(destinationCountries.some((country) => country.iso === point.iso));
  assert.equal(point.pin.length, 2);
}

assert.equal(originCountries.length, 16, "The origin atlas must include every supplied country reference");
assert.equal(new Set(originCountries.map((country) => country.iso)).size, originCountries.length);
for (const country of originCountries) {
  assert.ok(country.name.en && country.name.tr, `${country.iso} needs EN/TR origin names`);
  assert.equal(country.pin.length, 2, `${country.iso} needs an atlas map position`);
  assert.ok(country.products.length > 0, `${country.iso} needs a portfolio pairing`);
  await access(new URL(`../public/flags/${country.iso}.svg`, import.meta.url));
  for (const product of country.products) {
    assert.match(product.to, /^\/products\//, `${country.iso} origin item needs a product route`);
  }
}

for (const product of catalogProducts) {
  const specification = productSpecification(product.categorySlug, product.slug);
  if (specification) {
    const staticUrl = specificationDocumentUrl(specification.source);
    assert.match(staticUrl, /^\/specifications\/source\//);
    await access(resolve("public/specifications/source", specification.source));
  }
}

assert.equal(companyContact.email, "info@makendi.com");
assert.equal(companyContact.phoneHref, "+902163407028");

for (const file of [
  "makendi-industrial-profile.pdf",
  "makendi-brochure.pdf",
  "makendi-catalogue.pdf",
]) {
  await access(new URL(`../public/documents/${file}`, import.meta.url));
}

console.log(`Content verified: ${categories.length} families, ${catalogProducts.length} product profiles, ${originCountries.length} supplied origins, ${destinationCountries.length} inquiry countries and ${documentedTouchpoints.length} archived touchpoints.`);
