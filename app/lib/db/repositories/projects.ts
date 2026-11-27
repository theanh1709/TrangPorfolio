import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import type { AppDatabase } from "../client";
import { projectResults, projects } from "../schema";
import {
  ProjectBodySchema,
  ProjectWinSchema,
  StringArraySchema,
  TocItemSchema,
  type ProjectDetailItem,
  type ProjectSummaryItem,
} from "../types";

const WinsArraySchema = z.array(ProjectWinSchema);
const TocArraySchema = z.array(TocItemSchema);

export const getFeaturedProjects = async (
  db: AppDatabase,
): Promise<ProjectSummaryItem[]> => {
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  return rows
    .filter((row) => row.sortOrder <= 10)
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      sortOrder: row.sortOrder,
      brand: row.brand,
      year: row.year,
      tag: row.tag,
      cardHeading: row.cardHeading,
      cardSummary: row.cardSummary,
      wide: row.wide,
      wins: WinsArraySchema.parse(JSON.parse(row.winsJson)),
    }));
};

export const getAllProjectSlugs = async (db: AppDatabase): Promise<string[]> => {
  const rows = await db
    .select({ slug: projects.slug })
    .from(projects)
    .orderBy(asc(projects.sortOrder));
  return rows.map((r) => r.slug);
};

export const getProjectBySlug = async (
  db: AppDatabase,
  slug: string,
): Promise<ProjectDetailItem | null> => {
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!row) return null;

  const resultRows = await db
    .select()
    .from(projectResults)
    .where(eq(projectResults.projectId, row.id))
    .orderBy(asc(projectResults.sortOrder));

  return {
    id: row.id,
    slug: row.slug,
    sortOrder: row.sortOrder,
    brand: row.brand,
    year: row.year,
    tag: row.tag,
    cardHeading: row.cardHeading,
    cardSummary: row.cardSummary,
    title: row.title,
    subtitle: row.subtitle,
    accent: row.accent,
    accentBg: row.accentBg,
    coverKey: row.coverKey,
    wide: row.wide,
    layout: row.layout,
    chips: StringArraySchema.parse(JSON.parse(row.chipsJson)),
    wins: WinsArraySchema.parse(JSON.parse(row.winsJson)),
    toc: TocArraySchema.parse(JSON.parse(row.tocJson)),
    body: ProjectBodySchema.parse(JSON.parse(row.bodyJson)),
    results: resultRows,
  };
};
