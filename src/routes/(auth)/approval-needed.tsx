import { createFileRoute, redirect } from '@tanstack/react-router'
import { ClockIcon, RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/features/_shared/user/api/auth.api'
import * as m from '@/lib/paraglide/messages'

export const Route = createFileRoute('/(auth)/approval-needed')({
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
			})
		}

		if (context.auth.user.hasAccess) {
			throw redirect({
				to: '/dashboard',
			})
		}
	},
	component: ApprovalNeeded,
})

function ApprovalNeeded() {
	const { user } = useAuth()

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
				<Card className="w-full max-w-md">
					<CardHeader>
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
							<ClockIcon className="h-6 w-6 text-yellow-600" />
						</div>
						<CardTitle className="text-center text-2xl font-bold">
							{m.approval_needed_title()}
						</CardTitle>
						<CardDescription className="text-center">
							{m.approval_needed_description()}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-center">
						<p className="text-sm text-muted-foreground">
							{m.approval_needed_message({ name: user.name || user.email })}
						</p>
						<div className="flex justify-center gap-4">
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
							>
								<RefreshCwIcon className="mr-2 h-4 w-4" />
								{m.approval_needed_check_again()}
							</Button>
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
