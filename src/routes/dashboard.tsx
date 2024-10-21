import { HomeIcon, CubeIcon } from '@radix-ui/react-icons'
import {
	createFileRoute,
	Link,
	linkOptions,
	Outlet,
	redirect,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'
import { useTranslations } from 'use-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'

import { Separator } from '@/components/ui/separator'
import {
	Sidebar,
	SidebarProvider,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarFooter,
	SidebarRail,
	SidebarInset,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { $requireOnboardingInfo } from '@/features/onboarding/onboarding'
import { useAuth, $logout } from '@/lib/auth.client'
import { tk } from '@/lib/i18n'

export const Route = createFileRoute('/dashboard')({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: location.pathname,
				},
			})
		}

		const onboardingInfo = await $requireOnboardingInfo()
		return {
			onboardingInfo,
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

export const mainLinkOptions = [dashboardLinkOption]

export default function DashboardLayout() {
	const t = useTranslations()
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<CubeIcon className="size-4 transition-all group-hover:scale-110" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{t('dashboard.appName')}
									</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>{t('dashboard.nav.main')}</SidebarGroupLabel>
						<SidebarMenu>
							{mainLinkOptions.map((item) => (
								<SidebarMenuItem key={item.to}>
									<SidebarMenuButton tooltip={t(item.labelKey)} asChild>
										<Link to={item.to} activeOptions={{ exact: item.exact }}>
											{item.icon && <item.icon />}
											<span>{t(item.labelKey)}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<UserMenu />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumbs />
					</div>
				</header>
				<main className="flex flex-1 flex-col p-4 sm:p-6">
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
					<ThemeToggle />
					<LocaleSwitcher />
				</footer>
			</SidebarInset>
		</SidebarProvider>
	)
}

function UserMenu() {
	const t = useTranslations()
	const { isMobile } = useSidebar()
	const { user } = useAuth()

	const name = user.name || user.email.split('@')[0] || ''
	const email = user.email
	const image = user.image ?? ''

	const shortName = name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()

	const logout = useServerFn($logout)
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={image} alt={t('user.avatarAlt')} />
								<AvatarFallback className="rounded-lg">
									{shortName}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{name}</span>
								<span className="truncate text-xs">{email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={image} alt={t('user.avatarAlt')} />
									<AvatarFallback className="rounded-lg">
										{shortName}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{name}</span>
									<span className="truncate text-xs">{email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link to="/dashboard/settings">
									<Settings />
									{t('user.settings')}
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => logout()}>
							<LogOut />
							{t('user.signOut')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
