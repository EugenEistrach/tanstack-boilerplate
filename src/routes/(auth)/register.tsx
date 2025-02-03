import { createFileRoute, redirect } from '@tanstack/react-router'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { RegisterForm } from '@/features/_shared/user/ui/register-form'

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
				<RegisterForm />
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
