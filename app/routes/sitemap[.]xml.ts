import { getDb } from "~/lib/db/client";
import { getAllProjectSlugs } from "~/lib/db/repositories/projects";
import type { Route } from "./+types/sitemap[.]xml";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const siteUrl = (
    context.cloudflare.env.SITE_URL || new URL(request.url).origin
  ).replace(/\/+$/, "");

  const db = getDb(context.cloudflare.env.DB);
  const slugs = await getAllProjectSlugs(db);

  const urls = [
    { loc: `${siteUrl}/`, priority: "1.0" },
    ...slugs.map((slug) => ({
      loc: `${siteUrl}/du-an/${slug}`,
      priority: "0.8",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
