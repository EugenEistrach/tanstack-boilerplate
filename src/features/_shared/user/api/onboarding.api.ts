import { useMutation } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { type } from 'arktype'
import { requireAuthSession } from '@/features/_shared/user/domain/auth.server'
import { completeOnboarding } from '@/features/_shared/user/domain/onboarding.server'

export const useCompleteOnboardingMutation = () => {
	return useMutation({
		mutationFn: useServerFn($completeOnboarding),
	})
}

const $completeOnboarding = createServerFn({ method: 'POST' })
	.validator(
		type({
			name: 'string >= 1',
			favoriteColor: 'string >= 1',
			'redirectTo?': 'string',
		}),
	)
	.handler(async ({ data: { name, favoriteColor, redirectTo } }) => {
		const { user } = await requireAuthSession()

		await completeOnboarding({
			userId: user.id,
			name,
			favoriteColor,
		})

		throw redirect({
			to: redirectTo || '/dashboard',
		})
	})
