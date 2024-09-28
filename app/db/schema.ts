export * from "@/app/auth/auth-tables";

import { text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { dateTableFields } from "./fields";
import { cuid } from "../lib/utils";

export const note = sqliteTable("note", {
  id: text("id")
    .primaryKey()
    .$default(() => cuid()),
  content: text("content").notNull(),
  ...dateTableFields,
});
