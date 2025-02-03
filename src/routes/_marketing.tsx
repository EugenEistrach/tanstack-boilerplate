import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { Box, CircleCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'

import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/_marketing')({
	component: MarketingPage,
})

function MarketingPage() {
	const user = null

	return (
		<div className="flex min-h-screen flex-col">
			<Alert className="rounded-none border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900">
				<CircleCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
				<AlertTitle className="text-blue-800 dark:text-blue-200">
					{m.great_warm_lizard_soar()}
				</AlertTitle>
				<AlertDescription className="text-blue-700 dark:text-blue-300">
					{m.chunky_quaint_gazelle_boost()}
				</AlertDescription>
			</Alert>
			<header className="flex h-14 items-center px-4 lg:px-6">
				<Link className="flex items-center justify-center" to="/">
					<span className="sr-only">{m.bald_topical_skate_scold()}</span>
					<Box className="h-6 w-6" />
				</Link>
				<nav className="ml-auto flex items-center gap-4 sm:gap-6">
					<a
						className="text-sm font-medium underline-offset-4 hover:underline"
						href="#features"
					>
						{m.left_true_buzzard_dream()}
					</a>
					<a
						className="text-sm font-medium underline-offset-4 hover:underline"
						href="#pricing"
					>
						{m.dizzy_many_liger_lock()}
					</a>
					<ThemeToggle />
					<Button asChild>
						<Link to={user ? '/dashboard' : '/login'}>
							{user ? m.proud_cool_gopher_amaze() : m.smart_plane_florian_startle()}
						</Link>
					</Button>
				</nav>
			</header>
			<main className="flex-1">
				<Outlet />
			</main>
			<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
				<p className="text-xs text-muted-foreground">
					{m.these_tiny_oryx_nurture({
						year: new Date().getFullYear(),
						companyName: 'Company Name',
					})}
				</p>
				<nav className="mr-4 flex items-center gap-4 sm:ml-auto sm:mr-6 sm:gap-6">
					<Link
						className="text-xs underline-offset-4 hover:underline"
						to="/terms"
					>
						{m.fresh_sea_marten_flop()}
					</Link>
					<Link
						className="text-xs underline-offset-4 hover:underline"
						to="/privacy"
					>
						{m.lazy_stale_bobcat_flip()}
					</Link>
				</nav>
				<LocaleSwitcher />
			</footer>
		</div>
	)
}
