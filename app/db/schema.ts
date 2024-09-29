export * from "@/app/auth/auth-tables";

import { text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { dateTableFields } from "./fields";
import { cuid } from "../lib/utils";
import { userTable } from "@/app/auth/auth-tables";

export const note = sqliteTable("note", {
  id: text("id")
    .primaryKey()
    .$default(() => cuid()),
  content: text("content").notNull(),
  ownerId: text("owner_id")
    .references(() => userTable.id)
    .notNull(),
  ...dateTableFields,
});
