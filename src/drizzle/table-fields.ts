import { integer } from 'drizzle-orm/sqlite-core'

export const dateTableFields = {
	createdAt: integer({ mode: 'timestamp' })
		.notNull()
		.$default(() => new Date()),
	updatedAt: integer({ mode: 'timestamp' })
		.notNull()
		.$default(() => new Date())
		.$onUpdate(() => new Date()),
}
