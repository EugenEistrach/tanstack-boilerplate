export * from '@/app/auth/auth-tables'

import { text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { cuid } from '../lib/utils'
import { dateTableFields } from './fields'
import { userTable } from '@/app/auth/auth-tables'

export const note = sqliteTable('note', {
	id: text('id')
		.primaryKey()
		.$default(() => cuid()),
	content: text('content').notNull(),
	ownerId: text('owner_id')
		.references(() => userTable.id)
		.notNull(),
	...dateTableFields,
})
