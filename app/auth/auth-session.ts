import { createServerFn } from "@tanstack/start";
import { getCookie, setCookie, useSession } from "vinxi/http";
import { lucia } from ".";
import { redirect } from "@tanstack/react-router";

export const getSession = createServerFn("GET", async () => {
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

export const destroySession = createServerFn("POST", async (_, ctx) => {
  const sessionId = getCookie("auth_session");
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }
  return redirect({
    statusCode: 302,
    to: "/",
  });
});
