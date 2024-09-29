import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { dateTableFields } from "../db/fields";
import { cuid } from "../lib/utils";
import { accesses, actions, resources, roles } from "./auth-permissions";

export const userTable = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$default(() => cuid()),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),

  name: text("name"),
  ...dateTableFields,
});

export const usersRelations = relations(userTable, ({ many, one }) => ({
  sessions: many(sessionTable),
  oAuthAccounts: many(ssoProviderTable),
  usersToRoles: many(userToRoleTable),
}));

export const roleTable = sqliteTable("role", {
  id: text("id")
    .primaryKey()
    .$default(() => cuid()),
  name: text("name", { enum: roles }).notNull().unique(),
  description: text("description"),
  ...dateTableFields,
});

export const rolesRelations = relations(roleTable, ({ many }) => ({
  usersToRoles: many(userToRoleTable),
  rolesToPermissions: many(roleToPermissionTable),
}));

export const permissionTable = sqliteTable(
  "permission",
  {
    id: text("id")
      .primaryKey()
      .$default(() => cuid()),
    action: text("action", {
      enum: actions,
    }).notNull(),
    resource: text("resource", { enum: resources }).notNull(),
    access: text("access", { enum: accesses }).notNull(),

    description: text("description"),
    ...dateTableFields,
  },
  (table) => ({
    actionResourceAccessIdx: unique("action_resource_access_unique").on(
      table.action,
      table.resource,
      table.access
    ),
  })
);

export const permissionsRelations = relations(permissionTable, ({ many }) => ({
  rolesToPermissions: many(roleToPermissionTable),
}));

export const userToRoleTable = sqliteTable(
  "user_to_role",
  {
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
    roleId: text("role_id")
      .notNull()
      .references(() => roleTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  })
);

export const usersToRolesRelations = relations(userToRoleTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userToRoleTable.userId],
    references: [userTable.id],
  }),
  role: one(roleTable, {
    fields: [userToRoleTable.roleId],
    references: [roleTable.id],
  }),
}));

export const roleToPermissionTable = sqliteTable(
  "role_to_permission",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roleTable.id),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissionTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  })
);

export const rolesToPermissionsRelations = relations(
  roleToPermissionTable,
  ({ one }) => ({
    role: one(roleTable, {
      fields: [roleToPermissionTable.roleId],
      references: [roleTable.id],
    }),
    permission: one(permissionTable, {
      fields: [roleToPermissionTable.permissionId],
      references: [permissionTable.id],
    }),
  })
);

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),

  ...dateTableFields,
});

export const sessionsRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const ssoProviderTable = sqliteTable(
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

export const ssoProvidersRelations = relations(ssoProviderTable, ({ one }) => ({
  user: one(userTable, {
    fields: [ssoProviderTable.userId],
    references: [userTable.id],
  }),
}));
