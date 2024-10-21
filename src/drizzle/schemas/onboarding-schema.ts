import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { UserTable } from './auth-schema'

export const UserOnboardingInfo = sqliteTable('user_onboarding_info', (t) => ({
	id: t.integer().primaryKey(),
	userId: t.integer().references(() => UserTable.id),
}))
