import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Expand,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

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
    swipe: "Swipe to browse",
    zoom: "Zoom image",
    resetZoom: "Reset image zoom",
    download: "Download image",
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
    swipe: "Gezinmek için kaydırın",
    zoom: "Görseli yakınlaştır",
    resetZoom: "Görsel yakınlaştırmasını sıfırla",
    download: "Görseli indir",
  },
};

export default function ArchiveGallery({ language = "en" }) {
  const text = copy[language];
  const dialogRef = useRef(null);
  const touchStartRef = useRef(null);
  const [active, setActive] = useState(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) dialog.showModal();
    if (active === null && dialog.open) dialog.close();
  }, [active]);

  function move(direction) {
    setZoomed(false);
    setActive((current) => (current + direction + images.length) % images.length);
  }

  function closeGallery() {
    setZoomed(false);
    setActive(null);
  }

  function beginSwipe(event) {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function endSwipe(event) {
    if (zoomed) return;
    if (!touchStartRef.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(deltaX) < 52 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    move(deltaX > 0 ? -1 : 1);
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
        onCancel={(event) => {
          event.preventDefault();
          closeGallery();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeGallery();
        }}
        aria-label={text.title}
      >
        {active !== null && (
          <div
            className="gallery-dialog__inner"
            onTouchStart={beginSwipe}
            onTouchEnd={endSwipe}
          >
            <div className="gallery-dialog__top">
              <div>
                <span aria-live="polite">
                  {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
                <small>{text.swipe}</small>
              </div>
              <button type="button" onClick={closeGallery} aria-label={text.close}>
                <X />
              </button>
            </div>
            <div className={`gallery-dialog__canvas ${zoomed ? "is-zoomed" : ""}`}>
              <img
                src={`/images/archive/${images[active][0]}.webp`}
                alt={
                  language === "tr" ? `${text.archive} ${active + 1}` : images[active][1]
                }
                width="1200"
                height="900"
                draggable="false"
                onClick={() => setZoomed((value) => !value)}
              />
            </div>
            <div className="gallery-dialog__controls">
              <button type="button" onClick={() => move(-1)} aria-label={text.previous}>
                <ArrowLeft />
                <span>{text.previous}</span>
              </button>
              <div className="gallery-dialog__tools">
                <button
                  type="button"
                  onClick={() => setZoomed((value) => !value)}
                  aria-label={zoomed ? text.resetZoom : text.zoom}
                  aria-pressed={zoomed}
                >
                  {zoomed ? <ZoomOut /> : <ZoomIn />}
                  <span>{zoomed ? text.resetZoom : text.zoom}</span>
                </button>
                <a
                  href={`/images/archive/${images[active][0]}.webp`}
                  download
                  aria-label={text.download}
                >
                  <Download />
                  <span>{text.download}</span>
                </a>
              </div>
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
