import { redirect } from '@tanstack/react-router'
import { getWebRequest } from '@tanstack/start/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { db } from '@/drizzle/db'
import { env } from '@/lib/server/env.server'

const github =
	env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
		? {
				clientId: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
			}
		: undefined

const discord =
	env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET
		? {
				clientId: env.DISCORD_CLIENT_ID,
				clientSecret: env.DISCORD_CLIENT_SECRET,
			}
		: undefined

export const authServer = betterAuth({
	baseURL: env.APPLICATION_URL,
	secret: env.SESSION_SECRET,
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	socialProviders: {
		...(github && { github }),
		...(discord && { discord }),
	},
	plugins: [admin(), organization()],
	user: {
		additionalFields: {
			hasAccess: {
				type: 'boolean',
				default: false,
			},
		},
	},
})

export const requireAuthSession = async (server = authServer) => {
	const request = getWebRequest()

	if (!request) {
		throw new Error('Request not found')
	}

	const auth = await server.api.getSession({ headers: request.headers })

	const redirectToPath = new URL(request.url).pathname

	if (!auth) {
		throw redirect({
			to: '/login',
			search: {
				redirectTo: redirectToPath,
			},
		})
	}

	return auth
}

export async function requireApiKey(request: Request) {
	if (!env.API_KEY) {
		throw new Error('API key not set')
	}

	const apiKey = request.headers.get('Authorization')

	if (!apiKey) {
		throw new Error('Unauthorized')
	}

	if (apiKey !== env.API_KEY) {
		throw new Error('Unauthorized')
	}
}

export const requireAuthSessionApi = async (server = authServer) => {
	const request = getWebRequest()

	if (!request) {
		throw new Error('Request not found')
	}

	const auth = await server.api.getSession({ headers: request.headers })

	if (!auth) {
		throw new Response('Unauthorized', { status: 401 })
	}

	return auth
}
