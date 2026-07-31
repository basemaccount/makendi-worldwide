import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Gauge, Search, Sparkles, X } from "lucide-react";
import { catalogProducts, categories, localized } from "../data/siteData.js";
import { Link, useLocation } from "../router.jsx";
import "../discovery-deck.css";
import "../discovery-deck-enhanced.css";

const STORAGE_KEY = "makendi-worldwide-experience-motion";
const RECENT_KEY = "makendi-worldwide-recent-destinations";
const pages = {
  en: [
    ["Home", "A clearer ingredient journey", "/"], ["Ingredients", "Twelve families and sixty listed formats", "/products"],
    ["How we work", "From requirement to destination", "/solutions"], ["Destinations", "Explore the documented network", "/network"],
    ["Company", "About Makendi Worldwide", "/company"], ["Quality", "Specification-led coordination", "/quality"],
    ["Responsibility", "A practical operating approach", "/responsibility"], ["Start an inquiry", "Build an ingredient brief", "/contact"],
  ],
  tr: [
    ["Ana sayfa", "Daha net bir bileşen yolculuğu", "/"], ["Bileşenler", "On iki aile ve altmış ürün formatı", "/products"],
    ["Nasıl çalışıyoruz", "İhtiyaçtan destinasyona", "/solutions"], ["Destinasyonlar", "Belgelenmiş ağı keşfedin", "/network"],
    ["Şirket", "Makendi Worldwide hakkında", "/company"], ["Kalite", "Spesifikasyon odaklı koordinasyon", "/quality"],
    ["Sorumluluk", "Pratik çalışma yaklaşımı", "/responsibility"], ["Talep oluştur", "Bileşen talebinizi hazırlayın", "/contact"],
  ],
};
function normalise(value) { return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en"); }
function stored(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }

export default function DiscoveryDeck({ language = "en", openRequest = null }) {
  const location = useLocation();
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const resultRefs = useRef([]);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [motion, setMotion] = useState(() => stored(STORAGE_KEY, "full"));
  const systemCalm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSearching = query !== deferredQuery;
  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.slug, category])), []);
  const items = useMemo(() => [
    ...pages[language].map(([label, detail, to], index) => ({ id: `page-${to}`, label, detail, to, type: language === "tr" ? "Sayfa" : "Page", featured: index < 5, search: `${label} ${detail}` })),
    ...categories.map((category) => ({ id: `family-${category.slug}`, label: localized(category.name, language), detail: localized(category.note, language), to: `/products/${category.slug}`, type: language === "tr" ? "Ürün ailesi" : "Ingredient family", number: category.number, featured: location.pathname.startsWith("/products"), search: `${localized(category.name, "en")} ${localized(category.name, "tr")} ${localized(category.note, language)}` })),
    ...catalogProducts.map((product) => {
      const category = categoryMap.get(product.categorySlug);
      return { id: `product-${product.categorySlug}-${product.slug}`, label: localized(product.name, language), detail: localized(category?.name, language), to: `/products/${product.categorySlug}/${product.slug}`, type: language === "tr" ? "Bileşen" : "Ingredient", number: category?.number, featured: false, search: `${localized(product.name, "en")} ${localized(product.name, "tr")} ${localized(category?.name, "en")} ${localized(category?.name, "tr")}` };
    }),
  ].map((item) => ({ ...item, searchKey: normalise(`${item.label} ${item.detail} ${item.search}`) })), [categoryMap, language, location.pathname]);
  const results = useMemo(() => {
    const term = normalise(deferredQuery.trim());
    if (term) return items.filter((item) => item.searchKey.includes(term)).slice(0, 10);
    let recent = [];
    try { recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { /* Recents are optional. */ }
    const ordered = [...recent.map((path) => items.find((item) => item.to === path)).filter(Boolean), ...items.filter((item) => item.featured && item.to !== location.pathname)];
    return [...new Map(ordered.map((item) => [item.id, item])).values()].slice(0, 8);
  }, [deferredQuery, items, location.pathname]);

  const quickPicks = useMemo(() => categories.slice(0, 4).map((category) => ({
    label: localized(category.name, language),
    value: localized(category.name, language),
    number: category.number,
  })), [language]);

  useEffect(() => { document.documentElement.dataset.motion = systemCalm || motion === "calm" ? "calm" : "full"; return () => delete document.documentElement.dataset.motion; }, [motion, systemCalm]);
  useEffect(() => {
    const beforeNavigation = () => setOpen(false);
    window.addEventListener("app:before-navigation", beforeNavigation);
    return () => window.removeEventListener("app:before-navigation", beforeNavigation);
  }, []);
  useEffect(() => {
    if (!openRequest) return;
    triggerRef.current = openRequest.trigger || document.activeElement;
    setOpen(true);
  }, [openRequest]);
  useEffect(() => {
    const dialog = dialogRef.current; if (!dialog) return;
    if (open && !dialog.open) { dialog.showModal(); document.body.classList.add("discovery-open"); requestAnimationFrame(() => inputRef.current?.focus()); }
    else if (!open && dialog.open) dialog.close();
    if (!open) document.body.classList.remove("discovery-open");
  }, [open]);
  useEffect(() => { if (!open) setQuery(""); }, [open, language]);
  const close = () => setOpen(false);
  const remember = (path) => { try { const previous = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); localStorage.setItem(RECENT_KEY, JSON.stringify([path, ...previous.filter((item) => item !== path)].slice(0, 4))); } catch { /* Storage is optional. */ } close(); };
  const toggleMotion = () => { if (systemCalm) return; const next = motion === "calm" ? "full" : "calm"; setMotion(next); try { localStorage.setItem(STORAGE_KEY, next); } catch { /* preference remains active for this visit */ } };
  const focusResult = (index) => resultRefs.current[Math.max(0, Math.min(results.length - 1, index))]?.focus();
  return (
    <dialog ref={dialogRef} className="discovery-deck" data-updating={isSearching ? "true" : "false"} aria-labelledby="discovery-title" onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => { setOpen(false); document.body.classList.remove("discovery-open"); triggerRef.current?.focus?.({ preventScroll: true }); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="discovery-deck__surface">
        <header className="discovery-deck__header"><div><span><Sparkles aria-hidden="true" />{language === "tr" ? "Makendi portföy pusulası" : "Makendi portfolio compass"}</span><h2 id="discovery-title">{language === "tr" ? "Altmış bileşen içinde doğrudan ilerleyin." : "Navigate sixty ingredients without the detour."}</h2></div><button type="button" className="discovery-deck__close" onClick={close} aria-label={language === "tr" ? "Keşif panelini kapat" : "Close discovery deck"}><X aria-hidden="true" /></button></header>
        <div className="discovery-deck__search" data-active={query ? "true" : "false"}><Search aria-hidden="true" /><label className="sr-only" htmlFor="discovery-search-input">{language === "tr" ? "Makendi Worldwide'da ara" : "Search Makendi Worldwide"}</label><input id="discovery-search-input" ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); focusResult(0); } }} placeholder={language === "tr" ? "Bileşen, aile, destinasyon veya sayfa ara…" : "Search ingredient, family, destination or page…"} autoComplete="off" autoCapitalize="none" spellCheck="false" enterKeyHint="search" aria-controls="discovery-results" aria-describedby="discovery-result-status" /><span className="discovery-deck__search-actions">{query && <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label={language === "tr" ? "Aramayı temizle" : "Clear search"}><X aria-hidden="true" /></button>}<kbd>⌘ K</kbd></span><span className="discovery-deck__search-progress" aria-hidden="true" /></div>
        <div className="discovery-deck__context"><div className="discovery-deck__meta"><span>{language === "tr" ? "12 aile · 60 bileşen" : "12 families · 60 ingredients"}</span><span id="discovery-result-status" role="status" aria-live="polite">{isSearching ? (language === "tr" ? "Aranıyor…" : "Searching…") : query ? `${results.length} ${language === "tr" ? "sonuç" : "results"}` : language === "tr" ? "Önerilen ve son görüntülenenler" : "Suggested and recently viewed"}</span></div><div className="discovery-deck__quick-picks" aria-label={language === "tr" ? "Hızlı ürün ailesi aramaları" : "Quick ingredient-family searches"}><span>{language === "tr" ? "Aileler" : "Families"}</span>{quickPicks.map((pick, index) => <button key={pick.value} type="button" style={{ "--chip-index": index }} aria-pressed={normalise(query) === normalise(pick.value)} onClick={() => { setQuery(pick.value); inputRef.current?.focus(); }}><b>{pick.number}</b>{pick.label}</button>)}</div></div>
        <div id="discovery-results" className="discovery-deck__results" role="list" aria-busy={isSearching}>{results.map((item, index) => <Link ref={(node) => { resultRefs.current[index] = node; }} key={item.id} to={item.to} role="listitem" style={{ "--result-index": index }} onClick={() => remember(item.to)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); focusResult(index + 1); } if (event.key === "ArrowUp") { event.preventDefault(); index === 0 ? inputRef.current?.focus() : focusResult(index - 1); } }}><span className="discovery-deck__visual">{item.number || "MW"}</span><span className="discovery-deck__copy"><small>{item.type}</small><strong>{item.label}</strong><em>{item.detail}</em></span><ArrowUpRight aria-hidden="true" /></Link>)}{!results.length && <div className="discovery-deck__empty"><Search aria-hidden="true" /><strong>{language === "tr" ? "Eşleşme bulunamadı." : "No match found."}</strong><span>{language === "tr" ? "Başka bir ürün, aile veya sayfa deneyin." : "Try another ingredient, family or page."}</span></div>}</div>
        <footer className="discovery-deck__footer"><button type="button" onClick={toggleMotion} disabled={systemCalm} aria-pressed={systemCalm || motion === "calm"}><Gauge aria-hidden="true" /><span><strong>{language === "tr" ? "Hareket" : "Motion"}</strong><small>{systemCalm ? (language === "tr" ? "Sistem: sakin" : "System: calm") : motion === "calm" ? (language === "tr" ? "Sakin" : "Calm") : (language === "tr" ? "Tam" : "Full")}</small></span></button><p><kbd>↑</kbd><kbd>↓</kbd>{language === "tr" ? "gezin" : "navigate"}<kbd>Esc</kbd>{language === "tr" ? "kapat" : "close"}</p></footer>
      </div>
    </dialog>
  );
}
