import { createAPIFileRoute } from '@tanstack/start/api'
import { handleFileUpload } from '@/features/uploads/domain/upload-handler.server'
import { requireAuthSessionApi } from '@/lib/server/auth.server'

export const APIRoute = createAPIFileRoute('/api/upload')({
	POST: async ({ request }) => {
		const auth = await requireAuthSessionApi()
		const fileId = await handleFileUpload(request, auth)

		// FilePond expects a plain text response with the file ID
		return new Response(fileId.toString(), {
			headers: {
				'Content-Type': 'text/plain',
			},
		})
	},
})
