import Headers from '@mjackson/headers'
import { test as base } from '@playwright/test'
import { setSignedCookie } from 'better-call'
import { eq } from 'drizzle-orm'
import { createUserAndSession, type UserOptions } from './test-utils'
import { db } from '@/drizzle/db'
import { SessionTable, UserTable } from '@/drizzle/schemas/auth-schema'
import { OnboardingInfoTable } from '@/drizzle/schemas/onboarding-schema'

import { env } from '@/lib/server/env.server'

export const test = base.extend<{
	login: (options?: UserOptions) => Promise<typeof UserTable.$inferSelect>
}>({
	login: async ({ page }, use) => {
		let userId: string | undefined = undefined
		// eslint-disable-next-line react-hooks/rules-of-hooks
		await use(async (options?: UserOptions) => {
			const [newUser, newSession] = await createUserAndSession(options)
			userId = newUser.id
			const responseHeaders = new Headers()
			await setSignedCookie(
				responseHeaders,
				'better-auth.session_token',
				newSession.token,
				env.SESSION_SECRET,
				{
					maxAge: 1000 * 60 * 60,
					sameSite: 'lax',
					path: '/',
					httpOnly: true,
				},
			)

			const signedSessionCookie = responseHeaders.setCookie.find(
				(cookie) => cookie.name === 'better-auth.session_token',
			)
			if (!signedSessionCookie) throw new Error('No session cookie found')
			if (signedSessionCookie.value === undefined)
				throw new Error('No session cookie value found')
			if (signedSessionCookie.name === undefined)
				throw new Error('No session cookie domain found')

			const cookie = {
				name: signedSessionCookie.name,
				domain: 'localhost',
				value: signedSessionCookie.value,
				path: signedSessionCookie.path,
				expires: signedSessionCookie.expires?.getTime(),
				httpOnly: signedSessionCookie.httpOnly,
				sameSite: signedSessionCookie.sameSite,
			}

			await page.context().addCookies([cookie])
			await page.goto('http://localhost:3000/')
			await page.waitForLoadState('networkidle')
			return (await db
				.select()
				.from(UserTable)
				.where(eq(UserTable.id, userId))
				.get())!
		})

		if (!userId) return
		try {
			await db.transaction(async (tx) => {
				await tx.delete(SessionTable).where(eq(SessionTable.userId, userId!))

				await tx
					.delete(OnboardingInfoTable)
					.where(eq(OnboardingInfoTable.userId, userId!))

				await tx.delete(UserTable).where(eq(UserTable.id, userId!))
			})
		} catch (error) {
			console.error('Error cleaning up user', error)
		}
	},
})

export const { expect } = test
