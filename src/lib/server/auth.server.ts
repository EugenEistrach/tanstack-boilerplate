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
	baseURL: env.BASE_URL,
	secret: env.SESSION_SECRET,
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	socialProviders: {
		...(github && { github }),
		...(discord && { discord }),
	},
	plugins: [admin(), organization()],
})
