import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_authenticated/")({
  component: () => <div>Hello /dashboard/_authenticated/!</div>,
});
