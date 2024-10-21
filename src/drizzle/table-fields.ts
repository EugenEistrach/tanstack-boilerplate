import { text, customType } from 'drizzle-orm/sqlite-core'
import { cuid } from '@/lib/utils'

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
		.$default(() => new Date().toISOString()),
	updatedAt: dateString()
		.notNull()
		.$default(() => new Date().toISOString())
		.$onUpdate(() => new Date().toISOString()),
}

export const textId = () =>
	text('id')
		.primaryKey()
		.$defaultFn(() => cuid())
