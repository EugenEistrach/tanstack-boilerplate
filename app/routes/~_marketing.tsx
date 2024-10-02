import { useOptionalAuth } from "@/app/auth/auth-hooks";
import { Button } from "@/app/components/ui/button";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  CheckIcon,
  BoxIcon,
  InfoCircledIcon,
  CubeIcon,
} from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { useTranslations } from "use-intl";
import { LocaleSwitcher } from "../components/ui/locale-switcher";

export const Route = createFileRoute("/_marketing")({
  component: () => {
    const { user } = useOptionalAuth();
    const t = useTranslations();

    return (
      <div className="flex flex-col min-h-screen">
        <Alert className="rounded-none bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
          <InfoCircledIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-200">
            {t("marketing.alert.title")}
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            {t("marketing.alert.description")}
          </AlertDescription>
        </Alert>
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" to="/">
            <span className="sr-only">{t("marketing.hero.title")}</span>
            <CubeIcon className="h-6 w-6" />
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <a
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#features"
            >
              {t("marketing.nav.features")}
            </a>
            <a
              className="text-sm font-medium hover:underline underline-offset-4"
              href="#pricing"
            >
              {t("marketing.nav.pricing")}
            </a>
            <ThemeToggle />
            <Button asChild>
              <Link to={user ? "/dashboard" : "/login"}>
                {user
                  ? t("marketing.nav.goToApp")
                  : t("marketing.nav.getStarted")}
              </Link>
            </Button>
          </nav>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">
            {t("marketing.footer.copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center mr-4 sm:mr-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              to="/terms"
            >
              {t("marketing.footer.termsOfService")}
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              to="/privacy"
            >
              {t("marketing.footer.privacyPolicy")}
            </Link>
          </nav>
          <LocaleSwitcher />
        </footer>
      </div>
    );
  },
});
