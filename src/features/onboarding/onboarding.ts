import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

import { eq } from 'drizzle-orm'
import { getWebRequest } from 'vinxi/http'
import { db } from '@/drizzle/db'
import { OnboardingInfoTable } from '@/drizzle/schemas'
import { $requireAuthSession } from '@/lib/auth.client'

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
