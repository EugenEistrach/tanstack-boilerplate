import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { db } from '../drizzle/db'
import { serverEnv } from './env.server'

const github =
	serverEnv.GITHUB_CLIENT_ID && serverEnv.GITHUB_CLIENT_SECRET
		? {
				clientId: serverEnv.GITHUB_CLIENT_ID,
				clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
			}
		: undefined

export const authServer = betterAuth({
	baseURL: serverEnv.PUBLIC_AUTH_URL,
	secret: serverEnv.SESSION_SECRET,
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	socialProviders: {
		github,
	},
	plugins: [admin(), organization()],
})
