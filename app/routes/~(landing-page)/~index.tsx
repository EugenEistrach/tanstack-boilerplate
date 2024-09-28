import { useOptionalAuth } from "@/app/auth/auth-hooks";
import { Button } from "@/app/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { CheckIcon, BoxIcon } from "@radix-ui/react-icons";

export const Route = createFileRoute("/(landing-page)/")({
  component: LandingPage,
});

function LandingPage() {
  const { user } = useOptionalAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <span className="sr-only">SaaS Boilerplate</span>
          <BoxIcon className="h-6 w-6" />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </a>
          <ThemeToggle />
          <Button asChild>
            <Link to={user ? "/dashboard" : "/login"}>
              {user ? "Go to App" : "Get Started"}
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Ultimate SaaS Solution
                </h1>
                <p className="mx-auto max-w-[700px] md:text-xl text-muted-foreground">
                  Streamline your workflow, boost productivity, and scale your
                  business with our powerful SaaS platform.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link to={user ? "/dashboard" : "/login"}>
                    {user ? "Go to App" : "Get Started"}
                  </Link>
                </Button>
                <Button variant="outline">Learn More</Button>
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
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  title: "Authentication",
                  description: "Secure user authentication and authorization.",
                },
                {
                  title: "Database Integration",
                  description: "Seamless integration with popular databases.",
                },
                {
                  title: "API Routes",
                  description:
                    "Easy-to-use API routes for backend functionality.",
                },
                {
                  title: "Responsive Design",
                  description: "Fully responsive design for all devices.",
                },
                {
                  title: "Testing Setup",
                  description: "Comprehensive testing setup for reliable code.",
                },
                {
                  title: "Deployment Ready",
                  description:
                    "Ready for deployment with minimal configuration.",
                },
              ].map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Pricing Plans
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  title: "Starter",
                  price: "$9",
                  description: "For small teams or projects",
                },
                {
                  title: "Pro",
                  price: "$29",
                  description: "For growing businesses",
                },
                {
                  title: "Enterprise",
                  price: "Custom",
                  description: "For large-scale operations",
                },
              ].map((plan) => (
                <Card key={plan.title} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{plan.title}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-4xl font-bold">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                    <ul className="mt-4 space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <li key={i} className="flex items-center">
                          <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                          Feature {i}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Choose Plan</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary text-secondary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of satisfied users and take your business to
                  the next level.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link to={user ? "/dashboard" : "/login"}>
                    {user ? "Go to App" : "Get Started"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SaaS Boilerplate. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
          <a className="text-xs hover:underline underline-offset-4" href="/">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="/">
            Privacy Policy
          </a>
        </nav>
      </footer>
    </div>
  );
}
