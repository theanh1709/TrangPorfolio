import { CaseStudyPage } from "~/features/case-study/CaseStudyPage";
import { getDb } from "~/lib/db/client";
import { getProjectBySlug } from "~/lib/db/repositories/projects";
import { buildMeta } from "~/lib/seo";
import type { Route } from "./+types/project.$slug";

export const loader = async ({ params, context, request }: Route.LoaderArgs) => {
  const db = getDb(context.cloudflare.env.DB);
  const project = await getProjectBySlug(db, params.slug);
  if (!project) {
    throw new Response("Không tìm thấy dự án", { status: 404 });
  }

  const siteUrl = (
    context.cloudflare.env.SITE_URL || new URL(request.url).origin
  ).replace(/\/+$/, "");

  return {
    siteUrl,
    project,
  };
};

export const headers: Route.HeadersFunction = () => ({
  "Cache-Control": "public, max-age=60, stale-while-revalidate=86400",
});

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.project) {
    return [{ title: "Không tìm thấy dự án · Lê Thùy Trang" }];
  }
  const { project, siteUrl } = data;
  const pageUrl = `${siteUrl}/du-an/${project.slug}`;
  const ogImage = project.coverKey ? `${siteUrl}/media/${project.coverKey}` : undefined;

  return buildMeta({
    title: `${project.body.breadcrumbTitle} · Lê Thùy Trang`,
    description: project.subtitle,
    url: pageUrl,
    image: ogImage,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.subtitle,
      url: pageUrl,
      author: {
        "@type": "Person",
        name: "Lê Thùy Trang",
      },
      dateCreated: project.year,
    },
  });
};

export default function ProjectDetailRoute({ loaderData }: Route.ComponentProps) {
  return <CaseStudyPage project={loaderData.project} />;
}
