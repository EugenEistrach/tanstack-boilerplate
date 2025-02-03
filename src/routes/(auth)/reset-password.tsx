import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { DatabaseZap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ResetPasswordForm } from '@/features/_shared/user/ui/reset-password-form'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/(auth)/reset-password')({
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: ResetPassword,
})

function ResetPassword() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
				<Card className="w-full max-w-md">
					<CardHeader>
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<DatabaseZap />
						</div>
						<CardTitle className="text-center text-2xl font-bold">
							{m.reset_password_title()}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-sm text-muted-foreground">
							{m.reset_password_subtitle()}
						</p>
						<ResetPasswordForm />
						<div className="text-center text-sm">
							<Link
								to="/login"
								className="font-medium text-primary hover:underline"
							>
								{m.reset_password_back()}
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
