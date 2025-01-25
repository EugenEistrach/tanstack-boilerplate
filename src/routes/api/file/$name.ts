import { createAPIFileRoute } from '@tanstack/start/api'
import { eq } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import { FileTable } from '@/drizzle/schemas/files-schema'

export const APIRoute = createAPIFileRoute('/api/file/$name')({
	GET: async ({ request }) => {
		const url = new URL(request.url)
		const fileId = url.searchParams.get('id')

		if (!fileId) {
			return new Response('File ID is required', {
				status: 400,
				headers: {
					'Content-Type': 'text/plain',
				},
			})
		}

		const file = await db
			.select()
			.from(FileTable)
			.where(eq(FileTable.id, fileId))
			.get()

		if (!file) {
			return new Response('File not found', {
				status: 404,
				headers: {
					'Content-Type': 'text/plain',
				},
			})
		}

		return new Response(file.content, {
			headers: {
				'Content-Type': file.contentType,
			},
		})
	},
})
