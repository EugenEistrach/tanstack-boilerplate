import { createServerFn } from "@tanstack/start";
import { getCookie, setCookie, useSession } from "vinxi/http";
import { lucia } from ".";
import { redirect } from "@tanstack/react-router";

export const getAuthSession = createServerFn("GET", async () => {
  const sessionId = getCookie("auth_session");

  if (!sessionId) {
    return { session: null, user: null };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session?.fresh) {
    const newCookie = lucia.createSessionCookie(session.id);
    setCookie(newCookie.name, newCookie.value, newCookie.attributes);
  }

  return { session, user };
});

export const requireInitialAuthSession = createServerFn("GET", async () => {
  const { user, session } = await getAuthSession();
  if (!user || !session) throw redirect({ to: "/login" });
  return { user, session };
});

export const requireAuthSession = createServerFn("GET", async () => {
  const { user, session } = await getAuthSession();
  if (!user || !session) throw redirect({ to: "/login" });
  if (!user.defaultTeamId || !user.name) throw redirect({ to: "/onboarding" });
  return { user, session };
});

export const destroyAuthSession = createServerFn("POST", async (_, ctx) => {
  const sessionId = getCookie("auth_session");
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }
  return redirect({
    statusCode: 302,
    to: "/",
  });
});
