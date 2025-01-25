import { type FileStorage } from '@mjackson/file-storage'
import { eq } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import { FileTable } from '@/drizzle/schemas/files-schema'
import { cuid } from '@/lib/shared/utils'

export class SQLiteFileStorage implements FileStorage {
	private userId: string

	constructor(userId: string) {
		this.userId = userId
	}

	async has(key: string): Promise<boolean> {
		const file = await db
			.select({ id: FileTable.id })
			.from(FileTable)
			.where(eq(FileTable.id, key))
			.get()

		return file !== undefined
	}

	async set(key: string, file: File): Promise<void> {
		const buffer = Buffer.from(await file.arrayBuffer())

		await db
			.insert(FileTable)
			.values({
				id: key,
				name: file.name,
				contentType: file.type,
				size: file.size,
				content: buffer,
				userId: this.userId,
			})
			.onConflictDoUpdate({
				target: FileTable.id,
				set: {
					name: file.name,
					contentType: file.type,
					size: file.size,
					content: buffer,
					userId: this.userId,
				},
			})
			.run()
	}

	async get(key: string): Promise<File | null> {
		const result = await db
			.select()
			.from(FileTable)
			.where(eq(FileTable.id, key))
			.get()

		if (!result) return null

		return new File([result.content], result.name, {
			type: result.contentType,
			lastModified: new Date(result.updatedAt).getTime(),
		})
	}

	async remove(key: string): Promise<void> {
		const result = await db
			.delete(FileTable)
			.where(eq(FileTable.id, key))
			.returning()
			.get()

		if (!result) {
			throw new Error('File not found')
		}
	}

	generateKey(): string {
		return cuid()
	}
}
