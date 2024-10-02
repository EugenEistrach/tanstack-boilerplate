import { LocaleSwitcher } from "@/app/components/ui/locale-switcher";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import {
  HomeIcon,
  CubeIcon,
  GearIcon,
  BackpackIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";

export const Route = createFileRoute("/dashboard/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: location.pathname,
        },
      });
    }

    const name = context.user.name;

    if (!context.user.roles.includes("user") || !name) {
      throw redirect({
        to: "/onboarding",
        search: { redirectTo: location.pathname },
      });
    }

    return {
      user: {
        ...context.user,
        name,
      },
    };
  },
  component: DashboardLayout,
});

const links = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: HomeIcon,
    exact: true,
  },
  {
    path: "/dashboard/notes",
    label: "Notes",
    icon: ReaderIcon,
    exact: false,
  },
] as const;

function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            to="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <CubeIcon className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Tanstack Boilerplate</span>
          </Link>

          {links.map((link) => (
            <Tooltip key={link.path}>
              <TooltipTrigger asChild>
                <Link
                  to={link.path}
                  activeOptions={{ exact: link.exact }}
                  activeProps={{
                    className:
                      "bg-accent text-accent-foreground transition-colors hover:text-foreground",
                  }}
                  inactiveProps={{
                    className: "text-muted-foreground  hover:text-foreground",
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg  transition-colors md:h-8 md:w-8"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard/settings"
                activeProps={{
                  className:
                    "bg-accent text-accent-foreground transition-colors hover:text-foreground",
                }}
                inactiveProps={{
                  className: "text-muted-foreground  hover:text-foreground",
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg  transition-colors md:h-8 md:w-8"
              >
                <GearIcon className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex min-h-screen h-full flex-col gap-4 sm:gap-6 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6 py-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <CubeIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-bas"
                >
                  <CubeIcon className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Tanstack Boilerplate</span>
                </Link>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    activeOptions={{ exact: link.exact }}
                    activeProps={{
                      className: "text-foreground",
                    }}
                    inactiveProps={{
                      className: "text-muted-foreground  hover:text-foreground",
                    }}
                    className="flex items-center gap-4 px-2.5 text-foreground  transition-colors"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/dashboard/settings"
                  activeProps={{
                    className: "text-foreground",
                  }}
                  inactiveProps={{
                    className: "text-muted-foreground  hover:text-foreground",
                  }}
                  className="flex items-center gap-4 px-2.5 text-foreground  transition-colors"
                >
                  <GearIcon className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <ThemeToggle className="ml-auto" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                {/* Add user avatar here */}T
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="h-full min-h-full flex-1 px-4 sm:px-6">
          <Outlet />
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tanstack Boilerplate. All rights
            reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center  mr-4 sm:mr-6">
            <Link to="/" className="text-xs hover:underline underline-offset-4">
              Landing Page
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              to="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              to="/privacy"
            >
              Privacy Policy
            </Link>
          </nav>
          <LocaleSwitcher />
        </footer>
      </div>
    </div>
  );
}
