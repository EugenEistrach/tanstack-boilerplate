import { createFileRoute, redirect } from '@tanstack/react-router'
import { DatabaseZap } from 'lucide-react'
import * as v from 'valibot'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { authClient } from '@/lib/client/auth.client'
import { $setRedirectTo } from '@/lib/client/redirect.client'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/(auth)/login')({
	validateSearch: v.object({
		redirectTo: v.optional(v.string()),
	}),
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
								await $setRedirectTo({
									data: { redirectTo: redirectTo ?? '/dashboard' },
								})
								await authClient.signIn.social({
									provider: 'github',
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
						<Button
							className="w-full"
							variant="secondary"
							onClick={async () => {
								await $setRedirectTo({
									data: { redirectTo: redirectTo ?? '/dashboard' },
								})
								await authClient.signIn.social({ provider: 'discord' })
							}}
						>
							<span className="flex items-center">
								<svg
									className="mr-2 h-4 w-4"
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
									aria-hidden="true"
								>
									<path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
								</svg>
								{m.sign_in_discord()}
							</span>
						</Button>
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
