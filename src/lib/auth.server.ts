import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { db } from '../drizzle/db'
import { env } from './env'

const github =
	env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
		? {
				clientId: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
			}
		: undefined

console.log('server env', env)

export const authServer = betterAuth({
	baseURL: env.VITE_AUTH_URL,
	secret: env.SESSION_SECRET,
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	socialProviders: {
		github,
	},
	plugins: [admin(), organization()],
})
