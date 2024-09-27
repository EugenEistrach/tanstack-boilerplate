import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";
import { getRouterManifest } from "@tanstack/start/router-manifest";
import { createRouter } from "./router";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./db";

// migrate db
migrate(db, {
  migrationsFolder: "./drizzle",
});

console.log("DB migrated");

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
