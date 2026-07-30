import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "../router.jsx";

export default function ExperienceLayer({ language = "en" }) {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const main = document.getElementById("main-content");
    window.scrollTo({ top: 0, behavior: "instant" });
    if (main) main.focus({ preventScroll: true });
  }, [location.pathname]);

  useEffect(() => {
    const reveal = () => {
      const nodes = document.querySelectorAll(".reveal:not(.is-visible)");
      if (!("IntersectionObserver" in window)) {
        nodes.forEach((node) => node.classList.add("is-visible"));
        return () => {};
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
      );
      nodes.forEach((node) => observer.observe(node));
      return () => observer.disconnect();
    };

    const cleanup = reveal();
    const raf = requestAnimationFrame(reveal);
    return () => {
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
      setProgress(next);
      setShowTop(window.scrollY > window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
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
