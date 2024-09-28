import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { dateTableFields } from "../db/fields";
import { cuid } from "../lib/utils";

export const userTable = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$default(() => cuid()),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),

  ...dateTableFields,
});

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  oAuthAccounts: many(oAuthAccountTable),
}));

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),

  ...dateTableFields,
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const oAuthAccountTable = sqliteTable(
  "oauth_account",
  {
    id: text("id")
      .primaryKey()
      .$default(() => cuid()),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    provider: text("provider", { enum: ["github", "discord"] }).notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    ...dateTableFields,
  },
  (table) => ({
    providerAccountIdIdx: index("provider_account_id_idx").on(
      table.provider,
      table.providerAccountId
    ),
  })
);

export const oAuthAccountRelations = relations(
  oAuthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [oAuthAccountTable.userId],
      references: [userTable.id],
    }),
  })
);
