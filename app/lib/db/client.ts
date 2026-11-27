import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export type AppDatabase = DrizzleD1Database<typeof schema>;

export const getDb = (dbBinding: D1Database): AppDatabase =>
  drizzle(dbBinding, { schema });
