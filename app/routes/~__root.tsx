import {
  createRootRoute,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import type * as React from "react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// @ts-ignore
import appCss from "@/app/styles/globals.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { getSession } from "@/app/auth/auth-session";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "../components/ui/theme-toggle";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "Tanstack - Boilerplate",
    },
  ],
  links: () => [
    { rel: "stylesheet", href: appCss },
    {
      rel: "preload",
      href: "https://api.fontshare.com/v2/css?f[]=clash-display@1&display=swap",
      as: "style",
    },
    {
      rel: "stylesheet",
      href: "https://api.fontshare.com/v2/css?f[]=clash-display@1&display=swap",
    },
  ],
  component: RootComponent,
  beforeLoad: async () => {
    const { session, user } = await getSession();
    return { session, user };
  },
});

function RootComponent() {
  const { user } = Route.useRouteContext();
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeToggle />
          <div className="font-sans">{children}</div>
        </ThemeProvider>
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </Body>
    </Html>
  );
}
