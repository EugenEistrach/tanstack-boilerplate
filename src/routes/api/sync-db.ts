import { createAPIFileRoute } from '@tanstack/start/api'
import { syncEmbeddedDb } from '@/drizzle/turso'
import { requireApiKey } from '@/features/_shared/user/domain/auth.server'

export const APIRoute = createAPIFileRoute('/api/sync-db')({
	POST: async ({ request }) => {
		await requireApiKey(request)
		await syncEmbeddedDb()
		return new Response('Database synced', { status: 200 })
	},
})
