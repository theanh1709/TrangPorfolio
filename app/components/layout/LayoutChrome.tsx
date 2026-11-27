import { useEffect, useRef, useState } from "react";
import { SITE_CONTENT } from "~/content/site";
import { useMagnetic } from "~/hooks/useMotion";

export const Aura = () => (
  <div className="aura" aria-hidden="true">
    <i />
    <i />
    <i />
  </div>
);

export const Nav = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const linksContainerRef = useRef<HTMLDivElement | null>(null);
  const contactBtnRef = useRef<HTMLAnchorElement | null>(null);
  useMagnetic(contactBtnRef);

  useEffect(() => {
    let lastY = window.scrollY;

    const updateNav = () => {
      const y = window.scrollY;
      let current: string | null = null;

      for (const item of SITE_CONTENT.navLinks) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.45 && rect.bottom > window.innerHeight * 0.3) {
          current = item.id;
        }
      }
      setActiveId(current);

      const nightBands = Array.from(document.querySelectorAll<HTMLElement>(".night"));
      const onNight = nightBands.some((band) => {
        const rect = band.getBoundingClientRect();
        return rect.top < 44 && rect.bottom > 44;
      });
      setIsDark(onNight);

      const modalOpen = Boolean(document.querySelector("dialog[open]"));
      setIsHidden(y > lastY && y > 400 && !modalOpen);
      lastY = y;
    };

    window.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    updateNav();

    return () => {
      window.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, []);

  useEffect(() => {
    const container = linksContainerRef.current;
    if (!container || !activeId) {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const activeLink = container.querySelector<HTMLAnchorElement>(`a[data-sec="${activeId}"]`);
    if (!activeLink) {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    setPillStyle({
      left: activeLink.offsetLeft,
      width: activeLink.offsetWidth,
      opacity: 1,
    });
  }, [activeId]);

  return (
    <nav
      className={`pf-nav glass${isDark ? " is-dark" : ""}${isHidden ? " is-hidden" : ""}`}
      aria-label="Điều hướng chính"
    >
      <a className="nav-status" href="#top">
        <span className="status-dot" aria-hidden="true" />
        {SITE_CONTENT.statusBadge}
      </a>
      <div className="nav-links" ref={linksContainerRef}>
        <span
          className="nav-pill"
          aria-hidden="true"
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
            opacity: pillStyle.opacity,
          }}
        />
        {SITE_CONTENT.navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            data-sec={link.id}
            className={activeId === link.id ? "is-active" : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
      <a
        ref={contactBtnRef}
        className="pf-btn pf-btn-dark"
        href="#lien-he"
        style={{ minHeight: "44px", padding: "0 18px", fontSize: "14px" }}
      >
        Liên hệ
      </a>
    </nav>
  );
};

export const Footer = () => (
  <footer className="pf-footer band-beige">
    <div className="wrap">
      <span>{SITE_CONTENT.footer.copyright}</span>
      <a href="#top">{SITE_CONTENT.footer.backToTop}</a>
    </div>
  </footer>
);
