import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: location.pathname,
        },
      });
    }

    const defaultTeamId = context.user.defaultTeamId;
    const name = context.user.name;

    // if user does not have a default team, redirect to onboarding
    if (!defaultTeamId || !name) {
      throw redirect({
        to: "/onboarding",
        search: { redirectTo: location.pathname },
      });
    }

    return {
      user: {
        ...context.user,
        defaultTeamId,
        name,
      },
    };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div>
      Hello /(dashboard)/_layout!
      <Outlet />
    </div>
  );
}
