import { redirect, useRouteContext, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { createAuthClient } from 'better-auth/client'
import { adminClient, organizationClient } from 'better-auth/client/plugins'
import { getWebRequest } from 'vinxi/http'
import { authServer, requireAuthSession } from '@/lib/server/auth.server'

import { getVinxiSession } from '@/lib/server/session.server'

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
	const { auth } = useRouteContext({ from: '__root__' })
	return auth
}

export const $getSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		try {
			const request = getWebRequest()

			const session = await authServer.api.getSession({
				headers: request.headers,
			})
			return session
		} catch (error) {
			console.error(error)
			return null
		}
	},
)

export const $getVinxiSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const session = await getVinxiSession()
		return session.data
	},
)

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
	await authServer.api.signOut({ headers: request.headers })
	throw redirect({ to: '/login' })
})
