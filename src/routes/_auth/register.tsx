import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterForm } from '@/features/_shared/user/ui/auth/register-form'

export const Route = createFileRoute('/_auth/register')({
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: RegisterForm,
})
