import { HomeIcon, CubeIcon, GearIcon } from '@radix-ui/react-icons'
import {
	createFileRoute,
	Link,
	linkOptions,
	Outlet,
	redirect,
} from '@tanstack/react-router'
import { useTranslations } from 'use-intl'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserMenu } from '@/components/ui/user-menu'
import { tk } from '@/lib/i18n'

export const Route = createFileRoute('/dashboard')({
	beforeLoad: ({ context, location }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: location.pathname,
				},
			})
		}

		return {
			breadcrumb: 'Dashboard',
		}
	},
	component: DashboardLayout,
})

export const dashboardLinkOption = linkOptions({
	to: '/dashboard',
	labelKey: tk('dashboard.nav.dashboard'),
	icon: HomeIcon,
	exact: true,
})

export const dashboardLinkOptions = [dashboardLinkOption]

function DashboardLayout() {
	const t = useTranslations()

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
				<nav className="flex flex-col items-center gap-4 px-2">
					<div className="flex items-center justify-center border-b border-border py-6">
						<Link
							to="/dashboard"
							className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
						>
							<CubeIcon className="h-4 w-4 transition-all group-hover:scale-110" />
							<span className="sr-only">{t('dashboard.appName')}</span>
						</Link>
					</div>

					{dashboardLinkOptions.map((link) => (
						<Tooltip key={link.to}>
							<TooltipTrigger asChild>
								<Link
									{...link}
									activeOptions={{ exact: link.exact }}
									activeProps={{
										className:
											'bg-accent text-accent-foreground transition-colors hover:text-foreground',
									}}
									inactiveProps={{
										className: 'text-muted-foreground  hover:text-foreground',
									}}
									className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
								>
									<link.icon className="h-5 w-5" />
									<span className="sr-only">{t(link.labelKey)}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">{t(link.labelKey)}</TooltipContent>
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
										'bg-accent text-accent-foreground transition-colors hover:text-foreground',
								}}
								inactiveProps={{
									className: 'text-muted-foreground  hover:text-foreground',
								}}
								className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
							>
								<GearIcon className="h-5 w-5" />
								<span className="sr-only">{t('dashboard.nav.settings')}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">
							{t('dashboard.nav.settings')}
						</TooltipContent>
					</Tooltip>
				</nav>
			</aside>
			<div className="flex h-full min-h-screen flex-col gap-4 sm:gap-6 sm:pl-14">
				<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-6 sm:static sm:h-auto sm:bg-transparent sm:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button size="icon" variant="outline" className="sm:hidden">
								<CubeIcon className="h-5 w-5" />
								<span className="sr-only">
									{t('dashboard.menu.toggleMenu')}
								</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="sm:max-w-xs">
							<nav className="grid gap-6 text-lg font-medium">
								<Link
									to="/dashboard"
									className="md:text-bas group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground"
								>
									<CubeIcon className="h-5 w-5 transition-all group-hover:scale-110" />
									<span className="sr-only">{t('dashboard.appName')}</span>
								</Link>
								{dashboardLinkOptions.map((link) => (
									<Link
										key={link.to}
										{...link}
										activeOptions={{ exact: link.exact }}
										activeProps={{
											className: 'text-foreground',
										}}
										inactiveProps={{
											className: 'text-muted-foreground  hover:text-foreground',
										}}
										className="flex items-center gap-4 px-2.5 text-foreground transition-colors"
									>
										<link.icon className="h-5 w-5" />
										{t(link.labelKey)}
									</Link>
								))}
								<Link
									to="/dashboard/settings"
									activeProps={{
										className: 'text-foreground',
									}}
									inactiveProps={{
										className: 'text-muted-foreground  hover:text-foreground',
									}}
									className="flex items-center gap-4 px-2.5 text-foreground transition-colors"
								>
									<GearIcon className="h-5 w-5" />
									{t('dashboard.nav.settings')}
								</Link>
							</nav>
						</SheetContent>
					</Sheet>

					<div className="hidden sm:block">
						<Breadcrumbs />
					</div>

					<ThemeToggle className="ml-auto" />
					<UserMenu />
				</header>
				<main className="h-full min-h-full flex-1 px-4 sm:px-6">
					<div className="block pb-4 sm:hidden">
						<Breadcrumbs />
					</div>
					<Outlet />
				</main>
				<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
					<p className="text-xs text-muted-foreground">
						{t('marketing.footer.copyright', {
							year: new Date().getFullYear(),
						})}
					</p>
					<nav className="mr-4 flex items-center gap-4 sm:ml-auto sm:mr-6 sm:gap-6">
						<Link to="/" className="text-xs underline-offset-4 hover:underline">
							{t('marketing.footer.home')}
						</Link>
						<Link
							className="text-xs underline-offset-4 hover:underline"
							to="/terms"
						>
							{t('marketing.footer.termsOfService')}
						</Link>
						<Link
							className="text-xs underline-offset-4 hover:underline"
							to="/privacy"
						>
							{t('marketing.footer.privacyPolicy')}
						</Link>
					</nav>
					<LocaleSwitcher />
				</footer>
			</div>
		</div>
	)
}
