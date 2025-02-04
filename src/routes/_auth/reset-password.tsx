import { createFileRoute, redirect } from '@tanstack/react-router'
import { type } from 'arktype'
import { ResetPasswordForm } from '@/features/_shared/user/ui/auth/reset-password-form'

const searchSchema = type({
	'token?': 'string',
})

export const Route = createFileRoute('/_auth/reset-password')({
	validateSearch: searchSchema,
	beforeLoad: ({ context }) => {
		if (!context.auth) {
			return
		}

		throw redirect({
			to: '/dashboard',
		})
	},
	component: ResetPasswordForm,
})
