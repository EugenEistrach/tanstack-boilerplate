import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import type * as React from "react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// @ts-ignore
import appCss from "@/app/styles/globals.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { getAuthSession } from "@/app/auth/auth-session";
import { ThemeProvider } from "next-themes";
import {
  getLocaleFromSession,
  getMessages,
  getTimeZoneFromSession,
} from "../lib/i18n";
import { IntlProvider } from "use-intl";

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
      href: "https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap",
      as: "style",
    },
    {
      rel: "stylesheet",
      href: "https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1,2&display=swap",
    },
  ],
  component: RootComponent,
  beforeLoad: async () => {
    const { session, user } = await getAuthSession();
    const [locale, timeZone] = await Promise.all([
      getLocaleFromSession(),
      getTimeZoneFromSession(),
    ]);

    const messages = await getMessages(locale);

    return { session, user, locale, timeZone, messages };
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
  const { locale, messages, timeZone } = Route.useRouteContext();
  return (
    // TODO: Add lang attribute once supported by tanstack start
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <IntlProvider locale={locale} messages={messages}>
            <div className="font-sans">{children}</div>
          </IntlProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </Body>
    </Html>
  );
}
