import { asc } from "drizzle-orm";
import type { AppDatabase } from "../client";
import { education, jobs } from "../schema";
import { StringArraySchema, type EducationItem, type JobItem } from "../types";

export const getJobs = async (db: AppDatabase): Promise<JobItem[]> => {
  const rows = await db.select().from(jobs).orderBy(asc(jobs.sortOrder));
  return rows.map((row) => ({
    id: row.id,
    sortOrder: row.sortOrder,
    years: row.years,
    period: row.period,
    title: row.title,
    company: row.company,
    companyTipTitle: row.companyTipTitle,
    companyTipBody: row.companyTipBody,
    summary: row.summary,
    highlights: StringArraySchema.parse(JSON.parse(row.highlightsJson)),
    details: StringArraySchema.parse(JSON.parse(row.detailsJson)),
  }));
};

export const getEducation = async (db: AppDatabase): Promise<EducationItem[]> => {
  const rows = await db.select().from(education).orderBy(asc(education.sortOrder));
  return rows;
};
