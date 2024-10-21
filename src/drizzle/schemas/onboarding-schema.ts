import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { dateTableFields, textId } from '../table-fields'
import { UserTable } from './auth-schema'

export const OnboardingInfoTable = sqliteTable('user_onboarding_info', (t) => ({
	id: textId(),
	userId: t.text().references(() => UserTable.id),

	// example
	favoriteColor: t.text(),

	...dateTableFields,
}))
