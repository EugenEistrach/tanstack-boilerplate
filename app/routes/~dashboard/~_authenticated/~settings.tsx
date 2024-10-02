import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_authenticated/settings")({
  component: () => <div>Hello /dashboard/_authenticated/settings!</div>,
});
