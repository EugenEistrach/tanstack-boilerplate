// This is used mostly as a workaround to redirect after a sign in.
// We call the 'handleRedirectTo$' function in our root layout.

import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import * as v from 'valibot'

import { getVinxiSession } from '@/lib/server/session.server'

export const $setRedirectTo = createServerFn({ method: 'GET' })
	.validator(
		v.object({
			redirectTo: v.optional(v.string()),
		}),
	)
	.handler(async ({ data: { redirectTo } }) => {
		const session = await getVinxiSession()

		await session.update({
			redirectTo,
		})
	})

export const $handleRedirectTo = createServerFn({ method: 'GET' }).handler(
	async () => {
		const session = await getVinxiSession()

		const redirectTo = session.data.redirectTo

		if (redirectTo) {
			await session.update({
				redirectTo: undefined,
			})

			throw redirect({ to: redirectTo })
		}
	},
)
