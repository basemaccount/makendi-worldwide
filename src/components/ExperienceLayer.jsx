import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "../router.jsx";
import DiscoveryDeck from "./DiscoveryDeck.jsx";

export default function ExperienceLayer({ language = "en" }) {
  const location = useLocation();
  const progressRef = useRef(null);
  const [showTop, setShowTop] = useState(false);

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
      <DiscoveryDeck language={language} />
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
