import { HomeIcon, CubeIcon, UploadIcon } from '@radix-ui/react-icons'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { ChevronsUpDown, LogOut, Settings, UsersIcon } from 'lucide-react'
import { useState } from 'react'
import * as v from 'valibot'
import { AdminOnly } from '@/components/ui/admin-only'
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

import { NavLink } from '@/components/ui/nav-link'
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
import { getOnboardingInfoQueryOptions } from '@/features/onboarding/api/onboarding.api'
import { useAuth, $logout } from '@/lib/client/auth.client'
import * as m from '@/lib/paraglide/messages'
import { getVinxiSession } from '@/lib/server/session.server'

const $getSidebarState = createServerFn({ method: 'GET' }).handler(async () => {
	const session = await getVinxiSession()
	return session.data.sidebarOpen ?? true
})

const $setSidebarState = createServerFn({ method: 'POST' })
	.validator(v.object({ state: v.boolean() }))
	.handler(async ({ data: { state } }) => {
		const session = await getVinxiSession()
		await session.update({ sidebarOpen: state })
	})

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

		if (!context.auth.user.hasAccess) {
			throw redirect({
				to: '/approval-needed',
			})
		}

		const [sidebarOpen, onboardingInfo] = await Promise.all([
			$getSidebarState(),
			context.queryClient.ensureQueryData(getOnboardingInfoQueryOptions()),
		])

		if (!onboardingInfo) {
			throw redirect({
				to: '/onboarding',
				search: { redirectTo: location.pathname },
			})
		}

		return {
			defaultSidebarOpen: sidebarOpen,
		}
	},
	component: DashboardLayout,
})

export default function DashboardLayout() {
	const { defaultSidebarOpen } = Route.useRouteContext()
	const [sidebarOpen, _setSidebarOpen] = useState(defaultSidebarOpen)

	const setSidebarOpen = async (state: boolean) => {
		_setSidebarOpen(state)
		await $setSidebarState({ data: { state } })
	}

	return (
		<SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
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
										{m.dashboard_title()}
									</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>{m.nav_main()}</SidebarGroupLabel>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip={m.nav_dashboard()} asChild>
									<NavLink
										to="/dashboard"
										activeOptions={{
											exact: true,
										}}
									>
										<HomeIcon />
										<span>{m.nav_dashboard()}</span>
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
					<AdminOnly>
						<SidebarGroup>
							<SidebarGroupLabel>{m.nav_admin()}</SidebarGroupLabel>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip={m.nav_users()} asChild>
										<NavLink to="/dashboard/admin/users">
											<UsersIcon />
											<span>{m.nav_users()}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
								<SidebarMenuItem>
									<SidebarMenuButton tooltip={m.nav_uploads()} asChild>
										<NavLink to="/dashboard/admin/uploads">
											<UploadIcon />
											<span>{m.nav_uploads()}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroup>
					</AdminOnly>
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
						{m.footer_copyright({
							year: new Date().getFullYear(),
							companyName: 'Company Name',
						})}
					</p>
					<nav className="mr-4 flex items-center gap-4 sm:ml-auto sm:mr-6 sm:gap-6">
						<Link to="/" className="text-xs underline-offset-4 hover:underline">
							{m.footer_home()}
						</Link>
						<Link
							className="text-xs underline-offset-4 hover:underline"
							to="/terms"
						>
							{m.terms_of_service()}
						</Link>
						<Link
							className="text-xs underline-offset-4 hover:underline"
							to="/privacy"
						>
							{m.privacy_policy()}
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
							data-testid="user-menu-trigger"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={image} alt={name} />
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
									<AvatarImage src={image} alt={name} />
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
									{m.nav_settings()}
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => logout()}>
							<LogOut />
							{m.sign_out()}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
