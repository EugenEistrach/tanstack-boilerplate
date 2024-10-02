import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_authenticated/settings")({
  beforeLoad: () => {
    return {
      breadcrumb: "Settings",
    };
  },
  component: () => <div>Hello /dashboard/_authenticated/settings!</div>,
});
