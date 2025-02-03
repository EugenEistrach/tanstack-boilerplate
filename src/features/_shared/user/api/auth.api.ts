import { redirect, useMatch, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

import { getWebRequest } from '@tanstack/start/server'
import { type } from 'arktype'
import { createAuthClient } from 'better-auth/client'
import { adminClient, organizationClient } from 'better-auth/client/plugins'
import {
	authServer,
	getOnboardingInfo,
	isEmailAvailable,
	requireAuthSession,
} from '@/features/_shared/user/domain/auth.server'

import { env } from '@/lib/server/env.server'

export const authClient = createAuthClient({
	plugins: [adminClient(), organizationClient()],
})

export const useAuth = () => {
	const auth = useOptionalAuth()
	const router = useRouter()
	if (!auth) {
		throw redirect({
			to: '/login',
			search: {
				redirectTo: router.state.location.pathname,
			},
		})
	}

	return auth
}

export const useOptionalAuth = () => {
	const { loaderData } = useMatch({ from: '__root__', strict: true })
	return loaderData?.auth
}

export const $getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		try {
			const request = getWebRequest()

			if (!request) {
				throw new Error('Request not found')
			}

			const session = await authServer.api.getSession({
				headers: request.headers,
			})

			if (!session || !session.user) {
				return null
			}

			const hasAccess = env.ENABLE_ADMIN_APPROVAL
				? session.user.role === 'admin' || session.user.hasAccess
				: true

			const onboardingInfo = await getOnboardingInfo(session.user.id)

			return {
				...session,
				user: {
					...session.user,
					hasAccess,
					onboardingInfo,
				},
			}
		} catch (error) {
			console.error(error)
			return null
		}
	},
)

export const $isEmailAvailable = createServerFn({ method: 'GET' })
	.validator(
		type({
			'email?': 'string',
		}),
	)
	.handler(async ({ data }) => {
		return data.email && isEmailAvailable(data.email)
	})

export const $requireAuthSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		return requireAuthSession()
	},
)

export const $requireAdminSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const auth = await requireAuthSession()
		if (auth.user.role !== 'admin') {
			throw new Error('Unauthorized')
		}
		return auth
	},
)

export const $logout = createServerFn({ method: 'POST' }).handler(async () => {
	const request = getWebRequest()

	if (!request) {
		throw new Error('Request not found')
	}

	await authServer.api.signOut({ headers: request.headers })
	throw redirect({ to: '/login' })
})
