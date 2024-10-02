import { redirect, useRouteContext, useRouter } from "@tanstack/react-router";

export function useOptionalAuth() {
  const { user, session } = useRouteContext({
    from: "__root__",
  });

  return { user, session };
}

export function useAuth() {
  const router = useRouter();
  const { user, session } = useRouteContext({
    from: "/dashboard/_authenticated",
  });

  if (!user && !session) {
    throw redirect({
      to: "/login",
      search: {
        redirectTo: router.state.location.pathname,
      },
    });
  }

  return { user, session };
}
