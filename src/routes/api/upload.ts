import { createAPIFileRoute } from '@tanstack/start/api'
import {
	handleFileUpload,
	handleFileDelete,
} from '@/features/_shared/uploads/domain/upload-handler.server'
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
	DELETE: async ({ request }) => {
		const auth = await requireAuthSessionApi()
		const fileId = await request.text()

		if (!fileId) {
			return new Response('File ID is required', {
				status: 400,
				headers: {
					'Content-Type': 'text/plain',
				},
			})
		}

		await handleFileDelete(fileId, auth)
		return new Response(null, { status: 204 })
	},
})
