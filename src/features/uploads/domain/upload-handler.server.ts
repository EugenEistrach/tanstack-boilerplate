import { parseFormData, type FileUpload } from '@mjackson/form-data-parser'
import { SQLiteFileStorage } from './file-storage.server'
import { type authServer } from '@/lib/server/auth.server'

type Auth = Awaited<ReturnType<typeof authServer.api.getSession>>

export async function handleFileUpload(
	request: Request,
	auth: NonNullable<Auth>,
) {
	const storage = new SQLiteFileStorage(auth.user.id)

	try {
		let key: string | undefined

		await parseFormData(request, async (fileUpload: FileUpload) => {
			if (fileUpload.fieldName !== 'file') {
				return undefined
			}

			key = storage.generateKey()
			const file = new File([await fileUpload.arrayBuffer()], fileUpload.name, {
				type: fileUpload.type,
				lastModified: Date.now(),
			})

			await storage.set(key, file)
			return file
		})

		if (!key) {
			throw new Error('No file uploaded')
		}

		return key
	} catch (error) {
		console.error('Upload error:', error)
		throw error
	}
}
