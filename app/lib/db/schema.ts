import { blob, integer, primaryKey, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
  id: text("id").primaryKey(),
  sortOrder: integer("sort_order").notNull().default(0),
  years: text("years").notNull(),
  period: text("period").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  companyTipTitle: text("company_tip_title").notNull(),
  companyTipBody: text("company_tip_body").notNull(),
  summary: text("summary").notNull(),
  highlightsJson: text("highlights_json").notNull(),
  detailsJson: text("details_json").notNull(),
});

export const education = sqliteTable("education", {
  id: text("id").primaryKey(),
  sortOrder: integer("sort_order").notNull().default(0),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  years: text("years").notNull(),
  tipTitle: text("tip_title").notNull(),
  tipBody: text("tip_body").notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  brand: text("brand").notNull(),
  year: text("year").notNull(),
  tag: text("tag").notNull(),
  cardHeading: text("card_heading").notNull(),
  cardSummary: text("card_summary").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  accent: text("accent").notNull(),
  accentBg: text("accent_bg").notNull(),
  coverKey: text("cover_key").notNull(),
  wide: integer("wide", { mode: "boolean" }).notNull().default(false),
  layout: text("layout").notNull().default("case-study"),
  chipsJson: text("chips_json").notNull(),
  winsJson: text("wins_json").notNull(),
  tocJson: text("toc_json").notNull(),
  bodyJson: text("body_json").notNull(),
});

export const projectResults = sqliteTable("project_results", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  value: real("value").notNull(),
  prefix: text("prefix").notNull().default(""),
  suffix: text("suffix").notNull().default(""),
  decimals: integer("decimals").notNull().default(0),
  displayText: text("display_text").notNull(),
  label: text("label").notNull(),
  tipTitle: text("tip_title").notNull(),
  tipBody: text("tip_body").notNull(),
});

export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  group: text("group").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  tipTitle: text("tip_title").notNull(),
  tipBody: text("tip_body").notNull(),
  icon: text("icon").notNull().default(""),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  sortOrder: integer("sort_order").notNull().default(0),
  title: text("title").notNull(),
  category: text("category").notNull(),
  publishedAt: text("published_at").notNull(),
  url: text("url").notNull(),
});

export const works = sqliteTable("works", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  title: text("title").notNull(),
  kind: text("kind").notNull(),
  description: text("description").notNull(),
  tone: text("tone").notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  metaJson: text("meta_json").notNull().default("{}"),
});

export const workImages = sqliteTable("work_images", {
  id: text("id").primaryKey(),
  workId: text("work_id")
    .notNull()
    .references(() => works.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  chapter: text("chapter").notNull().default(""),
  caption: text("caption").notNull(),
  note: text("note").notNull().default(""),
  mediaKey: text("media_key").notNull(),
  width: integer("width").notNull().default(1600),
  height: integer("height").notNull().default(900),
});

export const mediaObjects = sqliteTable("media_objects", {
  key: text("key").primaryKey(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  etag: text("etag").notNull(),
});

export const mediaChunks = sqliteTable(
  "media_chunks",
  {
    key: text("key")
      .notNull()
      .references(() => mediaObjects.key, { onDelete: "cascade" }),
    chunkIndex: integer("chunk_index").notNull(),
    data: blob("data", { mode: "buffer" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.key, table.chunkIndex] })],
);
