import { integer } from "drizzle-orm/sqlite-core";

export const dateTableFields = {
  createdAt: integer("created_at", { mode: "timestamp" }).$default(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
};
