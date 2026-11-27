import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("du-an/:slug", "routes/project.$slug.tsx"),
  route("media/*", "routes/media.$.ts"),
  route("sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("robots.txt", "routes/robots[.]txt.ts"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
