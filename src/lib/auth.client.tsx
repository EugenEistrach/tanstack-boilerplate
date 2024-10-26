import { redirect, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { createAuthClient } from 'better-auth/client'
import { adminClient, organizationClient } from 'better-auth/client/plugins'
import { createContext, useContext } from 'react'
import { getWebRequest } from 'vinxi/http'
import { authServer } from './auth.server'

export const authClient = createAuthClient({
	plugins: [adminClient(), organizationClient()],
})

const AuthContext = createContext<typeof authClient.$Infer.Session | null>(null)

export const AuthProvider = ({
	children,
	auth,
}: {
	children: React.ReactNode
	auth: typeof authClient.$Infer.Session | null
}) => {
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const auth = useContext(AuthContext)
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
	return useContext(AuthContext)
}

export const $getSession = createServerFn('GET', async () => {
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
})

export const $requireAuthSession = createServerFn('GET', async () => {
	const request = getWebRequest()
	const auth = await authServer.api.getSession({ headers: request.headers })

	const redirectToPath = new URL(request.url).pathname

	if (!auth) {
		throw redirect({
			to: '/login',
			search: {
				redirectTo: redirectToPath,
			},
		})
	}

	return {
		session: {
			...auth.session,
			expiresAt: auth.session.expiresAt.toISOString(),
		},
		user: {
			...auth.user,
			createdAt: auth.user.createdAt.toISOString(),
			updatedAt: auth.user.updatedAt.toISOString(),
		},
	}
})

export const $logout = createServerFn('POST', async () => {
	const request = getWebRequest()
	await authServer.api.signOut({ headers: request.headers })
	throw redirect({ to: '/login' })
})
