import { createAPIFileRoute } from '@tanstack/start/api'
import { count } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'
import { logger } from '@/lib/server/logger.server'

export const APIRoute = createAPIFileRoute('/api/healthcheck')({
	GET: async ({ request }) => {
		const host =
			request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

		try {
			// if we can connect to the database and make a simple query
			// and make a HEAD request to ourselves, then we're good.
			const [, healthcheck] = await Promise.all([
				db.select({ count: count() }).from(UserTable),
				fetch(`${new URL(request.url).protocol}${host}`, {
					method: 'HEAD',
					headers: { 'X-Healthcheck': 'true' },
				}),
			])

			if (!healthcheck.ok) {
				return new Response('ERROR', { status: 500 })
			}

			return new Response('OK')
		} catch (err: unknown) {
			logger.error({ operation: 'healthcheck', err }, 'healthcheck ❌')
			return new Response('ERROR', { status: 500 })
		}
	},
})
