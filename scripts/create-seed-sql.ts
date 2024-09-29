import { exec } from "node:child_process";
import fs from "node:fs/promises";

const TEMP_DB_PATH = "./scripts/.tmp/seed.local.db";
const SEED_SCRIPT_PATH = "./scripts/prod-seed.local.ts";
const OUTPUT_SQL_PATH = "./scripts/.output/prod-seed.sql";

async function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
}

async function createSeedSQL() {
  try {
    // Set up temporary database
    await fs.mkdir(new URL("./.tmp", import.meta.url), {
      recursive: true,
    });
    process.env["DATABASE_URL"] = `${TEMP_DB_PATH}`;

    // Run migrations (adjust this command based on your Drizzle setup)
    await runCommand("pnpm db:migrate");

    // Run the seed script
    await runCommand(`npx tsx ${SEED_SCRIPT_PATH}`);

    // Dump the database to SQL
    const sqlDump = await runCommand(`sqlite3 ${TEMP_DB_PATH} .dump`);

    // Filter out everything except INSERT statements
    const insertStatements = sqlDump
      .split("\n")
      .filter((line) => line.startsWith("INSERT INTO"))
      .join("\n--> statement-breakpoint\n");

    // Write INSERT statements to the output file
    await fs.mkdir(new URL("./.output", import.meta.url), {
      recursive: true,
    });
    await fs.writeFile(OUTPUT_SQL_PATH, insertStatements);

    console.log(`Seed SQL created at ${OUTPUT_SQL_PATH}`);
  } catch (error) {
    console.error("Error creating seed SQL:", error);
  } finally {
    // Clean up temporary database
    await fs
      .rm("./scripts/.tmp", { force: true, recursive: true })
      .catch(() => {});
  }
}

createSeedSQL();
