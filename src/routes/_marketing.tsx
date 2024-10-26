import { InfoCircledIcon, CubeIcon } from '@radix-ui/react-icons'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useTranslations } from 'use-intl'
import { LocaleSwitcher } from '../components/ui/locale-switcher'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export const Route = createFileRoute('/_marketing')({
	component: MarketingPage,
})

function MarketingPage() {
	const user = null
	const t = useTranslations()

	return (
		<div className="flex min-h-screen flex-col">
			<Alert className="rounded-none border-blue-200 bg-blue-100 dark:border-blue-800 dark:bg-blue-900">
				<InfoCircledIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
				<AlertTitle className="text-blue-800 dark:text-blue-200">
					{t('marketing.alert.title')}
				</AlertTitle>
				<AlertDescription className="text-blue-700 dark:text-blue-300">
					{t('marketing.alert.description')}
				</AlertDescription>
			</Alert>
			<header className="flex h-14 items-center px-4 lg:px-6">
				<Link className="flex items-center justify-center" to="/">
					<span className="sr-only">{t('marketing.hero.title')}</span>
					<CubeIcon className="h-6 w-6" />
				</Link>
				<nav className="ml-auto flex items-center gap-4 sm:gap-6">
					<a
						className="text-sm font-medium underline-offset-4 hover:underline"
						href="#features"
					>
						{t('marketing.features.title')}
					</a>
					<a
						className="text-sm font-medium underline-offset-4 hover:underline"
						href="#pricing"
					>
						{t('marketing.pricing.title')}
					</a>
					<ThemeToggle />
					<Button asChild>
						<Link to={user ? '/dashboard' : '/login'}>
							{user ? t('marketing.goToApp') : t('marketing.getStarted')}
						</Link>
					</Button>
				</nav>
			</header>
			<main className="flex-1">
				<Outlet />
			</main>
			<footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
				<p className="text-xs text-muted-foreground">
					{t('footer.copyright', {
						year: new Date().getFullYear(),
						companyName: 'Company Name',
					})}
				</p>
				<nav className="mr-4 flex items-center gap-4 sm:ml-auto sm:mr-6 sm:gap-6">
					<Link
						className="text-xs underline-offset-4 hover:underline"
						to="/terms"
					>
						{t('footer.termsOfService')}
					</Link>
					<Link
						className="text-xs underline-offset-4 hover:underline"
						to="/privacy"
					>
						{t('footer.privacyPolicy')}
					</Link>
				</nav>
				<LocaleSwitcher />
			</footer>
		</div>
	)
}
