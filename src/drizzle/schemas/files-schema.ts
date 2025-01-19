import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { UserTable } from './auth-schema'
import { dateTableFields, textId } from '@/drizzle/table-fields'

export const FileTable = sqliteTable('files', {
	id: textId(),
	name: text('name').notNull(),
	contentType: text('content_type').notNull(),
	size: integer('size').notNull(),
	content: blob('content', { mode: 'buffer' }).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => UserTable.id),
	...dateTableFields,
})

export type File = typeof FileTable.$inferSelect
