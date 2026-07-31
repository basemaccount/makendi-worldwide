import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "../router.jsx";

let discoveryModule;
let discoveryModulePromise;

const loadDiscoveryDeck = () => {
  if (discoveryModule) return Promise.resolve(discoveryModule);
  if (!discoveryModulePromise) {
    discoveryModulePromise = import("./DiscoveryDeck.jsx")
      .then((module) => {
        discoveryModule = module;
        return module;
      })
      .catch((error) => {
        discoveryModulePromise = null;
        throw error;
      });
  }
  return discoveryModulePromise;
};

function setTriggerLoading(trigger, loading) {
  if (!(trigger instanceof HTMLElement)) return;
  trigger.classList.toggle("is-loading", loading);
  if (loading) trigger.setAttribute("aria-busy", "true");
  else trigger.removeAttribute("aria-busy");
}

function DiscoveryBoot({ error, language, onRetry }) {
  const copy = language === "tr"
    ? error
      ? ["Arama yüklenemedi", "Bağlantıyı kontrol edip yeniden deneyin.", "Yeniden dene"]
      : ["Portföy araması hazırlanıyor", "Bileşen pusulası bu sayfadan ayrılmadan açılıyor."]
    : error
      ? ["Search could not load", "Check your connection and try again.", "Try again"]
      : ["Preparing portfolio search", "Opening the ingredient compass without leaving this page."];

  return (
    <div className={`discovery-boot ${error ? "is-error" : ""}`} role={error ? "alert" : "status"} aria-live={error ? "assertive" : "polite"} aria-atomic="true">
      <span className="discovery-boot__signal" aria-hidden="true"><span /></span>
      <span className="discovery-boot__copy"><strong>{copy[0]}</strong><small>{copy[1]}</small></span>
      {error && <button type="button" onClick={onRetry}>{copy[2]}</button>}
    </div>
  );
}

export default function ExperienceLayer({ language = "en" }) {
  const location = useLocation();
  const progressRef = useRef(null);
  const [showTop, setShowTop] = useState(false);
  const [discoveryRequest, setDiscoveryRequest] = useState(null);
  const [DiscoveryDeck, setDiscoveryDeck] = useState(() => discoveryModule?.default || null);
  const [discoveryPending, setDiscoveryPending] = useState(false);
  const [discoveryLoadError, setDiscoveryLoadError] = useState(false);
  const discoveryAttempt = useRef(0);
  const discoveryTrigger = useRef(null);
  const lastDiscoveryRequest = useRef({ trigger: null, source: null });

  const openDiscovery = useCallback((detail = {}) => {
    const focusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const trigger = detail.trigger instanceof HTMLElement ? detail.trigger : focusedElement;
    const source = detail.source instanceof HTMLElement ? detail.source : trigger;
    const attempt = discoveryAttempt.current + 1;

    discoveryAttempt.current = attempt;
    lastDiscoveryRequest.current = { trigger, source };
    setTriggerLoading(discoveryTrigger.current, false);
    discoveryTrigger.current = source;
    setTriggerLoading(source, true);
    setDiscoveryLoadError(false);
    setDiscoveryPending(true);

    loadDiscoveryDeck()
      .then((module) => {
        if (discoveryAttempt.current !== attempt) return;
        setDiscoveryDeck(() => module.default);
        setDiscoveryRequest({ id: window.performance.now(), trigger });
        setDiscoveryPending(false);
        setTriggerLoading(source, false);
      })
      .catch(() => {
        if (discoveryAttempt.current !== attempt) return;
        setDiscoveryPending(false);
        setDiscoveryLoadError(true);
        setTriggerLoading(source, false);
      });
  }, []);

  useEffect(() => {
    const show = (event) => openDiscovery(event.detail || {});
    const preload = () => { void loadDiscoveryDeck().catch(() => {}); };
    const onKeyDown = (event) => {
      const target = event.target;
      const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openDiscovery({ trigger: document.activeElement }); }
      else if (!editing && event.key === "/") { event.preventDefault(); openDiscovery({ trigger: document.activeElement }); }
    };
    const warmTimer = window.setTimeout(() => {
      const connection = navigator.connection;
      if (!connection?.saveData && !/2g/.test(connection?.effectiveType || "")) preload();
    }, 4000);
    window.addEventListener("app:open-discovery", show);
    window.addEventListener("app:preload-discovery", preload);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(warmTimer);
      discoveryAttempt.current += 1;
      setTriggerLoading(discoveryTrigger.current, false);
      window.removeEventListener("app:open-discovery", show);
      window.removeEventListener("app:preload-discovery", preload);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openDiscovery]);

  useEffect(() => {
    const main = document.getElementById("main-content");
    window.scrollTo({ top: 0, behavior: "instant" });
    if (main) main.focus({ preventScroll: true });
  }, [location.pathname]);

  useEffect(() => {
    let observer;
    const prepareReveals = () => {
      const nodes = document.querySelectorAll(".reveal:not(.is-visible)");

      const groups = document.querySelectorAll(
        [
          ".category-grid",
          ".principle-grid",
          ".format-related__grid",
          ".process-list",
          ".quality-stage-list",
          ".document-grid",
          ".event-grid",
          ".archive-gallery__grid",
          ".product-list",
        ].join(","),
      );
      groups.forEach((group) => {
        [...group.children]
          .filter((node) => node.classList.contains("reveal"))
          .forEach((node, index) => {
            node.style.setProperty("--reveal-order", Math.min(index, 5));
          });
      });

      nodes.forEach((node) => {
        let variant = "rise";
        if (
          node.matches(
            ".section-heading, .atlas__heading, .archive-gallery__heading",
          )
        ) {
          variant = "heading";
        } else if (
          node.matches(
            ".category-card, .principle-card, .format-related__card, .company-link-card, .atlas-note",
          )
        ) {
          variant = "card";
        } else if (
          node.matches(
            ".quality-feature__media, .service-image-section__media, .quality-page__image, .responsibility-story__media, .archive-tile, .event-card",
          )
        ) {
          variant = "media";
        } else if (
          node.matches(
            ".product-list > li, .process-row, .quality-stage, .mini-service",
          )
        ) {
          variant = "row";
        }
        node.dataset.reveal = variant;
      });

      if (!("IntersectionObserver" in window)) {
        nodes.forEach((node) => node.classList.add("is-visible"));
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: window.matchMedia("(max-width: 720px)").matches
            ? 0.045
            : 0.08,
          rootMargin: "0px 0px -5% 0px",
        },
      );
      nodes.forEach((node) => observer.observe(node));
    };

    const raf = requestAnimationFrame(prepareReveals);
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const next =
          scrollable > 0
            ? Math.min(1, window.scrollY / scrollable)
            : 0;
        progressRef.current?.style.setProperty(
          "--scroll-progress",
          String(next),
        );
        const nextShowTop = window.scrollY > window.innerHeight * 0.75;
        setShowTop((current) =>
          current === nextShowTop ? current : nextShowTop,
        );
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {(discoveryPending || discoveryLoadError) && <DiscoveryBoot error={discoveryLoadError} language={language} onRetry={() => openDiscovery(lastDiscoveryRequest.current)} />}
      {DiscoveryDeck && discoveryRequest && <DiscoveryDeck language={language} openRequest={discoveryRequest} />}
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <div className="route-transition-indicator" aria-hidden="true" />
      <button
        type="button"
        className={`back-to-top ${showTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={language === "tr" ? "Sayfanın başına dön" : "Back to top"}
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUp size={19} />
      </button>
    </>
  );
}
