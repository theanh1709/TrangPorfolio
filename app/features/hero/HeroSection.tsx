import { useRef, type CSSProperties } from "react";
import { ArrowRightIcon, buttonVariants } from "~/components/ui/Primitives";
import { useTooltip } from "~/components/ui/TooltipProvider";
import { SITE_CONTENT } from "~/content/site";
import { useMagnetic } from "~/hooks/useMotion";
import type { SkillItem } from "~/lib/db/types";
import { mediaUrl } from "~/lib/media";

type HeroSectionProps = {
  roleChips: SkillItem[];
  heroSkills: SkillItem[];
  heroIndustries: SkillItem[];
};

const HeroName = ({ fullName }: { fullName: string }) => {
  const words = fullName.split(" ");
  let charCounter = 0;

  return (
    <h1 className="hero-name" aria-label={fullName}>
      {words.map((word, wordIdx) => {
        const isStroked = wordIdx < words.length - 1;
        return (
          <span key={wordIdx}>
            {wordIdx > 0 ? " " : null}
            <span
              className={`hero-word${isStroked ? " hero-word-stroke" : ""}`}
              aria-hidden="true"
            >
              {Array.from(word).map((ch, chIdx) => {
                const idx = charCounter++;
                return (
                  <span
                    key={chIdx}
                    className="hero-char"
                    style={{ "--i": idx } as CSSProperties}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          </span>
        );
      })}
    </h1>
  );
};

export const HeroSection = ({
  roleChips,
  heroSkills,
  heroIndustries,
}: HeroSectionProps) => {
  const { bindTooltip } = useTooltip();
  const primaryRef = useRef<HTMLAnchorElement | null>(null);
  const secondaryRef = useRef<HTMLAnchorElement | null>(null);
  useMagnetic(primaryRef);
  useMagnetic(secondaryRef);

  return (
    <section className="pf-hero" aria-label="Giới thiệu">
      <div className="wrap">
        <HeroName fullName={SITE_CONTENT.ownerName} />

        <div className="hero-stage">
          <div className="hero-left">
            <p className="hero-role rv" style={{ "--d": "200ms" } as CSSProperties}>
              {SITE_CONTENT.hero.role}
            </p>
            <p className="hero-lead rv" style={{ "--d": "280ms" } as CSSProperties}>
              {SITE_CONTENT.hero.lead}
            </p>
            <div className="hero-cta rv" style={{ "--d": "360ms" } as CSSProperties}>
              <a
                ref={primaryRef}
                className={buttonVariants({ intent: "dark" })}
                href="#kinh-nghiem"
              >
                {SITE_CONTENT.hero.primaryCta}
                <ArrowRightIcon />
              </a>
              <a
                ref={secondaryRef}
                className={buttonVariants({ intent: "ghost" })}
                href="#lien-he"
              >
                {SITE_CONTENT.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="hero-photo-col">
            <div className="hero-frame">
              <img
                className="hero-portrait-img"
                src={mediaUrl(SITE_CONTENT.hero.portraitKey)}
                alt={SITE_CONTENT.hero.portraitAlt}
                width={590}
                height={601}
                fetchPriority="high"
                decoding="async"
              />
            </div>

            <div className="hero-roles" aria-label="Các chặng nghề nghiệp">
              {roleChips.map((chip) => (
                <div
                  key={chip.id}
                  className="role-chip glass"
                  {...bindTooltip(chip.tipTitle, chip.tipBody)}
                >
                  <div>
                    <b>{chip.name}</b>
                    <span>{chip.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right rv" style={{ "--d": "420ms" } as CSSProperties}>
            <div className="hl-group">
              <small>Kỹ năng</small>
              <ul>
                {heroSkills.map((sk) => (
                  <li key={sk.id}>
                    <span
                      className="sk-pill"
                      {...bindTooltip(sk.tipTitle, sk.tipBody)}
                    >
                      {sk.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hl-group is-ind">
              <small
                style={{ cursor: "help" }}
                {...bindTooltip(
                  "4 ngành",
                  "BFSI: Woori Bank, Phú Hưng Life. F&B: Cơm Niêu Thiên Lý. Education: International Schools of North America. Agency: Byte Media.",
                )}
              >
                4 ngành
              </small>
              <ul>
                {heroIndustries.map((ind) => (
                  <li key={ind.id}>
                    <span
                      className="sk-pill"
                      {...bindTooltip(ind.tipTitle, ind.tipBody)}
                    >
                      {ind.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
