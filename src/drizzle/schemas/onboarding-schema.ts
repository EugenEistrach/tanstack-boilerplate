import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { UserTable } from '@/drizzle/schemas/auth-schema'
import { dateTableFields, textId } from '@/drizzle/table-fields'

export const OnboardingInfoTable = sqliteTable('user_onboarding_info', (t) => ({
	id: textId(),
	userId: t.text().references(() => UserTable.id),

	// example
	favoriteColor: t.text(),

	...dateTableFields,
}))
