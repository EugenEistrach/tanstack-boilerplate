import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { db } from '../drizzle/db'
import { env } from './env.server'

const github =
	env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
		? {
				clientId: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
			}
		: undefined

export const authServer = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	socialProviders: {
		github,
	},
	plugins: [admin(), organization()],
})
