import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import { ModalDialog } from "~/components/ui/ModalDialog";
import { useTooltip } from "~/components/ui/TooltipProvider";
import { useCountUp } from "~/hooks/useCountUp";
import type {
  ContentBlock,
  CoverConfig,
  ProjectDetailItem,
  ProjectResultItem,
  RichParagraph,
} from "~/lib/db/types";
import { mediaUrl } from "~/lib/media";

type LightboxState = {
  src: string;
  alt: string;
  caption: string;
} | null;

const RichText = ({ segments }: { segments: RichParagraph }) => {
  const { bindTooltip } = useTooltip();

  return (
    <>
      {segments.map((seg, idx) => {
        if (seg.kind === "text") {
          return <span key={idx}>{seg.text}</span>;
        }
        if (seg.kind === "bold") {
          return <b key={idx}>{seg.text}</b>;
        }
        if (seg.kind === "abbr") {
          return (
            <abbr
              key={idx}
              className="pf-abbr"
              {...bindTooltip(seg.tipTitle, seg.tipBody)}
            >
              {seg.text}
            </abbr>
          );
        }
        return (
          <a
            key={idx}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {seg.text}
          </a>
        );
      })}
    </>
  );
};

const BeforeAfterComparison = ({
  beforeKey,
  beforeAlt,
  afterKey,
  afterAlt,
  caption,
  source,
}: {
  beforeKey: string;
  beforeAlt: string;
  afterKey: string;
  afterAlt: string;
  caption: string;
  source?: string;
}) => {
  const [percent, setPercent] = useState(50);

  return (
    <figure className="case-figure rv">
      <div
        className="case-ba"
        style={{ "--x": `${percent}%` } as CSSProperties}
      >
        <img
          src={mediaUrl(beforeKey)}
          alt={beforeAlt}
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
        />
        <img
          className="ba-after"
          src={mediaUrl(afterKey)}
          alt={afterAlt}
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
        />
        <span className="ba-handle" aria-hidden="true" />
        <span className="ba-knob glass" aria-hidden="true">
          ↔
        </span>
        <span className="ba-lbl ba-l1 glass" aria-hidden="true">
          Trước
        </span>
        <span className="ba-lbl ba-l2 glass" aria-hidden="true">
          Sau
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          aria-label="Kéo để so sánh trước và sau"
          onChange={(e) => setPercent(Number(e.target.value))}
        />
      </div>
      <figcaption>
        {caption} {source ? <em>Nguồn: {source}</em> : null}
      </figcaption>
    </figure>
  );
};

const ResultMetricCard = ({ item }: { item: ProjectResultItem }) => {
  const { bindTooltip } = useTooltip();
  const { ref, text } = useCountUp({
    value: item.value,
    decimals: item.decimals,
    prefix: item.prefix,
    suffix: item.suffix,
    fallbackDisplay: item.displayText,
  });

  return (
    <div
      className="case-res-card rv"
      {...bindTooltip(item.tipTitle, item.tipBody)}
    >
      <b ref={ref}>{text}</b>
      <span>{item.label}</span>
    </div>
  );
};

const BlockRenderer = ({
  block,
  onOpenLightbox,
}: {
  block: ContentBlock;
  onOpenLightbox: (state: LightboxState) => void;
}) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="rv">
          <RichText segments={block.segments} />
        </p>
      );

    case "heading3":
      return (
        <h3 className="rv">
          {block.kicker ? (
            <small
              style={{
                display: "block",
                font: "500 14px var(--fb)",
                color: "var(--camel)",
                marginBottom: "6px",
                letterSpacing: 0,
              }}
            >
              {block.kicker}
            </small>
          ) : null}
          {block.text}
        </h3>
      );

    case "heading4":
      return <h4 className="rv">{block.text}</h4>;

    case "list":
      return (
        <ul className="case-list rv">
          {block.items.map((item, idx) => (
            <li key={idx}>
              <RichText segments={item} />
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <div className="case-quote rv">
          <b>{block.quote}</b>
          <span>{block.attribution}</span>
        </div>
      );

    case "phases":
      return (
        <div className={`case-phases${block.autoFit ? " is-autofit" : ""}`}>
          {block.items.map((ph, idx) => {
            const inner = (
              <>
                {ph.kicker ? <small>{ph.kicker}</small> : null}
                <b>{ph.title}</b>
                {ph.description ? <p>{ph.description}</p> : null}
              </>
            );
            return ph.href ? (
              <a
                key={idx}
                href={ph.href}
                className="case-phase glass rv"
                style={{ "--d": `${idx * 70}ms` } as CSSProperties}
              >
                {inner}
              </a>
            ) : (
              <div
                key={idx}
                className="case-phase glass rv"
                style={{ "--d": `${idx * 70}ms` } as CSSProperties}
              >
                {inner}
              </div>
            );
          })}
        </div>
      );

    case "figure": {
      const fullCaption = block.source
        ? `${block.caption} Nguồn: ${block.source}`
        : block.caption;

      if (block.layout === "single") {
        const img = block.images[0];
        if (!img) return null;
        return (
          <figure className="case-figure rv">
            <button
              type="button"
              className="case-media-btn"
              aria-label={`Phóng to hình ảnh: ${img.alt}`}
              onClick={() =>
                onOpenLightbox({
                  src: mediaUrl(img.mediaKey),
                  alt: img.alt,
                  caption: fullCaption,
                })
              }
            >
              <img
                src={mediaUrl(img.mediaKey)}
                alt={img.alt}
                width={img.width ?? 1200}
                height={img.height ?? 800}
                loading="lazy"
                decoding="async"
              />
            </button>
            <figcaption>
              {block.caption} {block.source ? <em>Nguồn: {block.source}</em> : null}
            </figcaption>
          </figure>
        );
      }

      const gridClass =
        block.layout === "grid2"
          ? "case-grid2"
          : block.layout === "grid3"
            ? "case-grid3"
            : "case-grid4";

      return (
        <figure className="case-figure rv">
          <div className={gridClass}>
            {block.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className="case-media-btn"
                style={
                  block.aspectRatio
                    ? ({ "--ar": block.aspectRatio } as CSSProperties)
                    : undefined
                }
                aria-label={`Phóng to hình ảnh: ${img.alt}`}
                onClick={() =>
                  onOpenLightbox({
                    src: mediaUrl(img.mediaKey),
                    alt: img.alt,
                    caption: fullCaption,
                  })
                }
              >
                <img
                  src={mediaUrl(img.mediaKey)}
                  alt={img.alt}
                  width={img.width ?? 800}
                  height={img.height ?? 800}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
          <figcaption>
            {block.caption} {block.source ? <em>Nguồn: {block.source}</em> : null}
          </figcaption>
        </figure>
      );
    }

    case "tallPair":
      return (
        <div
          className="case-tall rv"
          style={
            block.columns
              ? ({ gridTemplateColumns: block.columns } as CSSProperties)
              : undefined
          }
        >
          {block.items.map((item, idx) => {
            const fullCaption = item.source
              ? `${item.caption} Nguồn: ${item.source}`
              : item.caption;
            return (
              <figure key={idx} style={{ margin: 0 }}>
                <button
                  type="button"
                  className="case-media-btn"
                  aria-label={`Phóng to hình ảnh: ${item.alt}`}
                  onClick={() =>
                    onOpenLightbox({
                      src: mediaUrl(item.mediaKey),
                      alt: item.alt,
                      caption: fullCaption,
                    })
                  }
                >
                  <img
                    src={mediaUrl(item.mediaKey)}
                    alt={item.alt}
                    width={1000}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                <figcaption>
                  {item.caption} {item.source ? <em>Nguồn: {item.source}</em> : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      );

    case "beforeAfter":
      return (
        <BeforeAfterComparison
          beforeKey={block.beforeKey}
          beforeAlt={block.beforeAlt}
          afterKey={block.afterKey}
          afterAlt={block.afterAlt}
          caption={block.caption}
          source={block.source}
        />
      );

    case "video":
      return (
        <figure className="case-figure rv">
          <video
            className="case-video"
            controls
            playsInline
            preload="none"
            width={block.width}
            height={block.height}
            poster={mediaUrl(block.posterKey)}
            {...({ loading: "lazy" } as Record<string, string>)}
          >
            <source src={mediaUrl(block.videoKey)} type="video/mp4" />
            Trình duyệt của bạn không phát được video.
          </video>
          <figcaption>
            {block.caption} {block.source ? <em>Nguồn: {block.source}</em> : null}
          </figcaption>
        </figure>
      );

    case "table":
      return (
        <div className="case-table-wrap rv">
          <table className="case-table">
            <thead>
              <tr>
                {block.headers.map((h, idx) => (
                  <th key={idx}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "stage":
      return (
        <div className="case-stage" id={block.id}>
          <h3 className="rv">
            <small>{block.kicker}</small>
            {block.title}
          </h3>
          {block.blocks.map((sub, idx) => (
            <BlockRenderer
              key={idx}
              block={sub}
              onOpenLightbox={onOpenLightbox}
            />
          ))}
        </div>
      );
  }
};

const CoverView = ({ cover }: { cover: CoverConfig }) => {
  if (cover.kind === "single") {
    return (
      <div className="case-cover case-cover-reveal">
        <img
          src={mediaUrl(cover.mediaKey)}
          alt={cover.alt}
          width={1200}
          height={900}
          fetchPriority="high"
          decoding="async"
        />
      </div>
    );
  }

  if (cover.kind === "triptych") {
    return (
      <div className="case-cover case-cover-reveal">
        <div className="case-triptych">
          {cover.images.map((im, idx) => (
            <img
              key={idx}
              src={mediaUrl(im.mediaKey)}
              alt={im.alt}
              width={400}
              height={700}
              fetchPriority={idx === 0 ? "high" : undefined}
              decoding="async"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="case-cover case-cover-reveal">
      <div className="case-type-cover">
        <span>{cover.kicker}</span>
        <b>{cover.headline}</b>
      </div>
    </div>
  );
};

export const CaseStudyPage = ({ project }: { project: ProjectDetailItem }) => {
  const [progress, setProgress] = useState(0);
  const [activeToc, setActiveToc] = useState<string>(project.toc[0]?.id ?? "tong-quan");
  const [navHidden, setNavHidden] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, y / total)) : 0);

      let cur = project.toc[0]?.id ?? "tong-quan";
      for (const item of project.toc) {
        const sec = document.getElementById(item.id);
        if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.35) {
          cur = item.id;
        }
      }
      setActiveToc(cur);

      const modalOpen = Boolean(document.querySelector("dialog[open]"));
      setNavHidden(y > lastY && y > 400 && !modalOpen);
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [project.toc]);

  return (
    <div
      style={
        {
          "--accent": project.accent,
          "--accent-bg": project.accentBg,
        } as CSSProperties
      }
    >
      <div
        className="case-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${progress})` }}
      />

      <nav
        className={`case-top-nav glass${navHidden ? " is-hidden" : ""}`}
        aria-label="Điều hướng"
      >
        <Link className="case-home-link" to="/">
          Lê Thùy Trang
        </Link>
        <span className="case-crumb">
          Dự án nổi bật / {project.body.breadcrumbTitle}
        </span>
        <Link
          className="pf-btn pf-btn-dark"
          to="/#du-an"
          style={{ minHeight: "44px", padding: "0 18px", fontSize: "14px" }}
        >
          Về portfolio
        </Link>
      </nav>

      <header className="case-hero">
        <div className="wrap case-hero-grid">
          <div>
            <div className="case-brand-pill glass rv">
              <i aria-hidden="true" />
              {project.brand}, {project.year}
            </div>
            <h1 className="rv">{project.title}</h1>
            <p className="case-sub rv">{project.subtitle}</p>
            <div className="case-chips rv">
              {project.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </div>

          <CoverView cover={project.body.cover} />
        </div>
      </header>

      <main className="wrap case-layout">
        <aside className="case-toc glass" aria-label="Mục lục">
          <b>Nội dung</b>
          {project.toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeToc === item.id ? "is-on" : undefined}
            >
              {item.label}
            </a>
          ))}
        </aside>

        <article className="case-article">
          <section id="tong-quan">
            <h2 className="rv">
              {project.layout === "work-summary" ? "Tổng quan" : "Tổng quan chiến dịch"}
            </h2>
            <div className="case-overview">
              <p className="case-overview-lead rv">
                <RichText segments={project.body.overviewLead} />
              </p>

              <div className="case-info glass rv">
                <h3>{project.body.infoTitle}</h3>
                <dl>
                  {project.body.infoRows.map((row) => (
                    <div key={row.term} style={{ display: "contents" }}>
                      <dt>{row.term}</dt>
                      <dd>{row.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {project.body.overviewExtraBlocks?.map((blk, idx) => (
              <BlockRenderer
                key={idx}
                block={blk}
                onOpenLightbox={setLightbox}
              />
            ))}
          </section>

          {project.body.sections.map((sec) => (
            <section key={sec.id} id={sec.id}>
              <h2 className="rv">
                {sec.kicker ? <small className="k">{sec.kicker}</small> : null}
                {sec.title}
              </h2>
              {sec.tags && sec.tags.length > 0 ? (
                <div className="case-tags rv">
                  {sec.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              ) : null}
              {sec.blocks.map((blk, idx) => (
                <BlockRenderer
                  key={idx}
                  block={blk}
                  onOpenLightbox={setLightbox}
                />
              ))}
            </section>
          ))}

          <section id="ket-qua">
            <h2 className="rv">Kết quả</h2>
            <div className="case-results">
              {project.results.map((res) => (
                <ResultMetricCard key={res.id} item={res} />
              ))}
            </div>
            {project.body.resultsNote ? (
              <p className="case-note rv">{project.body.resultsNote}</p>
            ) : null}
          </section>

          <section id="ket-luan">
            <h2 className="rv">Kết luận</h2>
            <div>
              {project.body.conclusion.map((para, idx) => (
                <p key={idx} className="rv">
                  <RichText segments={para} />
                </p>
              ))}
            </div>

            <div className="case-next">
              {project.body.nextProjects.map((next) => (
                <Link
                  key={next.slug}
                  to={`/du-an/${next.slug}`}
                  className="glass rv"
                >
                  <small>Dự án tiếp theo</small>
                  <b>{next.title}</b>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <footer className="pf-footer">
        <div className="wrap">
          <span>
            © 2026 Lê Thùy Trang · <Link to="/">Về trang portfolio</Link>
          </span>
        </div>
      </footer>

      <ModalDialog
        open={lightbox !== null}
        onClose={() => setLightbox(null)}
        ariaLabel="Xem ảnh lớn"
        variant="lightbox"
      >
        {lightbox ? (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="pf-close-btn"
              style={{ top: "-12px", right: "-12px", background: "#F2EADD", color: "#161412" }}
              aria-label="Đóng"
              autoFocus
              onClick={() => setLightbox(null)}
            >
              ×
            </button>
            <img src={lightbox.src} alt={lightbox.alt} />
            {lightbox.caption ? <p>{lightbox.caption}</p> : null}
          </div>
        ) : null}
      </ModalDialog>
    </div>
  );
};
