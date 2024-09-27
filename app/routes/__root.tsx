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
});

function RootComponent() {
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
        <div className="font-sans">{children}</div>
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </Body>
    </Html>
  );
}
