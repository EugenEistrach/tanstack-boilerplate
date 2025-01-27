import {
	queryOptions,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import * as v from 'valibot'
import {
	completeOnboarding,
	getOnboardingInfo,
} from '@/features/onboarding/domain/onboarding.server'
import { requireAuthSession } from '@/lib/server/auth.server'

export const getOnboardingInfoQueryOptions = () =>
	queryOptions({
		queryKey: ['onboardingInfo'],
		queryFn: () => $getOnboardingInfo(),
	})

export const useCompleteOnboardingMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: useServerFn($completeOnboarding),
		onSuccess: async () => {
			await queryClient.invalidateQueries(getOnboardingInfoQueryOptions())
		},
	})
}

const $getOnboardingInfo = createServerFn({ method: 'GET' }).handler(
	async () => {
		const { user } = await requireAuthSession()
		return getOnboardingInfo(user.id)
	},
)

const $completeOnboarding = createServerFn({ method: 'POST' })
	.validator(
		v.object({
			name: v.string(),
			favoriteColor: v.string(),
			redirectTo: v.optional(v.string()),
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
