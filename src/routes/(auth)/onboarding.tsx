import { createFileRoute, redirect } from '@tanstack/react-router'
import { type } from 'arktype'

import { OnboardingForm } from '@/features/_shared/user/ui/onboarding-form.fullstack'

const searchSchema = type({
	'redirectTo?': 'string',
})

export const Route = createFileRoute('/(auth)/onboarding')({
	validateSearch: searchSchema,
	beforeLoad: async ({ context, search }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: search.redirectTo,
				},
			})
		}

		if (!context.auth.user.hasAccess) {
			throw redirect({
				to: '/approval-needed',
			})
		}

		if (context.auth.user.onboardingInfo) {
			throw redirect({
				to: search.redirectTo || '/dashboard',
			})
		}
	},
	component: OnboardingPage,
})

function OnboardingPage() {
	const { redirectTo } = Route.useSearch()
	return <OnboardingForm redirectTo={redirectTo} />
}
