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

    const name = context.user.name;

    // if user does not have the "user" role, redirect to onboarding
    if (!context.user.roles.includes("user") || !name) {
      throw redirect({
        to: "/onboarding",
        search: { redirectTo: location.pathname },
      });
    }

    return {
      user: {
        ...context.user,
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
