import { createFileRoute, redirect } from '@tanstack/react-router'
import * as v from 'valibot'

import {
	$getOnboardingInfo,
	OnboardingForm,
} from '@/features/onboarding/onboarding'

export const Route = createFileRoute('/(auth)/onboarding')({
	validateSearch: v.object({
		redirectTo: v.optional(v.string()),
	}),
	beforeLoad: async ({ context, search }) => {
		if (!context.auth) {
			throw redirect({
				to: '/login',
				search: {
					redirectTo: search.redirectTo,
				},
			})
		}

		const onboardingInfo = await $getOnboardingInfo()

		if (onboardingInfo) {
			throw redirect({
				to: search.redirectTo || '/dashboard',
			})
		}

		return {
			redirectTo: search.redirectTo,
		}
	},
	component: OnboardingPage,
})

function OnboardingPage() {
	const { redirectTo } = Route.useRouteContext()
	return <OnboardingForm redirectTo={redirectTo} />
}
