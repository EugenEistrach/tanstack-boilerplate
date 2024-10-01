import fs from "node:fs/promises";
import path from "node:path";
import { getSession, useSession } from "vinxi/http";
import { env } from "./env";

export const supportedLocales = ["en", "de"] as const;
export const defaultLocale = "en";
export const defaultTimeZone = "Europe/Berlin";

const messagePath = "./app/i18n";

import { createServerFn, useServerFn } from "@tanstack/start";
import { createTranslator } from "use-intl";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

export const getLocaleFromSession = createServerFn("GET", async () => {
  const session = await getSession({
    password: env.SESSION_SECRET,
  });

  const locale = session.data["locale"];

  if (locale && supportedLocales.includes(locale)) {
    return locale as (typeof supportedLocales)[number];
  }

  await setLocaleInSession(defaultLocale);

  return defaultLocale;
});

export const setLocaleInSession = createServerFn(
  "POST",
  async (locale: (typeof supportedLocales)[number]) => {
    const session = await useSession({
      password: env.SESSION_SECRET,
    });

    await session.update({
      locale,
    });
  }
);

export const getTimeZoneFromSession = createServerFn("GET", async () => {
  const session = await getSession({
    password: env.SESSION_SECRET,
  });

  const timeZone = session.data["timeZone"];

  if (timeZone) {
    return timeZone as string;
  }

  await setTimeZoneInSession(defaultTimeZone);

  return defaultTimeZone;
});

export const setTimeZoneInSession = createServerFn(
  "POST",
  async (timeZone: string) => {
    const session = await useSession({
      password: env.SESSION_SECRET,
    });

    await session.update({
      timeZone,
    });
  }
);

export const getTranslations = async () => {
  const [locale, timeZone] = await Promise.all([
    getLocaleFromSession(),
    getTimeZoneFromSession(),
  ]);

  const messages = await getMessages(locale);

  const t = createTranslator({
    locale,
    timeZone,
    messages,
  });

  return t;
};

// TODO: research if we can cache this for a request
export const getMessages = createServerFn("GET", async (locale: string) => {
  const messagesPath = path.join(
    process.cwd(),
    `${messagePath}/${locale}.json`
  );
  const content = await fs.readFile(messagesPath, "utf-8");
  return JSON.parse(content);
});

export const useCurrentLocale = () => {
  const context = useRouteContext({ from: "__root__" });
  return context.locale;
};

export const useCurrentTimeZone = () => {
  const context = useRouteContext({ from: "__root__" });
  return context.timeZone;
};

export const useChangeLocaleMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: useServerFn(setLocaleInSession),
    onSuccess: () => {
      // TODO: We can use router.invalidate() to reload the page, but this will not work for all cases.
      // For example, if there is a form schema and we show error and then change language the error stays in old language.
      // Maybe we enforce full page reload as workaround for now? I will think about a better solution later.
      window.location.reload();
    },
  });
};

export type Translator = Awaited<ReturnType<typeof getTranslations>>;
