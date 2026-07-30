export const categories = [
  {
    slug: "starches",
    number: "01",
    name: { en: "Starches", tr: "Nişastalar" },
    note: { en: "Functional foundations for food and industrial formulations.", tr: "Gıda ve endüstriyel formülasyonlar için işlevsel temeller." },
    accent: "ivory",
    products: [
      ["Corn Starch", "Mısır Nişastası"],
      ["Potato Starch", "Patates Nişastası"],
      ["Wheat Starch", "Buğday Nişastası"],
      ["Tapioca Starch", "Tapyoka Nişastası"],
      ["Rice Starch", "Pirinç Nişastası"],
      ["Pea Starch", "Bezelye Nişastası"],
    ],
  },
  {
    slug: "dairy",
    number: "02",
    name: { en: "Dairy products", tr: "Süt Ürünleri" },
    note: { en: "Powders and dairy formats for commercial food production.", tr: "Ticari gıda üretimi için toz ve diğer süt ürünü formatları." },
    accent: "blue",
    products: [
      ["Demineralized Whey Powder", "Demineralize Peynir Altı Suyu Tozu"],
      ["Whey Permeate", "Peynir Altı Suyu Permeatı"],
      ["Skimmed Milk Powder", "Yağsız Süt Tozu"],
      ["Full Cream Milk Powder", "Tam Yağlı Süt Tozu"],
      ["Condensed Milk", "Yoğunlaştırılmış Süt"],
      ["Evaporated Milk", "Buharlaştırılmış Süt"],
      ["Cream Powder", "Krema Tozu"],
      ["Butter", "Tereyağı"],
    ],
  },
  {
    slug: "sweeteners",
    number: "03",
    name: { en: "Sweeteners", tr: "Tatlandırıcılar" },
    note: { en: "Granulated, powdered and liquid sweetening systems.", tr: "Kristal, toz ve sıvı tatlandırma sistemleri." },
    accent: "amber",
    products: [
      ["Sugar", "Şeker"],
      ["Dextrose Anhydrous", "Susuz Dekstroz"],
      ["Dextrose Monohydrate", "Dekstroz Monohidrat"],
      ["Agave", "Agave"],
      ["High Fructose Syrup", "Yüksek Fruktozlu Şurup"],
      ["Glucose Syrup", "Glikoz Şurubu"],
      ["Glucose Powder", "Glikoz Tozu"],
      ["Maltitol", "Maltitol"],
      ["Maltodextrin", "Maltodekstrin"],
      ["Sorbitol Liquid", "Sıvı Sorbitol"],
      ["Special Sugars", "Özel Şekerler"],
    ],
  },
  {
    slug: "soy",
    number: "04",
    name: { en: "Soy products", tr: "Soya Ürünleri" },
    note: { en: "Soy-based ingredients across flour, lecithin and textured formats.", tr: "Un, lesitin ve tekstüre formatlarda soya bazlı bileşenler." },
    accent: "green",
    products: [
      ["Defatted Soy Flour", "Yağı Alınmış Soya Unu"],
      ["Full-fat Soy Flour", "Tam Yağlı Soya Unu"],
      ["Soya Lecithin", "Soya Lesitini"],
      ["Textured Soy Protein", "Tekstüre Soya Proteini"],
      ["Soya Meat & Mincemeat", "Soya Eti ve Kıyması"],
    ],
  },
  {
    slug: "oils-fats",
    number: "05",
    name: { en: "Oils & fats", tr: "Yağlar" },
    note: { en: "Industrial fats and cocoa-butter alternatives for defined applications.", tr: "Belirli uygulamalar için endüstriyel yağlar ve kakao yağı alternatifleri." },
    accent: "gold",
    products: [
      ["Industrial Margarine", "Endüstriyel Margarin"],
      ["Vegetable Ghee", "Bitkisel Ghee"],
      ["Refined Coconut Oil", "Rafine Hindistan Cevizi Yağı"],
      ["Shortenings", "Şortening Yağları"],
      ["CBR — Cocoa Butter Replacer", "CBR — Kakao Yağı İkamesi"],
      ["CBS — Cocoa Butter Substitute", "CBS — Kakao Yağı Alternatifi"],
      ["CBE — Cocoa Butter Equivalent", "CBE — Kakao Yağı Eşdeğeri"],
      ["Hydrogenated Palm Kernel Oil", "Hidrojenize Palm Çekirdeği Yağı"],
    ],
  },
  {
    slug: "gluten",
    number: "06",
    name: { en: "Gluten", tr: "Gluten" },
    note: { en: "Wheat-derived functional protein for application-led briefs.", tr: "Uygulama odaklı talepler için buğday kaynaklı işlevsel protein." },
    accent: "wheat",
    products: [["Vital Wheat Gluten", "Vital Buğday Gluteni"]],
  },
  {
    slug: "cocoa",
    number: "07",
    name: { en: "Cocoa products", tr: "Kakao Ürünleri" },
    note: { en: "Core cocoa formats for confectionery, bakery and beverage work.", tr: "Şekerleme, unlu mamuller ve içecek uygulamaları için temel kakao formatları." },
    accent: "cocoa",
    products: [
      ["Cocoa Butter", "Kakao Yağı"],
      ["Cocoa Liquor", "Kakao Likörü"],
      ["Cocoa Powder", "Kakao Tozu"],
      ["Couverture", "Kuvertür"],
    ],
  },
  {
    slug: "gelatin",
    number: "08",
    name: { en: "Gelatin", tr: "Jelatin" },
    note: { en: "Powder and leaf formats, aligned to the buyer’s specification.", tr: "Alıcının spesifikasyonuna göre toz ve yaprak formatları." },
    accent: "rose",
    products: [
      ["Gelatin Powder", "Jelatin Tozu"],
      ["Gelatin Leaves", "Yaprak Jelatin"],
    ],
  },
  {
    slug: "coconut",
    number: "09",
    name: { en: "Coconut products", tr: "Hindistan Cevizi Ürünleri" },
    note: { en: "Oil, desiccated and cream formats for food production.", tr: "Gıda üretimi için yağ, rendelenmiş ve krema formatları." },
    accent: "sand",
    products: [
      ["Virgin Coconut Oil", "Natürel Hindistan Cevizi Yağı"],
      ["Desiccated Coconut", "Rendelenmiş Hindistan Cevizi"],
      ["Coconut Cream", "Hindistan Cevizi Kreması"],
    ],
  },
  {
    slug: "flours",
    number: "10",
    name: { en: "Flours", tr: "Unlar" },
    note: { en: "Cereal and root flours across a practical ingredient portfolio.", tr: "Pratik bir bileşen portföyünde tahıl ve kök unları." },
    accent: "oat",
    products: [
      ["Wheat Flour", "Buğday Unu"],
      ["Gluten Flour", "Gluten Unu"],
      ["Rice Flour", "Pirinç Unu"],
      ["Corn Flour", "Mısır Unu"],
      ["Potato Flour", "Patates Unu"],
    ],
  },
  {
    slug: "coffee",
    number: "11",
    name: { en: "Coffee", tr: "Kahve" },
    note: { en: "Green, ground and soluble coffee formats for commercial briefs.", tr: "Ticari talepler için çekirdek, öğütülmüş ve çözünebilir kahve formatları." },
    accent: "coffee",
    products: [
      ["Coffee Beans", "Kahve Çekirdekleri"],
      ["Ground Coffee", "Öğütülmüş Kahve"],
      ["Spray-dried Instant Coffee", "Sprey Kurutulmuş Hazır Kahve"],
      ["Agglomerated Coffee", "Aglomere Kahve"],
      ["Freeze-dried Coffee", "Dondurularak Kurutulmuş Kahve"],
    ],
  },
  {
    slug: "creamers",
    number: "12",
    name: { en: "Creamers", tr: "Kremalar" },
    note: { en: "Non-dairy creamer and foamer systems for beverage applications.", tr: "İçecek uygulamaları için süt ürünü içermeyen krema ve köpürtücü sistemleri." },
    accent: "cream",
    products: [
      ["Non-dairy Creamers", "Süt Ürünü İçermeyen Kremalar"],
      ["Foamer", "Köpürtücü"],
    ],
  },
];

export function slugifyProduct(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[—–]/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const catalogProducts = categories.flatMap((category) =>
  category.products.map(([en, tr], index) => ({
    slug: slugifyProduct(en),
    name: { en, tr },
    categorySlug: category.slug,
    categoryNumber: category.number,
    position: index + 1,
  })),
);

export function findCatalogProduct(categorySlug, productSlug) {
  return catalogProducts.find(
    (product) =>
      product.categorySlug === categorySlug && product.slug === productSlug,
  );
}

export const destinationCountries = [
  ["tr", "Türkiye", "Türkiye", "europe"],
  ["de", "Germany", "Almanya", "europe"],
  ["nl", "Netherlands", "Hollanda", "europe"],
  ["gb", "United Kingdom", "Birleşik Krallık", "europe"],
  ["fr", "France", "Fransa", "europe"],
  ["it", "Italy", "İtalya", "europe"],
  ["es", "Spain", "İspanya", "europe"],
  ["pl", "Poland", "Polonya", "europe"],
  ["ae", "United Arab Emirates", "Birleşik Arap Emirlikleri", "mena"],
  ["sa", "Saudi Arabia", "Suudi Arabistan", "mena"],
  ["qa", "Qatar", "Katar", "mena"],
  ["eg", "Egypt", "Mısır", "mena"],
  ["ma", "Morocco", "Fas", "mena"],
  ["dz", "Algeria", "Cezayir", "mena"],
  ["za", "South Africa", "Güney Afrika", "africa"],
  ["ke", "Kenya", "Kenya", "africa"],
  ["ng", "Nigeria", "Nijerya", "africa"],
  ["us", "United States", "Amerika Birleşik Devletleri", "americas"],
  ["ca", "Canada", "Kanada", "americas"],
  ["mx", "Mexico", "Meksika", "americas"],
  ["br", "Brazil", "Brezilya", "americas"],
  ["in", "India", "Hindistan", "asia"],
  ["my", "Malaysia", "Malezya", "asia"],
  ["id", "Indonesia", "Endonezya", "asia"],
  ["vn", "Vietnam", "Vietnam", "asia"],
  ["cn", "China", "Çin", "asia"],
  ["jp", "Japan", "Japonya", "asia"],
  ["au", "Australia", "Avustralya", "asia"],
].map(([iso, en, tr, region]) => ({ iso, name: { en, tr }, region }));

export const documentedTouchpoints = [
  {
    iso: "tr",
    city: { en: "Istanbul", tr: "İstanbul" },
    country: { en: "Türkiye", tr: "Türkiye" },
    role: { en: "Coordination office", tr: "Koordinasyon ofisi" },
    detail: {
      en: "The current company website identifies Makendi’s Istanbul office in Kadıköy.",
      tr: "Mevcut şirket sitesi Makendi’nin İstanbul Kadıköy’deki ofisini belirtmektedir.",
    },
    pin: [58, 39],
  },
  {
    iso: "us",
    city: { en: "Chicago", tr: "Chicago" },
    country: { en: "United States", tr: "Amerika Birleşik Devletleri" },
    role: { en: "Documented trade-event touchpoint", tr: "Belgelenmiş fuar temas noktası" },
    detail: {
      en: "IFT Chicago appears in the company’s published event archive.",
      tr: "IFT Chicago, şirketin yayınlanmış etkinlik arşivinde yer almaktadır.",
    },
    pin: [21, 34],
  },
  {
    iso: "my",
    city: { en: "Kuala Lumpur", tr: "Kuala Lumpur" },
    country: { en: "Malaysia", tr: "Malezya" },
    role: { en: "Documented trade-event touchpoint", tr: "Belgelenmiş fuar temas noktası" },
    detail: {
      en: "MIHAS Malaysia appears in the company’s published event archive.",
      tr: "MIHAS Malezya, şirketin yayınlanmış etkinlik arşivinde yer almaktadır.",
    },
    pin: [78, 61],
  },
];

export const companyContact = {
  email: "info@makendi.com",
  phoneDisplay: "+90 216 340 7028",
  phoneHref: "+902163407028",
  address: {
    en: "Hasanpaşa, Lavanta Sk., Etab İş Merkezi, A Blok Kat: 3, Kadıköy, Istanbul 34722, Türkiye",
    tr: "Hasanpaşa, Lavanta Sk., Etab İş Merkezi, A Blok Kat: 3, Kadıköy, İstanbul 34722, Türkiye",
  },
  linkedin: "https://www.linkedin.com/company/makendi-worldwide",
};

export const regionLabels = {
  all: { en: "All destinations", tr: "Tüm destinasyonlar" },
  europe: { en: "Europe", tr: "Avrupa" },
  mena: { en: "MENA", tr: "MENA" },
  africa: { en: "Africa", tr: "Afrika" },
  americas: { en: "Americas", tr: "Amerika" },
  asia: { en: "Asia–Pacific", tr: "Asya–Pasifik" },
};

export function localized(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] || value.en || "";
  }
  return value || "";
}
