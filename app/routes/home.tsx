import { Footer, Nav } from "~/components/layout/LayoutChrome";
import { SITE_CONTENT } from "~/content/site";
import { CapabilitiesSection } from "~/features/capabilities/CapabilitiesSection";
import { ContactSection } from "~/features/contact/ContactSection";
import { DesignSection } from "~/features/design/DesignSection";
import { ExperienceSection } from "~/features/experience/ExperienceSection";
import { HeroSection } from "~/features/hero/HeroSection";
import { ProjectsSection } from "~/features/projects/ProjectsSection";
import { WritingSection } from "~/features/writing/WritingSection";
import { getDb } from "~/lib/db/client";
import { getEducation, getJobs } from "~/lib/db/repositories/jobs";
import {
  getPosts,
  getSkillsByGroup,
  getWorksWithImages,
} from "~/lib/db/repositories/portfolio";
import { getFeaturedProjects } from "~/lib/db/repositories/projects";
import { buildMeta } from "~/lib/seo";
import type { Route } from "./+types/home";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const db = getDb(context.cloudflare.env.DB);
  const siteUrl = (
    context.cloudflare.env.SITE_URL || new URL(request.url).origin
  ).replace(/\/+$/, "");

  const [jobs, education, projects, skillGroups, posts, works] =
    await Promise.all([
      getJobs(db),
      getEducation(db),
      getFeaturedProjects(db),
      getSkillsByGroup(db),
      getPosts(db),
      getWorksWithImages(db),
    ]);

  return {
    siteUrl,
    jobs,
    education,
    projects,
    skillGroups,
    posts,
    works,
  };
};

export const headers: Route.HeadersFunction = () => ({
  "Cache-Control": "public, max-age=60, stale-while-revalidate=86400",
});

export const meta: Route.MetaFunction = ({ data }) => {
  const siteUrl = data?.siteUrl ?? "https://trangporfolio.vu-theanh1709.workers.dev";
  return buildMeta({
    title: SITE_CONTENT.siteTitle,
    description: SITE_CONTENT.siteDescription,
    url: `${siteUrl}/`,
    image: `${siteUrl}/media/design/bloomsky/cover.webp`,
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE_CONTENT.ownerName,
      jobTitle: SITE_CONTENT.hero.role,
      email: SITE_CONTENT.sections.contact.email,
      telephone: SITE_CONTENT.sections.contact.phoneDisplay,
      url: `${siteUrl}/`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "TP. Hồ Chí Minh",
        addressCountry: "VN",
      },
      alumniOf: [
        "Học viện Báo chí và Tuyên truyền",
        "Arena Multimedia",
      ],
    },
  });
};

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  const { jobs, education, projects, skillGroups, posts, works } = loaderData;

  return (
    <>
      <Nav />
      <main id="top">
        <HeroSection
          roleChips={skillGroups["role-chip"] ?? []}
          heroSkills={skillGroups["hero"] ?? []}
          heroIndustries={skillGroups["hero-industry"] ?? []}
        />
        <ExperienceSection jobs={jobs} education={education} />
        <ProjectsSection projects={projects} />
        <CapabilitiesSection
          capabilities={skillGroups["capability"] ?? []}
          formats={skillGroups["format"] ?? []}
          tools={skillGroups["tool"] ?? []}
          industries={skillGroups["industry"] ?? []}
        />
        <WritingSection posts={posts} />
        <DesignSection works={works} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
