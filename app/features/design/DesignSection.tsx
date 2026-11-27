import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ModalDialog } from "~/components/ui/ModalDialog";
import { ArrowRightIcon, SectionHeader, buttonVariants } from "~/components/ui/Primitives";
import { useTooltip } from "~/components/ui/TooltipProvider";
import { SITE_CONTENT } from "~/content/site";
import { useMagnetic, useReducedMotion } from "~/hooks/useMotion";
import type { WorkImageItem, WorkItem } from "~/lib/db/types";
import { mediaUrl } from "~/lib/media";

type ActiveModal =
  | { kind: "bloomsky"; startIndex: number; items: WorkImageItem[] }
  | { kind: "work"; work: WorkItem }
  | null;

export const DesignSection = ({ works }: { works: WorkItem[] }) => {
  const { bindTooltip, hideTooltip } = useTooltip();
  const reduced = useReducedMotion();
  const sec = SITE_CONTENT.sections.design;

  const bloomsky = works.find((w) => w.featured);
  const otherWorks = works.filter((w) => !w.featured);

  const [selectedChapter, setSelectedChapter] = useState(0);
  const [fading, setFading] = useState(false);
  const [displayedChapter, setDisplayedChapter] = useState(0);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const stripRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const bloomBtnRef = useRef<HTMLButtonElement | null>(null);
  useMagnetic(bloomBtnRef);

  const chapters = bloomsky?.bloomskyMeta?.chapters ?? [
    "Tất cả",
    "Logo guideline",
    "Ấn phẩm văn phòng",
    "Ứng dụng hàng không",
    "Truyền thông",
  ];

  const allBloomImages = bloomsky?.images ?? [];
  const filteredImages =
    displayedChapter === 0
      ? allBloomImages
      : allBloomImages.filter((img) => img.chapter === chapters[displayedChapter]);

  const handleSelectChapter = (nextIdx: number) => {
    if (nextIdx === selectedChapter) return;
    setSelectedChapter(nextIdx);
    if (reduced) {
      setDisplayedChapter(nextIdx);
      if (stripRef.current) stripRef.current.scrollLeft = 0;
      return;
    }
    setFading(true);
    setTimeout(() => {
      setDisplayedChapter(nextIdx);
      if (stripRef.current) stripRef.current.scrollLeft = 0;
      requestAnimationFrame(() => {
        setFading(false);
      });
    }, 220);
  };

  const scrollStrip = (dir: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth * 0.8,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const scrollGallery = (dir: -1 | 1) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth * 0.95,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    if (!activeModal || activeModal.kind !== "bloomsky") return;
    const raf = requestAnimationFrame(() => {
      const gal = galleryRef.current;
      if (gal) {
        gal.scrollLeft = activeModal.startIndex * gal.clientWidth;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [activeModal]);

  const openBloomModal = (startIndex: number, items: WorkImageItem[]) => {
    hideTooltip();
    setActiveModal({ kind: "bloomsky", startIndex, items });
  };

  const openWorkModal = (work: WorkItem) => {
    hideTooltip();
    setActiveModal({ kind: "work", work });
  };

  return (
    <section className="band night" id="thiet-ke" aria-labelledby="heading-thiet-ke">
      <div className="wrap">
        <SectionHeader
          id="heading-thiet-ke"
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
        />

        {bloomsky && bloomsky.bloomskyMeta ? (
          <div className="bloom-wrap">
            <div className="bl-top">
              <div className="bl-info glass rv">
                <span className="bl-kick">{bloomsky.bloomskyMeta.kicker}</span>
                <h3>{bloomsky.title}</h3>
                <p className="bl-quote">{bloomsky.bloomskyMeta.quote}</p>
                <p className="bl-desc">{bloomsky.description}</p>

                <div className="bl-facts">
                  {bloomsky.bloomskyMeta.facts.map((fact, idx) => (
                    <div
                      key={idx}
                      {...bindTooltip(fact.tipTitle, fact.tipBody)}
                    >
                      <b>{fact.value}</b>
                      <span>{fact.label}</span>
                    </div>
                  ))}
                </div>

                <div className="bl-row">
                  <small>Màu</small>
                  {bloomsky.bloomskyMeta.swatches.map((sw) => (
                    <button
                      key={sw.hex}
                      type="button"
                      className="bl-swatch"
                      aria-label={`${sw.tipTitle}: ${sw.hex}`}
                      style={{ "--c": sw.hex } as CSSProperties}
                      {...bindTooltip(sw.tipTitle, sw.tipBody)}
                    />
                  ))}
                </div>

                <div className="bl-row">
                  <small>Phông chữ</small>
                  {bloomsky.bloomskyMeta.fonts.map((f) => (
                    <span
                      key={f.name}
                      className={`bl-font-pill${f.italicBold ? " is-pn" : ""}`}
                      {...bindTooltip(f.tipTitle, f.tipBody)}
                    >
                      {f.name}
                    </span>
                  ))}
                </div>

                <button
                  ref={bloomBtnRef}
                  type="button"
                  className={buttonVariants({ intent: "bloom" })}
                  style={{ justifySelf: "start", alignSelf: "start" }}
                  onClick={() => openBloomModal(0, allBloomImages)}
                >
                  Xem guidebook
                  <ArrowRightIcon />
                </button>
              </div>

              <button
                type="button"
                className="bl-cover rv"
                style={{ "--d": "120ms" } as CSSProperties}
                aria-label="Mở guidebook Bloomsky Airways"
                onClick={() => openBloomModal(0, allBloomImages)}
              >
                <img
                  src={mediaUrl(bloomsky.bloomskyMeta.coverKey)}
                  alt={bloomsky.bloomskyMeta.coverAlt}
                  width={1600}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
                <span className="shot-overlay glass">
                  <span>Bloomsky Airways Guidebook</span>
                  <span>136 trang</span>
                </span>
              </button>
            </div>

            <div className="bl-bar">
              <div className="bl-tabs" role="group" aria-label="Lọc theo chương">
                {chapters.map((chap, idx) => (
                  <button
                    key={chap}
                    type="button"
                    aria-pressed={selectedChapter === idx}
                    onClick={() => handleSelectChapter(idx)}
                  >
                    {chap}
                  </button>
                ))}
              </div>
              <div className="bl-nav">
                <button
                  type="button"
                  aria-label="Trang trước"
                  onClick={() => scrollStrip(-1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Trang sau"
                  onClick={() => scrollStrip(1)}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="bl-strip-outer">
              <div
                ref={stripRef}
                className="bl-strip"
                tabIndex={0}
                role="region"
                aria-label="Các trang nổi bật trong guidebook"
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") scrollStrip(1);
                  if (e.key === "ArrowLeft") scrollStrip(-1);
                }}
              >
                {filteredImages.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`bl-strip-item${fading ? " is-fading" : ""}`}
                    style={
                      !reduced && !fading
                        ? ({ transitionDelay: `${idx * 40}ms` } as CSSProperties)
                        : undefined
                    }
                    aria-label={`Xem lớn: ${img.caption}`}
                    onClick={() => openBloomModal(idx, filteredImages)}
                  >
                    <figure>
                      <div className="bl-strip-pic">
                        <img
                          src={mediaUrl(img.mediaKey)}
                          alt={img.caption}
                          width={img.width}
                          height={img.height}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <figcaption>
                        <b>{img.caption}</b>
                        <span>{img.chapter}</span>
                      </figcaption>
                    </figure>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <h3 className="works-heading rv">{sec.moreTitle}</h3>
        <div className="works-grid">
          {otherWorks.map((work, idx) => {
            const firstImg = work.images[0];
            return (
              <button
                key={work.id}
                type="button"
                className="work-card rv"
                style={{ "--d": `${(idx % 2) * 100}ms` } as CSSProperties}
                aria-label={`Xem tác phẩm ${work.title}`}
                onClick={() => openWorkModal(work)}
              >
                <figure
                  className="work-shot"
                  style={{ "--tone": work.tone } as CSSProperties}
                >
                  {firstImg ? (
                    <img
                      src={mediaUrl(firstImg.mediaKey)}
                      alt={work.title}
                      width={firstImg.width}
                      height={firstImg.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <span className="shot-overlay glass">
                    <span>{work.kind}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      Xem ảnh lớn <ArrowRightIcon />
                    </span>
                  </span>
                </figure>
                <div className="work-meta">
                  <h3>{work.title}</h3>
                  <span className="work-type">{work.kind}</span>
                </div>
                <p>{work.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <ModalDialog
        open={activeModal !== null}
        onClose={() => setActiveModal(null)}
        labelledBy="design-dlg-title"
        variant="sheet"
      >
        {activeModal ? (
          <div
            className="pf-sheet glass"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") scrollGallery(1);
              if (e.key === "ArrowLeft") scrollGallery(-1);
            }}
          >
            <button
              type="button"
              className="pf-close-btn"
              aria-label="Đóng"
              autoFocus
              onClick={() => setActiveModal(null)}
            >
              ×
            </button>

            {activeModal.kind === "bloomsky" ? (
              <>
                <div className="case-top">
                  <span>Đồ án nhận diện thương hiệu, 2024</span>
                  <span className="pf-tag">{activeModal.items.length} trang nổi bật</span>
                </div>
                <h1 id="design-dlg-title">Bloomsky Airways Guidebook</h1>
                <p className="lead" style={{ fontSize: "16px" }}>
                  Bộ nhận diện thương hiệu cho hãng hàng không Bloomsky Airways, từ logo, ấn phẩm văn phòng đến ứng dụng hàng không và truyền thông.
                </p>
                <div
                  ref={galleryRef}
                  className="pf-gal"
                  tabIndex={0}
                  aria-label="Thư viện guidebook"
                >
                  {activeModal.items.map((item) => (
                    <figure key={item.id} className="pf-gal-slide">
                      <img
                        src={mediaUrl(item.mediaKey)}
                        alt={item.caption}
                        width={item.width}
                        height={item.height}
                      />
                      <figcaption>
                        <b>{item.caption}</b>, {item.chapter}. {item.note}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <div className="pf-gal-nav">
                  <span>Dùng phím mũi tên để chuyển trang</span>
                  <div className="pf-gal-nav-btns">
                    <button
                      type="button"
                      aria-label="Trang trước"
                      onClick={() => scrollGallery(-1)}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Trang sau"
                      onClick={() => scrollGallery(1)}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="case-top">
                  <span>{activeModal.work.kind}</span>
                  <span className="pf-tag">Thiết kế cá nhân</span>
                </div>
                <h1 id="design-dlg-title">{activeModal.work.title}</h1>
                <p className="lead" style={{ fontSize: "16px" }}>
                  {activeModal.work.description}
                </p>
                <div
                  ref={galleryRef}
                  className="pf-gal"
                  tabIndex={0}
                  aria-label="Thư viện ảnh"
                >
                  {activeModal.work.images.map((img, idx) => (
                    <figure key={img.id} className="pf-gal-slide is-work">
                      <img
                        src={mediaUrl(img.mediaKey)}
                        alt={
                          activeModal.work.images.length > 1
                            ? `${activeModal.work.title}, ảnh ${idx + 1}`
                            : activeModal.work.title
                        }
                        width={img.width}
                        height={img.height}
                      />
                    </figure>
                  ))}
                </div>
                <div className="pf-gal-nav">
                  <a
                    href={sec.originalPortfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem trên portfolio gốc
                  </a>
                  {activeModal.work.images.length > 1 ? (
                    <div className="pf-gal-nav-btns">
                      <button
                        type="button"
                        aria-label="Ảnh trước"
                        onClick={() => scrollGallery(-1)}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        aria-label="Ảnh sau"
                        onClick={() => scrollGallery(1)}
                      >
                        ›
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        ) : null}
      </ModalDialog>
    </section>
  );
};
