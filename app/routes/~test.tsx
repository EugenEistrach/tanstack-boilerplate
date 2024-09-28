import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  beforeLoad: async ({ context }) => {},

  component: () => <div>Hello /test!</div>,
});
