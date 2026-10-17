const visualByCategory = {
  starches: "/images/families/starches.webp",
  dairy: "/images/families/dairy.webp",
  sweeteners: "/images/families/sweeteners.webp",
  soy: "/images/families/soy.webp",
  "oils-fats": "/images/families/oils-fats.webp",
  gluten: "/images/families/gluten.webp",
  cocoa: "/images/families/cocoa.webp",
  gelatin: "/images/families/gelatin.webp",
  coconut: "/images/families/coconut.webp",
  flours: "/images/families/flours.webp",
  coffee: "/images/families/coffee.webp",
  creamers: "/images/families/creamers.webp",
};

export function categoryCardVisual(categorySlug) {
  return `/images/families/${categorySlug}-card.webp`;
}

export function productVisual(categorySlug, productSlug) {
  if (productSlug) {
    return `/images/products/${productSlug}.webp`;
  }
  return visualByCategory[categorySlug] || "/images/ingredients-hero.webp";
}

export function specificationDocumentUrl(filename) {
  return `/specifications/source/${encodeURIComponent(filename)}`;
}

const specifications = {
  "dairy/demineralized-whey-powder": {
    source: "50% Demineralized Whey Powder.docx",
    title: { en: "50% Demineralized Whey Powder", tr: "%50 Demineralize Peynir Altı Suyu Tozu" },
    highlights: [
      ["Origin", "Türkiye"],
      ["Protein", "min. 7%"],
      ["Lactose", "min. 75%"],
      ["Moisture", "max. 2%"],
    ],
  },
  "dairy/skimmed-milk-powder": {
    source: "Skimmed Milk Powder.docx",
    title: { en: "Skimmed Milk Powder", tr: "Yağsız Süt Tozu" },
    highlights: [["Fat", "max. 1.25%"], ["Protein", "min. 34%"], ["Moisture", "max. 4%"]],
  },
  "dairy/full-cream-milk-powder": {
    source: "Instant Full Cream Milk Powder.docx",
    title: { en: "Instant Full Cream Milk Powder", tr: "Instant Tam Yağlı Süt Tozu" },
    highlights: [["Fat", "min. 26%"], ["Protein", "min. 24%"], ["Moisture", "max. 4%"]],
  },
  "dairy/condensed-milk": {
    source: "Sweetened Condensed Milk Full Cream 8%.docx",
    title: { en: "Sweetened Condensed Milk Full Cream 8%", tr: "%8 Tam Yağlı Şekerli Yoğunlaştırılmış Süt" },
    highlights: [["Milk fat", "min. 8%"], ["Total solids", "min. 28%"], ["Sucrose", "min. 42%"]],
  },
  "dairy/evaporated-milk": {
    source: "Makendi Evaporated Milk 7.5%.docx",
    title: { en: "Evaporated Milk 7.5%", tr: "%7,5 Buharlaştırılmış Süt" },
    highlights: [["Fat", "min. 7.5%"], ["Total solids", "min. 25%"], ["Protein", "min. 6%"]],
  },
  "sweeteners/dextrose-monohydrate": {
    source: "Makendi Dextrose Monohydrate DXM-104.docx",
    title: { en: "Dextrose Monohydrate DXM-104", tr: "Dekstroz Monohidrat DXM-104" },
    highlights: [["Purity", "min. 99.5%"], ["Moisture", "max. 9%"], ["DE", "min. 99.5"]],
  },
  "sweeteners/high-fructose-syrup": {
    source: "Makendi Fructose Syrup.docx",
    title: { en: "Fructose Syrup", tr: "Fruktoz Şurubu" },
    highlights: [["Dry matter", "77–79%"], ["Fructose", "42–44%"], ["pH", "3.3–4.5"]],
  },
  "sweeteners/glucose-syrup": {
    source: "Makendi Glucose Syrup S 461.docx",
    title: { en: "Glucose Syrup S 461", tr: "Glikoz Şurubu S 461" },
    highlights: [["Dry matter", "80–82%"], ["DE", "39–41"], ["pH", "4.0–6.0"]],
  },
  "oils-fats/vegetable-ghee": {
    source: "Pure Butter Ghee.docx",
    title: { en: "Pure Butter Ghee", tr: "Saf Tereyağı Ghee" },
    highlights: [["Milk fat", "min. 99.5%"], ["Moisture", "max. 0.5%"], ["Free fatty acids", "max. 0.3%"]],
  },
  "gluten/vital-wheat-gluten": {
    source: "Vital Wheat Gluten.docx",
    title: { en: "Vital Wheat Gluten", tr: "Vital Buğday Gluteni" },
    highlights: [["Protein", "min. 75%"], ["Moisture", "max. 9%"], ["Ash", "max. 1%"]],
  },
  "cocoa/cocoa-powder": {
    source: "Natural Cocoa Powder NP1.docx",
    title: { en: "Natural Cocoa Powder NP1", tr: "Natürel Kakao Tozu NP1" },
    highlights: [["pH", "5.5 ± 0.4"], ["Fat", "10–12%"], ["Moisture", "max. 5%"]],
  },
  "coconut/desiccated-coconut": {
    source: "DESICCATED COCONUT – FINE GRADE.docx",
    title: { en: "Desiccated Coconut — Fine Grade", tr: "Rendelenmiş Hindistan Cevizi — İnce Tip" },
    highlights: [["Fat", "min. 63%"], ["Moisture", "max. 3%"], ["Particle size", "Fine grade"]],
  },
  "flours/rice-flour": {
    source: "Rice Flour SP 01.docx",
    title: { en: "Rice Flour SP 01", tr: "Pirinç Unu SP 01" },
    highlights: [["Moisture", "max. 13%"], ["Protein", "max. 8%"], ["Particle size", "100% through 100 mesh"]],
  },
  "coffee/spray-dried-instant-coffee": {
    source: "Makendi Spray Dried Coffee Powder 09013.docx",
    title: { en: "Spray Dried Coffee Powder 09013", tr: "Sprey Kurutulmuş Kahve Tozu 09013" },
    highlights: [["Moisture", "max. 4.0%"], ["Caffeine", "min. 2.25%"], ["Shelf life", "at least 18 months"]],
  },
  "coffee/agglomerated-coffee": {
    source: "Makendi Agglomerated Instant Coffee AG C1.docx",
    title: { en: "Agglomerated Instant Coffee AG C1", tr: "Aglomere Hazır Kahve AG C1" },
    highlights: [["Moisture", "max. 3.5%"], ["Acidity", "4.75–5.25"], ["Bulk density", "140–190 g/L"]],
  },
  "coffee/freeze-dried-coffee": {
    source: "Makendi Freeze Dried Coffee Extract 6413.docx",
    title: { en: "Freeze Dried Coffee Extract 6413", tr: "Dondurularak Kurutulmuş Kahve Ekstresi 6413" },
    highlights: [["Moisture", "max. 4%"], ["pH", "4.5–5.2"], ["Shelf life", "12 months"]],
  },
  "creamers/non-dairy-creamers": {
    source: "Non-Dairy Creamer 35PNDC.docx",
    title: { en: "Non-Dairy Creamer 35PNDC", tr: "Süt Ürünü İçermeyen Krema 35PNDC" },
    highlights: [["Fat", "34–37%"], ["Moisture", "max. 3%"], ["Protein", "max. 3%"]],
  },
};

export function productSpecification(categorySlug, productSlug) {
  return specifications[`${categorySlug}/${productSlug}`] || null;
}

// Every source record supplied in the current technical-sheet folder is kept
// discoverable in its relevant family. The title remains the source title so a
// buyer can match it precisely to the original document they receive.
const sourceFilesByCategory = {
  dairy: [
    "50% Demineralized Whey Powder.docx",
    "70% Demineralized Whey Powder 70-11.docx",
    "70% Demineralized Whey Powder 70-7.docx",
    "80% Demineralized Sweet Whey Powder.docx",
    "90% Demineralized Whey Powder.docx",
    "Fat Filled Milk Powder.docx",
    "Instant Full Cream Milk Powder.docx",
    "Makendi Evaporated Milk 7.5%.docx",
    "Milk Protein Concentrate Powder MPC85.docx",
    "MW_80pct_Demineralized_Sweet_Whey_Powder_MAK-80_Specification_SCG40_Layout_Corrected.docx",
    "Skimmed Milk Powder.docx",
    "Sweet butter, 82.5%.docx",
    "Sweetened Condensed Milk Full Cream 8%.docx",
    "Whole Milk Powder.docx",
  ],
  sweeteners: [
    "HBSO MAKENDI GLUCOSE SYRUP SCG 40.docx",
    "Makendi Crystalline Fructose C.docx",
    "Makendi Crystalline Fructose M.docx",
    "Makendi Dextrose Monohydrate 99.docx",
    "Makendi Dextrose Monohydrate DXM-104.docx",
    "Makendi Fructose Syrup.docx",
    "Makendi Glucose Syrup S 461.docx",
    "Makendi Glucose Syrup S 471.docx",
    "Makendi Liquid Glucose.docx",
    "Sorbitol Powder.docx",
  ],
  "oils-fats": ["Pure Butter Ghee.docx"],
  gluten: ["Vital Wheat Gluten.docx"],
  cocoa: [
    "Alkalized Medium Brown Cocoa Powder LB1.docx",
    "Alkalized Redish Dark Brown Cocoa Powder RB1.docx",
    "Alkalized Very Dark Brown Cocoa Powder DP1.docx",
    "Natural Cocoa Powder NP1.docx",
  ],
  coconut: [
    "DESICCATED COCONUT – FINE GRADE.docx",
    "DESICCATED COCONUT – MEDIUM GRADE.docx",
    "DESICCATED COCONUT – Reduced Fat Medium.docx",
    "Desiccated Coconut – Reduced Fat Fine.docx",
  ],
  flours: [
    "Extra Rice Flour SP 02.docx",
    "Rice Flour SP 01.docx",
  ],
  coffee: [
    "Makendi Agglomerated Instant Coffee AG C1.docx",
    "Makendi Freeze Dried Coffee Extract 6413.docx",
    "Makendi Spray Dried Coffee Powder 09013.docx",
  ],
  creamers: [
    "Non-Dairy Creamer  35PNDC Extra.docx",
    "Non-Dairy Creamer 26PNDC Extra.docx",
    "Non-Dairy Creamer 26PNDC.docx",
    "Non-Dairy Creamer 30PNDC Extra.docx",
    "Non-Dairy Creamer 30PNDC.docx",
    "Non-Dairy Creamer 32PNDC Extra.docx",
    "Non-Dairy Creamer 32PNDC.docx",
    "Non-Dairy Creamer 35PNDC.docx",
  ],
};

export function categorySpecificationDocuments(categorySlug) {
  return sourceFilesByCategory[categorySlug] || [];
}
