import { createAPIFileRoute } from '@tanstack/start/api'
import { authServer } from '@/lib/auth.server'

export const Route = createAPIFileRoute('/api/auth/$')({
	GET: async ({ request }) => {
		return authServer.handler(request)
	},
	POST: async ({ request }) => {
		return authServer.handler(request)
	},
})
