import type { CSSProperties, ReactNode } from "react";
import { SectionHeader } from "~/components/ui/Primitives";
import { useTooltip } from "~/components/ui/TooltipProvider";
import { SITE_CONTENT } from "~/content/site";
import type { SkillItem } from "~/lib/db/types";

const CAPABILITY_ICONS: Record<string, ReactNode> = {
  brand: (
    <>
      <path d="M4 20V6l8-3 8 3v14" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  pr: (
    <>
      <path d="M4 6h12v12H6a2 2 0 0 1-2-2z" />
      <path d="M16 9h4v8a2 2 0 0 1-4 0" />
      <path d="M7 9h6M7 12h6M7 15h4" />
    </>
  ),
  exec: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
    </>
  ),
  crisis: (
    <>
      <path d="M12 3l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  content: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5" />
    </>
  ),
  lang: (
    <>
      <path d="M4 5h9M8.5 3v2M6 5c.5 3 2.5 5.5 5 7M11 5c-.6 3.4-3 6.5-7 8" />
      <path d="M13 21l4-9 4 9M14.5 18h5" />
    </>
  ),
  visual: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-8 8" />
    </>
  ),
  kol: (
    <path d="M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.8z" />
  ),
};

type CapabilitiesSectionProps = {
  capabilities: SkillItem[];
  formats: SkillItem[];
  tools: SkillItem[];
  industries: SkillItem[];
};

export const CapabilitiesSection = ({
  capabilities,
  formats,
  tools,
  industries,
}: CapabilitiesSectionProps) => {
  const { bindTooltip } = useTooltip();
  const sec = SITE_CONTENT.sections.capabilities;

  const pillGroups: Array<{ title: string; items: SkillItem[] }> = [
    { title: "Định dạng nội dung", items: formats },
    { title: "Công cụ", items: tools },
    { title: "Ngành đã làm", items: industries },
  ];

  return (
    <section
      className="band band-beige"
      id="nang-luc"
      aria-labelledby="heading-nang-luc"
    >
      <div className="wrap">
        <SectionHeader
          id="heading-nang-luc"
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
        />

        <div className="skills-grid">
          {capabilities.map((cap, idx) => (
            <div
              key={cap.id}
              className="skill-card glass rv"
              style={{ "--d": `${(idx % 4) * 70}ms` } as CSSProperties}
              {...bindTooltip(cap.tipTitle, cap.tipBody)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {CAPABILITY_ICONS[cap.icon] ?? CAPABILITY_ICONS.brand}
              </svg>
              <h3>{cap.name}</h3>
              <p>{cap.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="pill-rows">
          {pillGroups.map((group, gIdx) => (
            <div
              key={group.title}
              className="pill-row-card glass rv"
              style={{ "--d": `${gIdx * 100}ms` } as CSSProperties}
            >
              <h3>{group.title}</h3>
              <div className="soft-pills">
                {group.items.map((item) => (
                  <span
                    key={item.id}
                    className="soft-pill"
                    {...bindTooltip(item.tipTitle, item.tipBody)}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
