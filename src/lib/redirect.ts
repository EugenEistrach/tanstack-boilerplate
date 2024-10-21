// This is used mostly as a workaround to redirect after a sign in.
// We call the 'handleRedirectTo$' function in our root layout.

import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getVinxiSession } from './session.server'

export const $setRedirectTo = createServerFn(
	'POST',
	async (redirectTo: string) => {
		const session = await getVinxiSession()

		await session.update({
			redirectTo,
		})
	},
)

export const $handleRedirectTo = createServerFn('GET', async () => {
	const session = await getVinxiSession()

	const redirectTo = session.data.redirectTo

	if (redirectTo) {
		await session.update({
			redirectTo: undefined,
		})

		throw redirect({ to: redirectTo })
	}
})
