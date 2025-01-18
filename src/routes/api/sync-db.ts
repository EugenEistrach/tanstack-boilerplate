import { createAPIFileRoute } from '@tanstack/start/api'
import { env } from '@/lib/server/env.server'
import { syncEmbeddedDb } from '@/lib/server/turso.server'

export const APIRoute = createAPIFileRoute('/api/sync-db')({
	POST: async ({ request }) => {
		await requireApiKey(request)
		await syncEmbeddedDb()
		return new Response('Database synced', { status: 200 })
	},
})

async function requireApiKey(request: Request) {
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
