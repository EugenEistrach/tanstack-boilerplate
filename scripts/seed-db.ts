import "dotenv/config";

import { db } from "@/app/db";
import { note } from "@/app/db/schema";

console.log("Seeding database...");

// Seeding example note
db.insert(note)
  .values({
    content: "Hello, world!",
  })
  .run();

console.log("Database seeded successfully.");
