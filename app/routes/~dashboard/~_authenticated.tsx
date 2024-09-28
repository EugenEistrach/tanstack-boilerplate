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
