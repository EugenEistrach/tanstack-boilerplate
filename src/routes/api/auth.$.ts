import { createAPIFileRoute } from '@tanstack/start/api'
import { authServer } from '@/lib/server/auth.server'

export const APIRoute = createAPIFileRoute('/api/auth/$')({
	GET: async ({ request }) => {
		return authServer.handler(request)
	},
	POST: async ({ request }) => {
		return authServer.handler(request)
	},
})
