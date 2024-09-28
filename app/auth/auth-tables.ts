import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { dateTableFields } from "../db/fields";
import { cuid } from "../lib/utils";

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$default(() => cuid()),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),

  defaultTeamId: text("default_team_id").references(() => teams.id),
  name: text("name"),
  ...dateTableFields,
});

export const teams = sqliteTable("team", {
  id: text("id")
    .primaryKey()
    .$default(() => cuid()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$default(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export const teamMembers = sqliteTable(
  "team_member",
  {
    id: text("id")
      .primaryKey()
      .$default(() => cuid()),
    teamId: text("team_id")
      .references(() => teams.id)
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),

    createdAt: integer("created_at", { mode: "timestamp" }).$default(
      () => new Date()
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$default(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    teamUserUnique: unique().on(table.teamId, table.userId),
  })
);

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  oAuthAccounts: many(ssoProviders),
}));

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),

  ...dateTableFields,
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const ssoProviders = sqliteTable(
  "oauth_account",
  {
    id: text("id")
      .primaryKey()
      .$default(() => cuid()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
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

export const ssoProvidersRelations = relations(ssoProviders, ({ one }) => ({
  user: one(users, {
    fields: [ssoProviders.userId],
    references: [users.id],
  }),
}));
