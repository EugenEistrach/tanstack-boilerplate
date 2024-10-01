import { env } from "@/app/lib/env";
import { useParams } from "@tanstack/react-router";
import { createAPIFileRoute } from "@tanstack/start/api";
import { generateState, GitHub } from "arctic";
import { useSession } from "vinxi/http";

const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

export const Route = createAPIFileRoute("/api/login/github")({
  GET: async ({ request }) => {
    const state = generateState();

    const session = await useSession({
      password: env.SESSION_SECRET,
    });

    const redirectTo = new URL(request.url).searchParams.get("redirectTo");

    await session.update({
      github_oauth_state: state,
      redirectTo,
    });

    const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
      },
    });
  },
});