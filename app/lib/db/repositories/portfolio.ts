import { asc } from "drizzle-orm";
import type { AppDatabase } from "../client";
import { posts, skills, workImages, works } from "../schema";
import {
  BloomskyMetaSchema,
  type PostItem,
  type SkillItem,
  type WorkItem,
} from "../types";

export const getSkillsByGroup = async (
  db: AppDatabase,
): Promise<Record<string, SkillItem[]>> => {
  const rows = await db.select().from(skills).orderBy(asc(skills.sortOrder));
  const grouped: Record<string, SkillItem[]> = {};
  for (const row of rows) {
    const bucket = grouped[row.group] ?? [];
    bucket.push(row);
    grouped[row.group] = bucket;
  }
  return grouped;
};

export const getPosts = async (db: AppDatabase): Promise<PostItem[]> => {
  return db.select().from(posts).orderBy(asc(posts.sortOrder));
};

export const getWorksWithImages = async (db: AppDatabase): Promise<WorkItem[]> => {
  const [workRows, imageRows] = await Promise.all([
    db.select().from(works).orderBy(asc(works.sortOrder)),
    db.select().from(workImages).orderBy(asc(workImages.sortOrder)),
  ]);

  return workRows.map((w) => ({
    id: w.id,
    slug: w.slug,
    sortOrder: w.sortOrder,
    title: w.title,
    kind: w.kind,
    description: w.description,
    tone: w.tone,
    featured: w.featured,
    bloomskyMeta: w.featured ? BloomskyMetaSchema.parse(JSON.parse(w.metaJson)) : null,
    images: imageRows.filter((img) => img.workId === w.id),
  }));
};
