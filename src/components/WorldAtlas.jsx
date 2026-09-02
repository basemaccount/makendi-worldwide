import { useMemo, useState } from "react";
import { ArrowUpRight, Check, MapPin, Search, X } from "lucide-react";
import { Link } from "../router.jsx";
import { localized, originCountries, originRegionLabels } from "../data/siteData.js";

const copy = {
  en: {
    eyebrow: "Origin atlas",
    title: "A portfolio with a sense of place.",
    intro: "Explore the country references supplied for each ingredient family, then open the relevant product profile and its supporting technical sheet where published.",
    map: "Interactive product-origin map",
    mapNote: "Country pairings are a portfolio reference supplied for this site. Product availability, origin documentation and lot-level traceability are confirmed for each enquiry.",
    directory: "Origin directory",
    search: "Search a country or ingredient",
    noResults: "No origin references match this search.",
    selected: "Selected origin",
    products: "Referenced portfolio",
    inquiry: "Ask about this origin",
    clear: "Clear selection",
    all: "All",
  },
  tr: {
    eyebrow: "Menşe atlası",
    title: "Yeri olan bir portföy.",
    intro: "Her bileşen ailesi için bu siteye sağlanan ülke referanslarını inceleyin; ardından ilgili ürün profilini ve yayımlanmışsa destekleyici teknik föyünü açın.",
    map: "Etkileşimli ürün-menşe haritası",
    mapNote: "Ülke eşleştirmeleri bu site için sağlanan portföy referansıdır. Ürün uygunluğu, menşe belgesi ve parti bazındaki izlenebilirlik her talep için teyit edilir.",
    directory: "Menşe dizini",
    search: "Ülke veya bileşen ara",
    noResults: "Bu aramayla eşleşen menşe referansı bulunamadı.",
    selected: "Seçilen menşe",
    products: "Referans portföy",
    inquiry: "Bu menşeyi sor",
    clear: "Seçimi temizle",
    all: "Tümü",
  },
};

function Flag({ iso, size = "small" }) {
  return (
    <span className={`flag flag--${size}`} aria-hidden="true">
      <img src={`/flags/${iso}.svg`} alt="" width="32" height="22" loading="lazy" />
      <span className="flag__shine" />
    </span>
  );
}

export default function WorldAtlas({ language = "en", compact = false }) {
  const text = copy[language];
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedIso, setSelectedIso] = useState("tr");
  const locale = language === "tr" ? "tr-TR" : "en-US";

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    return originCountries.filter((country) => {
      const regionMatches = region === "all" || country.region === region;
      const searchable = [localized(country.name, language), ...country.products.map((item) => localized(item.name, language))]
        .join(" ")
        .toLocaleLowerCase(locale);
      return regionMatches && (!normalized || searchable.includes(normalized));
    });
  }, [language, locale, query, region]);

  const selected = originCountries.find((country) => country.iso === selectedIso) || filteredCountries[0] || null;

  return (
    <section className={`atlas ${compact ? "atlas--compact" : ""}`} aria-labelledby="atlas-title">
      <div className="atlas__heading reveal">
        <div>
          <p className="eyebrow eyebrow--orange">{text.eyebrow}</p>
          <h2 id="atlas-title">{text.title}</h2>
        </div>
        <p className="lede">{text.intro}</p>
      </div>

      <div className="atlas__stage reveal">
        <div className="atlas__map-column">
          <div className="atlas__map" role="img" aria-label={text.map}>
            <img src="/images/world-map.svg" alt="" width="1000" height="520" loading="lazy" />
            <div className="atlas__map-glow" aria-hidden="true" />
            <div className="atlas__pins" aria-hidden="true">
            {originCountries.map((country) => {
              const active = selected?.iso === country.iso;
              return (
                <span className={`atlas__pin ${active ? "is-active" : ""}`} style={{ "--pin-x": `${country.pin[0]}%`, "--pin-y": `${country.pin[1]}%` }} key={country.iso}>
                  <span className="atlas__pin-pulse" />
                  <Flag iso={country.iso} size="pin" />
                </span>
              );
            })}
            </div>
          </div>

          {selected && (
            <article className="origin-card" aria-live="polite" key={selected.iso}>
              <div className="origin-card__flag"><Flag iso={selected.iso} size="large" /></div>
              <div>
                <p className="micro-label">{text.selected}</p>
                <h3>{localized(selected.name, language)}</h3>
                <p>{text.products}</p>
              </div>
              <MapPin aria-hidden="true" />
              <div className="origin-card__products">
                {selected.products.map((product) => (
                  <Link key={product.to} to={product.to}>
                    <span>{localized(product.name, language)}</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </article>
          )}

          <div className="atlas__context">
            <span className="status-dot" aria-hidden="true" />
            <p>{text.mapNote}</p>
          </div>
        </div>

        <div className="destination-desk origin-desk">
          <div className="destination-desk__top">
            <p className="eyebrow">{text.directory}</p>
            <label className="search-field">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">{text.search}</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} />
              {query && <button type="button" onClick={() => setQuery("")} aria-label={text.clear}><X size={17} /></button>}
            </label>
          </div>

          <div className="filter-row" aria-label={text.directory}>
            {Object.keys(originRegionLabels).map((key) => (
              <button type="button" className={region === key ? "is-active" : ""} onClick={() => setRegion(key)} aria-pressed={region === key} key={key}>
                {key === "all" ? text.all : localized(originRegionLabels[key], language)}
              </button>
            ))}
          </div>

          <div className="destination-grid" aria-label={text.directory}>
            {filteredCountries.map((country, index) => {
              const active = selected?.iso === country.iso;
              return (
                <button type="button" className={`destination-chip ${active ? "is-selected" : ""}`} onClick={() => setSelectedIso(country.iso)} aria-pressed={active} style={{ "--chip-index": index % 8 }} key={country.iso}>
                  <Flag iso={country.iso} />
                  <span>{localized(country.name, language)}<small>{country.products.length} {language === "tr" ? "eşleşme" : "match"}</small></span>
                  <span className="destination-chip__check" aria-hidden="true">{active ? <Check size={14} strokeWidth={3} /> : <ArrowUpRight size={14} />}</span>
                </button>
              );
            })}
            {!filteredCountries.length && <p className="empty-state">{text.noResults}</p>}
          </div>

          <div className={`destination-selection ${selected ? "is-visible" : ""}`}>
            {selected ? <><div className="destination-selection__name"><Flag iso={selected.iso} size="large" /><div><span>{text.selected}</span><strong>{localized(selected.name, language)}</strong></div></div><Link className="button button--orange button--small" to={`/contact?origin=${selected.iso}`}>{text.inquiry}<ArrowUpRight size={17} /></Link></> : <span aria-hidden="true">&nbsp;</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
