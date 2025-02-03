import { createFileRoute, redirect } from '@tanstack/react-router'
import { type } from 'arktype'
import { DatabaseZap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { authClient } from '@/features/_shared/user/api/auth.api'
import { LoginForm } from '@/features/_shared/user/ui/login-form'
import * as m from '@/lib/paraglide/messages'

const searchSchema = type({
	'redirectTo?': 'string',
})

export const Route = createFileRoute('/(auth)/login')({
	validateSearch: searchSchema,

	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: Login,
})

function Login() {
	const { redirectTo } = Route.useSearch()

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
				<Card className="w-full max-w-md">
					<CardHeader>
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<DatabaseZap />
						</div>
						<CardTitle className="text-center text-2xl font-bold">
							{m.dashboard_title()}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-sm text-muted-foreground">
							{m.login_subtitle()}
						</p>
						<Button
							className="w-full"
							onClick={async () => {
								await authClient.signIn.social({
									provider: 'github',
									callbackURL: redirectTo ?? '/dashboard',
								})
							}}
						>
							<span className="flex items-center">
								<svg
									className="mr-2 h-4 w-4"
									viewBox="0 0 256 250"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									stroke="currentColor"
									preserveAspectRatio="xMidYMid"
									aria-hidden="true"
								>
									<path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
								</svg>
								{m.sign_in_github()}
							</span>
						</Button>
						<LoginForm />
					</CardContent>
				</Card>
			</main>
			<footer className="absolute bottom-0 right-0 p-4">
				<div className="flex items-center gap-2">
					<LocaleSwitcher />
					<ThemeToggle />
				</div>
			</footer>
		</div>
	)
}
