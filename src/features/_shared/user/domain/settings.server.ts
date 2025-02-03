import { eq } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schemas/auth-schema'

export async function updateName(userId: string, name: string) {
	await db.update(UserTable).set({ name }).where(eq(UserTable.id, userId))
}
