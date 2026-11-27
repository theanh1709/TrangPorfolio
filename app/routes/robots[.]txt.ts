import type { Route } from "./+types/robots[.]txt";

export const loader = ({ context, request }: Route.LoaderArgs) => {
  const siteUrl = (
    context.cloudflare.env.SITE_URL || new URL(request.url).origin
  ).replace(/\/+$/, "");

  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
