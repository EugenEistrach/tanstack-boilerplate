import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getCookie, setCookie } from 'vinxi/http'
import { type Permission, type Role } from './auth-permissions'
import { lucia } from '.'

export const getAuthSession = createServerFn('GET', async () => {
	const sessionId = getCookie('auth_session')

	if (!sessionId) {
		return { session: null, user: null }
	}

	const { session, user } = await lucia.validateSession(sessionId)

	if (session?.fresh) {
		const newCookie = lucia.createSessionCookie(session.id)
		setCookie(newCookie.name, newCookie.value, newCookie.attributes)
	}

	return { session, user }
})

export const requireInitialAuthSession = createServerFn('GET', async () => {
	const { user, session } = await getAuthSession()
	if (!user || !session) throw redirect({ to: '/login' })
	return { user, session }
})

export const requireAuthSession = createServerFn('GET', async () => {
	const { user, session } = await getAuthSession()
	if (!user || !session) throw redirect({ to: '/login' })
	if (!user.roles.includes('user')) throw redirect({ to: '/onboarding' })
	return { user, session }
})

export const requireUserWithRole = createServerFn('GET', async (role: Role) => {
	const { user } = await requireAuthSession()

	if (!user.roles.includes(role))
		throw new Error('User does not have the required role')
	return user
})

export const requireUserWithPermission = createServerFn(
	'GET',
	async (permission: Permission) => {
		const { user } = await requireAuthSession()

		if (!user.permissions.includes(permission))
			throw new Error('User does not have the required permission')
		return user
	},
)

export const destroyAuthSession = createServerFn('POST', async () => {
	const sessionId = getCookie('auth_session')
	if (sessionId) {
		await lucia.invalidateSession(sessionId)
	}
	throw redirect({
		statusCode: 302,
		to: '/',
	})
})
