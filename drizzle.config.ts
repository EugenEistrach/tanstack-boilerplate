import { defineConfig } from "drizzle-kit";
import { env } from "./app/env";

export default defineConfig({
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  breakpoints: true,
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
