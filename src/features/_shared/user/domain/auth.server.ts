import { redirect } from '@tanstack/react-router'
import { getWebRequest } from '@tanstack/start/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'
import { OnboardingInfoTable } from '@/drizzle/schemas/onboarding-schema'
import { sendEmail } from '@/email/email.server'
import { createForgotPasswordEmail } from '@/email/templates/forgot-password'
import * as m from '@/lib/paraglide/messages'
import { env } from '@/lib/server/env.server'
import { applyLanguage } from '@/lib/server/i18n.server'

export type OnboardingInfo = typeof OnboardingInfoTable.$inferSelect

const github =
	env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
		? {
				clientId: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
			}
		: undefined

export const authServer = betterAuth({
	baseURL: env.APPLICATION_URL,
	secret: env.SESSION_SECRET,
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	emailAndPassword: {
		enabled: true,
		maxPasswordLength: 128,
		sendResetPassword: async ({ user, url }, request) => {
			// seems the server handler does not scope the language properly for better auth. So we have to just do it again here for the emails to be localized
			applyLanguage(request)

			await sendEmail({
				to: user.email,
				subject: m.email_forgot_password_subject(),
				react: createForgotPasswordEmail({
					resetLink: url,
					userEmail: user.email,
				}),
			})
		},
	},
	socialProviders: {
		...(github && { github }),
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

export async function isEmailAvailable(email: string) {
	const user = await db.query.user.findFirst({
		where: eq(UserTable.email, email),
	})
	return !user
}

export async function getOnboardingInfo(userId: string) {
	return (
		(await db
			.select()
			.from(OnboardingInfoTable)
			.where(eq(OnboardingInfoTable.userId, userId))
			.get()) || null
	)
}

export function completeOnboarding({
	userId,
	favoriteColor,
	name,
}: {
	userId: string
	favoriteColor: string
	name: string
}) {
	return db.transaction(async (tx) => {
		const user = await tx
			.select({
				email: UserTable.email,
			})
			.from(UserTable)
			.where(eq(UserTable.id, userId))
			.get()

		if (!user) {
			throw new Error('User not found')
		}

		await tx
			.update(UserTable)
			.set({
				name,
				role: env.ADMIN_USER_EMAILS?.includes(user?.email ?? '')
					? 'admin'
					: 'user',
			})
			.where(eq(UserTable.id, userId))
			.run()

		await tx
			.insert(OnboardingInfoTable)
			.values({
				userId,
				favoriteColor,
			})
			.run()
	})
}
