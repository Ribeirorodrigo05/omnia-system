import { drizzle } from "drizzle-orm/neon-http";

export const schema = {};

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  casing: "snake_case",
});
