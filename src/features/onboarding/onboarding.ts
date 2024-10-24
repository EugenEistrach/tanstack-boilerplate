import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

import { eq } from 'drizzle-orm'
import { getWebRequest } from 'vinxi/http'
import { z } from 'zod'
import { db } from '@/drizzle/db'
import { OnboardingInfoTable, UserTable } from '@/drizzle/schemas'
import { $requireAuthSession } from '@/lib/auth.client'
import { env } from '@/lib/env'
import { validationClient } from '@/lib/functions'

export const $getOnboardingInfo = createServerFn('GET', async () => {
	const auth = await $requireAuthSession()

	const onboardingInfo = db
		.select()
		.from(OnboardingInfoTable)
		.where(eq(OnboardingInfoTable.userId, auth.user.id))
		.get()

	if (!onboardingInfo) {
		return null
	}

	return onboardingInfo
})

export const $requireOnboardingInfo = createServerFn('GET', async () => {
	const onboardingInfo = await $getOnboardingInfo()
	const request = getWebRequest()

	if (!onboardingInfo) {
		throw redirect({
			to: '/onboarding',
			search: { redirectTo: new URL(request.url).pathname },
		})
	}
	return onboardingInfo
})

export const $completeOnboarding = createServerFn(
	'POST',

	validationClient
		.input(
			z.object({
				name: z.string().min(1, {
					message: 'Name is required.',
				}),
				favoriteColor: z.string().min(1, {
					message: 'Favorite color is required.',
				}),
				redirectTo: z.string().optional(),
			}),
		)
		.handler(async ({ parsedInput: { name, favoriteColor, redirectTo } }) => {
			const { user } = await $requireAuthSession()

			await db.transaction(async (tx) => {
				await tx
					.update(UserTable)
					.set({
						name,
						role: env.ADMIN_USER_EMAILS.includes(user.email) ? 'admin' : 'user',
					})
					.where(eq(UserTable.id, user.id))

				await tx.insert(OnboardingInfoTable).values({
					userId: user.id,
					favoriteColor,
				})
			})

			throw redirect({
				to: redirectTo || '/dashboard',
			})
		}),
)
