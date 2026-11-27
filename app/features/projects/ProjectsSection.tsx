import { useRef, type CSSProperties } from "react";
import { Link } from "react-router";
import { ArrowRightIcon, SectionHeader, buttonVariants } from "~/components/ui/Primitives";
import { useTooltip } from "~/components/ui/TooltipProvider";
import { SITE_CONTENT } from "~/content/site";
import { useMagnetic, useTilt } from "~/hooks/useMotion";
import type { ProjectSummaryItem } from "~/lib/db/types";

const ProjectCard = ({
  project,
  index,
}: {
  project: ProjectSummaryItem;
  index: number;
}) => {
  const { bindTooltip } = useTooltip();
  const cardRef = useRef<HTMLElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);
  useTilt(cardRef);
  useMagnetic(btnRef);

  return (
    <article
      ref={cardRef}
      className={`case-card glass rv${project.wide ? " is-wide" : ""}`}
      style={{ "--d": `${(index % 2) * 100}ms` } as CSSProperties}
    >
      <div className="case-top">
        <span>
          {project.brand}, {project.year}
        </span>
        <span className="pf-tag">{project.tag}</span>
      </div>
      <h3>{project.cardHeading}</h3>
      <p>{project.cardSummary}</p>
      <div className="case-wins">
        {project.wins.map((win, idx) => (
          <span
            key={idx}
            className="win-pill"
            {...bindTooltip(win.tipTitle, win.tipBody)}
          >
            <b>{win.value}</b> {win.label}
          </span>
        ))}
      </div>
      <Link
        ref={btnRef}
        to={`/du-an/${project.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ intent: "ghost" })}
        style={{ alignSelf: "flex-start" }}
      >
        Xem chi tiết dự án
        <ArrowRightIcon />
      </Link>
    </article>
  );
};

export const ProjectsSection = ({
  projects,
}: {
  projects: ProjectSummaryItem[];
}) => {
  const sec = SITE_CONTENT.sections.projects;

  return (
    <section className="band night" id="du-an" aria-labelledby="heading-du-an">
      <div className="wrap">
        <SectionHeader
          id="heading-du-an"
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
        />

        <div className="cases-grid">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
