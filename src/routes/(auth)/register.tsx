import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { DatabaseZap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { RegisterForm } from '@/features/_shared/user/ui/register-form'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/(auth)/register')({
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: Register,
})

function Register() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
				<Card className="w-full max-w-md">
					<CardHeader>
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<DatabaseZap />
						</div>
						<CardTitle className="text-center text-2xl font-bold">
							{m.soft_ago_pelican_hush()}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-sm text-muted-foreground">
							{m.smug_many_capybara_affirm()}
						</p>
						<RegisterForm />
						<div className="text-center text-sm">
							<span className="text-muted-foreground">
								{m.level_every_marten_spark()}{' '}
							</span>
							<Link
								to="/login"
								className="font-medium text-primary hover:underline"
							>
								{m.noble_acidic_niklas_tend()}
							</Link>
						</div>
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
