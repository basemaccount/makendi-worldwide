import { useMemo, useState } from "react";
import { ArrowUpRight, Check, MapPin, Search, X } from "lucide-react";
import { Link } from "../router.jsx";
import {
  destinationCountries,
  documentedTouchpoints,
  localized,
  regionLabels,
} from "../data/siteData.js";

const copy = {
  en: {
    eyebrow: "Destination desk",
    title: "One world. A clearer route.",
    intro:
      "Explore destination briefings, then include the market in your ingredient inquiry. Availability, documentation and routing are confirmed for each brief.",
    verified: "Documented touchpoints",
    verifiedNote:
      "These markers are locations documented on Makendi’s current public website—not a claim of offices in every market.",
    directory: "Destination briefing directory",
    search: "Search a country",
    noResults: "No destinations match this search.",
    selected: "Selected destination",
    add: "Add to inquiry",
    clear: "Clear selection",
    all: "All",
    detail: "Read the documented context",
  },
  tr: {
    eyebrow: "Destinasyon masası",
    title: "Tek dünya. Daha net bir rota.",
    intro:
      "Destinasyon özetlerini inceleyin, ardından pazarı ürün talebinize ekleyin. Uygunluk, belgeler ve rota her talep için ayrıca teyit edilir.",
    verified: "Belgelenmiş temas noktaları",
    verifiedNote:
      "Bu işaretler Makendi’nin mevcut kamuya açık sitesinde belgelenen konumlardır; her pazarda ofis bulunduğu anlamına gelmez.",
    directory: "Destinasyon özetleri",
    search: "Ülke ara",
    noResults: "Bu aramayla eşleşen destinasyon bulunamadı.",
    selected: "Seçilen destinasyon",
    add: "Talebe ekle",
    clear: "Seçimi temizle",
    all: "Tümü",
    detail: "Belgelenmiş bağlamı inceleyin",
  },
};

function Flag({ iso, name, size = "small" }) {
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
  const [selectedIso, setSelectedIso] = useState("");
  const [activeTouchpoint, setActiveTouchpoint] = useState("tr");

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(language === "tr" ? "tr-TR" : "en-US");
    return destinationCountries.filter((country) => {
      const regionMatches = region === "all" || country.region === region;
      const queryMatches =
        !normalized ||
        localized(country.name, language)
          .toLocaleLowerCase(language === "tr" ? "tr-TR" : "en-US")
          .includes(normalized);
      return regionMatches && queryMatches;
    });
  }, [language, query, region]);

  const selected = destinationCountries.find((country) => country.iso === selectedIso);
  const activePoint =
    documentedTouchpoints.find((touchpoint) => touchpoint.iso === activeTouchpoint) ||
    documentedTouchpoints[0];

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
          <div className="atlas__map" aria-label={text.verified}>
            <img src="/images/world-map.svg" alt="" width="1000" height="520" loading="lazy" />
            <div className="atlas__map-glow" aria-hidden="true" />
            {documentedTouchpoints.map((touchpoint) => (
              <button
                type="button"
                className={`atlas__pin ${activeTouchpoint === touchpoint.iso ? "is-active" : ""}`}
                style={{ "--pin-x": `${touchpoint.pin[0]}%`, "--pin-y": `${touchpoint.pin[1]}%` }}
                onClick={() => setActiveTouchpoint(touchpoint.iso)}
                aria-label={`${localized(touchpoint.city, language)}, ${localized(
                  touchpoint.country,
                  language,
                )}`}
                aria-pressed={activeTouchpoint === touchpoint.iso}
                key={touchpoint.iso}
              >
                <span className="atlas__pin-pulse" />
                <Flag
                  iso={touchpoint.iso}
                  name={localized(touchpoint.country, language)}
                  size="pin"
                />
              </button>
            ))}
          </div>

          <article
            className="touchpoint-card"
            aria-live="polite"
            key={activePoint.iso}
          >
            <div className="touchpoint-card__flag">
              <Flag
                iso={activePoint.iso}
                name={localized(activePoint.country, language)}
                size="large"
              />
            </div>
            <div>
              <p className="micro-label">{localized(activePoint.role, language)}</p>
              <h3>
                {localized(activePoint.city, language)}, {localized(activePoint.country, language)}
              </h3>
              <p>{localized(activePoint.detail, language)}</p>
            </div>
            <MapPin aria-hidden="true" />
          </article>

          <div className="atlas__context">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>{text.verified}</strong>
              <p>{text.verifiedNote}</p>
            </div>
          </div>
        </div>

        <div className="destination-desk">
          <div className="destination-desk__top">
            <p className="eyebrow">{text.directory}</p>
            <label className="search-field">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">{text.search}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={text.search}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label={text.clear}>
                  <X size={17} />
                </button>
              )}
            </label>
          </div>

          <div className="filter-row" aria-label={text.directory}>
            {Object.keys(regionLabels).map((key) => (
              <button
                type="button"
                className={region === key ? "is-active" : ""}
                onClick={() => setRegion(key)}
                aria-pressed={region === key}
                key={key}
              >
                {key === "all" ? text.all : localized(regionLabels[key], language)}
              </button>
            ))}
          </div>

          <div className="destination-grid" aria-label={text.directory}>
            {filteredCountries.map((country, index) => {
              const active = selectedIso === country.iso;
              return (
                <button
                  type="button"
                  className={`destination-chip ${active ? "is-selected" : ""}`}
                  onClick={() => setSelectedIso(active ? "" : country.iso)}
                  aria-pressed={active}
                  style={{ "--chip-index": index % 8 }}
                  key={country.iso}
                >
                  <Flag iso={country.iso} name={localized(country.name, language)} />
                  <span>{localized(country.name, language)}</span>
                  <span className="destination-chip__check" aria-hidden="true">
                    {active ? <Check size={14} strokeWidth={3} /> : <ArrowUpRight size={14} />}
                  </span>
                </button>
              );
            })}
            {!filteredCountries.length && <p className="empty-state">{text.noResults}</p>}
          </div>

          <div className={`destination-selection ${selected ? "is-visible" : ""}`}>
            {selected ? (
              <>
                <div className="destination-selection__name">
                  <Flag iso={selected.iso} name={localized(selected.name, language)} size="large" />
                  <div>
                    <span>{text.selected}</span>
                    <strong>{localized(selected.name, language)}</strong>
                  </div>
                </div>
                <Link
                  className="button button--orange button--small"
                  to={`/contact?destination=${selected.iso}`}
                >
                  {text.add}
                  <ArrowUpRight size={17} />
                </Link>
                <button
                  type="button"
                  className="destination-selection__clear"
                  onClick={() => setSelectedIso("")}
                >
                  <X size={16} />
                  {text.clear}
                </button>
              </>
            ) : (
              <span aria-hidden="true">&nbsp;</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
