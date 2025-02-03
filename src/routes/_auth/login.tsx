import { createFileRoute, redirect } from '@tanstack/react-router'
import { type } from 'arktype'
import { LoginForm } from '@/features/_shared/user/ui/login-form'

const searchSchema = type({
	'redirectTo?': 'string',
})

export const Route = createFileRoute('/_auth/login')({
	validateSearch: searchSchema,

	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: LoginForm,
})
