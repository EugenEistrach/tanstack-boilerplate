import { Queue, Worker } from "bullmq";
import { jobConfig } from "../jobs";
import { lucia } from ".";
import { sessionTable } from "./auth-tables";
import { db } from "../db";
import { sql } from "drizzle-orm";

const sessionCleanupQueue = new Queue("session-cleanup", jobConfig);
const sessionCleanupWorker = new Worker(
  "session-cleanup",
  async () => {
    console.log("session-cleanup");
    const currentCount = db
      .select({ count: sql<number>`count(*)` })
      .from(sessionTable)
      .get();
    await lucia.deleteExpiredSessions();
    const newCount = db
      .select({ count: sql<number>`count(*)` })
      .from(sessionTable)
      .get();

    const diff = (currentCount?.count ?? 0) - (newCount?.count ?? 0);

    if (diff > 0) {
      console.log(`${diff} sessions cleaned up`);
    }

    console.log("session-cleanup done");
  },
  jobConfig
);

export async function scheduleSessionCleanup() {
  console.log("scheduleSessionCleanup");
  await sessionCleanupQueue.obliterate();
  await sessionCleanupQueue.add(
    "session-cleanup",
    {},
    {
      repeat: {
        pattern: "*/5 * * * *", // every 5 minutes
      },
    }
  );
}
