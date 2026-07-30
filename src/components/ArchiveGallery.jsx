import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

const images = [
  ["gallery-cocoa-pallet", "Cocoa powder pallets"],
  ["gallery-creamer", "Makendi creamer packaging"],
  ["gallery-spray-coffee", "Spray-dried instant coffee"],
  ["gallery-corn-starch", "Corn starch shipment"],
  ["gallery-dextrose", "Dextrose packaging"],
  ["gallery-f42", "F42 ingredient container"],
  ["gallery-production-01", "Historical production photograph"],
  ["gallery-trade-01", "Historical trade-event photograph"],
  ["gallery-product-01", "Historical product photograph"],
];

const copy = {
  en: {
    title: "Historical photo archive",
    intro:
      "A curated selection migrated from the current Makendi gallery. Images are retained as historical company material.",
    expand: "Enlarge image",
    close: "Close gallery",
    previous: "Previous image",
    next: "Next image",
    archive: "Archive image",
  },
  tr: {
    title: "Tarihî fotoğraf arşivi",
    intro:
      "Makendi’nin mevcut galerisinden aktarılan seçkidir. Görseller tarihî şirket materyali olarak korunmaktadır.",
    expand: "Görseli büyüt",
    close: "Galeriyi kapat",
    previous: "Önceki görsel",
    next: "Sonraki görsel",
    archive: "Arşiv görseli",
  },
};

export default function ArchiveGallery({ language = "en" }) {
  const text = copy[language];
  const dialogRef = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) dialog.showModal();
    if (active === null && dialog.open) dialog.close();
  }, [active]);

  function move(direction) {
    setActive((current) => (current + direction + images.length) % images.length);
  }

  return (
    <section className="archive-gallery" aria-labelledby="archive-gallery-title">
      <div className="archive-gallery__heading reveal">
        <div>
          <p className="eyebrow eyebrow--orange">03 / Gallery</p>
          <h2 id="archive-gallery-title">{text.title}</h2>
        </div>
        <p className="lede">{text.intro}</p>
      </div>
      <div className="archive-gallery__grid">
        {images.map(([name, englishAlt], index) => (
          <button
            type="button"
            className={`archive-tile archive-tile--${(index % 5) + 1} reveal`}
            onClick={() => setActive(index)}
            aria-label={`${text.expand}: ${englishAlt}`}
            key={name}
          >
            <img
              src={`/images/archive/${name}.webp`}
              alt={language === "tr" ? `${text.archive} ${index + 1}` : englishAlt}
              width="1024"
              height="768"
              loading="lazy"
              decoding="async"
            />
            <span className="archive-tile__index">0{index + 1}</span>
            <span className="archive-tile__expand" aria-hidden="true">
              <Expand size={18} />
            </span>
          </button>
        ))}
      </div>

      <dialog
        className="gallery-dialog"
        ref={dialogRef}
        onClose={() => setActive(null)}
        aria-label={text.title}
      >
        {active !== null && (
          <div className="gallery-dialog__inner">
            <div className="gallery-dialog__top">
              <span>
                {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => setActive(null)} aria-label={text.close}>
                <X />
              </button>
            </div>
            <img
              src={`/images/archive/${images[active][0]}.webp`}
              alt={
                language === "tr" ? `${text.archive} ${active + 1}` : images[active][1]
              }
              width="1200"
              height="900"
            />
            <div className="gallery-dialog__controls">
              <button type="button" onClick={() => move(-1)} aria-label={text.previous}>
                <ArrowLeft />
                <span>{text.previous}</span>
              </button>
              <button type="button" onClick={() => move(1)} aria-label={text.next}>
                <span>{text.next}</span>
                <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
