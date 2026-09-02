const visualByCategory = {
  starches: "/images/archive/gallery-corn-starch.webp",
  dairy: "/images/ingredients-hero.webp",
  sweeteners: "/images/archive/gallery-dextrose.webp",
  soy: "/images/archive/gallery-production-01.webp",
  "oils-fats": "/images/archive/gallery-production-02.webp",
  gluten: "/images/archive/gallery-production-03.webp",
  cocoa: "/images/archive/gallery-cocoa-pallet.webp",
  gelatin: "/images/archive/gallery-f42.webp",
  coconut: "/images/archive/gallery-trade-01.webp",
  flours: "/images/archive/gallery-corn-starch.webp",
  coffee: "/images/archive/gallery-spray-coffee.webp",
  creamers: "/images/archive/gallery-creamer.webp",
};

const visualByProduct = {
  "coffee/spray-dried-instant-coffee": "/images/archive/gallery-spray-coffee.webp",
  "coffee/agglomerated-coffee": "/images/archive/gallery-product-01.webp",
  "coffee/freeze-dried-coffee": "/images/archive/gallery-product-01.webp",
  "creamers/non-dairy-creamers": "/images/archive/gallery-creamer.webp",
  "sweeteners/dextrose-monohydrate": "/images/archive/gallery-dextrose.webp",
  "cocoa/cocoa-powder": "/images/archive/gallery-cocoa-pallet.webp",
};

export function productVisual(categorySlug, productSlug) {
  return (
    visualByProduct[`${categorySlug}/${productSlug}`] ||
    visualByCategory[categorySlug] ||
    "/images/ingredients-hero.webp"
  );
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
