import { drizzle } from 'drizzle-orm/better-sqlite3'

import { serverEnv } from '../lib/env.server'
import * as authSchema from './schemas/auth-schema'

export const db = drizzle({
	connection: serverEnv.DATABASE_URL,
	schema: {
		user: authSchema.UserTable,
		session: authSchema.SessionTable,
		account: authSchema.AccountTable,
		verification: authSchema.VerificationTable,
		organization: authSchema.OrganizationTable,
		member: authSchema.MemberTable,
		invitation: authSchema.InvitationTable,
	},
})

// Enable Write-Ahead Logging (WAL) mode to allow concurrent reads and writes
db.$client.pragma('journal_mode = WAL')
