import { sql } from 'drizzle-orm'
import { text, customType } from 'drizzle-orm/sqlite-core'
import { cuid } from '@/lib/shared/utils'

export const dateString = customType<{
	data: string
	driverData: number
}>({
	dataType() {
		return 'integer'
	},
	toDriver(value: string): number {
		return new Date(value).getTime()
	},
	fromDriver(value: number): string {
		return new Date(value).toISOString()
	},
})

export const dateTableFields = {
	createdAt: dateString()
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: dateString()
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
		.$onUpdate(() => new Date().toISOString()),
}

export const textId = () =>
	text('id')
		.primaryKey()
		.$defaultFn(() => cuid())
