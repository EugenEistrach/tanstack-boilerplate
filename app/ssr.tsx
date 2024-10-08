/// <reference types="vinxi/types/server" />
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";
import { getRouterManifest } from "@tanstack/start/router-manifest";
import { createRouter } from "./router";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./db";
import { scheduleSessionCleanup } from "./auth/auth-jobs";

// migrate db
migrate(db, {
  migrationsFolder: "./drizzle",
});

console.log("DB migrated");

console.log("Schedule jobs");
scheduleSessionCleanup()
  .then(() => {
    console.log("Jobs scheduled");
  })
  .catch((error) => {
    console.error("Error scheduling jobs", error);
  });

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
