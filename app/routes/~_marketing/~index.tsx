import { useOptionalAuth } from "@/app/auth/auth-hooks";
import { Button } from "@/app/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { CheckIcon } from "@radix-ui/react-icons";
import { useTranslations } from "use-intl";

export const Route = createFileRoute("/_marketing/")({
  component: LandingPage,
});

function LandingPage() {
  const { user } = useOptionalAuth();
  const t = useTranslations();

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {t("marketing.hero.title")}
              </h1>
              <p className="mx-auto max-w-[700px] md:text-xl text-muted-foreground">
                {t("marketing.hero.description")}
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link to={user ? "/dashboard" : "/login"}>
                  {user
                    ? t("marketing.nav.goToApp")
                    : t("marketing.nav.getStarted")}
                </Link>
              </Button>
              <Button variant="outline">{t("marketing.hero.learnMore")}</Button>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 bg-secondary text-secondary-foreground"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            {t("marketing.features.title")}
          </h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("marketing.features.items.tanstack.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("marketing.features.items.tanstack.description")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("marketing.features.items.ui.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("marketing.features.items.ui.description")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("marketing.features.items.auth.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("marketing.features.items.auth.description")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("marketing.features.items.database.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("marketing.features.items.database.description")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("marketing.features.items.email.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("marketing.features.items.email.description")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("marketing.features.items.background.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("marketing.features.items.background.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            {t("marketing.pricing.title")}
          </h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>
                  {t("marketing.pricing.plans.starter.title")}
                </CardTitle>
                <CardDescription>
                  {t("marketing.pricing.plans.starter.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-4xl font-bold">
                  {t("marketing.pricing.plans.starter.price")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("marketing.pricing.perMonth")}
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature1")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature2")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature3")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature4")}
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {t("marketing.pricing.choosePlan")}
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>{t("marketing.pricing.plans.pro.title")}</CardTitle>
                <CardDescription>
                  {t("marketing.pricing.plans.pro.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-4xl font-bold">
                  {t("marketing.pricing.plans.pro.price")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("marketing.pricing.perMonth")}
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature1")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature2")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature3")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature4")}
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {t("marketing.pricing.choosePlan")}
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>
                  {t("marketing.pricing.plans.enterprise.title")}
                </CardTitle>
                <CardDescription>
                  {t("marketing.pricing.plans.enterprise.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-4xl font-bold">
                  {t("marketing.pricing.plans.enterprise.price")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("marketing.pricing.perMonth")}
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature1")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature2")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature3")}
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                    {t("marketing.pricing.feature4")}
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {t("marketing.pricing.choosePlan")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary text-secondary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {t("marketing.cta.title")}
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t("marketing.cta.description")}
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link to={user ? "/dashboard" : "/login"}>
                  {user
                    ? t("marketing.cta.buttonLoggedIn")
                    : t("marketing.cta.button")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
