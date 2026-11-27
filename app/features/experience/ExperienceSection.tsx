import { useState, type CSSProperties } from "react";
import { ChevronDownIcon, SectionHeader } from "~/components/ui/Primitives";
import { useTooltip } from "~/components/ui/TooltipProvider";
import { SITE_CONTENT } from "~/content/site";
import type { EducationItem, JobItem } from "~/lib/db/types";

type ExperienceSectionProps = {
  jobs: JobItem[];
  education: EducationItem[];
};

const JobCard = ({ job, index }: { job: JobItem; index: number }) => {
  const [open, setOpen] = useState(false);
  const { bindTooltip } = useTooltip();
  const moreId = `job-more-${job.id}`;

  return (
    <article
      className={`job-card rv${open ? " is-open" : ""}`}
      style={{ "--d": `${index * 60}ms` } as CSSProperties}
    >
      <div className="job-when">
        {job.years}
        <small>{job.period}</small>
      </div>
      <div>
        <h3>
          {job.title},{" "}
          <span
            className="job-company-tip"
            {...bindTooltip(job.companyTipTitle, job.companyTipBody)}
          >
            {job.company}
          </span>
        </h3>
        <p className="job-sum">{job.summary}</p>
        <ul className="job-ul">
          {job.highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <div className="job-more" id={moreId}>
          <div>
            <ul>
              {job.details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          className="job-toggle"
          aria-expanded={open}
          aria-controls={moreId}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{open ? "Thu gọn" : "Xem toàn bộ trách nhiệm"}</span>
          <ChevronDownIcon />
        </button>
      </div>
    </article>
  );
};

export const ExperienceSection = ({ jobs, education }: ExperienceSectionProps) => {
  const { bindTooltip } = useTooltip();
  const sec = SITE_CONTENT.sections.experience;

  return (
    <section
      className="band band-white"
      id="kinh-nghiem"
      aria-labelledby="heading-kinh-nghiem"
    >
      <div className="wrap">
        <SectionHeader
          id="heading-kinh-nghiem"
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
        />

        <div className="job-list">
          {jobs.map((job, idx) => (
            <JobCard key={job.id} job={job} index={idx} />
          ))}
        </div>

        <div className="edu-grid">
          {education.map((edu, idx) => (
            <div
              key={edu.id}
              className="edu-card rv"
              style={{ "--d": `${idx * 100}ms` } as CSSProperties}
              {...bindTooltip(edu.tipTitle, edu.tipBody)}
            >
              <b>{edu.school}</b>
              <span>
                {edu.degree}, {edu.years}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
