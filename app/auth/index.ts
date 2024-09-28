import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { sessions, users } from "./auth-tables";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env["NODE_ENV"] === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      avatarUrl: attributes.avatarUrl,
      defaultTeamId: attributes.defaultTeamId,
      name: attributes.name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  avatarUrl?: string;
  name?: string;
  defaultTeamId?: string;
}
