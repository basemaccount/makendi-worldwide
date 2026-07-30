import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Coffee,
  Download,
  ExternalLink,
  Factory,
  FileText,
  Globe2,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Wheat,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "./router.jsx";
import ArchiveGallery from "./components/ArchiveGallery.jsx";
import ExperienceLayer from "./components/ExperienceLayer.jsx";
import InquiryForm from "./components/InquiryForm.jsx";
import WorldAtlas from "./components/WorldAtlas.jsx";
import {
  catalogProducts,
  categories,
  companyContact,
  destinationCountries,
  findCatalogProduct,
  localized,
} from "./data/siteData.js";

const copy = {
  en: {
    nav: {
      products: "Ingredients",
      solutions: "How we work",
      network: "Destinations",
      company: "Company",
      quality: "Quality",
      contact: "Start an inquiry",
    },
    common: {
      explore: "Explore the portfolio",
      view: "View family",
      inquiry: "Start an inquiry",
      discuss: "Discuss your brief",
      products: "listed ingredient formats",
      categories: "ingredient families",
      languages: "working languages",
      scroll: "Scroll to explore",
      back: "Back to ingredients",
      read: "Read more",
      verified: "Verified public information",
    },
    home: {
      eyebrow: "Food ingredients · worldwide coordination",
      titleA: "Ingredients",
      titleB: "without the",
      titleC: "guesswork.",
      intro:
        "Makendi connects commercial food briefs with ingredient sourcing, production coordination, quality alignment and destination planning.",
      brief: "Build your ingredient brief",
      portfolio: "Explore all ingredients",
      serviceLabel: "A coordinated ingredient journey",
      serviceTitle: "From requirement to destination, one clearer conversation.",
      serviceIntro:
        "Start with the application, product format and market. Makendi coordinates the commercial conversation around those facts—without making assumptions for you.",
      familiesEyebrow: "Ingredient portfolio",
      familiesTitle: "Twelve families. One connected view.",
      familiesIntro:
        "Browse the product formats published by Makendi. Technical parameters, commercial terms and destination requirements are confirmed through inquiry.",
      allFamilies: "See all 12 families",
      networkEyebrow: "Destination thinking",
      networkTitle: "Flags are a starting point—not a promise.",
      networkIntro:
        "Use the country desk to define where the product needs to go. The team can then clarify routing, documentation and availability for that specific brief.",
      networkLink: "Open the destination desk",
      qualityEyebrow: "Quality alignment",
      qualityTitle: "The specification stays at the centre.",
      qualityIntro:
        "A better sourcing conversation begins with an exact application and a shared understanding of the requested product. Quality coordination is built around the agreed brief.",
      qualityLink: "See the quality approach",
      ctaTitle: "Have a product and destination in mind?",
      ctaBody:
        "Share the ingredient family, intended application and market. We’ll turn it into a clearer commercial conversation.",
    },
    products: {
      eyebrow: "Portfolio index",
      title: "Find the right ingredient family.",
      intro:
        "Search across the formats published in Makendi’s current catalog. Product specifications and commercial availability are confirmed individually.",
      search: "Search ingredients or families",
      all: "All families",
      noResults: "No ingredients match this search.",
      results: "matching families",
      productList: "Published product formats",
      discuss: "Ask about this family",
      sourceNote:
        "This page organizes product names from Makendi’s existing public catalog. It does not add unverified grades, certifications, packaging or performance claims.",
    },
    detail: {
      eyebrow: "Ingredient family",
      formats: "Published formats",
      route: "Destination-aware inquiry",
      routeText:
        "Tell us which format you need, how you intend to use it and where it needs to go. The team can then clarify specifications, documentation and commercial options.",
      notSpecs: "Need technical specifications?",
      notSpecsText:
        "Specifications vary by requested product and brief. Send the exact application instead of relying on a generic online data sheet.",
      related: "Continue exploring",
    },
    productProfile: {
      eyebrow: "Published catalog format",
      back: "Back to ingredient family",
      family: "Ingredient family",
      position: "Portfolio reference",
      published: "Published catalog name",
      intro:
        "This format appears in Makendi’s public ingredient portfolio. Its exact grade, origin, packaging, documentation and commercial fit are confirmed against the buyer’s brief.",
      briefEyebrow: "A useful starting point",
      briefTitle: "Build the request around the real application.",
      briefText:
        "A specific product name is only the first step. Include the intended use, requested parameters, destination and documentation needs so the team can respond without assumptions.",
      briefPoints: [
        ["Application", "Describe the recipe, process or industrial use."],
        ["Requirements", "Share the technical parameters and documents you need confirmed."],
        ["Destination", "Identify the receiving market for routing and compliance context."],
      ],
      request: "Ask about this format",
      archive: "Review source library",
      boundaryEyebrow: "Accuracy boundary",
      boundaryTitle: "Current confirmation comes before commitment.",
      boundaryText:
        "This profile confirms that the format is listed in Makendi’s published portfolio. It does not represent live stock, a fixed specification, certification, price, minimum order, lead time or delivery promise.",
      related: "Related formats in this family",
      relatedIntro: "Continue within the same ingredient family.",
    },
    solutions: {
      eyebrow: "Working model",
      title: "A disciplined route from brief to destination.",
      intro:
        "Makendi’s existing company profile describes international procurement, production or contract-factory coordination, quality control, import and local distribution, storage and transport. The new experience makes that sequence easier to understand.",
      steps: [
        ["01", "Define", "Share the ingredient, application, requested format and destination."],
        ["02", "Align", "Clarify the specification, documentation and commercial parameters."],
        ["03", "Coordinate", "Connect procurement or production conversations to the agreed brief."],
        ["04", "Prepare", "Plan the destination requirements, storage and transport conversation."],
      ],
      trSteps: [],
      guardrail: "Every brief remains specific.",
      guardrailText:
        "This site does not invent stock, origin, minimum order quantities, lead times, certifications or logistics coverage. Those details are confirmed for the actual request.",
      procurement: "Procurement coordination",
      procurementText:
        "A structured product request gives sourcing conversations a consistent starting point.",
      production: "Production context",
      productionText:
        "Where relevant, the published Makendi model includes production and contract-factory coordination.",
      logistics: "Destination planning",
      logisticsText:
        "Routing and document questions are connected to the intended market rather than treated as an afterthought.",
    },
    network: {
      eyebrow: "Country & destination desk",
      title: "Put the market into the brief.",
      intro:
        "Real flags, a responsive map and destination filters make the global conversation tangible. The distinction between documented touchpoints and selectable destinations remains explicit.",
      noteTitle: "How to read this atlas",
      noteA: "Map markers",
      noteAText: "Locations found in Makendi’s current public company or event information.",
      noteB: "Country flags",
      noteBText:
        "Markets that a visitor can select when preparing an inquiry; availability and routing are not pre-confirmed.",
    },
    company: {
      eyebrow: "Company",
      title: "International coordination, presented with clarity.",
      intro:
        "Makendi Worldwide’s public company profile describes a commercial model spanning international ingredient procurement, production coordination, quality control, imports, distribution, storage and transport.",
      factsTitle: "What this rebuild preserves",
      facts: [
        "The full twelve-family ingredient portfolio",
        "The verified Istanbul office and public contact details",
        "The documented international procurement and coordination model",
        "A direct, bilingual path from interest to inquiry",
      ],
      principleTitle: "What it improves",
      principles: [
        ["Clarity", "A focused information architecture replaces a long, repetitive catalog page."],
        ["Confidence", "Verified statements are separated from destination options and future possibilities."],
        ["Access", "English and Turkish, responsive layouts, keyboard navigation and reduced-motion support."],
        ["Momentum", "Every product and country selection can flow into a structured inquiry."],
      ],
    },
    quality: {
      eyebrow: "Quality approach",
      title: "Make the requested specification visible.",
      intro:
        "The public Makendi model includes quality control. This rebuild explains the role of a clear brief without manufacturing technical claims that belong in product-specific documentation.",
      stages: [
        ["Brief", "Capture the requested product, application and market context."],
        ["Specification", "Align the technical and commercial parameters for the exact request."],
        ["Coordination", "Keep the agreed requirements connected to sourcing or production discussions."],
        ["Confirmation", "Confirm documentation, availability and destination details before commitment."],
      ],
      boundaryTitle: "A useful boundary",
      boundaryText:
        "The website is an information and inquiry experience—not a public stock list, certification register, quotation tool or logistics guarantee.",
    },
    contact: {
      eyebrow: "Contact Makendi",
      title: "A better inquiry starts with useful context.",
      intro:
        "Use the structured form or contact the Istanbul office directly. No form data is stored by this website.",
      office: "Istanbul office",
      address: "Address",
      email: "Email",
      phone: "Phone",
    },
    privacy: {
      eyebrow: "Privacy & inquiry notice",
      title: "A lightweight, transparent contact experience.",
      intro:
        "The current version of this site does not transmit or store inquiry-form data on a web server. Submitting the form prepares a message in the visitor’s own email application.",
      sections: [
        [
          "What happens when you submit",
          "The information you enter is placed into a mailto link on your device. Your email provider—not this website—handles the draft and any message you choose to send.",
        ],
        [
          "Analytics and tracking",
          "This release does not include third-party analytics, advertising pixels or cross-site tracking scripts.",
        ],
        [
          "External services",
          "Email, telephone and LinkedIn links open services controlled by their respective providers. Their own privacy terms apply.",
        ],
        [
          "Commercial information",
          "The portfolio is informational. An inquiry does not confirm price, stock, specification, certification, lead time, delivery or a contractual commitment.",
        ],
      ],
    },
    responsibility: {
      eyebrow: "Responsibility archive",
      title: "Keep the intention. Clarify the evidence.",
      intro:
        "Makendi’s existing website publishes a responsibility statement centred on community activity, local partners, environmental care, safety, integrity, respect, wellness and education. This rebuild retains that statement as published context without adding unsupported impact metrics.",
      statementTitle: "The published commitment",
      statement:
        "Makendi Worldwide states that it participates in social activities in lower-income countries, works with local partners and considers environmental protection, community outreach, wellness and educational initiatives.",
      values: [
        ["Safety", "Named as a core value in the existing public responsibility statement."],
        ["Integrity", "Retained as a stated principle—not converted into an unverified performance claim."],
        ["Respect", "Presented alongside local partnership and community context."],
      ],
      boundaryTitle: "Responsible communication needs a boundary.",
      boundary:
        "No certification, emissions figure, donation total, beneficiary count, traceability percentage or quantified environmental result is published here unless Makendi supplies current supporting evidence.",
    },
    archive: {
      eyebrow: "Source library & history",
      title: "The existing site, reorganized—not erased.",
      intro:
        "Company documents, historical event records and selected gallery material from the current Makendi website remain available in a clearer archive.",
      documentsTitle: "Official source documents",
      documentsIntro:
        "These files are migrated from the existing site and labelled as archived source material. Product details and contact information inside may require current confirmation.",
      open: "Open document",
      download: "Download PDF",
      archived: "Archived source",
      documents: [
        ["Industrial profile", "Company and industrial overview", "makendi-industrial-profile.pdf", "18 MB"],
        ["Company brochure", "Short-form company introduction", "makendi-brochure.pdf", "612 KB"],
        ["Product catalogue", "Historical product and technical catalogue", "makendi-catalogue.pdf", "13 MB"],
      ],
      eventsTitle: "Published event history",
      eventsIntro:
        "Three locations appear in Makendi’s public event archive. They are historical touchpoints, not statements about current offices or active events.",
      events: [
        ["tr", "FI Istanbul · Türkiye", "A published event entry connecting Istanbul with regional food-and-beverage markets.", "event-istanbul"],
        ["us", "IFT16 · Chicago, USA", "A historical trade-event listing published by Makendi.", "event-chicago"],
        ["my", "MIHAS · Kuala Lumpur, Malaysia", "A historical event entry documenting an Asia–Pacific customer touchpoint.", "event-malaysia"],
      ],
    },
    notFound: {
      eyebrow: "404",
      title: "This route is not part of the portfolio.",
      intro: "Return to the ingredient index or start a new inquiry.",
      home: "Return home",
    },
    footer: {
      statement: "Food ingredients, clearly coordinated.",
      explore: "Explore",
      contact: "Contact",
      legal: "Legal",
      privacy: "Privacy & inquiry notice",
      note:
        "Product and destination information is indicative. Specifications, availability, commercial terms and routing are confirmed per inquiry.",
      rights: "Makendi Worldwide. All rights reserved.",
    },
  },
  tr: {
    nav: {
      products: "Ürünler",
      solutions: "Çalışma modelimiz",
      network: "Destinasyonlar",
      company: "Şirket",
      quality: "Kalite",
      contact: "Talep oluştur",
    },
    common: {
      explore: "Portföyü inceleyin",
      view: "Ürün ailesini aç",
      inquiry: "Talep oluştur",
      discuss: "Talebinizi paylaşın",
      products: "listelenen ürün formatı",
      categories: "ürün ailesi",
      languages: "çalışma dili",
      scroll: "Keşfetmek için kaydırın",
      back: "Ürünlere dön",
      read: "Devamını oku",
      verified: "Doğrulanmış kamu bilgileri",
    },
    home: {
      eyebrow: "Gıda bileşenleri · dünya çapında koordinasyon",
      titleA: "Bileşenler.",
      titleB: "Belirsizlik",
      titleC: "olmadan.",
      intro:
        "Makendi; ticari gıda taleplerini ürün tedariki, üretim koordinasyonu, kalite uyumu ve destinasyon planlamasıyla buluşturur.",
      brief: "Ürün talebinizi oluşturun",
      portfolio: "Tüm ürünleri inceleyin",
      serviceLabel: "Koordineli ürün yolculuğu",
      serviceTitle: "İhtiyaçtan destinasyona, daha net tek bir görüşme.",
      serviceIntro:
        "Uygulama, ürün formatı ve hedef pazarla başlayın. Makendi, varsayımda bulunmadan ticari görüşmeyi bu bilgiler etrafında koordine eder.",
      familiesEyebrow: "Ürün portföyü",
      familiesTitle: "On iki aile. Tek ve bağlantılı görünüm.",
      familiesIntro:
        "Makendi tarafından yayınlanan ürün formatlarını inceleyin. Teknik parametreler, ticari koşullar ve destinasyon gereksinimleri talep üzerinden teyit edilir.",
      allFamilies: "12 ürün ailesinin tamamı",
      networkEyebrow: "Destinasyon yaklaşımı",
      networkTitle: "Bayraklar bir başlangıç noktasıdır; taahhüt değildir.",
      networkIntro:
        "Ürünün ulaşması gereken pazarı ülke masasından seçin. Ekip, ilgili talep için rota, belge ve uygunluk konularını netleştirebilir.",
      networkLink: "Destinasyon masasını aç",
      qualityEyebrow: "Kalite uyumu",
      qualityTitle: "Spesifikasyon her zaman merkezde.",
      qualityIntro:
        "Daha iyi bir tedarik görüşmesi; kesin bir uygulama tanımı ve talep edilen ürünün ortak biçimde anlaşılmasıyla başlar. Kalite koordinasyonu, üzerinde uzlaşılan talep etrafında yürütülür.",
      qualityLink: "Kalite yaklaşımını inceleyin",
      ctaTitle: "Aklınızda bir ürün ve destinasyon var mı?",
      ctaBody:
        "Ürün ailesini, kullanım amacını ve pazarı paylaşın. Bu bilgileri daha net bir ticari görüşmeye dönüştürelim.",
    },
    products: {
      eyebrow: "Portföy dizini",
      title: "Doğru ürün ailesini bulun.",
      intro:
        "Makendi’nin mevcut kataloğunda yayınlanan formatlar arasında arama yapın. Ürün spesifikasyonları ve ticari uygunluk her talep için ayrıca teyit edilir.",
      search: "Ürün veya ürün ailesi ara",
      all: "Tüm aileler",
      noResults: "Bu aramayla eşleşen ürün bulunamadı.",
      results: "eşleşen ürün ailesi",
      productList: "Yayınlanan ürün formatları",
      discuss: "Bu ürün ailesini sorun",
      sourceNote:
        "Bu sayfa, Makendi’nin mevcut kamuya açık kataloğundaki ürün adlarını düzenler. Doğrulanmamış kalite sınıfı, sertifika, ambalaj veya performans iddiası eklemez.",
    },
    detail: {
      eyebrow: "Ürün ailesi",
      formats: "Yayınlanan formatlar",
      route: "Destinasyon odaklı talep",
      routeText:
        "İhtiyacınız olan formatı, kullanım amacını ve hedef pazarı paylaşın. Ekip; spesifikasyonları, belgeleri ve ticari seçenekleri bu bilgiler üzerinden netleştirebilir.",
      notSpecs: "Teknik spesifikasyona mı ihtiyacınız var?",
      notSpecsText:
        "Spesifikasyonlar talep edilen ürüne ve projeye göre değişir. Genel bir çevrim içi doküman yerine kesin uygulamayı bize iletin.",
      related: "Keşfetmeye devam edin",
    },
    productProfile: {
      eyebrow: "Yayınlanmış katalog formatı",
      back: "Ürün ailesine dön",
      family: "Ürün ailesi",
      position: "Portföy referansı",
      published: "Yayınlanmış katalog adı",
      intro:
        "Bu format, Makendi’nin kamuya açık ürün portföyünde yer almaktadır. Kesin kalite sınıfı, menşe, ambalaj, belge gereksinimleri ve ticari uygunluk alıcının talebine göre teyit edilir.",
      briefEyebrow: "Doğru başlangıç",
      briefTitle: "Talebi gerçek uygulama etrafında oluşturun.",
      briefText:
        "Belirli bir ürün adı yalnızca ilk adımdır. Ekibin varsayımda bulunmadan yanıt verebilmesi için kullanım amacını, istenen parametreleri, destinasyonu ve belge ihtiyaçlarını paylaşın.",
      briefPoints: [
        ["Uygulama", "Reçeteyi, prosesi veya endüstriyel kullanım amacını açıklayın."],
        ["Gereksinimler", "Teyit edilmesini istediğiniz teknik parametreleri ve belgeleri paylaşın."],
        ["Destinasyon", "Rota ve mevzuat bağlamı için hedef pazarı belirtin."],
      ],
      request: "Bu format hakkında bilgi alın",
      archive: "Kaynak kütüphanesini inceleyin",
      boundaryEyebrow: "Doğruluk sınırı",
      boundaryTitle: "Taahhütten önce güncel teyit gerekir.",
      boundaryText:
        "Bu profil, formatın Makendi’nin yayınlanmış portföyünde listelendiğini teyit eder. Canlı stok, sabit spesifikasyon, sertifika, fiyat, minimum sipariş, teslim süresi veya teslimat taahhüdü anlamına gelmez.",
      related: "Bu ailedeki ilgili formatlar",
      relatedIntro: "Aynı ürün ailesi içinde keşfetmeye devam edin.",
    },
    solutions: {
      eyebrow: "Çalışma modeli",
      title: "Talepten destinasyona disiplinli bir rota.",
      intro:
        "Makendi’nin mevcut şirket profili; uluslararası tedarik, üretim veya sözleşmeli fabrika koordinasyonu, kalite kontrol, ithalat ve yerel dağıtım, depolama ve taşımayı kapsayan bir model tanımlar. Yeni deneyim bu süreci daha anlaşılır kılar.",
      steps: [
        ["01", "Tanımlayın", "Ürünü, uygulamayı, istenen formatı ve destinasyonu paylaşın."],
        ["02", "Uyumlayın", "Spesifikasyonu, belgeleri ve ticari parametreleri netleştirin."],
        ["03", "Koordine edin", "Tedarik veya üretim görüşmelerini uzlaşılan talebe bağlayın."],
        ["04", "Hazırlayın", "Destinasyon, depolama ve taşıma görüşmesini planlayın."],
      ],
      guardrail: "Her talep kendine özgüdür.",
      guardrailText:
        "Bu site; stok, menşe, minimum sipariş miktarı, teslim süresi, sertifika veya lojistik kapsama alanı bilgisi üretmez. Bu ayrıntılar gerçek talep için teyit edilir.",
      procurement: "Tedarik koordinasyonu",
      procurementText:
        "Yapılandırılmış ürün talebi, tedarik görüşmeleri için tutarlı bir başlangıç noktası sunar.",
      production: "Üretim bağlamı",
      productionText:
        "Uygun olduğunda, Makendi’nin yayınlanmış modeli üretim ve sözleşmeli fabrika koordinasyonunu kapsar.",
      logistics: "Destinasyon planlaması",
      logisticsText:
        "Rota ve belge soruları sonradan eklenmek yerine, hedef pazarla baştan ilişkilendirilir.",
    },
    network: {
      eyebrow: "Ülke ve destinasyon masası",
      title: "Pazarı talebin bir parçası yapın.",
      intro:
        "Gerçek bayraklar, duyarlı harita ve destinasyon filtreleri küresel görüşmeyi somutlaştırır. Belgelenmiş temas noktalarıyla seçilebilir destinasyonlar arasındaki fark açıkça korunur.",
      noteTitle: "Bu atlas nasıl okunmalı?",
      noteA: "Harita işaretleri",
      noteAText:
        "Makendi’nin mevcut kamuya açık şirket veya etkinlik bilgilerinde yer alan konumlardır.",
      noteB: "Ülke bayrakları",
      noteBText:
        "Ziyaretçinin talep hazırlarken seçebileceği pazarlardır; uygunluk ve rota önceden teyit edilmiş değildir.",
    },
    company: {
      eyebrow: "Şirket",
      title: "Uluslararası koordinasyon, net bir anlatımla.",
      intro:
        "Makendi Worldwide’ın kamuya açık şirket profili; uluslararası ürün tedariki, üretim koordinasyonu, kalite kontrol, ithalat, dağıtım, depolama ve taşımayı kapsayan ticari bir model tanımlar.",
      factsTitle: "Bu yenilemede korunanlar",
      facts: [
        "On iki aileden oluşan eksiksiz ürün portföyü",
        "Doğrulanmış İstanbul ofisi ve kamuya açık iletişim bilgileri",
        "Belgelenmiş uluslararası tedarik ve koordinasyon modeli",
        "İlgiden talebe uzanan doğrudan ve iki dilli yol",
      ],
      principleTitle: "İyileştirilenler",
      principles: [
        ["Netlik", "Uzun ve tekrarlı katalog sayfasının yerini odaklı bir bilgi mimarisi alır."],
        [
          "Güven",
          "Doğrulanmış ifadeler; destinasyon seçeneklerinden ve gelecekteki olasılıklardan ayrılır.",
        ],
        [
          "Erişim",
          "İngilizce ve Türkçe içerik, duyarlı düzen, klavye kullanımı ve azaltılmış hareket desteği.",
        ],
        ["İlerleme", "Her ürün ve ülke seçimi, yapılandırılmış bir talebe dönüşebilir."],
      ],
    },
    quality: {
      eyebrow: "Kalite yaklaşımı",
      title: "Talep edilen spesifikasyonu görünür kılın.",
      intro:
        "Makendi’nin kamuya açık modeli kalite kontrolünü kapsar. Bu yenileme, yalnızca ürüne özgü belgelerde bulunması gereken teknik iddialar üretmeden net bir talebin rolünü açıklar.",
      stages: [
        ["Talep", "İstenen ürünü, uygulamayı ve pazar bağlamını kaydedin."],
        ["Spesifikasyon", "Kesin talep için teknik ve ticari parametreleri uyumlayın."],
        [
          "Koordinasyon",
          "Üzerinde uzlaşılan gereksinimleri tedarik veya üretim görüşmelerine bağlayın.",
        ],
        ["Teyit", "Taahhütten önce belgeleri, uygunluğu ve destinasyon ayrıntılarını teyit edin."],
      ],
      boundaryTitle: "Yararlı bir sınır",
      boundaryText:
        "Web sitesi bir bilgi ve talep deneyimidir; halka açık stok listesi, sertifika kaydı, teklif aracı veya lojistik garantisi değildir.",
    },
    contact: {
      eyebrow: "Makendi ile iletişim",
      title: "Daha iyi bir talep, yararlı bilgilerle başlar.",
      intro:
        "Yapılandırılmış formu kullanın veya İstanbul ofisiyle doğrudan iletişime geçin. Form verileri bu web sitesinde saklanmaz.",
      office: "İstanbul ofisi",
      address: "Adres",
      email: "E-posta",
      phone: "Telefon",
    },
    privacy: {
      eyebrow: "Gizlilik ve talep bildirimi",
      title: "Hafif, şeffaf bir iletişim deneyimi.",
      intro:
        "Sitenin mevcut sürümü, talep formu verilerini bir web sunucusuna iletmez veya kaydetmez. Form gönderildiğinde ziyaretçinin kendi e-posta uygulamasında bir mesaj hazırlanır.",
      sections: [
        [
          "Formu gönderdiğinizde ne olur?",
          "Girdiğiniz bilgiler cihazınızda bir e-posta bağlantısına yerleştirilir. Taslağı ve göndermeyi seçtiğiniz mesajı bu web sitesi değil, e-posta sağlayıcınız işler.",
        ],
        [
          "Analiz ve izleme",
          "Bu sürümde üçüncü taraf analiz araçları, reklam pikselleri veya siteler arası izleme komut dosyaları bulunmaz.",
        ],
        [
          "Harici hizmetler",
          "E-posta, telefon ve LinkedIn bağlantıları ilgili sağlayıcıların yönettiği hizmetleri açar. Bu hizmetlerin kendi gizlilik koşulları geçerlidir.",
        ],
        [
          "Ticari bilgiler",
          "Portföy bilgilendirme amaçlıdır. Talep; fiyatı, stoğu, spesifikasyonu, sertifikayı, teslim süresini, teslimatı veya sözleşmeye bağlı taahhüdü teyit etmez.",
        ],
      ],
    },
    responsibility: {
      eyebrow: "Sorumluluk arşivi",
      title: "Niyeti koruyun. Kanıtın sınırını netleştirin.",
      intro:
        "Makendi’nin mevcut sitesi; toplumsal faaliyetler, yerel ortaklar, çevreye özen, güvenlik, dürüstlük, saygı, esenlik ve eğitim odaklı bir sorumluluk beyanı yayınlamaktadır. Bu yenileme, desteklenmeyen etki ölçümleri eklemeden söz konusu beyanı yayınlanmış bağlam olarak korur.",
      statementTitle: "Yayınlanmış taahhüt",
      statement:
        "Makendi Worldwide; düşük gelir düzeyine sahip ülkelerde sosyal faaliyetlere katıldığını, yerel ortaklarla çalıştığını ve çevrenin korunmasıyla birlikte toplum, esenlik ve eğitim girişimlerini önemsediğini belirtmektedir.",
      values: [
        ["Güvenlik", "Mevcut kamuya açık sorumluluk beyanında temel değer olarak belirtilir."],
        ["Dürüstlük", "Doğrulanmamış performans iddiasına dönüştürülmeden, beyan edilen ilke olarak korunur."],
        ["Saygı", "Yerel ortaklık ve toplumsal bağlamla birlikte sunulur."],
      ],
      boundaryTitle: "Sorumlu iletişimin net bir sınırı olmalıdır.",
      boundary:
        "Makendi güncel destekleyici kanıt sağlamadıkça; sertifika, emisyon miktarı, bağış toplamı, yararlanıcı sayısı, izlenebilirlik oranı veya nicel çevresel sonuç yayınlanmaz.",
    },
    archive: {
      eyebrow: "Kaynak kütüphanesi ve tarihçe",
      title: "Mevcut site silinmeden, yeniden düzenlendi.",
      intro:
        "Mevcut Makendi sitesindeki şirket dokümanları, tarihî etkinlik kayıtları ve seçilmiş galeri materyalleri daha anlaşılır bir arşivde korunur.",
      documentsTitle: "Resmî kaynak dokümanları",
      documentsIntro:
        "Bu dosyalar mevcut siteden aktarılmış ve arşiv kaynakları olarak etiketlenmiştir. İçerdikleri ürün ve iletişim bilgileri için güncel teyit gerekebilir.",
      open: "Dokümanı aç",
      download: "PDF’i indir",
      archived: "Arşiv kaynak",
      documents: [
        ["Endüstriyel profil", "Şirket ve endüstriyel genel bakış", "makendi-industrial-profile.pdf", "18 MB"],
        ["Şirket broşürü", "Kısa şirket tanıtımı", "makendi-brochure.pdf", "612 KB"],
        ["Ürün kataloğu", "Tarihî ürün ve teknik katalog", "makendi-catalogue.pdf", "13 MB"],
      ],
      eventsTitle: "Yayınlanmış etkinlik tarihçesi",
      eventsIntro:
        "Makendi’nin kamuya açık etkinlik arşivinde üç konum yer almaktadır. Bunlar güncel ofis veya aktif etkinlik beyanı değil, tarihî temas noktalarıdır.",
      events: [
        ["tr", "FI İstanbul · Türkiye", "İstanbul’u bölgesel gıda ve içecek pazarlarıyla ilişkilendiren yayınlanmış etkinlik kaydı.", "event-istanbul"],
        ["us", "IFT16 · Chicago, ABD", "Makendi tarafından yayınlanmış tarihî fuar kaydı.", "event-chicago"],
        ["my", "MIHAS · Kuala Lumpur, Malezya", "Asya–Pasifik müşteri temasını belgeleyen tarihî etkinlik kaydı.", "event-malaysia"],
      ],
    },
    notFound: {
      eyebrow: "404",
      title: "Bu rota portföyde yer almıyor.",
      intro: "Ürün dizinine dönün veya yeni bir talep oluşturun.",
      home: "Ana sayfaya dön",
    },
    footer: {
      statement: "Gıda bileşenleri, net bir koordinasyonla.",
      explore: "Keşfedin",
      contact: "İletişim",
      legal: "Yasal",
      privacy: "Gizlilik ve talep bildirimi",
      note:
        "Ürün ve destinasyon bilgileri gösterge niteliğindedir. Spesifikasyon, uygunluk, ticari koşullar ve rota her talep için teyit edilir.",
      rights: "Makendi Worldwide. Tüm hakları saklıdır.",
    },
  },
};

const categoryIcons = {
  starches: Sparkles,
  dairy: PackageCheck,
  sweeteners: Sparkles,
  soy: Wheat,
  "oils-fats": Factory,
  gluten: Wheat,
  cocoa: Coffee,
  gelatin: Sparkles,
  coconut: Globe2,
  flours: Wheat,
  coffee: Coffee,
  creamers: PackageCheck,
};

function MakendiLogo({ priority = false }) {
  return (
    <picture className="brand-logo">
      <source
        type="image/webp"
        srcSet="/makendi-logo-240.webp 240w, /makendi-logo-480.webp 480w"
        sizes="(max-width: 500px) 180px, 220px"
      />
      <img
        src="/makendi-logo.png"
        alt="Makendi Worldwide"
        width="720"
        height="225"
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

function ResponsiveImage({ name, alt, sizes, className = "", priority = false }) {
  const sourceSizes =
    name === "quality-control"
      ? [640, 1024, 1536]
      : name === "ingredients-hero"
        ? [720, 1200, 1672]
        : [720, 1200, 1776];
  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={sourceSizes.map((size) => `/images/${name}-${size}.webp ${size}w`).join(", ")}
        sizes={sizes}
      />
      <img
        src={`/images/${name}.webp`}
        alt={alt}
        width={sourceSizes.at(-1)}
        height={name === "ingredients-hero" ? 1024 : 1024}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

function SectionHeading({ eyebrow, title, intro, action, align = "split" }) {
  return (
    <div className={`section-heading section-heading--${align} reveal`}>
      <div>
        <p className="eyebrow eyebrow--orange">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {(intro || action) && (
        <div className="section-heading__aside">
          {intro && <p className="lede">{intro}</p>}
          {action}
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category, language, featured = false }) {
  const text = copy[language];
  const Icon = categoryIcons[category.slug] || Sparkles;
  return (
    <Link
      className={`category-card category-card--${category.accent} ${
        featured ? "category-card--featured" : ""
      } reveal`}
      to={`/products/${category.slug}`}
    >
      <div className="category-card__top">
        <span className="category-card__number">{category.number}</span>
        <span className="category-card__icon">
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      <div className="category-card__body">
        <h3>{localized(category.name, language)}</h3>
        <p>{localized(category.note, language)}</p>
      </div>
      <div className="category-card__meta">
        <span>
          {category.products.length} {text.common.products}
        </span>
        <span className="circle-arrow" aria-label={text.common.view}>
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}

function PageHero({ eyebrow, title, intro, children, tone = "navy" }) {
  return (
    <section className={`page-hero page-hero--${tone}`}>
      <div className="page-hero__mesh" aria-hidden="true" />
      <div className="container page-hero__inner">
        <p className="eyebrow eyebrow--orange">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero__intro">{intro}</p>
        {children}
      </div>
    </section>
  );
}

function Header({ language, setLanguage }) {
  const text = copy[language];
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigation = [
    ["/products", text.nav.products],
    ["/solutions", text.nav.solutions],
    ["/network", text.nav.network],
    ["/company", text.nav.company],
    ["/quality", text.nav.quality],
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__accent" aria-hidden="true" />
      <div className="container site-header__inner">
        <Link className="site-header__brand" to="/" aria-label="Makendi Worldwide home">
          <MakendiLogo priority />
        </Link>

        <nav className="desktop-nav" aria-label={language === "tr" ? "Ana menü" : "Main menu"}>
          {navigation.map(([to, label]) => (
            <NavLink to={to} key={to}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <div className="language-switcher" aria-label={language === "tr" ? "Dil seçimi" : "Language"}>
            {["en", "tr"].map((code) => (
              <button
                type="button"
                className={language === code ? "is-active" : ""}
                onClick={() => setLanguage(code)}
                aria-pressed={language === code}
                key={code}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <Link className="button button--navy header-cta" to="/contact">
            {text.nav.contact}
            <ArrowUpRight size={17} />
          </Link>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={
              open
                ? language === "tr"
                  ? "Menüyü kapat"
                  : "Close menu"
                : language === "tr"
                  ? "Menüyü aç"
                  : "Open menu"
            }
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} id="mobile-navigation">
        <div className="mobile-menu__inner">
          <p className="micro-label">Makendi Worldwide</p>
          <nav aria-label={language === "tr" ? "Mobil menü" : "Mobile menu"}>
            {navigation.map(([to, label], index) => (
              <NavLink to={to} key={to} style={{ "--menu-index": index }}>
                <span>0{index + 1}</span>
                {label}
                <ChevronRight />
              </NavLink>
            ))}
          </nav>
          <Link className="button button--orange button--wide" to="/contact">
            {text.nav.contact}
            <ArrowUpRight size={18} />
          </Link>
          <div className="mobile-menu__contact">
            <a href={`mailto:${companyContact.email}`}>{companyContact.email}</a>
            <a href={`tel:${companyContact.phoneHref}`}>{companyContact.phoneDisplay}</a>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomePage({ language }) {
  const text = copy[language];
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__image">
          <ResponsiveImage
            name="ingredients-hero"
            alt={
              language === "tr"
                ? "Mavi bir yüzeyde çeşitli toz ve tahıl gıda bileşenleri"
                : "Assorted powdered and grain food ingredients on a blue surface"
            }
            sizes="100vw"
            priority
          />
          <div className="home-hero__veil" />
        </div>
        <div className="home-hero__grid" aria-hidden="true" />
        <div className="container home-hero__content">
          <div className="home-hero__copy">
            <p className="eyebrow eyebrow--orange">{text.home.eyebrow}</p>
            <h1>
              <span>{text.home.titleA}</span>
              <span>{text.home.titleB}</span>
              <em>{text.home.titleC}</em>
            </h1>
            <p>{text.home.intro}</p>
            <div className="hero-actions">
              <Link className="button button--orange" to="/contact">
                {text.home.brief}
                <ArrowUpRight size={19} />
              </Link>
              <Link className="text-link text-link--light" to="/products">
                {text.home.portfolio}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <Link className="scroll-cue" to="#journey" onClick={(event) => {
            event.preventDefault();
            document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
          }}>
            <span>{text.common.scroll}</span>
            <ArrowDown size={18} />
          </Link>
          <div className="hero-proof">
            <span>
              <strong>12</strong>
              {text.common.categories}
            </span>
            <span>
              <strong>60</strong>
              {text.common.products}
            </span>
            <span>
              <strong>EN · TR</strong>
              {text.common.languages}
            </span>
          </div>
        </div>
      </section>

      <section className="journey section section--cream" id="journey">
        <div className="container">
          <SectionHeading
            eyebrow={text.home.serviceLabel}
            title={text.home.serviceTitle}
            intro={text.home.serviceIntro}
          />
          <div className="journey-track reveal">
            {[
              [Search, language === "tr" ? "Talep" : "Brief"],
              [ClipboardCheck, language === "tr" ? "Uyum" : "Alignment"],
              [Factory, language === "tr" ? "Koordinasyon" : "Coordination"],
              [Globe2, language === "tr" ? "Destinasyon" : "Destination"],
            ].map(([Icon, label], index) => (
              <div className="journey-step" key={label}>
                <span className="journey-step__index">0{index + 1}</span>
                <span className="journey-step__icon">
                  <Icon aria-hidden="true" />
                </span>
                <strong>{label}</strong>
                {index < 3 && <ArrowRight className="journey-step__arrow" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--oat">
        <div className="container">
          <SectionHeading
            eyebrow={text.home.familiesEyebrow}
            title={text.home.familiesTitle}
            intro={text.home.familiesIntro}
            action={
              <Link className="text-link" to="/products">
                {text.home.allFamilies}
                <ArrowRight size={18} />
              </Link>
            }
          />
          <div className="category-grid category-grid--home">
            {categories.slice(0, 6).map((category, index) => (
              <CategoryCard
                category={category}
                language={language}
                featured={index === 0 || index === 3}
                key={category.slug}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="network-feature section section--navy">
        <div className="container network-feature__inner">
          <div className="network-feature__copy reveal">
            <p className="eyebrow eyebrow--orange">{text.home.networkEyebrow}</p>
            <h2>{text.home.networkTitle}</h2>
            <p className="lede">{text.home.networkIntro}</p>
            <Link className="button button--ghost-light" to="/network">
              {text.home.networkLink}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="network-feature__visual reveal">
            <img src="/images/world-map.svg" alt="" width="1000" height="520" loading="lazy" />
            <div className="flag-orbit" aria-hidden="true">
              {destinationCountries.slice(0, 8).map((country, index) => (
                <span
                  className="flag-orbit__item"
                  style={{ "--orbit-index": index }}
                  key={country.iso}
                >
                  <img src={`/flags/${country.iso}.svg`} alt="" width="34" height="24" loading="lazy" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="quality-feature section section--cream">
        <div className="container quality-feature__inner">
          <div className="quality-feature__media reveal">
            <ResponsiveImage
              name="quality-control"
              alt={
                language === "tr"
                  ? "Laboratuvar ortamında ürün numunelerini inceleyen kalite uzmanı"
                  : "Quality specialist evaluating ingredient samples in a laboratory setting"
              }
              sizes="(max-width: 800px) 100vw, 52vw"
              priority
            />
            <span className="quality-feature__badge">
              <ShieldCheck />
              {text.common.verified}
            </span>
          </div>
          <div className="quality-feature__copy reveal">
            <p className="eyebrow eyebrow--orange">{text.home.qualityEyebrow}</p>
            <h2>{text.home.qualityTitle}</h2>
            <p className="lede">{text.home.qualityIntro}</p>
            <Link className="text-link" to="/quality">
              {text.home.qualityLink}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        language={language}
        title={text.home.ctaTitle}
        body={text.home.ctaBody}
      />
    </>
  );
}

function ProductsPage({ language }) {
  const text = copy[language];
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(language === "tr" ? "tr-TR" : "en-US");
    if (!normalized) return categories;
    return categories.filter((category) => {
      const haystack = [
        localized(category.name, language),
        localized(category.note, language),
        ...category.products.map((product) => product[language === "tr" ? 1 : 0]),
      ]
        .join(" ")
        .toLocaleLowerCase(language === "tr" ? "tr-TR" : "en-US");
      return haystack.includes(normalized);
    });
  }, [language, query]);

  return (
    <>
      <PageHero
        eyebrow={text.products.eyebrow}
        title={text.products.title}
        intro={text.products.intro}
      >
        <label className="portfolio-search">
          <Search aria-hidden="true" />
          <span className="sr-only">{text.products.search}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              const next = new URLSearchParams(searchParams);
              if (event.target.value) next.set("q", event.target.value);
              else next.delete("q");
              setSearchParams(next, { replace: true });
            }}
            placeholder={text.products.search}
          />
          {query && (
            <button
              type="button"
              onClick={() => setSearchParams({}, { replace: true })}
              aria-label={language === "tr" ? "Aramayı temizle" : "Clear search"}
            >
              <X size={19} />
            </button>
          )}
        </label>
      </PageHero>

      <section className="section section--oat">
        <div className="container">
          <div className="portfolio-status reveal" aria-live="polite">
            <span>{query ? `"${query}"` : text.products.all}</span>
            <strong>
              {results.length} {text.products.results}
            </strong>
          </div>
          <div className="category-grid">
            {results.map((category) => (
              <CategoryCard category={category} language={language} key={category.slug} />
            ))}
          </div>
          {!results.length && (
            <div className="no-results">
              <Search />
              <h2>{text.products.noResults}</h2>
              <button
                className="button button--navy"
                type="button"
                onClick={() => setSearchParams({}, { replace: true })}
              >
                {text.products.all}
              </button>
            </div>
          )}
          <aside className="source-note reveal">
            <Check size={18} aria-hidden="true" />
            <p>{text.products.sourceNote}</p>
          </aside>
        </div>
      </section>
    </>
  );
}

function ProductDetailPage({ language }) {
  const text = copy[language];
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return <Navigate to="/404" replace />;
  const categoryProducts = catalogProducts.filter(
    (product) => product.categorySlug === category.slug,
  );

  const related = categories
    .filter((item) => item.slug !== category.slug)
    .slice(Number(category.number) % 7, Number(category.number) % 7 + 3);

  return (
    <>
      <section className={`product-hero product-hero--${category.accent}`}>
        <div className="container product-hero__inner">
          <Link className="back-link" to="/products">
            <ArrowRight size={16} />
            {text.common.back}
          </Link>
          <div className="product-hero__title">
            <div>
              <p className="eyebrow eyebrow--orange">
                {text.detail.eyebrow} · {category.number}
              </p>
              <h1>{localized(category.name, language)}</h1>
              <p>{localized(category.note, language)}</p>
            </div>
            <span className="product-hero__icon" aria-hidden="true">
              {(() => {
                const Icon = categoryIcons[category.slug] || Sparkles;
                return <Icon />;
              })()}
            </span>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container product-detail-grid">
          <div>
            <p className="eyebrow">{text.detail.formats}</p>
            <ol className="product-list">
              {categoryProducts.map((product, index) => (
                <li className="reveal" key={product.slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Link
                    className="product-list__name"
                    to={`/products/${category.slug}/${product.slug}`}
                  >
                    <strong>{localized(product.name, language)}</strong>
                  </Link>
                  <Link
                    to={`/products/${category.slug}/${product.slug}`}
                    aria-label={`${text.common.view}: ${localized(product.name, language)}`}
                  >
                    <ArrowUpRight />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <aside className="product-brief-card reveal">
            <Globe2 aria-hidden="true" />
            <p className="eyebrow eyebrow--orange">{text.detail.route}</p>
            <h2>{text.products.discuss}</h2>
            <p>{text.detail.routeText}</p>
            <Link className="button button--orange button--wide" to={`/contact?category=${category.slug}`}>
              {text.common.inquiry}
              <ArrowUpRight size={18} />
            </Link>
            <div className="product-brief-card__note">
              <strong>{text.detail.notSpecs}</strong>
              <p>{text.detail.notSpecsText}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--oat related-section">
        <div className="container">
          <SectionHeading eyebrow={text.detail.related} title={text.home.familiesTitle} />
          <div className="category-grid category-grid--three">
            {related.map((item) => (
              <CategoryCard category={item} language={language} key={item.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductProfilePage({ language }) {
  const text = copy[language];
  const profileText = text.productProfile;
  const { slug, productSlug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  const product = findCatalogProduct(slug, productSlug);

  if (!category || !product) return <Navigate to="/404" replace />;

  const relatedProducts = catalogProducts
    .filter(
      (item) =>
        item.categorySlug === category.slug && item.slug !== product.slug,
    )
    .slice(0, 4);
  const Icon = categoryIcons[category.slug] || Sparkles;
  const productCount = category.products.length;
  const reference = `${category.number}.${String(product.position).padStart(2, "0")}`;
  const inquiryUrl = `/contact?category=${category.slug}&product=${product.slug}`;

  return (
    <>
      <section className={`format-hero format-hero--${category.accent}`}>
        <div className="container">
          <Link
            className="back-link"
            to={`/products/${category.slug}`}
          >
            <ArrowRight size={16} />
            {profileText.back}
          </Link>
          <div className="format-hero__grid">
            <div className="format-hero__copy">
              <p className="eyebrow eyebrow--orange">
                {profileText.eyebrow} · {reference}
              </p>
              <h1>{localized(product.name, language)}</h1>
              <p className="lede">{profileText.intro}</p>
              <div className="format-hero__actions">
                <Link className="button button--orange" to={inquiryUrl}>
                  {profileText.request}
                  <ArrowUpRight size={18} />
                </Link>
                <Link className="button button--ghost-light" to="/archive">
                  {profileText.archive}
                  <FileText size={18} />
                </Link>
              </div>
            </div>
            <aside className="format-record" aria-label={profileText.position}>
              <div className="format-record__top">
                <span>{reference}</span>
                <Icon aria-hidden="true" />
              </div>
              <dl>
                <div>
                  <dt>{profileText.family}</dt>
                  <dd>{localized(category.name, language)}</dd>
                </div>
                <div>
                  <dt>{profileText.position}</dt>
                  <dd>
                    {String(product.position).padStart(2, "0")} /{" "}
                    {String(productCount).padStart(2, "0")}
                  </dd>
                </div>
                <div>
                  <dt>{profileText.published}</dt>
                  <dd>{localized(product.name, language)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container format-brief-grid">
          <article className="format-brief reveal">
            <p className="eyebrow eyebrow--orange">
              {profileText.briefEyebrow}
            </p>
            <h2>{profileText.briefTitle}</h2>
            <p className="lede">{profileText.briefText}</p>
            <div className="format-brief__steps">
              {profileText.briefPoints.map(([title, body], index) => (
                <div key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <aside className="accuracy-card reveal">
            <span className="accuracy-card__icon" aria-hidden="true">
              <ClipboardCheck />
            </span>
            <p className="eyebrow">{profileText.boundaryEyebrow}</p>
            <h2>{profileText.boundaryTitle}</h2>
            <p>{profileText.boundaryText}</p>
            <Link className="text-link" to={inquiryUrl}>
              {profileText.request}
              <ArrowRight size={18} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section section--oat format-related">
        <div className="container">
          <SectionHeading
            eyebrow={profileText.related}
            title={localized(category.name, language)}
            intro={profileText.relatedIntro}
          />
          {relatedProducts.length ? (
            <div className="format-related__grid">
              {relatedProducts.map((item) => (
                <Link
                  className="format-related__card reveal"
                  to={`/products/${category.slug}/${item.slug}`}
                  key={item.slug}
                >
                  <span>
                    {category.number}.
                    {String(item.position).padStart(2, "0")}
                  </span>
                  <h3>{localized(item.name, language)}</h3>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <Link
              className="format-related__single reveal"
              to={`/products/${category.slug}`}
            >
              <span>{localized(category.note, language)}</span>
              <strong>{profileText.back}</strong>
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

function SolutionsPage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.solutions.eyebrow}
        title={text.solutions.title}
        intro={text.solutions.intro}
      />
      <section className="section section--cream">
        <div className="container">
          <div className="process-list">
            {text.solutions.steps.map(([number, title, description]) => (
              <article className="process-row reveal" key={number}>
                <span>{number}</span>
                <h2>{title}</h2>
                <p>{description}</p>
                <ArrowRight aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--navy service-image-section">
        <div className="container service-image-section__inner">
          <div className="service-image-section__media reveal">
            <ResponsiveImage
              name="global-logistics"
              alt={
                language === "tr"
                  ? "Liman ve konteyner operasyonlarının yanında ürün numuneleri"
                  : "Ingredient samples beside a global port and container operation"
              }
              sizes="(max-width: 900px) 100vw, 54vw"
            />
          </div>
          <div className="service-image-section__cards">
            {[
              [Search, text.solutions.procurement, text.solutions.procurementText],
              [Factory, text.solutions.production, text.solutions.productionText],
              [Globe2, text.solutions.logistics, text.solutions.logisticsText],
            ].map(([Icon, title, body]) => (
              <article className="mini-service reveal" key={title}>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="guardrail section section--oat">
        <div className="container guardrail__inner reveal">
          <ShieldCheck aria-hidden="true" />
          <div>
            <p className="eyebrow eyebrow--orange">{text.common.verified}</p>
            <h2>{text.solutions.guardrail}</h2>
            <p className="lede">{text.solutions.guardrailText}</p>
          </div>
          <Link className="button button--navy" to="/contact">
            {text.common.discuss}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function NetworkPage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.network.eyebrow}
        title={text.network.title}
        intro={text.network.intro}
      />
      <section className="atlas-section section section--navy">
        <div className="container">
          <WorldAtlas language={language} />
        </div>
      </section>
      <section className="atlas-notes section section--cream">
        <div className="container">
          <SectionHeading eyebrow="02 / Context" title={text.network.noteTitle} />
          <div className="atlas-note-grid">
            <article className="atlas-note reveal">
              <MapPin />
              <span>01</span>
              <h3>{text.network.noteA}</h3>
              <p>{text.network.noteAText}</p>
            </article>
            <article className="atlas-note reveal">
              <Globe2 />
              <span>02</span>
              <h3>{text.network.noteB}</h3>
              <p>{text.network.noteBText}</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

function CompanyPage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.company.eyebrow}
        title={text.company.title}
        intro={text.company.intro}
      />
      <section className="company-story section section--cream">
        <div className="container company-story__grid">
          <div className="company-story__logo reveal">
            <MakendiLogo />
            <span>Worldwide</span>
          </div>
          <div className="company-story__facts reveal">
            <p className="eyebrow eyebrow--orange">{text.company.factsTitle}</p>
            <ul>
              {text.company.facts.map((fact) => (
                <li key={fact}>
                  <Check size={18} />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section section--oat">
        <div className="container">
          <SectionHeading eyebrow="02 / Rebuild" title={text.company.principleTitle} />
          <div className="principle-grid">
            {text.company.principles.map(([title, body], index) => (
              <article className="principle-card reveal" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="company-links section section--cream">
        <div className="container company-link-grid">
          <Link className="company-link-card reveal" to="/responsibility">
            <HeartHandshake aria-hidden="true" />
            <span>03</span>
            <div>
              <p className="eyebrow eyebrow--orange">{text.responsibility.eyebrow}</p>
              <h2>{text.responsibility.title}</h2>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link className="company-link-card reveal" to="/archive">
            <FileText aria-hidden="true" />
            <span>04</span>
            <div>
              <p className="eyebrow eyebrow--orange">{text.archive.eyebrow}</p>
              <h2>{text.archive.title}</h2>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <CtaBand
        language={language}
        title={text.home.ctaTitle}
        body={text.home.ctaBody}
      />
    </>
  );
}

function QualityPage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.quality.eyebrow}
        title={text.quality.title}
        intro={text.quality.intro}
      />
      <section className="quality-page section section--cream">
        <div className="container quality-page__grid">
          <div className="quality-page__image reveal">
            <ResponsiveImage
              name="quality-control"
              alt={
                language === "tr"
                  ? "Kalite değerlendirmesi için hazırlanan gıda ürünü numuneleri"
                  : "Food ingredient samples prepared for quality evaluation"
              }
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className="quality-stages">
            {text.quality.stages.map(([title, body], index) => (
              <article className="quality-stage reveal" key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--navy">
        <div className="container boundary-card reveal">
          <ShieldCheck />
          <div>
            <p className="eyebrow eyebrow--orange">{text.common.verified}</p>
            <h2>{text.quality.boundaryTitle}</h2>
            <p>{text.quality.boundaryText}</p>
          </div>
          <Link className="button button--orange" to="/contact">
            {text.common.inquiry}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function ResponsibilityPage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.responsibility.eyebrow}
        title={text.responsibility.title}
        intro={text.responsibility.intro}
      />
      <section className="responsibility-story section section--cream">
        <div className="container responsibility-story__grid">
          <div className="responsibility-story__media reveal">
            <img
              src="/images/archive/responsibility-01.webp"
              alt={
                language === "tr"
                  ? "Makendi’nin mevcut sitesinden tarihî sorumluluk görseli"
                  : "Historical responsibility image from Makendi’s existing website"
              }
              width="1024"
              height="768"
            />
            <div className="responsibility-story__stack" aria-hidden="true">
              <img src="/images/archive/responsibility-02.webp" alt="" width="1024" height="768" loading="lazy" />
              <img src="/images/archive/responsibility-03.webp" alt="" width="1024" height="768" loading="lazy" />
            </div>
          </div>
          <div className="responsibility-story__copy reveal">
            <p className="eyebrow eyebrow--orange">01 / Published context</p>
            <h2>{text.responsibility.statementTitle}</h2>
            <p className="lede">{text.responsibility.statement}</p>
            <div className="responsibility-values">
              {text.responsibility.values.map(([title, body], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section section--navy">
        <div className="container boundary-card reveal">
          <HeartHandshake />
          <div>
            <p className="eyebrow eyebrow--orange">{text.common.verified}</p>
            <h2>{text.responsibility.boundaryTitle}</h2>
            <p>{text.responsibility.boundary}</p>
          </div>
          <Link className="button button--orange" to="/contact">
            {text.common.discuss}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function ArchivePage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.archive.eyebrow}
        title={text.archive.title}
        intro={text.archive.intro}
      />
      <section className="document-section section section--cream">
        <div className="container">
          <SectionHeading
            eyebrow="01 / Documents"
            title={text.archive.documentsTitle}
            intro={text.archive.documentsIntro}
          />
          <div className="document-grid">
            {text.archive.documents.map(([title, description, file, size], index) => (
              <article className="document-card reveal" key={file}>
                <div className="document-card__top">
                  <span>0{index + 1}</span>
                  <FileText aria-hidden="true" />
                </div>
                <div>
                  <p className="micro-label">{text.archive.archived} · PDF · {size}</p>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <div className="document-card__actions">
                  <a
                    className="button button--navy button--small"
                    href={`/documents/${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {text.archive.open}
                    <ExternalLink size={16} />
                  </a>
                  <a className="document-download" href={`/documents/${file}`} download>
                    <Download size={17} />
                    {text.archive.download}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="event-section section section--oat">
        <div className="container">
          <SectionHeading
            eyebrow="02 / Events"
            title={text.archive.eventsTitle}
            intro={text.archive.eventsIntro}
          />
          <div className="event-grid">
            {text.archive.events.map(([iso, title, description, image], index) => (
              <article className="event-card reveal" key={title}>
                <div className="event-card__image">
                  <img
                    src={`/images/archive/${image}.webp`}
                    alt=""
                    width="1024"
                    height="576"
                    loading="lazy"
                  />
                  <span>
                    <img src={`/flags/${iso}.svg`} alt="" width="36" height="25" loading="lazy" />
                  </span>
                </div>
                <div className="event-card__body">
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <ArchiveGallery language={language} />
        </div>
      </section>
    </>
  );
}

function ContactPage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.contact.eyebrow}
        title={text.contact.title}
        intro={text.contact.intro}
      />
      <section className="contact-section section section--cream">
        <div className="container">
          <InquiryForm language={language} />
        </div>
      </section>
      <section className="office-section section section--oat">
        <div className="container office-card reveal">
          <div className="office-card__title">
            <span>
              <Building2 />
            </span>
            <div>
              <p className="eyebrow eyebrow--orange">{text.contact.office}</p>
              <h2>Istanbul · Türkiye</h2>
            </div>
          </div>
          <dl>
            <div>
              <dt>
                <MapPin />
                {text.contact.address}
              </dt>
              <dd>{localized(companyContact.address, language)}</dd>
            </div>
            <div>
              <dt>
                <Mail />
                {text.contact.email}
              </dt>
              <dd>
                <a href={`mailto:${companyContact.email}`}>{companyContact.email}</a>
              </dd>
            </div>
            <div>
              <dt>
                <Phone />
                {text.contact.phone}
              </dt>
              <dd>
                <a href={`tel:${companyContact.phoneHref}`}>{companyContact.phoneDisplay}</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}

function PrivacyPage({ language }) {
  const text = copy[language];
  return (
    <>
      <PageHero
        eyebrow={text.privacy.eyebrow}
        title={text.privacy.title}
        intro={text.privacy.intro}
      />
      <section className="section section--cream">
        <div className="container legal-content">
          {text.privacy.sections.map(([title, body], index) => (
            <article className="legal-section reveal" key={title}>
              <span>0{index + 1}</span>
              <div>
                <h2>{title}</h2>
                <p>{body}</p>
              </div>
            </article>
          ))}
          <p className="legal-updated">
            {language === "tr" ? "Son güncelleme: 30 Temmuz 2026" : "Last updated: 30 July 2026"}
          </p>
        </div>
      </section>
    </>
  );
}

function NotFoundPage({ language }) {
  const text = copy[language];
  return (
    <section className="not-found">
      <div className="not-found__rings" aria-hidden="true" />
      <div className="container not-found__inner">
        <p className="eyebrow eyebrow--orange">{text.notFound.eyebrow}</p>
        <h1>{text.notFound.title}</h1>
        <p>{text.notFound.intro}</p>
        <div className="hero-actions">
          <Link className="button button--orange" to="/">
            {text.notFound.home}
            <ArrowUpRight size={18} />
          </Link>
          <Link className="button button--ghost-light" to="/products">
            {text.nav.products}
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaBand({ language, title, body }) {
  const text = copy[language];
  return (
    <section className="cta-band">
      <div className="cta-band__grid" aria-hidden="true" />
      <div className="container cta-band__inner reveal">
        <div>
          <p className="eyebrow">{text.nav.contact}</p>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <Link className="button button--navy" to="/contact">
          {text.common.inquiry}
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function Footer({ language }) {
  const text = copy[language];
  const links = [
    ["/products", text.nav.products],
    ["/solutions", text.nav.solutions],
    ["/network", text.nav.network],
    ["/company", text.nav.company],
    ["/quality", text.nav.quality],
    ["/responsibility", text.responsibility.eyebrow],
    ["/archive", text.archive.eyebrow],
  ];
  return (
    <footer className="site-footer">
      <div className="container site-footer__main">
        <div className="site-footer__brand">
          <MakendiLogo />
          <h2>{text.footer.statement}</h2>
          <p>{text.footer.note}</p>
        </div>
        <div className="site-footer__column">
          <h3>{text.footer.explore}</h3>
          {links.map(([to, label]) => (
            <Link to={to} key={to}>
              {label}
            </Link>
          ))}
        </div>
        <div className="site-footer__column">
          <h3>{text.footer.contact}</h3>
          <a href={`mailto:${companyContact.email}`}>{companyContact.email}</a>
          <a href={`tel:${companyContact.phoneHref}`}>{companyContact.phoneDisplay}</a>
          <a href={companyContact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ExternalLink size={15} />
          </a>
          <Link to="/contact">{text.nav.contact}</Link>
        </div>
        <div className="site-footer__column">
          <h3>{text.footer.legal}</h3>
          <Link to="/privacy">{text.footer.privacy}</Link>
          <span>{localized(companyContact.address, language)}</span>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} {text.footer.rights}</p>
        <span>EN · TR</span>
      </div>
    </footer>
  );
}

function RouteMeta({ language }) {
  const location = useLocation();
  useEffect(() => {
    const routes = {
      "/": {
        en: ["Makendi Worldwide — Food ingredients, clearly coordinated", "Food ingredient procurement, quality coordination and destination planning."],
        tr: ["Makendi Worldwide — Gıda bileşenleri, net bir koordinasyonla", "Gıda bileşeni tedariki, kalite koordinasyonu ve destinasyon planlaması."],
      },
      "/products": {
        en: ["Ingredients — Makendi Worldwide", "Explore twelve food ingredient families and sixty published product formats."],
        tr: ["Ürünler — Makendi Worldwide", "On iki gıda bileşeni ailesini ve altmış yayınlanmış ürün formatını inceleyin."],
      },
      "/solutions": {
        en: ["How we work — Makendi Worldwide", "A clear route from ingredient brief to destination planning."],
        tr: ["Çalışma modelimiz — Makendi Worldwide", "Ürün talebinden destinasyon planlamasına uzanan net rota."],
      },
      "/network": {
        en: ["Destinations — Makendi Worldwide", "Explore real flags, documented touchpoints and destination inquiry options."],
        tr: ["Destinasyonlar — Makendi Worldwide", "Gerçek bayrakları, belgelenmiş temas noktalarını ve destinasyon taleplerini inceleyin."],
      },
      "/company": {
        en: ["Company — Makendi Worldwide", "International food ingredient coordination from Istanbul."],
        tr: ["Şirket — Makendi Worldwide", "İstanbul’dan uluslararası gıda bileşeni koordinasyonu."],
      },
      "/quality": {
        en: ["Quality approach — Makendi Worldwide", "Keep the requested specification at the centre of the ingredient conversation."],
        tr: ["Kalite yaklaşımı — Makendi Worldwide", "Ürün görüşmesinde talep edilen spesifikasyonu merkezde tutun."],
      },
      "/contact": {
        en: ["Contact — Makendi Worldwide", "Prepare a structured ingredient and destination inquiry."],
        tr: ["İletişim — Makendi Worldwide", "Yapılandırılmış ürün ve destinasyon talebi hazırlayın."],
      },
      "/privacy": {
        en: ["Privacy & inquiry notice — Makendi Worldwide", "How the mail-based inquiry form and external links work."],
        tr: ["Gizlilik ve talep bildirimi — Makendi Worldwide", "E-posta tabanlı talep formunun ve harici bağlantıların işleyişi."],
      },
      "/responsibility": {
        en: ["Responsibility archive — Makendi Worldwide", "Published social-responsibility context, carefully separated from unverified impact claims."],
        tr: ["Sorumluluk arşivi — Makendi Worldwide", "Yayınlanmış sosyal sorumluluk bağlamı ve doğrulanmamış etki iddiaları arasındaki net ayrım."],
      },
      "/archive": {
        en: ["Source library & history — Makendi Worldwide", "Official archived documents, event history and selected company photography."],
        tr: ["Kaynak kütüphanesi ve tarihçe — Makendi Worldwide", "Resmî arşiv dokümanları, etkinlik tarihçesi ve seçilmiş şirket fotoğrafları."],
      },
    };
    const productPath = location.pathname.split("/").filter(Boolean);
    const category =
      productPath[0] === "products"
        ? categories.find((item) => item.slug === productPath[1])
        : undefined;
    const product =
      productPath.length === 3
        ? findCatalogProduct(productPath[1], productPath[2])
        : undefined;
    let metadata;
    if (product && category) {
      metadata = [
        `${localized(product.name, language)} — Makendi Worldwide`,
        language === "tr"
          ? `${localized(product.name, language)}, ${localized(category.name, language)} ailesinde yayınlanmış bir Makendi portföy formatıdır. Teknik ve ticari ayrıntılar talebe göre teyit edilir.`
          : `${localized(product.name, language)} is a published Makendi portfolio format within ${localized(category.name, language)}. Technical and commercial details are confirmed per inquiry.`,
      ];
    } else if (category && productPath.length === 2) {
      metadata = [
        `${localized(category.name, language)} — Makendi Worldwide`,
        localized(category.note, language),
      ];
    } else {
      metadata =
        routes[location.pathname]?.[language] ||
        (language === "tr"
          ? [
              "Sayfa bulunamadı — Makendi Worldwide",
              "Aradığınız sayfa bulunamadı.",
            ]
          : [
              "Page not found — Makendi Worldwide",
              "The requested page was not found.",
            ]);
    }
    const [title, description] = metadata;
    document.title = title;
    document.documentElement.lang = language;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDescription) ogDescription.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${location.pathname}`;
  }, [language, location.pathname]);
  return null;
}

export default function App() {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem("makendi-language");
      return stored === "tr" ? "tr" : "en";
    } catch {
      return "en";
    }
  });

  function setLanguage(next) {
    setLanguageState(next);
    try {
      localStorage.setItem("makendi-language", next);
    } catch {
      // The interface still updates when browser storage is unavailable.
    }
  }

  return (
    <div className="site">
      <RouteMeta language={language} />
      <ExperienceLayer language={language} />
      <Header language={language} setLanguage={setLanguage} />
      <main id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/products" element={<ProductsPage language={language} />} />
          <Route path="/products/:slug" element={<ProductDetailPage language={language} />} />
          <Route
            path="/products/:slug/:productSlug"
            element={<ProductProfilePage language={language} />}
          />
          <Route path="/solutions" element={<SolutionsPage language={language} />} />
          <Route path="/network" element={<NetworkPage language={language} />} />
          <Route path="/company" element={<CompanyPage language={language} />} />
          <Route path="/quality" element={<QualityPage language={language} />} />
          <Route path="/responsibility" element={<ResponsibilityPage language={language} />} />
          <Route path="/archive" element={<ArchivePage language={language} />} />
          <Route path="/contact" element={<ContactPage language={language} />} />
          <Route path="/privacy" element={<PrivacyPage language={language} />} />
          <Route path="/404" element={<NotFoundPage language={language} />} />
          <Route path="*" element={<NotFoundPage language={language} />} />
        </Routes>
      </main>
      <Footer language={language} />
    </div>
  );
}
