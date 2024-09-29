import { lucia } from "@/app/auth";
import { db } from "@/app/db";
import { ssoProviderTable, userTable } from "@/app/db/schema";
import { env } from "@/app/lib/env";
import { createAPIFileRoute } from "@tanstack/start/api";
import { generateState, GitHub, OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { setCookie, useSession } from "vinxi/http";

import { z } from "zod";

const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

export const Route = createAPIFileRoute("/api/auth/callback/github")({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const session = await useSession({
      password: env.SESSION_SECRET,
    });

    if (!("github_oauth_state" in session.data)) {
      return new Response("Invalid state", { status: 400 });
    }

    let redirectTo = "/";
    if (
      "redirectTo" in session.data &&
      typeof session.data["redirectTo"] === "string"
    ) {
      redirectTo = session.data["redirectTo"];
    }

    const storedState = session.data["github_oauth_state"];

    if (!code || !state || !storedState || state !== storedState) {
      return new Response("Invalid state", { status: 400 });
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const { id, avatar_url } = z
        .object({
          id: z.number(),
          avatar_url: z.string().optional(),
        })
        .parse(await userResponse.json());

      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (!emailResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const emails = z
        .array(
          z.object({
            email: z.string().email(),
            primary: z.boolean(),
            verified: z.boolean(),
          })
        )
        .parse(await emailResponse.json());

      const primary = emails.find((email) => email.primary);

      if (!primary) {
        throw new Error("Failed to fetch user data");
      }

      if (!primary.verified) {
        throw new Error("Email not verified");
      }

      const existingProvider = await db.query.ssoProviderTable.findFirst({
        where: and(
          eq(ssoProviderTable.provider, "github"),
          eq(ssoProviderTable.providerAccountId, id.toString())
        ),
      });

      if (existingProvider) {
        const luciaSession = await lucia.createSession(
          existingProvider.userId,
          {}
        );
        const sessionCookie = lucia.createSessionCookie(luciaSession.id);

        setCookie(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );

        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectTo,
          },
        });
      }

      const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.email, primary.email),
      });

      if (existingUser) {
        const luciaSession = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(luciaSession.id);

        setCookie(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );

        db.insert(ssoProviderTable)
          .values({
            userId: existingUser.id,
            provider: "github",
            providerAccountId: id.toString(),
          })
          .run();

        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectTo,
          },
        });
      }

      const newUser = await db.transaction(async (tx) => {
        const newUser = tx
          .insert(userTable)
          .values({
            email: primary.email,
            avatarUrl: avatar_url ?? null,
          })
          .returning()
          .get();

        tx.insert(ssoProviderTable)
          .values({
            userId: newUser.id,
            provider: "github",
            providerAccountId: id.toString(),
          })
          .run();

        return newUser;
      });

      const luciaSession = await lucia.createSession(newUser.id, {});
      const sessionCookie = lucia.createSessionCookie(luciaSession.id);

      setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectTo,
        },
      });
    } catch (error) {
      console.log(error);
      // the specific error message depends on the provider
      if (error instanceof OAuth2RequestError) {
        // invalid code
        return new Response(null, {
          status: 400,
        });
      }
      return new Response(null, {
        status: 500,
      });
    }
  },
});
