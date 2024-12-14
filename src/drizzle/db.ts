import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as authSchema from './schemas/auth-schema'
import * as onboardingSchema from './schemas/onboarding-schema'
import { env } from '@/lib/server/env.server'

const schema = {
	user: authSchema.UserTable,
	session: authSchema.SessionTable,
	account: authSchema.AccountTable,
	verification: authSchema.VerificationTable,
	organization: authSchema.OrganizationTable,
	member: authSchema.MemberTable,
	invitation: authSchema.InvitationTable,

	onboardingInfo: onboardingSchema.OnboardingInfoTable,
} as const

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>
let drizzleDb: DrizzleDB | null = null

export const db = new Proxy({} as DrizzleDB, {
	get(_, prop) {
		// if we don't have a db or the db is not open, we need to create it
		if (!drizzleDb || !drizzleDb.$client.open) {
			drizzleDb = drizzle({
				connection: env.DATABASE_URL,
				schema,
			})
			drizzleDb.$client.pragma('journal_mode = WAL')
		}
		return drizzleDb[prop as keyof DrizzleDB]
	},
})
