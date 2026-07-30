import { writeFile } from "node:fs/promises";
import {
  catalogProducts,
  categories,
} from "../src/data/siteData.js";

const origin =
  process.env.SITE_ORIGIN || "https://makendi-worldwide.vercel.app";
const staticRoutes = [
  "/",
  "/products",
  "/solutions",
  "/network",
  "/company",
  "/quality",
  "/responsibility",
  "/archive",
  "/contact",
  "/privacy",
];
const categoryRoutes = categories.map(
  (category) => `/products/${category.slug}`,
);
const productRoutes = catalogProducts.map(
  (product) =>
    `/products/${product.categorySlug}/${product.slug}`,
);
const routes = [...staticRoutes, ...categoryRoutes, ...productRoutes];
const lines = routes.map(
  (route) =>
    `  <url><loc>${origin}${route === "/" ? "/" : route}</loc></url>`,
);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...lines,
  "</urlset>",
  "",
].join("\n");

await writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap);
console.log(
  `Generated sitemap with ${routes.length} canonical routes (${productRoutes.length} product profiles).`,
);
